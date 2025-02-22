async function loadMyCourses() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    const response = await fetch('http://localhost:5000/enrolled', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const courses = await response.json();
    console.log(courses)
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';

    if (courses.length === 0) {
        courseList.innerHTML = "<p>You haven't enrolled in any courses yet.</p>";
        return;
    }

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-card';
        div.innerHTML = `
                    <img src="${course.courseId.image}" alt="${course.courseId.title}">
                    <h3>${course.courseId.title}</h3>
                    <p>${course.courseId.description}</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${course.progress}%"></div>
                    </div>
                    <p>Progress: ${course.progress}%</p>
                    <button onclick="continueCourse('${course.courseId._id}')" class="continue-btn">Continue</button>
                `;
        courseList.appendChild(div);
    });
}

function continueCourse(courseId) {
    window.location.href = `/lesson.html?courseId=${courseId}`;
}




loadMyCourses();