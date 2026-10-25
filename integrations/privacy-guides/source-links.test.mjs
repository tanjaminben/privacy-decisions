import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES } from './presentation-registry.js';
import { sourceLinks, primarySourceUrl } from './source-links.js';
import { mentionCard } from './editorial-mentions.js';

const affected = {
  'uk-dpa-2018-s10-sch1': 3,
  'uk-dpa-2018-s9': 2,
  'uk-duaa-2025-sar': 2,
  'uk-duaa-2025': 2,
  'uk-pecr-reg-6': 2,
};

test('five combined provenance records become separate original-source URLs', () => {
  for (const [id, count] of Object.entries(affected)) {
    const source = SOURCES[id], original = JSON.stringify(source);
    const links = sourceLinks(id, source);
    assert.equal(links.length, count, id);
    assert.equal(new Set(links.map(link => link.url)).size, count, id);
    for (const link of links) {
      assert.ok(source.provenance.includes(link.url), id + ' must retain the original source destination');
      assert.equal(new URL(link.url).hostname, 'www.legislation.gov.uk');
      assert.ok(!/[\s;]/.test(link.url));
    }
    assert.equal(mentionCard(id).provenance, links[0].url, id + ' inline citation');
    assert.equal(primarySourceUrl(id, source), links[0].url);
    assert.equal(JSON.stringify(source), original, id + ' raw evidence remains unchanged');
  }
});

test('all source records expose only individual HTTPS URLs without credentials', () => {
  for (const [id, source] of Object.entries(SOURCES)) {
    const links = sourceLinks(id, source);
    assert.ok(links.length, id);
    for (const { url } of links) {
      const parsed = new URL(url);
      assert.equal(parsed.protocol, 'https:');
      assert.equal(parsed.username + parsed.password, '');
      assert.ok(!/\s/.test(url));
      assert.equal((url.match(/https:\/\//g) || []).length, 1);
    }
  }
});

test('unreviewed combined, credential-bearing and non-HTTPS destinations do not become links', () => {
  for (const provenance of ['javascript:alert(1)', 'http://example.com', 'https://example.com ; https://example.org', 'https://user:password@example.com', 'https://example.com\nother']) {
    assert.deepEqual(sourceLinks('unreviewed', { provenance }), []);
  }
});
