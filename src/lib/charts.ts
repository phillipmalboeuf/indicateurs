export function csvToChartData(data: string) {
  return csvToArray(data, data.includes('\t') ? '\t' : ',')
}

function csvToArray(str: string, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter)

  const rows = str.slice(str.indexOf("\n") + 1).split("\n")
  // `'${values[index].substring(2)}`
  const arr = rows.map(function (row) {
    const values = row.split(delimiter)
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index] === "" ? null : values[index]
      return object
    }, {})
    return el
  })

  return arr;
}

import { Bullet, Circle, Color, color, Container, DataProcessor, Label, Legend, LinearGradient, LinePattern, percent, Picture, Root, Scrollbar, Theme, Tooltip } from '@amcharts/amcharts5'
import { XYChart, ValueAxis, CategoryAxis, AxisRendererX, ColumnSeries, AxisRendererY, LineSeries, AxisLabel, XYCursor, SmoothedXLineSeries } from '@amcharts/amcharts5/xy'
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark"
import am5locales_fr from "@amcharts/amcharts5/locales/fr_FR"
import am5locales_en from "@amcharts/amcharts5/locales/en_CA"
import { FunnelSeries, PieChart, PieSeries, PyramidSeries, SlicedChart } from '@amcharts/amcharts5/percent'
import type { iHSL } from '@amcharts/amcharts5/.internal/core/util/Utils'
import { region, regions as colors, extraRegions, regionsEnglish } from './stores'

export function init(element: HTMLElement, locale: string) {
  let root = Root.new(element)
  root._logo.dispose()

  const myTheme = Theme.new(root);

  myTheme.rule("Label").setAll({
    fill: color("#908F92"),
    fontSize: "0.88em"
  })

  root.locale = locale === 'en' ? am5locales_en : am5locales_fr

  root.setThemes([
    am5themes_Animated.new(root),
    am5themes_Dark.new(root),
    myTheme
  ]);

  return root
}

