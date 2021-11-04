function csvToChartData(data: string) {
  return csvToArray(data)
}

function csvToArray(str: string, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter)

  const rows = str.slice(str.indexOf("\n") + 1).split("\n")

  const arr = rows.map(function (row) {
    const values = row.split(delimiter)
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index]
      return object
    }, {})
    return el
  })

  return arr;
}

import { color, create, createFromConfig, percent, Sprite, Tooltip } from "@amcharts/amcharts4/core"
import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, PieChart, PieSeries, SerialChart, ValueAxis, XYChart, XYCursor } from "@amcharts/amcharts4/charts"

export function createHistogramme(element: HTMLElement, data: string, minimum: number, maximum: number, title: string, couleur: string) {
  let chart = create(element, XYChart)
  chart.logo.disabled = true
  chart.data = csvToChartData(data)

  let categoryAxis = chart.xAxes.push(new CategoryAxis())
  categoryAxis.dataFields.category = "Date"

  let valueAxis = chart.yAxes.push(new ValueAxis())
  valueAxis.title.text = title

  valueAxis.min = minimum
  valueAxis.max = maximum

  const keys = Object.keys(chart.data[0]).filter(key => !['Date', 'Région'].includes(key))

  keys.forEach((key, i) => {
    let series = chart.series.push(new ColumnSeries())
    series.dataFields.valueY = key
    series.name = key
    series.dataFields.categoryX = "Date"
    series.columns.template.tooltipText = `${key}: {categoryX}: {valueY}`

    series.columns.template.fill = color(couleur, 1 - (i * 0.1))
    series.columns.template.strokeWidth = 0

    if (keys.length > 1) { series.stacked = true }
  })

  if (keys.length > 1) {
    chart.legend = new Legend()
  }

  return chart
}

export function createCourbe(element: HTMLElement, data: string, minimum: number, maximum: number, title: string, couleur: string) {
  let courbe = create(element, XYChart)
  courbe.logo.disabled = true
  courbe.data = csvToChartData(data)

  let categoryAxis = courbe.xAxes.push(new CategoryAxis())
  categoryAxis.dataFields.category = "Date"

  let valueAxis = courbe.yAxes.push(new ValueAxis())
  valueAxis.title.text = title

  valueAxis.min = minimum
  valueAxis.max = maximum


  const keys = Object.keys(courbe.data[0]).filter(key => !['Date', 'Région'].includes(key))

  keys.forEach((key, i) => {
    let series = courbe.series.push(new LineSeries())
    series.dataFields.valueY = key
    series.name = key
    series.dataFields.categoryX = "Date"
    series.tooltipText = `${key}: {categoryX}: {valueY}`
    series.strokeWidth = 6
    series.strokeLinecap = 'round'
    series.stroke = color(couleur, 1 - (i * 0.1))
  })

  // courbe.cursor = new XYCursor()

  if (keys.length > 1) {
    courbe.legend = new Legend()
  }

  return courbe
}

export function createTarte(element: HTMLElement, data: string, minimum: number, maximum: number, title: string, couleur: string) {
  let chart = create(element, PieChart)
  chart.logo.disabled = true
  chart.data = csvToChartData(data)
  
  // let categoryAxis = courbe.xAxes.push(new CategoryAxis())
  // categoryAxis.dataFields.category = "Date"

  // let valueAxis = courbe.yAxes.push(new ValueAxis())
  // valueAxis.title.text = title

  // valueAxis.min = minimum
  // valueAxis.max = maximum

  chart.innerRadius = percent(40)


  const keys = Object.keys(chart.data[0]).filter(key => !['Date', 'Région', 'Catégorie'].includes(key))

  keys.forEach((key, i) => {
    let series = chart.series.push(new PieSeries())
    series.dataFields.value = key
    series.name = key
    series.dataFields.category = "Catégorie"
    series.alignLabels = false;
    // series.labels.template.inside = true
    series.labels.template.text = "{category}"
    series.labels.template.bent = true
    series.slices.template.fill = color(couleur, 1 - (i * 0.1))

    series.slices.template.stroke = color("#fff");
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
  })

  // // courbe.cursor = new XYCursor()

  // if (keys.length > 1) {
  //   courbe.legend = new Legend()
  // }

  return chart
}