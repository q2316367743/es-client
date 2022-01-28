<template>
	<div class="senior-search">
		<el-card style="min-height: 550px">
			<template #header>高级查询</template>
			<div class="senior-main">
				<div class="senior-side">
					<el-form>
						<el-form-item label="链接：">
							<el-input v-model="link"></el-input>
						</el-form-item>
						<el-form-item label="方式：">
							<el-select v-model="method" placeholder="请选择">
								<el-option label="GET" value="GET"></el-option>
								<el-option label="POST" value="POST"></el-option>
								<el-option label="PUT" value="PUT"></el-option>
								<el-option label="DELETE" value="DELETE"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="参数：">
							<div class="code-mirror" ref="code_mirror">
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="success" @click="condition_dialog = true">全屏显示</el-button>
							<el-button @click="format">格式化</el-button>
							<el-button type="primary" @click="search">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="senior-content">
					<json-viewer :value="result" :expand-depth="4" copyable sort></json-viewer>
				</div>
			</div>
			<el-dialog
				title="查询条件"
				v-model="condition_dialog"
				width="70%"
				append-to-body
				top="7vh"
				:close-on-click-modal="false"
				v-if="condition_dialog"
			>
				<codemirror v-model="param" :options="options"></codemirror>
				<div slot="footer">
					<el-button @click="format">格式化</el-button>
					<el-button type="primary" @click="search">搜索</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
// 引入CodeMirror
import codemirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/idea.css";
// 语法高亮
import "codemirror/mode/javascript/javascript.js";
// 引入axios
import axios from "@/plugins/axios";
import { Method } from "axios";
import JsonViewer from "vue-json-viewer";

export default defineComponent({
	data: () => ({
		link: '',
		method: 'GET' as Method,
		param: '',
		options: {
			tabSize: 4, // 缩进格式
			theme: "idea", // 主题，对应主题库 JS 需要提前引入
			lineNumbers: true, // 显示行号
			line: true,
			mode: "javascript",
			smartIndent: true,
			styleActiveLine: true, // 高亮选中行
			showCursorWhenSelecting: true,
			hintOptions: {
				completeSingle: true, // 当匹配只有一项的时候是否自动补全
			},
		},
		result: {},
		condition_dialog: false,
	}),
	components: { JsonViewer, codemirror },
	methods: {
		format() {
			try {
				if (this.param.length === 0) {
					return;
				}
				this.param = JSON.stringify(JSON.parse(this.param), null, 4);
			} catch (error) {
				ElMessage.error("格式化错误");
			}
		},
		search() {
			this.condition_dialog = false;
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
				this.result = response.data;
			});
		},
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

		.senior-side {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			width: 420px;

			.senior-side-item {
				display: flex;
				margin-bottom: 10px;

				.senior-item-label {
					width: 60px;
					line-height: 40px;
				}

				.el-input {
					width: 360px;
				}

				.el-textarea {
					width: 360px;
				}
			}
		}

		.senior-content {
			position: absolute;
			top: 0;
			left: 440px;
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