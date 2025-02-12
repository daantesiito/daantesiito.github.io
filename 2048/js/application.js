// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});

document.addEventListener("DOMContentLoaded", () => {
  const btnGuide = document.getElementById("btn-guide");
  const imageModal = document.getElementById("imageModal");
  const closeModal = document.querySelector("#imageModal .close");

  // Asegúrate de que el modal esté oculto al cargar la página
  imageModal.style.display = "none";

  btnGuide.addEventListener("click", (event) => {
    event.preventDefault();
    imageModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    imageModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      imageModal.style.display = "none";
    }
  });
});
