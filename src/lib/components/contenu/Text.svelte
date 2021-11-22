<script lang="ts">
  import type { Entry, RichTextContent } from 'contentful'
  import Document from '../document/Document.svelte'

  export let entry: Entry<{
    titre: string
    id: string
    corps: RichTextContent
  }>
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <hr>
</section>

<style lang="scss">
  section {
    max-width: calc(var(--width) / 1.75);

    hr {
      margin: var(--gutter) 0;
    }
  }
</style>