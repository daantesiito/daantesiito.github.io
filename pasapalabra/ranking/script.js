document.addEventListener('DOMContentLoaded', () => {
    let numEmotes = 100;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        numEmotes = 30;
    }
    const emoteSources = [
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/1.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/2.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/3.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/4.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/5.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/6.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/7.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/8.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/9.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/10.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/11.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/12.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/13.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/14.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/15.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/3x.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/32.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/44.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/BASEDCIGAR.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/catJam.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/DuckSadge.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/happi.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/JIJO.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/nowaying.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/omegalul.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/pepeLost.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/sadcat.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/Sadge.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/SadgeRain.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/Sadgers.png?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/sadVegeta.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/sigma.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/sigmaArrive.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/yipe.gif?raw=true',
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/yump.gif?raw=true',
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