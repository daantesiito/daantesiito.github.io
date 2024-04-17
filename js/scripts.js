const carousel = document.querySelector('.carousel');
const imgs = document.querySelectorAll('.carousel img');
const imgWidth = imgs[0].getBoundingClientRect().width;
const imgsPerSlide = 2; // Mostrar solo dos imágenes a la vez
let currentIndex = 0;

// Función para actualizar la posición del carrusel
function updateCarousel() {
    const offset = -currentIndex * imgWidth * imgsPerSlide;
    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(${offset}px)`;
}

// Función para manejar el clic en la flecha izquierda
function prevSlide() {
    if (currentIndex > 0) {
        currentIndex -= 1;
    } else {
        currentIndex = Math.ceil(imgs.length / imgsPerSlide) - 1;
    }
    updateCarousel();
}

// Función para manejar el clic en la flecha derecha
function nextSlide() {
    if (currentIndex < Math.ceil(imgs.length / imgsPerSlide) - 1) {
        currentIndex += 1;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}

// Manejadores de eventos para las flechas
document.querySelector('.arrow.prev').addEventListener('click', prevSlide);
document.querySelector('.arrow.next').addEventListener('click', nextSlide);

// Actualizar el carrusel al cargar la página
updateCarousel();
