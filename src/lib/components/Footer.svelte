<script context="module" lang="ts">
  import type { Asset, Entry } from 'contentful'
</script>

<script lang="ts">
  import Link from './Link.svelte'
  import Picture from './Picture.svelte'
  import { page } from '$app/stores'
  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'

	export let path: string
  export let navigation: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let subnavigation: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let logo: Asset<"WITHOUT_UNRESOLVABLE_LINKS">
</script>

<footer>
  <nav>
    {#each navigation.fields.liens as lien}
    <div>
      <Link active={path.includes(lien.fields.lien)} {lien} />

      {#if lien.fields.sousLiens}
      {#each lien.fields.sousLiens as l}
      {#if l.fields.lien?.includes('g15plus.quebec')}
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
    <div>© 2022, {$page.params.locale === 'en' ? "The Indicators. All rights reserved" : "Les Indicateurs. Tous droits réservés."}</div>
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
      // max-width: var(--width);
      margin: 0 auto;

      font-size: 0.88rem;

      padding: var(--gutter) calc(var(--gutter) * 2);

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
      justify-content: flex-start;
      padding: calc(var(--gutter) / 2) calc(var(--gutter) * 2);

      // div:first-child {
      //   width: 50%;
      // }

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