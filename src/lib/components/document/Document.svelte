<script lang="ts">
  import Node from './Node.svelte'

  export let body
</script>

{#each body.content as node}
<Node node={node} />
{/each}