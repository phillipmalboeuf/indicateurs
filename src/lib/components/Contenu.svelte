<script lang="ts">
  import type { Entry } from 'contentful'
  import { onMount } from 'svelte'
  import ContenuIndicateur from './contenu/ContenuIndicateur.svelte'
  import Images from './contenu/Images.svelte'
  import Liste from './contenu/Liste.svelte'
  import Logos from './contenu/Logos.svelte'
  import Tableau from './contenu/Tableau.svelte'
  import Tendances from './contenu/Tendances.svelte'
  import Text from './contenu/Text.svelte'
  import Tooltip from './Tooltip.svelte'
  import type { TypeTextSkeleton } from '$lib/clients/content_types';

  export let contenu: any[]
  export let noNav = false

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


<section class:noNav={noNav || contenu.filter(c => c.fields.id).length <= 1}>
  {#if !noNav && contenu.filter(c => c.fields.id).length > 1}
  <nav>
    {#each contenu.filter(c => c.fields.id) as entry}
    <a href="#{entry.fields.id}" class:active={active === entry.fields.id} on:click={show}>{entry.fields.titre}</a>

      {#each entry.fields.corps.content.filter(node => node.nodeType === 'heading-3') as node}
        {#each node.content as mark}
        <a href="#{entry.fields.id}-{mark.value}" class="secondary">{mark.value}</a>
        {/each}
      {/each}
    {/each}

    {#if showMenu}
    <Tooltip visible light>
      <div class="submenu" slot="tool">
      {#each contenu.filter(c => c.fields.id) as entry}
      <a href="#{entry.fields.id}" on:click={hide}>{entry.fields.titre}</a>
      {/each}
      </div>
    </Tooltip>
    {/if}
  </nav>
  {/if}

  <div>
    {#each contenu as entry}
    <div data-id={entry.fields.id} bind:this={elements[entry.fields.id]}>
    {#if entry.sys.contentType.sys.id === 'text'}
    <Text {entry} />
    {:else if entry.sys.contentType.sys.id === 'liste'}
    <Liste {entry} />
    {:else if entry.sys.contentType.sys.id === 'tableau'}
    <Tableau {entry} />
    {:else if entry.sys.contentType.sys.id === 'tendances'}
    <Tendances {entry} />
    {:else if entry.sys.contentType.sys.id === 'contenuIndicateur'}
    <ContenuIndicateur {entry} />
    {:else if entry.sys.contentType.sys.id === 'images'}
    <Images {entry} />
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
    grid-template-columns: repeat(12, 1fr);
    column-gap: var(--gutter);

    padding: calc(var(--gutter)*2) var(--gutter);
    // max-width: var(--width);
    margin: 0 auto;

    @media (max-width: 888px) {
      padding: calc(var(--gutter)*2) 0;
    }

    > div {
      grid-column: span 8;
      z-index: 2;

      @media (max-width: 888px) {
        grid-column: span 12;
      }
    }

    &.noNav {
      > div {
        grid-column-start: 3;
        grid-column-end: 11;

        // @media (max-width: 888px) {
        //   grid-column: span 12;
        // }
      }
    }

    :global(h2) {
      @media (min-width: 888px) {
        font-size: 3rem;
      }
      margin-top: 12rem;
      margin-bottom: 12rem;
      text-align: center;
    }

    :global(h3) {
      @media (min-width: 888px) {
        font-size: 2.5rem;
      }
      margin-top: 6rem;
      margin-bottom: 6rem;
      text-align: center;
    }

    :global(h4) {
      // @media (min-width: 888px) {
      //   font-size: 2.5rem;
      // }
      color: var(--highlight);
      margin: 5rem 0 3rem;
      // text-align: center;

      :global(strong) {
        color: var(--highlight);
      }
    }

    :global(table) {
      margin: 0 -2rem 4rem;
      @media (max-width: 888px) {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
      }
      width: calc(100% + 4rem);
    }

    :global(blockquote) {
      padding: 2rem;
      margin: 4rem -2rem;
      @media (max-width: 888px) {
        margin-left: 0;
        margin-right: 0;
      }
      border: 1px solid;
      border-radius: 1rem;

      color: var(--dark);
      background: var(--light);
      
      :global(strong) {
        color: var(--dark);
        font-size: 1.25rem;
      }
    }

    :global(p:has(strong):has(+ table)) {
      text-align: center;
      margin-top: 4rem;
    }

    :global(p:has(strong):has(+ ul)) {
      padding: 2rem 2rem 0;
      margin: 4rem -2rem -1px;
      @media (max-width: 888px) {
        margin-left: 0;
        margin-right: 0;
      }
      border: 1px solid;
      border-bottom: none;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;

      color: var(--dark);
      background: var(--light);

      font-size: 1.25rem;
      text-align: center;

      :global(strong) {
        color: var(--dark);
      }
    }

    :global(p:has(strong) + ul) {
      padding: 2rem;
      padding-left: 3rem;
      margin: 0 -2rem 4rem;
      @media (max-width: 888px) {
        margin-left: 0;
        margin-right: 0;
      }
      border: 1px solid;
      border-top: none;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;

      color: var(--dark);
      background: var(--light);

      :global(strong) {
        color: var(--dark);
      }
    }

    :global(u),
    :global(strong) {
      color: white;
    }

    :global(table td:has(p > strong)) {
      background-color: #3979d8;
    }
  }

  nav {
    position: sticky;
    bottom: calc(var(--gutter) * 1);
    margin-left: calc(var(--gutter) * -1);
    align-self: flex-end;
    grid-column: span 3;

    a {
      display: block;
      margin-bottom: 0.5rem;

      &.active {
        color: var(--highlight);

        // &:before {
        //   content: "•";
        //   position: absolute;
        //   left: -1rem;
        // }
      }

      &.secondary {
        padding-left: 1rem;
        font-size: 0.9em;
        // margin-bottom: 0.25rem;

        &:last-child {
          // margin-bottom: 0.5rem;
        }
      }
    }

    // @media (max-width: 888px) {
    //   top: 1rem;
    //   z-index: 10;

    //   :global(span) {
    //     left: 200%;
    //   }
      

    //   a.active {
    //     color: currentColor;
    //     // font-weight: bold;
    //     font-size: 1.5rem;
    //     background-color: var(--dark);
    //     width: 40vw;
    //     height: 2rem;
    //     overflow: hidden;

    //     &:before {
    //       content: none;
    //     }
    //   }
      
    //   a:not(.active) {
    //     display: none;
    //   }

    //   .submenu a {
    //     display: block;
    //   }
    // }

    @media (max-width: 666px) {
      display: none;
    }
  }
</style>
