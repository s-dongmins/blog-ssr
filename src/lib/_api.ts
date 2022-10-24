const apiURL = 'https://api.dongmini.net/';

export interface Post {
	id: string;
	datetime: number;
	hashs: string;
	views: number;
	title: string;
	description: string;
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

export async function commentGET(key: string) {
	const response = await fetch(apiURL + `comment/${key}`);
	const json = await response.json();
	const items: Comment[] = json.Items.sort((a: Comment, b: Comment) => b.datetime - a.datetime);
	return items;
}

export async function commentPOST(
	key: string,
	content: string,
	mbti: string = 'MBTI',
	name: string = '',
	email: string = '',
	password: string
) {
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	const raw = JSON.stringify({
		mbti: mbti,
		name: name,
		email: email,
		content: content,
		password: password
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

export async function postGET(id: string) {
	const response = await fetch(apiURL + `post/${id}`);
	const json = await response.json();
	const item: Post = json.Item;
	return item;
}

export async function postSCAN(page: number = 1, tag: string = '', fullscan: boolean = false) {
	// postSCAN(1, "tag,list,man")
	const response = await fetch(apiURL + 'post');
	const json = await response.json();
	const items: Post[] = json.Items.sort((a: Post, b: Post) => b.datetime - a.datetime);
	if (fullscan) {
		return items;
	}
	const pageCount = 10;
	if (tag === '') {
		items.sort((a, b) => b.datetime - a.datetime);
		return items.slice((page - 1) * pageCount, page * pageCount);
	} else {
		const tagList: string[] = tag.split(',').map((elem) => elem + ',');
		let result: Post[] = items.filter((elem) => {
			let flag = true;
			for (let t of tagList) {
				if (!elem.hashs.includes(t)) {
					flag = false;
				}
			}
			return flag;
		});
		result.sort((a, b) => b.datetime - a.datetime);
		return result.slice((page - 1) * pageCount, page * pageCount);
	}
}

export async function postLENGTH(tag: string = '') {
	const response = await fetch(apiURL + 'post');
	const json = await response.json();
	const items: Post[] = json.Items;
	if (tag === '') {
		return items.length;
	} else {
		const tagList: string[] = tag.split(',').map((elem) => elem + ',');
		let result: Post[] = items.filter((elem) => {
			let flag = true;
			for (let t of tagList) {
				if (!elem.hashs.includes(t)) {
					flag = false;
				}
			}
			return flag;
		});
		return result.length;
	}
}

export interface HashCount {
	[tag: string]: number;
}

export async function hashmapGET(tag: string = '') {
	const posts = await postSCAN(undefined, undefined, true);
	let count: HashCount = {};
	let hashs: string[] = [];
	if (tag === '') {
		for (let p of posts) {
			hashs = p.hashs.slice(0, -1).split(',');
			for (let h of hashs) {
				count[h] = count[h] + 1 || 1;
			}
		}
	} else {
		const tagList: string[] = tag.split(',').map((elem) => elem + ',');
		for (let p of posts.filter((elem) => {
			let flag = true;
			for (let t of tagList) {
				if (!elem.hashs.includes(t)) {
					flag = false;
				}
			}
			return flag;
		})) {
			hashs = p.hashs.slice(0, -1).split(',');
			for (let h of hashs) {
				if (!tagList.includes(h + ',')) {
					count[h] = count[h] + 1 || 1;
				}
			}
		}
	}
	return count;
}
