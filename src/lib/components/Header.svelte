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
	export let path: string
  export let navigation: Entry<{
		liens: Entry<Lien>[]
	}>
</script>

<header>
  <a href="/" class="logo"><strong>Les Indicateurs</strong></a>

  <nav>
    {#each navigation.fields.liens as lien}
    <a class:active={path.includes(lien.fields.lien)} href={lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>
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

      a {
        // text-transform: uppercase;
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