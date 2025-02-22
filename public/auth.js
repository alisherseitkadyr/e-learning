document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("auth-form");
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const usernameInput = document.getElementById("username-field"); // Ensure correct ID
    const submitBtn = document.getElementById("submit-btn");

    let isLogin = true; // Default mode: Login

    function toggleForm() {
        isLogin = !isLogin;

        // Update form title and button text
        formTitle.innerText = isLogin ? "Login" : "Register";
        submitBtn.innerText = isLogin ? "Login" : "Register";

        // Show username field only if Register
        usernameInput.style.display = isLogin ? "none" : "block";

        // Update toggle text dynamically
        toggleText.innerHTML = isLogin
            ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
            : `Already have an account? <a href="#" id="toggle-link">Login</a>`;

        // Attach event listener again
        document.getElementById("toggle-link").addEventListener("click", (e) => {
            e.preventDefault();
            toggleForm();
        });
    }

    // Attach event listener for first time
    document.getElementById("toggle-link").addEventListener("click", (e) => {
        e.preventDefault();
        toggleForm();
    });

    // Handle Login/Register form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;

        const data = isLogin
            ? { email, password }
            : { username, email, password };

        const endpoint = isLogin ? "/login" : "/register";

        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.message!==undefined){
            alert(result.message);
        }

        if (response.ok && isLogin) {
            localStorage.setItem("token", result.token);
            window.location.href = "home.html"; // Redirect to home after login
        }
    });
});