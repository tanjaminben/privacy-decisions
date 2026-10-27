import data from './law-quotes.json' with { type: 'json' };

// Each paragraph opens with its own markers: "(ag) (1) ..." sets two levels, "(A) ..." one.
// Levels: subdivision (a), paragraph (1), subparagraph (A), clause (i). A lowercase marker is a
// subdivision only on the first line of a subdivision; later it is a roman-numeral clause.
function markers(text, first) {
  const found = [];
  let rest = text;
  for (let m; (m = rest.match(/^\(([a-z]{1,2}|\d+|[A-Z]{1,2})\)\s*/)); rest = rest.slice(m[0].length)) {
    const value = m[1];
    const level = /^\d+$/.test(value) ? 1 : /^[A-Z]+$/.test(value) ? 2 : first && !found.length ? 0 : 3;
    found.push([level, `(${value})`]);
  }
  return found;
}

function paths(lines) {
  let stack = [];
  return lines.map((text, index) => {
    for (const [level, value] of markers(text, index === 0)) stack = [...stack.slice(0, level), value];
    return stack.join('');
  });
}

const cache = new Map(), byId = new Map();

// A cited paragraph such as "(ad)(2)(A)" returns its own lines plus the lead-in lines of its
// parents ("(2) For purposes of this title, a business does not sell personal information when:").
export function lawQuote(sourceId, para) {
  const source = data.sources[sourceId];
  const top = para?.match(/^\([a-z]{1,2}\)/)?.[0];
  if (!source || !top || !source.subdivisions[top]) return null;
  const key = `${sourceId} ${para}`;
  if (cache.has(key)) return cache.get(key);
  const lines = source.subdivisions[top], linePaths = paths(lines);
  const inside = linePaths.map(path => path.startsWith(para));
  let quote = null;
  if (inside.some(Boolean)) {
    const first = inside.indexOf(true);
    const parents = linePaths.map((path, i) => i < first && path.length < para.length && para.startsWith(path));
    const kept = lines.map((text, i) => ({ text, keep: inside[i] || parents[i] })).filter(line => line.keep);
    const gaps = [];
    let previous = -1;
    lines.forEach((_, i) => { if (inside[i] || parents[i]) { gaps.push(previous >= 0 && i > previous + 1); previous = i; } });
    quote = {
      id: `GuideLawS${sourceId.replace(/[^a-z0-9]/gi, '')}P${para.replace(/[^a-z0-9]/gi, '')}`,
      cite: `${source.label}${para}`,
      lines: kept.map((line, i) => ({ text: line.text, gap: gaps[i] })),
      label: source.label, url: source.url, retrieved: source.retrieved
    };
  }
  cache.set(key, quote);
  if (quote) byId.set(quote.id, quote);
  return quote;
}

// The side panel opens a quote by the id its citation carries; every citation on the page was
// resolved through lawQuote first.
export function lawQuoteById(id) {
  return byId.get(id) || null;
}

export function lawRetrievedLabel(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
