<template>
    <div class="hm-history">
        <vxe-toolbar ref="historyToolbar" custom export class="hm-history-toolbar">
            <template #buttons>
                <a-input v-model="name" :placeholder="$t('common.keyword.name')" class="hm-history-toolbar-name"
                         @input="search"></a-input>
                <a-switch active-text="当前链接" inactive-text="全部" v-model="onlyCurrent" @change="search"
                          style="margin-left: 12px;"/>
            </template>
            <template #tools>
                <a-button type="primary" style="margin-right: 12px;" @click="addOpen">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </template>
        </vxe-toolbar>
        <div class="hm-history-body">
            <a-scrollbar>
                <vxe-table ref="historyTable" :data="histories" class="data" :column-config="columnConfig"
                           :export-config="exportConfig">
                    <vxe-column type="seq" width="50" :title="$t('common.keyword.seq')"></vxe-column>
                    <vxe-column field="name" :title="$t('common.keyword.name')" width="150"></vxe-column>
                    <vxe-column :title="$t('common.keyword.operation')" width="200">
                        <template #default="{ row }">
                            <a-button type="primary" status="success" size="small" @click="load(row)">{{
                                    $t('common.operation.load')
                                }}
                            </a-button>
                            <a-button type="primary" size="small" @click="updateOpen(row)">{{
                                    $t('common.operation.update')
                                }}
                            </a-button>
                            <a-popconfirm title="确认删除此条记录？"
                                          :confirm-button-text="$t('common.operation.delete')"
                                          :cancel-button-text="$t('common.operation.cancel')"
                                          @confirm="removeById(row.id)" width="200px">
                                <template #reference>
                                    <a-button type="primary" status="danger" size="small">{{ $t('common.operation.delete') }}
                                    </a-button>
                                </template>
                            </a-popconfirm>
                        </template>
                    </vxe-column>
                </vxe-table>
            </a-scrollbar>
        </div>
        <a-modal v-model:visible="dialog.show" :title="(dialog.data.id === 0 ? '新增' : '修改') + '历史记录'"
                 render-to-body unmount-on-close draggable width="50%">
            <history-save-and-update v-model="dialog.data" @submit="submit"/>
        </a-modal>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import {VxeTableDefines, VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance} from "vxe-table";
import {toDateString} from "xe-utils";

import BrowserUtil from "@/utils/BrowserUtil";
import {seniorSearchHistoryService, useSeniorSearchEvent} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import useUrlStore from "@/store/UrlStore";
import {mapState} from "pinia";
import HistorySaveAndUpdate from "@/page/SeniorSearch/component/HistorySaveAndUpdate.vue";
import MessageUtil from "@/utils/MessageUtil";
import {stringContain} from "@/utils/SearchUtil";

interface Params {
    cellValue: any
    column: VxeTableDefines.ColumnInfo
    row: any
}

export default defineComponent({
    name: 'senior-search-history',
    components: {HistorySaveAndUpdate},
    emits: ['load'],
    data: () => ({
        histories: new Array<SeniorSearchHistory>(),
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
        dialog: {
            show: false,
            data: {
                id: 0,
                name: '',
                urlId: 0,
                body: ''
            } as SeniorSearchHistory
        }
    }),
    computed: {
        ...mapState(useUrlStore, ['current'])
    },
    mounted() {
        // 历史表格工具连接
        let historyTable = this.$refs['historyTable'] as VxeTableInstance;
        let historyToolbar = this.$refs['historyToolbar'] as VxeToolbarInstance;
        this.$nextTick(() => {
            historyTable.connect(historyToolbar);
        });
        // 数据查询
        emitter.on(MessageEventEnum.SENIOR_HISTORY_UPDATE, this.search);
        emitter.on(MessageEventEnum.URL_UPDATE, this.search);
    },
    methods: {
        search() {
            if (!useUrlStore().id && this.onlyCurrent) {
                this.histories = new Array<SeniorSearchHistory>();
                return;
            }
            seniorSearchHistoryService.list(this.onlyCurrent ? useUrlStore().id : undefined)
                .then(histories => this.histories = histories.filter(e => stringContain(e.name!, this.name)));
        },
        prettyDate(params: Params) {
            return toDateString(params.cellValue, "yyyy-MM-dd HH:mm:ss");
        },
        execCopy(url: string) {
            BrowserUtil.copy(url);
        },
        load(history: SeniorSearchHistory) {
            useSeniorSearchEvent.emit({
                id: history.id,
                name: history.name,
                body: history.body
            });
        },
        removeById(id: number) {
            seniorSearchHistoryService.removeById(id)
                .then(() => MessageUtil.success('删除成功', this.search))
                .catch(e => MessageUtil.error('删除失败', e));
        },
        addOpen() {
            this.dialog = {
                show: true,
                data: {
                    id: 0,
                    name: '',
                    urlId: 0,
                    body: ''
                } as SeniorSearchHistory
            }
        },
        updateOpen(historyEntity: SeniorSearchHistory) {
            this.dialog = {
                show: true,
                data: historyEntity
            }
        },
        submit() {
            if (this.dialog.data.id === 0) {
                // 新增
                seniorSearchHistoryService.save(this.dialog.data)
                    .then(() => MessageUtil.success('新增成功', () => {
                        this.search();
                        this.dialog.show = false;
                    }))
                    .catch(e => MessageUtil.error('新增失败', e));
            } else {
                // 修改
                seniorSearchHistoryService.update(this.dialog.data)
                    .then(() => MessageUtil.success('修改成功', () => {
                        this.search();
                        this.dialog.show = false;
                    }))
                    .catch(e => MessageUtil.error('修改失败', e));
            }
        }
    }
});
</script>
<style lang="less">

@media (max-width: 1200px) {
    .hm-history {
        .hm-history-toolbar {
            .hm-history-toolbar-name {
                width: 100px !important;
            }
        }
    }
}

.hm-history {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .hm-history-toolbar {
        .hm-history-toolbar-name {
            width: 200px;
        }
    }

    .hm-history-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

        .hm-history-params {
            display: flex;

            .hm-history-params-value {
                width: 200px;
                overflow: hidden;
                white-space: nowrap; //不折行
                text-overflow: ellipsis; //溢出显示省略号
            }
        }
    }
}

</style>