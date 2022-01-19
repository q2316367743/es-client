<template>
	<div>
		<div class="home-option">
			<div style="display: flex">
				<el-input v-model="condition.name" placeholder="请输入索引名称" style="width: 300px" @input="search"></el-input>
				<el-select
					v-model="condition.order"
					placeholder="请选择"
					style="margin-left: 5px"
					@change="search"
				>
					<el-option label="名称正序(A-Z)" value="NAME_ASC"></el-option>
					<el-option label="名称倒序(Z-A)" value="NAME_DESC"></el-option>
					<el-option label="大小正序" value="SIZE_ASC"></el-option>
					<el-option label="大小倒序" value="SIZE_DESC"></el-option>
					<el-option label="文档正序" value="DOC_ASC"></el-option>
					<el-option label="文档倒序" value="DOC_DESC"></el-option>
				</el-select>
				<el-button type="primary" style="margin-left: 5px" @click="search">搜索</el-button>
			</div>
			<div style="margin-right: 15px;display: flex;">
				<el-dropdown split-button @click="init" @command="set_interval">
					刷新
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item :command="5000">每隔5秒</el-dropdown-item>
							<el-dropdown-item :command="30000">每隔30秒</el-dropdown-item>
							<el-dropdown-item :command="60000">每隔一分钟</el-dropdown-item>
							<el-dropdown-item :command="-1">取消刷新</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<el-button type="primary" style="margin-left: 10px">新建索引</el-button>
			</div>
		</div>
		<div class="home-main" v-loading="index_loading">
			<index-view v-for="view, index in show_indices" :index="view" :key="index"></index-view>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { ElLoading } from 'element-plus'

import Builder from './Builder';
import index_api from "@/api/index";
import { check_route } from "@/plugins/route";
import { useUrlStore } from '@/store/UrlStore';

import { Index } from "@/view/Index";

import IndexView from "./component/IndexView.vue";
import { mapState } from 'pinia';

export default defineComponent({
	components: {
		IndexView
	},
	data: () => {
		return {
			// 全部索引
			indices: [] as Array<Index>,
			// 根据条件过滤后的索引
			show_indices: [] as Array<Index>,
			// 搜索条件
			condition: {
				name: "",
				order: "NAME_ASC",
			},
			// 定时器
			interval: {} as NodeJS.Timer | null,
			// 列表加载中
			index_loading: false
		};
	},
	computed: {
		...mapState(useUrlStore, ['url'])
	},
	created() {
		// 获取状态
		if (this.url !== '') {
			this.init();
		}
	},
	watch: {
		url() {
			console.log('状态刷新')
			this.init();
		}
	},
	methods: {
		// 初始化状态
		init() {
			// 初始化时加载
			const loading = ElLoading.service({
				lock: true,
				text: '获取索引信息中',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			Builder(this.url).then((indices) => {
				this.indices = indices;
				// 初始化
				this.condition = {
					name: "",
					order: "NAME_ASC",
				};
				this.show_indices = this.indices.sort((a, b) => {
					return a.name.localeCompare(b.name, "zh-CN");
				});
				this.$nextTick(() => {
					loading.close();
				})
			}).catch(() => {
				loading.close();
			})
		},
		set_interval(millisecond: number) {
			if (millisecond === -1) {
				this.clear_interval();
				return;
			}
			ElMessage({
				message: `开始每隔${millisecond / 1000}秒刷新一次`,
				type: "success",
			});
			this.init();
			this.interval = setInterval(() => {
				console.log(check_route("home"))
				if (check_route("home")) {
					this.init();
				} else {
					this.clear_interval();
				}
			}, millisecond);
		},
		clear_interval() {
			ElMessage({
				message: "取消刷新",
				type: "success",
			});
			clearInterval(Number(this.interval));
			this.interval = null;
		},
		/**
		 * 新建索引别名
		 * @param name 索引名称
		 */
		new_alias(name: string) {
			ElMessageBox.prompt("请输入新别名", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			}).then(({ value }) => {
				index_api.new_alias(name, value, (res: object) => {
					ElMessageBox.alert(JSON.stringify(res));
					this.init();
				});
			});
		},
		/**
		 * 移除索引别名
		 * 
		 * @param name 索引名称
		 * @param alias 别名
		 */
		remove_alias(name: string, alias: string) {
			ElMessageBox.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				index_api.remove_alias(name, alias, (res: object) => {
					ElMessageBox.alert(JSON.stringify(res));
					this.init();
				});
			});
		},
		/**
		 * 基于当前索引数组进行过滤
		 */
		search() {
			this.index_loading = true;
			this.show_indices = this.indices.filter((item) => {
				return item.name.indexOf(this.condition.name) > -1;
			});
			// 排序
			switch (this.condition.order) {
				case "NAME_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.name.localeCompare(b.name, "zh-CN");
					});
					break;
				case "NAME_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.name.localeCompare(a.name, "zh-CN");
					});
					break;
				case "SIZE_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.original_size - b.original_size;
					});
					break;
				case "SIZE_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.original_size - a.original_size;
					});
					break;
				case "DOC_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.doc_count - b.doc_count;
					});
					break;
				case "DOC_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.doc_count - a.doc_count;
					});
					break;
			}
			this.$nextTick(() => {
				this.index_loading = false;
			})
		},
	},
});
</script>

<style lang="less">
.home-option {
	position: absolute;
	top: 15px;
	left: 10px;
	right: 10px;
	height: 40px;
	display: flex;
	justify-content: space-between;
}

.home-main {
	position: absolute;
	top: 60px;
	left: 5px;
	right: 5px;
	bottom: 5px;
	overflow: auto;
}
</style>