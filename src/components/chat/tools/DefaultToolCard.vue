<template>
  <div class="default-tool-card">
    <t-collapse
      :default-value="[]"
      expand-icon-placement="right"
      :expand-on-row-click="true"
      borderless
    >
      <t-collapse-panel :value="toolCallId">
        <template #header>
          <div class="tool-header">
            <tools-icon size="16px" class="tool-icon" />
            <span class="tool-name">{{ content.data.toolCallName }}</span>
            <t-tag
              v-if="statusConfig"
              :theme="statusConfig.theme"
              variant="light-outline"
              size="small"
              class="tool-status"
            >
              {{ statusConfig.label }}
            </t-tag>
          </div>
        </template>
        <div class="tool-body">
          <div class="tool-section">
            <div class="section-label">参数</div>
            <div class="section-value">
              <pre v-if="formattedArgs" class="code-block"><code>{{ formattedArgs }}</code></pre>
              <span v-else class="empty-hint">无参数</span>
            </div>
          </div>
          <t-divider class="section-divider" />
          <div class="tool-section">
            <div class="section-label">结果</div>
            <div class="section-value">
              <pre
                v-if="formattedResult"
                class="code-block"
              ><code>{{ formattedResult }}</code></pre>
              <div v-else-if="isLoading" class="loading-row">
                <t-loading size="small" />
                <span class="loading-text">执行中…</span>
              </div>
              <span v-else class="empty-hint">暂无结果</span>
            </div>
          </div>
        </div>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { ToolCallContent } from '@tdesign-vue-next/chat'
import { ToolsIcon } from 'tdesign-icons-vue-next'

const props = defineProps({
  content: {
    type: Object as PropType<ToolCallContent>,
    required: true
  }
})

const toolCallId = computed(() => props.content.data.toolCallId)

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

const isLoading = computed(() => {
  const s = props.content.status
  return s === 'pending' || s === 'streaming'
})

function tryFormatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

const formattedArgs = computed(() => {
  if (!props.content.data.args) return ''
  return tryFormatJson(props.content.data.args)
})

const formattedResult = computed(() => {
  if (!props.content.data.result) return ''
  return tryFormatJson(props.content.data.result)
})
</script>
<style scoped lang="less">
.default-tool-card {
  margin: var(--td-comp-margin-xs) 0;
  border-radius: var(--td-radius-medium, 8px);
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--td-shadow-1, 0 1px 2px rgba(0, 0, 0, 0.06));
  }
}

.tool-header {
  display: flex;
  align-items: center;
  gap: var(--td-comp-margin-s);
  min-width: 0;
}

.tool-icon {
  color: var(--td-text-color-placeholder);
  flex-shrink: 0;
}

.tool-name {
  font: var(--td-font-body-medium);
  font-weight: var(--td-font-weight-medium, 500);
  color: var(--td-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-status {
  flex-shrink: 0;
  margin-left: auto;
}

.tool-body {
  padding: var(--td-comp-paddingTB-xs) 0;
}

.tool-section {
  padding: 0 var(--td-comp-paddingTB-s);
}

.section-label {
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
  margin-bottom: var(--td-comp-margin-xs);
}

.section-value {
  max-height: 240px;
  overflow: auto;
}

.code-block {
  margin: 0;
  padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-m);
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-small);
  font: var(--td-font-body-small);
  font-family: var(--td-font-family-mono, 'Cascadia Code', 'Fira Code', 'Consolas', monospace);
  color: var(--td-text-color-primary);
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.6;
}

.section-divider {
  margin: var(--td-comp-margin-xs) 0;
}

.empty-hint {
  font: var(--td-font-body-small);
  color: var(--td-text-color-placeholder);
  font-style: italic;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: var(--td-comp-margin-s);
}

.loading-text {
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
}
</style>
