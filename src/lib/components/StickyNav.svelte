<script lang="ts">
  import { onMount } from 'svelte'

  let stuck: boolean
  let nav: HTMLElement

  onMount(() => {
    const observer = new IntersectionObserver( 
			([e]) => stuck = e.intersectionRatio < 1,
			{ threshold: [1] }
		)

		observer.observe(nav)
  })

</script>

<nav class:stuck bind:this={nav}>
  <div>
    <slot name="left" />
  </div>

  <div>
    <slot name="right" />
  </div>

  <hr>
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--gutter);
    flex-wrap: wrap;

    font-size: 0.88rem;

    max-width: var(--width);
    margin: 0 auto;
    padding: 1rem calc(var(--gutter) / 1) 0;

    @media (max-width: 888px) {
      padding: 1rem 0 0;
    }

    position: sticky;
    top: -1px;
    z-index: 4;

    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      margin-bottom: 0;
    }

    > div,
    > div > :global(div) {
      display: flex;
      align-items: center;
      column-gap: calc(var(--gutter) / 2);
    }

    hr {
      margin-bottom: 0;
      margin-top: 1rem;
    }

    &:before {
      content: "";
      background: transparent;
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
      height: 3.88rem;
      width: 100%;
      border: 2px solid var(--color);

      transition: background-color 100ms;

      @media (max-width: 888px) {
        // height: calc(var(--gutter) * 3);
      }
    }

    &.stuck {
      // background-color: var(--dark);

      &:before {
        background: var(--dark);
      }
    }
  }
</style>