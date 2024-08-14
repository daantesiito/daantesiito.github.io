document.getElementById('searchBar').addEventListener('input', async function() {
    const query = this.value;
    const emotePreview = document.getElementById('emotePreview');
    emotePreview.innerHTML = ''; // Limpiar la vista previa

    if (query.length > 2) { // Realiza la búsqueda solo si hay más de 2 caracteres
        const response = await fetch(`https://7tv.io/v3/gql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationName: "SearchEmotes",
                variables: { query, limit: 10 },
                query: `
                    query SearchEmotes($query: String!, $limit: Int!) {
                        emotes(query: $query, limit: $limit) {
                            id
                            name
                            urls
                        }
                    }
                `
            })
        });

        const data = await response.json();

        data.data.emotes.forEach(emote => {
            const img = document.createElement('img');
            img.src = emote.urls[1][1]; // Asumiendo que la URL de la imagen se encuentra en esta posición
            img.alt = emote.name;
            img.addEventListener('click', () => selectEmote(emote));
            emotePreview.appendChild(img);
        });
    }
});

function selectEmote(emote) {
    const selectedEmote = document.getElementById('selectedEmote');
    selectedEmote.innerHTML = `<img src="${emote.urls[3][1]}" alt="${emote.name}">`; // Usar una imagen de mayor resolución
}
