<script context="module" lang="ts">
  // import type { Load } from '@sveltejs/kit'
  // import { respond } from '$lib/responses'

	// export const load: Load = async ({ page, fetch, session, stuff }) => {
	// 	return respond(fetch, 'categories.json')
	// }
</script>

<script lang="ts">
  import { page } from '$app/stores'

  import Donut from '$lib/components/Donut.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import type { Entry } from 'contentful'
  import type { Categorie } from './categories/[id].svelte'

  // export let categories: Entry<Categorie>[]
  let exporting: Exporting
</script>

<Donut bind:exporting locale={$page.params.locale} />
<button on:click={() => exporting?.download('png')}>Télécharger <Icon i="download" /></button>