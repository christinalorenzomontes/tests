let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let selectedSubjects = [];
let questionCount = 0;
let userAnswers = [];

function startQuiz() {
    selectedSubjects = Array.from(document.querySelectorAll('.subject:checked')).map(input => input.value);
    questionCount = parseInt(document.querySelector('input[name="questionCount"]:checked')?.value);

    if (selectedSubjects.length === 0 || isNaN(questionCount)) {
        alert("Por favor selecciona asignaturas y número de preguntas.");
        return;
    }

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            // Filtramos las preguntas según las asignaturas seleccionadas
            questions = data.filter(q => selectedSubjects.includes(q.subject));
            // Seleccionamos un número aleatorio de preguntas
            questions = shuffleArray(questions).slice(0, questionCount);
            userAnswers = new Array(questions.length).fill(null);
            showQuestion();
            document.getElementById('quizContainer').style.display = 'none';
            document.getElementById('questionContainer').style.display = 'block';
        });
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionTitle').textContent = question.question;
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="option" value="${index}" onclick="selectAnswer(${index})">
            ${option}
        `;
        optionsContainer.appendChild(label);
    });
}

function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
}

function nextQuestion() {
    const selectedAnswer = userAnswers[currentQuestionIndex];
    if (selectedAnswer === null) {
        return;
    }

    const correctAnswer = questions[currentQuestionIndex].options.indexOf(questions[currentQuestionIndex].answer);
    if (selectedAnswer === correctAnswer) {
        score++;
    } else if (selectedAnswer !== null && selectedAnswer !== correctAnswer) {
        if (score > 0) score--;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function skipQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('score').textContent = `Tu puntuación: ${score}`;

    const resultList = document.getElementById('resultList');
    resultList.innerHTML = '';

    questions.forEach((question, index) => {
        const result = document.createElement('div');
        result.classList.add('question');
        result.innerHTML = `
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, i) => {
                    let style = '';
                    if (i === userAnswers[index]) {
                        style = i === question.options.indexOf(question.answer) ? 'green' : 'red';
                    } else if (i === question.options.indexOf(question.answer)) {
                        style = 'green';
                    }

                    return `<label style="color: ${style}">${option}</label>`;
                }).join('')}
            </div>
        `;
        resultList.appendChild(result);
    });
}

function restartQuiz() {
    location.reload();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
