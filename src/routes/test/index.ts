import type { RequestHandler } from "@sveltejs/kit";
import type { Post } from "$lib/_api";
import { postGET, commentGET, commentPOST } from "$lib/_api";


export const get: RequestHandler = async () => {
    const responsePost: Post = {
        id: "test",
        datetime: 1653788682294,
        hashs: "this,is,test,",
        views: 100,
        title: "This is test page",
        description: "This is just test page, not secret something..."
    }
    const responseComments = await commentGET("test");
    return {
        body: {
            post: responsePost,
            comments: responseComments,
        }
    };
}

export const post: RequestHandler = async ({ request }) => {
    const form = await request.formData();

    const content: string = form.get("content") as string;
    const mbti: string = form.get("mbti") as string;
    const name: string = form.get("name") as string;
    const email: string = form.get("email") as string;
    const password: string = form.get("password") as string;

    await commentPOST("test", content, mbti, name, email, password);

    return {};
}