<script context="module" lang="ts">
  import type { Asset, Entry, RichTextContent } from 'contentful'


  export interface PageDocument {
    titre: string
    id: string
    corps: RichTextContent
    photo: Asset
    contenu: Entry<any>[]
  }

</script>


<script lang="ts">
  import Contenu from './Contenu.svelte'
  import Hero from './Hero.svelte'

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
{/if}
{#if page.fields.contenu}
<Contenu contenu={page.fields.contenu} />
{/if}
{/key}


<style>
  h1 {
    text-align: center;
    font-size: 3rem;
    color: var(--highlight);
    max-width: calc(var(--width) / 2);
  }
</style>