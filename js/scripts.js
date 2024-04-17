const carousel = document.querySelector('.carousel');
const prevBtn = document.querySelector('.arrow.prev');
const nextBtn = document.querySelector('.arrow.next');
const imgs = document.querySelectorAll('.carousel img');
let counter = 0;

// Calcula el ancho de una imagen incluyendo el margen
const imgWidth = imgs[0].getBoundingClientRect().width;

nextBtn.addEventListener('click', () => {
    if (counter < Math.ceil(imgs.length / 3) - 1) {
        counter++;
        carousel.style.transform = `translateX(-${counter * imgWidth * 3}px)`;
    }
});

prevBtn.addEventListener('click', () => {
    if (counter > 0) {
        counter--;
        carousel.style.transform = `translateX(-${counter * imgWidth * 3}px)`;
    }
});
