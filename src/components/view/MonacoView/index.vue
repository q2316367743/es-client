<template>
  <monaco-editor :model-value="pretty" language="json" :height="height" read-only />
</template>
<script lang="ts" setup>
import { formatJsonString } from "@/algorithm/file";
import MonacoEditor from "@/components/monaco-editor/index.vue";

const props = defineProps({
  value: String,
  height: String
});

const pretty = computed(() => {
  if (props.value) {
    return formatJsonString(props.value);
  } else {
    return "{}";
  }
});
</script>
<script lang="ts">
export default defineComponent({
  name: "MonacoView"
});
</script>
<style lang="less"></style>
