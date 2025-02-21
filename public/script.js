function enroll(courseId) {
    const token = localStorage.getItem('token');

    console.log(courseId)
    if (!token) {
        alert('Please log in to enroll');
        return;
    }

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
        } else {
            alert('Enrollment failed');
        }
    })
    .catch(error => console.error('Error:', error));
}


function logout() {
    localStorage.removeItem('token');
    location.reload();
}