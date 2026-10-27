import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import data from './law-quotes.json' with { type: 'json' };
import { lawQuote } from './law-quotes.js';

const sha = value => createHash('sha256').update(value, 'utf8').digest('hex');

test('every verbatim extract still matches a hash taken on the official page', () => {
  for (const [id, source] of Object.entries(data.sources)) {
    assert.match(source.url, /^https:\/\//, id);
    assert.match(source.retrieved, /^\d{4}-\d{2}-\d{2}$/, id);
    // Extracts were captured as separate JSON objects; each subdivision belongs to exactly one.
    const keys = Object.keys(source.subdivisions);
    const matched = source.extractSha256.every(hash => {
      for (let size = 1; size <= keys.length; size++) {
        for (let start = 0; start + size <= keys.length; start++) {
          const part = Object.fromEntries(keys.slice(start, start + size).map(key => [key, source.subdivisions[key]]));
          if (sha(JSON.stringify(part)) === hash) return true;
        }
      }
      return false;
    });
    assert.ok(matched, `${id} text no longer matches its recorded extract hash`);
  }
});

test('a cited paragraph returns its own lines and the lead-in of its parents', () => {
  const clause = lawQuote('ccpa-1798-140', '(ad)(2)(A)');
  assert.deepEqual(clause.lines.map(line => line.text.slice(0, 4)), ['(2) ', '(A) ', '(i) ', '(ii)']);
  const later = lawQuote('ccpa-1798-135', '(c)(4)');
  assert.equal(later.lines[0].text, '(c) A business that is subject to this section shall:');
  assert.equal(later.lines[1].gap, true);
  assert.ok(later.lines[1].text.startsWith('(4) For consumers who exercise'));
  const whole = lawQuote('ccpa-1798-140', '(ag)');
  assert.equal(whole.lines.length, data.sources['ccpa-1798-140'].subdivisions['(ag)'].length);
  assert.equal(lawQuote('ccpa-1798-140', '(ag)(1)').lines.at(-1).text.startsWith('(D) '), true);
});

test('roman-numeral clauses are not mistaken for subdivisions', () => {
  const contractor = lawQuote('ccpa-1798-140', '(j)(1)');
  assert.ok(contractor.lines.some(line => line.text.startsWith('(iv) ')));
  assert.ok(!contractor.lines.some(line => line.text.startsWith('(2) ')));
});

test('a paragraph without verified text is not offered as a quote', () => {
  assert.equal(lawQuote('ccpa-1798-140', '(zz)'), null);
  assert.equal(lawQuote('gdpr-art-6', '1.'), null);
  assert.equal(lawQuote('ccpa-1798-140', undefined), null);
});
