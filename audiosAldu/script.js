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
        const audioRef = storageRef.child(`audiosAldu/${username}_${timestamp}.wav`);

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