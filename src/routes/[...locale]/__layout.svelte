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
	import type { Asset, Entry } from 'contentful'
	import type { Lien } from '$lib/components/Header.svelte'
	import Header from '$lib/components/Header.svelte'

	import { getStores, navigating, page, session } from '$app/stores'
	import Footer from '$lib/components/Footer.svelte'
	import Region from '$lib/components/Region.svelte'

	export let principale: Entry<{ liens: Entry<Lien>[] }>
	export let secondaire: Entry<{ liens: Entry<Lien>[] }>
	export let tertiaire: Entry<{ liens: Entry<Lien>[] }>
	export let logo: Asset

	const ga = 'G-YJ5HYDM8JD'

	
	if (typeof window !== "undefined") {
		// @ts-ignore
		window.dataLayer = window.dataLayer || []
		// @ts-ignore
		window.gtag = function gtag() {
			// @ts-ignore
			window.dataLayer.push(arguments)
		}
		// @ts-ignore
		window.gtag("js", new Date())
		// @ts-ignore
		window.gtag("config", ga, { 'send_page_view': false })
	}
	$: {
		// @ts-ignore
		if (typeof gtag !== "undefined"){
			// @ts-ignore
			window.gtag("config", ga, {
				page_path: $page.path,
			})
		}
	}
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={ga}"></script>
</svelte:head>

<Header navigation={principale} path={$page.path} />

<main class:navigating={$navigating} id="main">
	<slot></slot>
</main>

<Region />
<Footer navigation={secondaire} subnavigation={tertiaire} {logo} path={$page.path} />

<style lang="scss">
	main {
    min-height: 88vh;
    padding: 0 var(--gutter);
	}

	main:before {
		content: "";
		border-top: 2px solid var(--highlight);
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