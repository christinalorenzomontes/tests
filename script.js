let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = 0;
let wrongAnswers = 0;
let selectedSubjects = [];
let questionCount = 0;
let answers = []; // Almacena las respuestas seleccionadas

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("nextQuestion").addEventListener("click", nextQuestion);

// Cargar preguntas del archivo JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

function startQuiz() {
    // Selecciona asignaturas
    selectedSubjects = [];
    let subjectCheckboxes = document.querySelectorAll("input[name='subject']:checked");
    subjectCheckboxes.forEach(checkbox => {
        if (checkbox.value === "todas") {
            selectedSubjects = ["PP", "OE", "GF", "DA"];
        } else {
            selectedSubjects.push(checkbox.value);
        }
    });

    // Selecciona número de preguntas
    let questionCountRadio = document.querySelector("input[name='questionCount']:checked");
    if (questionCountRadio) {
        questionCount = parseInt(questionCountRadio.value);
    }

    if (selectedSubjects.length === 0 || !questionCount) {
        alert("Por favor, selecciona las asignaturas y el número de preguntas.");
        return;
    }

    // Filtra preguntas por asignaturas seleccionadas
    let filteredQuestions = questions.filter(question => selectedSubjects.includes(question.subject));

    // Si no hay suficientes preguntas, muestra un mensaje de error
    if (filteredQuestions.length < questionCount) {
        alert("No hay suficientes preguntas para las asignaturas seleccionadas.");
        return;
    }

    // Selecciona preguntas aleatorias
    let randomQuestions = [];
    while (randomQuestions.length < questionCount) {
        let randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        let randomQuestion = filteredQuestions[randomIndex];
        if (!randomQuestions.includes(randomQuestion)) {
            randomQuestions.push(randomQuestion);
        }
    }

    // Prepara el cuestionario
    questions = randomQuestions;
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    wrongAnswers = 0;
    answers = []; // Reinicia las respuestas seleccionadas

    document.getElementById("quizSetup").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    let question = questions[currentQuestionIndex];
    document.getElementById("questionNumber").innerText = `Pregunta ${currentQuestionIndex + 1}`;
    document.getElementById("questionText").innerText = question.question;

    let optionsHtml = "";
    question.options.forEach((option, index) => {
        optionsHtml += `
            <div>
                <input type="radio" name="answer" value="${option}" id="option${index}">
                <label for="option${index}">${option}</label>
            </div>
        `;
    });
    document.getElementById("questionOptions").innerHTML = optionsHtml;

    // Mostrar botón "Siguiente pregunta"
    document.getElementById("nextQuestion").style.display = "inline-block";
}

function nextQuestion() {
    let selectedOption = document.querySelector("input[name='answer']:checked");
    let answer = selectedOption ? selectedOption.value : "No respondida"; // Si no selecciona nada, marca como "No respondida"
    
    answers.push(answer); // Guarda la respuesta seleccionada o "No respondida"

    if (answer !== "No respondida") {  // Solo si se respondió correctamente o incorrectamente, se evalúa la puntuación
        let question = questions[currentQuestionIndex];
        if (answer === question.answer) {
            score++;
        } else if (answer !== question.answer) {
            wrongAnswers++;
            if (wrongAnswers % 3 === 0) {
                score--; // Resta puntuación cada 3 respuestas incorrectas
            }
        }
    }

    answeredQuestions++;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    let resultText = `<p>Puntuación: ${score}</p>`;
    resultText += "<h4>Respuestas:</h4>";

    questions.forEach((question, index) => {
        let userAnswer = answers[index] || "No respondida"; // Usa la respuesta guardada
        let correctAnswer = question.answer;

        let resultClass = userAnswer === correctAnswer ? "correct" : "incorrect";
        resultText += `
            <div class="question">
                <p><strong>${index + 1}. ${question.question}</strong></p>
                <p class="${resultClass}">Tu respuesta: ${userAnswer}</p>
                <p class="correct">Respuesta correcta: ${correctAnswer}</p>
            </div>
        `;
    });

    document.getElementById("resultText").innerHTML = resultText;
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "block";
}
