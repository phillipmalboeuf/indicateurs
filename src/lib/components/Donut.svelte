<script lang="ts">
  import { color, Graphics, Label, Percent, percent, Root, Tooltip } from '@amcharts/amcharts5'
  import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'
  
  import { goto } from '$app/navigation'

  import { onMount, onDestroy } from 'svelte'

  import type { Entry } from 'contentful'
  import type { TypeCategorieSkeleton } from '$lib/clients/content_types'
  import { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import Icon from './Icon.svelte'

  export let categories: Entry<TypeCategorieSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[] = undefined
  let root: Root
  let element: HTMLElement
  export let exporting: Exporting = undefined
  export let locale: string

  const donut = locale === 'en'
  ? {
    'Out': {
      'Sustainable mobility': 10,
      'Biodiversity': 10,
      'Land Use': 20,
      'Sustainability': 100,
      'Energy': 10,
      'Water': 10,
      'Air Quality and Climate': 10,
    },
    'Plafond': {
      'ENVIRONNEMENTAL CEILING': 10,
    },
    'Milieu': {
      'A sustainable and socially just space': 10,
      'Inclusive and sustainable economic policy': 10,
    },
    'Plancher': {
      'ECONOMIC AND SOCIAL FLOOR': 10,
    },
    'In': {
      'Prosperity': 12,
      'Innovation': 5,
      'Employment': -10,
      'Talent and Skills': 5,
      'Poverty': 5,
      'Quality of Life': 5,
      'Health and Safety': 5,
      'Housing': 5,
      'Equality': 7,
      'Culture': 5
    }
  }
  : {
    'Out': {
      'Mobilité durable': 10,
      'Biodiversité': 10,
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
      'Développement économique inclusif et durable': 10,
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

  onMount(async () => {
    categories = (await (await fetch(locale === 'en' ? '/en/categories/json' : '/categories/json')).json()).categories

    root = Root.new(element)
    root._logo.dispose()

    root.setThemes([
      // am5themes_Micro.new(root),
    ]);

    let chart = root.container.children.push(
      PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: percent(15),
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        height: 2000,
        width: 2000,
        scale: element.offsetWidth/2000
      })
    )
    
    renderChart(chart, 'In', percent(0), percent(33), true)
    renderChart(chart, 'Plancher', percent(35), percent(43))
    renderChart(chart, 'Milieu', percent(44), percent(64))
    renderChart(chart, 'Plafond', percent(65), percent(73))
    renderChart(chart, 'Out', percent(75), percent(100))

    renderArrow(chart, locale === 'en' ? 'Excessiveness' : 'Dépassement', 0, 101.5)
    renderArrow(chart, locale === 'en' ? 'Insufficiency' : 'Insuffisance', 180, 71.1)

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
      svgPath: "M235.789 0L288 34.5L235.789 69V59.7516H0L7.5076 34.5L0 9.24837H235.789V0Z"
    }))

    chart.chartContainer.children.push(Label.new(root, {
      text,
      fill: color('#EDF5E2'),
      fontFamily: 'PP Neue Machina',
      fontWeight: 'bold',
      fontSize: '1.66rem',
      position: 'absolute',
      x: percent(x),
      centerX: percent(166),
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
        userData: {
          categorie: categories.find(c => c.fields.titre === key)?.fields.id
        },
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
        },
        }[name] || {
          startAngle: 0,
          endAngle: 360,
        }),
      
      tooltip: Tooltip.new(root, {
        forceHidden: true,
        labelText: `{category}`
      }),
    }))


    series.slices.template.setAll({
      // fill: color('#069550'),
      stroke: color({
        'Milieu': '#fff',
      }[name] || '#1D1F27'),
      strokeWidth: 4,
      templateField: "template",
      cursorOverStyle: "pointer"
    })

    series.slices.template.states.create("hover", {
      shiftRadius: 0,
      scale: 1,
      opacity: 0.88
    })

    series.slices.template.states.create("active", {
      shiftRadius: 0,
    })

    series.slices.template.events.on("click", (e) => {
      if (e.target.get("userData").categorie) {
        goto(`/categories/${e.target.get("userData").categorie}`)
      }
    })

    series.labels.template.setAll({
      fontSize: {
        'Milieu': '2.66rem',
      }[name] || '1.6rem',
      text: "{category}",
      textType: inverted ? "radial" : "circular",
      centerX: percent(100),
      radius: {
        'Plafond': 18,
        'Milieu': 45,
        'Plancher': 13,
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
      maxWidth: 215,
      textAlign: inverted ? 'left' : 'center'
    });

    series.data.setAll(data)
  }

  onDestroy(() => {
    root?.dispose()
  })
</script>

<div>
  <figure bind:this={element}></figure>
  <button on:click={() => exporting?.download('png')} aria-label={"Télécharger"}><Icon i="download" /></button>
</div>

<style>
  div {
    position: relative;
  }

  figure {
    margin: 0;
    width: 100%;
    padding-bottom: 99%;
    /* pointer-events: none; */
  }

  button {
    position: absolute;
    bottom: var(--gutter);
    right: var(--gutter);
  }
</style>