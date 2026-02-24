"""quantecon-sphinx-theme — A clean, modern, content-focused Sphinx theme."""

from pathlib import Path

from bs4 import BeautifulSoup

__version__ = "0.1.0"


def get_html_theme_path():
    """Return the path to the theme's template/static directory."""
    return str(Path(__file__).parent / "theme" / "quantecon_sphinx_theme")


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


def _add_page_context(app, pagename, templatename, context, doctree):
    """Inject custom variables into the template context."""
    # Process the table of contents for the RHS panel
    raw_toc = context.get("toc", "")
    context["st_toc_html"] = _generate_toc_html(raw_toc)

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

    # Register context injection
    app.connect("html-page-context", _add_page_context)

    return {
        "version": __version__,
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
