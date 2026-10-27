<script>
  import { tokenizeWithLinks, mentionCard } from './editorial-mentions.js';
  import { lawQuote } from './law-quotes.js';
  export let text = '';
  export let context = null;
  export let scope = null;
  export let tokens = null;
  // Inside an answer card a link would nest a control in the button or label, so citations
  // stay text; a cited paragraph is marked, and a click on it or the toggle opens the panel.
  export let inert = false;
  $: segments = tokens || tokenizeWithLinks(text, context || undefined, scope || undefined);
</script>

<!-- Preserve the conservative upstream resolver and citations. A cited paragraph with verified
     verbatim text opens in the law panel beside the question; any other source opens as an
     ordinary named link. -->
<span class="mentions">{#each segments as segment}{@const quote = segment.sourceId && lawQuote(segment.sourceId, segment.para)}{#if quote && inert}<span class="guide-law-link" data-law-id={quote.id}>{segment.text}</span>{:else if quote}<a class="guide-source-link guide-law-link" href={'#' + quote.id} data-law-id={quote.id}>{segment.text}</a>{:else if inert}{segment.text}{:else if segment.sourceId && mentionCard(segment.sourceId)?.provenance}<a class="guide-source-link" href={mentionCard(segment.sourceId).provenance} target="_blank" rel="noopener noreferrer">{segment.text}</a>{:else if segment.href}<a class="resource-link" href={segment.href} target="_blank" rel="noopener noreferrer">{segment.text}</a>{:else}{segment.text}{/if}{/each}</span>
