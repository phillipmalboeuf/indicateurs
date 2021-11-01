<script lang="ts">
  import type { Entry } from 'contentful'
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'

  import Card from '$lib/components/Card.svelte'

  export let indicateurs: Entry<Indicateur>[]
</script>

<ul>
  {#each indicateurs as indicateur (indicateur.fields.id)}
  {#if !indicateur.hidden}
  <li>
    <Card {indicateur} />
  </li>  
  {/if}
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding-left: 0;
  }
</style>