<template>
  <div class="sub-title">
    <div class="title">
      <div class="title-icon"></div>
      <div>{{ title }}</div>
    </div>
    <div v-if="$slots['actions']" class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: String
})
defineSlots<{
  actions: () => void
}>()
</script>
<style scoped lang="less">
.sub-title {
  width: 100%;
  font-size: var(--td-font-size-body-large);
  color: var(--td-text-color-primary);
  font-weight: bold;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: center;
  }
  .title-icon {
    width: 4px;
    height: 16px;
    background-color: var(--td-brand-color);
    margin-right: 12px;
  }
}
</style>
