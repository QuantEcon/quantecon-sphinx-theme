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

### 3.3 Layout C — Hybrid (Minimal Top Bar + RHS Panel)

```
┌─────────────────────────────────────────────────────┐
│  [≡ Site Title]                        [☀/🌙] [🔍] │  ← minimal 40px bar
├─────────────────────────────────────────┬───────────┤
│                                         │           │
│                                         │  RHS ToC  │
│           MAIN CONTENT                  │  + Page   │
│          (wide, centered)               │  controls │
│                                         │           │
│                                         │           │
├─────────────────────────────────────────┴───────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

**Concept:** A thin top bar carries only the site title/logo and global
controls (theme toggle, search). The LHS sidebar is replaced by a hamburger
menu (slide-out overlay). The RHS panel houses the page ToC and optional
controls.

**Pros:**
- **Near-full vertical** and **near-full horizontal** space for content
- Global nav is accessible but unobtrusive (hamburger)
- RHS ToC stays visible for within-page navigation
- The thin top bar is familiar enough to not confuse users
- Clean, magazine-like feel

**Cons:**
- Hamburger menus can reduce discoverability of site navigation
- Two interaction modes (hamburger overlay for nav, persistent panel for ToC)

### 3.4 Recommendation

**Start with Layout C (Hybrid)** for the MVP:

1. It preserves the best feature (collapsible RHS ToC with scroll-spy) in a
   prominent position.
2. It eliminates the heavy LHS sidebar that dominates many Sphinx themes,
   replacing it with a clean hamburger overlay — this is the modern pattern
   used by documentation sites like Stripe, Tailwind, and Next.js.
3. The thin top bar provides anchoring without stealing reading space.
4. It is visually **distinct** from `quantecon-book-theme` (which has a
   prominent LHS sidebar + full toolbar) while retaining the best UX elements.
5. Layout B (full RHS) can be explored as an **alternative layout option** in
   Phase 2, since the architecture supports swapping layout templates.

> **Decision needed:** Confirm Layout C as the MVP direction, or choose an
> alternative.

---

## 4. Colour & Typography

### 4.1 Colour System

The theme will use **CSS custom properties** throughout, making it fully
re-themeable. The default palette should be neutral and professional.

```css
/* Light mode defaults */
:root {
  --st-color-primary:     #2563eb;  /* Blue — links, active states */
  --st-color-secondary:   #64748b;  /* Slate — muted text */
  --st-color-accent:      #0891b2;  /* Cyan — emphasis, highlights */
  --st-color-bg:          #ffffff;
  --st-color-surface:     #f8fafc;  /* Cards, code blocks */
  --st-color-border:      #e2e8f0;
  --st-color-text:        #1e293b;
  --st-color-text-muted:  #64748b;
  --st-color-em:          #0d9488;  /* Teal — <em> tags */
  --st-color-strong:      #d97706;  /* Amber — <strong> tags */
  --st-color-code-bg:     #f1f5f9;
}

/* Dark mode */
[data-theme="dark"] {
  --st-color-primary:     #60a5fa;
  --st-color-bg:          #0f172a;
  --st-color-surface:     #1e293b;
  --st-color-border:      #334155;
  --st-color-text:        #e2e8f0;
  --st-color-text-muted:  #94a3b8;
  --st-color-em:          #2dd4bf;
  --st-color-strong:      #fbbf24;
  --st-color-code-bg:     #1e293b;
}
```

**CSS variable prefix:** `--st-` (for "sphinx theme") — short, unlikely to
collide, easy to type.

### 4.2 Colour Schemes for Emphasis

Following the quantecon-book-theme pattern, provide named colour schemes:

| Scheme | `<em>` colour | `<strong>` colour | Description |
|--------|--------------|-------------------|-------------|
| `default` | Teal | Amber | Clean, warm, modern |
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

## 7. Open Questions

1. **Naming:** `quantecon-sphinx-theme` keeps the QuantEcon name in a
   "general-purpose" package. Should we consider a fully neutral name
   (e.g. `lecture-sphinx-theme`, `scholar-theme`, `clarity-theme`) to signal
   that it's not QuantEcon-specific?

2. **Layout direction:** Is Layout C (Hybrid) the right starting point, or
   should we commit to Layout B (full RHS) for maximum differentiation?

3. **pydata-sphinx-theme vs from scratch:** Inheriting from pydata gives us a
   lot for free (Bootstrap grid, accessibility, search) but also constrains our
   markup and CSS. Should we consider a from-scratch approach for full control?

4. **Font loading:** Google Fonts CDN is convenient but raises privacy/GDPR
   concerns. Should we bundle fonts in the package instead (or offer both)?

5. **MathJax macros:** The quantecon-book-theme ships macros like `\RR`, `\EE`,
   `\PP`. These are useful in economics but might confuse physicists (`\PP` for
   momentum?). Should the macro set be configurable or minimal?

6. **Minimum Python version:** quantecon-book-theme requires Python ≥ 3.12.
   Should this theme support 3.10+ for wider compatibility?

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
║  ≡  Lecture Title                      ☀  🔍   GitHub   ║  ← 40px top bar
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
║  © 2026 · Built with quantecon-sphinx-theme              ║
╚═══════════════════════════════════════════════════════════╝
```

### Dark Mode
```
╔═══════════════════════════════════════════════════════════╗
║  ≡  Lecture Title                      🌙  🔍   GitHub   ║
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
║  © 2026                                                   ║
╚═══════════════════════════════════════════════════════════╝
```

(Dark mode: navy/charcoal bg, muted text, blue links, teal emphasis, amber strong)

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
