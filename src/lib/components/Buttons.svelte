<script lang="ts">
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  import { onMount } from 'svelte'

  import Icon from '$lib/components/Icon.svelte'
  import Tooltip from '$lib/components/Tooltip.svelte'
  import type { Entry } from 'contentful'
  import type { Indicateur } from '$routes/indicateurs/[id].svelte'


	export let indicateur: Entry<Indicateur>
  export let exporting: Exporting
  export let iconsOnly = false
  let shareable: boolean

  onMount(() => {
    shareable = !!navigator.share
  })
</script>

{#if shareable}
<button class:iconsOnly on:click={() => navigator.share({
  url: `https://indicateurs.quebec/indicateurs/${indicateur.fields.id}`,
  text: `${indicateur.fields.lead} – ${indicateur.fields.titre}`
})} aria-label={iconsOnly && "Partager"}>{#if !iconsOnly}Partager {/if}<Icon i="share" /></button>
{:else}
<Tooltip top>
  <button class:iconsOnly slot="tip" on:click={() => false} aria-label={iconsOnly && "Partager"}>{#if !iconsOnly}Partager {/if}<Icon i="share" /></button>
  <ul slot="tool">
    <li><a href="https://twitter.com/intent/tweet?url=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}&text={`${indicateur.fields.lead} – ${indicateur.fields.titre}`}" target="_blank">Partager sur Twitter</a></li>
    <li><a href="https://www.facebook.com/sharer.php?u=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}" target="_blank">Partager sur Facebook</a></li>
    <li><a href="https://www.linkedin.com/shareArticle?url=https://indicateurs.quebec/indicateurs/{indicateur.fields.id}&title={indicateur.fields.titre}&summary={indicateur.fields.lead}" target="_blank">Partager sur LinkedIn</a></li>
    <li class="url">
      <label for="url">URL de partage:</label>
      <input type='url' id="url" readonly on:click={e => e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)} 
        value="https://indicateurs.quebec/indicateurs/{indicateur.fields.id}" />
    </li>
  </ul>
</Tooltip>
{/if}
<Tooltip top>
  <button class:iconsOnly slot="tip" on:click={() => exporting?.download('png')} aria-label={iconsOnly && "Télécharger"}>{#if !iconsOnly}Télécharger {/if}<Icon i="download" /></button>
  <ul slot="tool">
    <li><button on:click={() => exporting?.download('png')}>Format image</button></li>
    <li><button on:click={() => exporting?.download('csv')}>Format CSV</button></li>
  </ul>
</Tooltip>

<style lang="scss">
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