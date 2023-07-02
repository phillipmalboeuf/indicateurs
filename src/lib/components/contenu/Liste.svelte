<script lang="ts">
  import type { Entry } from 'contentful'
  import Document from '../document/Document.svelte'
  import type { TypeListeSkeleton } from '$lib/clients/content_types'

  export let entry: Entry<TypeListeSkeleton>
</script>

<section id={entry.fields.id}>
  <Document body={entry.fields.corps} />

  <ul>
    {#each entry.fields.items as item}
    <li>
      <h4>{item.fields.titre}</h4>
      <Document body={item.fields.corps} />
    </li>
    {/each}
  </ul>
  <!-- <hr> -->
</section>

<style lang="scss">
  section {
    max-width: calc(var(--width) / 1.75);

    ul {
      list-style: none;
      padding: 0;
      margin-bottom: calc(var(--gutter) * 2);
    }

    li {
      margin-bottom: var(--gutter);
      font-size: 1.5rem;
      font-weight: bold;
    }

    h4 {
      font-size: 2.5rem;
      font-weight: normal;
      color: currentColor;
      margin: 0;
    }
  }
</style>