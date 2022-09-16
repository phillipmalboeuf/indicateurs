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
    altTitreDeLaxe: string
    altType: string
    altData: string
    altMinimum: number
    altMaximum: number
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
  import { page } from '$app/stores'

  import Chart from '$lib/components/Chart.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import StickyNav from '$lib/components/StickyNav.svelte'
  import Buttons, { imgix } from '$lib/components/Buttons.svelte'
  import Filters from '$lib/components/Filters.svelte'

	export let indicateur: Entry<Indicateur>
  export let pilier: Entry<Categorie>
  let exporting: Exporting

  let full = false
  let alt = false
</script>

<svelte:head>
  <title>{indicateur.fields.titre} – Les indicateurs du bien-être au Québec</title>
  {#if indicateur.fields.lead}<meta name="description" content={indicateur.fields.lead}>{/if}

  <meta property="og:title" content="{indicateur.fields.titre} – Les indicateurs du bien-être au Québec" />
  <meta property="og:url" content="https://indicateurs.quebec/indicateurs/{indicateur.fields.id}" />
  <meta property="og:description" content="{indicateur.fields.lead}" />
  <meta property="og:image" content="{imgix(indicateur)}" />

  <meta name="twitter:title" content="{indicateur.fields.titre} – Les indicateurs du bien-être au Québec">
  <meta name="twitter:description" content="{indicateur.fields.lead}">
  <meta name="twitter:card" value="summary_large_image">
  <meta name="twitter:image" content="{imgix(indicateur)}&w=600&h=314">
</svelte:head>

{#key indicateur.fields.id}
<StickyNav>
  <div slot="left">
    <a class="button" href="{$page.params.locale === 'en' ? "/en" : "/"}"><Icon i="chevron" small rotate={180} /> retour</a>

    {#if pilier}
    <h4>
      <a style="color: {pilier.fields.couleur}" href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{pilier.fields.id}">{pilier.fields.titre}</a> – <a style="color: {indicateur.fields.categorie.fields.couleur}" href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a>  
    </h4>
    {/if}
  </div>
</StickyNav>

<section class:full>
  <h1 class="mobile">{indicateur.fields.titre}</h1>

  <article>
    <h1>{indicateur.fields.titre}</h1>
    {#if indicateur.fields.lead}<p>{indicateur.fields.lead}</p>{/if}
    {#if indicateur.fields.description}<Document body={indicateur.fields.description} />{/if}

    {#if indicateur.fields.altData}
    <aside>
      <button on:click={() => alt = false}>{indicateur.fields.titreDeLaxe || "Original"}</button><br>
      <button on:click={() => alt = true}>{indicateur.fields.altTitreDeLaxe || "Alternative"}</button>
    </aside>
    {/if}

    {#if indicateur.fields.data}
    <aside>
      <Buttons {indicateur} {exporting} />
      <!-- <a href="https://indicateurs.imgix.net/{indicateur.fields.id}_v{indicateur.sys.revision}.png?txt=indicateurs.quebec/indicateurs/{indicateur.fields.id}&txt-color={indicateur.fields.categorie.fields.couleur.replace('#', '')}" target="_blank" rel="noopener noreferrer">image export</a> -->
    </aside>
    {/if}

    {#if indicateur.fields.sources}<small>
      <h6>Sources</h6>
      <Document body={indicateur.fields.sources} />
    </small>{/if}
  </article>

  <figure class:ex={$page.query.has("export")}>
    {#if indicateur.fields.data}
    <div>
      <button on:click={() => full = !full}>{#if full}Moitié d'écran ↴{:else}Plein écran ⤢{/if}</button>
    </div>
    {#key alt}
    <Chart 
      id={indicateur.fields.id}
      titre={indicateur.fields.titre}
      sources={indicateur.fields.sources}
      categorie={indicateur.fields.categorie}
      data={alt ? indicateur.fields.altData : indicateur.fields.data}
      type={alt ? indicateur.fields.altType : indicateur.fields.type}
      minimum={alt ? indicateur.fields.altMinimum : indicateur.fields.minimum}
      maximum={alt ? indicateur.fields.altMaximum : indicateur.fields.maximum}
      titreDeLaxe={alt ? indicateur.fields.altTitreDeLaxe : indicateur.fields.titreDeLaxe}
      bind:exporting small={full} couleur={indicateur.fields.categorie.fields.couleur} />
    {/key}
    <Filters />
    {:else}
    <em class="empty">{$page.params.locale === 'en' ? "To be documented" : "À documenter"}</em>
    {/if}
  </figure>
</section>
{/key}

<style lang="scss">
  section {
    min-height: 60vh;
    max-width: var(--width);
    margin: 0 auto;
    padding: var(--gutter);

    h1 {
      font-size: 2rem;
      line-height: 1.25;

      &.mobile {
        display: none;
      }

      @media (max-width: 888px) {
        display: none;

        &.mobile {
          display: block;
        }
      }
    }

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    column-gap: var(--gutter);

    @media (max-width: 888px) {
      grid-template-columns: 1fr;
      padding: calc(var(--gutter) * 3) 0;
    }
  }

  article {
    grid-column: span 3;
  }
    
  aside {
    margin-bottom: var(--gutter);
    display: flex;
    column-gap: calc(var(--gutter) / 4);
  }

  figure {
    grid-column: span 3;
    margin: 0;

    .full & {
      grid-column: span 6;
      grid-row-start: 1;
      margin-bottom: var(--gutter);
    }

    div {
      display: flex;
      column-gap: calc(var(--gutter) / 4);
      justify-content: flex-end;

      button:first-child {
        @media (max-width: 888px) {
          display: none;
        }
      }
    }

    &.ex {
      grid-column: span 6;

      :global(figure) {
        padding-bottom: 66%;
      }
    }

    @media (max-width: 888px) {
      grid-row-start: 2;
      margin-bottom: var(--gutter);
    }
  }

  em {
    font-style: normal;
    color: var(--muted);

    &.empty {
      display: block;
      background-color: var(--darkishy);
      text-align: center;
      padding: 12vw 0;
      border-radius: var(--corner);
      margin: 1em 0;
    }
  }

  h4 {
    font-size: 1.2rem;
  }
</style>