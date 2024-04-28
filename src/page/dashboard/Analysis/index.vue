<template>
    <div class="abs-07">
        <a-tabs v-model:active-key="activeKey" hide-content>
            <a-tab-pane title="字段类型" :key="ActiveKey.FIELD_TYPE"/>
            <a-tab-pane title="分析器" :key="ActiveKey.ANALYZER" disabled/>
            <template #extra>
                <a-button type="text" @click="action()">
                    <template #icon>
                        <icon-question-circle/>
                    </template>
                </a-button>
            </template>
        </a-tabs>
        <div class="container-47">
            <da-field-type v-show="activeKey === ActiveKey.FIELD_TYPE"/>
            <da-analyzer v-show="activeKey === ActiveKey.ANALYZER"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import DaFieldType from "@/page/dashboard/Analysis/DaFieldType.vue";
import DaAnalyzer from "@/page/dashboard/Analysis/DaAnalyzer.vue";
import {showAnalyzer, showFieldType} from "@/page/dashboard/Analysis/ShowQuestion";

enum ActiveKey {
    FIELD_TYPE = 'field type',
    ANALYZER = 'analyzer'
}

const activeKey = ref(ActiveKey.FIELD_TYPE);

function action() {
    if (activeKey.value === ActiveKey.ANALYZER) {
        showAnalyzer()
    } else if (activeKey.value == ActiveKey.FIELD_TYPE) {
        showFieldType()
    }
}

</script>
<style scoped>

</style>
