import { postSCAN } from '$lib/_api';
import type { Post } from '$lib/_api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const posts: Post[] = await postSCAN();
	return {
		posts
	};
};
