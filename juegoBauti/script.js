// Variables globales
const segments = [
    { value: 25, color: '#5c5c5c' }, // Debe coincidir con el color de fondo
    { value: 5, color: 'red' },
    { value: 7.5, color: 'green' },
    { value: 10, color: 'yellow' },
    { value: 7.5, color: 'green' },
    { value: 5, color: 'red' },
    { value: 40, color: '#5c5c5c' }
  ];
  
  // Referencias a los elementos del DOM
  const startGameBtn = document.getElementById('startGame');
  const gameArea = document.getElementById('gameArea');
  const semicircleBackgroundSvg = document.getElementById('semicircleBackground');
  const semicircleForegroundSvg = document.getElementById('semicircleForeground');
  const shuffleValuesBtn = document.getElementById('shuffleValues');
  const hideValuesBtn = document.getElementById('hideValues');
  const confirmPositionBtn = document.getElementById('confirmPosition');
  const examplesArea = document.getElementById('examples');
  const examplesTextarea = document.getElementById('examples');
  
  // Iniciar el juego
  startGameBtn.addEventListener('click', () => {
    gameArea.classList.remove('hidden');
    examplesArea.classList.remove('hidden');
    drawBackgroundSemicircle();
    drawForegroundSemicircle();
  });
  
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
      .attr('fill', '#5c5c5c') // Color gris (debe coincidir con el color de fondo de los segmentos)
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  };
  
  // Dibujar el semicírculo de colores (inicialmente en la posición inicial)
  const drawForegroundSemicircle = () => {
    semicircleForegroundSvg.innerHTML = '';
  
    const width = 400;
    const height = 200;
    const radius = 200;
  
    semicircleForegroundSvg.setAttribute("width", width);
    semicircleForegroundSvg.setAttribute("height", height);
  
    const svg = d3.select(semicircleForegroundSvg)
      .append("g")
      .attr("id", "foregroundGroup") // Agregamos un ID para facilitar el manejo de la rotación
      .attr("transform", `translate(${width / 2}, ${height})`);
  
    const pie = d3.pie()
      .value(d => d.value)
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
  
  // Revolver valores del semicírculo (restringido a 180 grados con rebote)
  let currentRotation = 0; // Variable para llevar el control de la rotación actual
  
  shuffleValuesBtn.addEventListener('click', () => {
    let randomOffset = Math.floor(Math.random() * 180) - 90; // Rango de -90 a 90 grados
    let newRotation = currentRotation + randomOffset;
  
    // Restringir la rotación a -90 a 90 grados
    if (newRotation > 90) {
      newRotation = 90 - (newRotation - 90); // Rebote hacia el lado opuesto
    } else if (newRotation < -90) {
      newRotation = -90 + (-90 - newRotation); // Rebote hacia el lado opuesto
    }
  
    // Aplicar la nueva rotación
    const svg = d3.select("#foregroundGroup");
  
    svg.transition()
      .duration(1000)
      .attrTween('transform', function() {
        const interpolate = d3.interpolate(currentRotation, newRotation);
        return function(t) {
          return `translate(${200}, ${200}) rotate(${interpolate(t)})`;
        };
      });
  
    // Actualizar la rotación actual
    currentRotation = newRotation;
  });
  
  // Tapar posiciones del semicírculo
  hideValuesBtn.addEventListener('click', () => {
    semicircleForegroundSvg.classList.add('hidden');
  });
  
  // Confirmar posición seleccionada
  confirmPositionBtn.addEventListener('click', () => {
    semicircleForegroundSvg.classList.remove('hidden');
  });
  