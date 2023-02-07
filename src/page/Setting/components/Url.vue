<template>
    <div class="setting-url">
        <vxe-toolbar ref="urlToolbar" custom export>
            <template #buttons>
                <el-button type="primary" @click="editOpen(undefined)">{{ $t('common.operation.add') }}</el-button>
            </template>
            <template #tools>
                <el-input v-model="condition.name" :placeholder="$t('common.keyword.name')"
                          style="margin-right: 10px;"></el-input>
            </template>
        </vxe-toolbar>
        <vxe-table ref="urlTable" :data="showUrls" class="data" :column-config="columnConfig"
                   :export-config="exportConfig">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="seq" width="50" :title="$t('common.keyword.index')"></vxe-column>
            <vxe-column field="name" :title="$t('common.keyword.name')" width="180"></vxe-column>
            <vxe-column field="value" :title="$t('common.keyword.url')" width="250">
                <template #default="{row}">
                    <el-link :href="row.value" type="primary" target="_blank">{{ row.value }}</el-link>
                    <div class="url-copy" @click="execCopy(row.value)">{{ $t('common.operation.copy') }}</div>
                </template>
            </vxe-column>
            <vxe-column field="updateTime" :title="$t('setting.link.form.updateTime')" width="160"
                        :formatter="prettyDate"/>
            <vxe-column field="isAuth" :title="$t('setting.link.form.isAuth')" width="120" :formatter="prettyAuth"/>
            <vxe-column field="authUser" :title="$t('setting.link.form.authUser')" :visible="false"/>
            <vxe-column field="authPassword" :title="$t('setting.link.form.authPassword')" :visible="false"/>
            <vxe-column :title="$t('common.keyword.operation')" width="140">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="editOpen(row)">{{ $t('common.operation.edit') }}
                    </el-button>
                    <el-button type="danger" size="small" @click="remove(row.id, row.value)">
                        {{ $t('common.operation.delete') }}
                    </el-button>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Action, ElMessageBox} from 'element-plus'
import {mapState} from "pinia";
import {toDateString} from "xe-utils";
import {VxeTableDefines, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

// 组件
import JsonDialog from "@/components/JsonDialog.vue";

import {urlService, useUrlEditEvent} from "@/global/BeanFactory";
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";

interface Params {
    cellValue: any
    column: VxeTableDefines.ColumnInfo
    row: any
}

export default defineComponent({
    name: 'setting-url',
    components: {JsonDialog},
    data: () => ({
        condition: {
            name: '',
            url: ''
        },
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
            isAuth: false,
            authUser: '',
            authPassword: ''
        } as Url,
        columnConfig: {
            resizable: true
        },
        exportConfig: {
            filename: 'elasticsearch链接',
            sheetName: 'elasticsearch链接',
            columns: [{
                field: 'name'
            }, {
                field: 'value'
            }, {
                field: 'isAuth'
            }, {
                field: 'authUser'
            }, {
                field: 'authPassword'
            }],
            // 自定义类型
            types: ['csv', 'html', 'xml', 'txt']
        } as VxeTablePropTypes.ExportConfig
    }),
    computed: {
        ...mapState(useUrlStore, ['urls']),
        showUrls() {
            return this.urls.filter(url => this.condition.name === '' || (url.name && url.name.indexOf(this.condition.name) > -1))
        }
    },
    mounted() {
        let urlTable = this.$refs['urlTable'] as VxeTableInstance;
        let urlToolbar = this.$refs['urlToolbar'] as VxeToolbarInstance;
        this.$nextTick(() => {
            urlTable.connect(urlToolbar);
        });
    },
    methods: {
        prettyDate(params: Params) {
            return toDateString(params.cellValue, "yyyy-MM-dd HH:mm:ss");
        },
        prettyAuth(params: Params) {
            return params.cellValue ? this.$t('setting.link.form.needAuth') : this.$t('setting.link.form.notAuth');
        },
        remove(id: number, value: string) {
            ElMessageBox.confirm('是否删除相关的搜索历史', '提示', {
                type: 'info',
                confirmButtonText: '删除全部',
                cancelButtonText: '只删除链接',
                distinguishCancelAndClose: true
            }).then(() => {
                this.execRemove(id, true)
                    .then(() => this.removeAfter(value))
                    .catch(e => MessageUtil.error('删除失败', e));
            }).catch((action: Action) => {
                if (action === 'cancel') {
                    this.execRemove(id, false)
                        .then(() => this.removeAfter(value))
                        .catch(e => MessageUtil.error('删除失败', e));
                }
            })
        },
        execRemove(id: number, removeAll: boolean): Promise<void> {
            if (removeAll) {
                return urlService.deleteAllById(id);
            } else {
                return urlService.deleteById(id);
            }
        },
        removeAfter(value: string) {
            MessageUtil.success('删除成功');
            if (useUrlStore().current === value) {
                // 删除了当前索引
                useUrlStore().clear();
                useIndexStore().clear();
            }
            useUrlStore().reset();
            useIndexStore().reset();
        },
        editOpen(url?: Url) {
            useUrlEditEvent.emit(url);
        },
        execCopy: BrowserUtil.copy
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