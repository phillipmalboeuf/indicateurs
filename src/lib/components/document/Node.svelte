<script lang="ts">
  import Card from '../Card.svelte';

  // import Chart from '../Chart.svelte'
  import Picture from '../Picture.svelte'
  import Mark from './Mark.svelte'

  export let node
  export let id: string
</script>

{#if node.nodeType === 'heading-1'}
  <h1 class="slow"><div>{#each node.content as mark}<Mark mark={mark} />{/each}</div></h1>
{:else if node.nodeType === 'heading-2'}
  <h2>{#each node.content as mark}<Mark mark={mark} />{/each}</h2>
{:else if node.nodeType === 'heading-3'}
  <h3 id={`${id}-${node.content.map(mark => mark.value)}`}>{#each node.content as mark}<Mark mark={mark} />{/each}</h3>
{:else if node.nodeType === 'heading-4'}
  <h4>{#each node.content as mark}<Mark mark={mark} />{/each}</h4>
{:else if node.nodeType === 'heading-5'}
  <h5>{#each node.content as mark}<Mark mark={mark} />{/each}</h5>
{:else if node.nodeType === 'heading-6'}
  <h6>{#each node.content as mark}<Mark mark={mark} />{/each}</h6>
{:else if node.nodeType === 'paragraph'}
  <p>{#each node.content as mark}<Mark mark={mark} />{/each}</p>
{:else if node.nodeType === 'hr'}
  <hr />

{:else if node.nodeType === 'unordered-list'}
  <ul>
    {#each node.content as item}<li>{#each item.content as node}<svelte:self node={node} />{/each}</li>{/each}
  </ul>

{:else if node.nodeType === 'ordered-list'}
  <ol>
    {#each node.content as item}<li>{#each item.content as node}<svelte:self node={node} />{/each}</li>{/each}
  </ol>

{:else if node.nodeType === 'table'}
  <table>
    {#each node.content as item}<tr>{#each item.content as node}<svelte:self node={node} />{/each}</tr>{/each}
  </table>
{:else if node.nodeType === 'table-header-cell'}
  <th data-content="{node.content[0]?.content[0]?.value}">{#each node.content as item}<svelte:self node={item} />{/each}</th>
{:else if node.nodeType === 'table-cell'}
  <td>{#each node.content as item}<svelte:self node={item} />{/each}</td>

{:else if node.nodeType === 'blockquote'}
  <blockquote>{#each node.content as code}<svelte:self node={code} />{/each}</blockquote>

{:else if node.nodeType === 'embedded-asset-block'}
<Picture media={node.data.target} />
{:else if node.nodeType === 'embedded-entry-block'}
{#if node.data.target?.sys?.contentType?.sys?.id === 'indicateur'}
<figure>
  <Card indicateur={node.data.target} {...id === 'evolution' && { only: 'Québec' }} />
</figure>
{/if}
{/if}

<style lang="scss">
  table {
    background: var(--dark);
    border: 1px solid;
    border-radius: 1em;
    overflow: hidden;
    -webkit-border-horizontal-spacing: 0;
    -webkit-border-vertical-spacing: 0;
    margin-bottom: 1rem;

    :global(a) {
      text-decoration: none;
    }
  }

    td,
    th {
      // width: 50%;
      vertical-align: top;
      padding: 1em;

      border-right: 1px solid;
      border-bottom: 1px solid;

      &:last-child {
        border-right: none;
      }

      > :global(*:last-child) {
        margin-bottom: 0;
      }
    }

    tr:last-child {
      :global(td),
      :global(th) {
        border-bottom: none !important;
      }
    }

    th {
      text-align: left;
      font-weight: normal;
      color: var(--dark);
      background: var(--light);
      padding: 0.5em 1em;

      :global(strong) {
        color: var(--dark) !important;
      }

      &[data-content="Amélioration"] {
        background-color: rgb(38, 185, 114);
      }

      &[data-content="Stagnation"] {
        background-color: #9FA1A8;
      }
      
      &[data-content="Détérioration"] {
        background-color: rgb(251, 97, 63);
      }
    }

    figure {
      margin:  calc(var(--gutter) * 1) -10vw calc(var(--gutter) * 1);
      
      :global(figure) {
        padding-bottom: 33%;
      }

      @media (max-width: 888px) {
        margin-left: 0;
        margin-right: 0;

        :global(figure) {
          padding-bottom: 66%;
        }
      }
    }
</style>