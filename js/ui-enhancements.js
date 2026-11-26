/* js/ui-enhancements.js - Navigation & UI Interactive Helpers */
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Nav Toggle
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);
      nav.classList.toggle("show");
    });
  }

  // Toast notification helper
  window.showToast = function(message) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };
});
