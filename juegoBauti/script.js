// Variables globales
const fixedSegments = [
  { percentage: 4, color: 'red', points: 1 }, // Rojo - 1 punto
  { percentage: 4, color: 'green', points: 3 }, // Verde - 3 puntos
  { percentage: 4, color: 'yellow', points: 5 }, // Amarillo - 5 puntos
  { percentage: 4, color: 'green', points: 3 }, // Verde - 3 puntos
  { percentage: 4, color: 'red', points: 1 } // Rojo - 1 punto
];

const greySegments = [
  { percentage: 80, color: '#5c5c5c', points: 0 } // Gris - 0 puntos
];

let segments = []; // Para almacenar los segmentos combinados después de mezclar
let pointSegments = []; // Para almacenar solo los segmentos que dan puntos
let playerScores = {
  participant1: 0,
  participant2: 0
};

let currentPlayer = 'participant1';
let selectedPosition = null;
let isSelectionEnabled = false; // Variable para controlar si la selección está habilitada

// Referencias a los elementos del DOM
const semicircleBackgroundSvg = document.getElementById('semicircleBackground');
const semicircleForegroundSvg = document.getElementById('semicircleForeground');
const shuffleValuesBtn = document.getElementById('shuffleValues');
const hideValuesBtn = document.getElementById('hideValues');
const confirmPositionBtn = document.getElementById('confirmPosition');
const clickArea = document.getElementById('click-area');
const selectedLineElem = document.getElementById('selected-line'); // Línea azul
const participant1NameElem = document.getElementById('participant1Name');
const participant2NameElem = document.getElementById('participant2Name');
const participant1ScoreElem = document.getElementById('participant1Score');
const participant2ScoreElem = document.getElementById('participant2Score');

