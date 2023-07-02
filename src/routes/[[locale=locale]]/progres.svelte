<script context="module" lang="ts">
  // import type { Load } from '@sveltejs/kit'
  // import { respond } from '$lib/responses'

	// export const load: Load = async ({ page, fetch, session, stuff }) => {
	// 	return respond(fetch, 'categories.json')
	// }
</script>

<script lang="ts">
  import { page } from '$app/stores'

  import Icon from '$lib/components/Icon.svelte'
  import Progress from '$lib/components/Progress.svelte'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import type { Entry } from 'contentful'

  let exporting: Exporting
</script>

<Progress bind:exporting locale={$page.params.locale} juri={'Québec'} />