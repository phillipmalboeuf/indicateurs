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
  import { page } from '$app/stores'
  import Link from './Link.svelte'
  import Menu from './Menu.svelte'

	export let path: string
  export let navigation: Entry<{
		liens: Entry<Lien>[]
	}>
</script>

<header>
  <a href={$page.params.locale === 'en' ? "/en" : "/"} class="logo"><strong>Les Indicateurs</strong></a>

  <nav>
    {#each navigation.fields.liens as lien}
    {#if lien.fields.sousLiens?.length > 0}
    <Tooltip>
      <Link slot="tip" active={path.includes(lien.fields.lien)} {lien} />

      <div slot="tool">
        {#each lien.fields.sousLiens as l}
        <Link lien={l} />
        {/each}
      </div>
    </Tooltip>
    {:else}
    <Link active={path.includes(lien.fields.lien)} {lien} />
    {/if}
    {/each}
  </nav>

  <div>
    <a class="locale" href={$page.params.locale === 'en' ? "/" : "/en"}><strong>{$page.params.locale === 'en' ? "FR" : "EN"}</strong></a>
    <Menu {navigation} {path} />
  </div>
</header>


<style lang="scss">
	header {
    position: relative;
    z-index: 8;
    max-width: var(--width);
    margin: 0 auto;
    height: 48px;
    
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: var(--gutter);

    @media (max-width: 980px) {
      a.locale {
        display: none;
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
      @media (max-width: 888px) {
        display: none;
      }

      div {
        :global(a) {
          // font-size: 0.88rem;
          padding: 4px;
          letter-spacing: 0.02rem;
          display: block;
        }
      }
    }
	}

  strong {
    // font-size: 0.88rem;
    font-family: var(--alt);
  }

  .logo {
    font-size: 1rem;
    color: var(--highlight);
  }
</style>