window.onload = () => {
  // Mostrar el bloque de pantalla de bloqueo y ocultar el área de juego al inicio
  document.getElementById('lockScreen').style.display = 'flex';
  document.getElementById('gameArea').style.display = 'none';

  shuffleSegments(); // Mezclar segmentos al inicio
  drawBackgroundSemicircle();
  drawForegroundSemicircle();

  // Asignar eventos a los botones y el área de clic
  shuffleValuesBtn.addEventListener('click', shuffleSegments);
  hideValuesBtn.addEventListener('click', hideFixedValues);
  confirmPositionBtn.addEventListener('click', confirmPosition);

  // Modal de instrucciones
  const modal = document.getElementById("instructionsModal");
  const btn = document.getElementById("instructionsBtn");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = () => {
      modal.style.display = "block";
  }

  span.onclick = () => {
      modal.style.display = "none";
  }

  window.onclick = (event) => {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
};


function startGame() {
  const participant1Name = document.getElementById('player1').value;
  const participant2Name = document.getElementById('player2').value;

  // Comprobar si los valores son correctos
  if (participant1Name === "" || participant2Name === "") {
    console.error("Uno o ambos campos de nombre están vacíos.");
    return;
  }

  // Actualizar los nombres de los participantes en la interfaz
  participant1NameElem.textContent = participant1Name;
  participant2NameElem.textContent = participant2Name;

  console.log("Participant 1: " + participant1Name);
  console.log("Participant 2: " + participant2Name);

  // Ocultar el bloque de pantalla de bloqueo y mostrar el área de juego
  document.getElementById('lockScreen').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
}


const getAngleFromClick = (event, element) => {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = rect.height - (event.clientY - rect.top);

  // Calcular el ángulo en radianes desde el eje horizontal (derecha), en sentido horario
  let angle = Math.atan2(y, x);

  // Convertir el ángulo a grados
  angle = angle * (180 / Math.PI);

  // Ajustar el ángulo para que esté en el rango de -90 a 90 grados
  angle = 90 - angle; // Invertir y ajustar para el rango correcto

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
  // Crear un array de segmentos combinados
  segments = [...fixedSegments, ...greySegments];

  // Obtener el bloque fijo y el bloque gris
  let fixedBlock = segments.splice(0, 5);
  let greyBlock = segments.splice(0, 1);

  // Calcular una posición aleatoria para el bloque fijo
  let randomPosition = Math.floor(Math.random() * 21); // 0 a 20 para 4% cada uno

  // Dividir el bloque gris en dos partes
  let greyFirstPart = { percentage: randomPosition * 4, color: '#5c5c5c', points: 0 };
  let greySecondPart = { percentage: 80 - greyFirstPart.percentage, color: '#5c5c5c', points: 0 };

  // Insertar los bloques fijos y grises en sus nuevas posiciones
  segments = [greyFirstPart, ...fixedBlock, greySecondPart];

  // Crear una lista de segmentos con puntos para la verificación
  pointSegments = [];
  let accumulatedPercentage = greyFirstPart.percentage;

  fixedBlock.forEach(segment => {
    let startAngle = (accumulatedPercentage / 100) * 180 - 90; // Convertir porcentaje a ángulo
    let endAngle = ((accumulatedPercentage + segment.percentage) / 100) * 180 - 90;
    
    pointSegments.push({
      startAngle: startAngle,
      endAngle: endAngle,
      points: segment.points,
      color: segment.color
    });
    accumulatedPercentage += segment.percentage;
  });

  console.log(pointSegments); // Para depuración
  drawForegroundSemicircle();
};

// Ocultar los valores del bloque fijo
const hideFixedValues = () => {
  isSelectionEnabled = true; // Habilitar la selección
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
      .attr('fill', '#5c5c5c') // Color gris para ocultar
      .attr('stroke', 'none')
      .attr('stroke-width', 1);
};

clickArea.addEventListener('click', event => {
  if (!isSelectionEnabled) return;

  const angle = getAngleFromClick(event, clickArea);

  const radius = 200;
  const centerX = 200; // Centro del semicírculo
  const centerY = 200; // Centro del semicírculo

  const radians = (angle - 90) * (Math.PI / 180); // Convertir ángulo a radianes
  const x = centerX + radius * Math.cos(radians);
  const y = centerY + radius * Math.sin(radians);

  selectedLineElem.setAttribute('x1', centerX);
  selectedLineElem.setAttribute('y1', centerY);
  selectedLineElem.setAttribute('x2', x);
  selectedLineElem.setAttribute('y2', y);
  selectedLineElem.style.display = 'block';

  selectedPosition = angle;
  console.log(`Selected Angle: ${selectedPosition}`); // Para depuración
});


const updateLinePosition = () => {
  if (selectedPosition === null) return;

  const radius = 200;
  const centerX = 200; // Centro del semicírculo
  const centerY = 200; // Centro del semicírculo

  // Calcular la posición del clic en coordenadas polares
  const x = centerX + radius * Math.cos((selectedPosition - 90) * (Math.PI / 180));
  const y = centerY - radius * Math.sin((selectedPosition - 90) * (Math.PI / 180));

  // Actualizar las coordenadas de la línea seleccionada
  selectedLineElem.setAttribute('x1', centerX);
  selectedLineElem.setAttribute('y1', centerY);
  selectedLineElem.setAttribute('x2', x);
  selectedLineElem.setAttribute('y2', y);
};

// Confirmar la selección y sumar puntos al jugador correspondiente
confirmPositionBtn.addEventListener('click', () => {
  if (selectedPosition !== null) {
    // Ajustar el ángulo seleccionado para asegurarse de que esté en el rango de -90 a 90
    let selectedAngle = selectedPosition;

    // Encontrar el segmento correspondiente al ángulo seleccionado
    let selectedSegment = pointSegments.find(segment => {
      return selectedAngle >= segment.startAngle && selectedAngle < segment.endAngle;
    });

    if (selectedSegment) {
      console.log(`Selected Segment: ${JSON.stringify(selectedSegment)}`); // Para depuración
      // Sumar puntos al jugador correspondiente
      playerScores[currentPlayer] += selectedSegment.points;
    } else {
      console.log('No valid segment found for the selected position.'); // Para depuración
    }

    // Alternar al siguiente jugador
    currentPlayer = currentPlayer === 'participant1' ? 'participant2' : 'participant1';

    // Actualizar los puntajes en el DOM
    participant1ScoreElem.textContent = playerScores.participant1;
    participant2ScoreElem.textContent = playerScores.participant2;

    // Restablecer la posición seleccionada y desactivar la selección
    selectedPosition = null;
    selectedLineElem.style.display = 'none'; // Ocultar la línea después de confirmar
    isSelectionEnabled = false;

    // Mostrar los valores del semicírculo
    drawForegroundSemicircle();
  }
});


// Lista de temas
const topics = [
  "Lindo o Feo",
  "Raro o Común",
  "Alto o Bajo",
  "Frío o Caliente",
  "Suave o Duro",
  "Rápido o Lento",
  "Viejo o Nuevo",
  "Claro o Oscuro",
  "Grande o Pequeño",
  "Ligero o Pesado",
  "Rico o Pobre",
  "Feliz o Triste",
  "Peligroso o Seguro",
  "Dulce o Salado",
  "Fuerte o Débil",
  "Sencillo o Complejo",
  "Seco o Mojado",
  "Calmado o Furioso",
  "Natural o Artificial",
  "Corto o Largo",
  "Divertido o Aburrido",
  "Activo o Pasivo",
  "Inteligente o Tonto",
  "Barato o Caro",
  "Cálido o Fresco"
];

// Referencias a los elementos del DOM para el tema
const randomTopicBtn = document.getElementById('randomTopic');
const leftTopicElem = document.getElementById('leftTopic');
const rightTopicElem = document.getElementById('rightTopic');

// Función para seleccionar un tema aleatorio y actualizar la interfaz
const selectRandomTopic = () => {
  const randomIndex = Math.floor(Math.random() * topics.length);
  const selectedTopic = topics[randomIndex].split(" o ");

  // Asignar las palabras a los elementos de la interfaz
  leftTopicElem.textContent = selectedTopic[0];
  rightTopicElem.textContent = selectedTopic[1];
};

// Asignar el evento al botón "TEMA RANDOM"
randomTopicBtn.addEventListener('click', selectRandomTopic);

document.addEventListener('DOMContentLoaded', () => {
  const numEmotes = 200;
  const emoteSources = [
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/CAUGHT.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/51.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/omegalul.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/RUNN.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/34.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/44.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/BASEDCIGAR.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bautiCumers.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/blabbering.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/boner.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/catJam.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/classic.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/eh.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ESKIZO.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/happi.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/JIJO.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/KickTime.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/muga.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/nowaying.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/QUEDICE.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sigma.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sigmaArrive.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/WHISTLING.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yump.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/zidane.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/agusbob.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ahmm.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/aldu.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bana.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/bauti.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/coscu.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/davo.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/flor.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/franquito.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/Gayge.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/hornet.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/HUH.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/isma.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/JE.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/lolo.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/MAJ.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/mirko.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/momo.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/morte.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/ok.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/rc.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/SAJ.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/spreen.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/sus.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/wideDude.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yutanita.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yutabt.png?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/32.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/CocaCola.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/DojaVibe.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/hardstuck.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/yipe.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/raveGirl.gif?raw=true',
      'https://github.com/daantesiito/daantesiito.github.io/blob/main/images/7tv/polenta.png?raw=true' // Aquí puedes agregar más GIFs separados por comas si lo deseas
  ];

  for (let i = 0; i < numEmotes; i++) {
      const emote = document.createElement('img');
      emote.src = emoteSources[Math.floor(Math.random() * emoteSources.length)];
      emote.className = 'emote';
      emote.style.left = Math.random() * 100 + 'vw';
      emote.style.animationDuration = Math.random() * 5 + 5 + 's';
      emote.style.animationDelay = Math.random() * 6 + 's';
      document.body.appendChild(emote);
  }
});