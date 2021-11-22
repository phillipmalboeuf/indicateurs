<script lang="ts">
  import type { Asset } from 'contentful'
  import { onMount } from 'svelte'
  import Picture from './Picture.svelte'

  export let media: Asset

  let scrollY: number
  let height: number

  onMount(() => {
    height = window.innerHeight / 2
  })
</script>

<svelte:window bind:scrollY on:resize={() => height = window.innerHeight / 2} />

<figure style="--opacity: {((height - scrollY) / height) || 1}">
  <Picture {media} ar={1 / 2} />
  <figcaption>
    <slot />
  </figcaption>
</figure>

<style lang="scss">
  figure {
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      content: "";
      z-index: -1;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(180deg, transparent, var(--dark));
    }
  }

  figcaption {
    // max-width: calc(var(--width) / 2);
  }

  figure :global(img),
  figure :global(video) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;

    z-index: -2;
    opacity: calc(0.5 * var(--opacity));
  }
</style>