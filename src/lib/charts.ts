function csvToChartData(data: string) {
  return Object.entries(csvToArray(data)[0]).map(([date, value]) => ({ date, value }))
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

import { color, create, createFromConfig, Sprite, Tooltip } from "@amcharts/amcharts4/core"
import { CategoryAxis, ColumnSeries, Cursor, Legend, LineSeries, SerialChart, ValueAxis, XYChart, XYCursor } from "@amcharts/amcharts4/charts"

export function createHistogramme(element: HTMLElement, data: string, minimum: number, maximum: number) {
  let chart = create(element, XYChart)
  chart.logo.disabled = true
  chart.data = csvToChartData(data)

  let categoryAxis = chart.xAxes.push(new CategoryAxis())
  categoryAxis.dataFields.category = "date"
  // categoryAxis.title.text = "Date"

  let valueAxis = chart.yAxes.push(new ValueAxis())
  // valueAxis.title.text = "Value"

  valueAxis.min = minimum
  valueAxis.max = maximum

  let series = chart.series.push(new ColumnSeries())
  series.dataFields.valueY = "value"
  series.dataFields.categoryX = "date"
  // series.name = "Sales"
  series.columns.template.tooltipText = "{categoryX}: {valueY}"

  // series.columns.template.fill = color("#104547")
  // series.columns.template.stroke = color("transparent")

  return chart
}

export function createCourbe(element: HTMLElement, data: string, minimum: number, maximum: number) {
  let courbe = create(element, XYChart)
  courbe.logo.disabled = true
  courbe.data = csvToChartData(data)

  let histogrammeCategoryAxis = courbe.xAxes.push(new CategoryAxis())
  histogrammeCategoryAxis.dataFields.category = "date"
  // categoryAxis.title.text = "Date"

  let histogrammeValueAxis = courbe.yAxes.push(new ValueAxis())
  // valueAxis.title.text = "Value"

  histogrammeValueAxis.min = minimum
  histogrammeValueAxis.max = maximum

  let series = courbe.series.push(new LineSeries())
  series.dataFields.valueY = "value"
  series.dataFields.categoryX = "date"
  // series.name = "Sales"
  // series.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}"
  series.strokeWidth = 6
  series.strokeLinecap = 'round'

  return courbe
}
