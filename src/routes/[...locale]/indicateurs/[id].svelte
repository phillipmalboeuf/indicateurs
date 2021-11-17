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
  import { onMount } from 'svelte'

  import Chart from '$lib/components/Chart.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import StickyNav from '$lib/components/StickyNav.svelte'
  import Tooltip from '$lib/components/Tooltip.svelte'


	export let indicateur: Entry<Indicateur>
  export let pilier: Entry<Categorie>
  let exporting: Exporting
  let shareable: boolean

  onMount(() => {
    shareable = !!navigator.share
  })
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
      {#if shareable}
      <button on:click={() => navigator.share({
        text: `${indicateur.fields.lead} – ${indicateur.fields.titre}`
      })}>Partager <Icon i="share" /></button>
      {:else}
      <Tooltip top>
        <button slot="tip" on:click={() => false}>Partager <Icon i="share" /></button>
        <ul slot="tool">
          <li><a href="https://twitter.com/intent/tweet?url=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}&text={`${indicateur.fields.lead} – ${indicateur.fields.titre}`}" target="_blank">Partager sur Twitter</a></li>
          <li><a href="https://www.facebook.com/sharer.php?u=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}" target="_blank">Partager sur Facebook</a></li>
          <li><a href="https://www.linkedin.com/shareArticle?url=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}&title={indicateur.fields.titre}&summary={indicateur.fields.lead}" target="_blank">Partager sur LinkedIn</a></li>
          <li class="url">
            <label for="url">URL de partage:</label>
            <input type='url' id="url" readonly on:click={e => e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)} 
              value="https://indicateurs.quebec/indicateurs/{indicateur.fields.id}" />
          </li>
        </ul>
      </Tooltip>
      {/if}
      <Tooltip top>
        <button slot="tip" on:click={() => exporting?.download('png')}>Télécharger <Icon i="download" /></button>
        <ul slot="tool">
          <li><button on:click={() => exporting?.download('png')}>Format image</button></li>
          <li><button on:click={() => exporting?.download('csv')}>Format CSV</button></li>
        </ul>
      </Tooltip>
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
  section {
    max-width: var(--width);
    margin: 0 auto;
    padding: var(--gutter);
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

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {

    &.url {
      margin-top: 0.5rem;
      text-align: center;
    }

    a {
      display: inline-block;
      font-weight: bold;
      padding: 6px 12px;
    }
    
    button {
      font-size: 1rem;
      border: none;
    }

    input {
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.25rem;
      background: transparent;
      color: var(--light);
      border: 1px solid var(--highlight);
    }
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