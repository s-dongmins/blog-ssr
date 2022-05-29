<script lang="ts">
    import { scale, fade } from "svelte/transition";
    import { commentDELETE } from "$lib/_api";
    import { timeCalc, hashSplitter } from "$lib/_util";
    import type { Comment } from "$lib/_api";
    import type { Post } from "$lib/_api";

    export let post: Post;
    export let postHTML: string;
    export let comments: Comment[];

    let mbti: string;
    let name: string;
    let email: string;
    let content: string;
    let password: string;
    let deleteTarget: string = "";
    let deletePassword: string = "";
    let errorMessage: string = "";
    let delerrorMessage: string = "";

    function handleTrashClick(id: string) {
        if (deleteTarget === "" || deleteTarget !== id) {
            deletePassword = "";
            delerrorMessage = "";
            deleteTarget = id;
        } else if (deletePassword === "") {
            deleteTarget = "";
            delerrorMessage = "";
        } else {
            handleDelete();
        }
    }

    function handleGETSubmit(e: SubmitEvent) {
        name = name ?? "";
        email = email ?? "";
        password = password ?? "";
        if (!password) {
            errorMessage = "Please enter the password";
            e.preventDefault();
        } else if (name.length > 10) {
            errorMessage = "Name is limited to 10 characters or less";
            e.preventDefault();
        } else if (!content) {
            errorMessage = "Please enter the content";
            e.preventDefault();
        }
    }

    async function handleDelete() {
        deletePassword = deletePassword ?? "";
        if (!deletePassword || !deleteTarget) {
            delerrorMessage = "Please enter the password";
        } else {
            if (await commentDELETE(post.id, deleteTarget, deletePassword)) {
                comments = comments.filter(
                    (elem: Comment) => elem.id !== deleteTarget
                );
                deleteTarget = "";
                deletePassword = "";
            } else {
                delerrorMessage = "Password is wrong";
            }
        }
    }
</script>

<svelte:head>
    <title>{post.title} - Dongmini Blog</title>
    <meta name="description" content={post.description} />
</svelte:head>

<section class="flex items-center flex-col w-full">
    <div class="w-full text-3xl font-bold p-4">{post.title}</div>
    <div class="w-full px-4">
        {#each hashSplitter(post.hashs) as h}
            <span class="text-xs rounded-md px-1 shadow-md">#{h}</span>
        {/each}
    </div>
    <div class="w-full text-xs px-4 mb-4">
        <span class="mr-3">{timeCalc(post.datetime)}</span>
        <span>views: {post.views}</span>
    </div>
    <div class="flex flex-col w-full p-2 text-sm">
        {@html postHTML}
    </div>
    <div class="sm:w-5/6 w-full">
        {#each comments as comment}
            <div class="w-full m-3 relative">
                <div>
                    {#if comment.admin}
                        <span class="text-sm text-cyan-800 font-semibold"
                            >{comment.name}</span
                        >
                    {:else if comment.name === "anonym"}
                        <span class="text-sm text-gray-500">{comment.name}</span
                        >
                    {:else}
                        <span class="text-sm font-semibold">{comment.name}</span
                        >
                    {/if}
                    {#if comment.mbti !== "MBTI"}
                        <span class="text-[0.5rem] text-slate-500"
                            >{comment.mbti}</span
                        >
                    {/if}
                    {#if comment.email}
                        <span class="text-[0.5rem] text-slate-500"
                            >{comment.email}</span
                        >
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
                    <i
                        class="fa-solid fa-trash text-xs text-slate-500 hover:text-slate-900"
                    />
                </button>
                {#if deleteTarget === comment.id}
                    <form
                        class="absolute sm:right-7 right-16 top-1"
                        action="/{post.id}"
                        method="get"
                        transition:scale
                        on:submit|preventDefault={handleDelete}
                    >
                        <span class="text-red-700 text-xs"
                            >{delerrorMessage}</span
                        >
                        <input
                            class="text-xs p-1 m-1 shadow-md opacity-75"
                            type="password"
                            placeholder="Input password"
                            bind:value={deletePassword}
                        />
                    </form>
                {/if}
            </div>
            <hr />
        {/each}
        <form
            class="text-sm w-full my-10 flex flex-col"
            action="/{post.id}"
            method="post"
            on:submit={handleGETSubmit}
        >
            <input type="hidden" id="id" name="id" value={post.id} />
            <div class="m-2">
                <input
                    class="p-1 m-1 shadow-md"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="name"
                    bind:value={name}
                />
                <input
                    class="p-1 m-1 shadow-md"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    bind:value={email}
                />
                <input
                    class="p-1 m-1 shadow-md"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    bind:value={password}
                />
                <select class="p-1 m-1" id="mbti" name="mbti" bind:value={mbti}>
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
            <div class="mx-2 text-red-700 text-xs">{errorMessage}</div>
            <div class="w-full m-2">
                <input
                    class="w-full h-20 p-1 m-1 shadow-md"
                    type="text"
                    id="content"
                    name="content"
                    placeholder="Tell anything to me!"
                    bind:value={content}
                />
                <input
                    class="transition-all ease-in-out p-1 m-1 rounded-md shadow-md hover:shadow-xl hover:shadow-violet-200"
                    id="submit"
                    type="submit"
                    value="submit"
                />
            </div>
        </form>
    </div>
</section>
