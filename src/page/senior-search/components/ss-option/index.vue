<template>
    <div class="option">
        <div>
            <a-tooltip :content="relationId ? $t('common.operation.update') : $t('common.operation.save')" position="right">
                <a-button type="text" :status="relationId ? 'danger' : 'success'" @click="save">
                    <template #icon>
                        <icon-save :size="18" />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :content="$t('common.operation.format')" position="right">
                <a-button type="text" status="normal" @click="formatDocument">
                    <template #icon>
                        <icon-code />
                    </template>
                </a-button>
            </a-tooltip>
            <a-tooltip content="清空" position="right">
                <a-button type="text" status="normal" @click="clearBody">
                    <template #icon>
                        <format-icon />
                    </template>
                </a-button>
            </a-tooltip>
            <a-dropdown position="bl" @select="select">
                <a-button type="text" status="normal">
                    <template #icon>
                        <icon-code :size="18" v-if="view === ViewTypeEnum.BASE" />
                        <icon-code-block :size="18" v-else-if="view === ViewTypeEnum.JSON" />
                        <icon-nav :size="18" v-else-if="view === ViewTypeEnum.TABLE" />
                        <icon-mind-mapping :size="18" v-else-if="view === ViewTypeEnum.JSON_TREE" />
                    </template>
                </a-button>
                <template #content>
                    <a-doption :value="ViewTypeEnum.BASE">基础视图</a-doption>
                    <a-doption :value="ViewTypeEnum.JSON">JSON视图</a-doption>
                    <a-doption :value="ViewTypeEnum.TABLE">表格视图</a-doption>
                    <a-doption :value="ViewTypeEnum.JSON_TREE">JSON树视图</a-doption>
                </template>
            </a-dropdown>
            <ss-setting />
            <ss-export />
            <a-tooltip content="帮助" position="right">
                <a-button type="text" status="normal" @click="openHelp">
                    <template #icon>
                        <icon-question-circle :size="18" />
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <div>
            <slot name="footer" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import FormatIcon from "@/icon/FormatIcon.vue";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import SsSetting from '@/page/senior-search/components/ss-setting/index.vue'
import SsExport from '@/page/senior-search/components/ss-export/index.vue'

export default defineComponent({
    name: 'ss-option',
    components: { FormatIcon, SsSetting, SsExport },
    emits: ['save', 'formatDocument', 'clearBody', 'select', 'setting', 'exportData'],
    props: {
        relationId: Number,
        view: Number
    },
    data: () => ({
        ViewTypeEnum
    }),
    methods: {
        save() {
            this.$emit('save')
        },
        formatDocument() {
            this.$emit('formatDocument')
        },
        clearBody() {
            this.$emit('clearBody')
        },
        select(command: any) {
            this.$emit('select', command)
        },
        setting() {

            this.$emit('setting')
        },
        openHelp() {
            utools.shellOpenExternal('https://www.yuque.com/baozhiyige-tewwf/ygxv4r/ya0xyiidxty4lois');
        }
    }
});
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
