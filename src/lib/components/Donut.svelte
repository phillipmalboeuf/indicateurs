<script lang="ts">
  import { color, Percent, percent, Root } from '@amcharts/amcharts5'
  import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'
  import { RadarChart, RadarColumnSeries } from '@amcharts/amcharts5/radar'

  import { onMount, onDestroy } from 'svelte'
  // import { color, Container, create, createFromConfig, percent, Sprite, Tooltip } from "@amcharts/amcharts4/core"
  // import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, ValueAxis, RadarChart, RadarSeries, RadarColumnSeries, PieChart, PieSeries } from "@amcharts/amcharts4/charts"

  let root: Root
  let element: HTMLElement
  let image: string

  const donut = {
    'Out': {
      'Qualité de l’air et climat': 10,
      'Utilisation des terres': 20,
      'Eau': 10,
      'Biodiversité': 10,
      'Soutenabilité': 100,
      'Énergie': 10,
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
      'Logement': 5,
      'Pauvreté': 5,
      'Santé et sécurité': 5,
      'Qualité de vie': 5,
      'Égalité': 7,
      'Culture': 5,
      'Prospérité': 12,
      'Emploi': -10,
      'Innovation': 5,
      'Talent et compétences': 5,
    }
  }

  function renderChart(chart: PieChart, name: string, innerRadius: number | Percent, radius: number | Percent, inverted?: boolean) {
    const data = Object.keys(donut[name]).map(key => ({
      Catégorie: key,
      Valeur: donut[name][key],
      Width: 1,
      template: {
        ...inverted ? { dInnerRadius: -donut[name][key] } : { dRadius: donut[name][key] },
        fill: color('#069550')
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
      // radius: percent(radius),
      // innerRadius: percent(radius)
    }))

    console.log(data)
    // series.slices
    
    // series.slices.template.adapters.add("dInnerRadius", (arc, target) => {
    //   console.log(target.uid)
    //   console.log(series.dataItems)
    //   // target.dataItem
    //   return series.dataItems.find(i => i.uid === target.uid).dataContext['Valeur']
    // })
    

    series.slices.template.setAll({
      // fill: color('#069550'),
      stroke: color('#fff'),
      strokeWidth: 2,
      toggleKey: "disabled",
      tooltipPosition: "pointer",
      templateField: "template"
    })

    series.labels.template.setAll({
      text: "{category}",
      textType: "circular",
      inside: true,
      fill: color('#fff'),
      oversizedBehavior: "wrap",
      maxWidth: 20
    });

    series.data.setAll(data)
  }

  onMount(() => {
    root = Root.new(element)
    root._logo.dispose()

    let chart = root.container.children.push(
      PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: percent(20),
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
    height: 50vh;
  }
</style>