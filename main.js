const viewportDimensions = {
  x: 50000,
  y: 50000,
};

document.addEventListener("load", function () {
  const scrollableArea = document.getElementById("scrollable-area");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate the center position
  const scrollToX = (viewportDimensions.x - viewportWidth) / 2;
  const scrollToY = (viewportDimensions.y - viewportHeight) / 2;

  console.log(`Center is: ${scrollToX}, ${scrollToY}`);
  // Set the initial scroll position
  window.scrollTo(scrollToX, scrollToY);

  // Prevent default touch behavior to allow custom scrolling
  scrollableArea.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  let startX, startY, scrollLeft, scrollTop;

  scrollableArea.addEventListener("touchstart", function (e) {
    startX = e.touches[0].pageX - scrollableArea.offsetLeft;
    startY = e.touches[0].pageY - scrollableArea.offsetTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  });

  scrollableArea.addEventListener("touchmove", function (e) {
    const x = e.touches[0].pageX - scrollableArea.offsetLeft;
    const y = e.touches[0].pageY - scrollableArea.offsetTop;
    const walkX = (x - startX) * 2; // Adjust scrolling speed if needed
    const walkY = (y - startY) * 2;
    window.scrollTo(scrollLeft - walkX, scrollTop - walkY);
  });
});
