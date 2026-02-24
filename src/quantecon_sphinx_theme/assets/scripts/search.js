/**
 * Search — Overlay search bar toggle
 */

export function initSearch() {
  const overlay = document.querySelector(".st-search-overlay");
  if (!overlay) return;

  const openBtn = document.querySelector(".st-search-toggle");
  const closeBtn = overlay.querySelector(".st-search-form__close");
  const input = overlay.querySelector(".st-search-form__input");

  function open() {
    overlay.classList.add("st-search-overlay--open");
    overlay.setAttribute("aria-hidden", "false");
    input?.focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("st-search-overlay--open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  // Close on backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.classList.contains("st-search-overlay__inner")) {
      // Only close if clicking outside the form
      if (!e.target.closest(".st-search-form")) {
        close();
      }
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("st-search-overlay--open")) {
      close();
    }
  });

  // Cmd/Ctrl+K to open search
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (overlay.classList.contains("st-search-overlay--open")) {
        close();
      } else {
        open();
      }
    }
  });
}
