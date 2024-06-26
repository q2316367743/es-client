<template>
    <div class="option">
        <div>
            <a-tooltip :content="allowEdit ? '更新' : '保存'" position="right">
                <a-button type="text" :status="allowEdit ? 'danger' : 'success'" @click="saveHistory()">
                    <template #icon>
                        <icon-save :size="18"/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="取消与历史记录的关联" v-if="allowEdit" position="right">
                <a-button type="text" status="danger" @click="clearHistory()">
                    <template #icon>
                        <icon-close/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="格式化" position="right">
                <a-button type="text" status="normal" @click="formatDocument()">
                    <template #icon>
                        <icon-code/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="清空" position="right">
                <a-button type="text" status="normal" @click="clearBody()">
                    <template #icon>
                        <format-icon/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-dropdown position="bl" @select="select">
                <a-tooltip content="修改视图" position="right">
                    <a-button type="text" status="normal">
                        <template #icon>
                            <icon-code :size="18" v-if="seniorSearchView === ViewTypeEnum.BASE"/>
                            <icon-code-block :size="18" v-else-if="seniorSearchView === ViewTypeEnum.JSON"/>
                            <icon-nav :size="18" v-else-if="seniorSearchView === ViewTypeEnum.TABLE"/>
                            <icon-mind-mapping :size="18" v-else-if="seniorSearchView === ViewTypeEnum.JSON_TREE"/>
                            <icon-edit :size="18" v-else-if="seniorSearchView === ViewTypeEnum.EDITOR"/>
                        </template>
                    </a-button>
                </a-tooltip>
                <template #content>
                    <a-doption :value="ViewTypeEnum.BASE">基础视图</a-doption>
                    <a-doption :value="ViewTypeEnum.JSON">JSON视图</a-doption>
                    <a-doption :value="ViewTypeEnum.TABLE">表格视图</a-doption>
                    <a-doption :value="ViewTypeEnum.JSON_TREE">JSON树视图</a-doption>
                    <a-doption :value="ViewTypeEnum.EDITOR">编辑器视图</a-doption>
                </template>
            </a-dropdown>
            <a-tooltip content="编辑器设置" position="right">
                <a-button type="text" status="normal" @click="useSeniorSearchSetting()">
                    <template #icon>
                        <icon-settings :size="18" />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="帮助" position="right">
                <a-button type="text" status="normal" @click="openHelp()">
                    <template #icon>
                        <icon-question-circle :size="18"/>
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <div>
            <slot name="footer"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import FormatIcon from "@/icon/FormatIcon.vue";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {seniorSearchView, useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {
    useSeniorSearchSetting
} from "@/page/senior-search/layout/senior-search-editor/components/ss-option/SeniorSearchSetting";

const allowEdit = computed(() => useSeniorSearchStore().id !== 0);

const openHelp = () => utools.shellOpenExternal('https://www.yuque.com/baozhiyige-tewwf/ygxv4r/ya0xyiidxty4lois');
const formatDocument = () => useSeniorSearchStore().formatDocument();
const clearBody = () => useSeniorSearchStore().clearBody();
const saveHistory = () => useSeniorSearchStore().saveHistory();
const clearHistory = () => useSeniorSearchStore().clearHistory();

function select(value: any) {
    seniorSearchView.value = value;
}

</script>
<style lang="less">
.senior-search {
    .option {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 32px;

        .arco-btn {
            margin-left: 0;
        }
    }
}
</style>
