import { postSCAN } from '$lib/_api';
import type { Post } from '$lib/_api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const posts: Post[] = await postSCAN();
	return {
		posts
	};
};