export function createHistogramme(element: HTMLElement, seriesData: any[], min: number, max: number, title: string, couleur: string, locale: string) {
  let root = init(element, locale)
  let chart = root.container.children.push(
    XYChart.new(root, {
      panY: false,
      layout: root.verticalLayout,
      paddingLeft: 0,
      paddingRight: 0,
    })
  )

  let yAxis = chart.yAxes.push(
    ValueAxis.new(root, {
      min,
      max,
      renderer: AxisRendererY.new(root, {})
    })
  )
  yAxis.get("renderer").labels.template.setAll({
    centerY: percent(90),
    centerX: title ? -30 : 0,
    inside: true
  })

  if (min > 0) {
    yAxis.labelsContainer.children.push(Label.new(root, {
      text: 'tronqué',
      y: percent(100),
      x: -50,
      fontSize: '0.66em'
    }))
  }
  
  title && chart.leftAxesContainer.children.push(Label.new(root, {
    text: title,
    rotation: -90,
    y: percent(50),
    centerX: percent(50),
    fontSize: '0.75em',
    fill: color('#EDF5E2')
  }))

  let xAxis = chart.xAxes.push(
    CategoryAxis.new(root, {
      renderer: AxisRendererX.new(root, {
        minGridDistance: 30
      }),
      categoryField: "Date",
    })
  )
  xAxis.get("renderer").labels.template.setAll({
    paddingTop: 10
  })
  xAxis.get("renderer").labels.template.adapters.add("text", function(text, target) {
    //@ts-ignore
    return target.dataItem ? `‘${target.dataItem?._settings.category.substring(2)}` : text
  })
  xAxis.data.setAll(seriesData)

  let subs = {}
  let regions = {}
  
  const keys = Object.keys(seriesData[0]).filter(key => !['Date', 'Région'].includes(key))

  keys.forEach((name, i) => {
    let hsl: iHSL = color(colors[name.split('–')[0]] || couleur).toHSL()
    if (name.includes('–')) {
      const [region, s] = name.split('–')
      // hsl.h += Object.keys(regions).length * 0.05
      
      if (regions[region]) {
        hsl.l -= Object.keys(subs).length * 0.1
        if (!subs[s]) {
          subs[s] = hsl.l
        }
      } else {
        regions[region] = true
        subs = { [s]: hsl.l }
      }
    } else {
      // hsl.h += i * 0.05
    }
    
    let gradient = LinearGradient.new(root, {
      stops: [{
        color: Color.fromHSL(hsl.h, hsl.s, hsl.l)
      }, {
        color: Color.fromHSL(hsl.h, hsl.s, hsl.l),
        opacity: 0
      }]
    });

    let tooltip = Tooltip.new(root, {})
    tooltip.get("background").setAll({
      strokeOpacity: 0
    })

    let series = chart.series.push(ColumnSeries.new(root, {
      name,
      xAxis,
      yAxis,
      valueYField: name,
      categoryXField: "Date",
      // stacked: hsl.h !== color(couleur).toHSL().h,
      tooltip,
    }))

    series.columns.template.setAll({
      fillGradient: gradient,
      fill: Color.fromHSL(hsl.h, hsl.s, hsl.l),
      // stroke: Color.fromHSL(hsl.h, hsl.s, hsl.l),
      strokeOpacity: 0,
      width: percent(88),
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      ...i > 0 && {
        cornerRadiusBL: 6,
        cornerRadiusBR: 6,
      },
      // fillOpacity: 1 - (i * 0.1),
      tooltipText: `${keys.length > 1 ? '{name}, ' : ''}{categoryX}: {valueY}`
    })

    series.data.processor = DataProcessor.new(root, {
      numericFields: [name]
    })
    
    series.data.setAll(seriesData)
  })

  if (Object.keys(subs).length > 1) {
    let legend = chart.children.push(Legend.new(root, {
      // nameField: "name",
      // fillField: "color",
      x: percent(100),
      centerX: percent(100),
      clickTarget: "none"
    }))
    legend.labels.template.setAll({
      fill: color('#EDF5E2')
    })
    legend.valueLabels.template.set("forceHidden", true)
    let c = color(colors['Québec']).toHSL()
    legend.data.setAll(Object.keys(subs).map(s => ({
      name: s,
      color: Color.fromHSL(c.h, c.s, subs[s])
    })))
  }

  chart.zoomOutButton.set("forceHidden", true)

  return chart
}

