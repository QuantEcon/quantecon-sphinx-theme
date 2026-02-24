/**
 * Code Blocks — Responsive table wrappers
 */

export function initCodeBlocks() {
  // Wrap wide tables in a scrollable container
  document.querySelectorAll(".st-content__inner table").forEach((table) => {
    if (table.parentElement?.classList.contains("st-table-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("st-table-wrapper");
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}
