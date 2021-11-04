<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { SerialChart } from '@amcharts/amcharts4/charts'
  import { createCourbe, createHistogramme, createTarte } from '$lib/charts'

  let chart: SerialChart
  let element: HTMLElement
  let image: string

  export let id: string
  export let data: string
  export let type: string
  export let minimum: number
  export let maximum: number
  export let titreDeLaxe: string
  export let couleur: string
  export let small: boolean = false

  onMount(() => {
    switch (type) {
      case 'Histogramme':
        chart = createHistogramme(element, data, minimum, maximum, titreDeLaxe, couleur)
        break

      case 'Courbe':
        chart = createCourbe(element, data, minimum, maximum, titreDeLaxe, couleur)
        break

      case 'Pyramide':
        chart = createCourbe(element, data, minimum, maximum, titreDeLaxe, couleur)
        break
      
      case 'Tarte':
        chart = createTarte(element, data, minimum, maximum, titreDeLaxe, couleur)
        break
    
      default:
        break
    }

    chart?.exporting.getImage("png").then(function(imgData) {
      image = imgData
    })
  })

  onDestroy(() => {
    chart?.dispose()
  })
</script>

<figure class:small bind:this={element}></figure>
{#if image}<a download="{id}.png" href={image}>Export</a>{/if}

<style>
  figure {
    height: 50vh;
    margin: var(--gutter) 0 0;
  }

  figure.small {
    height: 15vw;
  }
</style>