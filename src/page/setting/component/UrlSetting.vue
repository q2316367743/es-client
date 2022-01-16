<template>
    <el-table :data="urls" class="data">
        <el-table-column type="index" width="150" label="索引"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="value" label="链接"></el-table-column>
        <el-table-column label="创建时间" width="240">
            <template #default="scope">
                <div>{{ prettyDate(scope.row.create_time) }}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" size="small" @click="edit_open(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="remove(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button
        type="primary"
        circle
        class="add-btn"
        @click="edit_dialog = true; edit_save = true;"
    >+</el-button>
    <el-dialog :title="edit_save ? '新增链接' : '修改链接'" v-model="edit_dialog" width="600px">
        <el-form :model="url">
            <el-form-item label="名称">
                <el-input v-model="url.name"></el-input>
            </el-form-item>
            <el-form-item label="链接">
                <el-input v-model="url.value" placeholder="es服务器地址（尾部不要有斜线）"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input-number v-model="url.sequence" controls-position="right" size="large" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="url_submit">{{ edit_save ? '新增' : '修改' }}</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { mapState } from "pinia";

import { useUrlStore } from "@/store/UrlStore";
import url_dao from "@/dao/UrlDao";
import Url from "@/entity/Url";

export default defineComponent({
    data: () => ({
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
        } as Url,
        edit_dialog: false,
        edit_save: true
    }),
    computed: {
        ...mapState(useUrlStore, ['urls'])
    },
    created() {
        useUrlStore().reset()
    },
    methods: {
        prettyDate(date: Date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        },
        remove(id: number) {
            ElMessageBox.confirm('此操作将永久删除该链接, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                url_dao.deleteById(id, () => {
                    ElMessage({
                        message: '删除成功',
                        type: 'success'
                    });
                    useUrlStore().reset();
                })
            })
        },
        edit_open(url: Url) {
            this.url = url;
            this.edit_save = false;
            this.edit_dialog = true;
        },
        url_submit() {
            if (this.edit_save) {
                // 新增
                url_dao.insert({
                    name: this.url.name,
                    value: this.url.value,
                    sequence: this.url.sequence
                }, () => {
                    useUrlStore().reset();
                    ElMessage.success('新增成功');
                });
            } else {
                // 更新
                url_dao.updateById({
                    name: this.url.name,
                    value: this.url.value,
                    sequence: this.url.sequence
                    // eslint-disable-next-line
                }, this.url.id!, () => {
                    useUrlStore().reset();
                    ElMessage.success('更新成功');
                });
            }
            this.edit_dialog = false;
            // 重置数据
            this.url = {
                name: '',
                value: 'http://',
                sequence: 0,
            }
        }
    }
});
</script>
<style lang="less">
.setting {
    .el-card__body {
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

        .add-btn {
            position: absolute;
            right: 20px;
            bottom: 20px;
            width: 32px;
        }
    }
}
</style>