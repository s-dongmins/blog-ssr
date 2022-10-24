<script lang="ts">
	import { navigating } from '$app/stores';
	import { scale } from 'svelte/transition';

	let level: number = 0;
	let tick: number = 0;
	let timerID: NodeJS.Timeout;

	function sigmoid(num: number) {
		const e = 2.7182818284590452353602874;
		return (1 / (1 + e ** (-num + 4))) * 100;
	}

	const t_out = (node: HTMLElement, { duration }) => {
		return {
			duration,
			css: (t) => {
				return `
                    width: ${(level + level - 200) * t + 200 - level}%;
                    filter: blur(${t > 0.5 ? 0 : (0.5 - t) * 10}px);
                    opacity: ${t > 0.5 ? 100 : t * 200}%;
                `;
			}
		};
	};

	function control(node: HTMLElement) {
		let dt = 0.5;
		level = 0;
		timerID = setTimeout(function adder() {
			level = sigmoid(tick);
			tick += dt;
			timerID = setTimeout(adder, 100);
			if (tick == 14) {
				clearTimeout(timerID);
			}
		}, 100);
		return {
			destroy() {
				clearTimeout(timerID);
				tick = 0;
			}
		};
	}
</script>

{#if $navigating}
	<div
		class="transition-all ease-in h-1 fixed top-0 left-0 bg-red-700 overflow-hidden"
		style="width: {level}%;"
		out:t_out={{ duration: 1000 }}
		use:control
	/>
	<ul class="fixed top-5 right-3 flex opacity-30" transition:scale>
		<li />
		<li />
		<li />
		<li />
		<li />
		<li />
	</ul>
{/if}

<style>
	ul li {
		width: 3px;
		height: 15px;
		background: rgb(76 29 149);
		margin: 0 2px;
		animation: animate 0.7s infinite alternate;
	}
	ul li:nth-child(1) {
		animation-delay: 0.1s;
	}
	ul li:nth-child(2) {
		animation-delay: 0.2s;
	}
	ul li:nth-child(3) {
		animation-delay: 0.3s;
	}
	ul li:nth-child(4) {
		animation-delay: 0.4s;
	}
	ul li:nth-child(5) {
		animation-delay: 0.5s;
	}
	ul li:nth-child(6) {
		animation-delay: 0.6s;
	}
	@keyframes animate {
		0% {
			transform: scaleY(1);
		}
		25% {
			transform: scaleY(1);
		}
		50% {
			transform: scaleY(1);
		}
		75% {
			transform: scaleY(1);
		}
		100% {
			transform: scaleY(3);
		}
	}
</style>
