<script context="module" lang="ts">
  import type { Entry } from 'contentful'

	export interface Lien {
    titre: string
    lien: string
    externe: boolean
    sousLiens: Entry<Lien>[]
  }
</script>

<script lang="ts">
import Tooltip from './Tooltip.svelte'

	export let path: string
  export let navigation: Entry<{
		liens: Entry<Lien>[]
	}>
</script>

<header>
  <a href="/" class="logo"><strong>Les Indicateurs</strong></a>

  <nav>
    {#each navigation.fields.liens as lien}
    {#if lien.fields.sousLiens?.length > 0}
    <Tooltip>
      <a slot="tip" class:active={path.includes(lien.fields.lien)} href={lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>

      <div slot="tool">
        {#each lien.fields.sousLiens as l}
        <a href={l.fields.lien} target={lien.fields.externe && '_blank'}>{l.fields.titre}</a>
        {/each}
      </div>
    </Tooltip>
    {:else}
    <a class:active={path.includes(lien.fields.lien)} href={lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>
    {/if}
    {/each}

    <a href="/"><strong>EN</strong></a>
  </nav>
</header>


<style lang="scss">
	header {
    width: 100%;
    max-width: var(--width);
    margin: 0 auto;
    
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: var(--gutter);

    // button {
    //   color: currentColor;
    //   background: none;
    //   border: none;
    //   padding: 0;
    // }

    nav {
      display: flex;
      column-gap: var(--gutter);

      @media (max-width: 1200px) {
        display: none;
      }

      div {
        a {
          display: block;
        }
      }

      a.active {
        // text-decoration: underline;
      }
    }
	}

  strong {
    font-family: var(--alt);
  }

  .logo {
    font-size: 1rem;
    color: var(--highlight);
  }
</style>