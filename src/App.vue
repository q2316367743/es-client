<template>
	<div id="app">
		<div class="menu">
			<div class="logo">ES-client</div>
			<el-menu :default-active="active" router style="height: 100%">
				<el-menu-item index="home">
					<span slot="title">概览</span>
				</el-menu-item>
				<el-menu-item index="base_search">
					<span slot="title">基本查询</span>
				</el-menu-item>
				<el-menu-item index="senior_search">
					<span slot="title">高级查询</span>
				</el-menu-item>
				<el-menu-item index="sql_search">
					<span slot="title">SQL查询</span>
				</el-menu-item>
				<el-menu-item index="setting">
					<span slot="title">设置</span>
				</el-menu-item>
			</el-menu>
			<div class="author">
				<el-link href="https://esion.xyz" target="_blank"
					>云落天都</el-link
				>
				<div style="margin-top: 5px">
					<el-link
						href="https://gitee.com/qiaoshengda/es-client"
						target="_blank"
						>v0.3.0</el-link
					>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="top">
				<div class="app-option">
					<el-autocomplete
						v-model="url"
						:fetch-suggestions="url_proposal"
						placeholder="请输入索引地址"
						style="width: 300px"
						@blur="connect"
						@select="connect"
						@clear="connect"
						clearable
					></el-autocomplete>
					<el-button @click="connect">连接</el-button>
					<div class="cluster-name">
						{{ cluster_health_main.cluster_name }}
					</div>
				</div>
				<div class="info">
					<el-dropdown>
						<el-button type="primary">
							信息<i
								class="el-icon-arrow-down el-icon--right"
							></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="info"
								>信息</el-dropdown-item
							>
							<el-dropdown-item @click.native="stats"
								>状态</el-dropdown-item
							>
							<el-dropdown-item @click.native="nodes_stats"
								>节点状态</el-dropdown-item
							>
							<el-dropdown-item @click.native="nodes"
								>集群节点</el-dropdown-item
							>
							<el-dropdown-item @click.native="node_plugins"
								>插件</el-dropdown-item
							>
							<el-dropdown-item @click.native="cluster_state"
								>群集状态</el-dropdown-item
							>
							<el-dropdown-item @click.native="cluster_health"
								>集群健康值</el-dropdown-item
							>
							<el-dropdown-item @click.native="template"
								>模板</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
			<div class="content">
				<router-view v-if="load"></router-view>
			</div>
		</div>
		<el-dialog
			title="信息"
			:visible.sync="info_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="info_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="状态"
			:visible.sync="stats_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="stats_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="节点状态"
			:visible.sync="nodes_stats_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="nodes_stats_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="集群节点"
			:visible.sync="nodes_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="nodes_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="插件"
			:visible.sync="node_plugins_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="node_plugins_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="群集状态"
			:visible.sync="cluster_state_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="cluster_state_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="集群健康值"
			:visible.sync="cluster_health_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="cluster_health_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
		<el-dialog
			title="模板"
			:visible.sync="template_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<json-viewer
				:value="template_data"
				:expand-depth="4"
				copyable
				sort
			></json-viewer>
		</el-dialog>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
import url_dao from "@/database/url.js";
import JsonViewer from "vue-json-viewer";

export default {
	components: {
		JsonViewer,
	},
	data: () => {
		let url = localStorage.getItem("url");
		if (!url) {
			url = "http://localhost:9200";
			localStorage.setItem("url", url);
		}
		return {
			active: "home",
			url: url,
			url_history: [],
			load: true,
			cluster_health_main: {
				cluster_name: "",
				status: "",
				timed_out: false,
				number_of_nodes: 0,
				number_of_data_nodes: 0,
				active_primary_shards: 0,
				active_shards: 0,
				relocating_shards: 0,
				initializing_shards: 0,
				unassigned_shards: 0,
				delayed_unassigned_shards: 0,
				number_of_pending_tasks: 0,
				number_of_in_flight_fetch: 0,
				task_max_waiting_in_queue_millis: 0,
				active_shards_percent_as_number: 0.0,
			},
			info_data: {},
			info_dialog: false,
			stats_data: {},
			stats_dialog: false,
			nodes_dialog: false,
			nodes_data: {},
			nodes_stats_data: {},
			nodes_stats_dialog: false,
			node_plugins_data: {},
			node_plugins_dialog: false,
			cluster_state_data: {},
			cluster_state_dialog: false,
			cluster_health_data: {},
			cluster_health_dialog: false,
			template_data: {},
			template_dialog: false,
		};
	},
	created() {
		let route = this.$route.name;
		if (route !== "domain") {
			this.active = route;
		}
		this.init();
		url_dao.list(10).then((items) => {
			for (let item of items) {
				this.url_history.push(item.value);
			}
		});
	},
	methods: {
		connect() {
			window.localStorage.setItem("url", this.url);
			this.load = false;
			this.$nextTick(() => {
				this.load = true;
			});
			this.init();
			url_dao.save(this.url);
			this.url_history = [];
			url_dao.list(10).then((items) => {
				for (let item of items) {
					this.url_history.push(item.value);
				}
			});
		},
		url_proposal(queryString, cb) {
			let proposal = this.url_history.map((item) => {
				return { value: item };
			});
			cb(proposal);
		},
		init() {
			cluster_api._cluster_health((res) => {
				this.cluster_health_main = res;
			});
		},
		info() {
			cluster_api.info((res) => {
				this.info_data = res;
				this.info_dialog = true;
			});
		},
		stats() {
			cluster_api._stats((res) => {
				this.stats_data = res;
				this.stats_dialog = true;
			});
		},
		nodes() {
			cluster_api._nodes((res) => {
				this.nodes_data = res;
				this.nodes_dialog = true;
			});
		},
		nodes_stats() {
			cluster_api._nodes_stats((res) => {
				this.nodes_stats_data = res;
				this.nodes_stats_dialog = true;
			});
		},
		node_plugins() {
			cluster_api._nodes_plugins((res) => {
				this.node_plugins_data = res;
				this.node_plugins_dialog = true;
			});
		},
		cluster_state() {
			cluster_api._cluster_state((res) => {
				this.cluster_state_data = res;
				this.cluster_state_dialog = true;
			});
		},
		cluster_health() {
			cluster_api._cluster_health((res) => {
				this.cluster_health_data = res;
				this.cluster_health_dialog = true;
			});
		},
		template() {
			cluster_api._template((res) => {
				this.template_data = res;
				this.template_dialog = true;
			});
		},
	},
};
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
					margin-left: 10px;
					height: 40px;
					margin-top: 5px;
				}
				.cluster-name {
					width: 100px;
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
