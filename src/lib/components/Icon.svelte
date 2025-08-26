<script lang="ts">
  export let i: string
	export let small: boolean = false
	export let big: boolean = false

  export let rotate: number = undefined
</script>


<svg class:small class:big version="1.1" viewBox="0 0 16 16" style={rotate && `transform: rotate(${rotate}deg)`}>
  {#if i === 'share'}
  <path d="M12 5.33337C13.1046 5.33337 14 4.43794 14 3.33337C14 2.2288 13.1046 1.33337 12 1.33337C10.8954 1.33337 10 2.2288 10 3.33337C10 4.43794 10.8954 5.33337 12 5.33337Z" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 14.6666C13.1046 14.6666 14 13.7712 14 12.6666C14 11.5621 13.1046 10.6666 12 10.6666C10.8954 10.6666 10 11.5621 10 12.6666C10 13.7712 10.8954 14.6666 12 14.6666Z" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.72656 9.00671L10.2799 11.66" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.2732 4.33997L5.72656 6.9933" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
  {:else if i === 'download'}
  <path d="M13.6 9.8667V12.3556C13.6 12.6856 13.4689 13.0022 13.2355 13.2355C13.0022 13.4689 12.6856 13.6 12.3556 13.6H3.64447C3.31442 13.6 2.99789 13.4689 2.76451 13.2355C2.53114 13.0022 2.40002 12.6856 2.40002 12.3556V9.8667" stroke-width="1.55556" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.88904 6.75557L8.00015 9.86668L11.1113 6.75557" stroke-width="1.55556" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 9.86667V2.4" stroke-width="1.55556" stroke-linecap="round" stroke-linejoin="round"/>
  {:else if i === 'chevron'}
  <path d="M6 12L10 8L6 4" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  {:else if i === 'menu'}
  <path d="M2 8H14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 4H14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 12H14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  {:else if i === 'close'}
  <path d="M12 4L4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 4L12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  {/if}
</svg>

<style>
  svg {
    height: 1.25em;
    width: 1.25em;
		vertical-align: middle;
  }

	svg.small {
    height: 0.88em;
    width: 0.88em;
  }

	svg.big {
    height: 2.5em;
    width: 2.5em;
  }

  path {
    stroke: currentColor;
    fill: none;
  }
</style>