<script lang="ts">
  import Node from './Node.svelte'

  export let body
  export let id: string
</script>

{#if body}
{#each body.content as node}
<Node node={node} {id} />
{/each}
{/if}