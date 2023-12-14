<script lang="ts">
  import { page } from '$app/stores'
  import { region, regions, table, links } from '$lib/stores'

  export let click: svelte.JSX.MouseEventHandler<HTMLInputElement> = undefined
</script>

<table class="regions" class:click>
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
      {#if click}<input on:click={click} bind:group={$region} type="checkbox" name={r} id={r} value={r} />{/if}
      <label for={r}><img src="/regions/{r.toLowerCase().replace('é', 'e')}.svg" alt="" /> {r}</label>
    </td>
    {/each}
  </tr>
  {/each}
</table>

<!-- <select bind:value={$region} name="region" id="region">
  <option>Tout</option>
  <option>Québec</option>
  <option>Ontario</option>
  <option>Canada</option>
</select> -->

<style lang="scss">
  
  table {
    margin: 0;

    // li + & {
    //   padding-left: 1em;
    // }
  }

    .regions {
      display: flex;
      &:not(.click) { justify-content: space-around; }
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

label {
  cursor: auto;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  opacity: 1;
  margin-bottom: 0.1rem;

  img {
    width: 1rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 50%;
  }
}

input[type="checkbox"] {
  display: none;
  
  & ~ label {
    cursor: pointer;
    opacity: 0.5;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }

  &:checked {
    & ~ label {
      opacity: 1;
    }
  }
}
</style>