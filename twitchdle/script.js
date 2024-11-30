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
const database = firebase.database();

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
    const lastPlayedDate = new Date(localStorage.getItem("lastPlayedDate")).toDateString();
    const today = new Date().toDateString();
    const lastPlayedTimestamp = localStorage.getItem("lastPlayedTimestamp");
    const isNewDay = !lastPlayedTimestamp || new Date(parseInt(lastPlayedTimestamp)).toDateString() !== now.toDateString();
    const startDate = new Date('2024-11-30'); // Cambia esta fecha según sea necesario
    let wordDictionary = [];
    let wordList = [];
    let wordToGuess = "";
    let countdown;

    function initializeGame() {
        console.log("Inicializando el juego...");
        if (wordList.length === 0) {
            console.error("El wordList no se ha cargado correctamente.");
            return;
        }
    
        const today = new Date().toDateString();
        const startDate = new Date('2023-01-01'); // Cambia esta fecha según sea necesario
        const dayIndex = Math.floor((new Date(today) - startDate) / (1000 * 60 * 60 * 24)) % wordList.length;
        wordToGuess = wordList[dayIndex];
        console.log("Palabra a adivinar:", wordToGuess);
    
        const wordLength = wordToGuess.length;
    
        // Reiniciar el estado del juego
        currentAttempt = 0;
        currentGuess = "";
        gameBoard = Array(6).fill("").map(() => Array(wordLength).fill("⬛"));
    
        board.innerHTML = ""; // Limpiar el tablero antes de inicializar
        for (let i = 0; i < 6 * wordLength; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
        }
    
        // Limpiar el contenido del teclado antes de agregar nuevas filas de teclas
        keyboard.innerHTML = "";
    
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
    
        // Iniciar el temporizador
        startTime = new Date();
    }
        
    let startTime;
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

        console.log("savedGame:", savedGame);
        console.log("gameFinished:", gameFinished);
        console.log("lastPlayedDate:", lastPlayedDate);
        console.log("today:", today);

        if (savedGame && lastPlayedDate === today) {
            const gameData = JSON.parse(savedGame);
            console.log("Juego guardado encontrado:", gameData);
            if (gameFinished === "true") {
                showPostGameScreen(gameData);
            } else {
                loadSavedGame(gameData);
            }
        } else {
            if (lastPlayedDate !== today) {
                console.log("Nuevo día detectado, inicializando nuevo juego...");
                localStorage.removeItem("wordleGame");
                localStorage.setItem("lastPlayedDate", today);
                localStorage.setItem("gameFinished", "false");
                initializeGame();
            }
        }

        // Cargar el wordList y el diccionario desde los archivos de texto
        Promise.all([
            fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/wordList.txt')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    wordList = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
                    console.log("Contenido del archivo wordList.txt:", wordList); // Verificar el contenido del archivo
                    if (!Array.isArray(wordList)) {
                        throw new Error("El wordList no se ha cargado correctamente.");
                    }
                })
                .catch(error => console.error('Error loading wordList:', error)),

            fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/diccionario.txt')
                .then(response => response.text())
                .then(text => {
                    wordDictionary = text.split('\n').map(word => word.trim().toUpperCase());
                    console.log("Contenido del archivo diccionario.txt:", wordDictionary); // Verificar el contenido del archivo
                })
                .catch(error => console.error('Error loading wordDictionary:', error))
        ]).then(() => {
            // Inicializamos el juego después de cargar ambos archivos
            if (wordList.length > 0 && wordDictionary.length > 0) {
                initializeGame();
            } else {
                console.error("El wordList o el wordDictionary no se han cargado correctamente.");
            }
        });
    }
    
    loginWithTwitchButton.addEventListener("click", () => {
        const clientId = '0oy4xx9zsvkxsbgwm6n0rmb28xtivy';
        const redirectUri = 'http://localhost:8000/';
        const scope = 'user:read:email';
        const responseType = 'token';
    
        // Codificar la URL
        const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
    
        // Redirigir a Twitch
        window.location.href = twitchAuthUrl;
    });

    function handleTwitchAuth() {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // Elimina el #
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
    
                    // Guardar información del usuario en localStorage
                    localStorage.setItem("username", user.display_name);
                    localStorage.setItem("userAvatar", user.profile_image_url);
                    localStorage.setItem("lastPlayedDate", new Date().toDateString());
    
                    // Actualizar la UI
                    loginWithTwitchButton.style.display = "none";
                    userInfo.classList.remove("hidden");
                    userAvatar.src = user.profile_image_url;
                    userName.textContent = `Logged in as: ${user.display_name}`;
                    container.classList.remove("hidden");
    
                    // Crear un archivo vacío con el userName en la carpeta TwitchdleUsernames
                    const userRef = database.ref('TwitchdleUsernames/' + user.display_name);
                    userRef.set(true);
    
                    // Cargar el wordList y el diccionario desde los archivos de texto
                    Promise.all([
                        fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/wordList.txt')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then(text => {
                                wordList = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
                                console.log("Contenido del archivo wordList.txt:", wordList); // Verificar el contenido del archivo
                                if (!Array.isArray(wordList)) {
                                    throw new Error("El wordList no se ha cargado correctamente.");
                                }
                            })
                            .catch(error => console.error('Error loading wordList:', error)),
    
                        fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/diccionario.txt')
                            .then(response => response.text())
                            .then(text => {
                                wordDictionary = text.split('\n').map(word => word.trim().toUpperCase());
                                console.log("Contenido del archivo diccionario.txt:", wordDictionary); // Verificar el contenido del archivo
                            })
                            .catch(error => console.error('Error loading wordDictionary:', error))
                    ]).then(() => {
                        // Inicializamos el juego después de cargar ambos archivos
                        if (wordList.length > 0 && wordDictionary.length > 0) {
                            initializeGame();
                        } else {
                            console.error("El wordList o el wordDictionary no se han cargado correctamente.");
                        }
                    });
    
                    // Limpiar la URL para eliminar los parámetros después del #
                    history.replaceState(null, '', window.location.pathname);
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
        console.log("Mostrando pantalla de post-juego...");
        console.log("Datos del juego:", data);
    
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
                const minutesTaken = Math.floor(timeTaken / 60000);
                const secondsTaken = Math.floor((timeTaken % 60000) / 1000);
                message = `Acertaste la palabra "${wordToGuess}" en ${minutesTaken}:${secondsTaken < 10 ? '0' : ''}${secondsTaken} minutos`;
            } else {
                message = `No lograste acertar, palabra correcta: "${wordToGuess}"`;
            }
        }
    
        postGameMessage.innerHTML = `<p>${message}</p>`;
        postGameCountdown.innerHTML = `<p>${countdownText}</p>`;
        if (data.gameBoard) {
            const gameBoardText = data.gameBoard
                .filter(row => row.some(cell => cell !== "⬛")) // Filtrar filas que no están completamente llenas de cuadrados negros
                .map(row => row.join("")).join("<br>");
            postGameMessage.innerHTML += `<p>${gameBoardText}</p>`;
        }
        console.log("Ocultando container y mostrando postGame...");
        postGame.classList.remove("hidden");
        postGame.classList.add("visible");
        container.classList.add("hidden");
        container.classList.remove("visible");
    
        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.classList.add("hidden");
    
        showStats();
    }

    function endGame(endTime = null) {
        console.log("Terminando el juego...");
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

        // Calcular el tiempo transcurrido
        const timeTaken = endTime - startTime;
        const minutesTaken = Math.floor(timeTaken / 60000);
        const secondsTaken = Math.floor((timeTaken % 60000) / 1000);

        let message;
        if (currentGuess === wordToGuess) {
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
            currentAttempt,
            currentGuess,
            gameBoard,
            message,
            countdownText: `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`,
            statsHTML: document.getElementById("postGameStats").innerHTML,
            gameFinished: true,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
        localStorage.setItem("gameFinished", "true");
    }

    function saveGame(endTime = null) {
        console.log("Guardando el juego...");
        const gameData = {
            currentAttempt,
            currentGuess,
            gameBoard,
            endTime,
            message: modalMessage.innerHTML,
            countdownText: modalCountdown.innerHTML,
            statsHTML: postGameStats.innerHTML,
            boardState: Array.from(document.querySelectorAll(".tile")).map(tile => tile.textContent)
        };
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
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
        if (currentGuess.length !== wordToGuess.length) {
            showMessage(`La palabra debe tener ${wordToGuess.length} letras.`);
            return;
        }
    
        const tiles = document.querySelectorAll(".tile");
        const guessArray = currentGuess.split("");
        const wordArray = wordToGuess.split("");
        const letterCount = {};
    
        // Contar las letras en la palabra a adivinar
        wordArray.forEach(letter => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });
    
        // Marcar las letras correctas (verdes)
        guessArray.forEach((letter, index) => {
            if (letter === wordArray[index]) {
                tiles[currentAttempt * wordToGuess.length + index].classList.add("correct");
                gameBoard[currentAttempt][index] = "🟩";
                letterCount[letter]--;
            }
        });
    
        // Marcar las letras presentes (amarillas) y ausentes (negras)
        guessArray.forEach((letter, index) => {
            if (letter !== wordArray[index]) {
                if (wordArray.includes(letter) && letterCount[letter] > 0) {
                    tiles[currentAttempt * wordToGuess.length + index].classList.add("present");
                    gameBoard[currentAttempt][index] = "🟨";
                    letterCount[letter]--;
                } else {
                    tiles[currentAttempt * wordToGuess.length + index].classList.add("absent");
                    gameBoard[currentAttempt][index] = "⬛";
                }
            }
        });
    
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

                // Enviar la racha más larga a Firebase
                const username = localStorage.getItem("username");
                if (username) {
                    const streakRef = database.ref('longestStreakTwitchdle/' + username);
                    streakRef.set(stats.maxStreak);
                }
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
        console.log("Estadísticas generadas:", statsHTML); // Verificar el contenido generado
        document.getElementById("postGameStats").innerHTML = statsHTML;
    }

    function loadSavedGame(data) {
        console.log("Cargando el juego guardado...");
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
    
        if (currentAttempt >= 6 || currentGuess === wordToGuess || data.gameFinished) {
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
        const updateCountdown = () => {
            const now = new Date();
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
    
            const diff = nextDay - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
            postGameCountdown.innerHTML = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;
        };
    
        updateCountdown();
        countdown = setInterval(updateCountdown, 1000);
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
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Nerdd.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/sadcat.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Sadge.gif?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/nerd.png?raw=true',
                'https://github.com/daantesiito/daantesiito.github.io/blob/main/twitchdle/media/7tv/Nerdge.gif?raw=true',
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