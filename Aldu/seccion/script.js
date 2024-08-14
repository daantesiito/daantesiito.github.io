const firebaseConfig = {
    apiKey: "AIzaSyBlsZmRgBEGkzgT3_c00CbEBqzYnVf4oYk",
    authDomain: "audiosweb-74dc8.firebaseapp.com",
    projectId: "audiosweb-74dc8",
    storageBucket: "audiosweb-74dc8.appspot.com",
    messagingSenderId: "865220172127",
    appId: "1:865220172127:web:54f3bf705dbae82b22feea",
    measurementId: "G-CTFJN6PC37"
};

firebase.initializeApp(firebaseConfig);

let mediaRecorder;
let audioChunks = [];
let audioBlob;

function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioPlayer = document.getElementById('audioPlayer');
                    audioPlayer.src = audioUrl;
                    audioPlayer.style.display = 'block';
                    document.getElementById('confirmButton').style.display = 'block';
                    document.getElementById('warningMessage').style.display = 'block';
                    document.getElementById('anonymInstructions').style.display = 'none';
                    document.getElementById('stopButton').style.display = 'none';
                };
                audioChunks = [];
                mediaRecorder.start();
                document.getElementById('uploadForm').style.display = 'none';
                document.getElementById('controls').style.display = 'block';
                document.getElementById('stopButton').disabled = false;
                document.getElementById('recordingMessage').style.display = 'block';
                document.getElementById('anonymInstructions').style.display = 'none';
            }).catch(function(err) {
                alert('Error al acceder al micrófono: ' + err.message);
            });
    } else {
        alert('getUserMedia no es soportado en este navegador.');
    }
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('stopButton').disabled = true;
    document.getElementById('recordingMessage').style.display = 'none';
}

function showImageUpload() {
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('anonymInstructions').style.display = 'none';
    document.getElementById('imageUploadForm').style.display = 'block';
}

async function confirmAndUploadAudio() {
    const username = document.getElementById('username').value;

    if (username) {
        const storageRef = firebase.storage().ref();
        const timestamp = Date.now();
        const audioRef = storageRef.child(`Aldu/audiosAldu/${username}_${timestamp}.wav`);

        try {
            await audioRef.put(audioBlob);
            alert('Audio subido exitosamente.');
            location.reload();
        } catch (error) {
            alert('Error al subir el audio: ' + error.message);
        }
    } else {
        alert('Por favor complete todos los campos. (Username)');
    }
}

async function confirmAndUploadImage() {
    const file = document.getElementById('imageInput').files[0];
    const username = document.getElementById('username').value;

    if (file && username) {
        const storageRef = firebase.storage().ref();
        const timestamp = Date.now();
        const imageRef = storageRef.child(`Aldu/imagesAldu/${username}_${timestamp}_${file.name}`);

        try {
            await imageRef.put(file);
            alert('Imagen subida exitosamente.');
            location.reload();
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        }
    } else {
        alert('Por favor complete todos los campos. (Username)');
    }
}

function showTextInput() {
    document.getElementById("textInputForm").style.display = "block";
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('recordingMessage').style.display = 'none';
    document.getElementById('anonymInstructions').style.display = 'none';
}

async function uploadText() {
    const username = document.getElementById("username").value;
    const textInput = document.getElementById("textInput").value;
    const textFileName = `${username}.txt`;

    if (textInput && username) {
        const blob = new Blob([textInput], { type: 'text/plain' });
        const storageRef = firebase.storage().ref().child(`Aldu/textoAldu/${textFileName}`);
        try {
            await storageRef.put(blob);
            alert("Texto subido exitosamente.");
            location.reload();
        } catch (error) {
            alert("Error al subir el texto: " + error.message);
        }
    } else {
        alert('Por favor complete todos los campos. (Username)');
    }
}

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

    for (let i = 0; i < numEmotes; i++) {
        const emote = document.createElement('img');
        emote.src = emoteSources[Math.floor(Math.random() * emoteSources.length)];
        emote.className = 'emote';
        emote.style.left = Math.random() * 100 + 'vw';
        emote.style.animationDuration = Math.random() * 5 + 5 + 's';
        emote.style.animationDelay = Math.random() * 6 + 's';
        document.body.appendChild(emote);
    }
});
