<script lang="ts">
  import type { Entry } from 'contentful'
  // import type { Indicateur } from '$routes/indicateurs/[id].svelte'

  import Card from '$lib/components/Card.svelte'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import type { TypeIndicateurSkeleton } from '$lib/clients/content_types'

  export let indicateurs: Entry<TypeIndicateurSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  let Component

  onMount(async () => {
    if (indicateurs.find(indicateur => indicateur.fields.id === 'beigne')) {
      Component = (await import('./Donut.svelte')).default
    }
    if (indicateurs.find(indicateur => indicateur.fields.id.startsWith('progres'))) {
      Component = (await import('./Progress.svelte')).default
    }
  })
</script>

<ul class:one={indicateurs.length === 1} class:ex={$page.url.searchParams.has("export")} style="grid-template-columns: repeat({indicateurs.length < 4 ? indicateurs.length : 4}, 1fr);">
  {#each indicateurs.filter(indicateur => indicateur.fields) as indicateur (indicateur.fields.id)}
  {#if !indicateur.hidden}
  <li>
    
    {#if (indicateur.fields.id === 'beigne' || indicateur.fields.id.startsWith('progres'))}
    {#if Component}
    {#if indicateur.fields.id.startsWith('progres')}<h6>{indicateur.fields.titre}</h6>{/if}
    <svelte:component this={Component} locale={$page.params.locale} juri={indicateur.fields.id.startsWith('progres') && indicateur.fields.id.split('–')[1]} />
    {/if}
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

    li h6 {
      text-align: center;
      margin-bottom: 0;
    }

    &.ex {
      grid-template-columns: repeat(2, 1fr) !important;

      :global(figure) {
        padding-bottom: 66%;
      }
    }
  }

  @media (max-width: 1400px) {
    ul:not(.one) {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  @media (max-width: 1000px) {
    ul:not(.one) {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 800px) {
    ul:not(.one) {
      grid-template-columns: 1fr !important;
    }
  }
</style>