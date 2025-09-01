<script lang="ts">
	import '../app.css'
	
	import Header from '$lib/components/Header.svelte'

	import { navigating, page } from '$app/state'
	import Footer from '$lib/components/Footer.svelte'
	import Region from '$lib/components/Region.svelte'

	import type { PageData } from './$types'
  export let data: PageData

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
				page_path: page.url.pathname,
			})
		}
	}
</script>

<svelte:head>
  <script async type="application/plain" data-cookies="performance" src="https://www.googletagmanager.com/gtag/js?id={ga}"></script>
</svelte:head>

<Header navigation={data.principale} alert={data.alert} path={page.url.pathname} />

<main class:navigating={navigating} class="{page.route.id?.replaceAll('/', '-').replaceAll('[', '').replaceAll(']', '')} {page.url.pathname.replaceAll('/', '-')}" id="main">
	<slot></slot>
</main>

<Region />
<Footer navigation={data.secondaire} subnavigation={data.tertiaire} path={page.url.pathname} />

<style lang="scss">
	main {
    min-height: 88vh;
    padding: 0 calc(var(--gutter) * 2);

		@media (max-width: 888px) {
			padding: 0 calc(var(--gutter) * 1);
		}

		&.-biodiversite {
			--highlight: rgb(5, 148, 79);
		}
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