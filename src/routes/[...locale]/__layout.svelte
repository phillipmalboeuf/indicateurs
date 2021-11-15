<script context="module" lang="ts">
	import '../../app.css'

	export async function load({ page, fetch, session, context }) {
		const res = await fetch(`${page.params.locale === 'en' ? "/en" : ""}/layout.json`)

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

<main class:navigating={$navigating} id="main">
	<slot></slot>
</main>

<Footer navigation={secondaire} subnavigation={tertiaire} path={$page.path} />

<style>
	main {
    min-height: 100vh;
    padding: 0 var(--gutter);
	}

	main:before {
		content: "";
		border: 2px solid var(--highlight);
		position: fixed;
		top: 0;
		left: 0;
		width: 0%;
		box-sizing: border-box;
		transition: none;
		opacity: 0;
	}

	main.navigating:before {
		opacity: 1;
		width: 100%;
		transition: width 666ms, opacity 333ms;
	}
</style>