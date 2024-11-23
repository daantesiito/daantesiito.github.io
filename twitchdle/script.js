document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const keyboard = document.getElementById("keyboard");
    const messageElement = document.getElementById("message");
    const resultElement = document.getElementById("result");
    const postGameElement = document.getElementById("postGame");
    const postGameMessage = document.getElementById("postGameMessage");
    const postGameCountdown = document.getElementById("postGameCountdown");
    const modal = document.getElementById("gameOverModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");
    const closeModal = document.getElementById("closeModal");

    const wordList = ["AVION", "FILOS", "PILAS", "MANGO", "RAPTO", "VISTA", "FOCAS", "ALDEA", "MARCO", "PLUMA",
                      "TORTA", "BOTAS", "TIGRE", "PERRO", "GATOS", "CABRA", "JUEGO", "LUCES", "RUBIO", "NUEVO",
                      "SALTO", "RISAS", "LLAVE", "SILLA", "CAMPO", "BRISA", "CIELO", "LIMON", "PEZES", "MORAS"];

    const today = new Date();
    const dayIndex = today.getDate() - 1;
    const wordToGuess = wordList[dayIndex % wordList.length];

    const startTime = new Date();
    let currentAttempt = 0;
    let currentGuess = "";
    let gameBoard = Array(6).fill("").map(() => Array(5).fill("⬛"));

    const savedGame = localStorage.getItem("wordleGame");
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");

    if (savedGame && lastPlayedDate === today.toDateString()) {
        const gameData = JSON.parse(savedGame);
        showPostGameScreen(gameData);
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
                keyElement.id = `key-${key}`; // Asignar un ID único a cada tecla
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
            const keyElement = document.getElementById(`key-${currentGuess[i]}`);
            if (currentGuess[i] === wordToGuess[i]) {
                tiles[currentAttempt * 5 + i].classList.add("correct");
                gameBoard[currentAttempt][i] = "🟩";
                if (keyElement) keyElement.classList.add("correct");
            } else if (wordToGuess.includes(currentGuess[i])) {
                tiles[currentAttempt * 5 + i].classList.add("present");
                gameBoard[currentAttempt][i] = "🟨";
                if (keyElement) keyElement.classList.add("present");
            } else {
                tiles[currentAttempt * 5 + i].classList.add("absent");
                gameBoard[currentAttempt][i] = "⬛";
                if (keyElement) keyElement.classList.add("absent");
            }
        }

        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        const diff = nextDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (currentGuess === wordToGuess) {
            const endTime = new Date();
            const timeTaken = endTime - startTime;
            const minutesTaken = Math.floor(timeTaken / 60000);
            const secondsTaken = Math.floor((timeTaken % 60000) / 1000);
            showModal(`¡Felicidades! Acertaste la palabra "${wordToGuess}" en ${minutesTaken}:${secondsTaken < 10 ? '0' : ''}${secondsTaken} minutos`, `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`);
            endGame(endTime);
        } else if (currentAttempt === 5) {
            showModal(`No lograste acertar, palabra correcta: "${wordToGuess}"`, `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`);
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
            endTime: endTime ? endTime.toISOString() : null,
            gameBoard
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
    }

    function loadSavedGame(data) {
        currentAttempt = data.currentAttempt;
        currentGuess = data.currentGuess;
        gameBoard = data.gameBoard;

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
            showPostGameScreen(data);
        }
    }

    function showPostGameScreen(data) {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        const diff = nextDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const countdownText = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;

        let message = data.message;
        if (!message) {
            if (data.currentGuess === wordToGuess) {
                const timeTaken = new Date(data.endTime) - new Date(data.startTime);
                const minutes = Math.floor(timeTaken / 60000);
                const seconds = Math.floor((timeTaken % 60000) / 1000);
                message = `Acertaste la palabra "${wordToGuess}" en ${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutos`;
            } else {
                message = `No lograste acertar, palabra correcta: "${wordToGuess}"`;
            }
        }

        postGameMessage.innerHTML = `<p>${message}</p>`;
        postGameCountdown.innerHTML = `<p>${countdownText}</p>`;
        if (data.currentGuess === wordToGuess) {
            const gameBoardText = data.gameBoard.slice(0, data.currentAttempt + 1).map(row => row.join("")).join("<br>");
            postGameMessage.innerHTML += `<p>${gameBoardText}</p>`;
        }
        postGameElement.classList.remove("hidden");
        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.classList.add("hidden");
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

        postGameMessage.innerHTML = `<p>${message}</p><p>${countdownText}</p>`;
        postGameElement.classList.remove("hidden");
        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.classList.add("hidden");
    }

    function endGame(endTime = null) {
        if (endTime) {
            saveGame(endTime);
        }
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
        if (currentGuess === wordToGuess) {
            const timeTaken = endTime - startTime;
            const minutesTaken = Math.floor(timeTaken / 60000);
            const secondsTaken = Math.floor((timeTaken % 60000) / 1000);
            message = `¡Felicidades! Acertaste la palabra "${wordToGuess}" en ${minutesTaken}:${secondsTaken < 10 ? '0' : ''}${secondsTaken} minutos`;
        } else {
            message = `No lograste acertar, palabra correcta: "${wordToGuess}"`;
        }

        showModal(message, countdownText);
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

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        location.reload();  // Recarga la página
    });

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

document.addEventListener('DOMContentLoaded', () => {
            let numEmotes = 100;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                numEmotes = 30;
            }
            const emoteSources = [
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Smajj.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/sittbutluvv.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Sadgers.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/peepoLove.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/owoL.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/OkaygeL.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/luvvbutmajj.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Luvv.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/luv.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/bluwubbers.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/DuckLove.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/DuckSadge.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Heartgers.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Lovegers.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/LUBBERS.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Luv.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/peepoPat.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/pepeLost.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/sadcat.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/Sadge.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/SadgeRain.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/sadJAM.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/sadVegeta.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/sadWankge.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tvAldu/SpongeOfLOVE.gif?raw=true'
            ];

            const emoteContainer = document.getElementById('emote-container');

            for (let i = 0; i < numEmotes; i++) {
                const emote = document.createElement('img');
                emote.src = emoteSources[Math.floor(Math.random() * emoteSources.length)];
                emote.className = 'emote';
                emote.style.left = Math.random() * 100 + 'vw';
                emote.style.animationDuration = Math.random() * 5 + 5 + 's';
                emote.style.animationDelay = Math.random() * 6 + 's';
                emoteContainer.appendChild(emote);
            }
        });