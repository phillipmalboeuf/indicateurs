<script lang="ts">
  import type { Entry } from 'contentful'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'

  import { afterUpdate, createEventDispatcher } from 'svelte'
  import Tooltip from './Tooltip.svelte'
  import Icon from './Icon.svelte'

  import { region } from '$lib/stores'
  import { colors } from '$lib/charts'
  import { page } from '$app/stores'

  export let categories: Entry<Categorie>[] = undefined
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
  <Tooltip>
    <button type="button" slot="tip" class="filter">{$page.params.locale === 'en' ? "Jurisdictions" : "Juridictions"} <Icon i="chevron" rotate={90} /></button>
    <ul class="piliers" slot="tool">
      {#each ["Québec", "Ontario", "Canada"] as r}
      <li style="--color: {colors[r]}">
        <input on:click={click} bind:group={$region} type="checkbox" name={r} id={r} value={r} />
        <label for={r}>{r}</label>
      </li>
      {/each}
    </ul>
  </Tooltip>

  {#if categories}
  <Tooltip>
    <button type="button" slot="tip" class="filter">{$page.params.locale === 'en' ? "Pillars" : "Piliers"} <Icon i="chevron" rotate={90} /></button>
    <ul class="piliers" slot="tool">
      {#each categories as categorie}
      {#if categorie.fields.sousCategories?.length > 0}
      <li style="--color: {categorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
        <label for={categorie.fields.id}>{categorie.fields.titre}</label>
      </li>

      <ul>
        {#each categorie.fields.sousCategories as sousCategorie}
        <li style="--color: {sousCategorie.fields.couleur}">
          <input on:click={click} bind:group={checked} type="checkbox" name={sousCategorie.fields.id} id={sousCategorie.fields.id} value={sousCategorie.fields.id} />
          <label for={sousCategorie.fields.id}>{sousCategorie.fields.titre}</label>
        </li>
        {/each}
      </ul>
      {:else}
      <li style="--color: {categorie.fields.couleur}">
        <input on:click={click} bind:group={checked} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} value={categorie.fields.id} />
        <label for={categorie.fields.id}>{categorie.fields.titre}</label>
      </li>
      {/if}
      {/each}
    </ul>
  </Tooltip>
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
    justify-content: center;
    column-gap: var(--gutter);
    margin-bottom: calc(var(--gutter) * 2);

    &.right {
      justify-content: flex-end;
    }

    button {
      background: var(--dark);
      padding: calc(var(--gutter) / 2) calc(var(--gutter) / 1.5);
      border-radius: calc(var(--corner) / 2);
      border: var(--border);
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

    li + & {
      padding-left: 1em;
    }
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
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 0.5rem;

    button {
      background: var(--color);
      padding: 0.33rem 0.66rem;
      border-radius: 0.5rem;
      border: none;
    }
  }
</style>