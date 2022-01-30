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
						<el-autocomplete
							v-model="link"
							style="width: 294px;margin: 0 6px;"
							:fetch-suggestions="fetchSuggestions"
							@keyup.enter.native="search"
							@select="handleSelect"
							placeholder="请输入链接"
							clearable
						>
							<template #default="{ item }">
								<div class="value">{{ item }}</div>
							</template>
						</el-autocomplete>
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
import { ElMessage } from "element-plus";
import { Method } from "axios";
import JsonViewer from "vue-json-viewer";
// 引入monaco
import MonacoEditor from "@/component/MonacoEditor.vue";
// 引入axios
import axios from "@/plugins/axios";
import { validateTip } from '@/utils/GlobalUtil';
import LinkProcessor from "./LinkProcessor";

export default defineComponent({
	data: () => ({
		link: '',
		method: 'GET' as Method,
		param: '',
		result: {},
		suggestions: []
	}),
	components: { JsonViewer, MonacoEditor },
	watch: {
		link(newValue) {
			if (newValue === '') {
				this.result = {};
			}
		}
	},
	methods: {
		async search() {
			if (await validateTip(this.method, this.link)) {
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
					if (this.param != '') {
						try {
							data = JSON.parse(this.param);
						} catch (e: any) {
							console.error(e);
							ElMessage.error('JSON格式错误');
						}
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
		fetchSuggestions(queryString: string, cb: (links: string[]) => void) {
			cb(LinkProcessor(queryString));
		},
		handleSelect(item: string) {
			this.link = item;
			this.search()
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