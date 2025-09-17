# Evo SDK Website / Docs

This repository hosts the static documentation website and generators for the Evo JS SDK, adapted from the wasm-sdk site.

## Usage
- Generate docs and AI reference:
  - `yarn docs:generate` (or `python3 scripts/generate_docs.py`)
  - Regeneration also refreshes `public/dist` with the latest Evo SDK bundle built in `platform/packages/js-evo-sdk/dist`.
- Check documentation status: `yarn docs:check` (or `python3 scripts/check_docs.py`)

## Serve Locally
```
yarn website:serve
open http://localhost:8081/index.html
```


## Outputs
- `public/docs.html` — human-friendly docs with EvoSDK examples
- `public/AI_REFERENCE.md` — compact list of queries and transitions
- `public/docs_manifest.json` — manifest used for CI checks

## Notes
- The generator reads `public/api-definitions.json` (no fallbacks).
- The Evo SDK module is expected at `public/dist`; build the SDK workspace with `yarn workspace @dashevo/evo-sdk build` before regenerating docs to copy it over.
