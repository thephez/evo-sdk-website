#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_FILE), '..');
const BUILT_INS = new Set(['Promise', 'Map', 'Set', 'Array', 'ReadonlyArray', 'Record', 'Partial', 'Required']);
const NAMESPACE_DIRS = { stateTransitions: 'state-transitions' };

function fail(message) {
  throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function documentedMethods(api) {
  const result = [];
  for (const groupName of ['queries', 'transitions']) {
    for (const [categoryName, category] of Object.entries(api[groupName] || {})) {
      for (const [key, item] of Object.entries(category[groupName] || {})) {
        if (!item.sdk_method) fail(`${groupName}.${key} has no sdk_method`);
        result.push({ key, group: groupName, category: categoryName, sdkMethod: item.sdk_method });
      }
    }
  }
  return result;
}

function parseFile(file) {
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.d.ts') ? ts.ScriptKind.TS : ts.ScriptKind.TS);
}

function methodDeclarations(source, methodName) {
  const matches = [];
  function visit(node) {
    if ((ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) && node.name?.getText(source) === methodName) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return matches;
}

function normalizeType(text) {
  const source = ts.createSourceFile('type.ts', `type X = ${text};`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const alias = source.statements.find(ts.isTypeAliasDeclaration);
  if (!alias) fail(`Unable to parse return type: ${text}`);
  return ts.createPrinter({ removeComments: true }).printNode(ts.EmitHint.Unspecified, alias.type, source).replace(/\s+/g, ' ').trim();
}

function referencedNames(typeNode, source) {
  const names = new Set();
  function visit(node) {
    if (ts.isTypeReferenceNode(node)) {
      const text = node.typeName.getText(source);
      if (!BUILT_INS.has(text)) names.add(text);
    }
    ts.forEachChild(node, visit);
  }
  visit(typeNode);
  return [...names].sort();
}

function collectDeclarationIndex(files) {
  const index = new Map();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const source = parseFile(file);
    for (const statement of source.statements) {
      if (statement.name && (ts.isClassDeclaration(statement) || ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement) || ts.isEnumDeclaration(statement))) {
        const name = statement.name.text;
        if (!index.has(name)) index.set(name, { file, source, node: statement });
      }
    }
  }
  return index;
}

function walkDts(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDts(target));
    else if (entry.name.endsWith('.d.ts')) files.push(target);
  }
  return files;
}

export function extractTypes({ apiFile, packageRoot }) {
  const api = readJson(apiFile);
  const packageJson = readJson(path.join(packageRoot, 'package.json'));
  const dist = path.join(packageRoot, 'dist');
  const wasmRoot = path.dirname(fs.realpathSync(path.join(packageRoot, '..', 'wasm-sdk', 'package.json')));
  const declarationIndex = collectDeclarationIndex([...walkDts(dist), ...walkDts(path.join(wasmRoot, 'dist'))]);
  const methods = {};
  const operations = [];
  const usedTypes = new Set();

  for (const entry of documentedMethods(api)) {
    const [namespace, methodName, ...extra] = entry.sdkMethod.split('.');
    if (!namespace || !methodName || extra.length) fail(`Invalid sdk_method: ${entry.sdkMethod}`);
    const facadeFile = path.join(dist, NAMESPACE_DIRS[namespace] || namespace, 'facade.d.ts');
    if (!fs.existsSync(facadeFile)) fail(`No facade declaration for ${entry.sdkMethod}: ${facadeFile}`);
    const source = parseFile(facadeFile);
    const declarations = methodDeclarations(source, methodName);
    if (declarations.length !== 1) fail(`${entry.sdkMethod} resolved to ${declarations.length} declarations in ${facadeFile}`);
    const declaration = declarations[0];
    if (!declaration.type) fail(`${entry.sdkMethod} has no return annotation`);
    const returnType = normalizeType(declaration.type.getText(source));
    const references = referencedNames(declaration.type, source);
    references.forEach((name) => usedTypes.add(name.replace(/^wasm\./, '')));
    methods[entry.sdkMethod] = { returnType, references };
    operations.push({ ...entry, returnType, references });
  }

  const types = {};
  for (const name of [...usedTypes].sort()) {
    const found = declarationIndex.get(name);
    if (!found) fail(`Referenced return type ${name} has no declaration`);
    types[name] = {
      kind: ts.SyntaxKind[found.node.kind],
      declaration: found.node.getText(found.source),
      source: path.relative(path.dirname(packageRoot), found.file),
    };
  }
  return { sdk: { name: packageJson.name, version: packageJson.version, declarationRoot: 'dist' }, operations, methods, types };
}

function parseArgs(argv) {
  const result = { apiFile: path.join(ROOT, 'public/api-definitions.json'), packageRoot: path.join(ROOT, 'node_modules/@dashevo/evo-sdk') };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--api') result.apiFile = path.resolve(argv[++i]);
    else if (argv[i] === '--package-root') result.packageRoot = path.resolve(argv[++i]);
    else fail(`Unknown argument: ${argv[i]}`);
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_FILE) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const extracted = extractTypes(options);
    process.stdout.write(`${JSON.stringify(extracted, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
