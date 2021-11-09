<script lang="ts">
  import type { Entry } from 'contentful'
  import Text from './contenu/Text.svelte'

  export let contenu: Entry<any>[]
</script>


{#each contenu as entry}
{#if entry.sys.contentType.sys.id === 'text'}
<Text text={entry} />
{/if}
{/each}