export function createCourbe(element: HTMLElement, seriesData: any[], min: number, max: number, title: string, couleur: string, locale: string) {
  let root = init(element, locale)
  let chart = root.container.children.push(
    XYChart.new(root, {
      panY: false,
      layout: root.verticalLayout,
      paddingLeft: 0,
      paddingRight: 0,
    })
  )

  let yAxis = chart.yAxes.push(
    ValueAxis.new(root, {
      min,
      max,
      renderer: AxisRendererY.new(root, {})
    })
  )
  yAxis.get("renderer").labels.template.setAll({
    centerY: percent(90),
    centerX: title ? -30 : 0,
    inside: true
  })

  if (min > 0) {
    yAxis.labelsContainer.children.push(Label.new(root, {
      position: 'absolute',
      text: 'tronqué',
      y: percent(100),
      x: -30,
      fontSize: '0.66em',
    }))
  }
  
  title && chart.leftAxesContainer.children.push(Label.new(root, {
    text: title,
    rotation: -90,
    y: percent(50),
    centerX: percent(50),
    fontSize: '0.75em',
    fill: color('#EDF5E2')
  }))

  let xAxis = chart.xAxes.push(
    CategoryAxis.new(root, {
      renderer: AxisRendererX.new(root, {
        minGridDistance: 55,
        
      }),
      categoryField: "Date",
    })
  )
  xAxis.get("renderer").labels.template.setAll({
    // centerX: percent(0),
    paddingTop: 10
  })
  xAxis.get("renderer").labels.template.adapters.add("text", function(text, target) {
    //@ts-ignore
    return target.dataItem ? target.dataItem?._settings.category.split('-').map(c => `‘${c.substring(2)}`).join('-') : text
  })
  xAxis.data.setAll(seriesData)

  let bottomContainer = Container.new(root, {
    x: percent(100),
    y: percent(100),
    centerX: percent(100),
    centerY: percent(100),
    layer: 100,
  })

  chart.plotContainer.children.push(bottomContainer)

  let subs = {}
  let regions = {}
  const keys = Object.keys(seriesData[0]).filter(key => !['Date', 'Région'].includes(key))

  keys.forEach((name, i) => {
    const region = name.split('–')[0]
    let hsl: iHSL = color(colors[region] || couleur).toHSL()

    if (name.includes('–')) {
      const [region, s] = name.split('–')
      // hsl.h += Object.keys(regions).length * 0.05
      
      if (regions[region]) {
        hsl.l -= Object.keys(subs).length * 0.05
        if (!subs[s]) {
          subs[s] = hsl.l
        }
      } else {
        regions[region] = true
        subs = { [s]: hsl.l }
      }
    } else {
      // hsl.h += i * 0.05
    }

    let tooltip = Tooltip.new(root, {
      labelText: `${keys.length > 1 ? '{name}, ' : ''}{categoryX}: {valueY}`,
      animationDuration: 0,
      pointerOrientation: "horizontal",
    })
    tooltip.get("background").setAll({
      strokeOpacity: 0
    })
    
    let series = chart.series.push(SmoothedXLineSeries.new(root, {
      name,
      xAxis,
      yAxis,
      valueYField: name,
      categoryXField: "Date",
      fill: Color.fromHSL(hsl.h, hsl.s, hsl.l),
      stroke: Color.fromHSL(hsl.h, hsl.s, hsl.l),
      tooltip,
      connect: true
    }))

    series.strokes.template.setAll({
      // stroke: color(couleur),
      strokeWidth: 3,
      ...extraRegions[region] && {
        // strokeDasharray: 10,
        // strokeDashoffset: -30
        // strokeGradient: LinearGradient.new(root, {
        //   rotation: 0,
        //   stops: [{
        //     color: color(extraRegions[region])
        //   }, {
        //     color: Color.fromHSL(hsl.h, hsl.s, hsl.l)
        //   }]
        // })
        // strokePattern: LinePattern.new(root, {
        //   fill: Color.fromHSL(hsl.h, hsl.s, hsl.l),
        //   color: color(extraRegions[region]),
        //   rotation: 90,
        //   strokeWidth: 3,
        //   width: 200,
        //   height: 200
        // })
        strokeWidth: 2,
        shadowColor: color(extraRegions[region]),
        // shadowBlur: 10,
        // shadowOffsetX: -3,
        shadowOffsetY: 4,
      },
    })

    if (colors[region]) {
      let container = Container.new(root, {
        x: -1000,
        y: -1000,
        layer: 100,
        mask: Circle.new(root, {
          radius: 10,
          fill: color(0x000000),
          x: percent(0),
          y: percent(0)
        })
      })

      container.children.push(Picture.new(root, {
        // width: 16*1.625,
        height: 20,
        centerX: percent(50),
        centerY: percent(50),
        src: `/regions/${region.toLowerCase().replace('é', 'e')}.svg`
      }))

      let tooltipBullet = chart.plotContainer.children.push(container)

      series.on("tooltipDataItem", function(tooltipDataItem) {
        var x = -1000;
        var y = -1000;
        if (tooltipDataItem && tooltipDataItem.dataContext[name]) {
          var point = tooltipDataItem.get("point")
          if (point) {
            x = point.x;
            y = point.y;
          }
        }
        tooltipBullet.setAll({
          x: x,
          y: y
        })
      })

      tooltip.on("forceHidden", function(hidden){
        tooltipBullet.set("forceHidden", hidden);
      })

      tooltip.on("opacity", function(opacity){
        tooltipBullet.set("opacity", opacity);
      })
    }

    if (seriesData.filter(data => data[name]).length === 0) {
      let label = Label.new(root, {
        text: locale === 'en' ? `No data for ${regionsEnglish[name]}` : `Aucune données pour ${name}`,
        fontSize: 13,
        opacity: 1,
        fill: color('#9FA1A8')
      })

      bottomContainer.children.push(label)

      tooltip.on("forceHidden", function(hidden){
        label.set("forceHidden", hidden);
      })
    }

    series.data.processor = DataProcessor.new(root, {
      numericFields: [name],
      // emptyAs: null,
    })
    
    series.data.setAll(seriesData)
  })

  chart.set("cursor", XYCursor.new(root, {
    // snapToSeries: chart.series.values
    // tooltipY: percent(-10),
  }))

  let cursor = chart.get("cursor")

  cursor.lineX.setAll({
    visible: false
  })

  cursor.lineY.setAll({
    visible: false
  })

  if (Object.keys(subs).length > 0) {
    let legend = chart.children.push(Legend.new(root, {
      nameField: "name",
      fillField: "color",
      x: percent(100),
      centerX: percent(100),
    }))
    legend.labels.template.setAll({
      fill: color('#fff'),
    })
    legend.itemContainers.template.setAll({
      cursorOverStyle: "pointer"
    })
    legend.itemContainers.template.events.on("click", e => {
      const visible =  e.target.get("opacity") === 1
      e.target.setAll({
        opacity: visible ? 0.25 : 1
      })
      chart.series.each(serie => {
        if (serie.get("opacity") > 0.05 && serie._settings.name.includes((e.target.dataItem.dataContext as {name:string}).name)) {
          serie.getTooltip().setAll({
            forceHidden: visible
          })
          serie.setAll({
            opacity: visible ? 0.25 : 1
          })
        }
      })
    })
    legend.valueLabels.template.set("forceHidden", true)
    let c = color(colors['Québec']).toHSL()
    legend.data.setAll(Object.keys(subs).map(s => ({
      name: s,
      color: Color.fromHSL(c.h, c.s, subs[s])
    })))
  }

  chart.zoomOutButton.set("forceHidden", true)

  return chart
}

