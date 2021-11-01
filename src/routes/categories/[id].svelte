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
  import Filters from '$lib/components/Filters.svelte';
  import Indicateurs from '$lib/components/Indicateurs.svelte';

  export const load: Load = async ({ page, fetch, session, stuff }) => {
		return respond(fetch, `./${page.params.id}.json`)
	}
</script>

<script lang="ts">
	export let categorie: Entry<Categorie>
  export let indicateurs: Entry<Indicateur>[]
  export let pilier: Entry<Categorie>
</script>

{#key categorie.fields.id}
{#if pilier}
<a href="/categories/{pilier.fields.id}">{pilier.fields.titre}</a>
{/if}
<h1>{categorie.fields.titre}</h1>

{#if categorie.fields.sousCategories}
<Filters categories={categorie.fields.sousCategories} {indicateurs} on:update={event => indicateurs = event.detail} />
{/if}

<Indicateurs {indicateurs} />
{/key}