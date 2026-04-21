// 🔐 CHECK LOGIN
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

// INIT
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🎤 VOICE
function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(e) {
        let text = e.results[0][0].transcript;
        document.getElementById("userInput").value = text;
        handleInput();
    };
    recognition.start();
}

// 🧠 HANDLE INPUT
async function handleInput() {
    let input = document.getElementById("userInput").value.toLowerCase();

    if (
        input.includes("i kept") ||
        input.includes("i left") ||
        input.includes("i put")
    ) {
        await saveMemory(input);
    } else {
        await searchMemory(input);
    }
}

// 💾 SAVE
async function saveMemory(text) {

    let words = text.split(" ");
    let object = "";
    let location = "";

    for (let i = 0; i < words.length; i++) {
        if (words[i] === "my") object = words[i + 1];
        if (["in","on","at"].includes(words[i])) {
            location = words.slice(i + 1).join(" ");
            break;
        }
    }

    if (!object || !location) {
        showResult("❌ Couldn't understand");
        return;
    }

    await db.collection("users")
        .doc(user.uid)
        .collection("memories")
        .add({
            text,
            object,
            location,
            time: Date.now()
        });

    showResult(`✅ Saved: ${object} in ${location}`);
}

// 🔍 SEARCH
async function searchMemory(query) {

    query = query.replace(/[^\w\s]/gi, "");

    let object = "";

    let words = query.split(" ");
    for (let w of words) {
        if (!["where","is","my"].includes(w)) {
            object = w;
            break;
        }
    }

    const snapshot = await db
        .collection("users")
        .doc(user.uid)
        .collection("memories")
        .get();

    let latest = null;

    snapshot.forEach(doc => {
        let data = doc.data();

        if (data.object === object) {
            if (!latest || data.time > latest.time) {
                latest = data;
            }
        }
    });

    if (latest) {
        showResult(`📍 Your ${latest.object} is in ${latest.location}`);
    } else {
        showResult("❌ Not found");
    }
}

// 🖥 SHOW RESULT
function showResult(msg) {
    document.getElementById("result").innerText = msg;
}
