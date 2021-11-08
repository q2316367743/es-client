<template>
	<div class="base-search">
		<div class="base-option">
			<div class="el-card es-card is-always-shadow">
				<div class="el-card__header">
					<span>查询条件</span>
					<el-button
						style="
							float: right;
							padding: 3px 13px 3px 0;
							margin-left: 10px;
						"
						type="text"
						@click="is_show = !is_show"
						>{{ is_show ? "收起" : "展开" }}</el-button
					>
					<el-button
						style="float: right; padding: 3px 0"
						type="text"
						@click="search"
						>刷新</el-button
					>
					<el-button
						style="float: right; padding: 3px 0"
						type="text"
						@click="show_body"
						>显示查询语句</el-button
					>
				</div>
				<transition name="el-zoom-in-top">
					<div class="el-card__body" v-show="is_show">
						<el-form
							label-position="top"
							label-width="80px"
							style="overflow: auto"
						>
							<el-form-item label="文档：">
								<el-select
									v-model="index"
									filterable
									placeholder="请选择"
								>
									<el-option
										v-for="item in indices_name"
										:key="item"
										:label="item"
										:value="item"
									>
									</el-option>
								</el-select>
								<el-button
									type="primary"
									style="margin-left: 10px"
									@click="search"
									>搜索</el-button
								>
								<el-button
									style="margin-left: 10px"
									@click="clear"
									>清空</el-button
								>
							</el-form-item>
							<el-form-item
								label="条件："
								style="min-width: 1100px"
							>
								<div
									v-for="(item, idx) in field_condition"
									:key="idx"
									style="margin-bottom: 10px"
								>
									<el-select
										v-model="item.bool"
										filterable
										placeholder="请选择"
									>
										<el-option label="must" value="must">
										</el-option>
										<el-option
											label="must_not"
											value="must_not"
										>
										</el-option>
										<el-option
											label="should"
											value="should"
										>
										</el-option>
									</el-select>
									<el-select
										v-model="item.field"
										filterable
										placeholder="请选择"
										style="margin-left: 10px"
									>
										<el-option
											v-for="(type, field) in indices[
												index
											]"
											:key="field"
											:label="field"
											:value="field"
										>
										</el-option>
									</el-select>
									<el-select
										v-model="item.condition"
										filterable
										placeholder="请选择"
										v-if="
											item.field !== 'match_all' &&
											item.field !== '_all'
										"
										style="margin-left: 10px"
									>
										<el-option label="match" value="match">
										</el-option>
										<el-option
											label="term"
											value="term"
										>
										</el-option>
										<el-option
											label="wildcard"
											value="wildcard"
										>
										</el-option>
										<el-option
											label="prefix"
											value="prefix"
										>
										</el-option>
										<el-option label="fuzzy" value="fuzzy" disabled>
										</el-option>
										<el-option label="range" value="range" disabled>
										</el-option>
										<el-option
											label="query_string"
											value="query_string"
										>
										</el-option>
										<el-option label="text" value="text">
										</el-option>
										<el-option
											label="missing"
											value="missing"
										>
										</el-option>
									</el-select>
									<el-input
										v-model="item.value"
										style="width: 180px; margin-left: 10px"
										v-if="
											item.condition === 'match' ||
											item.condition === 'term' ||
											item.condition === 'wildcard' ||
											item.condition === 'prefix' ||
											item.condition === 'query_string' ||
											item.condition === 'text'
										"
									></el-input>
									<el-button
										type="primary"
										style="margin-left: 10px"
										@click="field_condition_add"
										>新增</el-button
									>
									<el-button
										type="danger"
										@click="field_condition_remove(item.id)"
										>移除</el-button
									>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</transition>
			</div>
		</div>
		<div class="base-content">
			<el-card>
				<json-viewer
					:value="result"
					:expand-depth="4"
					copyable
					sort
				></json-viewer>
			</el-card>
		</div>
		<el-dialog
			title="查询条件"
			:visible.sync="condition_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
		>
			<json-viewer
				:value="condition_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
import JsonViewer from "vue-json-viewer";
// 引入axios
import axios from "axios";
import { buildIndices, buildQuery } from "@/utils/buildUtil";

// 公共方法

export default {
	components: {
		JsonViewer,
	},
	data: () => {
		return {
			is_show: true,
			cluster_stats: {},
			indices: {},
			indices_name: [],
			index: "",
			field_condition: [
				{
					id: new Date().getTime(),
					bool: "must",
					field: "match_all",
					condition: "",
					value: "",
				},
			],
			condition_dialog: false,
			condition_data: {},
			result: {},
		};
	},
	created() {
		cluster_api._cluster_state((res) => {
			this.cluster_stats = res;
			this.indices = buildIndices(res);
			for (let index in this.indices) {
				this.indices_name.push(index);
			}
		});
	},
	methods: {
		field_condition_add() {
			this.field_condition.push({
				id: new Date().getTime(),
				bool: "must",
				field: "match_all",
				condition: "",
				value: "",
			});
		},
		field_condition_remove(id) {
			this.field_condition = this.field_condition.filter((item) => {
				return item.id !== id;
			});
			if (this.field_condition.length === 0) {
				this.field_condition.push({
					id: new Date().getTime(),
					bool: "must",
					field: "match_all",
					condition: "",
					value: "",
				});
			}
		},
		show_body() {
			this.condition_data = buildQuery(this.field_condition);
			this.condition_dialog = true;
		},
		search() {
			if (this.index.length === 0) {
				this.$alert("请选择索引");
				return;
			}
			axios({
				baseURL:
					localStorage.getItem("url") + "/" + this.index + "/_search",
				method: "POST",
				data: buildQuery(this.field_condition),
			}).then((response) => {
				this.result = response.data;
			});
		},
		clear() {
			this.index = "";
			this.field_condition = [
				{
					id: new Date().getTime(),
					bool: "must",
					field: "match_all",
					condition: "",
					value: "",
				},
			];
		},
	},
};
</script>

<style lang="less">
.base-search {
	padding: 10px;
	.base-content {
		margin-top: 20px;
	}
}
</style>