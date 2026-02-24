/**
 * Table of Contents — Scroll-spy with auto-expand/collapse
 *
 * Tracks which section is currently visible and highlights the corresponding
 * ToC link. Expands nested subsections when their parent is active.
 */

import { throttle } from "./utils";

const SCROLL_OFFSET = 120; // px below topbar to consider "active"

function getActiveSection() {
  const headings = document.querySelectorAll(
    ".st-content__inner [id]"
  );
  let active = null;

  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    if (rect.top <= SCROLL_OFFSET) {
      active = heading;
    } else {
      break;
    }
  }

  return active;
}

function highlightTocLink(activeId) {
  const tocNav = document.querySelector(".st-toc__nav");
  if (!tocNav) return;

  // Remove all active states
  tocNav.querySelectorAll(".st-toc-link.active").forEach((link) => {
    link.classList.remove("active");
  });
  tocNav.querySelectorAll(".st-toc-item--expanded").forEach((item) => {
    item.classList.remove("st-toc-item--expanded");
  });

  if (!activeId) return;

  // Find matching link
  const activeLink = tocNav.querySelector(
    `.st-toc-link[href="#${CSS.escape(activeId)}"]`
  );
  if (!activeLink) return;

  activeLink.classList.add("active");

  // Expand ancestor items
  let parent = activeLink.parentElement;
  while (parent && parent !== tocNav) {
    if (parent.classList.contains("st-toc-item")) {
      parent.classList.add("st-toc-item--expanded");
    }
    parent = parent.parentElement;
  }
}

export function initToc() {
  const tocNav = document.querySelector(".st-toc__nav");
  if (!tocNav) return;

  const onScroll = throttle(() => {
    const active = getActiveSection();
    highlightTocLink(active ? active.id : null);
  }, 50);

  window.addEventListener("scroll", onScroll, { passive: true });

  // Initial highlight
  onScroll();

  // Smooth scroll for ToC links
  tocNav.querySelectorAll(".st-toc-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", href);
        }
      }
    });
  });
}
