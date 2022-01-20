<template>
	<div id="app">
		<div class="menu">
			<div class="logo">ES-client</div>
			<el-menu :default-active="active" style="height: 100%" @select="select_menu">
				<el-menu-item index="home">
					<el-icon>
						<home-filled />
					</el-icon>
					<template #title>{{ $t('app.menu.home') }}</template>
				</el-menu-item>
				<el-menu-item index="base_search">
					<el-icon>
						<search />
					</el-icon>
					<template #title>{{ $t('app.menu.base_search') }}</template>
				</el-menu-item>
				<el-menu-item index="senior_search">
					<el-icon>
						<data-board />
					</el-icon>
					<template #title>{{ $t('app.menu.senior_search') }}</template>
				</el-menu-item>
				<el-menu-item index="sql_search">
					<el-icon>
						<coin />
					</el-icon>
					<template #title>{{ $t('app.menu.sql_search') }}</template>
				</el-menu-item>
				<el-menu-item index="setting">
					<el-icon>
						<operation />
					</el-icon>
					<template #title>{{ $t('app.menu.setting') }}</template>
				</el-menu-item>
			</el-menu>
			<div class="author">
				<div style="margin-top: 5px">
					<el-link>意见反馈</el-link>
				</div>
				<div style="margin-top: 5px">
					<el-link @click="about_dialog = true">v0.4.3</el-link>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="top">
				<div class="app-option">
					<el-select
						v-model="url"
						class="m-2"
						:placeholder="$t('app.link_placeholder')"
						style="padding-top: 9px;"
						@change="select_url"
					>
						<el-option v-for="url in urls" :key="url.id" :label="url.name" :value="url.value"></el-option>
					</el-select>
					<el-button>{{$t('app.connect')}}</el-button>
					<div class="cluster-name">{{ cluster_name }}</div>
				</div>
				<!-- 各种信息弹框 -->
				<info></info>
			</div>
			<div class="content">
				<home v-show="active === 'home'"></home>
				<base_search v-show="active === 'base_search'"></base_search>
				<senior_search v-show="active === 'senior_search'"></senior_search>
				<sql_search v-show="active === 'sql_search'"></sql_search>
				<setting v-show="active === 'setting'"></setting>
			</div>
		</div>
		<el-dialog
			title="关于"
			v-model="about_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<about></about>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { useUrlStore } from "./store/UrlStore";
// 引入页面组件
import about from "@/page/about/about.vue";
import setting from '@/page/setting/setting.vue'
import Info from '@/component/Info.vue';

// 页面
import home from '@/page/home/home.vue';

import { defineComponent } from 'vue';
import { mapState } from "pinia";
import { Fold, Expand, HomeFilled, Search, Operation, Coin, DataBoard } from '@element-plus/icons-vue';


export default defineComponent({
	components: {
		Info, about, setting, home, Fold, Expand, HomeFilled, Search, Operation, Coin, DataBoard
	},
	data: () => {
		return {
			active: "home",
			url: "",
			load: true,
			cluster_name: "",
			about_dialog: false
		};
	},
	computed: {
		...mapState(useUrlStore, ['urls'])
	},
	created() {
		useUrlStore().reset();
	},
	methods: {
		select_url(value: string) {
			useUrlStore().choose(value);
			// 刷新组件
			this.load = false;
			this.$nextTick(() => {
				this.load = true;
			})
		},
		select_menu(index: string) {
			// 切换url的hash值
			// 切换active
			this.active = index;
		}
	},
});
</script>

<style lang="less">
#app {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	.menu {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 200px;

		.logo {
			width: 100%;
			text-align: center;
			font-weight: bold;
			font-size: 24px;
			height: 50px;
			line-height: 50px;
		}

		.author {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 20px;
			text-align: center;
			font-size: 14px;
			color: #3d3d3d;
		}
	}

	.main {
		position: absolute;
		top: 0;
		left: 200px;
		right: 0;
		bottom: 0;

		.top {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 50px;
			line-height: 50px;
			display: grid;
			grid-template-columns: 1fr 100px;
			grid-template-rows: 50px;

			.app-option {
				display: flex;
				margin-left: 5px;

				.el-input {
					margin-left: 5px;
				}

				.el-button {
					margin-left: 14px;
					margin-top: 9px;
				}

				.cluster-name {
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					margin-left: 10px;
				}
			}
		}

		.content {
			position: absolute;
			top: 50px;
			left: 0;
			right: 0;
			bottom: 0;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
}
</style>
