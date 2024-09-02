let allEmotes = [];  // Variable global para almacenar los emotes cargados

document.getElementById('loadEmotes').addEventListener('click', async function() {
    const setID = document.getElementById('emoteSetID').value;
    const searchBar = document.getElementById('searchBar');
    const previewArea = document.getElementById('previewArea');
    const selectedEmotes = document.getElementById('selectedEmotes');

    if (!setID || allEmotes.length > 0) return; // Evitar recargar si ya se cargó o no hay ID

    try {
        // Muestra mensaje de carga
        previewArea.innerHTML = '<p>Cargando Emotes...</p>';

        const response = await fetch(`https://7tv.io/v3/emote-sets/${setID}`);
        if (!response.ok) throw new Error('Set ID no encontrado.');

        const data = await response.json();
        allEmotes = data.emotes;  // Guardamos los emotes en una lista para evitar recargas

        console.log(`Set de emotes cargado: ${data.name} (${allEmotes.length} emotes)`);

        searchBar.disabled = false;
        
        // Oculta el mensaje de carga cuando los emotes están listos
        previewArea.innerHTML = '';

        // Mostrar todos los emotes al inicio
        displayEmotes(allEmotes);

        // Filtrar emotes al escribir en la barra de búsqueda
        searchBar.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase();
            const filteredEmotes = allEmotes.filter(emote => emote.name.toLowerCase().includes(searchQuery));
            displayEmotes(filteredEmotes);
        });

    } catch (error) {
        console.error('Error al cargar el set de emotes:', error.message);
    }
});

function displayEmotes(emotes) {
    const previewArea = document.getElementById('previewArea');
    previewArea.innerHTML = '';  // Limpiar el área de previsualización
    emotes.forEach(async (emote) => {
        const baseUrl = `https://${emote.data.host.url}/2x`;

        // Prueba la imagen .png
        let emoteUrl = `${baseUrl}.png`;
        let imageUrl = await verifyImageUrl(emoteUrl);

        // Si .png no existe, prueba la imagen .gif
        if (!imageUrl) {
            emoteUrl = `${baseUrl}.gif`;
            imageUrl = await verifyImageUrl(emoteUrl);
        }

        if (imageUrl) {
            const emoteImg = document.createElement('img');
            emoteImg.src = imageUrl;
            emoteImg.alt = emote.name;
            emoteImg.classList.add('emote');

            emoteImg.addEventListener('click', function() {
                const isZeroWidth = emote.data.flags === 256; // Se utiliza el flag correcto

                const selectedEmotes = document.getElementById('selectedEmotes');
                if (isZeroWidth && selectedEmotes.lastChild) {
                    // Superpone el Zero-Width Emote al último emote seleccionado
                    const zeroWidthImg = document.createElement('img');
                    zeroWidthImg.src = imageUrl;
                    zeroWidthImg.alt = emote.name;
                    zeroWidthImg.classList.add('zero-width-emote');
                    selectedEmotes.lastChild.appendChild(zeroWidthImg);
                } else {
                    const emoteContainer = document.createElement('div');
                    emoteContainer.classList.add('emote-container');
                    emoteContainer.style.position = 'relative'; // Asegura que el contenedor sea relativo para la superposición
                    emoteContainer.tabIndex = 0; // Hace que el contenedor sea focuseable

                    const selectedImg = document.createElement('img');
                    selectedImg.src = this.src;
                    selectedImg.alt = this.alt;
                    selectedImg.classList.add('selected-emote');

                    emoteContainer.appendChild(selectedImg);
                    selectedEmotes.appendChild(emoteContainer);

                    emoteContainer.addEventListener('keydown', function(event) {
                        if (event.key === 'Backspace') {
                            selectedEmotes.removeChild(emoteContainer);
                        }
                    });
                }
            });

            previewArea.appendChild(emoteImg);
        }
    });
}

async function verifyImageUrl(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return url;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
