# Configuration

## All Theme Options

| Option | Default | Description |
|--------|---------|-------------|
| `color_scheme` | `"default"` | Colour scheme: `"default"`, `"academic"`, `"minimal"` |
| `dark_mode` | `"auto"` | Dark mode: `"auto"`, `"light"`, `"dark"`, `"toggle"` |
| `dark_logo` | `""` | Path to logo for dark mode |
| `google_fonts` | `True` | Load fonts from Google Fonts CDN |
| `content_max_width` | `"48rem"` | Maximum width of main content area |
| `toc_sticky` | `True` | Enable sticky RHS ToC |
| `toc_autoexpand` | `True` | Auto-expand/collapse ToC subsections on scroll |
| `toc_collapsible` | `True` | Allow ToC to be collapsed entirely |
| `show_page_toc_title` | `True` | Show "On this page" heading above ToC |
| `code_style` | `"theme"` | Code highlighting: `"theme"` or `"pygments"` |
| `mathjax_macros` | `True` | Include common scientific math macros |
| `show_nav_level` | `1` | Depth of toctree shown in sidebar navigation |
| `persistent_sidebar` | `False` | Remember sidebar open/close state |
| `show_last_modified` | `False` | Show git last-modified date |
| `repository_url` | `""` | GitHub repository URL |
| `repository_branch` | `"main"` | Repository branch |
| `path_to_docs` | `""` | Subdirectory of docs within the repo |
| `use_repository_button` | `False` | Show GitHub link button |
| `use_edit_page_button` | `False` | Show edit page button |
| `use_issues_button` | `False` | Show issues button |
| `extra_footer` | `""` | Custom HTML footer content |

## CSS Custom Properties

Override any of the `--st-*` CSS custom properties in your own CSS:

```css
:root {
  --st-color-primary: #059669;
  --st-font-body: 'Lora', serif;
  --st-content-max-width: 52rem;
}
```

See [PLAN.md](https://github.com/QuantEcon/quantecon-sphinx-theme/blob/main/PLAN.md#appendix-b-css-custom-property-reference) for the full list.
