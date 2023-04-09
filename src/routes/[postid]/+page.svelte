<script lang="ts">
	import { fly } from 'svelte/transition';
	import { commentDELETE } from '$lib/_api';
	import { timeCalc } from '$lib/_util';
	import type { Comment, Post } from '$lib/_api';
	import type { PageData } from './$types';

	export const router = false;
	export let data: PageData;

	let post: Post = data.post;
	let postHTML: string = data.postHTML;
	let comments: Comment[] = data.comments;
	let visit: number = data.visit;

	$: {
		post = data.post;
		postHTML = data.postHTML;
		comments = data.comments;
		visit = data.visit;
	}

	let mbti: string;
	let name: string;
	let email: string;
	let content: string;
	let password: string;
	let errorMessage = '';
	let submitLoading = false;

	let deleteTarget = '';
	let deletePassword = '';
	let delerrorMessage = '';
	let deleteLoading = false;

	let errorCount = 0;

	function handleTrashClick(id: string) {
		if (deleteTarget === '' || deleteTarget !== id) {
			deletePassword = '';
			delerrorMessage = '';
			deleteTarget = id;
		} else if (deletePassword === '') {
			deleteTarget = '';
			delerrorMessage = '';
		} else {
			handleDelete();
		}
	}

	function handleSubmit(e: SubmitEvent) {
		name = name ?? '';
		email = email ?? '';
		password = password ?? '';
		if (submitLoading) {
			e.preventDefault();
		} else if (!password) {
			errorMessage = 'Please enter the password';
			errorCount++;
			e.preventDefault();
		} else if (name.length > 10) {
			errorMessage = 'Name is limited to 10 characters or less';
			errorCount++;
			e.preventDefault();
		} else if (!content) {
			errorMessage = 'Please enter the content';
			errorCount++;
			e.preventDefault();
		} else {
			submitLoading = true;
			errorMessage = '';
		}
	}

	async function handleDelete() {
		deletePassword = deletePassword ?? '';
		if (!deletePassword || !deleteTarget) {
			delerrorMessage = 'Please enter the password';
		} else {
			deleteLoading = true;
			if (await commentDELETE(post.id, deleteTarget, deletePassword)) {
				comments = comments.filter((elem: Comment) => elem.id !== deleteTarget);
				deleteTarget = '';
				deletePassword = '';
				deleteLoading = false;
				return;
			} else {
				delerrorMessage = 'Password is wrong';
				deleteLoading = false;
			}
		}
		errorCount++;
	}
</script>

<svelte:head>
	<title>{post.title} - Dongmini Blog</title>
	<meta name="description" content={post.description} />
</svelte:head>

