<template>
    <el-card class="setting">
        <div slot="header">设置</div>
        <el-tabs v-model="active">
            <el-tab-pane label="基础设置" name="base">基础设置</el-tab-pane>
            <el-tab-pane label="链接管理" name="url_history">
                <el-table :data="url_histories" style="width: 100%">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="value" label="内容">
                    </el-table-column>
                    <el-table-column prop="time" label="时间" width="180">
                    </el-table-column>
                    <el-table-column label="置顶">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.is_top"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"></el-table-column>
                </el-table
                >
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="seniot_param"
            >历史记录
            </el-tab-pane
            >
        </el-tabs>
    </el-card>
</template>

<script>
import url_dao from "@/database/url";

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
        init() {
            this.url_histories = [];
            url_dao.page(this.page, this.limit).then((items) => {
                for (let item of items) {
                    this.url_histories.push(item);
                }
            });
        },
    },
};
</script>

<style lang="less">
.setting {
    margin: 10px;
}
</style>