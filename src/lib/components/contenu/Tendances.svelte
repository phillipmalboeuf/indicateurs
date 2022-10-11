<script lang="ts">
  import type { Entry, RichTextContent } from 'contentful'
  import Document from '../document/Document.svelte'

  import { color, Color } from '@amcharts/amcharts5'
  import { csvToChartData } from '$lib/charts'

  export let entry: Entry<{
    titre: string
    id: string
    corps: RichTextContent
    data: string
    flecheSeulement: boolean
  }>

  const data: {[key: string]: number}[] = csvToChartData(entry.fields.data)

  function interpolateColor(value: number, values: number[]) {
    return Color.interpolate(value / (value > 0 ? Math.max(...values) : Math.min(...values)), color(value > 0 ? 'rgb(5, 148, 79)' : 'rgb(251, 97, 63)'), color(value > 0 ? 'rgba(5, 96, 58, 1)' : 'rgba(217, 45, 32, 1)'))
  }
</script>

<section id={entry.fields.id}>
  <div>
    <Document body={entry.fields.corps} />
  </div>

  <table>
    {#each data as row, i}
    {#if i === 0 || data[i-1][""] !== row[""]}
    <thead>
      <tr>
        <th colspan={Object.values(row).length}>{row[""]}</th>
      </tr>
    </thead>
    {/if}
    <tbody>
      <tr>
      {#each Object.entries(row) as col, i}
        {#if i > 0}
        <td>
          <article>
            {#if col[1].startsWith("~")}
            <h3 style="color: var(--muted)">{#if !entry.fields.flecheSeulement}{Math.abs(col[1].substring(1))}{/if}</h3>
            {:else}
            <h3 style="color: {interpolateColor(col[1], Object.values(row).splice(1))}">{col[1] > 0 ? "↗︎" : "↘︎"}{#if !entry.fields.flecheSeulement}{Math.abs(col[1])}{/if}</h3>
            {/if}
            <small>{col[0]}</small>
          </article>
        </td>
        {/if}
      {/each}
      </tr>
    </tbody>
    {/each}
  </table>
</section>

<style lang="scss">
  section {

    > div {
      max-width: calc(var(--width) / 1.5);
      margin-bottom: calc(var(--gutter) / 2);
    }
  }

  table {
    width: 100%;
    margin-bottom: calc(var(--gutter));
    
    th {
      text-align: left;
      padding: calc(var(--gutter) / 2) 0;
    }

    td {
      article {
        text-align: center;
        padding: calc(var(--gutter) * 1.33) 0 calc(var(--gutter) * 0.5);
        background-color: var(--darkish );
        border: var(--border);
        border-radius: var(--corner);
        margin-right: calc(var(--gutter) / 2);
        margin-bottom: calc(var(--gutter) / 2);
      }
    }
  }
</style>