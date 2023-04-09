import { postGET, commentGET, commentPOST, visitGET } from '$lib/_api';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ params }) => {
	const responsePost = await postGET(params.postid);
	const responseComments = await commentGET(params.postid);
	const responseVisit = (await visitGET())[params.postid].visit;
	const postHTML = await (
		await fetch(`http://bucket.dongmins.com/${params.postid}/content.html`)
	).text();
	return {
		post: responsePost,
		comments: responseComments,
		postHTML: postHTML,
		visit: responseVisit
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const id: string = form.get('id') as string;
		const content: string = form.get('content') as string;
		const mbti: string = form.get('mbti') as string;
		const name: string = form.get('name') as string;
		const email: string = form.get('email') as string;
		const password: string = form.get('password') as string;

		await commentPOST(id, content, mbti, name, email, password);
	}
};
