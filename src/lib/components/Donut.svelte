<script lang="ts">
  import { color, Percent, percent, Root } from '@amcharts/amcharts5'
  import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'
  import { RadarChart, RadarColumnSeries } from '@amcharts/amcharts5/radar'

  import { onMount, onDestroy } from 'svelte'
  // import { color, Container, create, createFromConfig, percent, Sprite, Tooltip } from "@amcharts/amcharts4/core"
  // import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, ValueAxis, RadarChart, RadarSeries, RadarColumnSeries, PieChart, PieSeries } from "@amcharts/amcharts4/charts"

  import type { Entry } from 'contentful'
  import type { Categorie } from '$routes/categories/[id].svelte'

  export let categories: Entry<Categorie>[]
  let root: Root
  let element: HTMLElement
  let image: string

  const donut = {
    'Out': {
      'Biodiversité': 10,
      'Mobilité durable': 10,
      'Utilisation des terres': 20,
      'Soutenabilité': 100,
      'Énergie': 10,
      'Eau': 10,
      'Qualité de l’air et climat': 10,
    },
    'Plafond': {
      'Plafond environnemental': 10
    },
    'Milieu': {
      'Espace sûr et juste pour l\'humanité': 10,
      'Développment économique inclusif et durable': 10,
    },
    'Plancher': {
      'Plancher économique et social': 10
    },
    'In': {
      'Talent et compétences': 5,
      'Emploi': -10,
      'Innovation': 5,
      'Prospérité': 12,
      'Pauvreté': 5,
      'Qualité de vie': 5,
      'Santé et sécurité': 5,
      'Logement': 5,
      'Égalité': 7,
      'Culture': 5
    }
  }

  function renderChart(chart: PieChart, name: string, innerRadius: number | Percent, radius: number | Percent, inverted?: boolean) {
    const data = Object.keys(donut[name]).map(key => ({
      Catégorie: key,
      Valeur: donut[name][key],
      Width: 1,
      template: {
        // ...inverted ? { dInnerRadius: -donut[name][key] } : { dRadius: donut[name][key] },
        fill: color(categories.find(c => c.fields.titre === key)?.fields.couleur || '#1C47A4')
      }
    }))

    let series = chart.series.push(PieSeries.new(root, {
      name,
      categoryField: "Catégorie",
      idField: "Catégorie",
      valueField: "Width",
      alignLabels: false,
      radius,
      innerRadius,
      startAngle: 0,
      endAngle: 360,
      interactiveChildren: false
      // radius: percent(radius),
      // innerRadius: percent(radius)
    }))

    // console.log(data)
    // series.slices
    
    // series.slices.template.adapters.add("dInnerRadius", (arc, target) => {
    //   console.log(target.uid)
    //   console.log(series.dataItems)
    //   // target.dataItem
    //   return series.dataItems.find(i => i.uid === target.uid).dataContext['Valeur']
    // })
    

    series.slices.template.setAll({
      // fill: color('#069550'),
      stroke: color('#1D1F27'),
      strokeWidth: 3,
      toggleKey: "disabled",
      // tooltipPosition: "pointer",
      templateField: "template",
      shiftRadius: 0
    })

    series.labels.template.setAll({
      text: "{category}",
      textType: inverted ? "radial" : "circular",
      centerX: percent(100),
      inside: true,
      fill: color('#fff'),
      oversizedBehavior: "wrap",
      maxWidth: 150,
      textAlign: inverted ? 'left' : 'center'
    });

    series.data.setAll(data)
  }

  onMount(() => {
    root = Root.new(element)
    root._logo.dispose()

    let chart = root.container.children.push(
      PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: percent(20)
      })
    )
    

    
    renderChart(chart, 'In', percent(0), percent(35), true)
    renderChart(chart, 'Plancher', percent(35), percent(45))
    renderChart(chart, 'Milieu', percent(45), percent(65))
    renderChart(chart, 'Plafond', percent(65), percent(75))
    renderChart(chart, 'Out', percent(75), percent(100))
    // renderChart('Économie')


    // chart.exporting.getImage("png").then(function(imgData) {
    //   image = imgData
    // })
  })

  onDestroy(() => {
    root?.dispose()
  })
</script>

<figure bind:this={element}></figure>
{#if image}<a download="download.png" href={image}>Export</a>{/if}

<style>
  figure {
    margin: 0;
    height: 100vw;
    pointer-events: none;
  }
</style>