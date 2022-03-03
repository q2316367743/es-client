<template>
	<div class="home">
		<div class="home-option">
			<div style="display: flex">
				<el-input
					v-model="condition.name"
					:placeholder="$t('home.index_placeholder')"
					style="width: 300px"
					@input="search"
					clearable
				></el-input>
				<el-select
					v-model="condition.order"
					:placeholder="$t('home.order_placeholder')"
					style="margin-left: 5px"
					clearable
					@change="search"
				>
					<el-option :label="$t('home.order_name_asc')" value="NAME_ASC"></el-option>
					<el-option :label="$t('home.order_name_desc')" value="NAME_DESC"></el-option>
					<el-option :label="$t('home.order_size_asc')" value="SIZE_ASC"></el-option>
					<el-option :label="$t('home.order_size_desc')" value="SIZE_DESC"></el-option>
					<el-option :label="$t('home.order_doc_asc')" value="DOC_ASC"></el-option>
					<el-option :label="$t('home.order_doc_desc')" value="DOC_DESC"></el-option>
				</el-select>
				<el-button type="primary" style="margin-left: 5px" @click="search">{{ $t('home.search') }}</el-button>
			</div>
			<div style="margin-right: 15px;">
				<el-button
					type="primary"
					style="margin-left: 10px"
					@click="index_dialog = true"
				>{{ $t('home.new_index.self') }}</el-button>
			</div>
		</div>
		<div class="home-main" v-loading="index_loading">
			<el-scrollbar>
				<index-item
					v-for="(view, index) in show_indices"
					:index="view"
					:key="index"
					@open-dialog="index_open_dialog"
				></index-item>
			</el-scrollbar>
			<el-backtop target=".el-scrollbar__wrap" />
		</div>
		<el-dialog :title="$t('home.new_index.self')" v-model="index_dialog" width="850px">
			<el-form>
				<el-form-item :label="$t('home.new_index.name')">
					<el-input v-model="index.name" style="width: 300px;"></el-input>
				</el-form-item>
			</el-form>
			<el-collapse v-model="index_collapse">
				<el-collapse-item :title="$t('home.new_index.base_setting')" name="1">
					<el-form>
						<el-form-item :label="$t('home.new_index.shard_number')">
							<el-input-number v-model="index.settings.number_of_shards" controls-position="right"></el-input-number>
						</el-form-item>
						<el-form-item :label="$t('home.new_index.replica_number')">
							<el-input-number v-model="index.settings.number_of_replicas" controls-position="right"></el-input-number>
						</el-form-item>
					</el-form>
				</el-collapse-item>
				<el-collapse-item :title="$t('home.new_index.field_setting')" name="2">
					<div v-if="index.mapping.length === 0">
						<el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}</el-button>
					</div>
					<el-form v-else>
						<div v-for="(property, idx) in index.mapping" :key="idx">
							<el-form :inline="true">
								<el-form-item :label="$t('home.new_index.field_name')">
									<el-input v-model="property.field"></el-input>
								</el-form-item>
								<el-form-item :label="$t('home.new_index.field_type')">
									<el-select v-model="property.type">
										<el-option v-for="(type) in types" :key="type" :label="type" :value="type"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}</el-button>
								</el-form-item>
								<el-form-item>
									<el-button
										type="danger"
										@click="removeProperty(property)"
									>{{ $t('home.new_index.delete') }}</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-form>
				</el-collapse-item>
			</el-collapse>
			<template #footer>
				<el-button type="primary" @click="addIndex">{{ $t('home.new_index.add') }}</el-button>
			</template>
		</el-dialog>
		<json-dialog
			:title="index_item_title"
			:json="index_item_data"
			:open="true"
			v-model="index_item_dialog"
		></json-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import _ from 'lodash';

import { useUrlStore } from '@/store/UrlStore';
import { useIndexStore } from '@/store/IndexStore';
import { useSettingStore } from '@/store/SettingStore';

import IndexView from "@/view/Index";
import { Index, Property } from '@/entity/Index';

