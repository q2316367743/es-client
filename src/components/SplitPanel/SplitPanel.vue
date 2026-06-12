<template>
  <div ref="containerRef" class="flex h-full">
    <div class="h-full overflow-auto relative" :style="{ width: leftPx }">
      <slot name="left" />
    </div>
    <div
      class="h-full"
      :style="dividerStyle"
      :class="dividerClass"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      @mousedown="onMouseDown"
    />
    <div class="flex-1 h-full overflow-auto relative">
      <slot name="right" />
    </div>
  </div>
  </template>
<script setup lang="ts">

const model = defineModel<number>({ default: 240 })

const props = defineProps<{ dividerWidth?: number }>()
const dividerW = computed(() => props.dividerWidth ?? 8)
const containerRef = ref<HTMLElement | null>(null)
const isHover = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const startLeft = ref(0)
const containerWidth = ref(0)

const leftPx = computed(() => `${model.value}px`)
const dividerStyle = computed(() => ({
  width: `${dividerW.value}px`,
  cursor: 'col-resize',
  transition: 'background-color 200ms ease-out',
  backgroundColor: (isHover.value || isDragging.value)
    ? '#72ABD9'
    : 'transparent'
}))
const dividerClass = computed(() => [])

function clamp() {
  const max = Math.max(0, containerWidth.value - dividerW.value)
  if (model.value > max) model.value = max
  if (model.value < 0) model.value = 0
}

function updateContainerWidth() {
  if (isVisible && containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
    // 当容器被 display: none 隐藏时 clientWidth 为 0，跳过不更新 model
    if (containerWidth.value === 0) return
    clamp()
  }
}

let ro: ResizeObserver | null = null
let isVisible = true

onMounted(() => {
  updateContainerWidth()
  if (containerRef.value) {
    ro = new ResizeObserver(() => updateContainerWidth())
    ro.observe(containerRef.value)
  }
  window.addEventListener('resize', updateContainerWidth)
})

onActivated(() => {
  isVisible = true
  updateContainerWidth()
})

onDeactivated(() => {
  isVisible = false
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', updateContainerWidth)
  detachListeners()
})

function onMouseDown(e: MouseEvent) {
  isDragging.value = true
  startX.value = e.clientX
  startLeft.value = model.value
  attachListeners()
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const delta = e.clientX - startX.value
  model.value = startLeft.value + delta
  clamp()
}

function onMouseUp() {
  if (!isDragging.value) return
  isDragging.value = false
  detachListeners()
}

function attachListeners() {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function detachListeners() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>
