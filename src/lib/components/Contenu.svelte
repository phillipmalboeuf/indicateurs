<script lang="ts">
  import type { Entry } from 'contentful'
  import { onMount } from 'svelte'
  import ContenuIndicateur from './contenu/ContenuIndicateur.svelte'
  import Liste from './contenu/Liste.svelte'
  import Logos from './contenu/Logos.svelte'
  import Tableau from './contenu/Tableau.svelte'
  import Text from './contenu/Text.svelte'
  import Tooltip from './Tooltip.svelte'

  export let contenu: Entry<any>[]
  let active: string
  let elements: {[key: string]: Element} = {}
  let showMenu = false

  onMount(() => {
		const observer = new IntersectionObserver( 
			([e]) => {
        if (e.isIntersecting) {
          active = e.target.getAttribute("data-id")
        }
      },
			{ threshold: 0, rootMargin: "-45%" }
		)

    Object.values(elements).reverse().forEach(element => observer?.observe(element))
    

    return () => observer.disconnect()
	})

  function show(e: MouseEvent) {
    if (window.innerWidth < 888) {
      e.preventDefault()
      showMenu = true
    }
  }

  function hide(e: MouseEvent) {
    showMenu = false
  }
</script>


<section>
  <nav>
    {#each contenu.filter(c => c.fields.id) as entry}
    <a href="#{entry.fields.id}" class:active={active === entry.fields.id} on:click={show}>{entry.fields.titre}</a>
    {/each}

    {#if showMenu}
    <Tooltip visible>
      <div class="submenu" slot="tool">
      {#each contenu.filter(c => c.fields.id) as entry}
      <a href="#{entry.fields.id}" on:click={hide}>{entry.fields.titre}</a>
      {/each}
      </div>
    </Tooltip>
    {/if}
  </nav>

  <div>
    {#each contenu as entry}
    <div data-id={entry.fields.id} bind:this={elements[entry.fields.id]}>
    {#if entry.sys.contentType.sys.id === 'text'}
    <Text {entry} />
    {:else if entry.sys.contentType.sys.id === 'liste'}
    <Liste {entry} />
    {:else if entry.sys.contentType.sys.id === 'tableau'}
    <Tableau {entry} />
    {:else if entry.sys.contentType.sys.id === 'contenuIndicateur'}
    <ContenuIndicateur {entry} />
    {:else if entry.sys.contentType.sys.id === 'logos'}
    <Logos {entry} />
    {/if}
    </div>
    {/each}
  </div>
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--gutter);

    padding: calc(var(--gutter)*2) var(--gutter);
    max-width: var(--width);
    margin: 0 auto;

    @media (max-width: 888px) {
      padding: calc(var(--gutter)*2) 0;
    }

    > div {
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
    top: calc(var(--gutter) * 3);
    left: 0;
    align-self: start;
    
    a {
      display: block;
      margin-bottom: 0.5rem;

      &.active {
        color: var(--highlight);

        &:before {
          content: "•";
          position: absolute;
          left: -1rem;
        }
      }
    }

    @media (max-width: 888px) {
      top: 0.5rem;
      z-index: 10;

      .submenu :global(span) {
        left: 100%;
      }
      
      

      a.active {
        color: currentColor;
        // font-weight: bold;
        font-size: 1.5rem;
        background-color: var(--dark);
        width: 40vw;
        height: 2rem;
        overflow: hidden;

        &:before {
          content: none;
        }
      }
      
      a:not(.active) {
        display: none;
      }

      .submenu a {
        display: block;
      }
    }
  }
</style>
