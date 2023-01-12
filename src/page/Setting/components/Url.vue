<template>
    <div class="setting-url">
        <vxe-toolbar ref="urlToolbar" custom export>
            <template #buttons>
                <el-button type="primary" @click="edit_open(undefined)">{{ $t('app.add') }}</el-button>
            </template>
            <template #tools>
                <el-input v-model="condition.name" :placeholder="$t('setting.link.name')"
                          style="margin-right: 10px;"></el-input>
            </template>
        </vxe-toolbar>
        <vxe-table ref="urlTable" :data="showUrls" class="data" :column-config="columnConfig"
                   :export-config="exportConfig">
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="seq" width="50" :title="$t('setting.link.index')"></vxe-column>
            <vxe-column field="name" :title="$t('setting.link.name')" width="180"></vxe-column>
            <vxe-column field="value" :title="$t('setting.link.url')" width="250">
                <template #default="{row}">
                    <el-link :href="row.value" type="primary" target="_blank">{{ row.value }}</el-link>
                    <div class="url-copy" @click="execCopy(row.value)">复制</div>
                </template>
            </vxe-column>
            <vxe-column field="updateTime" :title="$t('setting.link.update_time')" width="160" :formatter="prettyDate"/>
            <vxe-column field="isAuth" :title="$t('setting.link.is_auth')" width="120" :formatter="prettyAuth"/>
            <vxe-column field="authUser" title="用户名" :visible="false"/>
            <vxe-column field="authPassword" title="密码" :visible="false"/>
            <vxe-column :title="$t('setting.link.operation')" width="140">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="edit_open(row)">{{ $t('setting.link.edit') }}
                    </el-button>
                    <el-popconfirm title="此操作将永久删除该链接, 是否继续?" confirm-button-text="删除"
                                   cancel-button-text="取消"
                                   @confirm="remove(row.id, row.value)" width="200px">
                        <template #reference>
                            <el-button type="danger" size="small">{{ $t('setting.link.delete') }}</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </vxe-column>
        </vxe-table>
        <save-or-update-url v-model="edit_dialog" :source="url"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ElMessage} from 'element-plus'
import {mapState} from "pinia";
import {toDateString} from "xe-utils";
import {VxeTableDefines, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";

import useUrlStore from "@/store/UrlStore";
import useIndexStore from "@/store/IndexStore";
import Url from "@/entity/Url";

// 组件
import JsonDialog from "@/components/JsonDialog.vue";
import SaveOrUpdateUrl from '@/module/SaveOrUpdateUrl/index.vue';

import {urlService} from "@/global/BeanFactory";
import BrowserUtil from "@/utils/BrowserUtil";

interface Params {
    cellValue: any
    column: VxeTableDefines.ColumnInfo
    row: any
}

export default defineComponent({
    name: 'setting-url',
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
            isAuth: false,
            authUser: '',
            authPassword: ''
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
            return params.cellValue ? this.$t('setting.link.need_auth') : this.$t('setting.link.not_auth');
        },
        remove(id: number, value: string) {
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
        },
        edit_open(url?: Url) {
            this.url = url ? url : {
                name: '',
                value: 'http://',
                sequence: 0,
                isAuth: false,
                authUser: '',
                authPassword: ''
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
}
</style>