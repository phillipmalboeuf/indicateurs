<script lang="ts">
  import type { Entry } from 'contentful'
  
  // import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { TypeCategorieSkeleton } from '$lib/clients/content_types'

  import { afterUpdate, createEventDispatcher } from 'svelte'
  import Tooltip from './Tooltip.svelte'
  import Icon from './Icon.svelte'

  // import { region } from '$lib/stores'
  // import { colors } from '$lib/charts'
  import { page } from '$app/stores'

  export let categories: Entry<TypeCategorieSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  export let checked: string[] = []
  // export let columns = false
  export let base: string = undefined

  const all = categories && [
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
    window.history.pushState({ }, null, checked.length ? `?categories=${checked.join(',')}` : base)

    dispatch('update', checked)
  }

  function click(e) {
    e.currentTarget.blur()
  }
</script>

<form class:right={!categories}>
  <h4>{$page.params.locale === 'en' ? "Categories" : "Catégories"}</h4>

  {#if categories}
  {#each categories as categorie}
  <Tooltip>
    <button type="button" slot="tip" class="filter">{categorie.fields.titre} <Icon i="chevron" rotate={90} /></button>
    <ul class="piliers" slot="tool">
      {#if categorie.fields.sousCategories?.length > 0}
      <!-- <li style="--color: {categorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
        <label for={categorie.fields.id}>{categorie.fields.titre}</label>
      </li> -->

      {#each categorie.fields.sousCategories as sousCategorie}
      <li style="--color: {sousCategorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={sousCategorie.fields.id} id={sousCategorie.fields.id} value={sousCategorie.fields.id} />
        <label for={sousCategorie.fields.id}>{sousCategorie.fields.titre}</label>
      </li>
      {/each}
      {:else}
      <li style="--color: {categorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
        <label for={categorie.fields.id}>{categorie.fields.titre}</label>
      </li>
      {/if}
    </ul>
  </Tooltip>
  {/each}
  {/if}
</form>

<div>
{#each checked.map(id => all.find(c => c.fields.id === id)) as categorie}
  <button on:click={() => {
    checked = [...checked.filter(id => id !== categorie.fields.id)]
  }} style="--color: {categorie.fields.couleur}">✕ {categorie.fields.titre}</button>
{/each}
</div>

<style lang="scss">

  form {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    column-gap: calc(var(--gutter) / 2);
    padding: calc(var(--gutter) / 2) 0;
    margin: var(--gutter) 0 calc(var(--gutter) * 1.5);
    // max-width: var(--width);
    border: 1px solid var(--muted);
    border-left: none;
    border-right: none;

    > h4 {
      flex: 1;
      margin-bottom: 0;
    }

    &.right {
      justify-content: flex-end;
    }

    button {
      background: transparent;
      padding: calc(var(--gutter) / 4) calc(var(--gutter) / 1.5);
      border-radius: calc(var(--corner) / 2);
      border: none;
      min-width: 20vw;

      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;

    // li + & {
    //   padding-left: 1em;
    // }
  }

  li {
    padding: 0.25rem;
    font-weight: bold;
  }

    .piliers {
      display: flex;
      justify-content: center;
      flex-direction: column;
      column-gap: var(--gutter);
      // margin-bottom: calc(var(--gutter) * 2);

      // &.columns {
      //   flex-direction: column;
      // }

      // @media (max-width: 888px) {
      //   flex-direction: column;
      // }
      
      > li {
        // color: var(--dark);
        // background: var(--light);
        // padding-top: 0.66rem;
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
    justify-content: flex-end;
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    margin-bottom: var(--gutter);

    button {
      background: var(--color);
      padding: 0.33rem 0.66rem;
      border-radius: 0.5rem;
      border: none;
    }
  }
</style>