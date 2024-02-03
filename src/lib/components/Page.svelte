<script lang="ts">
  import type { Entry } from 'contentful'
  import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
  import type { TypePageSkeleton } from '$lib/clients/content_types'

  import { page as p } from '$app/stores'

  import Contenu from './Contenu.svelte'
  import Dashboard from './Dashboard.svelte'
  import Hero from './Hero.svelte'
  import StickyNav from './StickyNav.svelte'
  import Document from './document/Document.svelte';
  import Chart from './Chart.svelte'
  import Icon from './Icon.svelte'

	export let page: Entry<TypePageSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let hero: boolean = false
</script>

<svelte:head>
  <title>{page.fields.titre}{page.fields.id !== 'accueil' ? " – Les indicateurs du bien-être au Québec" : ""}</title>
  {#if page.fields.description}<meta name="description" content={documentToPlainTextString(page.fields.description)}>{/if}

  <meta property="og:title" content="{page.fields.titre}{page.fields.id !== 'accueil' ? " – Les indicateurs du bien-être au Québec" : ""}" />
  <meta property="og:url" content="https://indicateurs.quebec/{page.fields.id === 'accueil' ? '' : page.fields.id}" />
  {#if page.fields.description}<meta name="og:description" content={documentToPlainTextString(page.fields.description)}>{/if}
  {#if page.fields.photo}<meta property="og:image" content="https:{page.fields.photo.fields.file.url}?w=1200&h=630" />{/if}
</svelte:head>

{#key page.fields.id}
{#if hero}
<Hero media={page.fields.photo}>
  {#if page.fields.titre}
  <h1>{page.fields.titre}</h1>
  {/if}

  {#if page.fields.description}
  <aside>
    <Document body={page.fields.description} />
  </aside>
  {/if}

  {#if page.fields.bouton}<a href={page.fields.bouton.fields.lien} target={page.fields.bouton.fields.externe && '_blank'}><u>{page.fields.bouton.fields.titre}</u></a>{/if}

  {#if page.fields.indicateurVedette}
  <figure>
    <figcaption>
      <a href="{$p.params.locale === 'en' ? "/en" : ""}/indicateurs/{page.fields.indicateurVedette.fields.id}">
        <strong>{page.fields.indicateurVedette.fields.titre}</strong>
        <small><u>{$p.params.locale === 'en' ? "Details" : "Détails"}</u>&nbsp;<Icon i="chevron" small /></small>
      </a>
    </figcaption>
    <Chart {...page.fields.indicateurVedette.fields} couleur={page.fields.indicateurVedette.fields.categorie?.fields?.couleur} />
  </figure>
  {/if}
</Hero>
{:else}
<!-- <StickyNav>
  <h1 class="sticky" slot="left">{page.fields.titre}</h1>
  <div slot="right">
    {#if page.fields.bouton}<a class="button" href={page.fields.bouton.fields.lien} target={page.fields.bouton.fields.externe && '_blank'}>{page.fields.bouton.fields.titre}</a>{/if}
  </div>
</StickyNav> -->
{/if}

{#if page.fields.dashboard}
<Dashboard dashboard={page.fields.dashboard} />
{/if}

{#if page.fields.contenu}
<Contenu contenu={page.fields.contenu} noNav={hero} />
{/if}
{/key}


<style lang="scss">

  h1,
  aside {
    // text-align: center;
    max-width: calc(var(--width) / 2.25);

    // &.sticky {
    //   font-size: 1.3rem;
    //   font-family: var(--font);
    //   margin-bottom: 0;

    //   @media (max-width: 666px) {
    //     display: none;
    //   }
    // }
  }

  aside {
    margin-bottom: 2em;
  }

  a {
    color: var(--highlight);
  }

  figure {
    position: absolute;
    top: 50%;
    right: 0;
    width: 40%;
    height: 100%;
    transform: translateY(-50%);

    margin: 0;
    padding: 0 var(--gutter);

    figcaption {
      margin: calc(var(--gutter) * 1) 0 calc(var(--gutter) * -0.5);

      a {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        color: white;

        small:last-child {
          min-width: 6rem;
          text-align: right;
        }
      }
    }

    @media (max-width: 888px) {
      position: relative;
      top: 0;
      width: 100%;
      padding: 0;
      transform: none;
    }
  }

  // a.button {
  //   position: relative;
  //   z-index: 12;
  // }
</style>