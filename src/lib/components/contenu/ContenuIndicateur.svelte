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
    aprs: RichTextContent
    indicateurs: Entry<Indicateur>[]
  }>
</script>

<section id={entry.fields.id}>
  <div>
    <Document body={entry.fields.corps} />
  </div>

  <figure>
    {#if entry.fields.indicateurs}
    <Indicateurs indicateurs={entry.fields.indicateurs} />
    {/if}
  </figure>

  {#if entry.fields.aprs}
  <div>
    <Document body={entry.fields.aprs} />
  </div>
  {/if}
</section>

<style lang="scss">
  div {
    max-width: calc(var(--width) / 1.5);
    margin-bottom: calc(var(--gutter) * 2);
  }

  figure {
    background: var(--dark);
    margin: 0 -20vw calc(var(--gutter) * 2);

    @media (max-width: 888px) {
      margin-left: 0;
    }
  }
</style>