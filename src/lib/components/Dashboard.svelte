<script lang="ts">
  import { page } from '$app/stores'

  import type { Entry, Asset } from 'contentful'
  import Picture from './Picture.svelte'
  import type { TypeDashSkeleton } from '$lib/clients/content_types'

  export let dashboard: Entry<TypeDashSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
</script>


<section>
  <nav>
    {#each dashboard as dash}
    <a href={((!dash.fields.externe && $page.params.locale === 'en') ? "/en" : "") + dash.fields.lien}
      target={dash.fields.externe && '_blank'}
      style="grid-column-start: {dash.fields.colStart}; grid-column-end: {dash.fields.colEnd}; grid-row-start: {dash.fields.rowStart}; grid-row-end: {dash.fields.rowEnd};">
      <figure class:emphasis={dash.fields.emphasis} class:bleu={dash.fields.bleu}>
        {#if dash.fields.image}<Picture media={dash.fields.image} small />{/if}
        <figcaption>
          <h3>{dash.fields.titre}</h3>
          {#if dash.fields.text}
          <p>{dash.fields.text}</p>
          {/if}
        </figcaption>
      </figure>
    </a>
    {/each}
  </nav>
</section>

<style lang="scss">
  section {
    // max-width: var(--width);
    margin: var(--gutter) auto 0;

    @media (max-width: 1100px) {
      // display: none;
    }
  }

  nav {
    display: grid;
    min-height: 85vh;
    column-gap: calc(var(--gutter) / 2);
    row-gap: calc(var(--gutter) / 2);
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 888px) {
      grid-template-columns: 1fr;

      a {
        grid-column-start: 1 !important;
        grid-column-end: 2 !important;
        grid-row-start: auto !important;
        grid-row-end: auto !important;

        min-height: 16vh;
      }
    }
  }

  figure {
    position: relative;
    overflow: hidden;
    padding: calc(var(--gutter) / 2);
    background-color: var(--darkish);
    border-radius: calc(var(--corner) / 2);
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

    &:not(.bleu) {
      padding: calc(var(--gutter) * 1.5) calc(var(--gutter) / 1);
      color: var(--light);
      background-color: var(--darkish);

      a:hover &,
      a:focus & {
        color: var(--highlight);
      }

      &:not(.emphasis) {
        text-align: center;
      }

      &.emphasis {
        background-color: white;
        color: black;

        a:hover &,
        a:focus & {
          color: var(--emphasis);
        }
      }
    }

    :global(img),
    :global(video) {
      position: absolute;
      left: auto;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 95%;
      object-fit: contain;
      object-position: bottom right;
      z-index: 0;

      @media (max-width: 888px) {
        object-fit: contain;
        width: auto;
      }
    }
  }

    figcaption {
      position: relative;
      // font-family: var(--alt);
      // font-size: 1.88rem;
      // font-weight: bold;
      // width: 90%;
    }
</style>
