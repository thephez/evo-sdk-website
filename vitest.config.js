import { defineConfig } from 'vitest/config';

// Unit tests live under tests/unit/ and are separate from the Playwright E2E
// suite (tests/e2e/**, tests/site.spec.ts), which Playwright matches via its
// own testMatch globs. The two runners never see each other's files.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js'],
    // Plain 'node' environment (not jsdom). Only modules that import cleanly in
    // Node — no DOM access and no WASM SDK load at import time — are unit-tested
    // here: public/src/result-format.js and public/src/contracts.js.
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage/unit',
      // Scope coverage to the modules that actually have unit tests, so the
      // headline number reflects what's exercised rather than being diluted by
      // the many modules that are only reachable through E2E. Add each module
      // here as it gains unit tests.
      include: [
        'public/src/result-format.js',
        'public/src/contracts.js',
      ],
    },
  },
});
