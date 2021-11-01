<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, 'index.json')
	}
</script>

<script lang="ts">
  import type { Entry, EntryCollection } from 'contentful'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'

  import Chart from '$lib/components/Chart.svelte'
  import Donut from '$lib/components/Donut.svelte'
  import Filters from '$lib/components/Filters.svelte'
  import Card from '$lib/components/Card.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'

  export let categories: Entry<Categorie>[]
  export let indicateurs: Entry<Indicateur>[]
</script>

<h1>Les Indicateurs</h1>

<figure>
  <!-- <Donut />
  <Chart /> -->
</figure>

  <!-- <ul>
  {#each categories.filter(categorie => categorie.fields.sousCategories?.length > 0) as categorie}
  <li>
    <a href="/categories/{categorie.fields.id}">{categorie.fields.titre}</a>
    <ul>
      {#each categorie.fields.sousCategories as sousCategorie}
      <li><a href="/categories/{sousCategorie.fields.id}">{sousCategorie.fields.titre}</a></li>
      {/each}
    </ul>
  </li>
  {/each}
  </ul> -->

<Filters categories={categories.filter(c => c.fields.sousCategories)} {indicateurs} on:update={event => indicateurs = event.detail} />

<Indicateurs {indicateurs} />
