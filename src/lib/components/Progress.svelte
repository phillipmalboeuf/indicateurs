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
    'Up': {
      'Environnement': 4/15,
      'Société': 12/22,
      'Économie': 11/17,
    },
    'Plancher': {
      '': 1,
    },
    // 'Stable': {
    //   'Environnement': 9/15,
    //   'Société': 9/22,
    //   'Économie': 4/17,
    // },
    // 'Down': {
    //   'Environnement': 2/15,
    //   'Société': 1/22,
    //   'Économie': 2/17,
    // }
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
    
    renderChart(chart, 'Up', percent(0), percent(88))
    renderChart(chart, 'Plancher', percent(89), percent(92))
    // renderChart(chart, 'Stable', percent(34), percent(74))
    // renderChart(chart, 'Down', percent(75), percent(100))

    exporting = Exporting.new(root, {
      filePrefix: 'progres',
      backgroundColor: color('#1D1F27')
      // menu: ExportingMenu.new(chart._root, {})
    })
  })


  function renderChart(chart: PieChart, name: string, innerRadius: number | Percent, radius: number | Percent, inverted?: boolean) {
    const data = Object.keys(donut[name]).map(key => ({
      Catégorie: key,
      Valeur: donut[name][key],
      Width: 1,
      template: {
        userData: {
          categorie: categories.find(c => c.fields.titre === key)?.fields.id
        },
        scale: donut[name][key],
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
      stroke: color({
        'Milieu': '#fff',
      }[name] || '#1D1F27'),
      strokeWidth: 4,
      templateField: "template",
      cursorOverStyle: "pointer",
    })

    series.slices.template.states.create("hover", {
      shiftRadius: 0,
      // scale: 1,
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
      }[name] || '2.66rem',
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