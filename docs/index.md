# quantecon-sphinx-theme

A clean, modern, content-focused Sphinx theme for scientific documentation.

```{toctree}
:maxdepth: 2

getting-started
configuration
gallery
kitchen-sink
```

## Features

- **Collapsible RHS Table of Contents** with scroll-spy and auto-expand
- **Dark / Light / Auto mode** — respects system preference, no flash of wrong theme
- **Scientific markup** — MathJax v3, syntax-highlighted code blocks, admonitions
- **Colour emphasis** — configurable colour schemes for emphasis and strong text
- **Responsive design** — works beautifully on mobile, tablet, and desktop
- **Fully themeable** — 40+ CSS custom properties for complete customization

## Quick Start

There is no PyPI release yet, so install from the repository and pin a commit:

```bash
pip install "quantecon-sphinx-theme @ git+https://github.com/QuantEcon/quantecon-sphinx-theme@6a22984"
```

Then set `html_theme = "quantecon_sphinx_theme"` in your Sphinx `conf.py`.
