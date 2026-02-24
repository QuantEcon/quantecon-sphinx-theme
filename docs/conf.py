# Configuration file for the Sphinx documentation builder.

project = "quantecon-sphinx-theme"
copyright = "2026, QuantEcon"
author = "QuantEcon"

extensions = [
    "myst_parser",
]

# Theme
html_theme = "quantecon_sphinx_theme"
html_title = "quantecon-sphinx-theme"

html_theme_options = {
    "color_scheme": "default",
    "dark_mode": "auto",
    "toc_sticky": True,
    "toc_autoexpand": True,
    "repository_url": "https://github.com/QuantEcon/quantecon-sphinx-theme",
    "use_repository_button": True,
}

# MyST
myst_enable_extensions = [
    "colon_fence",
    "dollarmath",
    "amsmath",
]
