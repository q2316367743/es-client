<template>
  <div class="dsl-tool-card">
    <!-- 头部 -->
    <div class="dsl-header">
      <div class="dsl-header-left">
        <code-icon size="18px" class="dsl-icon" />
        <span class="dsl-name">{{ content.data.toolCallName }}</span>
        <t-tag :theme="methodTheme" variant="light" size="small" class="dsl-method-tag">
          {{ dslMethod }}
        </t-tag>
      </div>
      <t-tag
        v-if="statusConfig"
        :theme="statusConfig.theme"
        variant="light-outline"
        size="small"
        class="dsl-status"
      >
        {{ statusConfig.label }}
      </t-tag>
    </div>

    <!-- 主体 -->
    <div class="dsl-body">
      <!-- 索引 -->
      <div class="dsl-field">
        <div class="dsl-field-label">
          <pin-icon size="14px" class="field-icon" />
          <span>索引</span>
        </div>
        <div class="dsl-field-value">
          <t-tag theme="primary" variant="light" size="small">
            {{ dslIndex }}
          </t-tag>
        </div>
      </div>

      <!-- 请求体 -->
      <div class="dsl-field">
        <div class="dsl-field-label">
          <code-icon size="14px" class="field-icon" />
          <span>请求体</span>
        </div>
        <div class="dsl-field-value">
          <pre class="dsl-code-block"><code>{{ dslBody }}</code></pre>
          <t-tooltip content="复制请求体">
            <t-button
              theme="default"
              variant="text"
              size="small"
              class="copy-btn"
              @click="copyDslBody"
            >
              <file-copy-icon />
            </t-button>
          </t-tooltip>
        </div>
      </div>

      <!-- 执行结果（如有） -->
      <div v-if="dslResult" class="dsl-field">
        <div class="dsl-field-label">
          <view-list-icon size="14px" class="field-icon" />
          <span>执行结果</span>
        </div>
        <div class="dsl-field-value">
          <pre class="dsl-code-block dsl-code-block--result"><code>{{ dslResult }}</code></pre>
        </div>
      </div>
    </div>

    <!-- 底部：执行按钮 -->
    <div class="dsl-footer">
      <t-button theme="primary" variant="base" class="dsl-execute-btn" @click="handleExecute">
        <template #icon><play-icon /></template>
        执行聚合
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { ToolCallContent } from '@tdesign-vue-next/chat'
import { CodeIcon, PinIcon, FileCopyIcon, ViewListIcon, PlayIcon } from 'tdesign-icons-vue-next'
import MessageUtil from '@/utils/model/MessageUtil'

const props = defineProps({
  content: {
    type: Object as PropType<ToolCallContent>,
    required: true
  }
})

const emit = defineEmits<{
  execute: [payload: { index: string; body: Record<string, unknown>; method: string }]
}>()

// ── 状态 ──

interface StatusConfig {
  theme: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  label: string
}

const statusConfig = computed<StatusConfig | null>(() => {
  const map: Record<string, StatusConfig> = {
    pending: { theme: 'default', label: '等待中' },
    streaming: { theme: 'primary', label: '执行中' },
    complete: { theme: 'success', label: '完成' },
    stop: { theme: 'default', label: '已停止' },
    error: { theme: 'danger', label: '错误' }
  }
  return props.content.status ? (map[props.content.status] ?? null) : null
})

// ── 工具函数 ──

function tryFormatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

// ── 参数解析 ──

const objectedArgs = computed(() => {
  if (!props.content.data.args) return {}
  try {
    return JSON.parse(props.content.data.args)
  } catch {
    return {}
  }
})

// ── DSL 字段 ──

const dslIndex = computed(() => String(objectedArgs.value['index'] ?? ''))

const dslBody = computed(() => {
  const body = objectedArgs.value['body']
  if (!body) return '{}'
  return tryFormatJson(typeof body === 'string' ? body : JSON.stringify(body))
})

const dslMethod = computed(() => {
  const method = objectedArgs.value['method']
  return method ? String(method).toUpperCase() : 'POST'
})

