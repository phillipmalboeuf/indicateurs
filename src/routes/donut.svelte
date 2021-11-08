<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, 'categories.json')
	}
</script>

<script lang="ts">
  import Donut from '$lib/components/Donut.svelte'
  import type { Entry } from 'contentful'
  import type { Categorie } from './categories/[id].svelte'

  export let categories: Entry<Categorie>[]
</script>

<Donut {categories} />