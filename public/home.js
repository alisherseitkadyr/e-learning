const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
    console.log(token)
    if (token) {
        document.getElementById("login-link").style.display = "none";
        document.getElementById("profile-link").style.display = "block";
        document.getElementById("logout-link").style.display = "block";
    } else {
        location.replace('auth.html')
    }
});
function enroll(courseId) {
    fetch('http://localhost:5000/enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })  // Передаем courseId
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload();
            } else {
                alert('Enrollment failed');
            }
        })
        .catch(error => console.error('Error:', error));
}

async function loadCourses() {
    const response = await fetch('http://localhost:5000/courses');
    const courses = await response.json();
    const coursesDiv = document.getElementById('courses');
    coursesDiv.innerHTML = '';

    for (const course of courses) {
        const response = await fetch(`http://localhost:5000/enrolled/${course._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const enrolled=await response.json();
        const div = document.createElement('div');
        div.className = 'course-card';
        div.innerHTML=``
        if(course.image!==undefined) {
            div.innerHTML += `<img src="${course.image}" alt="${course.title}"/>`
        }
        div.innerHTML += `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                `;
        if(enrolled.enrolled){
            div.innerHTML+=`<button class="enrolled-btn">Already enrolled</button>`
        }else {
            div.innerHTML+=`<button class="enroll-btn" onClick="enroll('${course._id}')">Enroll Now</button>`
        }
        coursesDiv.appendChild(div);
    }
}

loadCourses();