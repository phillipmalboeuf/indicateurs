<script context="module" lang="ts">
  import type { Entry, RichTextContent } from 'contentful'
  import type { Indicateur } from '../indicateurs/[id].svelte'

  export interface Categorie {
    titre: string
    id: string
    couleur: string
    description: RichTextContent
    sousCategories: Entry<Categorie>[]
  }

  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'
  import Filters from '$lib/components/Filters.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'
  import { page } from '$app/stores'

  export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `./${page.params.id}.json`)
	}
</script>

<script lang="ts">
  import Document from '$lib/components/document/Document.svelte'

	export let categorie: Entry<Categorie>
  export let indicateurs: Entry<Indicateur>[]
  export let pilier: Entry<Categorie>

  let checked: string[] = $page.query.get('categories')?.split(',') || []
</script>

{#key categorie.fields.id}
<nav>
  <a class="button" href="/"><svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 7L1 4L4 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg> retour</a>

  {#if pilier}
  <h4><a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a></h4>
  {/if}

  <hr>
</nav>

<section>
  <article>
    <h1>{categorie.fields.titre}</h1>
    {#if categorie.fields.description}<Document body={categorie.fields.description} />{/if}
  </article>
  
  <aside>
    {#if categorie.fields.sousCategories}
    <h5>Sous-catégories</h5>
    <Filters categories={categorie.fields.sousCategories} {checked} columns on:update={event => checked = event.detail} />
    {/if}
  </aside>
</section>



<Indicateurs indicateurs={indicateurs = checked.length
  ? indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id) }))
  : indicateurs.map(i => ({ ...i, hidden: false }))} />
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

    h4 {
      margin-bottom: 0;
    }
  }

  section {
    display: grid; 
    grid-template-columns: repeat(6, 1fr);
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