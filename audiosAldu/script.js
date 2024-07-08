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
        const audioRef = storageRef.child(`audiosAldu/${username}_${timestamp}.mp4`);

        try {
            await audioRef.put(audioBlob);
            alert('Audio subido exitosamente.');
            location.reload();
        } catch (error) {
            alert('Error al subir el audio: ' + error.message);
        }
    } else {
        alert('Por favor complete todos los campos.');
    }
}

async function confirmAndUploadImage() {
    const file = document.getElementById('imageInput').files[0];
    const username = document.getElementById('username').value;

    if (file && username) {
        const storageRef = firebase.storage().ref();
        const timestamp = Date.now();
        const imageRef = storageRef.child(`imagesAldu/${username}_${timestamp}_${file.name}`);

        try {
            await imageRef.put(file);
            alert('Imagen subida exitosamente.');
            location.reload();
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        }
    } else {
        alert('Por favor complete todos los campos.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let numEmotes = 200;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        numEmotes = 50;
    }
    const emoteSources = [
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/CAUGHT.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/51.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/omegalul.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/RUNN.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/34.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/44.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/BASEDCIGAR.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bautiCumers.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/blabbering.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/boner.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/catJam.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/classic.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/eh.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ESKIZO.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/happi.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/JIJO.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/KickTime.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/muga.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/nowaying.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/QUEDICE.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sigma.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sigmaArrive.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/WHISTLING.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yump.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/zidane.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/agusbob.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ahmm.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/aldu.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bana.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bauti.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/coscu.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/davo.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/flor.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/franquito.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/Gayge.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/hornet.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/HUH.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/isma.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/JE.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/lolo.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/MAJ.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/mirko.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/momo.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/morte.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ok.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/rc.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/SAJ.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/spreen.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sus.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/wideDude.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yutanita.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yutabt.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/32.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/CocaCola.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/DojaVibe.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/hardstuck.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yipe.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/raveGirl.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/polenta.png?raw=true' // Aquí puedes agregar más GIFs separados por comas si lo deseas
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