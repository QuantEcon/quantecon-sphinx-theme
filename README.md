# quantecon-sphinx-theme

A clean, modern, content-focused Sphinx theme for scientific documentation.

Built for [Jupyter Book](https://jupyterbook.org/) ≥ 1.0 and [Sphinx](https://www.sphinx-doc.org/) 7–8.

## Features

- **Collapsible RHS Table of Contents** — scroll-spy, auto-expand, copy-link buttons
- **Dark / Light / Auto mode** — respects system preference, smooth transitions, no flash
- **Scientific markup** — MathJax v3, syntax-highlighted code, admonitions
- **Colour emphasis** — configurable colour schemes for `<em>` and `<strong>` elements
- **Responsive** — mobile-first design with clean breakpoints
- **Themeable** — 40+ CSS custom properties for full colour/typography control
- **Layout C (Hybrid)** — minimal top bar + hamburger nav + RHS ToC panel

## Quick Start

```bash
pip install quantecon-sphinx-theme
```

In your `conf.py` (or Jupyter Book `_config.yml`):

```python
html_theme = "quantecon_sphinx_theme"
```

## Configuration

```python
html_theme_options = {
    "color_scheme": "default",       # "default" | "academic" | "minimal"
    "dark_mode": "auto",             # "auto" | "light" | "dark" | "toggle"
    "toc_sticky": True,
    "toc_autoexpand": True,
    "repository_url": "https://github.com/you/your-repo",
    "use_repository_button": True,
}
```

See [PLAN.md](PLAN.md) for the full design document and roadmap.

## Development

```bash
# Clone and install in development mode
git clone https://github.com/QuantEcon/quantecon-sphinx-theme.git
cd quantecon-sphinx-theme

# Install Node.js dependencies and build assets
npm install
npm run build

# Install Python package in editable mode
pip install -e .

# Build the docs
cd docs
make html
```

## License

MIT
