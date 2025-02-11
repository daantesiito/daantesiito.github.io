// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA4jwDsKA3OfzGx59iEZixdTGc9ilq0JxA",
    authDomain: "pasapalabra-a1320.firebaseapp.com",
    databaseURL: "https://pasapalabra-a1320-default-rtdb.firebaseio.com/",
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
    const startDate = new Date('2024-12-12'); // Cambia esta fecha según sea necesario
    let wordDictionary = [];
    let wordList = [];
    let wordToGuess = "";
    let countdown;
    let keyboardState = {}; // Cambiar de const a let    

    function initializeGame() {
        //console.log("Inicializando el juego...");
        startTime = new Date(); // Establecer el tiempo de inicio
        //console.log("Hora de inicio:", startTime);
    
        if (wordList.length === 0) {
            //console.error("El wordList no se ha cargado correctamente.");
            return;
        }
    
        const today = new Date().toDateString();
        const dayIndex = Math.floor((new Date(today) - startDate) / (1000 * 60 * 60 * 24)) % wordList.length;
        wordToGuess = wordList[dayIndex];
        //console.log("Palabra a adivinar:", wordToGuess);
    
        const wordLength = wordToGuess.length;
    
        // Reiniciar el estado del juego
        currentAttempt = 0;
        currentGuess = "";
        gameBoard = Array(6).fill("").map(() => Array(wordLength).fill("⬛"));
    
        // Configurar el tablero dinámicamente
        const board = document.getElementById("board");
        board.style.gridTemplateColumns = `repeat(${wordLength}, 60px)`;
        board.innerHTML = ""; // Limpiar el tablero
    
        for (let i = 0; i < 6 * wordLength; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
        }
    
        // Reiniciar estado del teclado y cargarlo
        keyboardState = {};
        loadKeyboard(keyboardState);

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
        userName.textContent = `Username: ${username}`;
        container.classList.remove("hidden");
    
        //console.log("savedGame:", savedGame);
        //console.log("gameFinished:", gameFinished);
        //console.log("lastPlayedDate:", lastPlayedDate);
        //console.log("today:", today);
    
        loadRequiredFiles()
            .then(() => {
                console.log("Archivos cargados correctamente.");
    
                if (savedGame && lastPlayedDate === today) {
                    const gameData = JSON.parse(savedGame);
                
                    if (gameFinished === "true") {
                        //console.log("El juego ya terminó. Mostrando pantalla de post-juego.");
                        showPostGameScreen(gameData);
                    } else {
                        //console.log("Cargando juego guardado...");
                        loadSavedGame(gameData);
                    }
                } else {
                    //console.log("Iniciando un nuevo juego...");
                    localStorage.setItem("lastPlayedDate", today);
                    localStorage.setItem("gameFinished", "false");
                    initializeGame();
                }                                                            
            })
            .catch(error => {
                console.error("Error: No se pudieron cargar los archivos necesarios.", error);
            });
    }     
    
    loginWithTwitchButton.addEventListener("click", () => {
        const clientId = '0oy4xx9zsvkxsbgwm6n0rmb28xtivy';
        const redirectUri = 'https://daantesiito.github.io/twitchdle/';
        //const redirectUri = 'http://localhost:8000/';
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
                    userName.textContent = `Username: ${user.display_name}`;
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
                                //console.log("Contenido del archivo wordList.txt:", wordList); // Verificar el contenido del archivo
                                if (!Array.isArray(wordList)) {
                                    throw new Error("El wordList no se ha cargado correctamente.");
                                }
                            })
                            .catch(error => console.error('Error loading wordList:', error)),
                    
                        fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/diccionario.txt')
                            .then(response => response.text())
                            .then(text => {
                                wordDictionary = text.split('\n').map(word => word.trim().toUpperCase());
                                //console.log("Contenido del archivo diccionario.txt:", wordDictionary); // Verificar el contenido del archivo
                            })
                            .catch(error => console.error('Error loading wordDictionary:', error))
                    ])
                    .then(() => {
                        if (wordList.length > 0 && wordDictionary.length > 0) {
                            if (!savedGame || lastPlayedDate !== today) {
                                initializeGame();
                            }
                        } else {
                            //console.error("Error: No se pudieron cargar wordList o wordDictionary.");
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
        userName.textContent = `Username: ${username}`;
        container.classList.remove("hidden");
    }

    function showPostGameScreen(data) {
        //console.log("Mostrando pantalla de post-juego...");
        //console.log("Datos del juego:", data);
    
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
    
        const diff = nextDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
        const countdownText = `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`;
    
        // Usa el mensaje correcto o uno alternativo
        let message = data.message;
        if (!message) {
            if (data.currentGuess === data.wordToGuess) {
                message = `¡Felicidades! Acertaste la palabra "${data.wordToGuess}"`;
            } else {
                message = `No lograste acertar, palabra correcta: "${data.wordToGuess || "Desconocida"}"`;
            }
        }

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

        // Mostrar estadísticas
        if (data.stats) {
            stats = data.stats; // Recupera las estadísticas guardadas
        }

        if (data.gameBoard) {
            const gameBoardText = data.gameBoard
                .slice(0, data.currentAttempt + 1) // Mostrar solo hasta el último intento
                .map(row => row.join(""))
                .join("<br>");
            postGameMessage.innerHTML += `<p>${gameBoardText}</p>`;
        }        

        // Ocultar elementos del juego y mostrar el post-juego
        container.classList.add("hidden");
        container.classList.remove("visible");
        postGame.classList.remove("hidden");
        postGame.classList.add("visible");

        board.classList.add("hidden");
        keyboard.classList.add("hidden");
        messageElement.classList.add("hidden");
        resultElement.classList.add("hidden");

        //console.log("Datos del juego recibidos:", data);
        //console.log("Palabra a adivinar:", data.wordToGuess);
        //console.log("Mensaje:", data.message);
        //console.log("Mensaje enviado al post-juego:", data.message);
        //console.log("Palabra correcta:", data.wordToGuess);

        startCountdown();

        showStats();
    }

    function endGame(endTime = new Date()) {
        //console.log("Terminando el juego...");
    
        if (!startTime || !(startTime instanceof Date)) {
            //console.error("startTime no está definido correctamente.");
            startTime = new Date();
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

        //console.log("Mensaje generado:", message);
    
        const gameData = {
            currentAttempt,
            currentGuess,
            gameBoard,
            message, // Incluye el mensaje generado
            wordToGuess, // Incluye la palabra correcta
            gameFinished: true,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            stats: stats, // Incluye las estadísticas
        };
        
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
        //console.log("Datos del juego guardados:", gameData);
        
        
        // Guarda el estado del juego en localStorage
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
        localStorage.setItem("wordleStats", JSON.stringify(stats)); // Guarda las estadísticas actualizadas
        localStorage.setItem("gameFinished", "true");        

        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        showModal(message, `Siguiente palabra en: ${hours}h ${minutes}m ${seconds}s`);
    }

    function saveGame() {
        const tiles = Array.from(document.querySelectorAll(".tile"));
        const boardState = tiles.map(tile => ({
            letter: tile.textContent,
            class: Array.from(tile.classList).find(cls => ["correct", "present", "absent"].includes(cls)) || "",
        }));
    
        const gameData = {
            currentAttempt,
            currentGuess,
            gameBoard,
            boardState,
            keyboardState, // Asegura que el estado del teclado se guarde
            wordToGuess,
            gameFinished: localStorage.getItem("gameFinished") === "true",
        };
    
        localStorage.setItem("wordleGame", JSON.stringify(gameData));
        //console.log("Juego guardado:", gameData);
    }    

    function loadRequiredFiles() {
        return Promise.all([
            fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/wordList.txt')
                .then(response => response.text())
                .then(text => {
                    wordList = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
                    //console.log("WordList cargado correctamente:", wordList.length, "palabras.");
                })
                .catch(error => {
                    //console.error('Error cargando wordList:', error);
                    throw error; // Re-lanzar para manejarlo arriba
                }),
    
            fetch('https://raw.githubusercontent.com/daantesiito/daantesiito.github.io/main/twitchdle/words/diccionario.txt')
                .then(response => response.text())
                .then(text => {
                    wordDictionary = text.split('\n').map(word => word.trim().toUpperCase());
                    //console.log("Diccionario cargado correctamente:", wordDictionary.length, "palabras.");
                })
                .catch(error => {
                    //console.error('Error cargando wordDictionary:', error);
                    throw error; // Re-lanzar para manejarlo arriba
                })
        ]);
    }               

    function handleKeyPress(key) {
        //console.log("Tecla presionada:", key);
    
        const wordLength = wordToGuess.length;
    
        if (currentGuess.length < wordLength) {
            currentGuess += key;
            //console.log("currentGuess actualizado:", currentGuess);
            updateBoard();
        } else {
            //console.log("No se puede agregar más letras a currentGuess.");
        }
    }   
         

    function updateBoard() {
        const tiles = document.querySelectorAll(".tile");
        const wordLength = wordToGuess.length;
    
        for (let i = 0; i < wordLength; i++) {
            const index = currentAttempt * wordLength + i;
            tiles[index].textContent = currentGuess[i] || ""; // Muestra la letra o vacío
        }
    
        updateKeyboard();
        saveGame(); // Asegura que el progreso se guarde
    }   
    
    
    function updateKeyboard() {
        gameBoard.forEach(row => {
            row.forEach((cell, index) => {
                if (cell !== "⬛") {
                    const letter = row[index];
                    const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
                    if (keyElement) {
                        const newState = 
                            cell === "🟩" ? "correct" :
                            cell === "🟨" ? "present" : "absent";
    
                        // Actualiza el estado global si es necesario
                        if (!keyboardState[letter] || keyboardState[letter] !== "correct") {
                            keyboardState[letter] = newState;
                        }
    
                        // Aplica las clases acumulativas
                        keyElement.classList.remove("correct", "present", "absent");
                        keyElement.classList.add(keyboardState[letter]);
                    }
                }
            });
        });
    }
    

    function checkGuess() {
        if (currentGuess.length !== wordToGuess.length) {
            showMessage(`La palabra debe tener ${wordToGuess.length} letras.`);
            return;
        }
    
        // Verificar si la palabra existe en el diccionario
        //console.log("Diccionario cargado:", wordDictionary);
        //console.log("Intento actual:", currentGuess);

        // Verificar si la palabra existe en el diccionario
        if (!wordDictionary.includes(currentGuess.toUpperCase())) {
            showMessage("La palabra no existe en el diccionario.");
            showShakeAnimation(); // Llama a la función para realizar el shake
            return;
        }        
    
        const tiles = document.querySelectorAll(".tile");
        const guessArray = currentGuess.split("");
        const wordArray = wordToGuess.split("");
        const letterCount = {};

        wordArray.forEach(letter => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });

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
    
        // Actualizar el estado del teclado
        guessArray.forEach((letter, index) => {
            const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
            if (keyElement) {
                if (letter === wordArray[index]) {
                    keyboardState[letter] = "correct";
                } else if (wordArray.includes(letter) && keyboardState[letter] !== "correct") {
                    keyboardState[letter] = "present";
                } else if (!wordArray.includes(letter) && !keyboardState[letter]) {
                    keyboardState[letter] = "absent";
                }
    
                keyElement.classList.remove("correct", "present", "absent");
                keyElement.classList.add(keyboardState[letter]);
            }
        });
    
        // Asegúrate de que `startTime` esté definido
        if (!startTime || !(startTime instanceof Date)) {
            //console.error("startTime no está definido correctamente en checkGuess.");
            startTime = new Date(); // Establece un valor predeterminado
        }

        if (currentGuess === wordToGuess) {
            endGame(new Date());
        } else if (currentAttempt === 5) {
            endGame(new Date());
        } else {
            currentAttempt++;
            currentGuess = ""; // Reinicia para el siguiente intento
        }
        saveGame();
    }  

    function showShakeAnimation() {
        const tiles = document.querySelectorAll(".tile"); // Selecciona todos los casilleros
        const wordLength = wordToGuess.length; // Largo de la palabra
        const startIndex = currentAttempt * wordLength; // Índice inicial del intento actual
        const endIndex = startIndex + wordLength; // Índice final del intento actual
    
        // Aplica la animación solo a los casilleros del intento actual
        for (let i = startIndex; i < endIndex; i++) {
            tiles[i].classList.add("shake");
        }
    
        // Elimina la animación después de 500 ms
        setTimeout(() => {
            for (let i = startIndex; i < endIndex; i++) {
                tiles[i].classList.remove("shake");
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
            stats.guessDistribution[attempts - 1]++;
        } else {
            stats.currentStreak = 0;
        }
        localStorage.setItem("wordleStats", JSON.stringify(stats));
    }

    function showStats() {
        const winPercentage = stats.gamesPlayed > 0
            ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(2)
            : "0.00";
    
        const guessDistributionPercentage = stats.gamesWon > 0
            ? stats.guessDistribution.map(count => ((count / stats.gamesWon) * 100).toFixed(2))
            : Array(6).fill("0.00");
    
        const statsHTML = `
            <h2>Estadísticas</h2>
            <p> Jugadas: ${stats.gamesPlayed}</p>
            <p> Victorias: ${winPercentage}%</p>
            <p> Racha Actual: ${stats.currentStreak}</p>
            <p> Mejor Racha: ${stats.maxStreak}</p>
            <p>
                ${stats.guessDistribution.map((count, index) => 
                    `${index + 1}: ${count} (${guessDistributionPercentage[index]}%)`
                ).join('<br>')}
            </p>`;
        //console.log("Estadísticas generadas:", statsHTML);
        document.getElementById("postGameStats").innerHTML = statsHTML;
    }    

    // Función para cargar el estado guardado del juego
    function loadSavedGame(data) {
        //console.log("Cargando el juego guardado...");
    
        if (!wordToGuess || wordToGuess.length === 0) {
            if (wordList.length > 0) {
                const today = new Date().toDateString();
                const dayIndex = Math.floor((new Date(today) - startDate) / (1000 * 60 * 60 * 24)) % wordList.length;
                wordToGuess = wordList[dayIndex];
                //console.log("Palabra objetivo inicializada:", wordToGuess);
            } else {
                //console.error("Error: El wordList no está disponible para inicializar la palabra objetivo.");
                return;
            }
        }
    
        currentAttempt = data.currentAttempt || 0;
        currentGuess = data.currentGuess || "";
        gameBoard = data.gameBoard || Array(6).fill("").map(() => Array(wordToGuess.length).fill("⬛"));

        // Recuperar la palabra correcta del juego guardado
        if (data.wordToGuess) {
            wordToGuess = data.wordToGuess;
            //console.log("Palabra correcta recuperada:", wordToGuess);
        } else {
            //console.error("No se encontró wordToGuess en los datos guardados.");
            wordToGuess = "Desconocida"; // Valor por defecto
        }

        if (data.gameFinished) {
            //console.log("El juego ya terminó. Mostrando pantalla de post-juego.");
            showPostGameScreen(data);
            return;
        }

        //console.log("Reconstruyendo el tablero...");
        const wordLength = wordToGuess.length;
        const board = document.getElementById('board');
        board.style.gridTemplateColumns = `repeat(${wordLength}, 60px)`;
        board.innerHTML = "";

        for (let i = 0; i < 6 * wordLength; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
        }

        if (data.boardState) {
            const tiles = document.querySelectorAll(".tile");
            data.boardState.forEach((tileData, index) => {
                if (tiles[index]) {
                    tiles[index].textContent = tileData.letter || "";
                    if (tileData.class) {
                        tiles[index].classList.add(tileData.class);
                    }
                }
            });
        }

        // Cargar el estado del teclado
        keyboardState = data.keyboardState || {};
        loadKeyboard(keyboardState);

        //console.log("Teclado generado:", document.getElementById('keyboard').innerHTML);

        //console.log("Juego guardado cargado con éxito.");
    }
    

    function loadKeyboard(keyboardState) {
        const keyboardContainer = document.getElementById("keyboard");
        keyboardContainer.innerHTML = ""; // Limpiar el teclado
    
        // Definir las filas del teclado con teclas especiales en la última fila
        const rows = [
            { keys: "QWERTYUIOP", special: null },
            { keys: "ASDFGHJKL", special: null },
            { keys: "ZXCVBNM", special: { left: "ENTER", right: "DELETE" } },
        ];
    
        rows.forEach((row) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("key-row");
    
            // Agregar tecla especial izquierda (si existe)
            if (row.special?.left) {
                const leftKey = createKey(row.special.left, "special-key");
                rowDiv.appendChild(leftKey);
            }
    
            // Agregar teclas normales
            row.keys.split("").forEach((key) => {
                const keyDiv = createKey(key, "key");
                if (keyboardState[key]) {
                    keyDiv.classList.add(keyboardState[key]);
                }
                rowDiv.appendChild(keyDiv);
            });
    
            // Agregar tecla especial derecha (si existe)
            if (row.special?.right) {
                const rightKey = createKey(row.special.right, "special-key");
                rowDiv.appendChild(rightKey);
            }
    
            keyboardContainer.appendChild(rowDiv);
            //console.log("Estado del teclado cargado:", keyboardState);
            //console.log("Teclado generado (HTML):", document.getElementById("keyboard").innerHTML);
        });
    }
    
    function createKey(label, className) {
        const keyDiv = document.createElement("div");
        keyDiv.classList.add("key", className);
        keyDiv.textContent = label;
    
        if (label === "ENTER") {
            keyDiv.setAttribute("data-key", "Enter");
            keyDiv.addEventListener("click", checkGuess);
        } else if (label === "DELETE") {
            keyDiv.setAttribute("data-key", "Backspace");
            keyDiv.addEventListener("click", () => {
                if (currentGuess.length > 0) {
                    currentGuess = currentGuess.slice(0, -1);
                    updateBoard();
                }
            });
        } else {
            keyDiv.setAttribute("data-key", label);
            keyDiv.addEventListener("click", () => handleKeyPress(label));
        }
    
        return keyDiv;
    }    

    function showModal(message, countdownText) {
        modalMessage.innerHTML = message;
        modalCountdown.innerHTML = countdownText;
        modal.classList.remove("hidden");
        modal.style.display = "block"; // Mostrar el modal
    
        // Asegurarse de que cerrar el modal recarga la página
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            modal.classList.add("hidden");
            location.reload(); // Recargar la página para mostrar el postGame
        });
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
        //console.log("Evento de teclado capturado:", event.key);
        const key = event.key.toUpperCase();
        if (["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].join("").includes(key)) {
            handleKeyPress(key);
        } else if (event.key === "Enter") {
            checkGuess();
        } else if (event.key === "Backspace" && currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    });
    
});

if (location.hostname !== 'localhost') {
    (function () {
        const gtagScript = document.createElement('script');
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-4CJBHXXVWY";
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
    
        window.dataLayer = window.dataLayer || [];
        function gtag() {
        dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-4CJBHXXVWY');
    })();
}

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

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('instructionsToggleButton');
    const instructionsModal = document.getElementById('instructionsModal');
    const closeInstructionsModal = document.getElementById('closeInstructionsModal');

    if (toggleButton && instructionsModal && closeInstructionsModal) {
        toggleButton.addEventListener('click', () => {
            instructionsModal.classList.remove('hidden');
            instructionsModal.classList.add('visible');
        });

        closeInstructionsModal.addEventListener('click', () => {
            instructionsModal.classList.add('hidden');
            instructionsModal.classList.remove('visible');
        });

        window.addEventListener('click', (event) => {
            if (event.target === instructionsModal) {
                instructionsModal.classList.add('hidden');
                instructionsModal.classList.remove('visible');
            }
        });
    }
});