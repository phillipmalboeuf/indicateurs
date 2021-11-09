<script lang="ts">
  import type { Asset } from 'contentful'
  import Picture from './Picture.svelte'

  export let media: Asset
</script>

<figure>
  <Picture {media} ar={1 / 2} />
  <figcaption>
    <slot />
  </figcaption>
</figure>

<style lang="scss">
  figure {
    height: 66vh;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  figure :global(img),
  figure :global(video) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;

    z-index: -1;
    opacity: 0.3;
  }
</style>