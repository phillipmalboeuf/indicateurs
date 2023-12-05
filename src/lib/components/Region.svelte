<script lang="ts">
  import { page } from '$app/stores'
  import { region, regions } from '$lib/stores'
    import { onMount } from 'svelte';
  
  import Tooltip from './Tooltip.svelte'
    import { browser } from '$app/environment';

  function click(e) {
    e.currentTarget.blur()
  }

  const table = {
    "Juridictions": ["Québec", "Ontario", "Canada"],
    "G7": ["Allemagne", "France", "Italie"],
    "&nbsp;": ["Royaume-Uni", "Japon", "États-Unis"],
    "WEGo": ["Finlande", "Islande", "Nouvelle-Zélande"]
  }

  const links = {
    "G7": "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/g7/index.aspx?lang=fra",
    "WEGo": "https://weall.org/hubs",
  }

  let visible = false

  onMount(() => {
    if (browser && window.innerWidth > 888) {
      // visible = true
    }
  })
</script>

<nav>
  <Tooltip right click {visible}>
    <button type="button" slot="tip" class="filter" on:click={() => visible = true}>{$page.params.locale === 'en' ? "Jurisdictions" : "Juridictions"}</button>

    <table class="regions" slot="tool">
      {#each Object.entries(table) as [title, list]}
      <tr>
        <th class:empty={title === '&nbsp;'}>
          {#if links[title]}
          <a href={links[title]} rel="external" target="_blank"><u>{@html title}</u></a>
          {:else}
          {@html title}
          {/if}
        </th>
        {#each list as r}
        <td style="--color: {regions[r]}">
          <input on:click={click} bind:group={$region} type="checkbox" name={r} id={r} value={r} />
          <label for={r}><img src="/regions/{r.toLowerCase().replace('é', 'e')}.svg" alt="" /> {r}</label>
        </td>
        {/each}
      </tr>
      {/each}

       <button type="button" class="close" on:click={() => visible = false}>{$page.params.locale === 'en' ? "Close" : "Fermer"}</button>
    </table>
  </Tooltip>
</nav>

<!-- <select bind:value={$region} name="region" id="region">
  <option>Tout</option>
  <option>Québec</option>
  <option>Ontario</option>
  <option>Canada</option>
</select> -->

<style lang="scss">
  nav {
    position: fixed;
    z-index: 20;
    bottom: calc(var(--gutter) * 1.5);
    right: calc(var(--gutter) * 1.5);

    @media (max-width: 888px) {
      right: calc(var(--gutter) * 0.5);
    }
  }

  button {
    padding: calc(var(--gutter) / 2) calc(var(--gutter) / 1.5);
    background: var(--dark);
    border: var(--border);

    &.close {
      position: absolute;
      font-size: 0.75rem;
      padding: calc(var(--gutter) / 4) calc(var(--gutter) / 2.5);
      top: calc(var(--gutter) / -5);
      right: calc(var(--gutter) / 2);
    }
  }

  table {
    margin: 0;

    // li + & {
    //   padding-left: 1em;
    // }
  }

    .regions {
      display: flex;
      // justify-content: center;
      // flex-direction: column;
      gap: calc(var(--gutter) / 1);
      min-width: 666px;
      width: 100%;
      // margin-bottom: calc(var(--gutter) * 2);

      // &.columns {
      //   flex-direction: column;
      // }

      // @media (max-width: 888px) {
      //   flex-direction: column;
      // }

      > tr {
        display: block;

        > th,
        > td {
          display: block;
          text-align: left;
          font-size: 0.88rem;
          letter-spacing: 1px;
        }

        > th {
          opacity: 0.66;
          font-weight: normal;
          font-size: 0.75rem;
          padding-bottom: 0.5rem;
        }
      }

      @media (max-width: 888px) {
        min-width: auto;
        width: 85vw;

        flex-direction: column;

        th.empty {
          display: none;
        }
      }
    }

input[type="checkbox"] {
  display: none;
  
  & ~ label {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    opacity: 0.5;
    margin-bottom: 0.1rem;

    &:hover,
    &:focus {
      opacity: 1;
    }

    img {
      width: 1rem;
      height: 1rem;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  &:checked {
    & ~ label {
      opacity: 1;
    }
  }
}
</style>