<script context="module" lang="ts">
  import type { Asset, Entry, RichTextContent } from 'contentful'
  import type { Lien } from './Header.svelte'

  export interface PageDocument {
    titre: string
    id: string
    corps: RichTextContent
    photo: Asset
    contenu: Entry<any>[]
    bouton: Entry<Lien>
  }

</script>


<script lang="ts">
  import Contenu from './Contenu.svelte'
  import Hero from './Hero.svelte'
  import StickyNav from './StickyNav.svelte'

	export let page: Entry<PageDocument>
  export let hero: boolean = false
</script>

<svelte:head>
  <title>{page.fields.titre} – Les indicateurs du bien-être au Québec</title>
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
<nav>
  

  

  <!-- <hr> -->
</nav>
{/if}
{#if page.fields.contenu}
<Contenu contenu={page.fields.contenu} />
{/if}
{/key}


<style lang="scss">

  h1 {
    text-align: center;
    // color: var(--highlight);
    max-width: calc(var(--width) / 2);

    &.sticky {
      font-size: 1.5rem;
      font-family: var(--font);
      margin-bottom: 0;
    }
  }

  a.button {
    position: relative;
    z-index: 12;
    background: var(--dark);
  }
</style>