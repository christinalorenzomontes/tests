let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let incorrectCount = 0;

// Función para cargar todas las preguntas desde el archivo JSON
async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
}

// Función para iniciar el examen según la selección del usuario
function startExam() {
    // Obtener las asignaturas seleccionadas
    const checkboxes = document.querySelectorAll('#subject-selection input[type="checkbox"]');
    const selectedSubjects = Array.from(checkboxes)
                                 .filter(checkbox => checkbox.checked)
                                 .map(checkbox => checkbox.value);

    // Filtrar las preguntas según las asignaturas seleccionadas
    const filteredQuestions = questions.filter(q => selectedSubjects.includes(q.subject));

    // Seleccionar aleatoriamente 20 preguntas de las seleccionadas
    selectedQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);

    // Ocultar la selección de asignaturas y mostrar el examen
    document.getElementById('subject-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    // Iniciar con la primera pregunta
    currentQuestion = 0;
    score = 0;
    incorrectCount = 0;
    displayQuestion();
}

// Función para mostrar la pregunta actual
function displayQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    // Limpiar las opciones anteriores
    optionsElement.innerHTML = '';

    // Mostrar la pregunta actual
    const question = selectedQuestions[currentQuestion];
    questionElement.innerText = `[${question.subject}] ${question.question}`;
    
    // Mostrar las opciones de respuesta
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option);
        optionsElement.appendChild(button);
    });
}

// Función para verificar la respuesta del usuario
function checkAnswer(selectedOption) {
    const question = selectedQuestions[currentQuestion];

    if (selectedOption === question.answer) {
        alert("¡Correcto!");
        score++;  // Incrementar puntuación por respuesta correcta
    } else {
        alert(`Incorrecto. La respuesta correcta era: ${question.answer}`);
        incorrectCount++;  // Incrementar contador de respuestas incorrectas
        
        // Restar un punto cada tres respuestas incorrectas
        if (incorrectCount === 3) {
            score--;  // Restar un punto
            incorrectCount = 0;  // Reiniciar el contador de incorrectas
            alert("Has acumulado tres respuestas incorrectas, se te resta un punto.");
        }
    }
    
    currentQuestion++;
    if (currentQuestion < selectedQuestions.length) {
        displayQuestion();
    } else {
        showScore();
    }
}

// Función para mostrar la puntuación final
function showScore() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('score').innerText = `Has terminado el examen. Puntuación final: ${score}/${selectedQuestions.length}`;
}

// Cargar las preguntas al iniciar la página
loadQuestions();
