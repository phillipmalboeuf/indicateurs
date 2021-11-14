<script lang="ts">
  import type { Entry } from 'contentful'
import ContenuIndicateur from './contenu/ContenuIndicateur.svelte';
  import Liste from './contenu/Liste.svelte'
  import Tableau from './contenu/Tableau.svelte'
  import Text from './contenu/Text.svelte'

  export let contenu: Entry<any>[]
</script>


<section>
  <nav>
    {#each contenu.filter(c => c.fields.id) as entry}
    <a href="#{entry.fields.id}">{entry.fields.titre}</a>
    {/each}
  </nav>

  <div>
    {#each contenu as entry}
    {#if entry.sys.contentType.sys.id === 'text'}
    <Text {entry} />
    {:else if entry.sys.contentType.sys.id === 'liste'}
    <Liste {entry} />
    {:else if entry.sys.contentType.sys.id === 'tableau'}
    <Tableau {entry} />
    {:else if entry.sys.contentType.sys.id === 'contenuIndicateur'}
    <ContenuIndicateur {entry} />
    {/if}
    {/each}
  </div>
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--gutter);

    padding: var(--gutter);
    max-width: var(--width);
    margin: 0 auto;

    div {
      grid-column: span 3;
      z-index: 2;

      @media (max-width: 888px) {
        grid-column: span 4;
      }
    }

    :global(h2),
    :global(h4),
    :global(h6) {
      color: var(--highlight);
    }
  }

  nav {
    position: sticky;
    top: var(--gutter);
    left: 0;
    align-self: start;
    
    a {
      display: block;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 888px) {
      display: none;
    }
  }
</style>
