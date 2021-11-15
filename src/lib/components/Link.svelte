<script lang="ts">
  import { page } from '$app/stores'
  import type { Entry } from 'contentful'
  import type { Lien } from './Header.svelte'

  export let lien: Entry<Lien>
  export let active = false
</script>

<a class:active href={((!lien.fields.externe && $page.params.locale === 'en') ? "/en" : "") + lien.fields.lien} target={lien.fields.externe && '_blank'}>{lien.fields.titre}</a>