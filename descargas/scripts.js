async function fetchInstagramContent() {
    const link = document.getElementById('instagramLink').value;
    if (!link) {
        alert('Please enter an Instagram post link');
        return;
    }

    try {
        const response = await fetch(`https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/?url=${encodeURIComponent(link)}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com",
                "x-rapidapi-key": "f01c031932msh96eb31b19a3895dp1b7753jsn79503c0f0b59"
            }
        });
        const data = await response.json();

        if (data.error) {
            alert('Error fetching content');
            return;
        }

        displayContent(data);
    } catch (error) {
        console.error('Error fetching content:', error);
        alert('Error fetching content');
    }
}

function displayContent(data) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    if (data.Type === 'Post-Image') {
        const img = document.createElement('img');
        img.src = data.media;
        contentDiv.appendChild(img);
    } else if (data.Type === 'Post-Video') {
        const video = document.createElement('video');
        video.src = data.media;
        video.controls = true;
        contentDiv.appendChild(video);
    }

    const downloadButton = document.createElement('a');
    downloadButton.href = data.media;
    downloadButton.download = 'InstagramContent';
    downloadButton.innerText = 'Download';
    contentDiv.appendChild(downloadButton);
}
