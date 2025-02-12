document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcherButton = document.getElementById("themeSwitcherButton");
  
    if (themeSwitcherButton) {
      themeSwitcherButton.addEventListener("click", () => {
        if (document.body.classList.contains("kick-theme")) {
          document.body.classList.remove("kick-theme");
          document.documentElement.classList.remove("kick-theme"); // Remover de <html>
          document.body.classList.add("twitch-theme");
          document.documentElement.classList.add("twitch-theme"); // Agregar a <html>
        } else {
          document.body.classList.remove("twitch-theme");
          document.documentElement.classList.remove("twitch-theme"); // Remover de <html>
          document.body.classList.add("kick-theme");
          document.documentElement.classList.add("kick-theme"); // Agregar a <html>
        }
      });
    }
  });
  