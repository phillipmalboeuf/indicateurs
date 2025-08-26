<script lang="ts">
  import { getLocale } from '$lib/paraglide/runtime'

  import Donut from '$lib/components/Donut.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  
  let exporting: Exporting
</script>

<Donut bind:exporting locale={getLocale()} />
<button on:click={() => exporting?.download('png')}>Télécharger <Icon i="download" /></button>