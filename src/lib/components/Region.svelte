<script lang="ts">
  import { page } from '$app/state'
  import { region, regions, table, links } from '$lib/stores'
  import { onMount } from 'svelte'
  
  import Tooltip from './Tooltip.svelte'
  import RegionTable from './RegionTable.svelte'

  import { browser } from '$app/environment'
  import { getLocale } from '$lib/paraglide/runtime'

  function click(e) {
    e.currentTarget.blur()
  }

  let visible = false

  onMount(() => {
    if (browser && window.innerWidth > 888) {
      // visible = true
    }
  })
</script>

<nav>
  <Tooltip right click {visible}>
    <button type="button" slot="tip" class="filter" on:click={() => visible = true}>{getLocale() === 'en' ? "Jurisdictions" : "Juridictions"}</button>

    <div slot="tool">
      <RegionTable {click} />
      <button type="button" class="close" on:click={() => visible = false}>{getLocale() === 'en' ? "Close" : "Fermer"}</button>
    </div>
  </Tooltip>
</nav>

<!-- <select bind:value={$region} name="region" id="region">
  <option>Tout</option>
  <option>Québec</option>
  <option>Ontario</option>
  <option>Canada</option>
</select> -->

<style lang="scss">
  nav {
    position: fixed;
    z-index: 20;
    bottom: calc(var(--gutter) * 1.5);
    right: calc(var(--gutter) * 1.5);

    @media (max-width: 888px) {
      right: calc(var(--gutter) * 0.5);
    }
  }

  button {
    padding: calc(var(--gutter) / 2) calc(var(--gutter) / 1.5);
    background: var(--dark);
    border: var(--border);

    &.close {
      position: absolute;
      font-size: 0.75rem;
      padding: calc(var(--gutter) / 4) calc(var(--gutter) / 2.5);
      top: calc(var(--gutter) / -5);
      right: calc(var(--gutter) / 2);
    }
  }
</style>