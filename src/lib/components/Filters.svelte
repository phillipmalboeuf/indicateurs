<script lang="ts">
  import type { Entry } from 'contentful'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'

  import { afterUpdate, createEventDispatcher } from 'svelte'
  import Tooltip from './Tooltip.svelte'

  export let categories: Entry<Categorie>[]
  export let checked: string[] = []
  export let columns = false

  const all = [
    ...categories,
    ...categories.filter(categorie => categorie.fields.sousCategories).map(categorie => categorie.fields.sousCategories.flat()).flat()
  ]

  const dispatch = createEventDispatcher<{
    update: string[]
  }>()

  // function toggle(value: boolean, categorie: Categorie) {
  //   checked[categorie.id] = value ? categorie : undefined
    
  //   // const checkedIds = Object.keys(checked).filter(c => checked[c])

    

  //   // categories.filter(categorie => checkedIds.includes(categorie.fields.id) && categorie.fields.sousCategories).forEach(categorie => {
  //   //   categorie.fields.sousCategories.forEach(s => checkedIds.push(s.fields.id))
  //   // })

    
  // }
  afterUpdate(change)

  function change() {
    window.history.pushState({ }, null, checked.length ? `?categories=${checked.join(',')}` : `?`)

    dispatch('update', checked)
  }

  function click(e) {
    e.currentTarget.blur()
  }
</script>

<form>
  <ul class="piliers" class:columns>
    {#each categories as categorie}
    {#if categorie.fields.sousCategories?.length > 0}
    <Tooltip>
    <li slot="tip" style="--color: {categorie.fields.couleur}">
      <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
      <label for={categorie.fields.id}>{categorie.fields.titre}</label>
    </li>

    <ul slot="tool">
      {#each categorie.fields.sousCategories as sousCategorie}
      <li style="--color: {sousCategorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={sousCategorie.fields.id} id={sousCategorie.fields.id} value={sousCategorie.fields.id} />
        <label for={sousCategorie.fields.id}>{sousCategorie.fields.titre}</label>
      </li>
      {/each}
    </ul>
    </Tooltip>
    {:else}
    <li style="--color: {categorie.fields.couleur}">
      <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
      <label for={categorie.fields.id}>{categorie.fields.titre}</label>
    </li>
    {/if}
    {/each}
  </ul>
</form>

<div>
{#each checked.map(id => all.find(c => c.fields.id === id)) as categorie}
  <button on:click={() => {
    checked = [...checked.filter(id => id !== categorie.fields.id)]
  }} style="--color: {categorie.fields.couleur}">✕ {categorie.fields.titre}</button>
{/each}
</div>

<style lang="scss">
  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    font-weight: bold;
  }

    .piliers {
      display: flex;
      justify-content: center;
      column-gap: var(--gutter);
      margin-bottom: calc(var(--gutter) * 2);

      &.columns {
        flex-direction: column;
      }

      @media (max-width: 888px) {
        flex-direction: column;
      }
      
      > li {
        // color: var(--dark);
        // background: var(--light);
        padding: 0.33rem 0.66rem;
        border-radius: 0.5rem;

        // > ul {
          

        //   > li {
        //     color: var(--light);
            
        //   }
        // }
      }
    }

  div {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
  }

  button {
    background: var(--color);
    padding: 0.33rem 0.66rem;
    border-radius: 0.5rem;
    border: none;
  }
</style>