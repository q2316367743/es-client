<template>
  <div class="sub-page-layout">
    <div class="sub-page-container">
      <header class="sub-page-header">
        <div class="sub-page-header__left">
          <t-space v-if="slots['subtitle']" size="small">
            <t-button
              theme="primary"
              variant="text"
              shape="square"
              class="shrink-0"
              @click="handlerClick"
            >
              <template #icon>
                <chevron-left-icon />
              </template>
            </t-button>
            <div class="sub-page-header__title">
              <slot name="title" v-if="slots['title']"></slot>
              <span v-else-if="title">{{ title }}</span>
            </div>
            <slot name="subtitle" />
          </t-space>
          <template v-else>
            <t-button
              theme="primary"
              variant="text"
              shape="square"
              class="shrink-0"
              @click="handlerClick"
            >
              <template #icon>
                <chevron-left-icon />
              </template>
            </t-button>
            <div class="sub-page-header__title">
              <slot name="title" v-if="slots['title']"></slot>
              <span v-else-if="title">{{ title }}</span>
            </div>
            <slot name="subtitle" />
          </template>
        </div>
        <div class="sub-page-header__right" v-if="slots['extra']">
          <slot name="extra"></slot>
        </div>
      </header>
      <div :class="['sub-page-container__wrapper', { padding: padding }]">
        <slot />
      </div>
    </div>
    <t-back-top container=".sub-page-layout .sub-page-container" />
  </div>
</template>
<script lang="ts" setup>
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import { useSafeBack } from '@/hooks'

defineProps({
  title: String,
  padding: {
    type: Boolean,
    default: true
  }
})
const slots = defineSlots()

const handlerClick = useSafeBack()
</script>
<style scoped lang="less">
.sub-page-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
}

.sub-page-container {
  flex: 1;
  overflow: hidden auto;
  scroll-behavior: smooth;
}

.sub-page-header {
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

.sub-page-container__wrapper {
  overflow: hidden;
  height: 100%;

  &.padding {
    padding: 0 16px 16px;
  }
}
</style>
