# Getting Started

## Installation

There is no PyPI release yet, so install from the repository and pin a commit:

```bash
pip install "quantecon-sphinx-theme @ git+https://github.com/QuantEcon/quantecon-sphinx-theme@6a22984"
```

## Basic Setup

In your Sphinx `conf.py`:

```python
html_theme = "quantecon_sphinx_theme"
```

For Jupyter Book, set in `_config.yml`:

```yaml
sphinx:
  config:
    html_theme: quantecon_sphinx_theme
```

## Theme Options

Customize the theme via `html_theme_options`:

```python
html_theme_options = {
    # Appearance
    "color_scheme": "default",    # "default" | "academic" | "minimal"
    "dark_mode": "auto",          # "auto" | "light" | "dark" | "toggle"

    # Table of Contents
    "toc_sticky": True,
    "toc_autoexpand": True,
    "toc_collapsible": True,

    # Repository
    "repository_url": "https://github.com/you/your-repo",
    "use_repository_button": True,
}
```

## Developer Setup

To work on the theme itself:

### Prerequisites

- Python ≥ 3.12
- Node.js ≥ 20 (managed by sphinx-theme-builder, or install via [nvm](https://github.com/nvm-sh/nvm))
- [nox](https://nox.thea.codes/) for session management

### Quick Start

```bash
git clone https://github.com/QuantEcon/quantecon-sphinx-theme.git
cd quantecon-sphinx-theme
make setup    # npm install + pip install -e ".[dev]"
```

### Building Assets

The theme's CSS and JS are compiled from SCSS/JS sources via webpack:

```bash
make build    # one-shot compile
make dev      # watch mode — recompile on change
```

### Building the Docs

Use **nox** to build in an isolated session:

```bash
make docs     # nox -s docs → builds to docs/_build/html
```

### Live-Reload Development

For interactive development, **`stb serve`** (from `sphinx-theme-builder`) is
the recommended workflow. It watches both the theme source files and the docs
content, rebuilds automatically, and live-reloads in the browser:

```bash
make docs-live    # nox -s docs-live → stb serve docs/
```

This runs on `http://localhost:8000` by default. Any change to SCSS, JS,
templates, or doc content triggers an automatic rebuild.

```{tip}
`stb serve` handles the Node build internally, so you don't need to run
`npm run build` separately when using live-reload.
```

### Sphinx Version Matrix

To verify compatibility across Sphinx 7.x and 8.x:

```bash
make test     # nox -s tests — runs against Sphinx 7.4 + 8.0, Python 3.12 + 3.13
```

### Makefile Reference

| Command | Description |
|---------|-------------|
| `make setup` | Install Node + Python dependencies |
| `make build` | Compile SCSS/JS assets once |
| `make dev` | Watch mode — recompile on file change |
| `make docs` | Build docs in isolated nox session |
| `make docs-live` | Live-reload docs via `stb serve` |
| `make test` | Sphinx version compatibility matrix |
| `make clean` | Remove all build artefacts |
