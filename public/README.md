Evo SDK Website / Docs
======================

This folder contains a lightweight documentation generator for the Evo JS SDK, adapted from the wasm-sdk website.

Usage
- Generate docs and AI reference:
  - cd packages/js-evo-sdk/website
  - python3 generate_docs.py

- Serve the site locally (for manual testing):
  - python3 -m http.server 8081
  - Open http://localhost:8081/index.html

Outputs
- docs.html — human-friendly docs with EvoSDK examples
- AI_REFERENCE.md — compact list of queries and transitions
- docs_manifest.json — manifest used for CI checks

Notes
- The generator reads `api-definitions.json` from this folder only (no fallbacks).
- A minimal Evo `index.html` is provided. It loads `api-definitions.json`, lets you pick a query/transition, and executes Evo SDK facade methods. Proof toggling is supported when available for queries.

Playwright (optional)
- A Playwright scaffold is included to keep website e2e capability:
  - Requires Playwright installed in your environment (`npx playwright install`)
  - Build Evo SDK first: `yarn workspace @dashevo/evo-sdk build`
  - Run: `npx playwright test packages/js-evo-sdk/website`
  - Set `EVO_WEBSITE_E2E=1` to enable a simple network-backed test that runs `getStatus` on testnet.
