<template>
	<view class="skeleton-wrap" :class="{ 'skeleton-animate': animated }">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'skeleton',
		props: {
			animated: {
				type: Boolean,
				default: true
			}
		}
	}
</script>

<style>
	.skeleton-wrap {
		width: 100%;
	}

	.skeleton-animate {
		animation: skeleton-fade 1.2s ease-in-out infinite;
	}

	@keyframes skeleton-fade {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
</style>
