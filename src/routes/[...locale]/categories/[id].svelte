<script context="module" lang="ts">
  import type { Entry, RichTextContent, Asset } from 'contentful'
  import type { Indicateur } from '../indicateurs/[id].svelte'

  export interface Categorie {
    titre: string
    id: string
    couleur: string
    description: RichTextContent
    photo: Asset
    sousCategories: Entry<Categorie>[]
  }

  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'
  import Filters from '$lib/components/Filters.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'

  export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `${page.params.locale === 'en' ? "/en" : ""}/categories/${page.params.id}.json`)
	}
</script>

<script lang="ts">
  import Document from '$lib/components/document/Document.svelte'
  import Hero from '$lib/components/Hero.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import StickyNav from '$lib/components/StickyNav.svelte'
  import { page } from '$app/stores'

	export let categorie: Entry<Categorie>
  export let indicateurs: Entry<Indicateur>[]
  export let pilier: Entry<Categorie>

  let checked: string[] = $page.query.get('categories')?.split(',') || []
</script>

<svelte:head>
  <title>{categorie.fields.titre} – Les indicateurs du bien-être au Québec</title>

  <meta property="og:title" content="{categorie.fields.titre} – Les indicateurs du bien-être au Québec" />
  <meta property="og:url" content="https://indicateurs.quebec/categories/{categorie.fields.id}" />
  {#if categorie.fields.photo}<meta property="og:image" content="https:{categorie.fields.photo.fields.file.url}?w=1200&h=630" />{/if}

  <meta name="twitter:title" content="{categorie.fields.titre} – Les indicateurs du bien-être au Québec">
  <meta name="twitter:card" value="summary_large_image">
  {#if categorie.fields.photo}<meta name="twitter:image" content="https:{categorie.fields.photo.fields.file.url}?w=600&h=314">{/if}
</svelte:head>


{#key categorie.fields.id}
<StickyNav>
  <div slot="left">
    <a class="button" href="{$page.params.locale === 'en' ? "/en" : "/"}"><Icon i="chevron" small rotate={180} /> retour</a>

    {#if pilier}
    <h4><a href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{pilier.fields.id}">{pilier.fields.titre}</a></h4>
    {/if}
  </div>
</StickyNav>

{#if categorie.fields.photo}
<Hero media={categorie.fields.photo}>
  <section>
    <article>
      <h1>{categorie.fields.titre}</h1>
      {#if categorie.fields.description}<Document body={categorie.fields.description} />{/if}
    </article>
    
    <aside>
      {#if categorie.fields.sousCategories}
      <h5>Sous-catégories</h5>
      <Filters categories={categorie.fields.sousCategories} {checked} columns base={($page.params.locale ? '/en' : '') + `/categories/${categorie.fields.id}`} on:update={event => checked = event.detail} />
      {/if}
    </aside>
  </section>
</Hero>
{:else}
<section>
  <article>
    <h1>{categorie.fields.titre}</h1>
    {#if categorie.fields.description}<Document body={categorie.fields.description} />{/if}
  </article>
  
  <aside>
    {#if categorie.fields.sousCategories}
    <h5>Sous-catégories</h5>
    <Filters categories={categorie.fields.sousCategories} {checked} columns base={($page.params.locale ? '/en' : '') + `/categories/${categorie.fields.id}`} on:update={event => checked = event.detail} />
    {/if}
  </aside>
</section>
{/if}



<Indicateurs indicateurs={indicateurs = checked.length
  ? indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id) }))
  : indicateurs.map(i => ({ ...i, hidden: false }))} />
{/key}

<style lang="scss">
  section {
    max-width: var(--width);
    margin: 0 auto;
    padding: var(--gutter);

    h1 {
      font-size: 2.5rem;
    }

    @media (max-width: 888px) {
      padding: var(--gutter) 0;

      h1 {
        font-size: 2.25rem;
      }
    }
  }

  a.button {
  }

  section {
    display: grid; 
    grid-template-columns: repeat(6, 1fr);
    padding-top: 104px;
    column-gap: var(--gutter);
  }

  article {
    grid-column: span 3;
  }

  aside {
    grid-column: 5 / span 2;
  }

  @media (max-width: 888px) {
  article {
    grid-column: span 6;
  }

  aside {
    grid-column: span 6;
  }
  }
</style>