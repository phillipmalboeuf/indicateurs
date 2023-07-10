<script lang="ts">
  import { page } from '$app/stores'
  import { region, colors } from '$lib/stores'
  
  import Tooltip from './Tooltip.svelte'

  function click(e) {
    e.currentTarget.blur()
  }
</script>

<nav>
  <Tooltip right>
    <button type="button" slot="tip" class="filter">{$page.params.locale === 'en' ? "Jurisdictions" : "Juridictions"}</button>
    <ul class="piliers" slot="tool">
      {#each ["Québec", "Ontario", "Canada"] as r}
      <li style="--color: {colors[r]}">
        <input on:click={click} bind:group={$region} type="checkbox" name={r} id={r} value={r} />
        <label for={r}>{r}</label>
      </li>
      {/each}
    </ul>
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
  }

  button {
    padding: calc(var(--gutter) / 2) calc(var(--gutter) / 1.5);
    background: var(--dark);
    border: var(--border);
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
</style>