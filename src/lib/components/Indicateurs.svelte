<script lang="ts">
  import type { Entry } from 'contentful'
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'

  import Card from '$lib/components/Card.svelte'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'

  export let indicateurs: Entry<Indicateur>[]
  let Donut

  onMount(async () => {
    if (indicateurs.find(indicateur => indicateur.fields.id === 'beigne')) {
      Donut = (await import('./Donut.svelte')).default
    }
  })
</script>

<ul class:ex={$page.query.has("export")} style="grid-template-columns: repeat({indicateurs.length < 4 ? indicateurs.length : 4}, 1fr);">
  {#each indicateurs.filter(indicateur => indicateur.fields) as indicateur (indicateur.fields.id)}
  {#if !indicateur.hidden}
  <li>
    {#if indicateur.fields.id === 'beigne' && Donut}
    <svelte:component this={Donut} />
    {:else}
    <Card {indicateur} />
    {/if}
  </li>  
  {/if}
  {/each}
</ul>

<style lang="scss">
  ul {
    list-style: none;
    padding-left: 0;

    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--gutter);
    row-gap: var(--gutter);
    overflow-x: hidden;

    &.ex {
      grid-template-columns: repeat(2, 1fr) !important;

      :global(figure) {
        padding-bottom: 66%;
      }
    }
  }

  @media (max-width: 1400px) {
    ul {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  @media (max-width: 1000px) {
    ul {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 800px) {
    ul {
      grid-template-columns: 1fr !important;
    }
  }
</style>