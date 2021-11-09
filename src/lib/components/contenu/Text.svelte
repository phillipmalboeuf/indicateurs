<script lang="ts">
  import type { Entry, RichTextContent } from 'contentful'
  import Document from '../document/Document.svelte'

  export let text: Entry<{
    titre: string
    id: string
    corps: RichTextContent
  }>
</script>

<section id={text.fields.id}>
  <Document body={text.fields.corps} />
</section>

<hr>

<style lang="scss">
  
</style>