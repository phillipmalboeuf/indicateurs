<script lang="ts">
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import { page } from '$app/stores'

  import Chart from '$lib/components/Chart.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import StickyNav from '$lib/components/StickyNav.svelte'
  import Buttons, { imgix } from '$lib/components/Buttons.svelte'
  import Filters from '$lib/components/Filters.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  let exporting: Exporting

  let full = false
  let alt = false
</script>

<svelte:head>
  <title>{data.indicateur.fields.titre} – Les indicateurs du bien-être au Québec</title>
  {#if data.indicateur.fields.lead}<meta name="description" content={data.indicateur.fields.lead}>{/if}

  <meta property="og:title" content="{data.indicateur.fields.titre} – Les indicateurs du bien-être au Québec" />
  <meta property="og:url" content="https://indicateurs.quebec/indicateurs/{data.indicateur.fields.id}" />
  <meta property="og:description" content="{data.indicateur.fields.lead}" />
  <meta property="og:image" content="{imgix(data.indicateur)}" />

  <meta name="twitter:title" content="{data.indicateur.fields.titre} – Les indicateurs du bien-être au Québec">
  <meta name="twitter:description" content="{data.indicateur.fields.lead}">
  <meta name="twitter:card" value="summary_large_image">
  <meta name="twitter:image" content="{imgix(data.indicateur)}&w=600&h=314">
</svelte:head>

{#key data.indicateur.fields.id}
<StickyNav>
  <div slot="left">
    <a class="button" href="{$page.params.locale === 'en' ? "/en" : "/"}"><Icon i="chevron" small rotate={180} /> {$page.params.locale === 'en' ? "back" : "retour"}</a>

    {#if data.pilier}
    <h4>
      <a style="color: {data.pilier.fields.couleur}" href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{data.pilier.fields.id}">{data.pilier.fields.titre}</a> – <a style="color: {data.indicateur.fields.categorie.fields.couleur}" href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{data.indicateur.fields.categorie.fields.id}">{data.indicateur.fields.categorie.fields.titre}</a>  
    </h4>
    {/if}
  </div>
</StickyNav>

<section class:full>
  <h1 class="mobile">{data.indicateur.fields.titre}</h1>

  <article>
    <h1>{data.indicateur.fields.titre}</h1>
    {#if data.indicateur.fields.lead}<p>{data.indicateur.fields.lead}</p>{/if}
    {#if data.indicateur.fields.description}<Document body={data.indicateur.fields.description} />{/if}

    {#if data.indicateur.fields.altData}
    <aside>
      <button on:click={() => alt = false}>{data.indicateur.fields.titreDeLaxe || "Original"}</button><br>
      <button on:click={() => alt = true}>{data.indicateur.fields.altTitreDeLaxe || "Alternative"}</button>
    </aside>
    {/if}

    {#if data.indicateur.fields.data}
    <aside>
      <Buttons indicateur={data.indicateur} {exporting} />
      <!-- <a href="https://indicateurs.imgix.net/{indicateur.fields.id}_v{indicateur.sys.revision}.png?txt=indicateurs.quebec/indicateurs/{indicateur.fields.id}&txt-color={indicateur.fields.categorie.fields.couleur.replace('#', '')}" target="_blank" rel="noopener noreferrer">image export</a> -->
    </aside>
    {/if}

    {#if data.indicateur.fields.sources}<small>
      <h6>Sources</h6>
      <Document body={data.indicateur.fields.sources} />
    </small>{/if}
  </article>

  <figure class:ex={$page.url.searchParams.has("export")}>
    {#if data.indicateur.fields.data}
    <div>
      <button on:click={() => full = !full}>{#if $page.params.locale === 'en'}{#if full}Half screen ↴{:else}Full screen ⤢{/if}{:else}{#if full}Moitié d'écran ↴{:else}Plein écran ⤢{/if}{/if}</button>
    </div>
    {#key alt}
    <Chart 
      id={data.indicateur.fields.id}
      titre={data.indicateur.fields.titre}
      sources={data.indicateur.fields.sources}
      categorie={data.indicateur.fields.categorie}
      data={alt ? data.indicateur.fields.altData : data.indicateur.fields.data}
      type={alt ? data.indicateur.fields.altType : data.indicateur.fields.type}
      minimum={alt ? data.indicateur.fields.altMinimum : data.indicateur.fields.minimum}
      maximum={alt ? data.indicateur.fields.altMaximum : data.indicateur.fields.maximum}
      titreDeLaxe={alt ? data.indicateur.fields.altTitreDeLaxe : data.indicateur.fields.titreDeLaxe}
      bind:exporting small={full} couleur={data.indicateur.fields.categorie.fields.couleur} />
    {/key}
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