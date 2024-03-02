<template>
    <div class="senior-search-side" :style="{height: height}">
        <!-- 编辑器 -->
        <div class="senior-search-editor">
            <!-- 操作栏 -->
            <ss-option/>
            <!-- rest客户端编辑器 -->
            <rest-client-editor ref="editorInstance" class="editor"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useWindowSize} from "@vueuse/core";
import RestClientEditor from "@/page/senior-search/layout/senior-search-editor/components/rest-client-editor/index.vue";
import SsOption from "@/page/senior-search/layout/senior-search-editor/components/ss-option/index.vue";

const size = useWindowSize();
const height = computed(() => (size.height.value - 103) + 'px');


</script>
<style scoped>

</style>
