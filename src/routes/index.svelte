<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'

	export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, 'index.json')
	}
</script>

<script lang="ts">
  import type { EntryCollection } from 'contentful'
  
  import type { Indicateur } from './indicateurs/[id].svelte'
  import type { Categorie } from './categories/[id].svelte'

  import Chart from '$lib/components/Chart.svelte'
  import Donut from '$lib/components/Donut.svelte'

  export let categories: EntryCollection<Categorie>
  export let indicateurs: EntryCollection<Indicateur>

  console.log(categories)
  console.log(indicateurs)
</script>

<h1>Les Indicateurs</h1>

<figure>
  <!-- <Donut />
  <Chart /> -->

  <ul>
  {#each categories.items.filter(categorie => categorie.fields.sousCategories?.length > 0) as categorie}
  <li>
    <a href="/categories/{categorie.fields.id}">{categorie.fields.titre}</a>
    <ul>
      {#each categorie.fields.sousCategories as sousCategorie}
      <li><a href="/categories/{sousCategorie.fields.id}">{sousCategorie.fields.titre}</a></li>
      {/each}
    </ul>
  </li>
  {/each}
  </ul>

  <ul>
  {#each indicateurs.items as indicateur}
  <li><a href="/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a></li>
  {/each}
  </ul>
</figure>