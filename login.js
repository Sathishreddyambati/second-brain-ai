const firebaseConfig = {
  apiKey: "AIzaSyDW1OHe8pfRrJFM1UUaIkCca57CppVJD3k",
  authDomain: "secondbrain-87cd7.firebaseapp.com",
  projectId: "secondbrain-87cd7"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha');

// SEND OTP
function sendOTP() {
    let phone = document.getElementById("phone").value;

    if (!phone.startsWith("+91")) {
        phone = "+91" + phone;
    }

    auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(res => {
        window.confirmationResult = res;
        document.getElementById("msg").innerText = "✅ OTP Sent";
    })
    .catch(err => {
        document.getElementById("msg").innerText = err.message;
    });
}

// VERIFY
function verifyOTP() {
    let code = document.getElementById("otp").value;

    window.confirmationResult.confirm(code)
    .then(result => {
        localStorage.setItem("user", JSON.stringify(result.user));
        document.getElementById("msg").innerText = "✅ Login Success";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    })
    .catch(() => {
        document.getElementById("msg").innerText = "❌ Wrong OTP";
    });
}
