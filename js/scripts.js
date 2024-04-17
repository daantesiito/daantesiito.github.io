const carousel = document.querySelector('.carousel');
const imgs = document.querySelectorAll('.carousel img');
const imgWidth = carousel.getBoundingClientRect().width / 2; // Cambiado para obtener el ancho del contenedor del carrusel
const imgsPerSlide = 2;
let currentIndex = 0;

function updateCarousel() {
    const offset = -currentIndex * imgWidth * imgsPerSlide;
    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(${offset}px)`;
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex -= 1;
    } else {
        currentIndex = Math.ceil(imgs.length / imgsPerSlide) - 1;
    }
    updateCarousel();
}

function nextSlide() {
    if (currentIndex < Math.ceil(imgs.length / imgsPerSlide) - 1) {
        currentIndex += 1;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}

document.querySelector('.arrow.prev').addEventListener('click', prevSlide);
document.querySelector('.arrow.next').addEventListener('click', nextSlide);

updateCarousel();
