// Variables globales
const fixedSegments = [
  { percentage: 12.5, color: 'red', points: 2 }, // Rojo - 2 puntos
  { percentage: 15, color: 'green', points: 3 }, // Verde - 3 puntos
  { percentage: 15, color: 'yellow', points: 5 }, // Amarillo - 5 puntos
  { percentage: 15, color: 'green', points: 3 }, // Verde - 3 puntos
  { percentage: 12.5, color: 'red', points: 2 } // Rojo - 2 puntos
];

const greySegments = [
  { percentage: 30, color: '#5c5c5c', points: 0 }, // Gris - 0 puntos
  { percentage: 30, color: '#5c5c5c', points: 0 } // Gris - 0 puntos
];

let segments = []; // Para almacenar los segmentos combinados después de mezclar
let playerScores = {
  bauti: 0,
  lolo: 0
};

let currentPlayer = 'bauti';
let selectedPosition = null;
let isSelectionEnabled = false; // Variable para controlar si la selección está habilitada

// Referencias a los elementos del DOM
const semicircleBackgroundSvg = document.getElementById('semicircleBackground');
const semicircleForegroundSvg = document.getElementById('semicircleForeground');
const shuffleValuesBtn = document.getElementById('shuffleValues');
const hideValuesBtn = document.getElementById('hideValues');
const confirmPositionBtn = document.getElementById('confirmPosition');
const clickArea = document.getElementById('click-area');
const bautiScoreElem = document.getElementById('bautiScore');
const loloScoreElem = document.getElementById('loloScore');

// Mostrar el área del juego desde el inicio
window.onload = () => {
  shuffleSegments(); // Mezclar segmentos al inicio
  drawBackgroundSemicircle();
  drawForegroundSemicircle();
};

// Función para obtener el ángulo en el semicírculo basado en la posición del clic
const getAngleFromClick = (event, element) => {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height;

  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return angle;
};

// Dibujar el semicírculo de fondo gris
const drawBackgroundSemicircle = () => {
  semicircleBackgroundSvg.innerHTML = '';

  const width = 400;
  const height = 200;
  const radius = 200;

  semicircleBackgroundSvg.setAttribute("width", width);
  semicircleBackgroundSvg.setAttribute("height", height);

  const svg = d3.select(semicircleBackgroundSvg)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height})`);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

  svg.append('path')
      .attr('d', arc)
      .attr('fill', '#5c5c5c')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
};

// Dibujar el semicírculo de colores basado en los porcentajes
const drawForegroundSemicircle = () => {
  semicircleForegroundSvg.innerHTML = '';

  const width = 400;
  const height = 200;
  const radius = 200;

  semicircleForegroundSvg.setAttribute("width", width);
  semicircleForegroundSvg.setAttribute("height", height);

  const svg = d3.select(semicircleForegroundSvg)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height})`);

  const pie = d3.pie()
      .value(d => d.percentage)
      .sort(null)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

  svg.selectAll('path')
      .data(pie(segments))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'none')
      .attr('stroke-width', 1);
};

// Revolver posiciones del bloque de colores y los segmentos grises
const shuffleSegments = () => {
  segments = [...fixedSegments, ...greySegments];
  let fixedBlock = segments.splice(0, 5);
  let greyBlock1 = segments.splice(0, 1);
  let greyBlock2 = segments.splice(0, 1);

  // Aleatorizar la posición del bloque fijo
  const positions = [0, 1];
  const randomPosition = positions[Math.floor(Math.random() * positions.length)];

  if (randomPosition === 0) {
    segments = [...greyBlock1, ...fixedBlock, ...greyBlock2];
  } else {
    segments = [...greyBlock2, ...fixedBlock, ...greyBlock1];
  }
};

// Tapar posiciones del semicírculo y habilitar clic en la imagen
hideValuesBtn.addEventListener('click', () => {
  const paths = semicircleForegroundSvg.getElementsByTagName('path');

  for (let path of paths) {
      path.setAttribute('fill', '#5c5c5c');
  }

  clickArea.style.display = 'block';
  selectedPosition = null;
  const selectedPoint = document.getElementById('selected-point');
  selectedPoint.style.display = 'none';
  isSelectionEnabled = true; // Habilitar la selección de puntos
});

// Obtener la posición seleccionada con un clic
clickArea.addEventListener('click', (event) => {
  if (isSelectionEnabled) {
      const angle = getAngleFromClick(event, clickArea);
      const selectedPoint = document.getElementById('selected-point');

      // Convertir el ángulo en coordenadas de SVG
      const rect = clickArea.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      selectedPoint.style.left = `${x - 5}px`; // Ajustar la posición para centrar el punto
      selectedPoint.style.top = `${y - 5}px`; // Ajustar la posición para centrar el punto
      selectedPoint.style.display = 'block';
      selectedPosition = angle;

      // Mostrar el ángulo en la consola
      console.log(`Ángulo seleccionado: ${angle}`);
  }
});

// Confirmar la posición seleccionada y sumar los puntos
confirmPositionBtn.addEventListener('click', () => {
  if (selectedPosition !== null) {
      // Mostrar el semicírculo con colores
      drawForegroundSemicircle();

      // Calcular los puntos ganados basados en la posición seleccionada
      const points = calculatePoints(selectedPosition);

      // Sumar los puntos al jugador actual solo si son mayores a 0
      if (points > 0) {
          playerScores[currentPlayer] += points;
      }

      // Actualizar los puntajes en el DOM
      bautiScoreElem.innerText = `Bauti: ${playerScores[currentPlayer]} puntos`;
      loloScoreElem.innerText = `Lolo: ${playerScores[currentPlayer]} puntos`;

      // Cambiar al siguiente jugador
      currentPlayer = currentPlayer === 'bauti' ? 'lolo' : 'bauti';

      // Ocultar el punto seleccionado y deshabilitar la selección
      const selectedPoint = document.getElementById('selected-point');
      selectedPoint.style.display = 'none';
      selectedPosition = null;
      isSelectionEnabled = false; // Deshabilitar la selección de puntos
      clickArea.style.display = 'none';
  }
});

// Función para calcular los puntos basados en el ángulo
const calculatePoints = (angle) => {
  // Convertir el ángulo a un porcentaje de -90 a 90 grados
  let percentage = (angle + 90) / 180 * 100;

  // Encontrar el segmento correspondiente basado en el porcentaje
  let cumulativePercentage = 0;
  for (let segment of segments) {
      cumulativePercentage += segment.percentage;
      if (percentage <= cumulativePercentage) {
          return segment.points;
      }
  }

  return 0;
};
