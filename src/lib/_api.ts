const apiURL = 'https://api.dongmins.com/';

export interface Post {
	id: string;
	datetime: number;
	tags: string[];
	views: number;
	title: string;
	description: string;
	published: boolean;
}

export interface Comment {
	key: string;
	id: string;
	reply: string;
	admin: boolean;
	datetime: number;
	ip: string;
	mbti: string;
	name: string;
	email: string;
	content: string;
}

export interface Visit {
	[key: string]: {
		visit: number;
		uniqueVisitor: number;
	};
}

export async function commentGET(key: string) {
	const response = await fetch(apiURL + `comment/${key}`);
	const json = await response.json();
	const items: Comment[] = json.sort((a: Comment, b: Comment) => b.datetime - a.datetime);
	return items;
}

export async function commentPOST(
	key: string,
	content: string,
	mbti = 'MBTI',
	name = '',
	email = '',
	password: string
) {
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	const raw = JSON.stringify({
		mbti,
		name,
		email,
		content,
		password
	});
	const requestOptions: RequestInit = {
		method: 'POST',
		headers: headers,
		body: raw,
		redirect: 'follow'
	};
	const response = await fetch(apiURL + `comment/${key}`, requestOptions);
	const item: Comment = await response.json();

	return item;
}

export async function commentDELETE(key: string, id: string, password: string) {
	const response = await fetch(apiURL + `comment/${key}/${id}/${password}`, { method: 'DELETE' });
	const status = response.status;
	if (status === 400) {
		return false;
	} else {
		return true;
	}
}

export async function postSCAN() {
	const response = await fetch(apiURL + 'post');
	const items: Post[] = await response.json();
	return items.sort((a, b) => b.datetime - a.datetime);
}

export async function postGET(postid: string) {
	const response = await fetch(apiURL + `post/${postid}`);
	const item: Post = await response.json();
	return item;
}

export function visitPOST(postid: string) {
	fetch(apiURL + `visit/${postid}`);
}

export async function visitGET() {
	const response = await fetch(apiURL + 'visit');
	const items: Visit = await response.json();
	return items;
}
