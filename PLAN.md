# quantecon-sphinx-theme — Design & Implementation Plan

> **Status:** Draft  
> **Created:** 2026-02-24  
> **Authors:** QuantEcon Team

---

## 1. Vision & Goals

### 1.1 Why a New Theme?

The `quantecon-book-theme` has evolved into an excellent reading experience for
scientific lectures. However, it is tightly coupled to the QuantEcon brand —
logos, colors, toolbar copy, launch buttons, and opinionated defaults all assume
a QuantEcon context. Many of its innovations (collapsible ToC, dark mode, code
styling, scientific markup) are genuinely useful to the broader Jupyter Book /
Sphinx community.

**`quantecon-sphinx-theme`** extracts these reusable components into a
brand-neutral, general-purpose Sphinx theme that:

1. Works out of the box with **Jupyter Book ≥ 1.0** (Sphinx 7–8).
2. Provides a **clean, modern, content-focused** reading experience.
3. Is easy to customise via CSS custom properties and theme options.
4. Serves as the **upstream base** that `quantecon-book-theme` can later
   inherit from, reducing duplication.

### 1.2 Design Principles

| Principle | Meaning |
|-----------|---------|
| **Content first** | Maximise the reading area; chrome should disappear until needed. |
| **Scientific native** | Math, code, admonitions, cross-references, and figures are first-class citizens. |
| **Accessible** | WCAG 2.1 AA contrast, keyboard navigation, reduced-motion support, semantic HTML. |
| **Themeable** | Colors, fonts, and layout parameters exposed as CSS custom properties. |
| **Minimal opinion** | No brand assets, no launch buttons by default — opt-in via config. |
| **Progressive enhancement** | Core reading experience works without JS; JS adds polish (scroll-spy, transitions, dark mode persistence). |

---

## 2. Feature Set

### 2.1 Core Features (MVP — Phase 1)

| # | Feature | Source Reference |
|---|---------|-----------------|
| 1 | **Collapsible RHS Table of Contents** | `quantecon-book-theme` scrollspy.js + _page.scss |
| 2 | **Dark / Light mode** with persistence & flash prevention | theme-settings.js + _dark-theme.scss |
| 3 | **Scientific markup styling** — MathJax v3 macros, code blocks, admonitions | layout.html + _content.scss + _code.scss + _admonitions.scss |
| 4 | **Colour emphasis system** — configurable colour schemes for `<em>`, `<strong>`, `<dt>` | _colors.scss + _color-schemes.scss |
| 5 | **LHS navigation sidebar** — collapsible, persistent state | sidebar.js + _sidebar.scss |
| 6 | **Responsive design** — mobile-first breakpoints | _breakpoints.scss |
| 7 | **Typography** — clean serif/sans-serif font pairing, configurable | _base.scss, Google Fonts |
| 8 | **Code highlighting** — built-in theme + Pygments fallback | _code.scss + `setup_pygments_css()` |
| 9 | **Search** — integrated search bar | search.js |
| 10 | **Back-to-top button** | navigation.js |

### 2.2 Extended Features (Phase 2)

| # | Feature | Notes |
|---|---------|-------|
| 11 | **Collapsible code cells** | `tag_collapse` class convention |
| 12 | **Collapsible stderr warnings** | stderr-warnings.js pattern |
| 13 | **Font size controls** | ± buttons, localStorage persistence |
| 14 | **Fullscreen mode** | Fullscreen API toggle |
| 15 | **RTL support** | _rtl.scss |
| 16 | **Social meta tags** (OpenGraph / Twitter Card) | Template-level SEO |
| 17 | **Git last-modified dates** | Git log integration (opt-in) |
| 18 | **Launch button framework** | Pluggable Binder/Colab/JupyterHub URLs |
| 19 | **PDF download support** | Optional modal with download links |

### 2.3 Non-Goals (Stay in quantecon-book-theme only)

- QuantEcon branding, logos, "Theme by QuantEcon" footer
- QuantEcon-specific toolbar links
- QuantEcon project metadata defaults
- Pre-configured launch button URLs for QuantEcon repos

---

## 3. Layout Exploration

One of the key design questions is the **page layout**. Below we explore three
candidate layouts, with the intent of choosing one (or a configurable hybrid)
for the MVP.

