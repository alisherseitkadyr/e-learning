async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    const response = await fetch('http://localhost:5000/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const res = await response.json();
    const user=res.user
    console.log(user)
    document.getElementById('username').innerText = user.username;
    document.getElementById('email').innerText = user.email;
    const enrollment = await fetch('http://localhost:5000/enrolled', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const enrolled_courses=await enrollment.json();
    document.getElementById('enrolled').innerText = enrolled_courses.length;
}


loadProfile();