import indexApi from '@/api/IndexApi';

import IndexItem from "./components/IndexItem.vue";
import JsonDialog from "@/components/JsonDialog.vue";
import { ElMessage } from 'element-plus';


export default defineComponent({
	name: 'Home',
	components: { IndexItem, JsonDialog },
	data: () => {
		return {
			// 根据条件过滤后的索引
			show_indices: [] as Array<IndexView>,
			// 搜索条件
			condition: {
				name: "",
				order: "NAME_ASC",
			},
			// 定时器
			interval: {} as NodeJS.Timer | null,
			// 列表加载中
			index_loading: false,
			index: {
				name: '',
				settings: {
					number_of_replicas: useSettingStore().getDefaultReplica,
					number_of_shards: useSettingStore().getDefaultShard
				},
				mapping: [] as Array<Property>
			} as Index,
			index_dialog: false,
			index_collapse: '1',
			types: ['string', 'text', 'keyword', 'integer', 'long', 'short', 'byte', 'double', 'float', 'boolean', 'date'],
			// 索引的详情对话框
			index_item_dialog: false,
			index_item_title: '',
			index_item_data: {} as any
		};
	},
	computed: {
		...mapState(useUrlStore, ['url']),
		...mapState(useIndexStore, ['indices']),
		...mapState(useSettingStore, ['default_replica', 'default_shard'])
	},
	watch: {
		indices() {
			this.search()
		},
		default_replica() {
			this.index.settings.number_of_replicas = useSettingStore().getDefaultReplica
		},
		default_shard() {
			this.index.settings.number_of_shards = useSettingStore().getDefaultShard
		}
	},
	methods: {
		/**
		 * 基于当前索引数组进行过滤
		 */
		search() {
			this.index_loading = true;
			this.show_indices = this.indices.filter((item) => {
				return item.name.indexOf(this.condition.name) > -1;
			});
			// 排序
			switch (this.condition.order) {
				case "NAME_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.name.localeCompare(b.name, "zh-CN");
					});
					break;
				case "NAME_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.name.localeCompare(a.name, "zh-CN");
					});
					break;
				case "SIZE_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.original_size - b.original_size;
					});
					break;
				case "SIZE_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.original_size - a.original_size;
					});
					break;
				case "DOC_ASC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return a.doc_count - b.doc_count;
					});
					break;
				case "DOC_DESC":
					this.show_indices = this.show_indices.sort((a, b) => {
						return b.doc_count - a.doc_count;
					});
					break;
			}
			this.$nextTick(() => {
				this.index_loading = false;
			})
		},
		addProperty() {
			this.index.mapping.push({ id: new Date().getTime(), field: '', 'type': 'text' })
		},
		removeProperty(property: Property) {
			_.remove(this.index.mapping, (target: Property) => {
				return property.id === target.id;
			})
		},
		addIndex() {
			// 新增
			indexApi.save(this.index, (data: any) => {
				// 显示对话框
				ElMessage.info(JSON.stringify(data));
				// 刷新索引
				useIndexStore().reset();
			})
			// 关闭弹框
			this.index_dialog = false;
			this.$nextTick(() => {
				// 重置
				this.index = {
					name: '',
					settings: {
						number_of_replicas: this.default_replica,
						number_of_shards: this.default_shard
					},
					mapping: [] as Array<Property>
				} as Index;
			})
		},
		index_open_dialog(title: string, content: any) {
			this.index_item_dialog = true;
			this.index_item_title = title;
			this.index_item_data = content;
		}
	},
});
</script>

<style lang="less">
.home {
	position: absolute;
	top: 0;
	left: 5px;
	right: 10px;
	bottom: 10px;
	.home-option {
		position: absolute;
		top: 0;
		left: 5px;
		right: 10px;
		height: 40px;
		display: flex;
		justify-content: space-between;
	}

	.home-main {
		position: absolute;
		top: 40px;
		left: 1px;
		right: 5px;
		bottom: 5px;
		overflow: auto;
	}
}
</style>