<section class="flex items-center flex-col w-full">
	<div class="w-full text-3xl font-bold p-4">{post.title}</div>
	<div class="w-full px-4">
		{#each post.tags as h}
			<span class="text-xs rounded-md px-1 shadow-md">#{h}</span>
		{/each}
	</div>
	<div class="w-full text-xs px-4 mb-4">
		<span class="mr-3">{timeCalc(post.datetime)}</span>
		<span>views: {visit}</span>
	</div>
	<div class="flex flex-col w-full p-2 text-sm">
		{@html postHTML}
	</div>
	<div class="sm:w-5/6 w-full">
		{#each comments as comment}
			<div class="w-full m-3 relative">
				<div>
					{#if comment.admin}
						<span class="text-sm text-cyan-800 font-semibold">{comment.name}</span>
					{:else if comment.name === 'anonym'}
						<span class="text-sm text-gray-500">{comment.name}</span>
					{:else}
						<span class="text-sm font-semibold">{comment.name}</span>
					{/if}
					{#if comment.mbti !== 'MBTI'}
						<span class="text-[0.5rem] text-slate-500">{comment.mbti}</span>
					{/if}
					{#if comment.email}
						<span class="text-[0.5rem] text-slate-500">{comment.email}</span>
					{/if}
				</div>
				<div class="text-[0.5rem] text-slate-500">
					{timeCalc(comment.datetime)}
				</div>
				<div class="text-sm pl-1 pr-5">
					{comment.content}
				</div>
				<button
					class="absolute sm:right-1 right-8 top-3 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
					on:click={() => handleTrashClick(comment.id)}
				>
					<i class="fa-solid fa-trash text-xs text-slate-500 hover:text-slate-900" />
				</button>
				{#if deleteTarget === comment.id}
					<form
						class="absolute sm:right-7 right-16 top-1"
						action="/{post.id}"
						method="get"
						autocomplete="off"
						transition:fly={{ y: -20 }}
						on:submit|preventDefault={handleDelete}
					>
						{#key errorCount}
							<div class="absolute -top-3 left-2 text-red-700 text-xs" in:fly={{ y: 20 }}>
								{delerrorMessage}
							</div>
						{/key}
						<input
							class="text-xs p-1 m-1 shadow-md opacity-75"
							type="password"
							autocomplete="off"
							placeholder="Input password"
							bind:value={deletePassword}
						/>
						{#if deleteLoading}
							<div class="absolute -top-3 right-3 bg-[url('/loading.gif')] bg-cover w-4 h-4" />
						{/if}
					</form>
				{/if}
			</div>
			<hr />
		{/each}
		<form
			class="text-sm w-full my-10 flex flex-col items-center"
			action="/{post.id}"
			method="post"
			autocomplete="off"
			on:submit={handleSubmit}
		>
			<input type="hidden" id="id" name="id" value={post.id} />
			<div class="m-2">
				<input
					class="p-1 m-1 shadow-md focus:shadow-violet-200"
					type="text"
					id="name"
					name="name"
					placeholder="name"
					bind:value={name}
				/>
				<input
					class="p-1 m-1 shadow-md focus:shadow-violet-200"
					type="email"
					id="email"
					name="email"
					placeholder="email"
					bind:value={email}
				/>
				<input
					class="p-1 m-1 shadow-md focus:shadow-violet-200"
					type="password"
					id="password"
					name="password"
					placeholder="password"
					bind:value={password}
				/>
				<select class="p-1 m-1 focus:shadow-violet-200" id="mbti" name="mbti" bind:value={mbti}>
					<option value="MBTI" selected>MBTI</option>
					<option value="ESTJ">ESTJ</option>
					<option value="ESFJ">ESFJ</option>
					<option value="ENFJ">ENFJ</option>
					<option value="ENTJ">ENTJ</option>
					<option value="ESTP">ESTP</option>
					<option value="ESFP">ESFP</option>
					<option value="ENFP">ENFP</option>
					<option value="ENTP">ENTP</option>
					<option value="ISTP">ISTP</option>
					<option value="ISFP">ISFP</option>
					<option value="INFP">INFP</option>
					<option value="INTP">INTP</option>
					<option value="ISTJ">ISTJ</option>
					<option value="ISFJ">ISFJ</option>
					<option value="INFJ">INFJ</option>
					<option value="INTJ">INTJ</option>
				</select>
			</div>
			{#key errorCount}
				<div in:fly={{ y: -20 }} class="mx-2 text-red-700 text-xs">{errorMessage}</div>
			{/key}

			<div class="w-full m-2">
				<input
					class="w-full h-20 p-1 m-1 shadow-md focus:shadow-violet-200"
					type="text"
					id="content"
					name="content"
					placeholder="Tell anything to me!"
					bind:value={content}
				/>
				<input
					class="transition-all ease-in-out p-1 m-1 rounded-md shadow-md hover:shadow-lg hover:shadow-violet-200 active:shadow-red-200"
					id="submit"
					type="submit"
					value="submit"
				/>
				{#if submitLoading}
					<div class="relative left-16 bottom-6 bg-[url('/loading.gif')] bg-cover w-4 h-4" />
				{/if}
			</div>
		</form>
	</div>
</section>
