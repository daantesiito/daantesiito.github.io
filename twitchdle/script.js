document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const keyboard = document.getElementById("keyboard");
    const messageElement = document.getElementById("message");
    const countdown = document.getElementById("countdown");
    const resultElement = document.getElementById("result");

    const wordList = ["AVION", "FILOS", "PILAS", "MANGO", "RAPTO", "VISTA", "FOCAS", "ALDEA", "MARCO", "PLUMA",
                      "TORTA", "BOTAS", "TIGRE", "PERRO", "GATOS", "CABRA", "JUEGO", "LUCES", "RUBIO", "NUEVO",
                      "SALTO", "RISAS", "LLAVE", "SILLA", "CAMPO", "BRISA", "CIELO", "LIMON", "PEZES", "MORAS"];

    const today = new Date();
    const dayIndex = today.getDate() - 1;
    const wordToGuess = wordList[dayIndex % wordList.length];

    const startTime = new Date();
    let currentAttempt = 0;
    let currentGuess = "";

    const savedGame = localStorage.getItem("wordleGame");
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");

    const modal = document.getElementById("gameOverModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");
    const closeModal = document.getElementById("closeModal");

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";  // Esto debería esconder el modal
        modal.classList.add("hidden");
    });

    if (savedGame && lastPlayedDate === today.toDateString()) {
        const gameData = JSON.parse(savedGame);
        if (gameData.currentAttempt >= 6 || gameData.currentGuess === wordToGuess) {
            showResult(gameData);
        } else {
            loadSavedGame(gameData);
        }
    } else {
        localStorage.removeItem("wordleGame");
        localStorage.setItem("lastPlayedDate", today.toDateString());
        initializeGame();
    }

    function initializeGame() {
        for (let i = 0; i < 6 * 5; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
        }

        const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        rows.forEach((row) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("key-row");
            row.split("").forEach((key) => {
                const keyElement = document.createElement("div");
                keyElement.classList.add("key");
                keyElement.textContent = key;
                keyElement.addEventListener("click", () => handleKeyPress(key));
                rowDiv.appendChild(keyElement);
            });
            keyboard.appendChild(rowDiv);
        });

        // Encontrar la fila donde se desea agregar las teclas ENTER y DELETE
        const bottomRow = document.querySelector(".key-row:last-child");

        // Crear y agregar la tecla ENTER
        const enterKey = document.createElement("div");
        enterKey.classList.add("key", "special-key");
        enterKey.textContent = "ENTER";
        enterKey.addEventListener("click", checkGuess);
        bottomRow.insertBefore(enterKey, bottomRow.firstChild);

        // Crear y agregar la tecla DELETE
        const deleteKey = document.createElement("div");
        deleteKey.classList.add("key", "special-key");
        deleteKey.textContent = "DELETE";
        deleteKey.addEventListener("click", () => {
            if (currentGuess.length > 0) {
                currentGuess = currentGuess.slice(0, -1);
                updateBoard();
            }
        });
        bottomRow.appendChild(deleteKey);
    }

    function handleKeyPress(key) {
        if (currentGuess.length < 5) {
            currentGuess += key;
            updateBoard();
        }
    }

    function updateBoard() {
        const tiles = document.querySelectorAll(".tile");
        for (let i = 0; i < currentGuess.length; i++) {
            tiles[currentAttempt * 5 + i].textContent = currentGuess[i];
        }
        for (let i = currentGuess.length; i < 5; i++) {
            tiles[currentAttempt * 5 + i].textContent = "";
        }
        saveGame();
    }

    function checkGuess() {
        if (currentGuess.length < 5) return;

        const tiles = document.querySelectorAll(".tile");
        for (let i = 0; i < 5; i++) {
            if (currentGuess[i] === wordToGuess[i]) {
                tiles[currentAttempt * 5 + i].classList.add("correct");
            } else if (wordToGuess.includes(currentGuess[i])) {
                tiles[currentAttempt * 5 + i].classList.add("present");
            } else {
                tiles[currentAttempt * 5 + i].classList.add("absent");
            }
        }

        if (currentGuess === wordToGuess) {
            const endTime = new Date();
            const timeTaken = endTime - startTime;
            const minutes = Math.floor(timeTaken / 60000);
            const seconds = Math.floor((timeTaken % 60000) / 1000);
            showMessage(`¡Felicidades! Acertaste la palabra en ${minutes}m ${seconds}s`);
            endGame(endTime);
        } else if (currentAttempt === 5) {
            showMessage(`No lograste acertar, palabra correcta: ${wordToGuess}`);
            endGame();
        } else {
            currentAttempt++;
            currentGuess = "";
        }
        saveGame();
    }

    function saveGame(endTime = null) {
        const gameData = {
            currentAttempt,
            currentGuess,
            boardState: Array.from(document.querySelectorAll(".tile")).map(tile => tile.textContent),
            startTime: startTime.toISOString(),
            endTime: endTime ? endTime.toISOString() : null
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
    }

    function loadSavedGame(data) {
        currentAttempt = data.currentAttempt;
        currentGuess = data.currentGuess;

        const tiles = document.querySelectorAll(".tile");
        data.boardState.forEach((letter, index) => {
            tiles[index].textContent = letter;
            if (letter) {
                tiles[index].classList.add(
                    wordToGuess[index % 5] === letter ? "correct" :
                    wordToGuess.includes(letter) ? "present" : "absent"
                );
            }
        });

        if (currentAttempt >= 6 || currentGuess === wordToGuess) {
            showResult(data);
        }
    }

    function showModal(message, countdownText) {
        modalMessage.textContent = message;
        modalCountdown.textContent = countdownText;
        modal.style.display = "block";  // Asegura que se muestre el modal
        modal.classList.remove("hidden");
    }
    
    function showMessage(text) {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        const diff = nextDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const countdownText = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;

        showModal(text, countdownText);
    }

    function showResult(data) {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        const diff = nextDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const countdownText = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;

        let message;
        if (data.currentGuess === wordToGuess) {
            const timeTaken = new Date(data.endTime) - new Date(data.startTime);
            const minutes = Math.floor(timeTaken / 60000);
            const seconds = Math.floor((timeTaken % 60000) / 1000);
            message = `¡Ya jugaste! Acertaste la palabra "${wordToGuess}" en ${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutos`;
        } else {
            message = `No lograste acertar, palabra correcta: "${wordToGuess}"`;
        }

        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.innerHTML = `<p>${message}</p><p>${countdownText}</p>`;
        resultElement.classList.remove("hidden");
    }

    function endGame(endTime = null) {
        if (endTime) {
            saveGame(endTime);
        }
        startCountdown();
        keyboard.classList.add("disabled");
    }

    function startCountdown() {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        function updateCountdown() {
            const diff = nextDay - new Date();
            if (diff <= 0) {
                countdown.textContent = "¡Nueva palabra disponible!";
                clearInterval(countdownInterval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                countdown.textContent = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;
            }
        }

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    document.addEventListener("keydown", (event) => {
        const key = event.key.toUpperCase();
        if (["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].join("").includes(key)) handleKeyPress(key);
        if (event.key === "Enter") checkGuess();
        if (event.key === "Backspace" && currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    });
});
