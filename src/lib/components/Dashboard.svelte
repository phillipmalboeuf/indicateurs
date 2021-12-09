<script lang="ts">
  import { page } from '$app/stores'

  import type { Entry, Asset } from 'contentful'
  import type { Lien } from './Header.svelte'
  import Picture from './Picture.svelte'

  export let dashboard: Entry<Lien & {
    image: Asset
    emphasis: boolean
    colStart: number
    colEnd: number
    rowStart: number
    rowEnd: number
  }>[]
</script>


<section>
  <nav>
    {#each dashboard as dash}
    <a href={((!dash.fields.externe && $page.params.locale === 'en') ? "/en" : "") + dash.fields.lien}
      target={dash.fields.externe && '_blank'}
      style="grid-column-start: {dash.fields.colStart}; grid-column-end: {dash.fields.colEnd}; grid-row-start: {dash.fields.rowStart}; grid-row-end: {dash.fields.rowEnd};">
      <figure class:emphasis={dash.fields.emphasis}>
        {#if dash.fields.image}<Picture media={dash.fields.image} small />{/if}
        <figcaption>{dash.fields.titre}</figcaption>
      </figure>
    </a>
    {/each}
  </nav>
</section>

<style lang="scss">
  section {
    max-width: var(--width);
    margin: var(--gutter) auto 0;

    @media (max-width: 1100px) {
      display: none;
    }
  }

  nav {
    display: grid;
    min-height: 70vh;
    column-gap: calc(var(--gutter) / 2);
    row-gap: calc(var(--gutter) / 2);
    grid-template-columns: repeat(4, 1fr);
  }

  figure {
    position: relative;
    overflow: hidden;
    padding: calc(var(--gutter) / 2);
    background-color: var(--darkish);
    border-radius: var(--corner);
    margin: 0;
    height: 100%;

    &.emphasis {
      background-color: var(--light);
      color: var(--emphasis);

      a:hover &,
      a:focus & {
        color: var(--dark);
      }
    }

    :global(img),
    :global(video) {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  }

    figcaption {
      position: relative;
      // font-family: var(--alt);
      font-size: 1.88rem;
      font-weight: bold;
      width: 90%;
    }
</style>
