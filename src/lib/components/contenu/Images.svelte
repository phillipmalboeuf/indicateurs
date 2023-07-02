<script lang="ts">
  import type { Asset, Entry } from 'contentful'

  import Document from '../document/Document.svelte'
  import Indicateurs from '../Indicateurs.svelte'
  import Picture from '../Picture.svelte'
  import type { TypeImagesSkeleton } from '$lib/clients/content_types'

  export let entry: Entry<TypeImagesSkeleton>
</script>

<section id={entry.fields.id}>
  <div>
    <Document body={entry.fields.corps} />
  </div>

  {#if entry.fields.images}
  <figure style="grid-template-columns: repeat({entry.fields.images.length < 4 ? entry.fields.images.length : 4}, 1fr);">
    {#each entry.fields.images as media}
    <Picture {media} />
    {/each}
  </figure>
  {/if}

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
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--gutter);
    row-gap: var(--gutter);

    // background: var(--dark);
    margin: 0 -10vw calc(var(--gutter) * 2);

    @media (max-width: 888px) {
      margin: 0 0 calc(var(--gutter) * 2);
    }
  }
</style>