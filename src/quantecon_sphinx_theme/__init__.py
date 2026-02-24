"""quantecon-sphinx-theme — A clean, modern, content-focused Sphinx theme."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from bs4 import BeautifulSoup
from docutils import nodes
from sphinx.application import Sphinx
from sphinx.environment import BuildEnvironment
from sphinx.util import logging

__version__ = "0.1.0"

logger = logging.getLogger(__name__)


def get_html_theme_path():
    """Return the path to the theme's template/static directory."""
    return str(Path(__file__).parent / "theme" / "quantecon_sphinx_theme")


# ── Table of Contents Processing ──────────────────────────────────────────


def _generate_toc_html(toc_html: str) -> str:
    """Process Sphinx-generated ToC HTML for the RHS panel.

    Adds appropriate CSS classes for scroll-spy and collapsible subsections.
    """
    if not toc_html:
        return ""

    soup = BeautifulSoup(toc_html, "html.parser")

    # Add nav classes to all <ul> elements
    for i, ul in enumerate(soup.find_all("ul")):
        classes = ["st-toc-list"]
        if i == 0:
            classes.append("st-toc-list--root")
        else:
            classes.append("st-toc-list--nested")
        ul["class"] = ul.get("class", []) + classes

    # Add link classes and depth markers
    for a in soup.find_all("a"):
        a["class"] = a.get("class", []) + ["st-toc-link"]

    # Add item classes to <li> elements
    for li in soup.find_all("li"):
        li["class"] = li.get("class", []) + ["st-toc-item"]
        # Mark items with children
        if li.find("ul"):
            li["class"].append("st-toc-item--has-children")

    return str(soup)


# ── Breadcrumb Context Generation ─────────────────────────────────────────


def _build_breadcrumb_context(
    app: Sphinx, pagename: str
) -> dict[str, Any]:
    """Traverse the Sphinx toctree to produce breadcrumb data.

    Returns a dict with keys destined for the Jinja context:
      st_breadcrumb_part   — {title, url} for the current part (or None)
      st_breadcrumb_parts  — [{title, url, current}] all top-level parts
      st_breadcrumb_page   — {title, url} for the current page (or None)
      st_breadcrumb_siblings — [{title, url, current}] sibling pages within
                               the current part
    """
    env: BuildEnvironment = app.env
    builder = app.builder
    master = env.config.master_doc

    result: dict[str, Any] = {
        "st_breadcrumb_part": None,
        "st_breadcrumb_parts": [],
        "st_breadcrumb_page": None,
        "st_breadcrumb_siblings": [],
    }

    if pagename == master:
        # On the landing page — no breadcrumb parts/pages needed
        return result

    # Get the full toctree structure from the master document.
    # Each top-level child of master_doc is a "part".
    toctree_info = _get_toctree_structure(env, master)
    if not toctree_info:
        return result

    parts: list[dict[str, Any]] = []
    current_part: dict[str, Any] | None = None
    current_siblings: list[dict[str, Any]] = []
    page_entry: dict[str, Any] | None = None

    for part_title, part_docname, part_children in toctree_info:
        part_url = builder.get_relative_uri(pagename, part_docname)
        is_current_part = False

        # Check if pagename is this part's docname or one of its children
        if part_docname == pagename:
            is_current_part = True
        else:
            for _child_title, child_docname in part_children:
                if child_docname == pagename:
                    is_current_part = True
                    break

        part_entry = {
            "title": part_title,
            "url": part_url,
            "current": is_current_part,
        }
        parts.append(part_entry)

        if is_current_part:
            current_part = part_entry

            # Build sibling list (pages under this part)
            if part_children:
                for child_title, child_docname in part_children:
                    child_url = builder.get_relative_uri(
                        pagename, child_docname
                    )
                    is_current_page = child_docname == pagename
                    sibling = {
                        "title": child_title,
                        "url": child_url,
                        "current": is_current_page,
                    }
                    current_siblings.append(sibling)
                    if is_current_page:
                        page_entry = sibling
            else:
                # The part *is* the current page (no children)
                page_entry = {
                    "title": part_title,
                    "url": part_url,
                    "current": True,
                }

    result["st_breadcrumb_parts"] = parts
    result["st_breadcrumb_part"] = current_part
    result["st_breadcrumb_siblings"] = current_siblings
    result["st_breadcrumb_page"] = page_entry

    return result


