<template>
	<div class="base-search">
		<div class="base-option">
			<el-card class="es-card">
				<div slot="header">
                    <span>查询条件</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="is_show = !is_show">{{is_show ? '收起' : '展开'}}</el-button>
                </div>
				<transition name="el-zoom-in-top">
					<div v-show="is_show">
						<el-form label-position="top" label-width="80px">
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
							</el-form-item>
							<el-form-item label="条件：">
								<div
									v-for="(item, idx) in field_condition"
									:key="idx"
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
										<el-option label="term" value="term">
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
										<el-option label="fuzzy" value="fuzzy">
										</el-option>
										<el-option label="range" value="range">
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
										>新增</el-button
									>
									<el-button type="danger">移除</el-button>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</transition>
			</el-card>
		</div>
		<div class="base-content">
			<el-card></el-card>
		</div>
	</div>
</template>

<script>
import cluster_api from "@/apis/cluster.js";

// 公共方法

/**
 * 构建索引
 */
function buildIndices(cluster_stats) {
	let indices = {};
	for (let index in cluster_stats.metadata.indices) {
		indices[index] = buildField(
			cluster_stats.metadata.indices[index].mappings
		);
	}
	return indices;
}

/**
 * 构建字段
 */
function buildField(mappings) {
	let fileds = {};
	fileds["match_all"] = "";
	fileds["_all"] = "";
	// 第一步，遍历类型
	for (let type in mappings) {
		// 遍历字段
		let properties = mappings[type].properties;
		for (let property in properties) {
			if (properties[property].properties) {
				// 是对象
				let objs = properties[property].properties;
				for (let obj in objs) {
					fileds[`${type}.${property}.${obj}`] = objs[obj].type;
				}
			} else {
				fileds[`${type}.${property}`] = properties[property].type;
			}
		}
	}
	return fileds;
}

export default {
	data: () => {
		return {
			is_show: true,
			cluster_stats: {},
			indices: {},
			indices_name: [],
			index: "",
			field_condition: [
				{
					bool: "must",
					field: "match_all",
					condition: "",
					value: "",
				},
			],
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
};
</script>

<style lang="less">
.es-card {
    max-height: 50vh;
}
.base-search {
	padding: 10px;
	.base-option {
		margin-top: 5px;
	}
	.base-content {
		margin-top: 20px;
	}
}
</style>