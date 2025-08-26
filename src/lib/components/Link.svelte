<script lang="ts">
  import { page } from '$app/state'
  import type { TypeLienDeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'

  export let lien: Entry<TypeLienDeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let active = false
</script>

<a class:active href={({'/': '/indicateurs'}[lien.fields.lien] || lien.fields.lien)} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>