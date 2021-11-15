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
  </nav>

  <a href="/"><strong>EN</strong></a>
</header>


<style lang="scss">
	header {
    max-width: var(--width);
    margin: 0 auto;
    height: 48px;
    
    display: flex;
    justify-content: space-between;
    align-items: center;

    //padding: var(--gutter);

    > a {
      flex: 1;
      //width: 10rem;

      &:last-child {
        text-align: right;
      }
    }

    // button {
    //   color: currentColor;
    //   background: none;
    //   border: none;
    //   padding: 0;
    // }

    nav {
      display: flex;
      font-size: 0.88rem;
      letter-spacing: 0.02rem;
      //column-gap: var(--gutter);
      column-gap: 56px;

      // @media (max-width: 1200px) {
      //   display: none;
      // }
      @media (max-width: 980px) {
        display: none;
      }

      div {
        a {
          font-size: 0.88rem;
          padding: 4px;
          letter-spacing: 0.02rem;
          display: block;
        }
      }

      a.active {
        // text-decoration: underline;
      }
    }
	}

  strong {
    font-size: 0.88rem;
    font-family: var(--alt);
  }

  .logo {
    font-size: 1rem;
    color: var(--highlight);
  }
</style>