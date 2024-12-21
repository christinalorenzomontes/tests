let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let selectedSubjects = [];
let questionCount = 0;

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
            selectedSubjects = ["PP", "OE", "GF", "DA", "GACE", "ADVO"];
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
    answeredQuestions = [];

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
            <div class="option">
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
    let answer = selectedOption ? selectedOption.value : null;
    let question = questions[currentQuestionIndex];

    // Guardar respuesta y actualizar puntuación si es necesario
    if (answer) {
        let isCorrect = answer === question.answer;
        answeredQuestions.push({ 
            question: question.question, 
            userAnswer: answer, 
            correctAnswer: question.answer, 
            isCorrect: isCorrect 
        });
        
        // Actualizar puntuación solo si es correcta
        if (isCorrect) {
            score++;
        }
    } else {
        // Guardar como no respondida
        answeredQuestions.push({
            question: question.question,
            userAnswer: "No respondida.",
            correctAnswer: question.answer,
            isCorrect: false
        });
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    let resultText = `<h3>El esfuerzo de hoy, serán las tocadas de chocho de mañana</h3>`;
    resultText += "<h3>Respuestas:</h3>";

    answeredQuestions.forEach((entry, index) => {
        let resultClass = entry.isCorrect ? "correct" : "incorrect";
        
        // Solo mostrar la respuesta una vez en verde si es correcta
        resultText += `
            <div class="question">
                <p><strong>${index + 1}. ${entry.question}</strong></p>
                <p class="${resultClass}">Tu respuesta: ${entry.userAnswer}</p>
                ${entry.isCorrect ? "" : `<p class="correct">Respuesta correcta: ${entry.correctAnswer}</p>`}
            </div>
        `;
    });

    document.getElementById("resultText").innerHTML = resultText;
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "block";
}


// Fn for AppScripts to JSON
// function exportToJSON() {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   const rows = sheet.getDataRange().getValues();
//   const data = [];

//   // Recorre cada fila (empezando desde la segunda si tienes encabezados)
//   for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
      
//       // Construimos el objeto de pregunta con las columnas correspondientes
//       const questionObject = {
//           question: row[0],   // Pregunta
//           answer: row[1],     // Respuesta correcta
//           options: [
//               row[1],          // Respuesta correcta
//               row[2],          // Respuesta incorrecta 1
//               row[3],          // Respuesta incorrecta 2
//               row[4]           // Respuesta incorrecta 3
//           ].sort(() => Math.random() - 0.5),  // Mezcla las opciones de forma aleatoria
//           subject: row[5] || "General", // Asignatura (valor por defecto "General" si está vacío)
//           topic: row[6] || "Sin tema"   // Tema (valor por defecto "Sin tema" si está vacío)
//       };

//       data.push(questionObject);
//   }

//   // Convertir el array a JSON
//   const json = JSON.stringify(data, null, 2);

//   // Descargar el archivo JSON
//   function exportToJSON() {
//     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     const rows = sheet.getDataRange().getValues();
//     const data = [];

//     // Recorre cada fila (empezando desde la segunda si tienes encabezados)
//     for (let i = 1; i < rows.length; i++) {
//         const row = rows[i];
        
//         // Construimos el objeto de pregunta con las columnas correspondientes
//         const questionObject = {
//             question: row[0],   // Pregunta
//             answer: row[1],     // Respuesta correcta
//             options: [
//                 row[1],          // Respuesta correcta
//                 row[2],          // Respuesta incorrecta 1
//                 row[3],          // Respuesta incorrecta 2
//                 row[4]           // Respuesta incorrecta 3
//             ].sort(() => Math.random() - 0.5),  // Mezcla las opciones de forma aleatoria
//             subject: row[5] || "General", // Asignatura (valor por defecto "General" si está vacío)
//             topic: row[6] || "Sin tema"   // Tema (valor por defecto "Sin tema" si está vacío)
//         };

//         data.push(questionObject);
//     }

//     // Convertir el array a JSON
//     const json = JSON.stringify(data, null, 2);

//     // Descargar el archivo JSON
//     const blob = Utilities.newBlob(json, 'application/json', 'questions.json');
//     const url = DriveApp.createFile(blob).getUrl();
//     Logger.log(`Archivo JSON generado: ${url}`);
// }
