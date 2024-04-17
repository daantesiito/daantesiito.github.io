const carousel = document.querySelector('.carousel');
const imgs = document.querySelectorAll('.carousel img');
const imgWidth = imgs[0].getBoundingClientRect().width;
const totalImgs = imgs.length;

let currentIndex = 0;

function updateCarousel() {
    carousel.style.transition = 'transform 0.4s ease-in-out';
    carousel.style.transform = `translateX(-${currentIndex * (imgWidth * 3)}px)`;
}

document.querySelector('.arrow.prev').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= 3;
        updateCarousel();
    }
});

document.querySelector('.arrow.next').addEventListener('click', () => {
    if (currentIndex < totalImgs - 3) {
        currentIndex += 3;
        updateCarousel();
    }
});