### 3.1 Layout A — Classic Top Bar (Current)

```
┌─────────────────────────────────────────────────────┐
│  TOOLBAR (sticky)                  [☀/🌙] [🔍] [⛶] │
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│   LHS    │      MAIN CONTENT        │   RHS ToC     │
│  SIDEBAR │                          │  (collapsible)│
│  (nav)   │                          │               │
│          │                          │               │
├──────────┴──────────────────────────┴───────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Familiar pattern (pydata, ReadTheDocs, sphinx-book-theme)
- Users already know how to navigate
- Toolbar provides persistent access to controls

**Cons:**
- Toolbar steals vertical space on small screens
- Three-column layout can feel cramped at mid-width viewpoints
- LHS sidebar duplicates browser bookmarks / tab management

### 3.2 Layout B — Right-Hand Sidebar (Exploratory)

```
┌────────────────────────────────────────┬────────────┐
│                                        │            │
│                                        │   RHS BAR  │
│          MAIN CONTENT                  │   ┌──────┐ │
│         (full width)                   │   │ Nav  │ │
│                                        │   │ Tree │ │
│                                        │   ├──────┤ │
│                                        │   │ Page │ │
│                                        │   │ ToC  │ │
│                                        │   ├──────┤ │
│                                        │   │[☀/🌙]│ │
│                                        │   │[🔍]  │ │
│                                        │   └──────┘ │
├────────────────────────────────────────┴────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

**Concept:** Merge the LHS sidebar, RHS ToC, and toolbar into a single
right-hand panel. The main content gets full width on the left without any top
bar stealing vertical space.

**Pros:**
- **Maximum vertical space** for content — no sticky top bar
- **Single navigation surface** — reduces cognitive load
- Natural reading flow: eyes start at the left margin, controls are "off to the side"
- Feels fresh and distinct from existing Sphinx themes
- On mobile, the RHS panel collapses into a slide-out drawer (from right edge),
  preserving full-width content

**Cons:**
- Unconventional — may confuse users expecting top-bar navigation
- RHS panel needs to handle two concerns (site nav + page ToC) gracefully
- Less screen width for content on wide monitors if panel is always visible
- Western reading direction (LTR) means the eye naturally ends at the right — 
  could be distracting to have controls there

**Mitigation ideas:**
- Panel collapses to a thin icon strip (≈48px) with tooltips; expands on hover/click
- Panel sections are accordion-style: only one (Nav or ToC) open at a time
- Content max-width (e.g. 48rem) ensures readability regardless of remaining space
- "Zen mode" button hides the panel entirely

### 3.3 Layout C — Hybrid (Breadcrumb Nav Bar + RHS Panel) ✅ CHOSEN

```
┌─────────────────────────────────────────────────────┐
│  🏠 › Part III  › Markov Chains        [☀/🌙] [🔍] │  ← 40px breadcrumb bar
├─────────────────────────────────────────┬───────────┤
│                                         │           │
│                                         │  RHS ToC  │
│           MAIN CONTENT                  │  + Page   │
│          (wide, centered)               │  controls │
│                                         │           │
│                                         │           │
├─────────────────────────────────────────┴───────────┤
│  FOOTER  · Theme by QuantEcon                       │
└─────────────────────────────────────────────────────┘
```

**Concept:** A thin top bar functions as a **breadcrumb navigation bar** that
shows the reader's position within the book:

```
🏠 Home  ›  Part X  ›  Lecture Title
```

- **Home (icon)** — returns to the book's main index page
- **Part X** — clickable; opens a dropdown/popover listing all parts, allowing
  the reader to jump to another part of the book
- **Lecture Title** — clickable; opens a dropdown listing all lectures within
  the current part, allowing the reader to switch lectures

This replaces both the traditional "Site Title" label and the hamburger menu.
The breadcrumb **is** the site navigation — compact, contextual, and always
visible. The RHS panel handles within-page navigation (ToC).

**Pros:**
- **Near-full vertical** and **near-full horizontal** space for content
- **Contextual navigation** — the reader always knows where they are in the book
- **Two clear navigation levels:** breadcrumb bar for site-level (between pages),
  RHS ToC for page-level (within page)
- No hamburger menu needed — navigation is inline and discoverable
- RHS ToC stays visible for within-page navigation
- Clean, magazine-like feel

