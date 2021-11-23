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
    padding: calc(var(--gutter) / 2) var(--gutter) 0;
    // background: var(--dark);

    @media (max-width: 888px) {
      padding: calc(var(--gutter) / 2) 0 0;
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
      column-gap: calc(var(--gutter) / 2);
    }

    hr {
      margin-bottom: 0;
      margin-top: calc(var(--gutter) / 2);
    }

    &:before {
      content: "";
      background: transparent;
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
      height: calc(var(--gutter) * 1.75);
      width: 100%;
    }

    &.stuck {
      // background-color: var(--dark);

      &:before {
        background: var(--dark);
      }
    }
  }
</style>