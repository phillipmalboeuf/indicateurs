<script lang="ts">
  import type { Entry } from 'contentful'
  
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import { createEventDispatcher } from 'svelte'

  export let categories: Entry<Categorie>[]
  export let indicateurs: Entry<Indicateur>[]

  let checked: {[key: string]: Categorie} = {}
  let form: HTMLFormElement
  // let timeout: NodeJS.Timeout

  const dispatch = createEventDispatcher<{
    update: Entry<Indicateur>[]
  }>()

  function toggle(value: boolean, categorie: Categorie) {
    checked[categorie.id] = value ? categorie : undefined
    
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

<form bind:this={form}>
  <ul class="piliers">
    {#each categories as categorie}
    {#if categorie.fields.sousCategories?.length > 0}
    <li style="--color: {categorie.fields.couleur}">
      <input on:input={(e) => {
        e.currentTarget.blur()
        toggle(e.currentTarget.checked, categorie.fields)
      }} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} />
      <label for={categorie.fields.id}>{categorie.fields.titre}</label>
      <ul>
        {#each categorie.fields.sousCategories as sousCategorie}
        <li style="--color: {sousCategorie.fields.couleur}">
          <input on:input={(e) => {
            e.currentTarget.blur()
            toggle(e.currentTarget.checked, sousCategorie.fields)
          }} type="checkbox" name={sousCategorie.fields.id} id={sousCategorie.fields.id} />
          <label for={sousCategorie.fields.id}>{sousCategorie.fields.titre}</label>
        </li>
        {/each}
      </ul>
    </li>
    {:else}
    <li style="--color: {categorie.fields.couleur}">
      <input on:input={(e) => {
        e.currentTarget.blur()
        toggle(e.currentTarget.checked, categorie.fields)
      }} type="checkbox" name={categorie.fields.id} id={categorie.fields.id} />
      <label for={categorie.fields.id}>{categorie.fields.titre}</label>
    </li>
    {/if}
    {/each}
  </ul>
</form>

<div>
{#each Object.values(checked).filter(c => c) as categorie}
  <button on:click={() => {
    form[categorie.id].checked = false
    toggle(false, categorie)
  }} style="--color: {categorie.couleur}">✕ {categorie.titre}</button>
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

      @media (max-width: 888px) {
        flex-direction: column;
        row-gap: var(--gutter)
      }
      
      > li {
        position: relative;
        color: var(--dark);
        background: var(--light);
        padding: 0.33rem 0.66rem;
        border-radius: 0.5rem;

        &:hover,
        &:focus,
        &:focus-within {

          > ul {
            pointer-events: auto;
            opacity: 1;
          }
        }

        > ul {
          position: absolute;
          z-index: 2;
          top: 100%;
          left: -1rem;
          width: 14rem;
          background: var(--dark);
          border-radius: 0.66rem;
          padding: 1rem;

          pointer-events: none;
          opacity: 0;

          > li {
            color: var(--light);
            
          }
        }
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
  }
</style>