const methodTheme = computed(() => {
  return dslMethod.value === 'GET' ? 'primary' : 'success'
})

// ── 执行结果（过滤掉未执行时的 { type: 'dsl' } 描述） ──

const dslResult = computed(() => {
  if (!props.content.data.result) return ''
  try {
    const parsed = JSON.parse(props.content.data.result)
    if (parsed.type === 'dsl') return ''
  } catch {
    /* ignore */
  }
  return tryFormatJson(props.content.data.result)
})

// ── 操作 ──

function handleExecute() {
  emit('execute', {
    index: dslIndex.value,
    body: objectedArgs.value['body'],
    method: dslMethod.value
  })
}

function copyDslBody() {
  navigator.clipboard.writeText(dslBody.value).then(() => {
    MessageUtil.success('已复制请求体')
  })
}
</script>
<style scoped lang="less">
// ============================================
//  DSL 工具卡片
// ============================================
@dsl-accent: #0052d9;
@dsl-accent-bg: rgba(0, 82, 217, 0.06);

.dsl-tool-card {
  margin: var(--td-comp-margin-xs) 0;
  border-radius: var(--td-radius-medium, 8px);
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-left: 3px solid @dsl-accent;
  overflow: hidden;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    box-shadow: var(--td-shadow-2, 0 2px 8px rgba(0, 0, 0, 0.08));
  }
}

// 头部
.dsl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-l);
  background: @dsl-accent-bg;
  border-bottom: 1px solid var(--td-component-border);
}

.dsl-header-left {
  display: flex;
  align-items: center;
  gap: var(--td-comp-margin-s);
  min-width: 0;
}

.dsl-icon {
  color: @dsl-accent;
  flex-shrink: 0;
}

.dsl-name {
  font: var(--td-font-body-medium);
  font-weight: var(--td-font-weight-medium, 500);
  color: var(--td-text-color-primary);
}

.dsl-method-tag {
  flex-shrink: 0;
  font-family: var(--td-font-family-mono, 'Cascadia Code', 'Fira Code', 'Consolas', monospace);
  font-weight: 600;
}

.dsl-status {
  flex-shrink: 0;
}

// 主体
.dsl-body {
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingTB-l);
  display: flex;
  flex-direction: column;
  gap: var(--td-comp-margin-m);
}

.dsl-field {
  display: flex;
  flex-direction: column;
  gap: var(--td-comp-margin-xs);
}

.dsl-field-label {
  display: flex;
  align-items: center;
  gap: var(--td-comp-margin-xs);
  font: var(--td-font-body-small);
  font-weight: var(--td-font-weight-medium, 500);
  color: var(--td-text-color-secondary);
}

.field-icon {
  flex-shrink: 0;
  color: var(--td-text-color-placeholder);
}

.dsl-field-value {
  position: relative;
}

.dsl-code-block {
  margin: 0;
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingTB-l);
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-small);
  border: 1px solid var(--td-component-border);
  font: var(--td-font-body-small);
  font-family: var(--td-font-family-mono, 'Cascadia Code', 'Fira Code', 'Consolas', monospace);
  color: var(--td-text-color-primary);
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.7;
  max-height: 360px;
  overflow: auto;
  tab-size: 2;

  &--result {
    border-color: var(--td-success-color-3, #b8f0c5);
    background: var(--td-success-color-1, #e8f8ef);
  }
}

.copy-btn {
  position: absolute;
  top: var(--td-comp-margin-xs);
  right: var(--td-comp-margin-xs);
  opacity: 0;
  transition: opacity 0.2s ease;
  color: var(--td-text-color-placeholder);
}

.dsl-field-value:hover .copy-btn {
  opacity: 1;
}

// 底部
.dsl-footer {
  padding: 0 var(--td-comp-paddingTB-l) var(--td-comp-paddingTB-m);
}

.dsl-execute-btn {
  width: 100%;
  font-weight: var(--td-font-weight-medium, 500);
  letter-spacing: 0.3px;
  border-radius: var(--td-radius-small);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--td-shadow-1, 0 1px 4px rgba(0, 0, 0, 0.12));
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
