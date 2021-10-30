<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { color, Container, create, createFromConfig, percent, Sprite, Tooltip } from "@amcharts/amcharts4/core"
  import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, ValueAxis, RadarChart, RadarSeries, RadarColumnSeries, PieChart, PieSeries } from "@amcharts/amcharts4/charts"

  let chart: PieChart
  let element: HTMLElement
  let image: string

  const donut = {
    'Out': {
      'Qualité de l’air et climat': 100,
      'Utilisation des terres': 20,
      'Eau': 10,
      'Biodiversité': 10,
      'Soutenabilité': 30,
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
      'Emploi': 5,
      'Innovation': 5,
      'Talent et compétences': 5,
    }
  }

  function renderChart(category: string, height?) {
    let series = chart.series.push(new PieSeries())

    series.data = Object.keys(donut[category]).map(sousCatégorie => ({
        [category]: sousCatégorie,
        value: 1,
        radiusValue: donut[category][sousCatégorie]
      })).flat()

    series.dataFields.value = "value"
    series.dataFields.radiusValue = "radiusValue"
    series.dataFields.category = category

    // series.height = percent(height)

    // if(height) { series.radius = height}

    series.ticks.template.disabled = true;
    series.alignLabels = false;
    series.labels.template.inside = true
    series.labels.template.text = "{category}"
    series.labels.template.bent = true
    series.labels.template.contentValign = 'bottom'

    series.slices.template.stroke = color("#fff");
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
    series.colors.step = 2;

    series.tooltip.disabled = true
    series.interactionsEnabled = false
  }

  onMount(() => {

    chart = create(element, PieChart)
    chart.logo.disabled = true

    chart.innerRadius = percent(30)
    

    
    renderChart('In')
    renderChart('Plancher', percent(1))
    renderChart('Milieu')
    renderChart('Plafond', percent(1))
    renderChart('Out')
    // renderChart('Économie')


    chart.exporting.getImage("png").then(function(imgData) {
      image = imgData
    })
  })

  onDestroy(() => {
    chart?.dispose()
  })
</script>

<figure bind:this={element}></figure>
{#if image}<a download="download.png" href={image}>Export</a>{/if}

<style>
  figure {
    height: 50vh;
  }
</style>