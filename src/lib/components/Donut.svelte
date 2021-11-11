<script lang="ts">
  import { color, Graphics, Label, Percent, percent, Root } from '@amcharts/amcharts5'
  import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'

  import { onMount, onDestroy } from 'svelte'

  import type { Entry } from 'contentful'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import { Exporting } from '@amcharts/amcharts5/plugins/exporting'

  export let categories: Entry<Categorie>[]
  let root: Root
  let element: HTMLElement
  let exporting: Exporting

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
      'PLAFOND ENVIRONNEMENTAL': 10,
    },
    'Milieu': {
      'Espace sûr et juste pour l\'humanité': 10,
      'Développment économique inclusif et durable': 10,
    },
    'Plancher': {
      'PLANCHER ÉCONOMIQUE ET SOCIAL': 10,
    },
    'In': {
      'Prospérité': 12,
      'Innovation': 5,
      'Emploi': -10,
      'Talent et compétences': 5,
      'Pauvreté': 5,
      'Qualité de vie': 5,
      'Santé et sécurité': 5,
      'Logement': 5,
      'Égalité': 7,
      'Culture': 5
    }
  }

  onMount(() => {
    root = Root.new(element)
    root._logo.dispose()

    let chart = root.container.children.push(
      PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: percent(15),
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      })
    )
    
    renderChart(chart, 'In', percent(0), percent(33), true)
    renderChart(chart, 'Plancher', percent(35), percent(45))
    renderChart(chart, 'Milieu', percent(45), percent(63))
    renderChart(chart, 'Plafond', percent(63), percent(73))
    renderChart(chart, 'Out', percent(75), percent(100))

    renderArrow(chart, 'Dépassement', 0, 100)
    renderArrow(chart, 'Insuffisance', 180, 73)

    exporting = Exporting.new(root, {
      filePrefix: 'donut'
      // menu: ExportingMenu.new(chart._root, {})
    })
  })

  function renderArrow(chart: PieChart, text: string, rotation: number, x: number) {
    chart.chartContainer.children.push(Graphics.new(root, {
      fill: color('#FB3F3F'),
      stroke: color('#1D1F27'),
      strokeWidth: 4,
      position: 'absolute',
      x: percent(x - 12),
      centerX: percent(50),
      y: percent(50),
      scale: 1.2,
      centerY: percent(50),
      rotation,
      svgPath: "M235.789 0L288 34.5L235.789 69V59.7516H0L17.5076 34.5L0 9.24837H235.789V0Z"
    }))

    chart.chartContainer.children.push(Label.new(root, {
      text,
      fill: color('#EDF5E2'),
      fontFamily: 'PP Neue Machina',
      fontWeight: 'bold',
      fontSize: '1.66em',
      position: 'absolute',
      x: percent(x),
      centerX: percent(150),
      y: percent(50),
      centerY: percent(50)
    }))
  }


  function renderChart(chart: PieChart, name: string, innerRadius: number | Percent, radius: number | Percent, inverted?: boolean) {
    const data = Object.keys(donut[name]).map(key => ({
      Catégorie: key,
      Valeur: donut[name][key],
      Width: 1,
      template: {
        // ...inverted ? { dInnerRadius: -donut[name][key] } : { dRadius: donut[name][key] },
        fill: color(categories.find(c => c.fields.titre === key)?.fields.couleur || {
          'Plafond': '#EDF5E2',
          'Plancher': '#E2EEF5'
        }[name] || '#FFF')
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
      ...({
        'Plafond': {
          startAngle: -270,
          endAngle: 90,
        },
        'Plancher': {
          startAngle: -270,
          endAngle: 90,
        }
        }[name] || {
          startAngle: 0,
          endAngle: 360,
        }),
      
      interactiveChildren: false
    }))


    series.slices.template.setAll({
      // fill: color('#069550'),
      stroke: color('#1D1F27'),
      strokeWidth: 4,
      toggleKey: "disabled",
      // tooltipPosition: "pointer",
      templateField: "template"
    })

    series.labels.template.setAll({
      fontSize: '1.66em',
      text: "{category}",
      textType: inverted ? "radial" : "circular",
      centerX: percent(100),
      radius: {
        'Plafond': 25,
        'Milieu': 50,
        'Plancher': 20,
        'Out': 75
      }[name],
      inside: true,
      fontFamily: {
          'Plafond': 'PP Neue Machina',
          'Plancher': 'PP Neue Machina'
        }[name] || 'PP Neue Montreal',
      fontWeight: 'bold',
      fill: color({
          'Plafond': '#1D2723',
          'Milieu': '#1D2723',
          'Plancher': '#231D27'
        }[name] || '#fff'),
      oversizedBehavior: "wrap",
      maxWidth: 220,
      textAlign: inverted ? 'left' : 'center'
    });

    series.data.setAll(data)
  }

  onDestroy(() => {
    root?.dispose()
  })
</script>

<figure bind:this={element}></figure>
{#if exporting}<button on:click={() => exporting.download('png')}>Export</button>{/if}

<style>
  figure {
    margin: 0;
    height: 100vw;
    pointer-events: none;
  }
</style>