<template>
  <div class="system-prompt">{{ prompt }}</div>
</template>
<script lang="ts" setup>
defineProps({
  prompt: {
    type: String,
    default: ''
  }
})
</script>
<style scoped lang="less">
.system-prompt {
  // 小字
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
  // 灰色背景
  background: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
  padding: 3px 12px;
  // 居中，宽度 70%
  width: 70%;
  margin: 0 auto;
  text-align: center;
  // 最多 3 行，超出省略号
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
