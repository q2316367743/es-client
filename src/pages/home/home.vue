<template>
	<div>
		<div class="home-option"></div>
		<div class="home-main">
			<div class="card" v-for="(index, key) in indices" :key="key">
				<div class="title">{{ index.name }}</div>
				<div class="detail">
					<div>
						size:
						{{ index.size }}
					</div>
					<div>docs: {{ index.docs }}</div>
				</div>
				<div class="option">
					<el-dropdown>
						<el-button type="primary" size="mini">
							信息<i
								class="el-icon-arrow-down el-icon--right"
							></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="showStatsByIndexName(index.name)"
								>索引状态</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="
									showMetadataByIndexName(index.name)
								"
								>索引信息</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
					<el-dropdown style="margin-left: 10px">
						<el-button type="primary" size="mini">
							动作<i
								class="el-icon-arrow-down el-icon--right"
							></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="new_alias(index.name)"
								>新建别名</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="refresh(index.name)"
								>刷新</el-dropdown-item
							>
							<el-dropdown-item>Flush刷新</el-dropdown-item>
							<el-dropdown-item>ForceMerge</el-dropdown-item>
							<el-dropdown-item>网关快照</el-dropdown-item>
							<el-dropdown-item>测试分析器</el-dropdown-item>
							<el-dropdown-item>关闭</el-dropdown-item>
							<el-dropdown-item
								@click.native="remove_index(index.name)"
								>删除</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div class="alias">
					<el-tag
						v-for="(item, idx) in getAliasByIndexName(index.name)"
						:key="idx"
						closable
						style="margin-right: 5px"
						@close="remove_alias(index.name, item)"
						>{{ item }}</el-tag
					>
				</div>
			</div>
		</div>
		<el-dialog
			:title="index_name"
			:visible.sync="stats_index_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
		>
			<json-viewer
				:value="stats_index_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			:title="index_name"
			:visible.sync="cluster_stats_metadata_index_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
		>
			<json-viewer
				:value="cluster_stats_metadata_index_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
import index_api from "@/apis/index.js";
import { prettyDataUnit } from "@/utils/fieldUtil";
import JsonViewer from "vue-json-viewer";

export default {
	components: {
		JsonViewer,
	},
	data: () => {
		let url = localStorage.getItem("url");
		if (!url) {
			url = "";
		}
		return {
			url: url,
			stats: {
				indices: {},
			},
			cluster_stats: {
				metadata: {
					indices: {},
				},
			},
			indices: [],
			alias: {},
			index_name: "",
			stats_index_data: {},
			stats_index_dialog: false,
			cluster_stats_metadata_index_data: "",
			cluster_stats_metadata_index_dialog: false,
		};
	},
	created() {
		// 获取状态
		this.init();
	},
	methods: {
		init() {
			cluster_api._stats((res) => {
				this.stats = res;
				cluster_api._cluster_state((res) => {
					this.cluster_stats = res;
					this.$parent.cluster_name = res.cluster_name;
					for (let key in this.stats.indices) {
						this.indices.push({
							name: key,
							original_size:
								this.stats.indices[key].total.store
									.size_in_bytes,
							size: prettyDataUnit(
								this.stats.indices[key].total.store
									.size_in_bytes
							),
							docs: this.stats.indices[key].total.docs.count,
						});
					}
				});
			});
		},
		prettyDataUnit,
		showStatsByIndexName(index_name) {
			this.index_name = index_name;
			this.stats_index_data = this.stats.indices[index_name];
			this.stats_index_dialog = true;
		},
		showMetadataByIndexName(index_name) {
			this.index_name = index_name;
			this.cluster_stats_metadata_index_data =
				this.cluster_stats.metadata.indices[index_name];
			this.cluster_stats_metadata_index_dialog = true;
		},
		getAliasByIndexName(index_name) {
			let index = this.cluster_stats.metadata.indices[index_name];
			if (index) {
				return index.aliases;
			}
			return [];
		},
		new_alias(index) {
			this.$prompt("请输入新别名", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(({ value }) => {
					index_api.new_alias(index, value, (res) => {
						this.$alert(JSON.stringify(res));
						this.init();
					});
				})
				.catch(() => {});
		},
		remove_alias(index, alias) {
			console.log(index, alias);
			this.$confirm("此操作将永久删除该别名, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					index_api.remove_alias(index, alias, (res) => {
						this.$alert(JSON.stringify(res));
						this.init();
					});
				})
				.catch(() => {});
		},
		refresh(index) {
			index_api._refresh(index, (res) => {
				this.$alert(JSON.stringify(res));
				this.init();
			});
		},
		remove_index(index) {
			this.$confirm("此操作将永久删除该索引, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					index_api.remove(index, (res) => {
						this.$alert(JSON.stringify(res));
						this.init();
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="less" scpoed>
.card {
	margin: 5px;
	padding: 10px;
	border: #e3e6ec solid 1px;
	border-radius: 5px;
	position: relative;
	.title {
		font-size: 24px;
		font-weight: bold;
	}
	.detail {
		margin-top: 10px;
	}
	.option {
		position: absolute;
		top: 28px;
		right: 12px;
	}
	.alias {
		position: absolute;
		top: 28px;
		right: 212px;
	}
}
</style>