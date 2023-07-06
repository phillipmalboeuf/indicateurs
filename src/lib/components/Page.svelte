<script context="module" lang="ts">
  import type { Asset, Entry, RichTextContent } from 'contentful'
  import type { Lien } from './Header.svelte'

  export interface PageDocument {
    titre: string
    id: string
    description: any
    photo: Asset
    contenu: Entry<any>[]
    bouton: Entry<Lien>
    dashboard: Entry<any>[]
  }

</script>


<script lang="ts">
  import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

  import Contenu from './Contenu.svelte'
  import Dashboard from './Dashboard.svelte'
  import Hero from './Hero.svelte'
  import StickyNav from './StickyNav.svelte'

	export let page: Entry<PageDocument>
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
</Hero>
{:else}
<StickyNav>
  <h1 class="sticky" slot="left">{page.fields.titre}</h1>
  <div slot="right">
    {#if page.fields.bouton}<a class="button" href={page.fields.bouton.fields.lien} target={page.fields.bouton.fields.externe && '_blank'}>{page.fields.bouton.fields.titre}</a>{/if}
  </div>
</StickyNav>
{/if}

{#if !hero && page.fields.dashboard}
<Dashboard dashboard={page.fields.dashboard} />
{/if}

{#if !hero && page.fields.contenu}
<Contenu contenu={page.fields.contenu} />
{/if}
{/key}


<style lang="scss">

  h1 {
    text-align: center;
    max-width: calc(var(--width) / 1.5);

    &.sticky {
      font-size: 1.3rem;
      font-family: var(--font);
      margin-bottom: 0;

      @media (max-width: 666px) {
        display: none;
      }
    }
  }

  a.button {
    position: relative;
    z-index: 12;
  }
</style>