<template>
    <el-tabs
        v-model="searchId"
        type="card"
        editable
        class="tab-menu"
        @edit="editTabs"
    >
        <el-tab-pane
            v-for="item in searchItemHeaders"
            :key="item.name"
            :label="item.name"
            :name="item.id"
        >
            <template #label>
                <el-dropdown trigger="contextmenu" @command="optionTab">
                    <div>{{ item.name }}</div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :command="`close-one|${item.id}`">关闭此标签</el-dropdown-item>
                            <el-dropdown-item :command="`close-other|${item.id}`">关闭其他标签
                            </el-dropdown-item>
                            <el-dropdown-item :command="`close-all|${item.id}`">关闭全部标签</el-dropdown-item>
                            <el-dropdown-item :command="`rename|${item.id}|${item.name}`">重命名
                            </el-dropdown-item>
                            <el-dropdown-item :command="`save-history|${item.id}`">保存到历史</el-dropdown-item>
                            <el-dropdown-item v-if="item.relationId && item.relationId !== 0"
                                              :command="`update-history|${item.id}|${item.relationId}`">更新到历史
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TabMenuItem from "@/components/TabMenu/TabMenuItem";
import useSettingStore from "@/store/SettingStore";
import Optional from "@/utils/Optional";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import {ElNotification} from "element-plus";
import MessageUtil from "@/utils/MessageUtil";

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
        editTabs(targetName: number, action: 'remove' | 'add') {
            if (action === 'add') {
                let count = Optional.ofNullable(this.searchItemHeaders).map(e => e!.length).orElse(0);
                if (count === useSettingStore().getTabMaxCount - 1) {
                    // 马上到达最大限制
                    if (useSettingStore().getTabCloseMode === TabCloseModeEnum.FIRST) {
                        ElNotification({
                            title: '警告',
                            type: 'warning',
                            message: '标签页已达到最大限制，再次新增标签页会关闭第一个标签'
                        })
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
        optionTab(command: string) {
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