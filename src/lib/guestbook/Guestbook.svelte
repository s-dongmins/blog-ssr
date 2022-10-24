<script context="module" lang="ts">
	import { commentGET } from '$lib/_api';
	import type { Comment } from '$lib/_api';
	import type { Load } from '@sveltejs/kit';

	/** @type {import("./__types/guestbook").Load} */
	export const load: Load = async ({ fetch }) => {
		const items = await commentGET('guestbook');
		return {
			props: {
				items
			}
		};
	};
</script>

<script lang="ts">
	export let items: Comment[];
</script>

<p>{JSON.stringify(items)}</p>
