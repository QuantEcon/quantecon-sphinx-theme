/**
 * quantecon-sphinx-theme — Main JS entry point
 *
 * Imports all modules and initialises them on DOMContentLoaded.
 */

import "../styles/index.scss";

import { initThemeToggle } from "./theme-toggle";
import { initToc } from "./toc";
import { initSidebar } from "./sidebar";
import { initSearch } from "./search";
import { initCodeBlocks } from "./code-blocks";
import { initBackToTop } from "./back-to-top";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initToc();
  initSidebar();
  initSearch();
  initCodeBlocks();
  initBackToTop();
});
