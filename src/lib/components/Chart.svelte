

<script lang="ts">
  import type { Entry } from 'contentful'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'

  import { color, Label, percent, Root } from '@amcharts/amcharts5'
  import { createCourbe, createHistogramme, createPyramide, createTarte, csvToChartData } from '$lib/charts'
  import { Exporting, ExportingMenu } from '@amcharts/amcharts5/plugins/exporting'
  import type { Chart } from '@amcharts/amcharts5/.internal/core/render/Chart'
  import type { XYChart } from '@amcharts/amcharts5/xy'
  import { region } from '$lib/stores'


  let chart: Chart
  let element: HTMLElement
  let observer: IntersectionObserver

  export let exporting: Exporting

  export let id: string
  export let titre: string
  export let sources: any
  export let categorie: Entry<Categorie>
  export let data: string
  export let type: string
  export let minimum: number
  export let maximum: number
  export let titreDeLaxe: string
  export let couleur: string
  export let small: boolean = false

  const dataSource = csvToChartData(data)


  function createChart() {
    observer?.disconnect()

    switch (type) {
      case 'Histogramme':
        chart = createHistogramme(element, dataSource, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break

      case 'Courbe':
        chart = createCourbe(element, dataSource, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break

      case 'Pyramide':
        chart = createPyramide(element, dataSource, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break
      
      case 'Tarte':
        chart = createTarte(element, dataSource, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break
    
      default:
        break
    }

    if (chart) {
      exporting = Exporting.new(chart._root, {
        filePrefix: id,
        dataSource
        // menu: ExportingMenu.new(chart._root, {})
      })

      if ($page.query.has("export")) {
        chart.setAll({
          width: percent(50),
          centerX: percent(-50)
        })
        if (sources) chart.chartContainer.children.push(Label.new(chart._root, {
          width: percent(100),
          centerX: percent(48),
          text: documentToPlainTextString(sources),
          fontSize: '0.75em',
          oversizedBehavior: "wrap",
          maxWidth: 666,
          paddingTop: 20
        }))
        
        chart.chartContainer.children.unshift(Label.new(chart._root, {
          width: percent(100),
          centerX: percent(48),
          text: titre,
          fontSize: '1.25em',
          oversizedBehavior: "wrap",
          paddingBottom: 33,
        }))

        chart.chartContainer.children.unshift(Label.new(chart._root, {
          width: percent(100),
          centerX: percent(48),
          text: categorie.fields.titre,
          fill: color(categorie.fields.couleur),
          fontSize: '1.5em',
        }))

        chart.chartContainer.children.push(Label.new(chart._root, {
          width: percent(100),
          centerX: percent(-48),
          y: percent(95),
          text: `© indicateurs.quebec/indicateurs/${id}`,
          fontSize: '0.75em',
          textAlign: "right"
        }))
      }
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

  $: { 
    if (chart && $region) {
      if ((chart as XYChart).series) {
        (chart as XYChart).series.each(serie => {
          if ($region === 'Tout' || serie._settings.name === $region) {
            serie.show()
          } else {
            serie.hide()
          }
        })
      }
    }
  }
</script>

<figure class:small bind:this={element}></figure>

<style lang="scss">
  figure {
    width: 100%;
    padding-bottom: 100%;
    margin: var(--gutter) 0 0;
  }

  // figure.small {
  //   height: max(20vh, 20vw);
  // }

  // @media (max-width: 1400px) {
  //    figure.small {
  //     height: max(30vh, 30vw);
  //   }
  // }

  // @media (max-width: 1000px) {
  //    figure.small {
  //     height: max(40vh, 40vw);
  //   }
  // }

  // @media (max-width: 800px) {
  //    figure.small {
  //     height: max(50vh, 50vw);
  //   }
  // }
</style>