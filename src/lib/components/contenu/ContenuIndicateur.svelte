<script lang="ts">
  import type { Entry, RichTextContent } from 'contentful'

  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import Document from '../document/Document.svelte'
  import type { Lien } from '../Header.svelte'
import Indicateurs from '../Indicateurs.svelte'

  export let entry: Entry<{
    titre: string
    id: string
    corps: RichTextContent
    indicateurs: Entry<Indicateur>[]
  }>
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <figure>
    {#if entry.fields.indicateurs}
    <Indicateurs indicateurs={entry.fields.indicateurs} />
    {/if}
  </figure>
</section>

<style lang="scss">
  figure {
    background: var(--dark);
    margin-left: -16vw;
    margin-bottom: calc(var(--gutter) * 2);
  }

</style>