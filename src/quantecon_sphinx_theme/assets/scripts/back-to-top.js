/**
 * Back to Top — Scroll-triggered button
 */

export function initBackToTop() {
  const btn = document.querySelector(".st-back-to-top");
  if (!btn) return;

  const THRESHOLD = 300; // px

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > THRESHOLD) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
