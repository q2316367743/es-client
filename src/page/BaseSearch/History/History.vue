<template>
    <div class="bs-history">
        <vxe-toolbar ref="bsHistoryToolbar" custom export class="bs-history-toolbar">
            <template #buttons>
                <el-input v-model="name" :placeholder="$t('common.keyword.name')"
                          style="width: 200px;" @input="search"></el-input>
                <el-switch active-text="当前链接" inactive-text="全部" v-model="onlyCurrent" @change="search"
                           style="margin-left: 12px;"/>
            </template>
        </vxe-toolbar>
        <div class="bs-history-body">
            <el-scrollbar>
                <vxe-table ref="bsHistoryTable" :data="histories" class="data" :column-config="columnConfig"
                           :export-config="exportConfig">
                    <vxe-column type="seq" width="50" :title="$t('common.keyword.seq')"></vxe-column>
                    <vxe-column field="name" :title="$t('common.keyword.name')" width="250"></vxe-column>
                    <vxe-column field="index" :title="$t('common.keyword.index')" width="400">
                        <template #default="{row}">
                            <el-link type="primary" target="_blank">{{ row.index }}</el-link>
                            <div class="url-copy" @click="execCopy(row.index)">{{ $t('common.operation.copy') }}</div>
                        </template>
                    </vxe-column>
                    <vxe-column :title="$t('common.keyword.operation')" width="200">
                        <template #default="{ row }">
                            <el-button type="success" size="small" @click="load(row)">
                                {{ $t('common.operation.load') }}
                            </el-button>
                            <el-popconfirm title="确认删除此条记录？" confirm-button-text="删除"
                                           cancel-button-text="取消" @confirm="removeById(row.id)" width="200px">
                                <template #reference>
                                    <el-button type="danger" size="small">{{ $t('app.delete') }}
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </vxe-column>
                </vxe-table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Search} from '@element-plus/icons-vue'
import {VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import useUrlStore from "@/store/UrlStore";
import {baseSearchHistoryService, useBaseSearchEvent} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import MessageUtil from "@/utils/MessageUtil";
import BrowserUtil from "@/utils/BrowserUtil";
import Optional from "@/utils/Optional";
import {stringContain} from "@/utils/SearchUtil";

export default defineComponent({
    name: 'bsh-history',
    emits: ['load'],
    data: () => ({
        searchIcon: markRaw(Search),
        histories: new Array<BaseSearchHistory>(),
        columnConfig: {
            resizable: true
        },
        exportConfig: {
            filename: '查询历史',
            sheetName: '查询历史',
            // 自定义类型
            types: ['csv', 'html', 'xml', 'txt']
        } as VxeTablePropTypes.ExportConfig,
        name: '',
        onlyCurrent: true,
    }),
    mounted() {
        // 历史表格工具连接
        let bsHistoryTable = this.$refs['bsHistoryTable'] as VxeTableInstance;
        let bsHistoryToolbar = this.$refs['bsHistoryToolbar'] as VxeToolbarInstance;
        this.$nextTick(() => {
            bsHistoryTable.connect(bsHistoryToolbar);
        });
        this.search();
        emitter.on(MessageEventEnum.BASE_HISTORY_UPDATE, () => {
            // 历史记录变更，也要进行重新查询历史
            this.search();
        });
    },
    methods: {
        execCopy(url: string) {
            BrowserUtil.copy(url);
        },
        load(history: BaseSearchHistory) {
            this.$emit('load');
            useBaseSearchEvent.emit({
                id: history.id,
                name: history.name,
                index: history.index,
                conditions: history.conditions,
                orders: history.orders,
                execute: false
            });
        },
        search() {
            if (!useUrlStore().id && this.onlyCurrent) {
                this.histories = new Array<BaseSearchHistory>();
                return;
            }
            baseSearchHistoryService.list(this.onlyCurrent ? useUrlStore().id : undefined)
                .then(records => {
                    this.histories = records.filter(e => stringContain(e.name!, this.name))
                        .sort((a, b) =>
                            Optional.ofNullable(b.id).orElse(0) - Optional.ofNullable(a.id).orElse(0));
                }).catch(e => MessageUtil.error('历史查询失败', e));
        },
        removeById(id: number) {
            baseSearchHistoryService.removeById(id)
                .then(() => MessageUtil.success('删除成功', this.search))
                .catch(e => MessageUtil.error('删除失败', e));
        },
    }
});
</script>
<style scoped lang="less">

.bs-history {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .bs-history-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

        .bs-history-params {
            display: flex;

            .bs-history-params-value {
                width: 200px;
                overflow: hidden;
                white-space: nowrap; //不折行
                text-overflow: ellipsis; //溢出显示省略号
            }
        }
    }
}
</style>