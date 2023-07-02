<script lang="ts">

  import type { Entry } from 'contentful'
  import { fade, fly } from 'svelte/transition'
	import { page } from '$app/stores'

	import Icon from './Icon.svelte'
	import Link from './Link.svelte'
  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  
	export let path: string
  export let navigation: Entry<TypeNavigationSkeleton>

  let visible: boolean
</script>

<button class="menu" on:click={() => visible = !visible}>{#if visible}<Icon i="close" />{:else}<Icon i="menu" />{/if}</button>

{#if visible}
<nav transition:fly={{ y: -100 }}>
  <button class="close" on:click={() => visible = false}><Icon i="close" /></button>

	<ul on:click={() => visible = false}>
		<li><a href={$page.params.locale === 'en' ? "/en" : "/"} class="logo"><strong>{$page.params.locale === 'en' ? 'The Indicators' : 'Les Indicateurs'}</strong></a></li>
		{#each navigation.fields.liens as lien, i}
		<li>
    {#if lien.fields.sousLiens?.length > 0}
		<Link active={path.includes(lien.fields.lien)} {lien} />

		<ul>
			{#each lien.fields.sousLiens as l}
			<li><Link lien={l} /></li>
			{/each}
		</ul>
    {:else}
    <Link active={path.includes(lien.fields.lien)} {lien} />
    {/if}
		</li>
    {/each}

		<li>
			<a class="locale" href={$page.params.locale === 'en' ? "/" : "/en"}><strong>{$page.params.locale === 'en' ? "Français" : "English"}</strong></a>
		</li>
	</ul>
</nav>
{/if}

<style lang="scss">
  nav {
    position: fixed;
    top: 0;
		left: 0;
    z-index: 2;
    width: 100%;
    height: 100vh;
    color: var(--light);
    background: black;
    
    overflow-y: scroll;
    padding: calc(var(--gutter) /2) var(--gutter) calc(var(--gutter)*3);

    // display: grid;
    // grid-template-columns: repeat(12, 1fr);
    // column-gap: var(--margins);

		> ul {
			list-style: none;
			padding-left: 0;
			margin: 0;

			// text-align: center;

			> li {
				margin: 0 0 0.5em;

				> ul {
					list-style: none;

					> li {
						margin: 0.25em 0;
					}
				}
			}
		}

		li {
			// margin: 0 0 0.5em;

			// &:first-child {
			// 	margin-bottom: 2em;
			// }

			// &:last-child {
			// 	margin-top: 1.5em;
			// }
		}

		> ul {

			> li {
				font-size: 1.5rem;
				// margin-top: 2rem;

				li {
					font-size: 1rem;
				}
			}
		}
  }

	a.locale,
	a.logo {
		font-size: 1rem;
		font-family: var(--alt);
	}

	a.logo {
		color: var(--highlight);
	}

	button.menu {
		border: none;
		padding: var(--gutter);
		margin-right: calc(var(--gutter) * -1);
		background: transparent;

		@media (min-width: 888px) {
			display: none;
		}
	}

	button.close {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    padding: var(--gutter);
  }
</style>