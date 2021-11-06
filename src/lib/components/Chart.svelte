<script context="module" lang="ts">
  

</script>


<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Root } from '@amcharts/amcharts5'
  import { createCourbe, createHistogramme, createTarte } from '$lib/charts'
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

      // case 'Pyramide':
      //   chart = createCourbe(element, data, minimum, maximum, titreDeLaxe, couleur)
      //   break
      
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
{#if exporting}<button on:click={() => exporting.download('png')}>Export</button>{/if}

<style>
  figure {
    height: 50vh;
    margin: var(--gutter) 0 0;
  }

  figure.small {
    height: 15vw;
  }
</style>