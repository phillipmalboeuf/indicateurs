<script lang="ts">
  import type { Asset, Entry } from 'contentful'
  import Document from '../document/Document.svelte'
  import Picture from '../Picture.svelte'
    import type { TypeLogosSkeleton } from '$lib/clients/content_types';

  export let entry: Entry<TypeLogosSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <nav>
  {#each entry.fields.logos as logo}
  <a href={logo.fields.title} target="_blank">
    <Picture media={logo} small />
  </a>
  {/each}
  </nav>

  <hr>
</section>

<style lang="scss">
  section {
    // max-width: calc(var(--width) / 1.5);

    hr {
      margin: var(--gutter) 0;
    }
  }

  nav {
    display: flex;
    column-gap: var(--gutter);
    row-gap: calc(var(--gutter) / 2);
    flex-wrap: wrap;
    align-items: center;
    margin: var(--gutter) 0;

    :global(img) {
      background-color: var(--light);
      width: 14vw;
      height: 14vw;
      padding: var(--gutter);
      object-fit: contain;
      border-radius: 50%;
    }
  }
</style>