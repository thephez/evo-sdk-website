import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const docs = fs.readFileSync(new URL('../../public/docs.html', import.meta.url), 'utf8');
const aiReference = fs.readFileSync(new URL('../../public/AI_REFERENCE.md', import.meta.url), 'utf8');
const typeReference = fs.readFileSync(new URL('../../public/TYPE_REFERENCE.md', import.meta.url), 'utf8');
const typeReferenceHtml = fs.readFileSync(new URL('../../public/TYPE_REFERENCE.html', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../../public/docs_manifest.json', import.meta.url), 'utf8'));

describe('generated return type documentation', () => {
  it('documents all 94 existing operations without adding calls', () => {
    expect(docs.match(/<div class="returns">/g)).toHaveLength(94);
    expect(aiReference.match(/\nReturns:\n/g)).toHaveLength(94);
    expect(manifest.documented_operations).toBe(94);
    expect(manifest.resolved_sdk_methods).toBe(93);
  });

  it('renders representative query and transition return types', () => {
    expect(aiReference).toContain('- `Promise<Map<string, bigint | undefined>>`');
    expect(aiReference).toContain('- `Promise<wasm.TokenMintResult>`');
    expect(docs).toContain('Promise&lt;wasm.Identity | undefined&gt;');
    expect(docs).toContain('Promise&lt;void&gt;');
  });

  it('links named return types to generated declarations', () => {
    expect(aiReference).toContain('  - Type declarations: [`wasm.Identity`](TYPE_REFERENCE.md#type-identity)');
    expect(typeReference).toContain('<a id="type-identity"></a>');
    expect(typeReference).toContain('export class Identity');
    expect(docs).toContain('TYPE_REFERENCE.html#type-identity');
    expect(docs).not.toContain('TYPE_REFERENCE.md#type-identity');
    expect(typeReferenceHtml).toContain('id="type-identity"');
    expect(typeReferenceHtml).toContain('export class Identity');
  });

  it('records the declaration source version', () => {
    expect(manifest.sdk_types).toMatchObject({ name: '@dashevo/evo-sdk', version: '4.0.0', declarationRoot: 'dist' });
    expect(aiReference).toContain('`@dashevo/evo-sdk@4.0.0`');
  });
});
