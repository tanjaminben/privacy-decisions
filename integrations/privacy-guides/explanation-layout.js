import { sentenceBreaks } from '../../packages/privacy-guides/src/lib/engine/council.js';

// Format already-resolved tokens so paragraph boundaries never change which
// jurisdiction or source an inline citation opens.
export function questionHelpBlocks(tokens, wizardId, nodeId) {
  const text = tokens.map(token => token.text).join('');
  const slice = (start, end) => {
    let cursor = 0;
    return tokens.flatMap(token => {
      const from = Math.max(start - cursor, 0), to = Math.min(end - cursor, token.text.length);
      cursor += token.text.length;
      return from < to ? [{ ...token, text: token.text.slice(from, to) }] : [];
    });
  };
  const passage = (start, end, boldEnd) => {
    while (/\s/.test(text[start] || '') && start < end) start++;
    while (/\s/.test(text[end - 1] || '') && end > start) end--;
    // Existing context labels become scan points, without inventing headings.
    const label = text.slice(start, end).match(/^(?:UK(?: divergence| note)?|EU|Boundary note|Note|Examples|Rights menu):/);
    const split = boldEnd || start + (label?.[0].length || 0);
    return { lead: slice(start, split), tokens: slice(split, end) };
  };
  const paragraph = (start, end, boldEnd) => ({ kind: 'paragraph', ...passage(start, end, boldEnd) });

  if (wizardId === 'ai-risk' && nodeId === 'q-subject') {
    const paragraphs = [...text.matchAll(/(?:^|\n\s*\n)([^]+?)(?=\n\s*\n|$)/g)]
      .map(match => { const start = match.index + match[0].indexOf(match[1]); return [start, start + match[1].length]; });
    const labels = ['An AI system', 'A general-purpose AI model', 'A system built on a general-purpose AI model'];
    if (paragraphs.length !== 4 || labels.some((label, index) => !text.slice(...paragraphs[index]).startsWith(label))) throw Error('Review AI system/model comparison copy.');
    return [
      { kind: 'cards', items: paragraphs.slice(0, 3).map(([start, end]) => passage(start, end, text.indexOf(' is ', start))) },
      paragraph(...paragraphs[3])
    ];
  }

  const cuts = [...new Set([0, ...sentenceBreaks(text), ...[...text.matchAll(/\n\s*\n/g)].map(match => match.index), text.length])].sort((a, b) => a - b);
  const ranges = text.length > 280 || /\n\s*\n/.test(text) ? cuts.slice(0, -1).map((start, index) => [start, cuts[index + 1]]) : [[0, text.length]];
  return ranges.flatMap(([start, end]) => {
    if (!text.slice(start, end).trim()) return [];
    // Authored semicolon lists stay lists, including their original punctuation.
    let depth = 0;
    const semicolons = [];
    for (let index = start; index < end; index++) {
      if (text[index] === '(') depth++;
      if (text[index] === ')') depth--;
      if (text[index] === ';' && depth === 0) semicolons.push(index + 1);
    }
    const colon = text.indexOf(':', start);
    if (semicolons.length < 2 || colon < start || colon >= semicolons[0] || colon - start > 200) return [paragraph(start, end)];
    const itemCuts = [colon + 1, ...semicolons, end];
    return [paragraph(start, colon + 1), { kind: 'list', items: itemCuts.slice(0, -1).map((from, index) => passage(from, itemCuts[index + 1])) }];
  });
}
