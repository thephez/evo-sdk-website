import { describe, it, expect } from 'vitest';
import {
  normalizeContract,
  normalizeDocument,
  buildContractDefinition,
  buildContractUpdates,
} from '../../public/src/contracts.js';

// Characterization tests: pin the CURRENT behavior of the pure contract/document
// helpers. They document today's behavior (quirks included), not an ideal spec,
// so refactors that change behavior fail loudly.

describe('normalizeContract', () => {
  it('returns null for falsy input', () => {
    expect(normalizeContract(null)).toBeNull();
    expect(normalizeContract(undefined)).toBeNull();
    expect(normalizeContract('')).toBeNull();
  });

  it('calls toJSON() when present', () => {
    const c = { toJSON: () => ({ documentSchemas: { note: {} } }) };
    expect(normalizeContract(c)).toEqual({ documentSchemas: { note: {} } });
  });

  it('falls back to toObject() when toJSON is absent', () => {
    const c = { toObject: () => ({ documentSchemas: { note: {} } }) };
    expect(normalizeContract(c)).toEqual({ documentSchemas: { note: {} } });
  });

  it('parses a JSON string', () => {
    expect(normalizeContract('{"documentSchemas":{"x":{}}}')).toEqual({ documentSchemas: { x: {} } });
  });

  it('returns null when a string is not valid JSON', () => {
    expect(normalizeContract('not json')).toBeNull();
  });

  it('unwraps .definition when the top level has no documentSchemas but definition does', () => {
    const c = { definition: { documentSchemas: { y: {} } } };
    expect(normalizeContract(c)).toEqual({ documentSchemas: { y: {} } });
  });

  it('returns the object as-is when it already has documentSchemas', () => {
    const c = { documentSchemas: { z: {} }, extra: 1 };
    expect(normalizeContract(c)).toEqual({ documentSchemas: { z: {} }, extra: 1 });
  });

  it('returns the object unchanged when neither documentSchemas nor definition is present', () => {
    const c = { foo: 'bar' };
    expect(normalizeContract(c)).toEqual({ foo: 'bar' });
  });
});

describe('normalizeDocument', () => {
  it('returns null for falsy input', () => {
    expect(normalizeDocument(null)).toBeNull();
    expect(normalizeDocument(undefined)).toBeNull();
  });

  it('reads the revision getter from the original object (before serialization)', () => {
    // revision getter returns a bigint; toJSON loses it; original wins.
    const doc = {
      revision: 3n,
      toJSON: () => ({ data: { a: 1 }, revision: 99 }),
    };
    expect(normalizeDocument(doc)).toEqual({ data: { a: 1 }, revision: 3 });
  });

  it('falls back to serialized revision when the original has no revision getter', () => {
    const doc = { toJSON: () => ({ data: { a: 1 }, revision: 7 }) };
    expect(normalizeDocument(doc)).toEqual({ data: { a: 1 }, revision: 7 });
  });

  it('uses $revision as a fallback when revision is absent', () => {
    const doc = { toJSON: () => ({ data: { a: 1 }, $revision: 4 }) };
    expect(normalizeDocument(doc)).toEqual({ data: { a: 1 }, revision: 4 });
  });

  it('returns revision null when none is available', () => {
    const doc = { toJSON: () => ({ data: { a: 1 } }) };
    expect(normalizeDocument(doc)).toEqual({ data: { a: 1 }, revision: null });
  });

  it('uses value.value as data when value.data is absent', () => {
    const doc = { toJSON: () => ({ value: { b: 2 } }) };
    expect(normalizeDocument(doc)).toEqual({ data: { b: 2 }, revision: null });
  });

  it('defaults data to {} when neither data nor value is present', () => {
    const doc = { toJSON: () => ({ revision: 1 }) };
    expect(normalizeDocument(doc)).toEqual({ data: {}, revision: 1 });
  });

  it('unwraps result.document', () => {
    const doc = { toJSON: () => ({ result: { document: { data: { c: 3 }, revision: 2 } } }) };
    expect(normalizeDocument(doc)).toEqual({ data: { c: 3 }, revision: 2 });
  });

  it('unwraps a nested document property', () => {
    const doc = { toJSON: () => ({ document: { data: { d: 4 }, revision: 5 } }) };
    expect(normalizeDocument(doc)).toEqual({ data: { d: 4 }, revision: 5 });
  });

  it('parses a JSON string document', () => {
    expect(normalizeDocument('{"data":{"e":5},"revision":6}')).toEqual({ data: { e: 5 }, revision: 6 });
  });

  it('returns null for an unparseable string', () => {
    expect(normalizeDocument('nope')).toBeNull();
  });

  it('coerces a non-numeric revision to null (NaN guard)', () => {
    const doc = { toJSON: () => ({ data: {}, revision: 'abc' }) };
    expect(normalizeDocument(doc)).toEqual({ data: {}, revision: null });
  });
});

