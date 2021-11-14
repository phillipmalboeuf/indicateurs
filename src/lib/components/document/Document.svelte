<script lang="ts">
  import Node from './Node.svelte'

  export let body
</script>

{#if body}
{#each body.content as node}
<Node node={node} />
{/each}
{/if}