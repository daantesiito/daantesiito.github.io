document.addEventListener('DOMContentLoaded', () => {
    let numEmotes = 100;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        numEmotes = 30;
    }
    const emoteSources = [
        'https://github.com/daantesiito/daantesiito.github.io/blob/main/pasapalabra/media/7tv/1.gif?raw=true',
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