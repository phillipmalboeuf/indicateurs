<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'

  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Entry } from 'contentful'
  import Chart from './Chart.svelte'
  import Icon from './Icon.svelte'
  import Buttons from './Buttons.svelte'
  // import Donut from './Donut.svelte'

  export let indicateur: Entry<Indicateur>
  let exporting: Exporting

  // const beigne = indicateur.fields.id === 'beigne'
  const beigne = false
</script>

{#if beigne}
<article class:beigne>
  <!-- <Donut /> -->
</article>
{:else}
<article style="color: {indicateur.fields.categorie?.fields.couleur}">
  {#if indicateur.fields.categorie}
  <em><a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a></em><br />
  {/if}
  <a class="indicateurs" href="/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a>

  <!-- {#if indicateur.fields.lead}
  <p><small>{indicateur.fields.lead}</small></p>
  {/if} -->

  {#if indicateur.fields.data}
  <Chart {...indicateur.fields} bind:exporting couleur={indicateur.fields.categorie.fields.couleur} small />

  <aside class="card-footer">
    <a href="/indicateurs/{indicateur.fields.id}"><small>Plus d'info <Icon i="chevron" small /></small></a>
    <div>
      <Buttons {indicateur} {exporting} iconsOnly />
    </div>

    <!-- {#if indicateur.fields.lead}<p><small>{indicateur.fields.lead}</small></p>{/if} -->
  </aside>
  {:else}
  <p><strong>Données à venir.</strong></p>
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

    &.beigne {
      border-radius: 0;
      background: transparent;
    }
  }

  em {
    font-style: normal;
    color: var(--muted);
  }

  p {
    margin: 0.5em 0 0;
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

    p {
      color: var(--light);
    }
  }

  .indicateurs {
    display: flex;
    padding-top: 4px;
  }

  .card-footer {
  }

</style>