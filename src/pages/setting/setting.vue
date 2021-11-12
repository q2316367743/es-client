<template>
    <el-card class="setting">
        <div slot="header">设置</div>
        <div class="option">
            <el-button type="primary" size="small" @click="add" v-if="active === 'url_history'">新增</el-button>
        </div>
        <el-tabs v-model="active">
            <el-tab-pane label="基础设置" name="base"></el-tab-pane>
            <el-tab-pane label="链接管理" name="url_history" class="url-history"></el-tab-pane>
            <el-tab-pane label="历史记录" name="senior_param"></el-tab-pane>
        </el-tabs>
        <div v-if="active === 'base'">基础设置</div>
        <div class="url-history" v-if="active === 'url_history'">
            <el-table :data="url_histories" class="data">
                <el-table-column type="index" width="150" label="索引"></el-table-column>
                <el-table-column prop="value" label="内容">
                </el-table-column>
                <el-table-column label="时间" width="180">
                    <template slot-scope="scope">
                        <div>{{ prettyDate(scope.row.time, 'yyyy-MM-dd') }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="置顶">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.is_top"
                            :active-value="1"
                            :inactive-value="0"
                            @change="enable(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="remove(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="limit"
                    :current-page="page"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <div v-if="active === 'senior_param'">历史记录</div>
    </el-card>
</template>

<script>
import url_dao from "@/database/url";
import {prettyDate} from "@/utils/fieldUtil";

export default {
    data: () => {
        return {
            active: "base",
            url_histories: [],
            page: 1,
            limit: 10,
            total: 1,
        };
    },
    created() {
        this.init();
    },
    methods: {
        prettyDate,
        init() {
            this.url_histories = [];
            url_dao.page(this.page, this.limit).then((items) => {
                for (let item of items) {
                    this.url_histories.push(item);
                }
            });
            url_dao.count().then((total) => {
                this.total = total;
            });
        },
        enable(record) {
            url_dao.update(record).then(() => {
                this.init();
                this.$parent.init();
            });
        },
        edit(record) {
            this.$prompt('请输入新链接', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: record.value,
                closeOnClickModal: false
            }).then(({value}) => {
                url_dao.update({
                    id: record.id,
                    time: record.time,
                    is_top: record.is_top,
                    value: value
                }).then(() => {
                    this.init();
                    this.$parent.init();
                });
            })
        },
        add() {
            this.$prompt('请输入新链接', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false
            }).then(({value}) => {
                url_dao.update({
                    time: new Date().getTime(),
                    is_top: 0,
                    value: value
                }).then(() => {
                    this.init();
                    this.$parent.init();
                });
            })
        },
        remove(id) {
            this.$confirm('此操作将永久删除该链接, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                url_dao.remove(id).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.init();
                    this.$parent.init();
                })
            })
        }
    },
};
</script>

<style lang="less">
.setting {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .el-card__body {
        position: absolute;
        top: 58px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .option {
        position: absolute;
        top: 20px;
        right: 25px;
        z-index: 10;
    }

    .url-history {
        position: absolute;
        top: 58px;
        left: 0;
        right: 0;
        bottom: 0;

        .data {
            padding: 20px;
            height: 100%;
            width: 100%;
        }

        .page {
            text-align: center;
            position: absolute;
            left: 5px;
            right: 5px;
            bottom: 20px;
        }
    }
}


</style>