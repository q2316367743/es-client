<template>
    <a-tabs
        v-model:active-key="searchId"
        type="card-gutter"
        editable
        show-add-button auto-switch
        class="tab-menu"
        @add="editTabs('', 'add')"
        @delete="editTabs($event, 'remove')"
        :hide-content="true"
    >
        <a-tab-pane
            v-for="item in searchItemHeaders"
            :key="item.id"
        >
            <template #title>
                <a-dropdown trigger="contextMenu" @select="optionTab">
                    <div>{{ item.name }}</div>
                    <template #content>
                        <a-doption :value="`close-one|${item.id}`">关闭此标签</a-doption>
                        <a-doption :value="`close-other|${item.id}`">关闭其他标签
                        </a-doption>
                        <a-doption :value="`close-all|${item.id}`">关闭全部标签</a-doption>
                        <a-doption :value="`rename|${item.id}|${item.name}`">重命名
                        </a-doption>
                        <a-doption :value="`save-history|${item.id}`">保存到历史</a-doption>
                        <a-doption v-if="item.relationId && item.relationId !== 0"
                                   :value="`update-history|${item.id}|${item.relationId}`">更新到历史
                        </a-doption>
                    </template>
                </a-dropdown>
            </template>
        </a-tab-pane>
    </a-tabs>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import MessageUtil from "@/utils/MessageUtil";
import NotificationUtil from "@/utils/NotificationUtil";

export default defineComponent({
    name: 'tab-menu',
    emits: ['update:modelValue', 'editTabs', 'optionTab'],
    props: {
        modelValue: Number,
        searchItemHeaders: Array<TabMenuItem>
    },
    data: () => ({
        searchId: 0
    }),
    watch: {
        modelValue(newValue: number) {
            this.searchId = newValue;
        },
        searchId(newValue: number) {
            this.$emit('update:modelValue', newValue);
        }
    },
    created() {
        this.searchId = this.modelValue!;
    },
    methods: {
        editTabs(targetName: any, action: 'remove' | 'add') {
            if (action === 'add') {
                let count = Optional.ofNullable(this.searchItemHeaders).map(e => e!.length).orElse(0);
                if (count === useSettingStore().getTabMaxCount - 1) {
                    // 马上到达最大限制
                    if (useSettingStore().getTabCloseMode === TabCloseModeEnum.FIRST) {
                        NotificationUtil.warning('标签页已达到最大限制，再次新增标签页会关闭第一个标签', '警告');
                    }
                }
                if (count >= useSettingStore().getTabMaxCount) {
                    // 标签数超过最大数
                    if (useSettingStore().getTabCloseMode === TabCloseModeEnum.FIRST) {
                        if (this.searchItemHeaders && this.searchItemHeaders.length > 0) {
                            this.$emit('editTabs', this.searchItemHeaders[0].id, 'remove');
                        }
                    } else {
                        // 默认进行提示
                        MessageUtil.warning('标签数量超过最大限制，请关闭不需要的标签');
                        return
                    }
                }
            }
            this.$emit('editTabs', targetName, action);
        },
        optionTab(command: any) {
            this.$emit('optionTab', command);
        }
    }
});
</script>
<style lang="less">
.tab-menu {

    .el-tabs__nav {
        .el-tabs__item {
            &.is-active {
                .el-tooltip__trigger {
                    color: var(--active-color);
                }
            }

            .el-tooltip__trigger {
                line-height: 40px;
            }
        }
    }
}
</style>