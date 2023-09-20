<template>
    <div class="senior-search-side" :style="{height: height}">
        <!-- 编辑器 -->
        <div class="senior-search-editor">
            <!-- 操作栏 -->
            <ss-option/>
            <!-- rest客户端编辑器 -->
            <rest-client-editor ref="editorInstance" v-model="body" class="editor"
                                @execute="execute($event)"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
// 存储
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
// 组件
import RestClientEditor from "@/page/senior-search/layout/senior-search-editor/components/rest-client-editor/index.vue";
import SsOption from "@/page/senior-search/layout/senior-search-editor/components/ss-option/index.vue";

const size = useWindowSize();
const height = computed(() => (size.height.value - 103) + 'px');

const editorInstance = ref<any | null>(null)
const body = ref(useSeniorSearchStore().body);

watch(() => body.value, value => useSeniorSearchStore().updateBody(value));
watch(() => useSeniorSearchStore().body, value => body.value = value);

const execute = (index: number) => useSeniorSearchStore().execute(index, editorInstance.value.getInstance());

</script>
<style scoped>

</style>
