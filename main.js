// Settings. If you change the tilesize (256px) you also have to change it in
// the CSS.
const numRocks = 1000;
const gridSize = 51200 / 256;
const bugDanceDuration = 5000;

// This will hold all the rock sounds once they are loaded.
const rockSounds = [];

// Prefetching stuff.
function preloadAssets() {
  const imagesToPreload = [
    "./assets/img/rock1.png",
    "./assets/img/unicorn.png",
  ];

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

/**
 * Throw a rock and reveal the lovely prize beneath. Will it be a bug, or
 * something else? This is an event handler for the rock element.
 */
function flingRock(event) {
  const rock = event.currentTarget;
  const rockContainer = rock.closest(".rock-container");
  const bug = rockContainer.querySelector(".bug");

  const rockFlingDuration = 500 + Math.random() * 500;

  animateRock(rock, rockFlingDuration);

  rockSounds[Math.floor(Math.random() * rockSounds.length)].play();

  setTimeout(() => {
    rock.remove();
    happyDance(bug);
  }, rockFlingDuration);
}

/**
 * Animate the rock fling
 * @param {HTMLElement} rock  - The rock element to animate
 * @param {number} duration - The duration of the animation in milliseconds
 */
function animateRock(rock, duration) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 1000 + Math.random() * 1000;

  rock.style.transform = `translate(${Math.cos(angle) * distance}px, ${
    Math.sin(angle) * distance
  }px) rotate(${Math.random() * 720 - 360}deg)`;
  rock.style.opacity = "0";
  rock.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
}

/**
 * Make the bug -- or bug-like equivalent -- dance.
 * @param {HTMLElement} bug - The bug element to animate
 */
function happyDance(bug) {
  bug.classList.add("pulsing");

  setTimeout(() => {
    bug.classList.remove("pulsing");
  }, bugDanceDuration);
}

async function startGame() {
  const splashScreen = document.getElementById("splash-screen");
  const scrollableArea = document.getElementById("scrollable-area");
  const rockTemplate = document.getElementById("rock-template");

  function hideSplashScreen() {
    splashScreen.style.display = "none";
    scrollableArea.style.display = "grid";
  }

  function createRockComponent(location) {
    const rockContainer = rockTemplate.content
      .cloneNode(true)
      .querySelector(".rock-container");
    rockContainer.style.gridRow = location.x;
    rockContainer.style.gridColumn = location.y;
    rockContainer.querySelector(".rock").addEventListener("click", flingRock);
    scrollableArea.appendChild(rockContainer);
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

  async function initialize() {
    try {
      await preloadAssets();
    } catch (error) {
      console.error("Error preloading assets:", error);
    } finally {
      createRocks();
      hideSplashScreen();
    }
  }

  initialize();
}

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});
