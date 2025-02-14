function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");

  // Replace text content with an image for specific tile values
  switch (tile.value) {
    case 2: 
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/FeelsWeirdMan-4x.png?raw=true" alt="2">';
      break;
    case 4:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/o7-4x.png?raw=true" alt="4">';
      break;
    case 8:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/sus-4x.png?raw=true" alt="8">';
      break;
    case 16:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/pfft-4x.png?raw=true" alt="16">';
      break;
    case 32:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/CAUGHT-4x.png?raw=true" alt="32">';
      break;
    case 64:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/MAJ-4x.png?raw=true" alt="64">';
      break;
    case 128:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/monkaS-4x.png?raw=true" alt="128">';
      break;
    case 256:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/monkaW-4x.png?raw=true" alt="256">';
      break;
    case 512:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/ok-4x.png?raw=true" alt="512">';
      break;
    case 1024:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/POGGERS-4x.png?raw=true" alt="1024">';
      break;
    case 2048:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/OMEGALUL-4x.png?raw=true" alt="2048">';
      break;
    case 4096:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/Chadge-4x.png?raw=true" alt="4096">';
      break;
    case 8192:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/dosecat-4x.png?raw=true" alt="8192">';
      break;
    case 16384:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/Ratge-4x.png?raw=true" alt="16384">';
      break;
    case 32768:
      inner.innerHTML = '<img src="https://github.com/daantesiito/daantesiito.github.io/blob/main/2048/media/PepeClown-4x.png?raw=true" alt="32768">';
      break;
    default:
      inner.textContent = tile.value;
  }

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "Ganaste!" : "Perdiste!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
