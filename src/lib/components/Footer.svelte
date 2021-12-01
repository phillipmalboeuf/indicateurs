<script context="module" lang="ts">
  import type { Asset, Entry } from 'contentful'
  import type { Lien } from './Header.svelte'
</script>

<script lang="ts">
  import Link from './Link.svelte'
  import Picture from './Picture.svelte'

	export let path: string
  export let navigation: Entry<{ liens: Entry<Lien>[] }>
  export let subnavigation: Entry<{ liens: Entry<Lien>[] }>
  export let logo: Asset
</script>

<footer>
  <nav>
    {#each navigation.fields.liens as lien}
    <div>
      <Link active={path.includes(lien.fields.lien)} {lien} />

      {#if lien.fields.sousLiens}
      {#each lien.fields.sousLiens as l}
      {#if l.fields.lien.includes('g15plus.quebec')}
      <a class="g15plus" href={lien.fields.lien} target='_blank'><Picture media={logo} small /> {l.fields.titre}</a>
      {:else}
      <Link lien={l} />
      {/if}
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
      <Link active={path.includes(lien.fields.lien)} {lien} />

      {#if lien.fields.sousLiens}
      {#each lien.fields.sousLiens as l}
      <Link lien={l} />
      {/each}
      {/if}
    </div>
    {/each}
  </nav>
</footer>


<style lang="scss">
	footer {
    margin-top: calc(var(--gutter) * 2);

    nav {
      width: 100%;
      max-width: var(--width);
      margin: 0 auto;

      font-size: 0.88rem;

      padding: var(--gutter);

      display: flex;
      justify-content: space-between;
      column-gap: var(--gutter);

      @media (max-width: 888px) {
        flex-direction: column;
      }

      :global(a) {
        display: block;
        margin-bottom: 1rem;
      }

      div > :global(a:first-child) {
        font-weight: bold;
      }

      div:first-child > :global(a:first-child) {
        color: var(--highlight);
        font-family: var(--alt);
      }
    }

    nav:last-child {
      font-size: 0.77rem;
      opacity: 0.5;

      div:first-child {
        width: 50%;
      }

      div > :global(a:first-child) {
        font-weight: normal;
      }
    }
	}

  a.g15plus {
    display: flex;
    align-items: center;

    :global(img) {
      width: 2.5rem;
      margin-right: 0.66rem;
    }
  }
</style>