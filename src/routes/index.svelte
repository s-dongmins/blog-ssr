<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import type { Post } from "$lib/_api";
    import { timeCalc, hashSplitter } from "$lib/_util";

    export let posts: Post[];
</script>

<svelte:head>
    <title>Dongmini Blog</title>
    <meta
        name="description"
        content="00년생 피아노를 잘치는 개발자 신동민 블로그 입니다. 환영해요!"
    />
</svelte:head>

<section class="flex items-center flex-col w-full">
    <div
        class="bg-[url('/main.jpg')] bg-cover sm:w-[40rem] sm:h-[40rem] w-96 h-96 rounded-full border-1 border-slate-900 flex justify-center items-center flex-col shadow-lg shadow-slate-500 mb-20"
    >
        <div class="text-slate-50 text-lg tracking-widest">Dongmin Shin</div>
        <div class="text-slate-50 text-xs font-thin p-1">March 11, 2000</div>
        <a
            class="transition-all ease-in-out text-gray-500 mt-3 p-1 rounded-full backdrop-blur-sm shadow-md shadow-slate-900 hover:-translate-y-2 hover:text-gray-50 hover:shadow-lg hover:shadow-slate-600 hover:p-10"
            href="/guestbook">About me</a
        >
    </div>
    <div class="sm:w-3/5 w-4/5">
        {#each posts as post}
            <div
                class="transition w-full mb-5 shadow-lg hover:shadow-2xl bg-slate-50"
            >
                <a href="/{post.id}">
                    <div class="sm:text-2xl text-xl font-bold p-4">
                        {post.title}
                    </div>
                    <div class="text-sm px-4 mb-1">{post.description}</div>
                    <div class="text-xs px-4">{timeCalc(post.datetime)}</div>
                    <div class="px-4 pb-2">
                        {#each hashSplitter(post.hashs) as h}
                            <span class="text-xs rounded-md px-1 shadow-md"
                                >#{h}</span
                            >
                        {/each}
                    </div>
                </a>
            </div>
        {/each}
    </div>
</section>
