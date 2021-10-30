<script context="module" lang="ts">
  import type { Entry, EntryCollection } from 'contentful'
  import type { Indicateur } from '../indicateurs/[id].svelte'

  export interface Categorie {
    titre: string
    id: string
    couleur: string
    sousCategories: Entry<Categorie>[]
  }

  import type { Load } from '@sveltejs/kit'
  import { respond } from '$lib/responses'

  export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `./${page.params.id}.json`)
	}
</script>

<script lang="ts">
	export let categorie: Entry<Categorie>
  export let indicateurs: EntryCollection<Indicateur>
  export let pilier: Entry<Categorie>
</script>


{#if pilier}
<a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a>
{/if}
<h1>{categorie.fields.titre}</h1>

<ul>
  {#each indicateurs.items as indicateur}
  <li><a href="/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a></li>
  {/each}
</ul>