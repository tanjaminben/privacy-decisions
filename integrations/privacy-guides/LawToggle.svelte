<script>
  import { lawPanel, openLaw, closeLaw } from './law-panel.js';
</script>

<!-- The keyboard route to the law cited in answer cards, whose citations are marked text. -->
{#if $lawPanel.ids.length}
  <button type="button" class="text-button law-toggle" aria-expanded={$lawPanel.open} on:click={event => ($lawPanel.open ? closeLaw() : openLaw(null, event.currentTarget))}>{$lawPanel.open ? 'Hide the cited law' : `Read the cited law (${$lawPanel.ids.length})`}</button>
{/if}
