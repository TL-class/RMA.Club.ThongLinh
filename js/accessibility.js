/* js/accessibility.js - Accessibility and Keyboard Navigation */
document.addEventListener("DOMContentLoaded", () => {
  // Keyboard navigation for filters
  const filterBtns = document.querySelectorAll(".filter");
  filterBtns.forEach((btn, idx) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        const next = filterBtns[(idx + 1) % filterBtns.length];
        next.focus();
      } else if (e.key === "ArrowLeft") {
        const prev = filterBtns[(idx - 1 + filterBtns.length) % filterBtns.length];
        prev.focus();
      }
    });
  });
});
