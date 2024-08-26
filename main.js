// Settings. If you change the tilesize (256px) you also have to change it in
// the CSS.
const numRocks = 1000;
const gridSize = 51200 / 256;
const bugDanceDuration = 5000;

// One of these is randomly played whenever a rock is flung.
let rockSounds = [];

// One of these is randomly selected for each rock on the map.
let rockImages = [];

// One of these is randomly played whenever you click on a bug or bug-equivalent
// creature.
let bugClickSounds = [];

// These are the files that will be loaded into the arrays above.
const rockSoundsFiles = [
  "rock1.m4a",
  "rock2.m4a",
  "rock3.m4a",
  "rock4.m4a",
  "rock5.m4a",
];
const rockImagesFiles = ["rock1.png"];
const bugClickSoundsFiles = ["clickme1.m4a"];

// A list of all the types of bugs or bug-like creatures. For each one of these,
// it's expected that there is an image for the bug in
// ./assets/image/{bugType}.png, and an "discovery sound" in
// ./assets/sound/{bugType}.m4a.
const bugTypes = ["unicorn"];

// A list of all the bug "prototypes" that can be included as a bug component. Each proto is like this:
// {
//   type: "unicorn",
//   image: "unicorn.png",
//   sound: "unicorn.m4a", // This is the sound that is played when the bug is revealed.
// }
let bugProtos = [];

/**
 * Picks a random element from a given array.
 * @param {Array} array - The array to pick from.
 * @returns The randomly selected element from the array.
 */
function choose(array) {
  if (array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Preload all the assets and initialize the game. This will probably fail if
 * any of the assets fails to load, but Nora needs to learn to deal with
 * computers failing for no discernible reason.
 */
async function initializeGame() {
  rockSounds = await Promise.all(rockSoundsFiles.map(getSound));
  rockImages = await Promise.all(rockImagesFiles.map(getImage));
  bugClickSounds = await Promise.all(bugClickSoundsFiles.map(getSound));
  bugProtos = await Promise.all(bugTypes.map(getBugProto));
}

/**
 * Loads the assets for a bug prototype and returns the proto.
 *
 * @param {string} bugType - The type of bug to load
 * @returns A promise wrapping the bug proto.
 */
async function getBugProto(bugType) {
  return {
    type: bugType,
    image: await getImage(`${bugType}.png`),
    sound: await getSound(`${bugType}.m4a`),
  };
}

/**
 * Loads an image from the assets folder.
 * @param {string} fileName - The name of the file to load.
 * @returns A promise wrapping the image.
 */
function getImage(fileName) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `./assets/img/${fileName}`;
  });
}

/**
 * Loads a sound from the assets folder.
 * @param {string} fileName - The name of the file to load.
 * @returns A promise wrapping the sound.
 */
function getSound(fileName) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = resolve(audio);
    audio.onerror = reject;
    audio.src = `./assets/sound/${fileName}`;
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

    const rockElement = rockContainer.querySelector(".rock");
    rockElement.addEventListener("click", flingRock);

    // Select a random rock image
    const randomRockImage = choose(rockImages);

    // Set the src attribute of the img element inside the rock div
    const rockImg = rockElement.querySelector("img");
    rockImg.src = randomRockImage.src;

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

  try {
    await initializeGame();
  } catch (error) {
    console.error("Error preloading assets:", error);
    alert("Sorry Nora. You broke it.");
    return;
  }

  createRocks();
  hideSplashScreen();
}

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});
