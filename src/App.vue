<template>
	<div id="app">
		<div class="menu">
			<div class="logo">ES-client</div>
			<el-menu
				:default-active="active"
				style="height: 100%"
				@select="choose_route"
			>
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
				<div style="margin-top: 5px">
					<el-link @click="message_dialog = true">意见反馈</el-link>
				</div>
				<div style="margin-top: 5px">
					<el-link @click="about_dialog = true">v0.4.3</el-link>
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
						@select="connect"
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
							<span>信息</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
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
				<home v-show="active === 'home'" v-if="load"></home>
				<base_search
					v-show="active === 'base_search'"
					v-if="load"
				></base_search>
				<senior_search
					v-show="active === 'senior_search'"
					v-if="load"
				></senior_search>
				<sql_search
					v-show="active === 'sql_search'"
					v-if="load"
				></sql_search>
				<setting v-show="active === 'setting'" v-if="load"></setting>
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
		<el-dialog
			title="关于"
			:visible.sync="about_dialog"
			width="70%"
			append-to-body
			custom-class="es-dialog"
			:close-on-click-modal="false"
			top="10vh"
		>
			<about></about>
		</el-dialog>
		<el-dialog
			title="意见反馈"
			:visible.sync="message_dialog"
			width="600px"
			append-to-body
			:close-on-click-modal="false"
			top="10vh"
		>
			<el-form
				label-width="80px"
				:model="message_data"
				:rules="message_rules"
				ref="message_ref"
			>
				<el-form-item label="昵称" prop="name">
					<el-input v-model="message_data.name"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="message_data.email"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input
						v-model="message_data.content"
						type="textarea"
						:rows="5"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="message_submit"
					>提交</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
import url_dao from "@/database/url.js";
import { get_current_route, choose_route } from "@/plugins/route";
import JsonViewer from "vue-json-viewer";
import axios from "axios";

// 引入页面组件
import home from "@/pages/home/home.vue";
import base_search from "@/pages/base_search/base_search.vue";
import senior_search from "@/pages/senior_search/senior_search.vue";
import sql_search from "@/pages/sql_search/sql_search.vue";
import setting from "@/pages/setting/setting.vue";
import about from "@/pages/about/about.vue";

export default {
	components: {
		JsonViewer,
		home,
		base_search,
		senior_search,
		sql_search,
		setting,
		about,
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
			about_dialog: false,
			message_dialog: false,
			message_data: {
				name: "",
				email: "",
				content: "",
				type: 2,
			},
			message_rules: {
				name: [
					{
						required: true,
						message: "请输入昵称",
						trigger: "blur",
					},
				],
				email: [
					{
						required: true,
						message: "请输入邮箱",
						trigger: "blur",
					},
				],
				content: [
					{
						required: true,
						message: "请输入反馈内容",
						trigger: "blur",
					},
				],
			},
		};
	},
	created() {
		this.active = get_current_route();
		this.init();
	},
	methods: {
		choose_route(index) {
			choose_route(index, () => {
				this.active = index;
			});
		},
		connect() {
			window.localStorage.setItem("url", this.url);
			this.load = false;
			this.$nextTick(() => {
				this.load = true;
			});
			this.init();
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
			url_dao.list().then((items) => {
				this.url_history = [];
				for (let item of items) {
					this.url_history.push(item.value);
				}
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
		message_submit() {
			this.$refs.message_ref.validate((valid) => {
				if (valid) {
					axios({
						url: "https://blog.esion.xyz/api/message",
						method: "POST",
						data: this.message_data,
					})
						.then((response) => {
							if (response.status === 200) {
								let res = response.data;
								if (res.code === 200) {
									this.$message.success("提交成功");
									this.message_data = {
										name: "",
										email: "",
										content: "",
										type: 2,
									};
								} else {
									this.$message.error(res.msg);
								}
							} else {
								this.$message.error("服务器异常");
							}
							this.message_dialog = false;
						})
						.catch((e) => {
							console.error(e);
							this.$message.error("服务器发生异常");
							this.message_dialog = false;
						});
				}
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
