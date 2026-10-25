<script>
  import { tokenizeWithLinks, mentionCard } from './editorial-mentions.js';
  export let text = '';
  export let context = null;
  export let scope = null;
  export let tokens = null;
  $: segments = tokens || tokenizeWithLinks(text, context || undefined, scope || undefined);
</script>

<!-- Preserve the conservative upstream resolver and citations. Sources open as
     ordinary named links; the portfolio no longer uses citation popovers. -->
<span class="mentions">{#each segments as segment}{#if segment.sourceId && mentionCard(segment.sourceId)?.provenance}<a class="guide-source-link" href={mentionCard(segment.sourceId).provenance} target="_blank" rel="noopener noreferrer">{segment.text}</a>{:else if segment.href}<a class="resource-link" href={segment.href} target="_blank" rel="noopener noreferrer">{segment.text}</a>{:else}{segment.text}{/if}{/each}</span>