describe('buildContractDefinition', () => {
  it('throws when documentSchemas is missing', () => {
    expect(() => buildContractDefinition({})).toThrow('Document Schemas JSON is required');
  });

  it('throws a descriptive error for invalid documentSchemas JSON', () => {
    expect(() => buildContractDefinition({ documentSchemas: '{bad' }))
      .toThrow(/Invalid JSON in Document Schemas field/);
  });

  it('builds the complete default contract object from minimal params', () => {
    // Full-object comparison so a regression that drops or changes ANY default
    // field ($format_version, placeholder id, schemaDefs, the timestamp nulls,
    // sizedIntegerTypes, bounded-key defaults, etc.) fails this test.
    const out = JSON.parse(buildContractDefinition({
      documentSchemas: '{"note":{"type":"object"}}',
      ownerId: 'OWNER',
    }));
    expect(out).toEqual({
      $format_version: '1',
      id: '11111111111111111111111111111111',
      config: {
        $format_version: '1',
        canBeDeleted: false,
        readonly: false,
        keepsHistory: false,
        documentsKeepHistoryContractDefault: false,
        documentsMutableContractDefault: true,
        documentsCanBeDeletedContractDefault: true,
        requiresIdentityEncryptionBoundedKey: null,
        requiresIdentityDecryptionBoundedKey: null,
        sizedIntegerTypes: true,
      },
      version: 1,
      ownerId: 'OWNER',
      schemaDefs: null,
      documentSchemas: { note: { type: 'object' } },
      createdAt: null,
      updatedAt: null,
      createdAtBlockHeight: null,
      updatedAtBlockHeight: null,
      createdAtEpoch: null,
      updatedAtEpoch: null,
      groups: {},
      tokens: {},
      keywords: [],
      description: null,
    });
  });

  it('accepts already-parsed object schemas', () => {
    const out = JSON.parse(buildContractDefinition({
      documentSchemas: { note: {} },
      ownerId: 'O',
    }));
    expect(out.documentSchemas).toEqual({ note: {} });
  });

  it('splits, trims, and filters keywords from a comma-separated string', () => {
    const out = JSON.parse(buildContractDefinition({
      documentSchemas: { x: {} },
      ownerId: 'O',
      keywords: ' alpha , beta ,, gamma ',
    }));
    expect(out.keywords).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('honors mutable/deletable opt-out (false overrides the true default)', () => {
    const out = JSON.parse(buildContractDefinition({
      documentSchemas: { x: {} },
      ownerId: 'O',
      documentsMutableContractDefault: false,
      documentsCanBeDeletedContractDefault: false,
    }));
    expect(out.config.documentsMutableContractDefault).toBe(false);
    expect(out.config.documentsCanBeDeletedContractDefault).toBe(false);
  });
});

describe('buildContractUpdates', () => {
  it('increments the version of the existing contract', () => {
    const out = JSON.parse(buildContractUpdates({
      existingContract: { version: 2, documentSchemas: { a: {} } },
    }));
    expect(out.version).toBe(3);
  });

  it('defaults version to 1 then increments to 2 when version is absent', () => {
    const out = JSON.parse(buildContractUpdates({
      existingContract: { documentSchemas: {} },
    }));
    expect(out.version).toBe(2);
  });

  it('merges new document schemas over existing (new overrides)', () => {
    const out = JSON.parse(buildContractUpdates({
      existingContract: { version: 1, documentSchemas: { a: { v: 1 }, b: {} } },
      newDocumentSchemas: '{"a":{"v":2},"c":{}}',
    }));
    expect(out.documentSchemas).toEqual({ a: { v: 2 }, b: {}, c: {} });
  });

  it('merges new groups and tokens over existing', () => {
    const out = JSON.parse(buildContractUpdates({
      existingContract: { version: 1, groups: { g1: 1 }, tokens: { t1: 1 } },
      newGroups: { g2: 2 },
      newTokens: { t2: 2 },
    }));
    expect(out.groups).toEqual({ g1: 1, g2: 2 });
    expect(out.tokens).toEqual({ t1: 1, t2: 2 });
  });

  it('throws a descriptive error for invalid new schemas JSON', () => {
    expect(() => buildContractUpdates({
      existingContract: { version: 1 },
      newDocumentSchemas: '{bad',
    })).toThrow(/Invalid JSON in New Document Schemas field/);
  });
});
