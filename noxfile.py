"""Nox sessions for quantecon-sphinx-theme."""

import nox

nox.options.sessions = ["docs"]
nox.options.reuse_existing_virtualenvs = True

SPHINX_VERSIONS = ["7.4", "8.0"]


# ---------------------------------------------------------------------------
# Documentation
# ---------------------------------------------------------------------------


@nox.session
def docs(session: nox.Session) -> None:
    """Build the documentation site."""
    session.install("-e", ".[doc]")
    session.run("npm", "run", "build", external=True)
    session.run(
        "sphinx-build",
        "-b",
        "html",
        "docs",
        "docs/_build/html",
        *session.posargs,
    )


@nox.session(name="docs-live")
def docs_live(session: nox.Session) -> None:
    """Live-reload docs with sphinx-theme-builder.

    Uses `stb serve` which handles the Node build, Sphinx compilation,
    and browser live-reload in a single command.
    """
    session.install("-e", ".[dev]")
    session.run("stb", "serve", "docs/", *session.posargs)


# ---------------------------------------------------------------------------
# Multi-version Sphinx compatibility matrix
# ---------------------------------------------------------------------------


@nox.session(python=["3.12", "3.13"])
@nox.parametrize("sphinx", SPHINX_VERSIONS)
def tests(session: nox.Session, sphinx: str) -> None:
    """Build docs against multiple Sphinx versions to check compatibility."""
    session.install(f"sphinx~={sphinx}.0")
    session.install("-e", ".[doc]")
    session.run("npm", "run", "build", external=True)
    session.run(
        "sphinx-build",
        "-b",
        "html",
        "-W",  # treat warnings as errors
        "docs",
        f"docs/_build/html-sphinx{sphinx}",
    )
