<script lang="ts">
	import Progress from '$lib/progress/Progress.svelte';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Progress />

<Header />

<div class="flex flex-col items-center overflow-x-hidden w-full">
	<main class="w-full sm:w-4/5 lg:w-3/5 border-x">
		<slot />
	</main>
	<footer class="mt-20 mb-3">
		<p class="text-xs text-gray-600 font-thin">dongmin.shin00@gmail.com</p>
	</footer>
</div>