**Cons:**
- Breadcrumb dropdowns need careful UX on mobile (may need to collapse to
  a truncated form)
- Requires Sphinx toctree metadata to build the breadcrumb trail

### 3.4 Decision: Layout C with Breadcrumb Navigation

> **Status: CONFIRMED**

**Layout C (Hybrid) with breadcrumb navigation bar** is the chosen direction:

1. It preserves the best feature (collapsible RHS ToC with scroll-spy) in a
   prominent position.
2. The breadcrumb bar replaces both the site title and the hamburger menu,
   providing **always-visible, contextual navigation** without the
   discoverability problems of a hamburger.
3. The thin bar provides anchoring without stealing reading space.
4. It is visually **distinct** from `quantecon-book-theme` (which has a
   prominent LHS sidebar + full toolbar) while retaining the best UX elements.
5. Layout B (full RHS) can be explored as an **alternative layout option** in
   Phase 2, since the architecture supports swapping layout templates.

#### Breadcrumb Navigation Specification

```
🏠  ›  Part III: Dynamic Programming  ›  Shortest Paths
 ↑         ↑ dropdown: all parts            ↑ dropdown: lectures in Part III
 │         │                                 │
 Home      Click to see/switch parts         Click to see/switch lectures
```

- **Home icon:** Always links to `master_doc` (book index)
- **Part dropdown:** Lists all top-level toctree entries (the book's parts).
  Current part is highlighted. Clicking switches to that part's index.
- **Lecture dropdown:** Lists all pages within the current part. Current page
  is highlighted. Clicking navigates to that lecture.
- **Mobile:** Breadcrumb truncates to `🏠 › … › Lecture Title` with the
  middle segments accessible via a tap-to-expand menu.
- **Single-page sites:** Breadcrumb simplifies to just the site title.

---

## 4. Colour & Typography

### 4.1 Colour System

The theme will use **CSS custom properties** throughout, making it fully
re-themeable. The default palette should be neutral and professional.

The palette is deliberately **distinct from `quantecon-book-theme`** (which
uses blue primary, teal emphasis, and amber strong). This theme uses **indigo**
as the primary, **emerald** for emphasis, and **rose** for strong — creating a
fresh, scholarly feel that is immediately recognisable as a different theme.

```css
/* Light mode defaults */
:root {
  --st-color-primary:     #6366f1;  /* Indigo — links, active states */
  --st-color-secondary:   #64748b;  /* Slate — muted text */
  --st-color-accent:      #8b5cf6;  /* Violet — highlights */
  --st-color-bg:          #ffffff;
  --st-color-surface:     #f8fafc;  /* Cards, code blocks */
  --st-color-border:      #e2e8f0;
  --st-color-text:        #1e293b;
  --st-color-text-muted:  #64748b;
  --st-color-em:          #059669;  /* Emerald — <em> tags */
  --st-color-strong:      #e11d48;  /* Rose — <strong> tags */
  --st-color-code-bg:     #f1f5f9;
}

/* Dark mode */
[data-theme="dark"] {
  --st-color-primary:     #818cf8;  /* Lighter indigo */
  --st-color-bg:          #18181b;  /* Zinc-950 */
  --st-color-surface:     #27272a;  /* Zinc-800 */
  --st-color-border:      #3f3f46;  /* Zinc-700 */
  --st-color-text:        #e4e4e7;  /* Zinc-200 */
  --st-color-text-muted:  #a1a1aa;  /* Zinc-400 */
  --st-color-em:          #34d399;  /* Emerald-400 */
  --st-color-strong:      #fb7185;  /* Rose-400 */
  --st-color-code-bg:     #27272a;
}
```

**Comparison with quantecon-book-theme:**

| Property | quantecon-book-theme | quantecon-sphinx-theme |
|----------|---------------------|------------------------|
| Primary | Blue (#2563eb) | Indigo (#6366f1) |
| Emphasis (`<em>`) | Teal (#0d9488) | Emerald (#059669) |
| Strong (`<strong>`) | Amber (#d97706) | Rose (#e11d48) |
| Dark bg | Navy (#1a1a2e) | Zinc (#18181b) |
| Dark text | Slate (#e2e8f0) | Zinc (#e4e4e7) |
| Feel | Warm, golden | Cool, scholarly |

**CSS variable prefix:** `--st-` (for "sphinx theme") — short, unlikely to
collide, easy to type.

### 4.2 Colour Schemes for Emphasis

Following the quantecon-book-theme pattern, provide named colour schemes:

| Scheme | `<em>` colour | `<strong>` colour | Description |
|--------|--------------|-------------------|-------------|
| `default` | Emerald | Rose | Cool, scholarly, modern |
| `academic` | Navy | Burgundy | Traditional academic feel |
| `minimal` | Inherit | Bold only (no colour) | For users who want plain text |

Configurable via `html_theme_options["color_scheme"]`.

### 4.3 Typography

**Default fonts:**
- **Headings:** Inter (or system sans-serif stack as fallback)
- **Body:** Source Serif 4 (or system serif stack)
- **Code:** JetBrains Mono / Fira Code (or monospace stack)

All font choices overridable via CSS custom properties:
```css
:root {
  --st-font-heading: 'Inter', system-ui, sans-serif;
  --st-font-body:    'Source Serif 4', Georgia, serif;
  --st-font-code:    'JetBrains Mono', 'Fira Code', monospace;
}
```

**Font loading strategy:** Google Fonts via `<link rel="preconnect">` +
`<link rel="stylesheet">` with `font-display: swap`. Users can disable Google
Fonts and supply their own via config.

### 4.4 Dark Mode

The dark mode implementation should improve on quantecon-book-theme:

1. **Use `data-theme` attribute** instead of body class — this follows the
   modern convention (used by Tailwind, Radix, shadcn/ui) and works better with
   CSS selectors: `[data-theme="dark"]`.
2. **Respect `prefers-color-scheme`** by default — auto-detect system
   preference, with manual override persisted to `localStorage`.
3. **Three-state toggle:** Light → Dark → Auto (system) — a common modern
   pattern.
4. **Flash prevention:** Inline `<script>` in `<head>` reads localStorage and
   sets `data-theme` before first paint (same pattern as quantecon-book-theme).
5. **Smooth transitions:** `transition: background-color 0.2s, color 0.2s` on
   `body` during theme switch, disabled on page load.
6. **Image dimming:** `img { opacity: 0.9 }` in dark mode, `1.0` on hover.

---

## 5. Technical Architecture

### 5.1 Inheritance Strategy

```
pydata_sphinx_theme
        ↑
quantecon_sphinx_theme      (this theme — brand-neutral, reusable)
        ↑
quantecon_book_theme        (future: re-inherit from sphinx-theme)
```

**Why inherit from pydata-sphinx-theme directly** (not sphinx-book-theme):

- `sphinx-book-theme` adds book-specific conventions (launch buttons, repository
  links, sidebar structure) that we want to make **optional**, not mandatory.
- `pydata-sphinx-theme` provides the Bootstrap 5 grid, accessible base
  templates, and a robust dark mode foundation.
- We get a cleaner, thinner dependency chain.
- We can selectively incorporate sphinx-book-theme features as opt-in
  extensions rather than inheriting all of them.

### 5.2 Package Structure

```
quantecon-sphinx-theme/
├── PLAN.md                           ← you are here
├── README.md
├── LICENSE                           (MIT)
├── pyproject.toml                    (sphinx-theme-builder backend)
├── package.json                      (webpack + scss + js deps)
├── webpack.config.js                 (SCSS → CSS, JS → bundle)
├── .nvmrc                            (Node 18 or 20)
├── .gitignore
├── .editorconfig
│
├── src/
│   └── quantecon_sphinx_theme/
│       ├── __init__.py               (setup(), get_html_theme_path(), version)
│       │
│       ├── assets/                   (source — compiled by webpack)
│       │   ├── styles/
│       │   │   ├── index.scss        (entry: @forward all partials)
│       │   │   ├── _variables.scss   (CSS custom properties)
│       │   │   ├── _base.scss        (typography, resets)
│       │   │   ├── _layout.scss      (page grid, breakpoints)
│       │   │   ├── _topbar.scss      (minimal top bar)
│       │   │   ├── _sidebar-nav.scss (hamburger slide-out nav)
│       │   │   ├── _toc.scss         (RHS table of contents)
│       │   │   ├── _dark.scss        (dark mode overrides)
│       │   │   ├── _content.scss     (prose: headings, paragraphs, lists)
│       │   │   ├── _math.scss        (MathJax styling)
│       │   │   ├── _code.scss        (code blocks, syntax highlighting)
│       │   │   ├── _admonitions.scss (note, warning, tip, etc.)
│       │   │   ├── _emphasis.scss    (colour schemes for em/strong)
│       │   │   ├── _tables.scss      (responsive table wrappers)
│       │   │   ├── _figures.scss     (figure/caption styling)
│       │   │   ├── _footnotes.scss   (footnote styling)
│       │   │   ├── _search.scss      (search bar styling)
│       │   │   └── _utilities.scss   (spacing, visibility helpers)
│       │   │
│       │   └── scripts/
│       │       ├── index.js          (entry: import & init all modules)
│       │       ├── theme-toggle.js   (dark/light/auto mode)
│       │       ├── toc.js            (scroll-spy, auto-expand, copy links)
│       │       ├── sidebar.js        (hamburger nav: open/close)
│       │       ├── search.js         (search bar expand/collapse)
│       │       ├── code-blocks.js    (collapsible cells, table wrappers)
│       │       ├── back-to-top.js    (scroll-triggered button)
│       │       └── utils.js          (throttle, debounce, localStorage helpers)
│       │
│       └── theme/
│           └── quantecon_sphinx_theme/
│               ├── theme.conf
│               ├── layout.html       (extends pydata_sphinx_theme/layout.html)
│               ├── components/       (Jinja2 partial templates)
│               │   ├── topbar.html
│               │   ├── sidebar-nav.html
│               │   ├── toc-panel.html
│               │   └── footer.html
│               └── static/           (webpack output — .gitignored)
│                   ├── styles/
│                   │   └── quantecon-sphinx-theme.css
│                   └── scripts/
│                       └── quantecon-sphinx-theme.js
│
├── docs/                             (documentation site, built with the theme itself)
│   ├── conf.py
│   ├── index.md
│   ├── getting-started.md
│   ├── configuration.md
│   ├── colour-schemes.md
│   ├── dark-mode.md
│   ├── kitchen-sink.md              (every element for visual testing)
│   └── _toc.yml
│
└── tests/
    ├── conftest.py
    ├── test_build.py                (Sphinx build smoke tests)
    └── visual/                      (Playwright screenshot tests, Phase 2)
```

### 5.3 Theme Configuration Options

```ini
# theme.conf
[theme]
inherit = pydata_sphinx_theme
stylesheet = styles/quantecon-sphinx-theme.css

[options]
# --- Layout ---
layout = hybrid                  # "hybrid" (Layout C) | "classic" (Layout A) — future: "sidebar-right" (Layout B)
content_max_width = 48rem        # Max width of main content area
toc_sticky = True                # Sticky RHS ToC
toc_autoexpand = True            # Auto-expand/collapse ToC subsections on scroll
toc_collapsible = True           # Allow RHS ToC to be collapsed entirely

# --- Appearance ---
color_scheme = default           # "default" | "academic" | "minimal" | path to custom CSS
dark_mode = auto                 # "auto" (system pref) | "light" | "dark" | "toggle" (user choice)
dark_logo =                      # Logo for dark mode (optional)
google_fonts = True              # Load fonts from Google Fonts CDN
custom_css =                     # Path to additional custom CSS file

# --- Code ---
code_style = theme               # "theme" (built-in) | "pygments" (use Sphinx pygments_style)
code_font_size = 0.875rem

# --- Scientific ---
mathjax_macros = True            # Include common math macros (\RR, \EE, etc.)

# --- Navigation ---
show_nav_level = 1               # Depth of toctree shown in sidebar nav
persistent_sidebar = False       # Remember sidebar open/close state

# --- Content ---
show_last_modified = False       # Show git last-modified date (requires git)
show_page_toc_title = True       # Show "On this page" heading above RHS ToC

# --- Meta ---
repository_url =
repository_branch = main
path_to_docs =
use_repository_button = False
use_edit_page_button = False
use_issues_button = False

# --- SEO ---
description =
keywords =
og_image =
twitter_handle =
```

### 5.4 Dependencies

```toml
[project]
dependencies = [
  "sphinx>=7,<9",
  "pydata-sphinx-theme>=0.15,<1.0",
  "beautifulsoup4>=4.12",
  "docutils>=0.20",
]
```

Note: **No dependency on `sphinx-book-theme`** — we inherit directly from
`pydata-sphinx-theme`. Features from sphinx-book-theme that we want (e.g.
repository buttons) will be reimplemented in a lighter form.

---

## 6. Phased Roadmap

### Phase 1 — MVP (Weeks 1–4)

**Goal:** A working, installable theme that renders a Jupyter Book site with
all core features.

| Week | Milestone |
|------|-----------|
| 1 | Repo scaffold, build pipeline (webpack + sphinx-theme-builder), basic `layout.html` extending pydata-sphinx-theme, minimal CSS with custom properties |
| 2 | Layout C implementation: thin top bar, hamburger nav overlay, RHS ToC panel with scroll-spy |
| 3 | Dark/light mode (three-state), colour emphasis system, typography, code block styling |
| 4 | Scientific markup (MathJax config, admonitions), responsive breakpoints, docs site, testing |

**Exit criteria:**
- `pip install quantecon-sphinx-theme` works
- A Jupyter Book site built with `html_theme = "quantecon_sphinx_theme"` renders
  correctly with all 10 core features
- Dark mode, RHS ToC, and code highlighting work
- Docs site live with getting-started guide and kitchen-sink page

### Phase 2 — Polish & Extended Features (Weeks 5–8)

- Collapsible code cells, stderr warnings
- Font size controls, fullscreen mode
- RTL support
- SEO meta tags
- Git last-modified integration
- Launch button framework (opt-in)
- Layout A ("classic") as an alternative option
- Playwright visual regression tests
- Accessibility audit (axe-core)

### Phase 3 — Ecosystem Integration (Weeks 9–12)

- Publish to PyPI
- Layout B exploration (full RHS sidebar)
- Port `quantecon-book-theme` to inherit from `quantecon-sphinx-theme`
- Community documentation and contribution guide
- Theme gallery / showcase
- Performance audit (Lighthouse)

---

## 7. Resolved Decisions

1. **Naming:** Keep `quantecon-sphinx-theme` for now. May revisit with a
   brand-neutral name later.

2. **Layout direction:** ✅ **Layout C (Hybrid) with breadcrumb navigation**.
   The top bar shows `🏠 › Part X › Lecture Title` with clickable dropdowns
   for switching between parts and lectures. RHS ToC for within-page nav.

3. **pydata-sphinx-theme vs from scratch:** ✅ **Inherit from pydata for MVP.**
   It gives us search templates, toctree rendering, and accessibility
   foundations for free. Our template overrides are clean enough that we could
   drop the dependency later if desired. All visual styling is through our own
   `--st-*` custom properties, not Bootstrap classes.

4. **Font loading:** ✅ **Google Fonts CDN** with `font-display: swap`.

5. **MathJax macros:** ✅ **Economics-focused by default, configurable.** Ship
   common econ macros (`\RR`, `\EE`, `\PP`, `\NN`, `\ZZ`, `\QQ`, `\CC`,
   `\argmax`, `\argmin`) with `mathjax_macros = True`. Users can disable or
   extend via `mathjax_macros = False` and their own MathJax config.

6. **Minimum Python version:** ✅ **Python ≥ 3.12** — modern Python, aligned
   with quantecon-book-theme.

7. **Colour scheme:** ✅ **Indigo/Emerald/Rose palette** — deliberately distinct
   from quantecon-book-theme's Blue/Teal/Amber. Cool, scholarly feel.

8. **Branding:** ✅ **"Theme by QuantEcon"** in the footer as recognition.

---

## 8. Competitive Landscape

Understanding what exists helps us position this theme:

| Theme | Strengths | Gaps we fill |
|-------|-----------|-------------|
| **pydata-sphinx-theme** | Solid base, widely used | No scientific emphasis, no collapsible ToC, no colour schemes |
| **sphinx-book-theme** | Good for Jupyter Books | Tied to book conventions, heavy sidebar, limited dark mode |
| **furo** | Beautiful, clean, dark mode | No RHS ToC, no scientific markup focus, no colour emphasis |
| **sphinx-rtd-theme** | Ubiquitous | Dated design, no dark mode, rigid layout |
| **sphinx-immaterial** | Material Design, modern | Complex, opinionated, heavy |

**Our niche:** A **content-focused, scientifically-aware** theme with
**excellent dark mode**, **collapsible RHS navigation**, and **configurable
colour emphasis** — positioned between furo's minimalism and pydata's
feature-richness.

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Bundle size (CSS + JS) | < 100KB gzipped |
| Time to integrate into existing Jupyter Book site | < 15 minutes |
| No visual regressions on Sphinx 7.x and 8.x | Playwright CI |

---

## Appendix A: Mockup — Layout C (Hybrid)

### Light Mode
```
╔═══════════════════════════════════════════════════════════╗
║  🏠 › Part III ▾ › Markov Chains ▾      ☀  🔍  GitHub   ║  ← 40px breadcrumb bar
╠═══════════════════════════════════════════╦═══════════════╣
║                                           ║ On this page  ║
║  # Introduction to Markov Chains          ║               ║
║                                           ║ • Introduction║
║  In this lecture we study **Markov         ║ • Definitions ║
║  chains** in discrete time. We will       ║   ○ States    ║
║  examine their *long-run behaviour*       ║   ○ Transition║
║  and convergence properties.              ║ • Convergence ║
║                                           ║ • Exercises   ║
║  ```python                                ║               ║
║  import numpy as np                       ║───────────────║
║  P = np.array([[0.9, 0.1],               ║               ║
║                [0.3, 0.7]])               ║  [↑ Top]      ║
║  ```                                      ║               ║
║                                           ║               ║
╠═══════════════════════════════════════════╩═══════════════╣
║  © 2026 · Theme by QuantEcon                             ║
╚═══════════════════════════════════════════════════════════╝
```

### Part Dropdown (when "Part III" is clicked)
```
╔═══════════════════════════════════════════════════════════╗
║  🏠 › Part III ▾ › Markov Chains ▾      🌙  🔍  GitHub   ║
╠═══════════╦═══════════════════════════════════════════════╣
║           ║                                               ║
║  Part I   ║                                               ║
║  Part II  ║                                               ║
║ •Part III ║   (main content continues underneath)         ║
║  Part IV  ║                                               ║
║           ║                                               ║
╚═══════════╩═══════════════════════════════════════════════╝
```

### Dark Mode
```
╔═══════════════════════════════════════════════════════════╗
║  🏠 › Part III ▾ › Markov Chains ▾      🌙  🔍  GitHub   ║
╠═══════════════════════════════════════════╦═══════════════╣
║                                           ║ On this page  ║
║  # Introduction to Markov Chains          ║               ║
║                                           ║ • Introduction║
║  In this lecture we study Markov          ║ • Definitions ║
║  chains in discrete time.                 ║   ○ States    ║
║                                           ║   ○ Transition║
║  ┌─────────────────────────────────┐      ║ • Convergence ║
║  │ import numpy as np              │      ║ • Exercises   ║
║  │ P = np.array([[0.9, 0.1],      │      ║               ║
║  │               [0.3, 0.7]])      │      ║               ║
║  └─────────────────────────────────┘      ║               ║
╠═══════════════════════════════════════════╩═══════════════╣
║  © 2026 · Theme by QuantEcon                             ║
╚═══════════════════════════════════════════════════════════╝
```

(Dark mode: zinc-charcoal bg, muted text, indigo links, emerald emphasis, rose strong)

---

## Appendix B: CSS Custom Property Reference

Full list of `--st-*` custom properties that users can override:

```css
/* Layout */
--st-content-max-width
--st-sidebar-width
--st-toc-width
--st-topbar-height
--st-content-padding

/* Colors */
--st-color-primary
--st-color-secondary
--st-color-accent
--st-color-bg
--st-color-surface
--st-color-border
--st-color-text
--st-color-text-muted
--st-color-em
--st-color-strong
--st-color-link
--st-color-link-hover
--st-color-code-bg
--st-color-code-text

/* Typography */
--st-font-heading
--st-font-body
--st-font-code
--st-font-size-base
--st-font-size-sm
--st-font-size-lg
--st-line-height

/* Spacing */
--st-space-xs
--st-space-sm
--st-space-md
--st-space-lg
--st-space-xl

/* Borders */
--st-radius-sm
--st-radius-md
--st-radius-lg

/* Transitions */
--st-transition-fast
--st-transition-normal
```
