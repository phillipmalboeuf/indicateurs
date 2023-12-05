<script lang="ts">
  import type { Entry } from 'contentful'
  import type { TypeTextSkeleton } from '$lib/clients/content_types'

  import Document from '../document/Document.svelte'

  export let entry: Entry<TypeTextSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <!-- <hr> -->
</section>

<style lang="scss">
  section {
    max-width: calc(var(--width) / 1.75);

    hr {
      margin: var(--gutter) 0;
    }
  }
</style>