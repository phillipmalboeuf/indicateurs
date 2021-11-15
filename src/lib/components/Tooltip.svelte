<script lang="ts">
  export let top: boolean = false
</script>


<span>
  <slot name="tip" />

  <div class:top>
    <slot name="tool" />
  </div>
</span>



<style lang="scss">
  span {
    position: relative;

    &:hover,
    &:focus,
    &:focus-within {

      div {
        pointer-events: auto;
        opacity: 1;
      }
    }
  }
  
    div {
      position: absolute;
      z-index: 2;
      top: 100%;
      //margin-top: 8px;
      left: -1rem;
      width: 14rem;
      background: var(--dark);
      border-radius: 0.66rem;
      padding: 1rem;

      pointer-events: none;
      opacity: 0;
    }
</style>

