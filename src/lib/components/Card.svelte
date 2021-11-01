<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import type { Indicateur } from '$routes/indicateurs/[id].svelte'
  import type { Entry } from 'contentful'

  export let indicateur: Entry<Indicateur>
</script>

<article style="color: {indicateur.fields.categorie.fields.couleur}">
  <a href="/categories/{indicateur.fields.categorie.fields.id}">{indicateur.fields.categorie.fields.titre}</a><br />
  <a href="/indicateurs/{indicateur.fields.id}">{indicateur.fields.titre}</a>
</article>