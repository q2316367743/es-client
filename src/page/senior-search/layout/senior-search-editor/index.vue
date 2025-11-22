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
import {RestClientEditor} from "@/components/rest-client-editor";
import SsOption from "@/page/senior-search/layout/senior-search-editor/components/ss-option/index.vue";
import {enableFilter} from "@/store/record/SeniorFilterRecordStore";

const size = useWindowSize();
const height = computed(() => (size.height.value - (enableFilter.value ? 103 : 56)) + 'px');


</script>
<style scoped>

</style>
