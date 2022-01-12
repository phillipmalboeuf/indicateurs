<script context="module" lang="ts">
  
  export function imgix(indicateur: Entry<Indicateur>) {
    // return `https://indicateurs.imgix.net/${indicateur.fields.id}_v${indicateur.sys.revision}.png?txt=indicateurs.quebec/indicateurs/${indicateur.fields.id}&txt-color=${indicateur.fields.categorie.fields.couleur.replace('#', '')}`
    return `https://indicateurs.imgix.net/${indicateur.fields.id}_v${indicateur.sys.revision}.png?q=100`
  }
</script>

<script lang="ts">
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import { onMount } from 'svelte'

  import Icon from '$lib/components/Icon.svelte'
  import Tooltip from '$lib/components/Tooltip.svelte'
  import type { Entry } from 'contentful'
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import { page } from '$app/stores'


	export let indicateur: Entry<Indicateur>
  export let exporting: Exporting
  export let iconsOnly = false
  let shareable: boolean
  let ex: boolean
  let anchor: HTMLAnchorElement

  onMount(() => {
    shareable = !!navigator.share

    if ($page.query.has("export")) {
      ex = true
    }
  })

  async function download() {
    fetch(imgix(indicateur))
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        
        anchor.href = url
        anchor.download = `${indicateur.fields.id}_v${indicateur.sys.revision}.png`
        anchor.click()
        window.URL.revokeObjectURL(url)
      })
  }

  const url = $page.params.locale === 'en' 
    ? `https://indicateurs.quebec/en/indicateurs/${indicateur.fields.id}`
    : `https://indicateurs.quebec/indicateurs/${indicateur.fields.id}`
</script>

<a bind:this={anchor} hidden aria-hidden="true"></a>

{#if shareable}
<button class:iconsOnly on:click={() => navigator.share({
  url,
  text: `${indicateur.fields.lead} – ${indicateur.fields.titre}`
})} aria-label={iconsOnly && "Partager"}>{#if !iconsOnly}{$page.params.locale === 'en' ? "Share" : "Partager"} {/if}<Icon i="share" /></button>
{:else}
<Tooltip top>
  <button class:iconsOnly slot="tip" on:click={() => false} aria-label={iconsOnly && "Partager"}>{#if !iconsOnly}{$page.params.locale === 'en' ? "Share" : "Partager"} {/if}<Icon i="share" /></button>
  <ul slot="tool">
    <li><a href="https://twitter.com/intent/tweet?url={url}&text={`${indicateur.fields.lead} – ${indicateur.fields.titre}`}" target="_blank">{$page.params.locale === 'en' ? "Share on Twitter" : "Partager sur Twitter"}</a></li>
    <li><a href="https://www.facebook.com/sharer.php?u={url}" target="_blank">{$page.params.locale === 'en' ? "Share on Facebook" : "Partager sur Facebook"}</a></li>
    <li><a href="https://www.linkedin.com/shareArticle?url={url}&title={indicateur.fields.titre}&summary={indicateur.fields.lead}" target="_blank">{$page.params.locale === 'en' ? "Share on LinkedIn" : "Partager sur LinkedIn"}</a></li>
    <li class="url">
      <label for="url">{$page.params.locale === 'en' ? "URL to Share:" : "URL de partage :"}</label>
      <input type='url' id="url" readonly on:click={e => e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)} 
        value={url} />
    </li>
  </ul>
</Tooltip>
{/if}
<Tooltip top>
  <a href="{imgix(indicateur)}&dl" class:iconsOnly slot="tip" aria-label={iconsOnly && "Télécharger"}>{#if !iconsOnly}{$page.params.locale === 'en' ? "Download" : "Télécharger"} {/if}<Icon i="download" /></a>
  <ul slot="tool">
    <li><a href="{imgix(indicateur)}&dl">{$page.params.locale === 'en' ? "Image format" : "Format image"}</a></li>
    <li><button on:click={() => exporting?.download('csv')}>{$page.params.locale === 'en' ? "CSV format" : "Format CSV"}</button></li>
    {#if ex}<li><button on:click={async () => {
      await fetch(`/indicateurs/upload.json?name=${indicateur.fields.id}_v${indicateur.sys.revision}`, {
        method: 'PUT',
        body: (await exporting?.exportImage('png', {quality: 1}))
      })
      ex = false
      }}>Export</button></li>{/if}
  </ul>
</Tooltip>

<style lang="scss">
  a[hidden] {
    display: none;
  }

  button.iconsOnly {
    border: none;

    &:hover,
    &:focus {
      color: var(--highlight);
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    color: var(--light);
  }

  li {

    &.url {
      margin-top: 0.5rem;
      text-align: center;
    }

    a {
      display: inline-block;
      font-weight: bold;
      padding: 6px 12px;
    }
    
    button {
      font-size: 1rem;
      border: none;
    }

    input {
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.25rem;
      background: transparent;
      color: var(--light);
      border: 1px solid var(--highlight);
    }
  }
</style>