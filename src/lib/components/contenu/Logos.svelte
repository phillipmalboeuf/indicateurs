<script lang="ts">
  import type { Asset, Entry, RichTextContent } from 'contentful'
  import Document from '../document/Document.svelte'
  import Picture from '../Picture.svelte'

  export let entry: Entry<{
    titre: string
    id: string
    corps: RichTextContent
    logos: Asset[]
  }>
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <nav style="grid-template-columns: repeat({entry.fields.logos.length < 3 ? entry.fields.logos.length : 3}, 1fr);">
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
    max-width: calc(var(--width) / 2);

    hr {
      margin: var(--gutter) 0;
    }
  }

  nav {
    display: grid;
    column-gap: var(--gutter);
    row-gap: calc(var(--gutter) / 2);
    flex-wrap: wrap;
    align-items: center;
    margin: var(--gutter) 0;

    :global(img) {
      width: auto;
    }
  }
</style>