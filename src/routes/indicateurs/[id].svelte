<script context="module" lang="ts">
	import type { Entry } from 'contentful'
	import type { Categorie } from '../categories/[id].svelte'

  export interface Indicateur {
    titre: string
    id: string
    lead: string
    type: string
    data: string
    minimum: number
    maximum: number
		categorie: Entry<Categorie>
  }

  import type { Load } from '@sveltejs/kit'
	import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `./${page.params.id}.json`)
	}
</script>

<script lang="ts">
  import Chart from '$lib/components/Chart.svelte'

	export let indicateur: Entry<Indicateur>
</script>

<a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a>
<h1>{indicateur.fields.titre}</h1>

<Chart {...indicateur.fields} />