<!--
  Copyright 2026 南京校团团科技有限公司

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

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
