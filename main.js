const numRocks = 1000;
const gridSize = 51200 / 256;

const rockSounds = [];

function preloadAssets() {
  const imagesToPreload = ["./assets/img/rock1.png"];

  const soundsToPreload = [
    "./assets/sound/rock1.m4a",
    "./assets/sound/rock2.m4a",
    "./assets/sound/rock3.m4a",
    "./assets/sound/rock4.m4a",
    "./assets/sound/rock5.m4a",
  ];

  const preloadPromises = [
    ...imagesToPreload.map((src) => preloadImage(src)),
    ...soundsToPreload.map((src) => preloadSound(src)),
  ];

  return Promise.all(preloadPromises);
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function preloadSound(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = resolve;
    audio.onerror = reject;
    audio.src = src;
    rockSounds.push(audio);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splash-screen");
  const scrollableArea = document.getElementById("scrollable-area");
  const rockTemplate = document.getElementById("rock-template");

  function hideSplashScreen() {
    splashScreen.style.display = "none";
    scrollableArea.style.display = "grid";
  }

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

    rockSounds[Math.floor(Math.random() * rockSounds.length)].play();

    setTimeout(() => {
      rock.remove();
    }, duration);
  }

  function initialize() {
    preloadAssets()
      .then(() => {
        createRocks();
      })
      .catch((error) => {
        console.error("Error preloading assets:", error);
      })
      .finally(() => {
        // Hide splashscreen regardless of whether prefetch was successful.
        hideSplashScreen();
      });
  }

  initialize();
});
