<template>
	<div class="senior-search">
		<el-card style="min-height: 550px">
			<template #header>高级查询</template>
			<div class="senior-main">
				<div class="side">
					<div class="link">
						<div style="width: 54px;">链接：</div>
						<el-select v-model="method" placeholder="请选择" style="width: 100px;">
							<el-option label="GET" value="GET"></el-option>
							<el-option label="POST" value="POST"></el-option>
							<el-option label="PUT" value="PUT"></el-option>
							<el-option label="DELETE" value="DELETE"></el-option>
						</el-select>
						<el-input v-model="link" style="width: 294px;margin: 0 6px;"></el-input>
						<el-button type="primary" @click="search">搜索</el-button>
					</div>
					<div class="param">
						<div style="width: 54px;">参数：</div>
						<el-input
							v-model="param"
							placeholder="请输入?后参数(key=value&key=value)"
							type="textarea"
							:rows="7"
							v-show="method === 'GET'"
							style="width: 466px;"
						></el-input>
						<monaco-editor v-model="param" height="100%" v-show="method !== 'GET'"></monaco-editor>
					</div>
				</div>
				<div class="senior-content">
					<json-viewer :value="result" :expand-depth="4" copyable sort></json-viewer>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Method } from "axios";
import JsonViewer from "vue-json-viewer";
// 引入monaco
import MonacoEditor from "@/component/MonacoEditor.vue";
// 引入axios
import axios from "@/plugins/axios";
import tipDao from '@/dao/TipDao';
import Tip from "@/entity/Tip";

export default defineComponent({
	data: () => ({
		link: '',
		method: 'GET' as Method,
		param: '',
		result: {},
	}),
	components: { JsonViewer, MonacoEditor },
	methods: {
		async search() {
			let isContinue = await this.tips(this.method, this.link);
			if (isContinue) {
				if (this.method === 'GET') {
					axios({
						url: this.link,
						method: this.method,
						params: this.param
					}).then((response) => {
						this.result = response;
					});
				} else {
					let data = {};
					try {
						data = JSON.parse(this.param);
					} catch (e: any) {
						console.error(e);
						ElMessage.error('JSON格式错误');
					}
					axios({
						url: this.link,
						method: this.method,
						data
					}).then((response) => {
						this.result = response;
					});

				}
			}
		},
		async tips(method: Method, link: string): Promise<boolean> {
			let tips = await tipDao.list();
			for (let tip of tips) {
				if (tip.mode === 1) {
					if (tip.method === method && this.link === link) {
						try {
							await ElMessageBox.confirm('此操作为危险操作，是否继续？', '危险操作提示', {
								confirmButtonText: '继续',
								cancelButtonText: '取消',
								type: 'warning',
							});
							return new Promise((resolve, reject) => {
								resolve(true);
							});
						} catch (e) {
							return new Promise((resolve, reject) => {
								resolve(false);
							});
						}
					}
				} else if (tip.mode === 2) {
					if (tip.method === method && link.indexOf(link) > -1) {
						try {
							await ElMessageBox.confirm('此操作为危险操作，是否继续？', '危险操作提示', {
								confirmButtonText: '继续',
								cancelButtonText: '取消',
								type: 'warning',
							});
							return new Promise((resolve, reject) => {
								resolve(true);
							});
						} catch (e) {
							return new Promise((resolve, reject) => {
								resolve(false);
							});
						}
					}
				}
			}
			return new Promise((resolve, reject) => {
				resolve(true);
			});
		}
	},
});
</script>

<style lang="less">
.senior-search {
	position: absolute;
	top: 10px;
	left: 10px;
	right: 10px;
	bottom: 10px;

	.el-card {
		height: 100%;

		.el-card__body {
			position: absolute;
			top: 70px;
			left: 10px;
			bottom: 10px;
			right: 10px;
		}
	}

	.senior-main {
		position: relative;
		height: 100%;

		.side {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			width: 520px;

			.link {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 32px;
				display: flex;
			}
			.param {
				position: absolute;
				top: 42px;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
			}
		}

		.senior-content {
			position: absolute;
			top: 0;
			left: 540px;
			bottom: 0;
			right: 0;
			overflow: auto;
			padding: 5px;
			border: #f2f2f2 solid 1px;
		}
	}
}

.code-mirror {
	width: 360px;
	height: 300px;
}

.el-dialog__body > .vue-codemirror > .CodeMirror {
	min-height: 420px;
}
</style>