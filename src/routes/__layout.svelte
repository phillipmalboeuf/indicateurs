<script lang="ts">
	import '../app.css';
</script>

<nav>
	<a href="/">Indicateurs</a>
  <a href="/method">Méthodologie</a>
	<a href="/a-propos">À propos</a>
</nav>

<main id="main">
	<slot></slot>
</main>

<style>
	main {
    min-height: 100vh;
    padding: var(--gutter);
	}
</style>