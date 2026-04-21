import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Recaptcha
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
    size: 'normal'
});

// SEND OTP
window.sendOTP = async () => {
    let phone = document.getElementById("phone").value;

    if (!phone.startsWith("+91")) {
        phone = "+91" + phone;
    }

    try {
        const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
        window.confirmationResult = confirmation;

        document.getElementById("msg").innerText = "✅ OTP Sent";

    } catch (e) {
        document.getElementById("msg").innerText = "❌ Error: " + e.message;
    }
};

// VERIFY OTP
window.verifyOTP = async () => {
    const otp = document.getElementById("otp").value;

    try {
        const result = await window.confirmationResult.confirm(otp);

        localStorage.setItem("user", JSON.stringify(result.user));

        document.getElementById("msg").innerText = "✅ Login Success";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (e) {
        document.getElementById("msg").innerText = "❌ Invalid OTP";
    }
};
