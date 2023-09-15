<template>
    <div class="editor" >
        <!-- 过滤器 -->
        <div class="js-option">
            <a-switch v-model="isEnableFilter">
                <template #checked>
                    启用
                </template>
                <template #unchecked>
                    禁用
                </template>
            </a-switch>
            <a-button type="primary" @click="execFilter()">过滤</a-button>
        </div>
        <div class="js-editor-wrapper">
            <!-- 过滤编辑器 -->
            <codemirror v-model="filter" placeholder="$为结果对象" :style="{ height: '100%' }"
                        class="js-editor" :autofocus="true" :indent-with-tab="true" :tabSize="4"
                        :extensions="extensions"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {Codemirror} from "vue-codemirror";
import {markRaw, ref, watch} from "vue";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {javascript} from "@codemirror/lang-javascript";

const extensions = markRaw<Array<any>>([javascript()]);
const isEnableFilter = ref(useSeniorSearchStore().isEnableFilter);
const filter = ref(useSeniorSearchStore().filter);

watch(() => isEnableFilter.value, value => useSeniorSearchStore().updateIsEnableFilter(value));
watch(() => useSeniorSearchStore().isEnableFilter, value => isEnableFilter.value = value);

watch(() => filter.value, value => useSeniorSearchStore().updateFilter(value));
watch(() => useSeniorSearchStore().filter, value => filter.value = value);

const execFilter = () => useSeniorSearchStore().execFilter();

</script>
<style scoped>

</style>
