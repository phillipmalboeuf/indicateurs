<script context="module" lang="ts">
  import type { Entry } from 'contentful'
  import type { Lien } from './Header.svelte'
</script>

<script lang="ts">
	export let path: string
  export let navigation: Entry<{ liens: Entry<Lien>[] }>
  export let subnavigation: Entry<{ liens: Entry<Lien>[] }>
</script>

<footer>
  <nav>
    {#each navigation.fields.liens as lien}
    <div>
      <a class:active={path.includes(lien.fields.lien)} href={lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>

      {#if lien.fields.sousLiens}
      {#each lien.fields.sousLiens as l}
      <a href={l.fields.lien} target={lien.fields.externe && '_blank'}>{l.fields.titre}</a>
      {/each}
      {/if}
    </div>
    {/each}
  </nav>

  <hr>

  <nav>
    <div>© 2021, Les Indicateurs. Tous droits réservés.</div>
    {#each subnavigation.fields.liens as lien}
    <div>
      <a class:active={path.includes(lien.fields.lien)} href={lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>

      {#if lien.fields.sousLiens}
      {#each lien.fields.sousLiens as l}
      <a href={l.fields.lien} target={lien.fields.externe && '_blank'}>{l.fields.titre}</a>
      {/each}
      {/if}
    </div>
    {/each}
  </nav>
</footer>


<style lang="scss">
	footer {

    nav {
      width: 100%;
      max-width: var(--width);
      margin: 0 auto;

      padding: var(--gutter);

      display: flex;
      justify-content: space-between;
      column-gap: var(--gutter);

      @media (max-width: 888px) {
        flex-direction: column;
      }

      a {
        display: block;
        margin-bottom: 1rem;
      }

      div > a:first-child {
        font-weight: bold;
      }

      div:first-child > a:first-child {
        color: var(--highlight);
        font-family: var(--alt);
      }

      a.active {
        // text-decoration: underline;
      }
    }

    nav:last-child {
      font-size: 0.88rem;
      opacity: 0.5;

      div:first-child {
        width: 50%;
      }

      div > a:first-child {
        font-weight: normal;
      }
    }
	}
</style>