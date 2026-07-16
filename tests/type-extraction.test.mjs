import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { extractTypes } from '../scripts/extract_sdk_types.mjs';

function fixture({ method = 'sample', returnType = 'Promise<void>', declarations = '', overload = false, annotated = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'evo-type-test-'));
  const packageRoot = path.join(root, 'node_modules/@dashevo/evo-sdk');
  const wasmRoot = path.join(root, 'node_modules/@dashevo/wasm-sdk');
  fs.mkdirSync(path.join(packageRoot, 'dist/example'), { recursive: true });
  fs.mkdirSync(path.join(wasmRoot, 'dist/raw'), { recursive: true });
  fs.writeFileSync(path.join(packageRoot, 'package.json'), JSON.stringify({ name: '@dashevo/evo-sdk', version: '4.0.0' }));
  fs.writeFileSync(path.join(wasmRoot, 'package.json'), JSON.stringify({ name: '@dashevo/wasm-sdk', version: '4.0.0' }));
  const signature = annotated ? `${method}(): ${returnType};` : `${method}();`;
  fs.writeFileSync(path.join(packageRoot, 'dist/example/facade.d.ts'), `export declare class ExampleFacade { ${signature} ${overload ? signature : ''} }`);
  fs.writeFileSync(path.join(wasmRoot, 'dist/raw/wasm_sdk.d.ts'), declarations);
  const apiFile = path.join(root, 'api.json');
  fs.writeFileSync(apiFile, JSON.stringify({ queries: { example: { queries: { operation: { sdk_method: `example.${method}` } } } }, transitions: {} }));
  return { root, packageRoot, apiFile };
}

test('preserves exact primitive, union, array, nested generic, inline object, and qualified types', () => {
  const returnType = 'Promise<Map<string, wasm.ResultType | undefined> | Array<{ count: bigint; values: string[] }>>';
  const fx = fixture({ returnType, declarations: 'export interface ResultType { value: bigint; }' });
  const extracted = extractTypes(fx);
  assert.equal(
    extracted.methods['example.sample'].returnType,
    'Promise<Map<string, wasm.ResultType | undefined> | Array<{ count: bigint; values: string[]; }>>',
  );
  assert.deepEqual(extracted.methods['example.sample'].references, ['wasm.ResultType']);
  assert.match(extracted.types.ResultType.declaration, /interface ResultType/);
});

test('preserves Promise<void>', () => {
  const fx = fixture();
  assert.equal(extractTypes(fx).methods['example.sample'].returnType, 'Promise<void>');
});

test('fails for an unknown method', () => {
  const fx = fixture({ method: 'present' });
  const api = JSON.parse(fs.readFileSync(fx.apiFile));
  api.queries.example.queries.operation.sdk_method = 'example.missing';
  fs.writeFileSync(fx.apiFile, JSON.stringify(api));
  assert.throws(() => extractTypes(fx), /resolved to 0 declarations/);
});

test('fails for an absent return annotation', () => {
  const fx = fixture({ annotated: false });
  assert.throws(() => extractTypes(fx), /has no return annotation/);
});

test('fails for overload ambiguity', () => {
  const fx = fixture({ overload: true });
  assert.throws(() => extractTypes(fx), /resolved to 2 declarations/);
});

test('fails when a referenced type declaration is missing', () => {
  const fx = fixture({ returnType: 'Promise<wasm.MissingType>' });
  assert.throws(() => extractTypes(fx), /has no declaration/);
});
