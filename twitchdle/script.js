document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const keyboard = document.getElementById("keyboard");
    const messageElement = document.getElementById("message");
    const resultElement = document.getElementById("result");
    const postGame = document.getElementById("postGame");
    const postGameMessage = document.getElementById("postGameMessage");
    const postGameCountdown = document.getElementById("postGameCountdown");
    const postGameStats = document.getElementById("postGameStats");
    const modal = document.getElementById("gameOverModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");
    const closeModal = document.getElementById("closeModal");
    const loginWithTwitchButton = document.getElementById("loginWithTwitchButton");
    const container = document.querySelector(".container");
    const userInfo = document.getElementById("userInfo");
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");
    const userAvatarUrl = localStorage.getItem("userAvatar");
    const now = new Date();
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");
    const lastPlayedTimestamp = localStorage.getItem("lastPlayedTimestamp");
    const isNewDay = !lastPlayedTimestamp || new Date(parseInt(lastPlayedTimestamp)).toDateString() !== now.toDateString();

    const wordList = [
        "AVION", "FILOS", "PILAS", "MANGO", "RAPTO", "VISTA", "FOCAS", "ALDEA", "MARCO", "PLUMA",
        "TORTA", "BOTAS", "TIGRE", "PERRO", "GATOS", "CABRA", "JUEGO", "LUCES", "RUBIO", "NUEVO",
        "SALTO", "RISAS", "LLAVE", "SILLA", "CAMPO", "BRISA", "CIELO", "LIMON", "PEZES", "MORAS",
        "NIEVE"
    ];
    
    const today = new Date();
    const dayIndex = today.getDate() - 1;
    const wordToGuess = wordList[dayIndex % wordList.length];

    const startTime = new Date();
    let currentAttempt = 0;
    let currentGuess = "";
    let gameBoard = Array(6).fill("").map(() => Array(5).fill("⬛"));

    const savedGame = localStorage.getItem("wordleGame");
    const gameFinished = localStorage.getItem("gameFinished");

    const stats = JSON.parse(localStorage.getItem("wordleStats")) || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: Array(6).fill(0),
        lastPlayedDate: null
    };

    const username = localStorage.getItem("username");

    if (!username) {
        loginWithTwitchButton.style.display = "block";
    } else {
        loginWithTwitchButton.style.display = "none";
        userInfo.classList.remove("hidden");
        userAvatar.src = userAvatarUrl;
        userName.textContent = `Logged in as: ${username}`;
        container.classList.remove("hidden");

        if (savedGame && lastPlayedDate === today.toDateString()) {
            const gameData = JSON.parse(savedGame);
            if (gameFinished === "true") {
                showPostGameScreen(gameData);
            } else {
                loadSavedGame(gameData);
            }
        } else {
            if (lastPlayedDate !== today.toDateString()) {
                localStorage.removeItem("wordleGame");
                localStorage.setItem("lastPlayedDate", today.toDateString());
                localStorage.setItem("gameFinished", "false");
                initializeGame();
            }
        }
    }
    
    loginWithTwitchButton.addEventListener("click", () => {
        const clientId = '0oy4xx9zsvkxsbgwm6n0rmb28xtivy';
        const redirectUri = 'https://daantesiito.github.io/twitchdle/';
        const scope = 'user:read:email';
        const responseType = 'token';
        const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
        window.location.href = twitchAuthUrl;
    });

    function handleTwitchAuth() {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            if (accessToken) {
                fetch('https://api.twitch.tv/helix/users', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Client-Id': '0oy4xx9zsvkxsbgwm6n0rmb28xtivy' 
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const user = data.data[0];
                    localStorage.setItem("username", user.display_name);
                    localStorage.setItem("userAvatar", user.profile_image_url);
                    localStorage.setItem("lastPlayedDate", new Date().toDateString());
                    loginWithTwitchButton.style.display = "none";
                    userInfo.classList.remove("hidden");
                    userAvatar.src = user.profile_image_url;
                    userName.textContent = `Logged in as: ${user.display_name}`;
                    container.classList.remove("hidden");
                    initializeGame();
                    updateBoard();
                })
                .catch(error => console.error('Error fetching Twitch user:', error));
            }
        }
    }

    handleTwitchAuth();

    if (username && userAvatarUrl) {
        loginWithTwitchButton.style.display = "none";
        userInfo.classList.remove("hidden");
        userAvatar.src = userAvatarUrl;
        userName.textContent = `Logged in as: ${username}`;
        container.classList.remove("hidden");
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
        postGame.classList.remove("hidden");
        postGame.classList.add("visible");

        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.classList.add("hidden");

        showStats(); // Asegúrate de llamar a showStats aquí
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
    
        let message;
        if (currentGuess === wordToGuess) {
            const timeTaken = endTime - startTime;
            const minutesTaken = Math.floor(timeTaken / 60000);
            const secondsTaken = Math.floor((timeTaken % 60000) / 1000);
            message = `¡Felicidades! Acertaste la palabra "${wordToGuess}" en ${minutesTaken}:${secondsTaken < 10 ? '0' : ''}${secondsTaken} minutos`;
            updateStats(true, currentAttempt + 1);
        } else {
            message = `No lograste acertar, palabra correcta: "${wordToGuess}"`;
            updateStats(false, currentAttempt + 1);
        }
    
        showModal(message, `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`);
        showStats();
        startCountdown();
        keyboard.classList.add("disabled");
    
        const gameData = {
            message,
            countdownText: `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`,
            statsHTML: document.getElementById("postGameStats").innerHTML
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
        showPostGameScreen(gameData);
    }

    function saveGame(endTime = null) {
        const gameData = {
            currentAttempt,
            currentGuess,
            gameBoard,
            endTime,
            message: modalMessage.innerHTML,
            countdownText: modalCountdown.innerHTML,
            statsHTML: postGameStats.innerHTML
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
    }

    function initializeGame() {
    if (wordDictionary.length === 0) {
        console.error("El diccionario no se ha cargado correctamente.");
        return;
    }

    board.innerHTML = ""; // Limpiar el tablero antes de inicializar
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
            const keyDiv = document.createElement("div");
            keyDiv.classList.add("key");
            keyDiv.textContent = key;
            keyDiv.setAttribute("data-key", key); // Agregar atributo data-key
            keyDiv.addEventListener("click", () => handleKeyPress(key));
            rowDiv.appendChild(keyDiv);
        });
        keyboard.appendChild(rowDiv);
    });

    // Encontrar la fila donde se desea agregar las teclas ENTER y DELETE
    const bottomRow = document.querySelector(".key-row:last-child");

    // Crear y agregar la tecla ENTER
    const enterKey = document.createElement("div");
    enterKey.classList.add("key", "special-key");
    enterKey.textContent = "ENTER";
    enterKey.setAttribute("data-key", "Enter"); // Agregar atributo data-key
    enterKey.addEventListener("click", checkGuess);
    bottomRow.insertBefore(enterKey, bottomRow.firstChild);

    // Crear y agregar la tecla DELETE
    const deleteKey = document.createElement("div");
    deleteKey.classList.add("key", "special-key");
    deleteKey.textContent = "DELETE";
    deleteKey.setAttribute("data-key", "Backspace"); // Agregar atributo data-key
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

        if (!wordDictionary.includes(currentGuess)) {
            showShakeAnimation();
            return;
        }

        const tiles = document.querySelectorAll(".tile");
        for (let i = 0; i < 5; i++) {
            const keyElement = document.querySelector(`.key[data-key="${currentGuess[i]}"]`);
            if (currentGuess[i] === wordToGuess[i]) {
                tiles[currentAttempt * 5 + i].classList.add("correct");
                gameBoard[currentAttempt][i] = "🟩";
                if (keyElement) {
                    keyElement.classList.remove("present", "absent");
                    keyElement.classList.add("correct");
                }
            } else if (wordToGuess.includes(currentGuess[i])) {
                tiles[currentAttempt * 5 + i].classList.add("present");
                gameBoard[currentAttempt][i] = "🟨";
                if (keyElement && !keyElement.classList.contains("correct")) {
                    keyElement.classList.remove("absent");
                    keyElement.classList.add("present");
                }
            } else {
                tiles[currentAttempt * 5 + i].classList.add("absent");
                gameBoard[currentAttempt][i] = "⬛";
                if (keyElement && !keyElement.classList.contains("correct") && !keyElement.classList.contains("present")) {
                    keyElement.classList.add("absent");
                }
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

    function showShakeAnimation() {
        const tiles = document.querySelectorAll(".tile");
        for (let i = 0; i < 5; i++) {
            tiles[currentAttempt * 5 + i].classList.add("shake");
        }
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                tiles[currentAttempt * 5 + i].classList.remove("shake");
            }
        }, 500);
    }

    function updateStats(won, attempts) {
        stats.gamesPlayed++;
        if (won) {
            stats.gamesWon++;
            stats.currentStreak++;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
        } else {
            stats.currentStreak = 0;
        }
        stats.guessDistribution[attempts - 1]++;
        localStorage.setItem("wordleStats", JSON.stringify(stats));
    }

    function showStats() {
        const winPercentage = ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(2);
        const statsHTML = `
            <h2>Estadísticas</h2>
            <p> Jugadas: ${stats.gamesPlayed}</p>
            <p> Victorias: ${winPercentage}%</p>
            <p> Racha Actual: ${stats.currentStreak}</p>
            <p> Mejor Racha: ${stats.maxStreak}</p>
            <p>
                ${stats.guessDistribution.map((count, index) => 
                    `${index + 1}: ${count} (${((count / stats.gamesPlayed) * 100).toFixed(2)}%)`
                ).join('<br>')}
            </p>`;
        console.log(statsHTML); // Verificar el contenido generado
        document.getElementById("postGameStats").innerHTML = statsHTML;
    }

    function loadSavedGame(data) {
        currentAttempt = data.currentAttempt;
        currentGuess = data.currentGuess;
        gameBoard = data.gameBoard;
    
        if (data.boardState) {
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
        }
    
        if (currentAttempt >= 6 || currentGuess === wordToGuess) {
            showPostGameScreen(data);
        }
    }

    function showModal(message, countdownText) {
        modalMessage.innerHTML = message;
        modalCountdown.innerHTML = countdownText;
        modal.classList.remove("hidden");
        modal.style.display = "block"; // Asegurarse de que el modal se muestre
    }

    function showMessage(text) {
        messageElement.textContent = text;
        messageElement.classList.remove("hidden");
        setTimeout(() => {
            messageElement.classList.add("hidden");
        }, 2000);
    }

    function showResult(data) {
        resultElement.innerHTML = data;
        resultElement.classList.remove("hidden");
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
        modal.classList.add("hidden");
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
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/1.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/2.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/3.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/3x.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/4.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/5.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/6.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/7.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/8.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/9.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/10.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/11.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/12.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/13.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/14.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/15.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/32.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/44.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/BASEDCIGAR.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/catJam.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Nerd.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/happi.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/JIJO.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/nowaying.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/omegalul.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Nerdd.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/sadcat.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Sadge.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/nerd.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Nerdge.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/SadVegeta.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/sigma.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/sigmaArrive.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/yipe.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/yump.gif?raw=true'
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

let wordDictionary = [];

fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/diccionario.txt')
    .then(response => response.text())
    .then(text => {
        wordDictionary = text.split('\n').map(word => word.trim().toUpperCase());
        initializeGame(); // Inicializa el juego después de cargar el diccionario
    });