def _get_toctree_structure(
    env: BuildEnvironment, docname: str
) -> list[tuple[str, str, list[tuple[str, str]]]]:
    """Extract the two-level toctree structure from *docname*.

    Returns a list of (part_title, part_docname, [(child_title, child_docname)]).
    Works by inspecting the toctree nodes embedded in the document.
    """
    structure: list[tuple[str, str, list[tuple[str, str]]]] = []

    try:
        doctree = env.get_doctree(docname)
    except Exception:
        return structure

    for toctree_node in doctree.findall(nodes.compound):
        # Sphinx wraps toctree in a compound node with class "toctree-wrapper"
        if "toctree-wrapper" not in toctree_node.get("classes", []):
            continue

        for toc_node in toctree_node.findall(
            lambda n: n.tagname == "toctree"  # type: ignore[attr-defined]
        ):
            entries = toc_node.get("entries", [])
            for title, ref in entries:
                # *title* may be None (auto-title from the referenced doc)
                if title is None:
                    title = _resolve_doc_title(env, ref)
                children = _get_child_entries(env, ref)
                structure.append((title, ref, children))

    return structure


def _get_child_entries(
    env: BuildEnvironment, docname: str
) -> list[tuple[str, str]]:
    """Get immediate child entries from toctrees in *docname*."""
    children: list[tuple[str, str]] = []
    try:
        doctree = env.get_doctree(docname)
    except Exception:
        return children

    for compound in doctree.findall(nodes.compound):
        if "toctree-wrapper" not in compound.get("classes", []):
            continue
        for toc_node in compound.findall(
            lambda n: n.tagname == "toctree"  # type: ignore[attr-defined]
        ):
            for title, ref in toc_node.get("entries", []):
                if title is None:
                    title = _resolve_doc_title(env, ref)
                children.append((title, ref))
    return children


def _resolve_doc_title(env: BuildEnvironment, docname: str) -> str:
    """Resolve the title of a document from the environment."""
    if docname in env.titles:
        return env.titles[docname].astext()
    return docname.split("/")[-1].replace("-", " ").replace("_", " ").title()


# ── Page Context Injection ─────────────────────────────────────────────────


def _add_page_context(app, pagename, templatename, context, doctree):
    """Inject custom variables into the template context."""
    # Process the table of contents for the RHS panel
    raw_toc = context.get("toc", "")
    context["st_toc_html"] = _generate_toc_html(raw_toc)

    # Breadcrumb navigation context
    breadcrumb = _build_breadcrumb_context(app, pagename)
    context.update(breadcrumb)

    # Theme options shortcuts
    theme_options = context.get("theme_options", {})
    context["st_dark_mode"] = theme_options.get("dark_mode", "auto")
    context["st_color_scheme"] = theme_options.get("color_scheme", "default")
    context["st_toc_sticky"] = theme_options.get("toc_sticky", True)
    context["st_toc_autoexpand"] = theme_options.get("toc_autoexpand", True)
    context["st_show_page_toc_title"] = theme_options.get(
        "show_page_toc_title", True
    )
    context["st_mathjax_macros"] = theme_options.get("mathjax_macros", True)
    context["st_google_fonts"] = theme_options.get("google_fonts", True)


def setup(app):
    """Register the theme with Sphinx."""
    app.setup_extension("pydata_sphinx_theme")

    app.add_html_theme("quantecon_sphinx_theme", get_html_theme_path())

    # Register our compiled JS bundle
    app.add_js_file("scripts/quantecon-sphinx-theme.js")

    # Register context injection
    app.connect("html-page-context", _add_page_context)

    return {
        "version": __version__,
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
