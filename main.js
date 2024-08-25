document.addEventListener("load", function () {
  const scrollableArea = document.getElementById("scrollable-area");

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
