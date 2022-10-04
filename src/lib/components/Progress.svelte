<script lang="ts">
  import { color, Graphics, Label, Percent, percent, Root, Tooltip } from '@amcharts/amcharts5'
  import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'
  
  import { goto } from '$app/navigation'

  import { onMount, onDestroy } from 'svelte'

  import type { Entry } from 'contentful'
  import type { Categorie } from '$routes/categories/[id].svelte'
  import { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import Icon from './Icon.svelte'

  export let categories: Entry<Categorie>[] = undefined
  let root: Root
  let element: HTMLElement
  export let exporting: Exporting = undefined
  export let locale: string
  export let juri: string

  const values = {
    'Québec': {
      'Environnement': {bottom:4, top: 15},
      'Société': {bottom:12, top: 22},
      'Économie': {bottom:11, top: 17},
    },
    'Ontario': {
      'Environnement': {bottom:4, top: 15},
      'Société': {bottom:8, top: 22},
      'Économie': {bottom:9, top: 17},
    },
    'Canada': {
      'Environnement': {bottom:4, top: 15},
      'Société': {bottom:9, top: 22},
      'Économie': {bottom:9, top: 17},
    },
  }
  const donut = locale === 'en'
  ? {
    'Up': {
      'Environment': values[juri]['Environnement'],
      'Society': values[juri]['Société'],
      'Economy': values[juri]['Économie'],
    },
    'Plancher': {
      '': {bottom:1, top:1},
    },
  }
  : {
    'Up': {
      'Environnement': values[juri]['Environnement'],
      'Société': values[juri]['Société'],
      'Économie': values[juri]['Économie'],
    },
    'Plancher': {
      '': {bottom:1, top:1},
    },
  }

  onMount(async () => {
    categories = (await (await fetch(locale === 'en' ? '/en/categories.json' : '/categories.json')).json()).categories

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
    
    renderChart(chart, 'Up', percent(0), percent(89), true, false)
    renderChart(chart, 'Up', percent(0), percent(88), false, true)
    renderChart(chart, 'Plancher', percent(89), percent(92), false, false)
    // renderChart(chart, 'Stable', percent(34), percent(74))
    // renderChart(chart, 'Down', percent(75), percent(100))

    exporting = Exporting.new(root, {
      filePrefix: 'progres',
      backgroundColor: color('#1D1F27')
      // menu: ExportingMenu.new(chart._root, {})
    })
  })

  // A = pi * r ^ 2
  // squareroot(0.5/pi) = r


  function renderChart(chart: PieChart, name: string, innerRadius: number | Percent, radius: number | Percent, back?: boolean, labels?: boolean) {
    const data = Object.keys(donut[name]).map(key => ({
      Catégorie: key,
      Valeur: 1,
      Bottom: donut[name][key].bottom,
      Top: donut[name][key].top,
      Width: 1,
      template: {
        userData: {
          categorie: categories.find(c => c.fields.titre === key)?.fields.id
        },
        scale: back ? 1 : Math.sqrt(donut[name][key].bottom / donut[name][key].top),
        fill: color(back ? '#1D1F27' : categories.find(c => c.fields.titre === key)?.fields.couleur || {
          'Plafond': '#EDF5E2',
          'Plancher': '#E2EEF5'
        }[name] || '#FFF')
      }
    }))

    let series = chart.series.push(PieSeries.new(root, {
      name,
      categoryField: "Catégorie",
      idField: "Catégorie",
      valueField: "Valeur",
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
      stroke: color(back ? '#EDF5E2' : {
        'Milieu': '#fff',
      }[name] || '#1D1F27'),
      strokeWidth: 4,
      templateField: "template",
      cursorOverStyle: "pointer",
    })

    series.slices.template.states.create("active", {
      shiftRadius: 0,
    })

    series.slices.template.events.on("click", (e) => {
      if (e.target.get("userData").categorie) {
        goto(`/categories/${e.target.get("userData").categorie}`)
      }
    })

    series.slices.template.events.on('pointerover', undefined)

    labels && series.labels.template.setAll({
      fontSize: {
        'Milieu': '2.66rem',
        'Plancher': '0rem',
        'Up': '4.66rem',
      }[name] || '2.66rem',
      text: "{category} {Bottom} / {Top}",
      textType: "circular",
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
      textAlign: 'center'
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
    bottom: 0;
    right: 0;
  }
</style>