<script context="module" lang="ts">
  import type { Entry } from 'contentful'
  import type { Indicateur } from '../indicateurs/[id].svelte'

  export interface Categorie {
    titre: string
    id: string
    couleur: string
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
	export let categorie: Entry<Categorie>
  export let indicateurs: Entry<Indicateur>[]
  export let pilier: Entry<Categorie>

  let checked: string[] = $page.query.get('categories')?.split(',') || []
</script>

{#key categorie.fields.id}
{#if pilier}
<a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a>
{/if}
<h1>{categorie.fields.titre}</h1>

{#if categorie.fields.sousCategories}
<Filters categories={categorie.fields.sousCategories} {checked} on:update={event => checked = event.detail} />
{/if}

<Indicateurs indicateurs={indicateurs = checked.length
  ? indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id) }))
  : indicateurs.map(i => ({ ...i, hidden: false }))} />
{/key}