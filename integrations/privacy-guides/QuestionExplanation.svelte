<script context="module">
  import { WIZARDS, decisionLead } from '../../packages/privacy-guides/src/lib/engine/council.js';
  import { contextFor, tokenizeWithLinks } from './editorial-mentions.js';
  import { questionHelpBlocks } from './explanation-layout.js';

  function helpId(wizardId, nodeId) {
    return `GuideQuestionW${wizardId.replace(/[^a-z0-9]/gi, '')}N${nodeId.replace(/[^a-z0-9]/gi, '')}`;
  }

  // Use the same reviewed copy as the question, results and copied record.
  const entries = Object.entries(WIZARDS).flatMap(([wizardId, wizard]) =>
    Object.entries(wizard.nodes).filter(([, node]) => node.type === 'question' && node.help).map(([nodeId, node]) => {
      const value = String(node.help).trim(), lead = decisionLead(value);
      const text = wizard.jurisdictionRoutes ? node.help
        : !lead || lead === value ? '' : lead.endsWith('…') ? value : value.slice(lead.length).trim();
      const context = contextFor(wizardId, node), scope = new Set();
      if (!wizard.jurisdictionRoutes) tokenizeWithLinks(lead, context, scope);
      const tokens = tokenizeWithLinks(text, context, scope);
      return { id: helpId(wizardId, nodeId), text, blocks: questionHelpBlocks(tokens, wizardId, nodeId) };
    }).filter(entry => entry.text));
</script>

<script>
  import { onMount } from 'svelte';
  import { explanations } from '/explanation-annotations.js';
  import Mentions from './Mentions.svelte';
  export let sources = false;
  export let wizardId = '';
  export let nodeId = '';
  let host;
  onMount(() => {
    if (sources) return;
    explanations.enhance(host);
    return () => explanations.closeWithin(host);
  });
</script>

{#if sources}
  <!-- Register all authored question excerpts before the shared snapshot is taken. -->
  <section class="guides-explanations" aria-hidden="true">
    {#each entries as entry}
      <h2>:x {entry.id}</h2>
      <div data-guide-question-explanation>
        {#each entry.blocks as block}
          {#if block.kind === 'cards'}
            <div data-explanation-cards="two">
              {#each block.items as item}
                <div>{#if item.lead.length}<strong><Mentions tokens={item.lead} /></strong>{/if}<Mentions tokens={item.tokens} /></div>
              {/each}
            </div>
          {:else if block.kind === 'list'}
            <ul>{#each block.items as item}<li>{#if item.lead.length}<strong><Mentions tokens={item.lead} /></strong>{/if}<Mentions tokens={item.tokens} /></li>{/each}</ul>
          {:else}
            <p>{#if block.lead.length}<strong><Mentions tokens={block.lead} /></strong>{/if}<Mentions tokens={block.tokens} /></p>
          {/if}
        {/each}
      </div>
    {/each}
  </section>
{:else}
  <div class="guide-question-help" bind:this={host}>
    <a href={'#' + helpId(wizardId, nodeId)}>:Why this question?</a>
  </div>
{/if}
