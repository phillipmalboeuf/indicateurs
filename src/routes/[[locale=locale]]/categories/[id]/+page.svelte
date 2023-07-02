<script lang="ts">
  import Document from '$lib/components/document/Document.svelte'
  import Hero from '$lib/components/Hero.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import StickyNav from '$lib/components/StickyNav.svelte'
  import Filters from '$lib/components/Filters.svelte'
  import Indicateurs from '$lib/components/Indicateurs.svelte'

  import { page } from '$app/stores'

  import type { PageData } from './$types'
  export let data: PageData

  let checked: string[] = $page.url.searchParams.get('categories')?.split(',') || []
</script>

<svelte:head>
  <title>{data.categorie.fields.titre} – Les indicateurs du bien-être au Québec</title>

  <meta property="og:title" content="{data.categorie.fields.titre} – Les indicateurs du bien-être au Québec" />
  <meta property="og:url" content="https://indicateurs.quebec/categories/{data.categorie.fields.id}" />
  {#if data.categorie.fields.photo}<meta property="og:image" content="https:{data.categorie.fields.photo.fields.file.url}?w=1200&h=630" />{/if}

  <meta name="twitter:title" content="{data.categorie.fields.titre} – Les indicateurs du bien-être au Québec">
  <meta name="twitter:card" value="summary_large_image">
  {#if data.categorie.fields.photo}<meta name="twitter:image" content="https:{data.categorie.fields.photo.fields.file.url}?w=600&h=314">{/if}
</svelte:head>


{#key data.categorie.fields.id}
<StickyNav>
  <div slot="left">
    <a class="button" href="{$page.params.locale === 'en' ? "/en" : "/"}"><Icon i="chevron" small rotate={180} /> {$page.params.locale === 'en' ? "back" : "retour"}</a>

    {#if data.pilier}
    <h4><a href="{$page.params.locale === 'en' ? "/en" : ""}/categories/{data.pilier.fields.id}">{data.pilier.fields.titre}</a></h4>
    {/if}
  </div>
</StickyNav>

{#if data.categorie.fields.photo}
<Hero media={data.categorie.fields.photo}>
  <section>
    <article>
      <h1>{data.categorie.fields.titre}</h1>
      {#if data.categorie.fields.description}<Document body={data.categorie.fields.description} />{/if}
    </article>
    
    <aside>
      {#if data.categorie.fields.sousCategories}
      <!-- <h5>Sous-catégories</h5> -->
      <Filters categories={data.categorie.fields.sousCategories} {checked} base={($page.params.locale ? '/en' : '') + `/categories/${data.categorie.fields.id}`} on:update={event => checked = event.detail} />
      {/if}
    </aside>
  </section>
</Hero>
{:else}
<section>
  <article>
    <h1>{data.categorie.fields.titre}</h1>
    {#if data.categorie.fields.description}<Document body={data.categorie.fields.description} />{/if}
  </article>
  
  <aside>
    {#if data.categorie.fields.sousCategories}
    <!-- <h5>Sous-catégories</h5> -->
    <Filters categories={data.categorie.fields.sousCategories} {checked} base={($page.params.locale ? '/en' : '') + `/categories/${data.categorie.fields.id}`} on:update={event => checked = event.detail} />
    {/if}
  </aside>
</section>
{/if}



<Indicateurs indicateurs={data.indicateurs = checked.length
  ? data.indicateurs.map(i => ({ ...i, hidden: !checked.find(id => i.fields.categorie.fields.id === id) }))
  : data.indicateurs.map(i => ({ ...i, hidden: false }))} />
{/key}

<style lang="scss">
  section {
    max-width: var(--width);
    margin: 0 auto;
    padding: var(--gutter);

    h1 {
      font-size: 2.5rem;
    }

    @media (max-width: 888px) {
      padding: var(--gutter) 0;

      h1 {
        font-size: 2.25rem;
      }
    }
  }

  a.button {
  }

  section {
    display: grid; 
    grid-template-columns: repeat(6, 1fr);
    padding-top: 104px;
    column-gap: var(--gutter);
  }

  article {
    grid-column: span 3;
  }

  aside {
    grid-column: 5 / span 2;
  }

  @media (max-width: 888px) {
  article {
    grid-column: span 6;
  }

  aside {
    grid-column: span 6;
  }
  }
</style>