<script context="module" lang="ts">
	import '../app.css'

	export async function load({ page, fetch, session, context }) {
		const res = await fetch(`/layout.json`)

		return {
			props: await res.json()
		}
	}
</script>

<script lang="ts">
	import type { Entry } from 'contentful'
	import type { Lien } from '$lib/components/Header.svelte'
	import Header from '$lib/components/Header.svelte'

	import { getStores, navigating, page, session } from '$app/stores'
	import Footer from '$lib/components/Footer.svelte'

	export let principale: Entry<{ liens: Entry<Lien>[] }>
	export let secondaire: Entry<{ liens: Entry<Lien>[] }>
	export let tertiaire: Entry<{ liens: Entry<Lien>[] }>
</script>

<Header navigation={principale} path={$page.path} />

<main id="main">
	<slot></slot>
</main>

<Footer navigation={secondaire} subnavigation={tertiaire} path={$page.path} />

<style>
	main {
    min-height: 100vh;
    padding: var(--gutter);
	}
</style>