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
  export let pilier: Entry<Categorie>
</script>

{#key indicateur.fields.id}
<a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a>
<a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a>
<h1 style="color: {indicateur.fields.categorie.fields.couleur}">{indicateur.fields.titre}</h1>

<Chart {...indicateur.fields} />
{/key}