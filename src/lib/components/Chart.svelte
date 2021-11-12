<script context="module" lang="ts">
  

</script>


<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Root } from '@amcharts/amcharts5'
  import { createCourbe, createHistogramme, createPyramide, createTarte } from '$lib/charts'
  import { Exporting, ExportingMenu } from '@amcharts/amcharts5/plugins/exporting'
  import type { Chart } from '@amcharts/amcharts5/.internal/core/render/Chart'

  let chart: Chart
  let element: HTMLElement
  let observer: IntersectionObserver
  let exporting: Exporting

  export let id: string
  export let data: string
  export let type: string
  export let minimum: number
  export let maximum: number
  export let titreDeLaxe: string
  export let couleur: string
  export let small: boolean = false


  function createChart() {
    observer?.disconnect()

    switch (type) {
      case 'Histogramme':
        chart = createHistogramme(element, data, minimum, maximum, titreDeLaxe, couleur)
        break

      case 'Courbe':
        chart = createCourbe(element, data, minimum, maximum, titreDeLaxe, couleur)
        break

      case 'Pyramide':
        chart = createPyramide(element, data, minimum, maximum, titreDeLaxe, couleur)
        break
      
      case 'Tarte':
        chart = createTarte(element, data, minimum, maximum, titreDeLaxe, couleur)
        break
    
      default:
        break
    }

    if (chart) {
      exporting = Exporting.new(chart._root, {
        filePrefix: id
        // menu: ExportingMenu.new(chart._root, {})
      })
    }
  }
  

  onMount(() => {
    observer = new IntersectionObserver( 
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            createChart()
          }
        })
      },
      { threshold: [0] }
    )


    observer.observe(element)
  })

  onDestroy(() => {
    observer?.disconnect()
    chart?._root.dispose()
  })
</script>

<figure class:small bind:this={element}></figure>
<aside>
  <a href="/indicateurs/{id}"><small>Plus d'info</small></a>
  {#if exporting}<button on:click={() => exporting.download('png')} aria-label="Télécharger">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </button>{/if}
</aside>

<style lang="scss">
  figure {
    height: 50vh;
    margin: var(--gutter) 0 0;
  }

  figure.small {
    height: max(20vh, 20vw);
  }

  aside {
    color: var(--muted);
    display: flex;
    justify-content: space-between;
  }

  button {
    border: none;
    background: transparent;

    &:hover,
    &:focus {
      color: var(--highlight);
    }
  }

  @media (max-width: 1400px) {
     figure.small {
      height: max(30vh, 30vw);
    }
  }

  @media (max-width: 1000px) {
     figure.small {
      height: max(40vh, 40vw);
    }
  }

  @media (max-width: 800px) {
     figure.small {
      height: max(50vh, 50vw);
    }
  }
</style>