export function createPyramide(element: HTMLElement, seriesData: any[], min: number, max: number, title: string, couleur: string, locale: string) {
  let root = init(element, locale)
  let chart = root.container.children.push(
    SlicedChart.new(root, {
      layout: root.verticalLayout,
      paddingLeft: 0,
      paddingRight: 0,
    })
  )
  
  title && chart.seriesContainer.children.push(Label.new(root, {
    text: title,
    rotation: -90,
    y: percent(50),
    centerX: percent(50),
    fontSize: '0.75em',
    fill: color('#EDF5E2')
  }))


  const keys = Object.keys(seriesData[0]).filter(key => !['Date', 'Région'].includes(key))

  keys.forEach((name, i) => {
    let series = chart.series.push(FunnelSeries.new(root, {
      name,
      categoryField: "Date",
      valueField: name,
      orientation: "horizontal",
      alignLabels: false
    }))

    series.data.processor = DataProcessor.new(root, {
      numericFields: [name]
    })
    
    series.data.setAll(seriesData)

    series.slices.template.setAll({
      fill: color(couleur),
      stroke: color(couleur),
      strokeWidth: 3
    })

    series.links.template.setAll({
      fill: color(couleur),
      fillOpacity: 0.66
    })

    series.labels.template.setAll({
      text: "{category}: {value}",
      rotation: 0,
      // inside: false,
      // radius: 10
    });
  })

  return chart
}

export function createTarte(element: HTMLElement, seriesData: any[], min: number, max: number, title: string, couleur: string, locale: string) {
  let root = init(element, locale)
  let chart = root.container.children.push(
    PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: percent(40),
      paddingLeft: 0,
      paddingRight: 0,
    })
  )

  const keys = Object.keys(seriesData[0]).filter(key => !['Date', 'Région', 'Catégorie'].includes(key))

  keys.forEach((name, i) => {
    let series = chart.series.push(PieSeries.new(root, {
      name,
      categoryField: "Catégorie",
      valueField: name,
      alignLabels: false
    }))

    series.data.processor = DataProcessor.new(root, {
      numericFields: [name]
    })
    
    series.data.setAll(seriesData)

    series.slices.template.setAll({
      fill: color(couleur),
      stroke: color(couleur),
      strokeWidth: 3
    })

    series.labels.template.setAll({
      text: "{category}",
      textType: "circular",
      inside: false,
      radius: 10
    });
  })

  return chart
}