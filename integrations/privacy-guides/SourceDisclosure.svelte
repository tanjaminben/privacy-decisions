<script>
  export let title = '';
  export let label = 'source';
  let expanded = false;
</script>

<details class="source-disclosure" bind:open={expanded}>
  <summary aria-label={`${expanded ? 'Hide' : 'Show'} ${label}${title ? `: ${title}` : ''}`}>
    {#if title}<span class="source-disclosure-title">{title}</span>{/if}
    <span class="source-disclosure-action">
      {expanded ? 'Hide' : 'Show'} {label}
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
  </summary>
  <div class="source-disclosure-body"><slot /></div>
</details>
