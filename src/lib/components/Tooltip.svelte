<script lang="ts">
  import Icon from './Icon.svelte'

  export let top: boolean = false
  export let right: boolean = false
  export let visible: boolean = false
  export let light: boolean = false
</script>


<span class:visible>
  <slot name="tip" />

  <div class:top class:right class:light>
    <!-- <Icon i="chevron" /> -->
    <div>
      <slot name="tool" />
    </div>
  </div>
</span>



<style lang="scss">
  span {
    position: relative;

    &:hover,
    &:focus,
    &:focus-within,
    &.visible {

      > div {
        pointer-events: auto;
        opacity: 1;
      }
    }

    > div {
      position: absolute;
      z-index: 5;
      top: 100%;
      left: 50%;
      min-width: 16rem;
      pointer-events: none;
      opacity: 0;
      padding-top: 0.5rem;
      transform: translateX(-50%);

      > :global(svg) {
        position: absolute;
        top: -3px;
        left: 50%;
        transform: translateX(-50%) rotate(-90deg);

        > :global(path) {
          fill: var(--dark);
          stroke: none;
          stroke-width: 1px;
          stroke-linecap: butt;
        }
      }

      > div {
        background: var(--dark);
        border-radius: 0.66rem;
        border: var(--border);
        box-shadow: var(--shadow);
        padding: 0.88rem;
      }

      &.light {
        > div {
          background: var(--darkish);
        }

        :global(path) {
          fill: var(--darkish);
        }
      }

      &.top {
        top: auto;
        bottom: 100%;
        padding-top: 0;
        padding-bottom: 0.5rem;

        > div {
          border: var(--border);
        }

        > :global(svg) {
          top: auto;
          bottom: -4px;
          transform: translateX(-50%) rotate(90deg);

          > :global(path) {
            stroke: var(--light);
          }
        }
      }

      &.right {
        top: auto;
        bottom: 100%;
        left: auto;
        right: 0;
        transform: translateX(0);
        // padding-top: 0;
        padding-bottom: 0.5rem;

        > div {
          border: var(--border);
        }

        > :global(svg) {
          top: auto;
          bottom: -4px;
          transform: translateX(0%) rotate(90deg);
        }
      }
    }
  }
</style>

