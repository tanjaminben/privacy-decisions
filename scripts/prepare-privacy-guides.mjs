import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { interfaceCopy } from '../integrations/privacy-guides/interface-copy.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'packages/privacy-guides');
const adapter = path.join(root, 'integrations/privacy-guides');
const out = path.join(root, '.local/privacy-guides-runtime');
const require = createRequire(path.join(source, 'package.json'));
const imported = JSON.parse(await readFile(path.join(source, 'IMPORT-MANIFEST.json'), 'utf8'));
for (const file of imported.files) {
  // BT-77 preserves extraction hashes while pinning the reviewed dependency lock.
  if (file.dependencyUpdateSha256 && file.path !== 'package-lock.json') throw Error(`Dependency update outside lockfile: ${file.path}`);
  const expected = file.dependencyUpdateSha256 || file.importedSha256;
  const actual = createHash('sha256').update(await readFile(path.join(source, file.path))).digest('hex');
  if (actual !== expected) throw Error(`Review changed guide package source: ${file.path}`);
}
for (const file of imported.supportFiles || []) {
  const actual = createHash('sha256').update(await readFile(path.join(source, file.path))).digest('hex');
  if (actual !== file.sha256) throw Error(`Review changed guide support source: ${file.path}`);
}
// Registry generation consumes only this package's content, never an AF checkout.
execFileSync(process.execPath, ['scripts/registry/generate.mjs'], { cwd: source, stdio: 'inherit' });
const { build } = await import(pathToFileURL(require.resolve('vite')));
const { svelte } = await import(pathToFileURL(require.resolve('@sveltejs/vite-plugin-svelte')));
const exact = (code, before, after) => {
  if (code.split(before).length !== 2) throw Error('Guide adapter anchor changed: ' + before.slice(0, 70));
  return code.replace(before, after);
};
const between = (code, start, end, replacement = '') => {
  const first = code.indexOf(start), last = code.indexOf(end, first + start.length);
  if (first < 0 || last < 0 || code.split(start).length !== 2) throw Error('Guide adapter function changed: ' + start);
  return code.slice(0, first) + replacement + code.slice(last);
};
await mkdir(out, { recursive: true });
await build({
  configFile: false, root: source, publicDir: false, base: './',
  plugins: [{
    name: 'portfolio-guide-presentation', enforce: 'pre',
    resolveId(id, importer) {
      if (id === 'portfolio-guides:copy-result') return path.join(adapter, 'copy-result.js');
      if (id === 'portfolio-guides:question-explanation') return path.join(adapter, 'QuestionExplanation.svelte');
      if (id === 'portfolio-guides:editorial-copy') return path.join(adapter, 'editorial-copy.js');
      if (id === 'portfolio-guides:source-links') return path.join(adapter, 'source-links.js');
      if (id === 'portfolio-guides:official-source-links') return path.join(adapter, 'OfficialSourceLinks.svelte');
      if (importer?.replaceAll('\\', '/').includes('/packages/privacy-guides/src/')) {
        if (id.endsWith('/registry.generated.js')) return path.join(adapter, 'presentation-registry.js');
        if (id.endsWith('/data/motion.js') || id === '../data/motion.js') return path.join(adapter, 'editorial-motion.js');
      }
      if (id.endsWith('/Mentions.svelte') && importer?.replaceAll('\\', '/').includes('/packages/privacy-guides/src/')) return path.join(adapter, 'Mentions.svelte');
    },
    transform(code, id) {
      if (id.replaceAll('\\', '/').endsWith('/privacy-guides/src/lib/engine/council.js')) {
        return interfaceCopy(exact(code, '# Privacy Wizards Council record —', '# Privacy Decision Guides record —'), 'engine/council.js');
      }
      if (id.replaceAll('\\', '/').endsWith('/privacy-guides/src/lib/engine/jurisdictions.js')) return interfaceCopy(code, 'engine/jurisdictions.js');
      if (id.replaceAll('\\', '/').endsWith('/privacy-guides/src/lib/ActionChecklist.svelte')) return interfaceCopy(code, 'ActionChecklist.svelte');
      if (id.replaceAll('\\', '/').endsWith('/privacy-guides/src/lib/JurisdictionRun.svelte')) {
        code = exact(code, '<script>', "<script>\n  import OfficialSourceLinks from 'portfolio-guides:official-source-links';\n  import { primarySourceUrl } from 'portfolio-guides:source-links';");
        code = exact(code, '<li><a href={SOURCES[id].provenance}', '<li><a href={primarySourceUrl(id, SOURCES[id])}');
        code = exact(code, '<a class="official-link" href={SOURCES[id].provenance} target="_blank" rel="noopener noreferrer">Open the official text ↗</a>', '<OfficialSourceLinks {id} source={SOURCES[id]} />');
        code = exact(code, "  import { tick } from 'svelte';", "  import { tick } from 'svelte';\n  import { stateResultsText } from 'portfolio-guides:copy-result';\n  import QuestionExplanation from 'portfolio-guides:question-explanation';\n  import { plainLegalCopy } from 'portfolio-guides:editorial-copy';");
        code = exact(code, 'beginJurisdictions, buildJurisdictionRecord, editJurisdiction', 'beginJurisdictions, editJurisdiction');
        code = between(code, '  function record() {', '  async function copy() {');
        code = exact(code, '    const text = record();', '    const text = stateResultsText({ wizardId, runs });');
        code = exact(code, 'All selected state results copied.', 'Results copied.');
        code = exact(code, 'Select the record below and copy it manually.', 'Copy the results below.');
        code = exact(code, '      <button type="button" class="button primary" on:click={download}>Download all state results</button>\n', '');
        code = exact(code, '<button type="button" class="button secondary" on:click={copy}>Copy record</button>', '<button type="button" class="button primary" on:click={copy}>Copy results</button>');
        code = exact(code, '        <details class="disclosure">\n          <summary>Why this question?</summary>\n          <p class="disclosure-body"><Mentions text={node.help} {context} /></p>\n        </details>', '        {#key wizardId + run.currentNodeId}<QuestionExplanation {wizardId} nodeId={run.currentNodeId} />{/key}');
        return interfaceCopy(code, 'JurisdictionRun.svelte');
      }
      if (!id.replaceAll('\\', '/').endsWith('/privacy-guides/src/App.svelte')) return;
      code = exact(code, '<script>', "<script>\n  import OfficialSourceLinks from 'portfolio-guides:official-source-links';");
      code = exact(code, '{#if item.source.provenance || item.source.url}<a class="official-link" href={item.source.provenance || item.source.url} target="_blank" rel="noopener noreferrer">Open the official text ↗</a>{/if}', '<OfficialSourceLinks id={item.id} source={item.source} />');
      code = exact(code, "  import { onMount, tick } from 'svelte';", "  import { onMount, tick } from 'svelte';\n  import { resultText } from 'portfolio-guides:copy-result';\n  import QuestionExplanation from 'portfolio-guides:question-explanation';\n  import { plainLegalCopy } from 'portfolio-guides:editorial-copy';");
      code = exact(code, '    buildRecord,\n', '');
      code = between(code, '  function downloadRecord() {', '  function selectCategory(id) {', "  function copyResult() {\n    copyText(resultText({ wizardId: selectedWizardId, history, outcomeId }), 'Result');\n  }\n\n");
      code = exact(code, 'on:click={downloadRecord}>Download determination', 'on:click={copyResult}>Copy result');
      code = exact(code, '<strong>Exports locked.</strong> This path contains a draft, missing, or superseded source record.', 'This result is unavailable because a source is missing or out of date.');
      code = between(code, '  function copyWizardLink() {', '</script>');
      code = exact(code, '        <button type="button" class="text-button" on:click={copyWizardLink}>Copy wizard link</button>\n', '');
      code = exact(code, '        {#if !wizard.jurisdictionRoutes}<div class={`legal-status status-${reviewState.status}`}><span>{sourceStatusLabel(reviewState.status)}</span><small>{reviewState.practitionerReviewed ? `Legal sources reviewed through ${reviewState.reviewedThrough}` : \'Published aid · not counsel-reviewed\'}</small></div>{/if}\n', '');
      code = exact(code, '                    <details class="disclosure" bind:open={helpExpanded}>\n                      <summary>Why this question?</summary>\n                      <p class="disclosure-body"><Mentions text={helpRest} context={citeState.context} scope={citeState.help} /></p>\n                    </details>', '                    {#key selectedWizardId + currentNodeId}<QuestionExplanation wizardId={selectedWizardId} nodeId={currentNodeId} />{/key}');
      code = exact(code, "const EMBED = new URLSearchParams(location.search).has('embed');", 'const EMBED = false;');
      const chromeStart = code.indexOf('{#if !EMBED}\n<header class="site-bar">');
      const mainStart = code.indexOf('<main class:is-embed={EMBED}>');
      const contentStart = code.indexOf('  {#if !graph.ok}');
      const mainEnd = code.lastIndexOf('</main>');
      if (chromeStart < 0 || mainStart < chromeStart || contentStart < mainStart || mainEnd < contentStart) throw Error('Guide chrome boundaries changed.');
      code = code.slice(0, chromeStart) + '<div class="guide-engine">\n<QuestionExplanation sources />\n' + code.slice(contentStart, mainEnd) + '</div>\n';
      code = code.replace(/      <section class="intro-steps"[\s\S]*?<\/section>\n/, '');
      code = exact(code, '<h2 id="finder-heading" class="sr-only">Find a determination</h2>', '<h2 id="finder-heading" class="guide-finder-title">What are you trying to decide?</h2>');
      return interfaceCopy(code, 'App.svelte');
    }
  }, svelte(), {
    name: 'record-guide-browser-modules',
    async generateBundle(_, bundle) {
      const modules = Object.values(bundle).flatMap(item => item.type === 'chunk' ? Object.keys(item.modules) : []);
      await writeFile(path.join(root, '.local/privacy-guides-build.json'), JSON.stringify({ modules }, null, 2) + '\n');
    }
  }],
  resolve: { dedupe: ['svelte'] },
  build: { outDir: out, emptyOutDir: false, target: 'es2020', sourcemap: false,
    modulePreload: { polyfill: false },
    rollupOptions: { input: path.join(adapter, 'entry.js'), external: ['/explanation-annotations.js'],
      output: { entryFileNames: 'app.js', inlineDynamicImports: true, assetFileNames: '[name][extname]' } } }
});
const postcss = require('postcss');
const tree = postcss.parse(await readFile(path.join(source, 'src/styles/app.css'), 'utf8'));
tree.walkRules(rule => {
  let parent = rule.parent;
  while (parent) { if (parent.type === 'atrule' && /keyframes$/.test(parent.name)) return; parent = parent.parent; }
  rule.selectors = rule.selectors.map(value => {
    let selector = value.trim().replace(/^(?:html|body|:root)(?=[\s.#:[>]|$)/, '#privacy-guides-app').replace(/^main(?=[\s.#:[>]|$)/, '#privacy-guides-app .guide-engine');
    return selector.startsWith('#privacy-guides-app') ? selector : '#privacy-guides-app ' + selector;
  });
});
await writeFile(path.join(out, 'app.css'), tree.toString() + '\n' + await readFile(path.join(adapter, 'portfolio.css'), 'utf8'));
await cp(path.join(source, 'LICENSE'), path.join(out, 'LICENSE.txt'));
let notices = 'Svelte — MIT\n\n' + await readFile(path.join(path.dirname(require.resolve('svelte/package.json')), 'LICENSE.md'), 'utf8');
notices += '\n\nLucide icons — ISC\n\n' + await readFile(path.join(source, 'assets/lucide-static.txt'), 'utf8');
await writeFile(path.join(out, 'THIRD-PARTY-LICENSES.txt'), notices);
console.log('Prepared Privacy Decision Guides runtime at ' + out);
