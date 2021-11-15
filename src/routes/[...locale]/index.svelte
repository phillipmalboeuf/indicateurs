<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `${page.params.locale === 'en' ? "/en" : ""}/home.json`)
	}
</script>

<script lang="ts">
  import type { Entry, EntryCollection } from 'contentful'
  import { page as query } from '$app/stores'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import type { PageDocument } from '$lib/components/Page.svelte'

  import Filters from '$lib/components/Filters.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'
  import Page from '$lib/components/Page.svelte'

  export let categories: Entry<Categorie>[]
  export let indicateurs: Entry<Indicateur>[]
  export let page: Entry<PageDocument>

  let checked: string[] = $query.query.get('categories')?.split(',') || []
</script>

<Page {page} hero />

<Filters categories={categories.filter(c => c.fields.sousCategories)} {checked} on:update={event => checked = event.detail} />

<Indicateurs indicateurs={indicateurs = checked.length
  ? indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id
    || categories.find(c => c.fields.id === id)?.fields.sousCategories?.find(s => s.fields.id === i.fields.categorie.fields.id)) }))
  : indicateurs.map(i => ({ ...i, hidden: false }))} />
