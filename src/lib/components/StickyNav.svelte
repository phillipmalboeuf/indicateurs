<script lang="ts">
  export let dark = false
</script>

<nav class:dark>
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

    &.dark {
      background-color: var(--dark);
    }

    font-size: 0.88rem;

    max-width: var(--width);
    margin: 0 auto;
    padding: calc(var(--gutter) / 2) calc(var(--gutter) / 1) 0;

    @media (max-width: 888px) {
      padding: calc(var(--gutter) / 2) 0 0;
    }

    position: sticky;
    top: 0;
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

    // &:before {
    //   content: "";
    //   background: var(--dark);
    //   position: fixed;
    //   z-index: -1;
    //   top: 0;
    //   left: 0;
    //   height: calc(var(--gutter) * 2.2);
    //   width: 100%;
    // }
  }
</style>