<script lang="ts">
  import type { Entry } from 'contentful'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import { createEventDispatcher } from 'svelte'

  export let categories: Entry<Categorie>[]
  export let indicateurs: Entry<Indicateur>[]

  let checked = {}
  // let timeout: NodeJS.Timeout

  const dispatch = createEventDispatcher<{
    update: Entry<Indicateur>[]
  }>()

  function toggle(id: string) {
    checked[id] = checked[id] === undefined ? true : !checked[id]
    
    // clearTimeout(timeout)
    // timeout = setTimeout(() => {
      const checkedIds = Object.keys(checked).filter(c => checked[c])

      categories.filter(categorie => checkedIds.includes(categorie.fields.id) && categorie.fields.sousCategories).forEach(categorie => {
        categorie.fields.sousCategories.forEach(s => checkedIds.push(s.fields.id))
      })

      indicateurs = checkedIds.length
        ? indicateurs.map(i => ({ ...i, hidden: !checkedIds.includes(i.fields.categorie.fields.id) }))
        : indicateurs.map(i => ({ ...i, hidden: false }))

      dispatch('update', indicateurs)
    // }, 333)
  }
</script>

<ul>
  {#each categories as categorie}
  {#if categorie.fields.sousCategories?.length > 0}
  <li style="color: {categorie.fields.couleur}">
    <input on:input={() => toggle(categorie.fields.id)} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} />
    <label for={categorie.fields.id}>{categorie.fields.titre}</label>
    <ul>
      {#each categorie.fields.sousCategories as sousCategorie}
      <li style="color: {sousCategorie.fields.couleur}">
        <input on:input={() => toggle(sousCategorie.fields.id)} type="checkbox" name={sousCategorie.fields.id} id={sousCategorie.fields.id} />
        <label for={sousCategorie.fields.id}>{sousCategorie.fields.titre}</label>
      </li>
      {/each}
    </ul>
  </li>
  {:else}
  <li style="color: {categorie.fields.couleur}">
    <input on:input={() => toggle(categorie.fields.id)} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} />
    <label for={categorie.fields.id}>{categorie.fields.titre}</label>
  </li>
  {/if}
  {/each}
  </ul>