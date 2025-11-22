<template>
  <div class="base-view">{{ pretty }}</div>
</template>
<script lang="ts">
import {formatJsonString} from "@/algorithm/file";


export default defineComponent({
  name: 'base-view',
  props: {
    value: String
  },
  computed: {
    pretty() {
      if (this.value) {
        return formatJsonString(this.value);
      } else {
        return '{}';
      }
    }
  }
});
</script>
<style lang="less">
.base-view {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: JetBrainsMono, Console, '微软雅黑', Courier, monospace !important;
}
</style>
