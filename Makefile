.PHONY: help setup build dev docs docs-live test clean

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

setup:  ## Install all dependencies (Node + Python editable)
	npm install
	pip install -e ".[dev]"

build:  ## Compile SCSS/JS assets via webpack
	npm run build

dev:  ## Watch mode — recompile assets on change
	npm run dev

docs:  ## Build docs in an isolated nox session
	nox -s docs

docs-live:  ## Live-reload docs via stb serve
	nox -s docs-live

test:  ## Run Sphinx version compatibility matrix
	nox -s tests

clean:  ## Remove build artefacts
	rm -rf docs/_build
	rm -rf src/quantecon_sphinx_theme/theme/quantecon_sphinx_theme/static/scripts
	rm -rf src/quantecon_sphinx_theme/theme/quantecon_sphinx_theme/static/styles
