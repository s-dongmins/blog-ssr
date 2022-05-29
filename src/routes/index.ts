import type { RequestHandler } from "@sveltejs/kit";
import { postSCAN } from "$lib/_api";


export const get: RequestHandler = async () => {
    const response = await postSCAN();
    return {
        body: {
            posts: response
        }
    };
}