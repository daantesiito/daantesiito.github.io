let timer;
let timeLeft = 360;
let currentLetter = null;
let score = 0;
let username = ''; // Variable para almacenar el nombre de usuario

// Función para guardar el nombre de usuario y mostrar el contenido del juego
function saveUsername() {
    username = document.getElementById('usernameInput').value.trim();
    if (username) {
        document.getElementById('usernameModal').style.display = 'none';
        document.getElementById('gameContent').style.display = 'block';
        updateScoreBoard(); // Mostrar el nombre de usuario y los puntos
    } else {
        alert("Por favor, ingrese un nombre de usuario.");
    }
}

function updateScoreBoard() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerText = `${username}: ${score} puntos`;
}

// Definir cada letra con sus pistas y respuestas
const letters = [
    { letter: 'A', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'B', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'C', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'D', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'E', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'F', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'G', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'H', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'I', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'J', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'K', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'L', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'M', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'N', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'Ñ', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'O', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'P', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'Q', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'R', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'S', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'T', clues: [
        { clue: "EX DE FLOR", correct: "Thiago", options: ["Tomas", "Thiago", "Tobias"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'U', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'V', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'W', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'X', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]},
    { letter: 'Y', clues: [
        { clue: "Fruto amarillo", correct: "Banana", options: ["Banana", "Manzana", "Pera"] },
        { clue: "Parte de una camisa", correct: "Botón", options: ["Botón", "Manga", "Cuello"] },
    ]},
    { letter: 'Z', clues: [
        { clue: "Animal que ladra", correct: "Perro", options: ["Perro", "Gato", "Loro"] },
        { clue: "A se usa para...", correct: "Hablar", options: ["Hablar", "Escribir", "Dibujar"] },
    ]}
    // Añadir más letras y sus pistas aquí
    // ...
];

function startTimer() {
    document.getElementById('timer').innerText = `Segundos: ${timeLeft}`;
    document.getElementById('timerPopup').innerText = `Segundos: ${timeLeft}`; // Actualización del temporizador en el popup
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Segundos: ${timeLeft}`;
        document.getElementById('timerPopup').innerText = `Segundos: ${timeLeft}`; // Actualización del temporizador en el popup
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("¡Tiempo terminado!");
            closeText();
        }
    }, 1000);
}


function stopTimer() {
    clearInterval(timer);
}

function showText(letterIndex) {
    if (currentLetter !== null) return;

    currentLetter = letterIndex;
    const letterData = letters[letterIndex];

    // Si no hay una pista seleccionada previamente, selecciona una ahora y guárdala
    if (!letterData.selectedClue) {
        letterData.selectedClue = letterData.clues[Math.floor(Math.random() * letterData.clues.length)];
    }

    const selectedClue = letterData.selectedClue;

    document.getElementById('clueContainer').innerText = selectedClue.clue;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    selectedClue.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.innerText = option;
        optionButton.classList.add('option-button');
        optionButton.onclick = () => selectOption(optionButton);
        optionsContainer.appendChild(optionButton);
    });

    document.getElementById('textPopup').style.display = 'flex';
    startTimer();
}


function closeText() {
    document.getElementById('textPopup').style.display = 'none';
    stopTimer();
    currentLetter = null;
}

function confirmAnswer() {
    stopTimer();
    const selectedButton = document.querySelector('.option-button.selected');
    if (!selectedButton) {
        alert("Por favor, selecciona una respuesta.");
        return;
    }

    const selectedAnswer = selectedButton.innerText;
    const letterData = letters[currentLetter];
    const currentClue = document.getElementById('clueContainer').innerText;
    const currentClueData = letterData.clues.find(clue => clue.clue === currentClue);

    if (!currentClueData) {
        console.error("Clue data not found.");
        closeText();
        return;
    }

    if (selectedAnswer === currentClueData.correct) {
        score++;
        updateLetterStatus(currentLetter, 'correct');
        alert("¡Respuesta correcta!");
    } else {
        updateLetterStatus(currentLetter, 'incorrect');
        alert(`Respuesta incorrecta. La respuesta correcta era: ${currentClueData.correct}`);
    }

    // Mostrar el mensaje de fin de juego después de un breve retraso
    setTimeout(() => {
        closeText();
        checkGameOver();
    }, 100); // 100 ms de retraso para asegurar que el alert se muestra primero
}


function passWord() {
    stopTimer();
    updateLetterStatus(currentLetter, 'passed');
    closeText();
}

function selectOption(selectedButton) {
    document.querySelectorAll('.option-button').forEach(button => button.classList.remove('selected'));
    selectedButton.classList.add('selected');
}

function checkGameOver() {
    // Verifica si todas las letras tienen la clase "correct" o "incorrect"
    const allLetters = document.querySelectorAll('.letter');
    const allCorrectOrIncorrect = Array.from(allLetters).every(letter => 
        letter.classList.contains('correct') || letter.classList.contains('incorrect')
    );

    if (allCorrectOrIncorrect) {
        // Detener el temporizador
        stopTimer();
        
        // Mostrar mensaje de fin de juego
        alert("¡Juego terminado! Has completado todas las letras.");
        
        // Mostrar el botón para ir al ranking
        document.getElementById('endGameButton').style.display = 'block';
    }
}

function goToRanking() {
    window.location.href = 'https://daantesiito.github.io/pasapalabra/ranking';
}


function updateLetterStatus(letterIndex, status) {
    const letterElement = document.getElementById(`letter${letterIndex}`);
    if (!letterElement) {
        console.error(`Elemento de letra con ID letter${letterIndex} no encontrado.`);
        return;
    }
    letterElement.classList.add(status);
    letterElement.classList.remove('correct', 'incorrect', 'passed');
    letterElement.classList.add(status);
    if (status === 'correct' || status === 'incorrect') {
        letterElement.style.cursor = 'default';
        letterElement.onclick = null;
    }

    // Habilitar la siguiente letra si existe
    const nextLetterIndex = letterIndex + 1;
    if (nextLetterIndex < letters.length) {
        const nextLetterElement = document.getElementById(`letter${nextLetterIndex}`);
        nextLetterElement.classList.remove('disabled');
        nextLetterElement.style.cursor = 'pointer';
        nextLetterElement.onclick = () => showText(nextLetterIndex);
    }
}


// Llamar a generateRosco para crear el rosco al cargar la página
window.onload = generateRosco;

// Modifica esta función para deshabilitar todas las letras excepto la primera al cargar la página
function generateRosco() {
    const rosco = document.getElementById('rosco');
    const radius = 250; // Ajusta el radio según el nuevo tamaño
    const centerX = rosco.offsetWidth / 2;
    const centerY = rosco.offsetHeight / 2;
    const angleStep = (2 * Math.PI) / letters.length;

    // Limpia cualquier contenido previo
    rosco.innerHTML = '';

    letters.forEach((letterData, index) => {
        const angle = index * angleStep - Math.PI / 2; // Iniciar desde la parte superior
        const x = centerX + radius * Math.cos(angle) - 25; // Ajustar para centrar el elemento
        const y = centerY + radius * Math.sin(angle) - 25; // Ajustar para centrar el elemento

        const letterElement = document.createElement('div');
        letterElement.innerText = letterData.letter;
        letterElement.classList.add('letter');
        letterElement.style.left = `${x}px`;
        letterElement.style.top = `${y}px`;
        letterElement.id = `letter${index}`; // Asignar un ID único

        // Deshabilitar todas las letras excepto la primera ("A")
        if (index !== 0) {
            letterElement.classList.add('disabled');
            letterElement.style.cursor = 'default';
        } else {
            letterElement.onclick = () => showText(index);
        }

        rosco.appendChild(letterElement);
    });
}