<script>
  import { sourceLinks } from './source-links.js';
  export let id;
  export let source;
  $: links = sourceLinks(id, source);
</script>

<span class="official-source-links">{#each links as link}
  <a class="official-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
{/each}</span>
