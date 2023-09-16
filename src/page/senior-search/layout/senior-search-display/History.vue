<template>
    <div class="hm-history">
        <div class="hm-history-toolbar">
            <a-input-search v-model="name" :placeholder="$t('common.keyword.name')" class="hm-history-toolbar-name"
                @search="search()" style="width: 240px" />
        </div>
        <div class="hm-history-body">
            <a-tree :data="nodeItems" block-node show-line @drop="drop($event)">
                <template #title="nodeData">
                    <span @dblclick="load(nodeData.key, nodeData.draggable)">{{ nodeData.title }}</span>
                </template>
                <template #extra="nodeData">
                    <a-button type="text" status="normal" :disabled="!nodeData.history"
                        @click="updateById(nodeData.key)">修改</a-button>
                    <a-popconfirm content="确认要删除此记录" @ok="removeById(nodeData.key)">
                        <a-button type="text" status="danger" :disabled="!nodeData.history">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-tree>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { toDateString } from "xe-utils";

// 工具类
import MessageUtil from "@/utils/MessageUtil";
import { stringContain } from "@/utils/SearchUtil";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import { seniorSearchHistoryService, useSeniorSearchEvent } from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import { TreeNodeData } from "@arco-design/web-vue";
import { mapState } from "pinia";
import useUrlStore from "@/store/UrlStore";
import Optional from "@/utils/Optional";
import ArrayUtil from "@/utils/ArrayUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

interface NodeData extends TreeNodeData {

    /**
     * 是否是历史
     */
    history: boolean;

    /**
     * 子节点
     */
    children?: NodeData[];

}

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
        nodeItems(): Array<NodeData> {
            let parentItemMap = new Map<number, NodeData>();
            parentItemMap.set(0, {
                title: '未知链接',
                key: new Date().getTime() - 1000,
                draggable: true,
                children: new Array<NodeData>(),
                history: false
            });
            for (let history of this.histories) {
                if (parentItemMap.has(history.urlId || 0)) {
                    parentItemMap.get(history.urlId || 0)!.children!.push({
                        title: history.name,
                        key: history.id,
                        draggable: true,
                        history: true
                    });
                } else {
                    let url = this.urlMap.get(history.urlId || 0);
                    parentItemMap.set(history.urlId || 0, {
                        title: Optional.ofNullable(url).attr('name').orElse('未知链接'),
                        key: history.urlId || new Date().getTime(),
                        draggable: true,
                        history: false,
                        children: [{
                            title: history.name,
                            key: history.id,
                            draggable: true,
                            history: true
                        }] as Array<NodeData>
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
            utools.copyText(url);
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
        updateById(id: number) {
            let history = this.historyMap.get(id);
            if (history) {
                MessageBoxUtil.prompt('请输入新的名称', '修改名称', {
                    inputValue: history.name
                }).then(value => {
                    seniorSearchHistoryService.update({
                        id,
                        createTime: new Date(),
                        updateTime: new Date(),
                        name: value,
                        body: history?.body
                    })
                        .then(() => MessageUtil.success('更新成功', () => this.search()))
                        .catch(e => MessageUtil.error('更新失败', e));
                }).catch(() => console.debug('取消删除'));
            } else {
                MessageUtil.error('错误，未找到指定历史记录，请刷新历史记录后重试！');
            }
        },
        drop(data: { e: DragEvent; dragNode: TreeNodeData; dropNode: TreeNodeData; dropPosition: number; }) {
            console.log(data)
        }
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
