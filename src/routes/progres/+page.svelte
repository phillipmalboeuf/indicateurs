<script lang="ts">
  import { getLocale } from '$lib/paraglide/runtime'

  import Progress from '$lib/components/Progress.svelte'
  import type { Exporting } from '@amcharts/amcharts5/plugins/exporting'
  
  let exporting: Exporting
</script>

<Progress bind:exporting locale={getLocale()} juri={'Québec'} />