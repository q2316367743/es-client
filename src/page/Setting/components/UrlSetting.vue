<template>
    <vxe-toolbar ref="urlToolbar" custom export>
        <template #buttons>
            <el-button type="primary" @click="edit_open(undefined)">{{ $t('app.add') }}</el-button>
        </template>
        <template #tools>
            <el-input v-model="condition.name" :placeholder="$t('setting.link.name')"
                      style="margin-right: 10px;"></el-input>
        </template>
    </vxe-toolbar>
    <vxe-table ref="urlTable" :data="showUrls" class="data" :column-config="columnConfig" :export-config="exportConfig">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" width="150" :title="$t('setting.link.index')"></vxe-column>
        <vxe-column field="name" :title="$t('setting.link.name')" width="180"></vxe-column>
        <vxe-column field="value" :title="$t('setting.link.url')">
            <template #default="{row}">
                <el-link :href="row.value" type="primary" target="_blank">{{ row.value }}</el-link>
                <div class="url-copy" @click="execCopy(row.value)">复制</div>
            </template>
        </vxe-column>
        <vxe-column field="update_time" :title="$t('setting.link.update_time')" width="240" :formatter="prettyDate"/>
        <vxe-column field="is_auth" :title="$t('setting.link.is_auth')" width="240" :formatter="prettyAuth"/>
        <vxe-column :title="$t('setting.link.operation')">
            <template #default="{ row }">
                <el-button type="primary" size="small" @click="edit_open(row)">{{ $t('setting.link.edit') }}
                </el-button>
                <el-button type="danger" size="small" @click="remove(row.id, row.value)">{{
                        $t('setting.link.delete')
                    }}
                </el-button>
            </template>
        </vxe-column>
        <vxe-column field="auth_user" title="用户名" :visible="false"/>
        <vxe-column field="auth_password" title="密码" :visible="false"/>
    </vxe-table>
    <save-or-update-url v-model="edit_dialog" :source="url"/>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus'
import {mapState} from "pinia";
import {toDateString} from "xe-utils";
import {VxeTableDefines, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

// 组件
import JsonDialog from "@/components/JsonDialog.vue";
import SaveOrUpdateUrl from '@/components/SaveOrUpdateUrl/index.vue';

import {urlService} from "@/global/BeanFactory";
import BrowserUtil from "@/utils/BrowserUtil";

interface Params {
    cellValue: any
    column: VxeTableDefines.ColumnInfo
    row: any
}

export default defineComponent({
    components: {JsonDialog, SaveOrUpdateUrl},
    data: () => ({
        condition: {
            name: '',
            url: ''
        },
        url: {
            name: '',
            value: 'http://',
            sequence: 0,
            is_auth: false,
            auth_user: '',
            auth_password: ''
        } as Url,
        edit_dialog: false,
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
                field: 'is_auth'
            }, {
                field: 'auth_user'
            }, {
                field: 'auth_password'
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
            return params.cellValue ? this.$t('setting.link.need_auth') : this.$t('setting.link.not_auth');
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
        execCopy(url: string) {
            BrowserUtil.copy(url);
            ElMessage({
                showClose: true,
                type: 'success',
                message: '已成功复制到剪切板'
            })
        }
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

    .url-copy {
        display: inline;
        line-height: 22px;
        background-color: var(--hover-color);
        border-radius: 11px;
        padding: 1px 5px;
        margin-left: 5px;
        margin-top: 2px;
        cursor: pointer;
    }
}
</style>