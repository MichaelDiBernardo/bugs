// Settings. If you change the tilesize (256px) or the gridSize (25600px) you
// also have to change those values in the CSS.
const numRocks = 600;
const gridSize = 25600 / 256;
const bugDanceDuration = 2000;
const bugAgitateDuration = 1000;

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

const rockImagesFiles = [
  "rock1.png",
  "rock2.png",
  "rock3.png",
  "rock4.png",
  "rock5.png",
];

const bugClickSoundsFiles = [
  "clickme1.m4a",
  "clickme2.m4a",
  "clickme3.m4a",
  "clickme4.m4a",
  "clickme5.m4a",
];

// A list of all the types of bugs or bug-like creatures. For each one of these,
// it's expected that there is an image for the bug in
// ./assets/image/{bugType}.png, and an "discovery sound" in
// ./assets/sound/{bugType}.m4a.
const bugTypes = [
  "unicorn",
  "ant",
  "bee",
  "beetle",
  "butterfly",
  "cake",
  "cockroach",
  "dinosaur",
  "dragonfly",
  "flower",
  "fly",
  "grasshopper",
  "icecream",
  "ladybug",
  "mantis",
  "mosquito",
  "moth",
  "pizza",
  "rainbow",
  "scorpion",
  "snowman",
  "termite",
  "unicorn",
];

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
  // Preload the CSS background texture.
  await getImage("forest-tile-512x512.jpg");

  // Preload all the "game assets."
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
 * Creates an event handler that:
 * - throws the rock to reveal the lovely prize beneath. (Will it be a bug, or * something else?)
 * - Plays the 'discovery sound' associated with the bug.
 */
function makeFlingRockHandler(discoverySound) {
  return () => {
    const rock = event.currentTarget;
    const rockContainer = rock.closest(".rock-container");
    const bug = rockContainer.querySelector(".bug");

    const rockFlingDuration = 500 + Math.random() * 500;

    animateRock(rock, rockFlingDuration);

    rockSounds[Math.floor(Math.random() * rockSounds.length)].play();

    setTimeout(() => {
      rock.remove();
      happyDance(bug);
      discoverySound.play();
    }, rockFlingDuration);
  };
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

function agitateBug(event) {
  choose(bugClickSounds).play();

  const bug = event.currentTarget;
  if (bug.classList.contains("pulsing")) {
    return;
  }

  bug.classList.add("pulsing");

  setTimeout(() => {
    bug.classList.remove("pulsing");
  }, bugAgitateDuration);
}

/**
 * Starts the game after DOMContentLoaded.
 */
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

    // Choose a random bug to put under the rock.
    const randomBugProto = choose(bugProtos);

    const rockElement = rockContainer.querySelector(".rock");
    rockElement.addEventListener(
      "click",
      makeFlingRockHandler(randomBugProto.sound)
    );

    // Select a random rock image
    const randomRockImage = choose(rockImages);

    // Set the src attribute of the img element inside the rock div
    const rockImg = rockElement.querySelector("img");
    rockImg.src = randomRockImage.src;

    // Make the bug agitate when clicked.
    const bug = rockContainer.querySelector(".bug");
    bug.addEventListener("click", agitateBug);

    // Set the src attribute of the img element inside the bug div
    const bugImg = rockContainer.querySelector(".bug img");
    bugImg.src = randomBugProto.image.src;

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
