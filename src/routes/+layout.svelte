<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';

	import Progress from '$lib/progress/Progress.svelte';
	import '../app.css';
	import { timeCalc } from '$lib/_util';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let posts = [...data.posts];

	interface Tags {
		[tag: string]: number;
	}

	let tags: Tags = {};
	let selectTags: string[] = [];
	tagSet();

	function tagSet() {
		let tempTags: Tags = {};
		if (selectTags.length === 0) {
			for (let post of posts) {
				for (let t of post.tags) {
					if (tempTags[t]) {
						tempTags[t] += 1;
					} else {
						tempTags[t] = 1;
					}
				}
			}
		} else {
			for (let post of tagFiltering()) {
				for (let t of post.tags) {
					if (tempTags[t]) {
						tempTags[t] += 1;
					} else {
						tempTags[t] = 1;
					}
				}
			}
		}
		tags = tempTags;
	}

	function tagFiltering() {
		return data.posts.filter((post) => {
			let flag = true;
			for (let t of selectTags) {
				if (!post.tags.includes(t)) {
					flag = false;
					break;
				}
			}
			return flag;
		});
	}

	function handleTags(tag: string) {
		if (selectTags.includes(tag)) {
			selectTags.splice(selectTags.indexOf(tag), 1);
			selectTags = selectTags;
		} else {
			selectTags = [...selectTags, tag];
		}
		posts = tagFiltering();
		tagSet();
	}
</script>

<Progress />

<div class="flex flex-col items-center">
	<div class="font-thin text-sm mb-2">Next time, I'll be the lead</div>
	<a class="font-bold sm:text-6xl text-4xl tracking-widest" href="/">Dongmins' Blog</a>
</div>
<header class="w-auto mx-20 mb-7 px-5 py-2 shadow-lg bg-slate-100 flex justify-center items-center">
	<nav>
		<a
			class="mx-2 text-slate-900 sm:text-sm text-xs"
			href="https://facebook.com/people/%EC%8B%A0%EB%8F%99%EB%AF%BC/100004892382680/"
		>
			<i class="fa-brands fa-facebook-f" />
		</a>
		<a class="mx-2 text-slate-900 sm:text-sm text-xs" href="https://instagram.com/s_dongmini/"
			><i class="fa-brands fa-instagram" />
		</a>
		<a class="mx-2 text-slate-900 sm:text-sm text-xs" href="https://github.com/s-dongmini"
			><i class="fa-brands fa-github" />
		</a>
	</nav>
</header>

<div class="flex flex-col items-center overflow-x-hidden w-full">
	<main class="w-full sm:w-4/5 lg:w-3/5 border-x">
		<slot />
		<div class="flex flex-wrap mb-10">
			{#each Object.keys(tags) as tag (tag)}
				<button
					class="text-xs rounded-full px-2 py-1 m-1 shadow-md {selectTags.includes(tag)
						? 'bg-violet-600 shadow-lg text-white shadow-violet-300'
						: 'bg-slate-50'}"
					on:click={() => handleTags(tag)}
					in:fly={{ y: -20 }}
					out:scale
					animate:flip={{ duration: 300, easing: quintOut }}
				>
					#{tag}
					{tags[tag]}
				</button>
			{/each}
		</div>
		<div class="w-full flex flex-col items-center">
			{#each posts as post}
				<div class="transition w-5/6 mb-5 shadow-lg hover:shadow-2xl bg-slate-50">
					<a href="/{post.id}">
						<div class="sm:text-2xl text-xl font-bold p-4">
							{post.title}
						</div>
						<div class="text-sm px-4 mb-1">{post.description}</div>
						<div class="text-xs px-4">{timeCalc(post.datetime)}</div>
						<div class="px-4 pb-2">
							{#each post.tags as t}
								<span
									class="text-xs rounded-full px-2 py-1 shadow-md {selectTags.includes(t)
										? 'bg-violet-600 shadow-lg text-white shadow-violet-300'
										: 'bg-slate-50'}">#{t}</span
								>
							{/each}
						</div>
					</a>
				</div>
			{/each}
		</div>
	</main>
	<footer class="mt-20 mb-3 text-center">
		<p class="text-xs text-gray-600 font-light">shin@dongmins.com</p>
		<p class="text-xs text-gray-600 font-light">dongmini@hanyang.ac.kr</p>
	</footer>
</div>
