/**
 * Theme Toggle — Dark / Light / Auto mode
 *
 * Three-state cycle: light → dark → auto (system preference).
 * Persists choice to localStorage. Respects prefers-color-scheme by default.
 */

const STORAGE_KEY = "st-theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const resolved = theme === "auto" ? getSystemTheme() : theme;
  document.body.setAttribute("data-theme", resolved);
}

export function initThemeToggle() {
  const btn = document.querySelector(".st-theme-toggle");
  if (!btn) return;

  // Determine initial state
  const saved = localStorage.getItem(STORAGE_KEY);
  let current = saved || "auto"; // "light" | "dark" | "auto"
  applyTheme(current);

  // Cycle: light → dark → auto
  btn.addEventListener("click", () => {
    if (current === "light") {
      current = "dark";
    } else if (current === "dark") {
      current = "auto";
    } else {
      current = "light";
    }

    localStorage.setItem(STORAGE_KEY, current);
    applyTheme(current);
  });

  // Listen for system theme changes (relevant when mode is "auto")
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (current === "auto") {
        applyTheme("auto");
      }
    });
}
