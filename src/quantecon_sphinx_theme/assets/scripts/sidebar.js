/**
 * Sidebar Navigation — Hamburger menu open/close
 */

export function initSidebar() {
  const sidebar = document.getElementById("st-sidebar-nav");
  if (!sidebar) return;

  const openBtn = document.querySelector(".st-topbar__menu-btn");
  const closeBtn = sidebar.querySelector(".st-sidebar-nav__close");
  const backdrop = sidebar.querySelector(".st-sidebar-nav__backdrop");

  function open() {
    sidebar.classList.add("st-sidebar-nav--open");
    openBtn?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function close() {
    sidebar.classList.remove("st-sidebar-nav--open");
    openBtn?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("st-sidebar-nav--open")) {
      close();
    }
  });
}
