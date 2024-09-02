let timer;
let timeLeft = 360;
let currentLetter = null;
let score = 0;

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
    ]},
    // Añadir más letras y sus pistas aquí
    // ...
];

function startTimer() {
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("¡Tiempo terminado!");
            closeText();
            // Puedes agregar lógica adicional aquí, como finalizar el juego
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function showText(letterIndex) {
    if (currentLetter !== null) return;  // Evitar que se abra otra letra mientras una está activa

    currentLetter = letterIndex;
    const letterData = letters[letterIndex];
    const randomClue = letterData.clues[Math.floor(Math.random() * letterData.clues.length)];

    document.getElementById('clueContainer').innerText = randomClue.clue;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';  // Limpiar opciones anteriores
    randomClue.options.forEach((option, index) => {
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

    closeText();
}

function passWord() {
    stopTimer();
    updateLetterStatus(currentLetter, 'passed');
    closeText();
}

function selectOption(selectedButton) {
    // Desmarcar todas las opciones
    document.querySelectorAll('.option-button').forEach(button => button.classList.remove('selected'));
    // Marcar la opción seleccionada
    selectedButton.classList.add('selected');
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
    // Desactivar el cursor si la letra ya no puede ser seleccionada
    if (status === 'correct' || status === 'incorrect') {
        letterElement.style.cursor = 'default';
        letterElement.onclick = null;
    }
}

function generateRosco() {
    const rosco = document.getElementById('rosco');
    const radius = 200; // Radio del círculo
    const centerX = rosco.offsetWidth / 2;
    const centerY = rosco.offsetHeight / 2;
    const angleStep = (2 * Math.PI) / letters.length;

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
        letterElement.onclick = () => showText(index);

        rosco.appendChild(letterElement);
    });
}

window.onload = generateRosco;
