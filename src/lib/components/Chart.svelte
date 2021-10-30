<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { color, create, createFromConfig, Sprite, Tooltip } from "@amcharts/amcharts4/core"
  import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, ValueAxis, XYChart, XYCursor } from "@amcharts/amcharts4/charts"

  let chart: XYChart
  let element: HTMLElement
  let image: string

  onMount(() => {
    chart = create(element, XYChart)
    chart.logo.disabled = true
    chart.data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    }]

    // chart.legend = new Legend()

    let categoryAxis = chart.xAxes.push(new CategoryAxis())
    categoryAxis.dataFields.category = "country"
    categoryAxis.title.text = "Countries"

    let valueAxis = chart.yAxes.push(new ValueAxis())
    valueAxis.title.text = "Litres sold (M)"

    valueAxis.min = 0
    valueAxis.max = 1000

    // Create series
    let series = chart.series.push(new LineSeries())
    series.dataFields.valueY = "litres"
    series.dataFields.categoryX = "country"
    series.name = "Sales"
    series.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}"
    series.strokeWidth = 6
    series.strokeLinecap = 'round'
    // series.columns.template.fill = color("#104547")
    // series.columns.template.stroke = color("transparent")

    chart.cursor = new XYCursor()

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