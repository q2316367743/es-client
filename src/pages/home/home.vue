<template>
    <div>
        <div class="home-option">
            <div style="display: flex">
                <el-autocomplete
                    v-model="condition.name"
                    :fetch-suggestions="condition_name_proposal"
                    placeholder="请输入索引名称"
                    style="width: 300px"
                    @select="search"
                    @clear="search"
                    @keydown.enter="search"
                    clearable
                ></el-autocomplete>
                <el-select
                    v-model="condition.order"
                    placeholder="请选择"
                    style="margin-left: 5px"
                    @change="search"
                >
                    <el-option label="名称正序(A-Z)" value="NAME_ASC"></el-option>
                    <el-option label="名称倒序(Z-A)" value="NAME_DESC"></el-option>
                    <el-option label="大小正序" value="SIZE_ASC"></el-option>
                    <el-option label="大小倒序" value="SIZE_DESC"></el-option>
                    <el-option label="文档正序" value="DOC_ASC"></el-option>
                    <el-option label="文档倒序" value="DOC_DESC"></el-option>
                </el-select>
                <el-button type="primary" style="margin-left: 5px" @click="search">搜索</el-button>
            </div>
            <div style="margin-right: 15px">
                <el-dropdown split-button @click="init">
                    刷新
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>每隔5秒</el-dropdown-item>
                        <el-dropdown-item>每隔30秒</el-dropdown-item>
                        <el-dropdown-item>每隔一分钟</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button @click="index_dialog = true" type="primary" style="margin-left: 10px">新建索引</el-button>
            </div>
        </div>
        <div class="home-main">
            <div class="card" v-for="(index, key) in temp_indices" :key="key">
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
                            <el-dropdown-item @click.native="showStatsByIndexName(index.name)">索引状态</el-dropdown-item>
                            <el-dropdown-item @click.native="showMetadataByIndexName(index.name)">索引信息
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown style="margin-left: 10px">
                        <el-button type="primary" size="mini">
                            <span>动作</span>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="new_alias(index.name)">新建别名</el-dropdown-item>
                            <el-dropdown-item @click.native="refresh(index.name)">刷新</el-dropdown-item>
                            <el-dropdown-item>Flush刷新</el-dropdown-item>
                            <el-dropdown-item>ForceMerge</el-dropdown-item>
                            <el-dropdown-item>网关快照</el-dropdown-item>
                            <el-dropdown-item>测试分析器</el-dropdown-item>
                            <el-dropdown-item>关闭</el-dropdown-item>
                            <el-dropdown-item @click.native="remove_index(index.name)">删除</el-dropdown-item>
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
                    >{{ item }}
                    </el-tag>
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
            top="10vh"
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
            top="10vh"
        >
            <json-viewer
                :value="cluster_stats_metadata_index_data"
                :expand-depth="4"
                copyable
                sort
            ></json-viewer>
        </el-dialog>
        <el-dialog
            title="新建索引"
            :visible.sync="index_dialog"
            width="600px"
            append-to-body
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="index_data" label-width="80px">
                <el-form-item label="索引名称">
                    <el-input v-model="index_data.name"></el-input>
                </el-form-item>
                <el-form-item label="分片数">
                    <el-input-number
                        v-model="index_data.number_of_shards"
                        :min="0"
                        controls-position="right"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="副本数量">
                    <el-input-number
                        v-model="index_data.number_of_replicas"
                        :min="0"
                        controls-position="right"
                    ></el-input-number>
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
import {prettyDataUnit} from "@/utils/fieldUtil";
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
            temp_indices: [],
            alias: {},
            index_name: "",
            stats_index_data: {},
            stats_index_dialog: false,
            cluster_stats_metadata_index_data: "",
            cluster_stats_metadata_index_dialog: false,
            index_data: {
                name: "",
                number_of_shards: 5,
                number_of_replicas: 1,
            },
            index_dialog: false,
            condition: {
                name: "",
                order: "NAME_ASC",
            },
        };
    },
    created() {
        // 获取状态
        this.init();
    },
    methods: {
        init() {
            this.indices = [];
            cluster_api._stats((res) => {
                this.stats = res;
                cluster_api._cluster_state((res) => {
                    this.cluster_stats = res;
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
                    this.temp_indices = this.indices;
                    this.search();
                });
            });
        },
        condition_name_proposal(queryString, cb) {
            let proposal = this.indices
                .filter((item) => {
                    return item.name.indexOf(queryString) > -1;
                })
                .map((item) => {
                    return {value: item.name};
                });
            cb(proposal);
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
            }).then(({value}) => {
                index_api.new_alias(index, value, (res) => {
                    this.$alert(JSON.stringify(res));
                    this.init();
                });
            });
        },
        remove_alias(index, alias) {
            this.$confirm("此操作将永久删除该别名, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                index_api.remove_alias(index, alias, (res) => {
                    this.$alert(JSON.stringify(res));
                    this.init();
                });
            });
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
            }).then(() => {
                index_api.remove(index, (res) => {
                    this.$alert(JSON.stringify(res));
                    this.init();
                });
            });
        },
        save() {
            index_api.save(this.index_data, (res) => {
                if (res.acknowledged) {
                    this.$message({
                        type: "success",
                        message: "创建成功",
                    });
                    this.index_dialog = false;
                    this.init();
                    this.index_data = {
                        name: "",
                        number_of_shards: 5,
                        number_of_replicas: 1,
                    };
                }
            });
        },
        search() {
            this.temp_indices = this.indices.filter((item) => {
                return item.name.indexOf(this.condition.name) > -1;
            });
            // 排序
            switch (this.condition.order) {
                case "NAME_ASC":
                    this.temp_indice = this.temp_indices.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
                    break;
                case "NAME_DESC":
                    this.temp_indice = this.temp_indices.sort((a, b) => {
                        return b.name.localeCompare(a.name, "zh-CN");
                    });
                    break;
                case "SIZE_ASC":
                    this.temp_indices = this.temp_indices.sort((a, b) => {
                        return a.original_size - b.original_size;
                    });
                    break;
                case "SIZE_DESC":
                    this.temp_indices = this.temp_indices.sort((a, b) => {
                        return b.original_size - a.original_size;
                    });
                    break;
                case "DOC_ASC":
                    this.temp_indices = this.temp_indices.sort((a, b) => {
                        return a.docs - b.docs;
                    });
                    break;
                case "DOC_DESC":
                    this.temp_indices = this.temp_indices.sort((a, b) => {
                        return b.docs - a.docs;
                    });
                    break;
            }
        },
    },
};
</script>

<style lang="less">
.home-option {
    position: absolute;
    top: 15px;
    left: 10px;
    right: 10px;
    height: 40px;
    display: flex;
    justify-content: space-between;
}

.home-main {
    position: absolute;
    top: 60px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    overflow: auto;

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
}
</style>