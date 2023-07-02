<script lang="ts">
  import Page from '$lib/components/Page.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<Page page={data.page} />