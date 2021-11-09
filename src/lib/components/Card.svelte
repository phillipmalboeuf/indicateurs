<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Entry } from 'contentful'
  import Chart from './Chart.svelte'

  export let indicateur: Entry<Indicateur>
</script>

<article style="color: {indicateur.fields.categorie.fields.couleur}">
  <em><a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a></em><br />
  <a href="/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a>

  <!-- {#if indicateur.fields.lead}
  <p><small>{indicateur.fields.lead}</small></p>
  {/if} -->

  {#if indicateur.fields.data}
  <Chart {...indicateur.fields} couleur={indicateur.fields.categorie.fields.couleur} small />
  {:else}
  <p><strong>Données à venir.</strong></p>
  {/if}
</article>

<style>
  article {
    height: 100%;
    background: var(--dark);
    padding: calc(var(--gutter) / 2);
    border-radius: var(--corner);
  }

  em {
    font-style: normal;
    color: var(--muted);
  }
</style>