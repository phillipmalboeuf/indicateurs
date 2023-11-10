<script lang="ts">
  import Picture from '../Picture.svelte'
  import Mark from './Mark.svelte'

  export let node
</script>

{#if node.nodeType === 'heading-1'}
  <h1 class="slow"><div>{#each node.content as mark}<Mark mark={mark} />{/each}</div></h1>
{:else if node.nodeType === 'heading-2'}
  <h2>{#each node.content as mark}<Mark mark={mark} />{/each}</h2>
{:else if node.nodeType === 'heading-3'}
  <h3>{#each node.content as mark}<Mark mark={mark} />{/each}</h3>
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
  <th>{#each node.content as item}<svelte:self node={item} />{/each}</th>
{:else if node.nodeType === 'table-cell'}
  <td>{#each node.content as item}<svelte:self node={item} />{/each}</td>

{:else if node.nodeType === 'blockquote'}
  <blockquote>{#each node.content as code}<svelte:self node={code} />{/each}</blockquote>

{:else if node.nodeType === 'embedded-asset-block'}
<Picture media={node.data.target} />
{/if}

<style lang="scss">
  table {
    background: var(--dark);
    border: 1px solid;
    border-radius: 1em;
    -webkit-border-horizontal-spacing: 0;
    -webkit-border-vertical-spacing: 0;
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

      > *:last-child {
        margin-bottom: 0;
      }
    }

    th {
      text-align: left;
      font-weight: normal;
      color: var(--dark);
      background: var(--light);
      padding: 0.5em 1em;
    }
</style>