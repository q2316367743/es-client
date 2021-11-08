<template>
	<div id="app">
		<div class="menu">
			<div class="logo">ES-client</div>
			<el-menu :default-active="active" router>
				<el-menu-item index="home">
					<span slot="title">概览</span>
				</el-menu-item>
				<el-menu-item index="base_search">
					<span slot="title">基本查询</span>
				</el-menu-item>
				<el-menu-item index="senior_search">
					<span slot="title">高级查询</span>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="main">
			<div class="top">
				<div class="app-option">
					<el-input v-model="url"></el-input>
					<el-button @click="connect">连接</el-button>
					<div class="cluster-name">{{ cluster_name }}</div>
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
							<el-dropdown-item>集群节点</el-dropdown-item>
							<el-dropdown-item @click.native="node_plugins">插件</el-dropdown-item>
							<el-dropdown-item>群集状态</el-dropdown-item>
							<el-dropdown-item>集群健康值</el-dropdown-item>
							<el-dropdown-item>模板</el-dropdown-item>
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
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
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
			load: true,
			cluster_name: "",
			info_data: {},
			info_dialog: false,
			stats_data: {},
			stats_dialog: false,
			nodes_stats_data: {},
			nodes_stats_dialog: false,
			node_plugins_data: {},
			node_plugins_dialog: false,
		};
	},
	created() {
		let route = this.$route.name;
		if (route !== "domain") {
			this.active = route;
		}
	},
	methods: {
		connect() {
			window.localStorage.setItem("url", this.url);
			this.load = false;
			this.$nextTick(() => {
				this.load = true;
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
		}
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
		border-right: #e6e6e6 solid 1px;
		.logo {
			width: 100%;
			text-align: center;
			font-weight: bold;
			font-size: 24px;
			height: 50px;
			line-height: 50px;
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
				.el-input {
					width: 250px;
					margin-left: 5px;
				}
				.el-button {
					margin-left: 10px;
					height: 40px;
					margin-top: 5px;
				}
				.cluster-name {
					width: 50px;
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
