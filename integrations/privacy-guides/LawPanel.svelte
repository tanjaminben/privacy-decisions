<script>
  import { onMount, tick } from 'svelte';
  import { helpLawIds } from './QuestionExplanation.svelte';
  import { lawQuoteById, lawRetrievedLabel } from './law-quotes.js';
  import { lawPanel, openLaw, closeLaw, setLawIds } from './law-panel.js';

  let panel, heading;
  $: quote = $lawPanel.open ? lawQuoteById($lawPanel.active) : null;
  $: others = $lawPanel.ids.filter(id => id !== $lawPanel.active).map(lawQuoteById).filter(Boolean);

  // What the open step cites: its question, answers and aside, plus its explanation.
  function collect(root) {
    const stage = root.querySelector('.determination-shell');
    if (!stage) return [];
    const ids = [...stage.querySelectorAll('[data-law-id]')].map(element => element.dataset.lawId);
    for (const help of stage.querySelectorAll('[data-help-id]')) ids.push(...(helpLawIds.get(help.dataset.helpId) || []));
    return [...new Set(ids)].filter(lawQuoteById);
  }

  // Capture runs before the answer card's own handler, so a citation in a card opens the law
  // without choosing that answer. Explanation bubbles are clones, so listen on the document.
  function onClick(event) {
    const trigger = event.target instanceof Element ? event.target.closest('[data-law-id]') : null;
    if (!trigger || !lawQuoteById(trigger.dataset.lawId)) return;
    event.preventDefault();
    event.stopPropagation();
    openLaw(trigger.dataset.lawId, trigger);
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && panel?.contains(document.activeElement)) closeLaw();
  }

  // A docked panel taller than the guide cannot stick, so bring its top into view; a new quote
  // starts from its heading.
  let request = 0;
  $: if ($lawPanel.request !== request) {
    request = $lawPanel.request;
    tick().then(() => {
      if (!panel) return;
      panel.scrollTop = 0;
      if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
      heading.focus({ preventScroll: true });
    });
  }

  onMount(() => {
    const root = document.getElementById('privacy-guides-app') || document.body;
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLawIds(collect(root)));
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-law-id', 'data-help-id'] });
    setLawIds(collect(root));
    document.addEventListener('click', onClick, true);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onClick, true);
    };
  });
</script>

<svelte:window on:keydown={onKeydown} />

{#if quote}
  <aside class="law-panel" aria-labelledby="law-panel-heading" bind:this={panel}>
    <div class="law-panel-head">
      <p class="field-label">Cited law</p>
      <button type="button" class="law-panel-close" aria-label="Close the cited law" on:click={closeLaw}>×</button>
    </div>
    <h3 id="law-panel-heading" tabindex="-1" bind:this={heading}>{quote.cite}</h3>
    <blockquote>{#each quote.lines as line}{#if line.gap}<p class="law-quote-gap">[…]</p>{/if}<p>{line.text}</p>{/each}</blockquote>
    <p class="law-quote-source">Exact text from the <a href={quote.url} target="_blank" rel="noopener noreferrer">official {quote.label}</a>, retrieved {lawRetrievedLabel(quote.retrieved)}.</p>
    {#if others.length}
      <p class="field-label">Also cited here</p>
      <ul class="law-panel-others">
        {#each others as other (other.id)}<li><button type="button" class="text-button" on:click={() => openLaw(other.id)}>{other.cite}</button></li>{/each}
      </ul>
    {/if}
  </aside>
{/if}
