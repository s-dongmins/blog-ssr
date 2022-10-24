import type { RequestHandler } from '@sveltejs/kit';
import { postGET, commentGET, commentPOST } from '$lib/_api';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const responsePost = await postGET(params.postid);
	const responseComments = await commentGET(params.postid);
	const postHTML = await (
		await fetch(
			`https://dongminiblog.s3.ap-northeast-2.amazonaws.com/${params.postid}/content.html`
		)
	).text();
	return {
		post: responsePost,
		comments: responseComments,
		postHTML: postHTML
	};
};

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
