import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES as originals } from '../../packages/privacy-guides/src/lib/data/registry.generated.js';
import { SOURCES } from './presentation-registry.js';

test('source display preserves evidence and outbound destinations', () => {
  for (const [id, source] of Object.entries(SOURCES)) {
    const { label, note, ...evidence } = source;
    const { label: originalLabel, note: originalNote, ...originalEvidence } = originals[id];
    assert.deepEqual(evidence, originalEvidence, id);
    const urls = text => [...(text || '').matchAll(/https?:\/\/[^\s)<>]+/g)].map(match => match[0]);
    assert.deepEqual(urls(note), urls(originalNote), id);
    if (/not a verbatim/i.test(originalNote || '')) assert.match(note, /not a verbatim/i, id);
    assert.doesNotMatch(note || '', /verified editorial|candidate checked|checked against|independent[^.]*review|practitioner[^.]*review|native PowerShell|primary text retrieved|checkpoint/i, id);
  }
});

test('Connecticut source qualifications survive removal of review claims', () => {
  const note = SOURCES['pwc-us-ct-scope'].note;
  for (const fragment of ['35,000-consumer', 'October 1, 2026', 'PA26-64', 'PA26-100', 'PA26-130', 'July 1, 2027', 'separate data-broker, genetic-testing, or surveillance-pricing regimes']) {
    assert.ok(note.includes(fragment), fragment);
  }
  assert.match(SOURCES['pwc-us-ut-scope'].note, /January 1, 2027.*supersession date/);
  assert.match(SOURCES['pwc-us-ca-scope'].note, /\$26,625,000.*January 1, 2025/);
  assert.match(SOURCES['pwc-us-ct-duties-rights'].note, /2026 statutory supplement and Public Act 26-64/);
  assert.match(SOURCES['pwc-us-in-scope'].note, /Indiana Code 2026/);
  assert.match(SOURCES['pwc-us-tn-duties-rights'].note, /2025 Tennessee Code Bill.*enacted 2023 chapter/);
});
