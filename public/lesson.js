const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", async function () {
    if(!token){
        location.replace('auth.html')
    }
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId");

    if (!courseId) {
        alert("Course ID is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/lessons?courseId=${courseId}`);
        const lessons = await response.json();

        if (lessons.length === 0) {
            document.getElementById("lesson-title").textContent = "No lessons found.";
            return;
        }

        const lesson = lessons[0]; // Assume first lesson for now
        document.getElementById("lesson-title").textContent = lesson.title;
        document.getElementById("lesson-description").textContent = lesson.description;
        document.getElementById("video-section").innerHTML = `<iframe src="${lesson.videoUrl}" allowfullscreen></iframe>`;

        loadQuiz(lesson.quiz,courseId);
    } catch (error) {
        console.error("Error fetching lessons:", error);
    }
});

function loadQuiz(quiz,course) {
    const quizSection = document.getElementById("quiz-section");
    quizSection.innerHTML = "";

    quiz.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quiz-question");
        questionDiv.innerHTML = `<p><strong>${q.question}</strong></p>`;

        q.options.forEach((option, optionIndex) => {
            const optionButton = document.createElement("button");
            optionButton.classList.add("quiz-option");
            optionButton.textContent = option;
            optionButton.dataset.questionIndex = index;
            optionButton.dataset.optionIndex = optionIndex;
            optionButton.addEventListener("click", selectOption);
            questionDiv.appendChild(optionButton);
        });

        quizSection.appendChild(questionDiv);
    });

    document.getElementById("submit-btn").addEventListener("click", () => checkAnswers(quiz,course));
}

function selectOption(event) {
    const selectedOption = event.target;
    const questionIndex = selectedOption.dataset.questionIndex;
    const allOptions = document.querySelectorAll(`button[data-question-index="${questionIndex}"]`);

    allOptions.forEach(option => option.classList.remove("selected"));
    selectedOption.classList.add("selected");
}

async function checkAnswers(quiz, course) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    const selectedAnswers = document.querySelectorAll(".quiz-option.selected");

    if (selectedAnswers.length !== quiz.length) {
        alert("Please answer all questions.");
        return;
    }
    let correctAmount = 0
    selectedAnswers.forEach(selected => {
        const questionIndex = selected.dataset.questionIndex;
        const optionIndex = selected.dataset.optionIndex;
        const correctIndex = quiz[questionIndex].correctAnswer;
        console.log(questionIndex)
        console.log(parseInt(optionIndex))
        console.log(correctIndex)

        if (parseInt(optionIndex) === parseInt(correctIndex)) {
            selected.classList.add("correct");
            correctAmount += 1;
        } else {
            selected.classList.add("incorrect");
        }
    });
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.disabled = true;
    })
    document.getElementById(("submit-btn")).innerText = correctAmount + "/" + selectedAnswers.length;
    document.getElementById("submit-btn").disabled = true;
    const data={courseId:course,progress:correctAmount/selectedAnswers.length*100}
    const response = await fetch(`http://localhost:5000/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify(data),
    });
    console.log(response)
}