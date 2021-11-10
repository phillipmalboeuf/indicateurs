<script>
  export let media
  export let small = false
  export let noDescription = false
  export let ar = undefined
</script>

<style>
  img,
  video {
    width: 100%;
    max-width: 100%;
  }
</style>

{#if media.fields.file.contentType.startsWith('video/')}
<video src="{media.fields.file.url}" autoplay muted loop playsinline />
{:else}
<picture>
  {#if small}
<source srcSet="{media.fields.file.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.fields.file.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.fields.file.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<source srcSet="{media.fields.file.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.fields.file.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img src="{media.fields.file.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}" alt="{media.fields.title} {media.fields.description}" />
  {:else}
<source srcSet="{media.fields.file.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.fields.file.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.fields.file.url}?w=1200{ar ? `&h=${Math.round(ar * 1200)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<source srcSet="{media.fields.file.url}?w=1200{ar ? `&h=${Math.round(ar * 1200)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.fields.file.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img src="{media.fields.file.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}" alt="{media.fields.title} {media.fields.description}" />
  {/if}
</picture>
{/if}

{#if !noDescription && media.fields.description}
<small>{media.fields.description}</small>
{/if}