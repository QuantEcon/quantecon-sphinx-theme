# Getting Started

## Installation

```bash
pip install quantecon-sphinx-theme
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
