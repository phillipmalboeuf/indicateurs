<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  
  import type { Entry } from 'contentful'
  import Chart from './Chart.svelte'
  import Icon from './Icon.svelte'
  import Buttons from './Buttons.svelte'
  import { page } from '$app/stores'
  import type { TypeIndicateurSkeleton } from '$lib/clients/content_types'
  // import Donut from './Donut.svelte'

  export let indicateur: Entry<TypeIndicateurSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let only: string = undefined
  let exporting: Exporting

  // const beigne = indicateur.fields.id === 'beigne'
  const beigne = false
</script>

{#if beigne}
<article class:beigne>
  <!-- <Donut /> -->
</article>
{:else}
<article>
  {#if indicateur.fields.categorie}
  <em style="color: {indicateur.fields.categorie?.fields?.couleur}"><a href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{indicateur.fields.categorie?.fields?.id}">{indicateur.fields.categorie?.fields?.titre}</a></em><br />
  {/if}
  <a class="indicateurs" href="{$page.params.locale === 'en' ? "/en" : ""}/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a>

  <!-- {#if indicateur.fields.lead}
  <p><small>{indicateur.fields.lead}</small></p>
  {/if} -->

  {#if indicateur.fields.data}
  <Chart {...indicateur.fields} bind:exporting couleur={indicateur.fields.categorie?.fields?.couleur} {only} />

  <aside>
    <a href="{$page.params.locale === 'en' ? "/en" : ""}/indicateurs/{indicateur.fields.id}"><small>{$page.params.locale === 'en' ? "Details" : "Détails"}&nbsp;<Icon i="chevron" small /></small></a>
    <div>
      <Buttons {indicateur} {exporting} iconsOnly />
    </div>
  </aside>
  {:else}
  <em class="empty">{$page.params.locale === 'en' ? "To be documented" : "À documenter"}</em>
  <aside>
    <a href="{$page.params.locale === 'en' ? "/en" : ""}/indicateurs/{indicateur.fields.id}"><small>{$page.params.locale === 'en' ? "Details" : "Détails"}&nbsp;<Icon i="chevron" small /></small></a>
  </aside>
  {/if}
</article>
{/if}

<style lang="scss">
  article {
    height: 100%;
    background: var(--darkish);
    //background: linear-gradient(180deg, transparent, var(--darkish));
    //padding: calc(var(--gutter) / 2);
    padding: 20px;
    border-radius: var(--corner);
    border: var(--border);
    box-shadow: var(--shadow);

    &.beigne {
      border-radius: 0;
      background: transparent;
    }
  }

  em {
    font-style: normal;
    color: var(--muted);

    &.empty {
      display: block;
      background-color: var(--darkishy);
      text-align: center;
      padding: 9vw 0;
      border-radius: var(--corner);
      margin: 1em 0;
    }
  }

  aside {
    color: var(--light);
  }

  aside {
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .indicateurs {
    display: flex;
    padding-top: 4px;
  }

</style>