# Theme Gallery

A visual showcase of the theme's configurable options. Each section below
shows what the option controls and how to set it.

---

## Colour Schemes

The `color_scheme` option controls how `*emphasis*` and `**strong**` text
are rendered. Three schemes ship with the theme.

### Default — Emerald / Rose

```python
html_theme_options = {"color_scheme": "default"}
```

The **default** scheme uses Emerald (`#059669`) for *emphasis* and Rose
(`#e11d48`) for **strong**. Here's how they look in context:

> The *Bellman equation* provides a recursive decomposition of the
> **value function** $V(x)$ into a flow payoff and a continuation value.

```{card} Default Scheme
:class-card: sd-border-primary

| Element | Light Mode | Dark Mode |
|---------|-----------|----------|
| *Emphasis* | `#059669` Emerald | `#34d399` Emerald 400 |
| **Strong** | `#e11d48` Rose | `#fb7185` Rose 400 |
| Links | `#6366f1` Indigo | `#818cf8` Indigo 400 |
```

### Academic — Slate / Burgundy

```python
html_theme_options = {"color_scheme": "academic"}
```

A subdued palette inspired by printed textbooks:

```{card} Academic Scheme
:class-card: sd-border-secondary

| Element | Light Mode | Dark Mode |
|---------|-----------|----------|
| *Emphasis* | `#334155` Slate | `#a5b4fc` Indigo 300 |
| **Strong** | `#9f1239` Burgundy | `#fda4af` Rose 300 |
```

### Minimal — No Colour Emphasis

```python
html_theme_options = {"color_scheme": "minimal"}
```

Emphasis and strong inherit the normal text colour. Relies purely on
italic/bold styling — suitable for print-style documents.

---

## Dark Mode

The `dark_mode` option controls the theme toggle behaviour.

::::{grid} 2
:gutter: 3

:::{grid-item-card} `"auto"` (Default)
Respects the OS / browser `prefers-color-scheme` setting. The toggle button
cycles: auto → light → dark → auto.
:::

:::{grid-item-card} `"toggle"`
Starts in light mode. The toggle button switches between light and dark.
User preference is saved in `localStorage`.
:::

:::{grid-item-card} `"light"`
Forces light mode. The toggle button is hidden.
:::

:::{grid-item-card} `"dark"`
Forces dark mode. The toggle button is hidden.
:::
::::

```python
html_theme_options = {"dark_mode": "auto"}  # or "toggle", "light", "dark"
```

### Dark Mode Palette

The dark theme uses a Zinc-based palette for a warm neutral feel:

| Token | Value | Usage |
|-------|-------|-------|
| `--st-color-bg` | `#18181b` | Page background |
| `--st-color-surface` | `#27272a` | Cards, code blocks |
| `--st-color-surface-raised` | `#3f3f46` | Hover states |
| `--st-color-border` | `#3f3f46` | Borders |
| `--st-color-text` | `#e4e4e7` | Body text |
| `--st-color-text-muted` | `#a1a1aa` | Secondary text |

---

## Table of Contents

The right-hand-side table of contents panel has three options:

```python
html_theme_options = {
    "toc_sticky": True,       # Pins the ToC while scrolling
    "toc_autoexpand": True,   # Auto-expand/collapse sections on scroll
    "toc_collapsible": True,  # Allow collapsing the ToC panel entirely
}
```

```{card} ToC Features
- **Scroll-spy** — highlights the current section as you scroll
- **Auto-expand** — nested subsections expand/collapse to match scroll position
- **Sticky** — the panel stays fixed as content scrolls
- **Collapsible** — click the panel header to collapse (content area expands)
```

---

## Breadcrumb Navigation

The top bar uses a breadcrumb pattern for navigating the toctree:

```
🏠 › Part III ▾ › Markov Chains ▾
```

- **Home icon** — always links back to the root page
- **Part dropdown** — click to switch between top-level toctree sections
- **Lecture dropdown** — click to switch between pages within the current part
- Keyboard accessible: arrow keys navigate within dropdowns, Escape closes

---

## Typography

The theme ships with three font stacks loaded via Google Fonts CDN:

| Role | Font | Fallback |
|------|------|----------|
| Headings | Inter | system-ui, sans-serif |
| Body | Source Serif 4 | Georgia, serif |
| Code | JetBrains Mono | Fira Code, Consolas, monospace |

Disable CDN loading if you prefer system fonts or self-hosted:

```python
html_theme_options = {"google_fonts": False}
```

---

## Primary Colour — Indigo

The primary colour (links, active states, focus rings) is Indigo:

| Token | Light | Dark |
|-------|-------|------|
| `--st-color-primary` | `#6366f1` | `#818cf8` |
| `--st-color-primary-light` | `#e0e7ff` | `rgba(129,140,248,0.15)` |
| `--st-color-link` | `#6366f1` | `#818cf8` |
| `--st-color-link-hover` | `#4f46e5` | `#a5b4fc` |

To change the primary colour, override the CSS custom properties:

```css
:root {
  --st-color-primary: #059669;
  --st-color-link: #059669;
  --st-color-link-hover: #047857;
}
```

---

## Code Blocks

```python
html_theme_options = {"code_style": "theme"}  # or "pygments"
```

- **`"theme"`** — the theme provides its own syntax colours (optimised for both
  light and dark mode)
- **`"pygments"`** — falls back to the Pygments style set in `conf.py`

---

## Repository Buttons

```python
html_theme_options = {
    "repository_url": "https://github.com/QuantEcon/quantecon-sphinx-theme",
    "use_repository_button": True,     # GitHub icon in top bar
    "use_edit_page_button": False,     # "Edit on GitHub" link
    "use_issues_button": False,        # "Open issue" link
    "repository_branch": "main",
    "path_to_docs": "docs",
}
```

---

## Footer Branding

The footer shows **"Theme by QuantEcon"** by default. Override with custom HTML:

```python
html_theme_options = {
    "extra_footer": "<p>© 2026 My Organisation</p>",
}
```

When `extra_footer` is set, it appears *above* the theme credit line.

---

## CSS Custom Properties — Full List

All visual properties can be overridden. Add a custom CSS file:

```python
html_static_path = ["_static"]
html_css_files = ["custom.css"]
```

Then in `_static/custom.css`:

```css
:root {
  /* Layout */
  --st-content-max-width: 52rem;
  --st-toc-width: 16rem;
  --st-topbar-height: 2.5rem;

  /* Colours */
  --st-color-primary: #2563eb;
  --st-color-em: #0d9488;
  --st-color-strong: #d97706;

  /* Typography */
  --st-font-heading: 'Poppins', sans-serif;
  --st-font-body: 'Lora', serif;
  --st-font-code: 'Fira Code', monospace;
}
```

See the [Configuration](configuration.md) page for the complete options table
and `PLAN.md` Appendix B for all `--st-*` tokens.
