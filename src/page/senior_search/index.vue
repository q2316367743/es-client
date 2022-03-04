<template>
	<div class="senior-search">
		<el-card style="min-height: 550px">
			<template #header>
				<div style="display: flex;justify-content: space-between;">
					<div>{{ $t('senior_search.senior_search') }}</div>
					<el-select v-model="view">
						<el-option label="基础视图" :value="1"></el-option>
						<el-option label="JSON视图" :value="2"></el-option>
						<el-option label="表格视图" :value="3" disabled></el-option>
					</el-select>
				</div>
			</template>
			<div class="senior-main">
				<!-- 左面查询条件 -->
				<div class="side" :style="{ width: senior_width + 'px' }">
					<!-- 链接选择 -->
					<div class="link">
						<div
							style="min-width: 54px;width: 54px;height: 32px;line-height: 32px;"
						>{{ $t('senior_search.link') }}</div>
						<el-select
							v-model="method"
							:placeholder="$t('senior_search.please_select')"
							style="min-width: 100px;width: 100px;"
						>
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
							:placeholder="$t('senior_search.please_enter_a_link')"
							clearable
						>
							<template #default="{ item }">
								<div class="value">{{ item }}</div>
							</template>
						</el-autocomplete>
						<el-button
							type="primary"
							@click="search"
						>{{ link.indexOf('search') > -1 ? $t('senior_search.search') : $t('senior_search.execute') }}</el-button>
					</div>
					<!-- 请求参数 -->
					<div class="param">
						<div class="label">参数：</div>
						<div class="param-content">
							<div class="get" v-show="method === 'GET'">
								<el-button type="primary" @click="addGetParam">{{ $t('senior_search.add') }}</el-button>
								<el-button @click="truncateGetParam">{{ $t('senior_search.clear') }}</el-button>
								<div class="item" v-for="(param, index) in get_params" :key="index">
									<el-input v-model="param.key" :placeholder="$t('senior_search.please_enter_key')"></el-input>
									<div style="text-align: center;">=</div>
									<el-input v-model="param.value" :placeholder="$t('senior_search.please_enter_value')"></el-input>
									<div></div>
									<el-button type="danger" @click="removeGetParam(param.id)">{{ $t('senior_search.remove') }}</el-button>
								</div>
							</div>
							<monaco-editor v-model="params" height="100%" v-show="method !== 'GET'" class="post"></monaco-editor>
						</div>
					</div>
				</div>
				<div
					class="senior-bar"
					:style="{ left: senior_width + 10 + 'px' }"
					@mousedown="onMouseDown"
				></div>
				<!-- 右面展示内容 -->
				<div class="senior-content" :style="{ left: senior_width + 20 + 'px' }">
					<el-scrollbar>
						<base-viewer v-if="view === 1" :data="result"></base-viewer>
						<json-viewer v-else-if="view === 2" :value="result" :expand-depth="4" copyable sort></json-viewer>
					</el-scrollbar>
				</div>
			</div>
		</el-card>
		<el-backtop target=".senior-content" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { Method } from "axios";
import JsonViewer from "vue-json-viewer";
import BaseViewer from "@/components/BaseViewer.vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import axios from "@/plugins/axios";
import { validateTip } from '@/utils/GlobalUtil';

import LinkProcessor from "./LinkProcessor";
import Param from '@/view/Param'
import getParamBuild from "@/build/GetParamBuild";
import { mapState } from "pinia";
import { useSettingStore } from "@/store/SettingStore";

export default defineComponent({
	name: 'SeniorSearch',
	data: () => ({
		link: '',
		method: 'POST' as Method,
		params: '',
		result: {},
		suggestions: [],
		// GET请求参数
		get_params: new Array<Param>(),
		view: 2,
		is_down: false,
		max_width: 520
	}),
	components: { JsonViewer, BaseViewer, MonacoEditor },
	computed: { ...mapState(useSettingStore, ['senior_width']) },
	watch: {
		link(newValue) {
			if (newValue === '') {
				this.result = {};
			}
		}
	},
	mounted() {
		const side_width = 250;
		const side_min_width = 270;
		const right_min_width = 200;
		// 获取最大宽度
		this.max_width = window.outerWidth - side_width - right_min_width;
		window.onmousemove = (ev: MouseEvent): void => {
			if (this.is_down == false) {
				return;
			}
			const nx = ev.clientX - side_width;
			if (nx > side_min_width && nx < this.max_width) {
				useSettingStore().setSeniorWidth(nx);
			}
		};
		window.onresize = (): void => {
			this.max_width = window.outerWidth - side_width - right_min_width;
			if (this.senior_width > this.max_width) {
				useSettingStore().setSeniorWidth(this.max_width);
			}
			if (this.senior_width < side_min_width) {
				useSettingStore().setSeniorWidth(270);
			}
		};
		window.onmouseup = (): void => {
			this.is_down = false;
		}
	},
	beforeUnmount() {
		window.onmousemove = null;
		window.onresize = null;
		window.onmouseup = null;
	},
	methods: {
		async search() {
			if (await validateTip(this.method, this.link)) {
				if (this.method === 'GET') {
					axios({
						url: this.link,
						method: this.method,
						params: getParamBuild(this.get_params)
					}).then((response) => {
						this.result = response;
					});
				} else {
					let data = {};
					if (this.params != '') {
						try {
							data = JSON.parse(this.params);
						} catch (e: any) {
							console.error(e);
							ElMessage.error(this.$t('senior_search.json_format_error'));
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
		handleSelect(item: any) {
			this.link = item;
		},
		addGetParam() {
			this.get_params.push({
				id: new Date().getTime(),
				key: '',
				value: ''
			});
		},
		removeGetParam(id: number) {
			this.get_params = this.get_params.filter(e => e.id !== id);
		},
		truncateGetParam() {
			this.get_params = new Array<Param>();
		},
		onMouseDown() {
			this.is_down = true;
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

		.side {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;

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
				overflow-y: auto;
				.label {
					position: absolute;
					top: 0px;
					left: 0px;
					width: 54px;
					height: 32px;
					line-height: 32px;
				}
				.param-content {
					position: absolute;
					top: 0px;
					left: 54px;
					right: 0px;
					bottom: 0px;
					overflow: hidden;
					.get {
						width: 466px;
						.item {
							display: grid;
							grid-template-rows: 1fr;
							grid-template-columns: 0.5fr 26px 1fr 12px auto;
							margin-top: 12px;
						}
					}
					.post {
						padding-top: 5px;
					}
				}
			}
		}

		.senior-bar {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 9px;
			border-left: var(--el-card-border-color) solid 1px;
			cursor: ew-resize;
		}

		.senior-content {
			position: absolute;
			top: 0;
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