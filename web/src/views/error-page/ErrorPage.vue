<template>
	<div class="error-page">
		<h1 class="code">{{ code }}</h1>
		<p class="desc">{{ desc }}</p>

		<template v-if="token || isLogout">
			<div class="link">
				<el-button type="primary" @click="home">回到首页</el-button>
				<el-button type="primary" @click="back">返回上一页</el-button>
				<el-button type="primary" @click="reLogin">重新登录</el-button>
			</div>
		</template>

		<template v-else>
			<div class="router">
				<el-button round @click="toLogin">返回登录页</el-button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useUserStore()

const props = defineProps({
  code: {
    type: Number,
    default: 404
  },
  desc: String
})

const isLogout = ref<boolean>(false);
const token = computed(() => store.token);

function toLogin() {
  router.push("/login");
}

async function reLogin() {
  isLogout.value = true;
  router.replace('/login')
}

function back() {
  history.back();
}

function home() {
  router.push("/");
}

</script>

<style lang="scss" scoped>
.error-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow-y: auto;

	.code {
		font-size: 120px;
		font-weight: normal;
		color: #6c757d;
		font-family: "Segoe UI";
	}

	.desc {
		font-size: 16px;
		font-weight: 400;
		color: #34395e;
		margin-top: 30px;
	}

	.router {
		display: flex;
		justify-content: center;
		margin-top: 50px;
		max-width: 450px;
		width: 90%;
	}

	.link {
		display: flex;
		margin-top: 40px;

		li {
			font-weight: 500;
			cursor: pointer;
			font-size: 14px;
			margin: 0 20px;
			list-style: none;

			&:hover {
				color: var(--el-color-primary);
			}
		}
	}
}
</style>
