<template>
    <div class="hm-history">
        <div class="hm-history-toolbar">
            <a-input-search v-model="name" :placeholder="$t('common.keyword.name')" class="hm-history-toolbar-name"
                            @search="search" style="width: 240px"/>
        </div>
        <div class="hm-history-body">
            <a-tree blockNode :data="nodeItems">
                <template #title="nodeData">
                    <span @dblclick="load(nodeData.key, nodeData.draggable)">{{ nodeData.title }}</span>
                </template>
            </a-tree>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {toDateString} from "xe-utils";

// 工具类
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";
import {stringContain} from "@/utils/SearchUtil";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import {seniorSearchHistoryService, useSeniorSearchEvent} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {TreeNodeData} from "@arco-design/web-vue";
import {mapState} from "pinia";
import useUrlStore from "@/store/UrlStore";
import Optional from "@/utils/Optional";
import ArrayUtil from "@/utils/ArrayUtil";

export default defineComponent({
    name: 'senior-search-history',
    emits: ['load'],
    data: () => ({
        histories: new Array<SeniorSearchHistory>(),
        name: '',
    }),
    computed: {
        ...mapState(useUrlStore, ['urlMap']),
        historyMap(): Map<number, SeniorSearchHistory> {
            return ArrayUtil.map(this.histories, 'id');
        },
        nodeItems(): Array<TreeNodeData> {
            let parentItemMap = new Map<number, TreeNodeData>();
            for (let history of this.histories) {
                if (parentItemMap.has(history.urlId || 0)) {
                    parentItemMap.get(history.urlId || 0)!.children!.push({
                        title: history.name,
                        key: history.id,
                        draggable: true
                    });
                } else {
                    let url = this.urlMap.get(history.urlId || 0);
                    parentItemMap.set(history.urlId || 0, {
                        title: Optional.ofNullable(url).attr('name').orElse('未知链接'),
                        key: history.urlId || new Date().getTime(),
                        draggable: false,
                        children: [{
                            title: history.name,
                            key: history.id,
                            draggable: true
                        }] as Array<TreeNodeData>
                    });
                }
            }
            return Array.from(parentItemMap.values());
        }
    },
    mounted() {
        // 数据查询
        emitter.on(MessageEventEnum.SENIOR_HISTORY_UPDATE, this.search);
        emitter.on(MessageEventEnum.URL_UPDATE, this.search);
    },
    methods: {
        search() {
            seniorSearchHistoryService.list()
                .then(histories => this.histories = histories.filter(e => stringContain(e.name!, this.name)));
        },
        prettyDate(params: Date) {
            return toDateString(params, "yyyy-MM-dd HH:mm:ss");
        },
        execCopy(url: string) {
            BrowserUtil.copy(url);
        },
        load(id: number, draggable: boolean) {
            if (!draggable) {
                return;
            }
            let history = this.historyMap.get(id);
            if (history) {
                useSeniorSearchEvent.emit({
                    id: history.id,
                    name: history.name,
                    body: history.body
                });
            } else {
                MessageUtil.error('错误，未找到指定历史记录，请刷新历史记录后重试！');
            }
        },
        removeById(id: number) {
            seniorSearchHistoryService.removeById(id)
                .then(() => MessageUtil.success('删除成功', this.search))
                .catch(e => MessageUtil.error('删除失败', e));
        },
    }
});
</script>
<style lang="less">

.hm-history {
    position: absolute;
    top: 0;
    left: 4px;
    right: 4px;
    bottom: 0;

    .hm-history-toolbar {
        display: flex;
        justify-content: space-between;
    }

    .hm-history-body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;

    }
}
</style>