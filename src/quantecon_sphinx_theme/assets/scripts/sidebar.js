/**
 * Breadcrumb Navigation — Dropdown toggles for part/lecture switching,
 * smooth-scroll for section anchors, and scroll-spy for active section.
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

  // ── Smooth-scroll for section anchor links ──────────────────────────
  const sectionLinks = document.querySelectorAll(".st-breadcrumb__section-link");
  const sectionToggle = document.querySelector(".st-breadcrumb__section-toggle");
  const topbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--st-topbar-height") || "56",
    10
  );

  sectionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      closeAll();

      // Scroll with offset for the fixed top bar
      const y = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 16;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Update URL hash without jumping
      history.pushState(null, "", href);
    });
  });

  // ── Scroll-spy: update section toggle text with current H2 ─────────
  if (sectionToggle && sectionLinks.length) {
    const sectionTextEl = sectionToggle.querySelector(".st-breadcrumb__section-text");
    const defaultLabel = "Sections";
    const sectionAnchors = [...sectionLinks].map((a) => a.getAttribute("href")?.slice(1)).filter(Boolean);
    const sectionElements = sectionAnchors.map((id) => document.getElementById(id)).filter(Boolean);

    if (sectionTextEl && sectionElements.length) {
      // Build a map from element to link text
      const labelMap = new Map();
      sectionLinks.forEach((a) => {
        const id = a.getAttribute("href")?.slice(1);
        if (id) labelMap.set(id, a.textContent.trim());
      });

      let ticking = false;
      function updateActiveSection() {
        ticking = false;
        const scrollY = window.scrollY + topbarHeight + 32;
        let activeId = null;

        // Walk in reverse — find the last section that's above the viewport top
        for (let i = sectionElements.length - 1; i >= 0; i--) {
          if (sectionElements[i].getBoundingClientRect().top + window.scrollY <= scrollY) {
            activeId = sectionElements[i].id;
            break;
          }
        }

        if (activeId && labelMap.has(activeId)) {
          sectionTextEl.textContent = labelMap.get(activeId);
        } else {
          sectionTextEl.textContent = defaultLabel;
        }

        // Highlight active section link in dropdown
        sectionLinks.forEach((a) => {
          const id = a.getAttribute("href")?.slice(1);
          a.classList.toggle("st-breadcrumb__dropdown-link--current", id === activeId);
        });
      }

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateActiveSection);
          ticking = true;
        }
      }, { passive: true });

      // Initial check
      updateActiveSection();
    }
  }
}
