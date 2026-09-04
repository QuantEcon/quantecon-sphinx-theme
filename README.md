# quantecon-sphinx-theme

A clean, modern, content-focused Sphinx theme for scientific documentation.

Built for [Jupyter Book](https://jupyterbook.org/) ≥ 1.0 and [Sphinx](https://www.sphinx-doc.org/) 7–8.

> [!WARNING]
> **In development — not ready for use.** This theme has no tagged release and is not
> published on PyPI, so there is nothing stable to depend on yet. Whether the project
> continues at all is an open question — see
> [#6](https://github.com/QuantEcon/quantecon-sphinx-theme/issues/6).
>
> If you are choosing a theme today, use
> [quantecon-book-theme](https://github.com/QuantEcon/quantecon-book-theme) for a
> Jupyter Book 1 site, or
> [quantecon-theme.mystmd](https://github.com/QuantEcon/quantecon-theme.mystmd) if you
> are building on Jupyter Book 2 / `mystmd`.

## Features

- **Collapsible RHS Table of Contents** — scroll-spy, auto-expand, copy-link buttons
- **Dark / Light / Auto mode** — respects system preference, smooth transitions, no flash
- **Scientific markup** — MathJax v3, syntax-highlighted code, admonitions
- **Colour emphasis** — configurable colour schemes for `<em>` and `<strong>` elements
- **Responsive** — mobile-first design with clean breakpoints
- **Themeable** — 40+ CSS custom properties for full colour/typography control
- **Layout C (Hybrid)** — minimal top bar + hamburger nav + RHS ToC panel

## Quick Start

There is no PyPI release yet, so install from the repository — and pin a commit, since
`main` is not a stable target:

```bash
pip install "quantecon-sphinx-theme @ git+https://github.com/QuantEcon/quantecon-sphinx-theme@6a22984"
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
