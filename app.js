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
function saveMemory(text) {

    // extract object + location (simple but clean)
    let words = text.split(" ");
    let object = "";
    let location = "";

    for (let i = 0; i < words.length; i++) {
        if (words[i] === "my") {
            object = words[i + 1]; // keys, phone, laptop
        }
        if (
            words[i] === "in" ||
            words[i] === "on" ||
            words[i] === "at"
        ) {
            location = words.slice(i + 1).join(" ");
            break;
        }
    }

    if (!object || !location) {
        showResult("❌ Couldn't understand properly");
        return;
    }

    memories.push({
        object,
        location,
        text,
        time: Date.now()
    });

    showResult(`✅ Saved: Your ${object} is in ${location}`);
}

// ===== FIND MEMORY
function findMemory(query) {

    let words = query.split(" ");
    let object = "";

    for (let w of words) {
        if (w !== "where" && w !== "is" && w !== "my") {
            object = w;
            break;
        }
    }

    let result = memories
        .filter(m => m.object === object)
        .sort((a, b) => b.time - a.time)[0];

    if (result) {
        showResult(`📍 Your ${result.object} is in ${result.location}`);
    } else {
        showResult("❌ Not found");
    }
}

// ===== SHOW RESULT
function showResult(msg) {
    document.getElementById("result").innerText = msg;
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
