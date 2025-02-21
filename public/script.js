const token = localStorage.getItem('token');

// Fetch Courses
fetch('http://localhost:5000/courses')
    .then(response => response.json())
    .then(courses => {
        const coursesDiv = document.getElementById('courses');
        courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course';
            div.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p><b>Price:</b> $${course.price}</p>
                <button onclick="enroll('${course._id}')">Enroll</button>
            `;
            coursesDiv.appendChild(div);
        });
    });


function enroll(courseId) {
    if (!token) {
        alert('Please log in to enroll');
        return;
    }
    fetch('http://localhost:5000/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ courseId })
    })
    .then(response => response.json())
    .then(data => alert(data.message));
}