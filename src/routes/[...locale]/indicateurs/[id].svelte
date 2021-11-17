<script context="module" lang="ts">
	import type { Entry, RichTextContent } from 'contentful'
	import type { Categorie } from '../categories/[id].svelte'

  export interface Indicateur {
    titre: string
    id: string
    lead: string
    description: RichTextContent
    sources: RichTextContent
    titreDeLaxe: string
    type: string
    data: string
    minimum: number
    maximum: number
		categorie: Entry<Categorie>
  }

  import type { Load } from '@sveltejs/kit'
	import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `${page.params.locale === 'en' ? "/en" : ""}/indicateurs/${page.params.id}.json`)
	}
</script>

<script lang="ts">
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'

  import Chart from '$lib/components/Chart.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Icon from '$lib/components/Icon.svelte'
import StickyNav from '$lib/components/StickyNav.svelte';

	export let indicateur: Entry<Indicateur>
  export let pilier: Entry<Categorie>
  let exporting: Exporting
</script>

{#key indicateur.fields.id}
<StickyNav>
  <div slot="left">
    <a class="button" href="/"><Icon i="chevron" small rotate={180} /> retour</a>

    {#if pilier}
    <h4>
      <a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a> – <a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a>  
    </h4>
    {/if}
  </div>
</StickyNav>

<section>
  <article>
    <h1 style="color: {indicateur.fields.categorie.fields.couleur}">{indicateur.fields.titre}</h1>
    {#if indicateur.fields.lead}<p>{indicateur.fields.lead}</p>{/if}
    {#if indicateur.fields.description}<Document body={indicateur.fields.description} />{/if}

    <aside>
      <button>Partager <Icon i="share" /></button>
      <button on:click={() => exporting?.download('png')}>Télécharger <Icon i="download" /></button>
    </aside>

    {#if indicateur.fields.sources}<small>
      <h6>Sources</h6>
      <Document body={indicateur.fields.sources} />
    </small>{/if}
  </article>

  <figure>
    <Chart bind:exporting {...indicateur.fields} couleur={indicateur.fields.categorie.fields.couleur} />
  </figure>
</section>
{/key}

<style lang="scss">
  nav, section {
    max-width: var(--width);
    margin: 0 auto;
    padding: var(--gutter);
  }

  nav {
    display: flex;
    column-gap: var(--gutter);
    flex-wrap: wrap;
    align-items: center;

    h4 {
      margin-bottom: 0;
    }
  }

  section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    column-gap: var(--gutter);
  }

  article {
    grid-column: span 3;
  }
    
    aside {
      margin-bottom: var(--gutter);
      display: flex;
      column-gap: calc(var(--gutter) / 2);
    }

  figure {
    grid-column: span 3;
    margin: 0;
  }

  @media (max-width: 888px) {
  article {
    grid-column: span 6;
  }

  figure {
    grid-column: span 6;
  }
  }
</style>