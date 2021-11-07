<template>
	<div class="index">
		<div class="option">
			<el-button @click="index_dialog = true">新建索引</el-button>
		</div>
		<div class="content">
			<el-table :data="indices" style="width: 100%">
				<el-table-column prop="name" label="索引名称" width="380">
				</el-table-column>
				<el-table-column prop="size" label="所占大小" width="180">
				</el-table-column>
				<el-table-column prop="docs" label="文件档数目">
				</el-table-column>
			</el-table>
		</div>

		<el-dialog
			title="新建索引"
			:visible.sync="index_dialog"
			width="600px"
			append-to-body
			:close-on-click-modal="false"
		>
			<el-form ref="form" :model="index" label-width="80px">
				<el-form-item label="索引名称">
					<el-input v-model="index.name"></el-input>
				</el-form-item>
				<el-form-item label="分片数">
					<el-input-number v-model="index.number_of_shards" :min="0" controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="副本数量">
					<el-input-number v-model="index.number_of_replicas" :min="0" controls-position="right"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">立即创建</el-button>
				<el-button @click="index_dialog = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";
import index_api from "@/apis/index.js";
import { prettyDataUnit } from "@/utils/fieldUtil";

export default {
	data: () => {
		return {
			indices: [],
			index: {
				name: "",
				number_of_shards: 5,
				number_of_replicas: 1,
			},
            index_dialog: false
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.indices = [];
			cluster_api._stats((res) => {
				for (let key in res.indices) {
					this.indices.push({
						name: key,
						size: prettyDataUnit(
							res.indices[key].total.store.size_in_bytes
						),
						docs: res.indices[key].total.docs.count,
					});
				}
			});
		},
        save() {
            index_api.save(this.index, res => {
                if (res.acknowledged) {
                    this.$message({
                        type: 'success',
                        message: '创建成功'
                    });
                    this.index_dialog = false
                    this.init();
                }
            })
        }
	},
};
</script>

<style lang="less">
.index {
	margin: 10px;
	padding: 10px;
	.content {
		margin-top: 10px;
		margin-left: 10px;
	}
}
</style>