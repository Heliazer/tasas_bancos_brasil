# Repository Guidelines

## Project Structure & Module Organization
- Root: metadata and docs.
- `data/`: versioned JSON datasets used by this project.
  - Example: `data/bancos.json`, `data/sample.json`.
- Add new datasets under `data/` using clear, lowercase names with hyphens (e.g., `data/tasas-2025.json`).

## Build, Test, and Development Commands
This repository is data‑first; there is no build. Use these utilities locally:
- Validate JSON: `jq -e . data/bancos.json`
- Pretty‑print: `jq . data/sample.json > data/sample.pretty.json`
- Basic keys check (example): `jq -r 'keys_unsorted[]' data/bancos.json`
- Detect duplicate lines (if line‑delimited): `sort data/file.json | uniq -d`

## Coding Style & Naming Conventions
- File names: lowercase, hyphen‑separated, `.json` extension.
- Encoding: UTF‑8, Unix newlines (`\n`).
- JSON style: two‑space indentation, stable key ordering where practical.
- If adding scripts, place them under `scripts/`, prefer small, single‑purpose CLIs with clear `--help`.

## Testing Guidelines
- Minimum: all JSON must parse (`jq -e . <file>` returns 0).
- Optional sanity checks: validate required top‑level fields with `jq` filters before submitting.
- Test files: if you add fixtures, keep them small and put under `data/fixtures/` with a `-fixture` suffix.

## Commit & Pull Request Guidelines
- Commits: write imperative, concise messages.
  - Examples:
    - `feat(data): add bancos dataset for 2024-09`
    - `fix(data): correct malformed entry in sample`
    - `chore: pretty-format bancos.json`
- PRs must include:
  - Purpose summary and scope of changes.
  - Sample command/output proving JSON validity (e.g., `jq -e .` results).
  - Notes on data provenance and any transformations applied.

## Data Quality & Security
- Provenance: cite source and retrieval date in the PR description (and, if possible, a top‑level JSON field like `"source"` and `"last_updated"`).
- PII: do not commit personal or sensitive data.
- Consistency: prefer consistent units, field names, and locales; document any deviations in the PR.

## Maintenance Tips
- Keep large diffs readable by formatting JSON before commit: `jq . file.json > tmp && mv tmp file.json`.
- For periodic updates, prefer additive changes and avoid unnecessary reordering to simplify reviews.

