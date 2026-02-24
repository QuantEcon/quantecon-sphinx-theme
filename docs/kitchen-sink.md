# Kitchen Sink

This page demonstrates every element the theme styles, useful for visual testing.

## Typography

### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Prose

This is a paragraph with *emphasis text* and **strong text** and `inline code`.
Here is a [link to somewhere](https://quantecon.org).

> This is a blockquote. It can contain *emphasis* and **strong** text.

---

## Lists

### Unordered
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered
1. First step
2. Second step
3. Third step

### Definition List

Term 1
:   Definition of term 1

Term 2
:   Definition of term 2

## Mathematics

Inline math: $E[X] = \int x f(x) dx$

Display math:

$$
\hat{\beta} = (X'X)^{-1}X'y
$$

Using macros:

$$
\EE[X_t | \mathcal{F}_{t-1}] = X_{t-1} \quad \text{a.s.}
$$

## Code

### Python

```python
import numpy as np
import matplotlib.pyplot as plt

def markov_chain(P, x0, T):
    """Simulate a Markov chain."""
    path = np.zeros(T, dtype=int)
    path[0] = x0
    for t in range(1, T):
        path[t] = np.random.choice(len(P), p=P[path[t-1]])
    return path

P = np.array([[0.9, 0.1],
              [0.3, 0.7]])

path = markov_chain(P, 0, 100)
print(f"Terminal state: {path[-1]}")
```

### JavaScript

```javascript
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log(fibonacci(10)); // 55
```

## Admonitions

```{note}
This is a note admonition. It provides additional information.
```

```{tip}
This is a tip. It suggests a best practice or shortcut.
```

```{warning}
This is a warning. Pay attention to this.
```

```{danger}
This is a danger admonition. Something could go seriously wrong.
```

```{important}
This is important information you should not miss.
```

## Tables

| Method | Time Complexity | Space Complexity |
|--------|:--------------:|:---------------:|
| Brute force | $O(n^2)$ | $O(1)$ |
| Dynamic programming | $O(n)$ | $O(n)$ |
| Greedy | $O(n \log n)$ | $O(1)$ |

## Images

```{figure} https://via.placeholder.com/600x300/e2e8f0/1e293b?text=Figure+Placeholder
:alt: Placeholder figure
:width: 100%

This is a figure caption describing the image above.
```

## Footnotes

This sentence has a footnote[^1].

[^1]: This is the footnote content.
