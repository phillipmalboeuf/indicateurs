<script context="module" lang="ts">
  import type { Entry } from 'contentful'
</script>

<script lang="ts">
  import Tooltip from './Tooltip.svelte'
  import { page } from '$app/stores'
  import Link from './Link.svelte'
  import Menu from './Menu.svelte'
  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'

	export let path: string
  export let navigation: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<header>
  <div>
    <a href={$page.params.locale === 'en' ? "/en" : "/"} class="logo">
      <svg width="1em" height="1.1em" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 59.9606C24 57.1992 26.2386 54.9606 29 54.9606H51C53.7614 54.9606 56 57.1991 56 59.9606V112H24V59.9606Z" fill="#F1D268"/>
<path d="M72 32C72 29.2386 74.2386 27 77 27H99C101.761 27 104 29.2386 104 32V112H72V32Z" fill="#F1D268"/>
</svg>
      <strong>{$page.params.locale === 'en' ? 'The Indicators' : 'Les Indicateurs'}</strong>
    </a>
  </div>
  <nav>
    {#each navigation.fields.liens as lien}
    {#if lien.fields.sousLiens?.length > 0}
    <Tooltip light>
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

  <div class="right">
    <a class="locale" href={$page.params.locale === 'en' ? "/" : "/en"} hreflang={$page.params.locale === 'en' ? 'fr' : 'en'}><strong>{$page.params.locale === 'en' ? "FR" : "EN"}</strong></a>
    <Menu {navigation} {path} />
  </div>
</header>


<style lang="scss">
	header {
    flex: 1;
    position: relative;
    z-index: 8;
    // max-width: var(--width);
    margin: 0 auto;
    height: 48px;
    //background: var(--dark);    
    display: flex;
    justify-content: center;
    align-items: center;

    padding: var(--gutter) calc(var(--gutter) * 2);

    @media (max-width: 888px) {
      a.locale {
        display: none;
      }
    }

    div {
      flex: 1;
    }

    .right {
      display: flex;
      justify-content: flex-end;

      @media (max-width: 888px) {
        flex: 0;
      }
    }

    nav {
      display: grid;
      grid-auto-flow: column;
      font-size: 0.88rem;
      letter-spacing: 0.02rem;
      column-gap: 50px;

      @media (max-width: 888px) {
        display: none;
      }

      div {
        :global(a) {
          padding: 4px;
          letter-spacing: 0.02rem;
          display: block;
        }
      }
    }
	}

  strong {
    font-family: var(--alt);
  }

  .logo {
    font-size: 1rem;
    // color: var(--highlight);

    svg {
      vertical-align: text-top;
    }
  }
</style>