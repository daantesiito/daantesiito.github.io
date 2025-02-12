const username = localStorage.getItem("username");
const userInfo = document.getElementById("userInfo");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userAvatarUrl = localStorage.getItem("userAvatar");
const container = document.querySelector(".container"); // Asegúrate de que el contenedor esté oculto por defecto

const firebaseConfig = {
    apiKey: "AIzaSyBRosYDuCKZYyalwORP1nhKFWD67rhAtAM",
    authDomain: "twitch-bf66f.firebaseapp.com",
    databaseURL: "https://twitch-bf66f-default-rtdb.firebaseio.com",
    projectId: "twitch-bf66f",
    storageBucket: "twitch-bf66f.firebasestorage.app",
    messagingSenderId: "1077601562307",
    appId: "1:1077601562307:web:0b1299de9de0b1360bbc76",
    measurementId: "G-PTK4PBJ1KG"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

if (!username) {
    loginWithTwitchButton.style.display = "block";
    container.classList.add("hidden"); // Oculta el contenedor del juego
} else {
    loginWithTwitchButton.style.display = "none";
    userInfo.classList.remove("hidden");
    userAvatar.src = userAvatarUrl;
    userName.textContent = `Username: ${username}`;
    container.classList.remove("hidden");
}

loginWithTwitchButton.addEventListener("click", () => {
    const clientId = '9atac9btbos4bjh4qms4kawv2eiyyt';
    const redirectUri = 'https://daantesiito.github.io/2048/';
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
                    'Client-Id': '9atac9btbos4bjh4qms4kawv2eiyyt'
                }
            })
            .then(response => response.json())
            .then(data => {
                const user = data.data[0];

                // Guardar información del usuario en localStorage
                localStorage.setItem("username", user.display_name);
                localStorage.setItem("userAvatar", user.profile_image_url);

                // Actualizar la UI
                loginWithTwitchButton.style.display = "none";
                userInfo.classList.remove("hidden");
                userAvatar.src = user.profile_image_url;
                userName.textContent = `Username: ${user.display_name}`;
                container.classList.remove("hidden");

                // Crear un archivo vacío con el userName en la carpeta TwitchdleUsernames
                const userRef = database.ref('2048Usernames/' + user.display_name);
                userRef.set(true);                 

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