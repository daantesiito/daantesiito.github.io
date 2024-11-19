// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA4jwDsKA3OfzGx59iEZixdTGc9ilq0JxA",
    authDomain: "pasapalabra-a1320.firebaseapp.com",
    databaseURL: "https://pasapalabra-a1320-default-rtdb.firebaseio.com",
    projectId: "pasapalabra-a1320",
    storageBucket: "pasapalabra-a1320.appspot.com",
    messagingSenderId: "986445345846",
    appId: "1:986445345846:web:7bdc7c987ee62c14e9d497",
    measurementId: "G-2EZ1QXZ8BK"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Variables del juego
let timer;
let timeLeft = 360;
let currentLetter = null;
let score = 0;
let username = ''; 

// Función para guardar el nombre de usuario y mostrar el contenido del juego
function saveUsername() {
    username = document.getElementById('usernameInput').value.trim();
    const modal = document.getElementById('usernameModal');
    
    if (!username) {
        alert("Por favor, ingrese un nombre de usuario.");
        return;
    }

    // Verificar si el nombre de usuario ya existe en Firebase
    const dbRef = firebase.database().ref(`leaderboard/${username}`);
    dbRef.once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                // Si el usuario ya existe, mostrar un mensaje de advertencia y restaurar estilos
                alert("El nombre de usuario ya existe. Por favor, elija otro nombre.");
                modal.style.display = 'flex';  // Asegura que el modal se muestre correctamente
            } else {
                // Si el usuario no existe, ocultar el modal y mostrar el contenido del juego
                modal.style.display = 'none';
                document.getElementById('gameContent').style.display = 'block';
                updateScoreBoard();
            }
        })
        .catch(error => {
            console.error("Error al verificar el nombre de usuario:", error);
            alert("Ocurrió un error al verificar el nombre de usuario. Intente de nuevo.");
        });
}



// Actualizar el tablero de puntaje
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
    ]}
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
        return;
    }

    if (selectedAnswer === currentClueData.correct) {
        score++;
        updateScoreBoard();
        updateLetterStatus(currentLetter, 'correct');

        // Avanza a la siguiente letra
        currentLetter++;
        
        if (currentLetter < letters.length) {
            // Mostrar la pista y opciones de la siguiente letra en el mismo popup
            const nextLetterData = letters[currentLetter];

            // Selecciona una nueva pista aleatoria para la nueva letra
            nextLetterData.selectedClue = nextLetterData.clues[Math.floor(Math.random() * nextLetterData.clues.length)];
            const selectedClue = nextLetterData.selectedClue;

            // Actualiza la pista y opciones en el popup
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
        } else {
            // Si ya no quedan letras, finaliza el juego
            checkGameOver();
        }
    } else {
        updateLetterStatus(currentLetter, 'incorrect');
        alert(`Respuesta incorrecta. La respuesta correcta era: ${currentClueData.correct}`);
        stopTimer();
        // Cerrar el popup en caso de respuesta incorrecta
        closeText();
    }

    // Si ya no quedan letras, finaliza el juego
    checkGameOver();
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

        // Cerrar el pop up
        closeText();
        
        // Mostrar el botón para ir al ranking
        document.getElementById('endGameButton').style.display = 'block';
    }
}

function goToRanking() {
    if (!username || score === null) {
        alert("No se ha encontrado el nombre de usuario o el puntaje.");
        return;
    }

    // Referencia a la base de datos
    const dbRef = firebase.database().ref(`leaderboard/${username}`);

    // Verificar el puntaje existente
    dbRef.once('value')
        .then(snapshot => {
            const existingScore = parseInt(snapshot.val());
            
            // Guardar el nuevo puntaje solo si es mayor que el existente
            if (isNaN(existingScore) || score > existingScore) {
                return dbRef.set(score)
                    .then(() => {
                        alert("¡Puntaje guardado exitosamente en Firebase!");
                    });
            } else {
                alert("Ya tienes un puntaje mayor o igual en la tabla de clasificación.");
            }
        })
        .catch((error) => {
            console.error("Error al leer o guardar el puntaje en Firebase:", error);
            alert("Ocurrió un error al guardar el puntaje. Inténtalo de nuevo.");
        });
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