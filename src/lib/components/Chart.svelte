

<script lang="ts">
  import type { Entry } from 'contentful'
  import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'

  import { color, Label, percent } from '@amcharts/amcharts5'
  import { createCourbe, createHistogramme, createPyramide, createTarte, csvToChartData } from '$lib/charts'
  import { Exporting, ExportingMenu } from '@amcharts/amcharts5/plugins/exporting'
  import type { XYChart, XYSeries } from '@amcharts/amcharts5/xy'
  import type { Chart } from '@amcharts/amcharts5/.internal/core/render/Chart'
  import { region, regions } from '$lib/stores'
  
  import type { TypeCategorieSkeleton } from '$lib/clients/content_types'

  let chart: Chart
  let series: XYSeries[]
  let element: HTMLElement
  let observer: IntersectionObserver

  export let exporting: Exporting = undefined

  export let id: string
  export let titre: string
  export let sources: any = undefined
  export let categorie: Entry<TypeCategorieSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let data: string = undefined
  export let type: string = undefined
  export let minimum: number = undefined
  export let maximum: number = undefined
  export let titreDeLaxe: string = undefined
  export let couleur: string = undefined
  export let small: boolean = false
  export let only: string = undefined

  function createChart() {
    observer?.disconnect()

    const dataSource = csvToChartData(data)
    const dataFiltered = only ? dataSource.map(line => ({
      Date: line['Date'],
      ...Object.keys(line).filter(key => key.includes(only)).reduce((l, key) => {
        return {
          ...l,
          [key]: line[key]
        }
      }, {})
    })) : dataSource

    switch (type) {
      case 'Histogramme':
        chart = createHistogramme(element, dataFiltered, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break

      case 'Courbe':
        chart = createCourbe(element, dataFiltered, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break

      case 'Pyramide':
        chart = createPyramide(element, dataFiltered, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break
      
      case 'Tarte':
        chart = createTarte(element, dataFiltered, minimum, maximum, titreDeLaxe, couleur, $page.params.locale)
        break
    
      default:
        break
    }

    if (chart) {
      series = [...(chart as XYChart).series]
      exporting = Exporting.new(chart._root, {
        filePrefix: id,
        dataSource
        // menu: ExportingMenu.new(chart._root, {})
      })

      // if ($page.url.searchParams.has("export")) {
      //   chart.setAll({
      //     width: percent(90),
      //     centerX: percent(0)
      //   })
      //   if (sources) chart.chartContainer.children.push(Label.new(chart._root, {
      //     width: percent(100),
      //     centerX: percent(0),
      //     text: documentToPlainTextString(sources),
      //     fontSize: '0.75em',
      //     oversizedBehavior: "wrap",
      //     maxWidth: 666,
      //     paddingTop: 20
      //   }))
        
      //   chart.chartContainer.children.unshift(Label.new(chart._root, {
      //     width: percent(100),
      //     centerX: percent(0),
      //     text: titre,
      //     fontSize: '1.25em',
      //     oversizedBehavior: "wrap",
      //     paddingBottom: 33,
      //   }))

      //   chart.chartContainer.children.unshift(Label.new(chart._root, {
      //     width: percent(100),
      //     centerX: percent(0),
      //     text: categorie.fields.titre,
      //     fill: color(categorie.fields.couleur),
      //     fontSize: '1.5em',
      //   }))

      //   chart.chartContainer.children.push(Label.new(chart._root, {
      //     width: percent(100),
      //     centerX: percent(-0),
      //     y: percent(95),
      //     text: `© indicateurs.quebec/indicateurs/${id}`,
      //     fontSize: '0.75em',
      //     textAlign: "right"
      //   }))
      // }
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
      if (series && series.find(serie => serie._settings.name.split('–')[0] === "Québec")) {
        (chart as XYChart).series.each(serie => {
          if ($region.includes(serie._settings.name.split('–')[0])) {
            serie.show(0)
            serie.getTooltip().setAll({
              forceHidden: false
            })
            // serie.setAll({
            //   opacity: 1
            // })
          } else {
            serie.hide(0)
            serie.getTooltip().setAll({
              forceHidden: true
            })
            // serie.setAll({
            //   opacity: 0.05
            // })
          }
        })
      }
    }
  }
</script>

<figure class:small bind:this={element}></figure>

<style lang="scss">
  figure {
    display: block;
    width: 100%;
    padding-bottom: 100%;
    margin: var(--gutter) 0 0;
  }

  figure.small {
    padding-bottom: 66%;
  }

  @media (max-width: 800px) {
    figure.small {
      padding-bottom: 100%;
    }
  }
</style>