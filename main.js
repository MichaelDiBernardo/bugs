document.addEventListener("DOMContentLoaded", () => {
  const rocksContainer = document.getElementById("rocks-container");
  const rockTemplate = document.getElementById("rock-template");
  const numRocks = 20; // Number of rocks to create

  function createRock() {
    const rock = rockTemplate.content.cloneNode(true).querySelector(".rock");
    rock.style.left = `${Math.random() * 100}%`;
    rock.style.top = `${Math.random() * 100}%`;
    rock.addEventListener("click", flingRock);
    rocksContainer.appendChild(rock);
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

  for (let i = 0; i < numRocks; i++) {
    createRock();
  }
});
