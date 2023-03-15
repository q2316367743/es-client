<template>
    <div class="hm-history">
        <div class="hm-history-toolbar">
            <div>
                <a-input v-model="name" :placeholder="$t('common.keyword.name')" class="hm-history-toolbar-name"
                         @input="search"></a-input>
                <a-button type="primary" @click="search">
                    <template #icon>
                        <icon-refresh/>
                    </template>
                </a-button>
                <a-switch active-text="当前链接" inactive-text="全部" v-model="onlyCurrent" @change="search"
                          style="margin-left: 12px;" type="round">
                    <template #checked>当前链接</template>
                    <template #unchecked>全部</template>
                </a-switch>
            </div>
            <div>
                <a-button type="primary" style="margin-right: 12px;" @click="addOpen">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </div>
        </div>
        <div class="hm-history-body">
            <a-table :data="histories" style="height: 100%;">
                <template #columns>
                    <a-table-column data-index="name" :title="$t('common.keyword.name')"></a-table-column>
                    <a-table-column :title="$t('common.keyword.operation')" :width="250" fixed="right">
                        <template #cell="{ record }">
                            <a-button type="primary" status="success" size="small" @click="load(record)">{{
                                    $t('common.operation.load')
                                }}
                            </a-button>
                            <a-button type="primary" size="small" @click="updateOpen(record)">{{
                                    $t('common.operation.update')
                                }}
                            </a-button>
                            <a-popconfirm content="确认删除此条记录？" :ok-text="$t('common.operation.delete')"
                                          :cancel-text="$t('common.operation.cancel')" @ok="removeById(record.id)">
                                <a-button type="primary" status="danger" size="small">{{
                                        $t('common.operation.delete')
                                    }}
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
        <a-modal v-model:visible="dialog.show" :title="(dialog.data.id === 0 ? '新增' : '修改') + '历史记录'"
                 render-to-body
                 unmount-on-close draggable width="50%" @ok="submit" ok-text="修改">
            <history-save-and-update v-model="dialog.data"/>
        </a-modal>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {toDateString} from "xe-utils";
import {mapState} from "pinia";

// 工具类
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import {stringContain} from "@/utils/SearchUtil";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import {seniorSearchHistoryService, useSeniorSearchEvent} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import useUrlStore from "@/store/UrlStore";
import HistorySaveAndUpdate from "@/page/SeniorSearch/components/HistorySaveAndUpdate.vue";

export default defineComponent({
    name: 'senior-search-history',
    components: {HistorySaveAndUpdate},
    emits: ['load'],
    data: () => ({
        histories: new Array<SeniorSearchHistory>(),
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
        prettyDate(params: Date) {
            return toDateString(params, "yyyy-MM-dd HH:mm:ss");
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
                console.log(this.dialog.data)
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
    left: 4px;
    right: 4px;
    bottom: 0;

    .hm-history-toolbar {
        display: flex;
        justify-content: space-between;
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