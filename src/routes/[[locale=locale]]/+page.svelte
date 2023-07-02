
<script lang="ts">
  import { page as query } from '$app/stores'

  import Filters from '$lib/components/Filters.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'
  import Page from '$lib/components/Page.svelte'
  import { page as p } from '$app/stores'

  import type { PageData } from './$types'
  export let data: PageData

  let checked: string[] = $query.url.searchParams.get('categories')?.split(',') || []
</script>

<Page page={data.page} hero />

{#if !$query.url.searchParams.has('export')}
<Filters categories={data.piliers} {checked} on:update={event => checked = event.detail} base={$p.params.locale ? '/en' : '/'} />
{/if}

<Indicateurs indicateurs={data.indicateurs = checked.length
  ? data.indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id
    || data.piliers.find(c => c.fields.id === id)?.fields.sousCategories?.find(s => s.fields.id === i.fields.categorie.fields.id)) }))
  : data.indicateurs.map(i => ({ ...i, hidden: false }))} />
