/**
 * Breadcrumb Navigation — Dropdown toggles for part/lecture switching
 */

export function initBreadcrumbNav() {
  const toggles = document.querySelectorAll(".st-breadcrumb__dropdown-toggle");
  if (!toggles.length) return;

  // Close all dropdowns
  function closeAll(except) {
    toggles.forEach((btn) => {
      if (btn !== except) {
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Toggle dropdown on button click
  toggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      closeAll(btn);
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  // Close on clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".st-breadcrumb__item--has-dropdown")) {
      closeAll();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAll();
      // Return focus to the last toggled button
      document.activeElement?.blur();
    }
  });

  // Keyboard navigation within dropdowns
  toggles.forEach((btn) => {
    const dropdown = btn.nextElementSibling;
    if (!dropdown) return;

    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && btn.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        const firstLink = dropdown.querySelector(".st-breadcrumb__dropdown-link");
        firstLink?.focus();
      }
    });

    dropdown.addEventListener("keydown", (e) => {
      const links = [...dropdown.querySelectorAll(".st-breadcrumb__dropdown-link")];
      const idx = links.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        links[(idx + 1) % links.length]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx <= 0) {
          btn.focus();
        } else {
          links[idx - 1]?.focus();
        }
      }
    });
  });
}
