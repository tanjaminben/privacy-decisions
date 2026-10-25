import { tokenize, contextFor, mentionCard as originalMentionCard } from '../../packages/privacy-guides/src/lib/engine/mentions.js';
import { primarySourceUrl } from './source-links.js';
export { contextFor };

export function mentionCard(id, paragraph) {
  const card = originalMentionCard(id, paragraph);
  return card ? { ...card, provenance: primarySourceUrl(id, card) } : null;
}

// The source resolver keeps its original conservative rules. Translate expanded
// citation names only for lookup, then restore the exact displayed wording.
const aliases = [
  [/\bData Protection Act 2018 sections?\s+(\d+)/g, (_, n) => `DPA 2018 s. ${n}`],
  [/\bData Protection Act 2018\b/g, 'DPA 2018'],
  [/\bDigital Services Act\b/g, 'DSA'],
  [/\bPrivacy and Electronic Communications Regulations\b/g, 'PECR'],
  [/\bGerman Federal Data Protection Act\b/g, 'BDSG'],
  [/\bChildren[’']s Online Privacy Protection Act\b/g, 'COPPA'],
  [/\bBiometric Information Privacy Act\b/g, 'BIPA'],
  [/\bTitle 16 of the Code of Federal Regulations\b/g, '16 CFR'],
  [/\bTitle 15 of the United States Code\b/g, '15 U.S.C.'],
  [/\bTitle 23 of the New York regulations\b/g, '23 NYCRR'],
  [/\bCalifornia Civil Code\b/g, 'Cal. Civ. Code'],
  [/\bNew York General Business Law\b/g, 'NY GBL'],
  [/\bIllinois Personal Information Protection Act\b/g, 'IL PIPA'],
  [/\bTitle 11 of the California Code of Regulations\b/g, '11 CCR'],
  [/\bArticles\s+(\d+)/g, (_, n) => `Arts. ${n}`],
  [/\bregulation\s+(\d+)/g, (_, n) => `reg. ${n}`]
];

function lookupText(value, context) {
  let text = value;
  let offsets = Array.from({ length: text.length + 1 }, (_, i) => i);
  function replace(pattern, replacement) {
    let cursor = 0, next = '', map = [offsets[0]];
    for (const match of text.matchAll(pattern)) {
      const end = match.index + match[0].length;
      next += text.slice(cursor, match.index);
      map.push(...offsets.slice(cursor + 1, match.index + 1));
      const alias = typeof replacement === 'function' ? replacement(...match) : replacement;
      next += alias;
      for (let i = 1; i <= alias.length; i++) {
        map.push(offsets[match.index + Math.floor(i * match[0].length / alias.length)]);
      }
      cursor = end;
    }
    next += text.slice(cursor);
    map.push(...offsets.slice(cursor + 1));
    text = next;
    offsets = map;
  }
  for (const [pattern, replacement] of aliases) replace(pattern, replacement);
  const ukSections = /DPA 2018/.test(text);
  replace(/\bsections?\s+(\d+(?:\.\d+)?(?:-[a-z]+)?)/gi, (whole, n) => {
    if (ukSections && /^(9|10|11|14|123|157)$/.test(n)) return `s. ${n}`;
    if (context.cites?.has(`il-bipa-${n}`) || (n === '10' && context.cites?.has('il-pipa-10'))) return `Sec. ${n}`;
    return `${whole.toLowerCase().startsWith('sections') ? '§§' : '§'} ${n}`;
  });
  return { text, offsets };
}

function displayTokens(value, context, scope) {
  const lookup = lookupText(value, context);
  let cursor = 0;
  return tokenize(lookup.text, context, scope).map(token => {
    const start = cursor;
    cursor += token.text.length;
    return { ...token, text: value.slice(lookup.offsets[start], lookup.offsets[cursor]) };
  });
}

export function tokenizeWithLinks(text, context = contextFor(null), scope = new Set()) {
  const value = String(text || '');
  const result = [];
  let cursor = 0;
  // Keep the original resolver's HTTPS resource-link behavior and label text.
  for (const match of value.matchAll(/\[([^\]\r\n]+)\]\((https:\/\/[^\s)]+)\)/g)) {
    let url;
    try { url = new URL(match[2]); } catch { continue; }
    if (url.protocol !== 'https:' || url.username || url.password) continue;
    result.push(...displayTokens(value.slice(cursor, match.index), context, scope));
    result.push({ text: match[1], href: url.href });
    cursor = match.index + match[0].length;
  }
  result.push(...displayTokens(value.slice(cursor), context, scope));
  return result;
}
