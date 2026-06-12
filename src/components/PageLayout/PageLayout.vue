<template>
  <div class="page-layout">
    <div class="page-container">
      <header class="page-header">
        <div class="page-header__left">
          <t-space v-if="slots['subtitle']" size="small">
            <div class="page-header__title">
              <slot name="title" v-if="slots['title']"></slot>
              <span v-else-if="title">{{ title }}</span>
            </div>
            <slot name="subtitle" />
          </t-space>
          <template v-else>
            <div class="page-header__title">
              <slot name="title" v-if="slots['title']"></slot>
              <span v-else-if="title">{{ title }}</span>
            </div>
            <slot name="subtitle" />
          </template>
        </div>
        <div class="page-header__right" v-if="slots['extra']">
          <slot name="extra"></slot>
        </div>
      </header>
      <div :class="['page-container__wrapper', { padding: padding }]">
        <slot />
      </div>
    </div>
    <t-back-top container=".page-layout .page-container__wrapper" />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: String,
  padding: {
    type: Boolean,
    default: true
  }
})
const slots = defineSlots()
</script>
<style scoped lang="less">
.page-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
}

.page-container {
  flex: 1;
  overflow: hidden auto;
  scroll-behavior: smooth;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  box-sizing: border-box;

  // Acrylic glass material — Fluent Design
  background-color: color-mix(in srgb, var(--td-bg-color-container) 72%, transparent);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);

  &__left {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }

  &__title {
    display: flex;
    align-items: center;
    min-width: 0;
    font-size: 20px;
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: -0.2px;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
    line-height: 32px;

    :deep(span) {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__right {
    display: flex;
    align-items: center;
  }
}

.page-container__wrapper {
  overflow: auto;
  height: calc(100% - 72px);

  &.padding {
    padding: 0 16px 16px;
  }
}
</style>
