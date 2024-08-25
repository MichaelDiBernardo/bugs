const numRocks = 1000;
const gridSize = 51200 / 256;

document.addEventListener("DOMContentLoaded", () => {
  const scrollableArea = document.getElementById("scrollable-area");
  const rockTemplate = document.getElementById("rock-template");

  function createRockComponent(location) {
    const rock = rockTemplate.content.cloneNode(true).querySelector(".rock");
    rock.style.gridRow = location.x;
    rock.style.gridColumn = location.y;
    rock.addEventListener("click", flingRock);
    scrollableArea.appendChild(rock);
  }

  function createRocks() {
    const rockLocations = [];
    while (rockLocations.length < numRocks) {
      const newRockLocation = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };

      if (
        rockLocations.find(
          (l) => l.x === newRockLocation.x && l.y === newRockLocation.y
        )
      ) {
        continue;
      }

      rockLocations.push(newRockLocation);
    }

    for (const location of rockLocations) {
      createRockComponent(location);
    }
  }

  function flingRock(event) {
    const rock = event.currentTarget;
    const angle = Math.random() * Math.PI * 2;
    const distance = 1000 + Math.random() * 1000;
    const duration = 500 + Math.random() * 500;

    rock.style.transform = `translate(${Math.cos(angle) * distance}px, ${
      Math.sin(angle) * distance
    }px) rotate(${Math.random() * 720 - 360}deg)`;
    rock.style.opacity = "0";
    rock.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

    setTimeout(() => {
      rock.remove();
    }, duration);
  }

  function initialize() {
    createRocks();
  }

  initialize();
});
