import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDW1OHe8pfRrJFM1UUaIkCca57CppVJD3k",
  authDomain: "secondbrain-87cd7.firebaseapp.com",
  projectId: "secondbrain-87cd7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}
// ===== TEMP MEMORY (later connect Firebase)
let memories = [];

// ===== HANDLE INPUT
function handleInput() {
    let input = document.getElementById("userInput").value.toLowerCase();
    
    if (!input) return;

    // SAVE
    if (
        input.includes("i kept") ||
        input.includes("i left") ||
        input.includes("i placed") ||
        input.includes("i put")
    ) {
        saveMemory(input);
    } else {
        findMemory(input);
    }
}

// ===== SAVE MEMORY
async function saveMemory(text, object, location) {
    await addDoc(collection(db, "users", user.uid, "memories"), {
        text,
        object,
        location,
        time: Date.now()
    });
}
// ===== FIND MEMORY
async function findMemory(object) {

    const snapshot = await getDocs(collection(db, "users", user.uid, "memories"));

    let latest = null;

    snapshot.forEach(doc => {
        const data = doc.data();

        if (data.object === object) {
            if (!latest || data.time > latest.time) {
                latest = data;
            }
        }
    });

    return latest;
}

// ===== VOICE INPUT
function startListening() {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";

    recognition.onresult = function(event) {
        let speech = event.results[0][0].transcript;
        document.getElementById("userInput").value = speech;
        handleInput();
    };

    recognition.start();
}
