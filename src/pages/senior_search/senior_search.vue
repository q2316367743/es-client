<template>
	<div class="senior-search">
		<el-card>
			<div slot="header">高级查询</div>
			<div class="senior-main">
				<div class="senior-side">
					<div class="senior-side-item">
						<div class="senior-item-label">链接：</div>
						<el-input v-model="url"></el-input>
					</div>
					<div class="senior-side-item">
						<div class="senior-item-label">方式：</div>
						<el-select v-model="method" placeholder="请选择">
							<el-option label="GET" value="GET"> </el-option>
							<el-option label="POST" value="POST"> </el-option>
							<el-option label="PUT" value="PUT"> </el-option>
							<el-option label="DELETE" value="DELETE">
							</el-option>
						</el-select>
					</div>
					<div class="senior-side-item">
						<div class="senior-item-label">参数：</div>
						<div class="code-mirror" ref="code_mirror">
							<codemirror
								v-model="param"
								:options="options"
							></codemirror>
						</div>
					</div>
					<div class="senior-side-item">
						<div class="senior-item-label"></div>
						<div>
							<el-button @click="format">格式化</el-button>
							<el-button type="primary" @click="search"
								>搜索</el-button
							>
						</div>
					</div>
				</div>
				<div class="senior-content">
					<code>
						<pre>{{ result }}</pre>
					</code>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
// 引入CodeMirror
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/idea.css";
// 语法高亮
import "codemirror/mode/javascript/javascript.js";
// 引入axios
import axios from "axios";

export default {
	data: () => {
		return {
			url: localStorage.getItem("url"),
			method: "GET",
			param: "",
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
			result: "",
		};
	},
	components: {
		codemirror,
	},
	methods: {
		format() {
			try {
				this.param = JSON.stringify(JSON.parse(this.param), null, 4);
			} catch (error) {
				this.$message({
					message: "格式化错误",
					type: "error",
				});
			}
		},
		search() {
			try {
				axios({
					baseURL: this.url,
					method: this.method,
					data: JSON.parse(this.param),
				}).then((response) => {
					this.result = JSON.stringify(response.data, null, 4);
				});
			} catch (error) {
				this.$message({
					message: "JSON格式错误",
					type: "error",
				});
			}
		},
	},
};
</script>

<style lang="less">
.senior-search {
	padding: 10px;
	height: 100%;
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
</style>