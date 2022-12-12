<template>
    <div>
        <el-table :data="urls" class="data">
            <el-table-column type="index" width="150" :label="$t('setting.link.index')"></el-table-column>
            <el-table-column prop="name" :label="$t('setting.link.name')" width="180"></el-table-column>
            <el-table-column prop="value" :label="$t('setting.link.url')"></el-table-column>
            <el-table-column :label="$t('setting.link.create_time')" width="240">
                <template #default="scope">
                    <div>{{ prettyDate(scope.row.create_time) }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('setting.link.is_auth')" width="240">
                <template #default="scope">
                    <div>{{ scope.row.is_auth ? $t('setting.link.need_auth') : $t('setting.link.not_auth') }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('setting.link.operation')">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="edit_open(scope.row)">{{ $t('setting.link.edit') }}
                    </el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row.id, scope.row.value)">{{
                            $t('setting.link.delete')
                    }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" circle class="add-btn" @click="edit_open(undefined)">+
        </el-button>
        <save-or-update-url v-model="edit_dialog" :source="url" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import { mapState } from "pinia";
import {toDateString} from "xe-utils";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

// 组件
import JsonDialog from "@/components/JsonDialog.vue";
import SaveOrUpdateUrl from '@/components/SaveOrUpdateUrl/index.vue';

import { urlService } from "@/global/BeanFactory";

export default defineComponent({
    components: { JsonDialog, SaveOrUpdateUrl },
    data: () => ({
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
            is_auth: false,
            auth_user: '',
            auth_password: ''
        } as Url,
        edit_dialog: false,
    }),
    computed: {
        ...mapState(useUrlStore, ['urls'])
    },
    methods: {
        prettyDate(date: Date) {
            return toDateString(date, "yyyy-MM-dd HH:mm:ss");
        },
        remove(id: number, value: string) {
            ElMessageBox.confirm('此操作将永久删除该链接, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                urlService.deleteById(id, () => {
                    ElMessage({
                        message: '删除成功',
                        type: 'success'
                    });
                    if (useUrlStore().current === value) {
                        useUrlStore().choose();
                    }
                    useUrlStore().reset();
                    useIndexStore().reset();
                })
            })
        },
        edit_open(url?: Url) {
            this.url = url ? url : {
                name: '',
                value: 'http://',
                sequence: 0,
                is_auth: false,
                auth_user: '',
                auth_password: ''
            };
            this.edit_dialog = true;
        },
    }
});
</script>
<style lang="less">
.setting {
    .el-card__body {
        .data {
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