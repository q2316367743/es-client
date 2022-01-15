<template>
    <el-table :data="urls" class="data">
        <el-table-column type="index" width="150" label="索引"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="value" label="链接"></el-table-column>
        <el-table-column label="创建时间" width="180">
            <template #default="scope">
                <div>{{ prettyDate(scope.row.time, 'yyyy-MM-dd') }}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small" @click="remove(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" circle class="add-btn">+</el-button>
    <el-dialog :title="edit_save ? '新增链接' : '修改链接'"></el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'

import url_dao from "@/dao/UrlDao";
import Url from "@/entity/Url";

export default defineComponent({
    data: () => ({
        urls: [] as Array<Url>,
        url: {
            name: '',
            value: ''
        } as Url,
        edit_dialog: false,
        edit_save: true
    }),
    methods: {
        prettyDate(date: Date, format: string) {
            return dayjs(date).format(format);
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
                })
            })
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