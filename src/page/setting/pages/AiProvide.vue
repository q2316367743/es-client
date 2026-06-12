<template>
  <page-layout>
    <template #title>
      <span>AI 设置</span>
      <t-button
        theme="primary"
        variant="text"
        shape="square"
        class="ml-8px"
        @click="toggleCollapse()"
      >
        <template #icon>
          <view-list-icon />
        </template>
      </t-button>
    </template>
    <div class="ai-setting-layout">
      <!-- 左侧：提供方列表 -->
      <div :class="['ai-setting-sidebar', { 'is-collapsed': collapsed }]">
        <div class="ai-setting-sidebar__header">
          <span class="ai-setting-sidebar__title">提供方列表</span>
          <t-button theme="primary" size="small" @click="handleAdd">
            <template #icon><AddIcon /></template>
            新增
          </t-button>
        </div>
        <div class="ai-setting-sidebar__list">
          <div
            v-for="item in items"
            :key="item.id"
            :class="['ai-setting-sidebar__item', { 'is-active': selectedId === item.id }]"
          >
            <div class="ai-setting-sidebar__item-content" @click="selectItem(item.id)">
              <span class="ai-setting-sidebar__item-name">{{ item.name || '未命名' }}</span>
            </div>
            <t-popconfirm content="确定删除此提供方？" @confirm="handleDelete(item.id)">
              <t-button theme="danger" variant="text" size="small">
                <template #icon><DeleteIcon /></template>
              </t-button>
            </t-popconfirm>
          </div>
          <t-empty v-if="items.length === 0" description="暂无提供方，点击新增添加" />
        </div>
      </div>

      <!-- 右侧：编辑面板 -->
      <div class="ai-setting-main">
        <template v-if="!selectedId && !isCreating">
          <t-empty description="请选择一个提供方或新增" class="mt-25vh" />
        </template>
        <template v-else>
          <!-- 基本信息 -->
          <t-form :data="form" layout="vertical" class="ai-setting-form">
            <t-form-item label="名称" name="name">
              <t-auto-complete
                v-model="form.name"
                :options="namePresets"
                allow-input
                filterable
                clearable
                creatable
                placeholder="选择或输入，例如：OpenAI、DeepSeek"
                @change="onNameChange"
              />
            </t-form-item>
            <t-form-item label="接口地址" name="baseUrl">
              <t-input v-model="form.baseUrl" placeholder="例如：https://api.openai.com/v1" />
            </t-form-item>
            <t-form-item label="密钥" name="key">
              <t-input
                v-model="form.key"
                type="password"
                placeholder="请输入 API Key"
                allow-clear
              />
              <t-link
                theme="primary"
                class="shrink-0 ml-8px"
                href="https://www.codex365.cc?from=es-client"
                target="_blank"
              >
                立即获取接口密钥
              </t-link>
            </t-form-item>
            <t-form-item>
              <t-space>
                <t-button
                  theme="primary"
                  :loading="saving"
                  :disabled="!form.baseUrl.trim() || form.models.length === 0"
                  @click="handleSave"
                >
                  保存
                </t-button>
                <t-button
                  :disabled="!form.baseUrl.trim()"
                  :loading="fetching"
                  @click="handleFetchModels"
                >
                  从接口获取模型
                </t-button>
              </t-space>
            </t-form-item>
          </t-form>

          <t-divider />

          <!-- 模型管理 -->
          <div class="model-section">
            <div class="model-section__header">
              <span class="model-section__title">模型列表</span>
              <t-button size="small" @click="showModelDialog = true">
                <template #icon><AddIcon /></template>
                添加模型
              </t-button>
            </div>

            <t-table
              v-if="form.models.length > 0"
              :data="form.models"
              :columns="modelColumns"
              row-key="id"
              size="small"
              hover
              :bordered="true"
              table-layout="fixed"
              style="margin-top: 12px"
            >
              <template #identifier="{ row }">
                <t-tag variant="light" size="small">{{ row.identifier }}</t-tag>
              </template>
              <template #thinking="{ row }">
                <t-switch v-model="row.thinking" size="small" />
              </template>
              <template #thinkingDepth="{ row }">
                <t-select
                  v-if="row.thinking"
                  v-model="row.thinkingDepth"
                  size="small"
                  style="width: 80px"
                >
                  <t-option value="high" label="高" />
                  <t-option value="max" label="最大" />
                </t-select>
                <span v-else class="text-muted">-</span>
              </template>
              <template #action="{ row }">
                <t-button
                  theme="danger"
                  variant="text"
                  size="small"
                  @click="handleDeleteModel(row)"
                >
                  <template #icon><DeleteIcon /></template>
                </t-button>
              </template>
            </t-table>
            <t-empty
              v-else
              description="暂无模型，请从接口获取或手动添加"
              style="margin-top: 12px"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 添加模型对话框 -->
    <t-dialog
      v-model:visible="showModelDialog"
      header="添加模型"
      :confirm-btn="{
        content: '添加',
        loading: modelSaving
      }"
      @confirm="handleAddModelConfirm"
      @cancel="showModelDialog = false"
    >
      <t-form :data="modelForm" layout="vertical">
        <t-form-item label="模型标识" name="identifier">
          <t-input v-model="modelForm.identifier" placeholder="例如：gpt-4o、deepseek-chat" />
        </t-form-item>
        <t-form-item label="显示名称" name="name">
          <t-input v-model="modelForm.name" placeholder="例如：GPT-4o、DeepSeek Chat" />
        </t-form-item>
        <t-form-item label="支持思考" name="thinking">
          <t-switch v-model="modelForm.thinking" />
        </t-form-item>
        <t-form-item v-if="modelForm.thinking" label="思考深度" name="thinkingDepth">
          <t-select v-model="modelForm.thinkingDepth" style="width: 120px">
            <t-option value="high" label="高" />
            <t-option value="max" label="最大" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 从接口获取的模型选择对话框 -->
    <t-dialog
      v-model:visible="showFetchDialog"
      header="选择要导入的模型"
      :confirm-btn="{
        content: '导入选中',
        loading: importingModels
      }"
      @confirm="handleImportModels"
      @cancel="showFetchDialog = false"
    >
      <t-checkbox-group v-model="selectedFetchModels">
        <t-checkbox
          v-for="m in fetchedModels"
          :key="m.id"
          :value="m.id"
          :label="`${m.id}${m.name ? ' (' + m.name + ')' : ''}`"
        />
      </t-checkbox-group>
      <t-empty v-if="fetchedModels.length === 0" description="未获取到模型数据" />
    </t-dialog>
  </page-layout>
</template>

<script lang="ts" setup>
import { AddIcon, DeleteIcon, ViewListIcon } from 'tdesign-icons-vue-next'
import { useAiProvideStore } from '@/store/setting/AiProvideStore'
import type { AiModel } from '@/entity'
import OpenAI from 'openai'
import MessageUtil from '@/utils/model/MessageUtil'
import { useBoolState } from '@/hooks'

const store = useAiProvideStore()

// ---------- 提供方名称预设 ----------

const providerPresets: Array<{ label: string; baseUrl: string }> = [
  { label: 'Codex365', baseUrl: 'https://www.codex365.cc/v1' },
  { label: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
  { label: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1' },
  { label: 'Ollama (本地)', baseUrl: 'http://localhost:11434/v1' },
  { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
  { label: 'Together AI', baseUrl: 'https://api.together.xyz/v1' },
  { label: 'Mistral AI', baseUrl: 'https://api.mistral.ai/v1' },
  { label: 'Perplexity', baseUrl: 'https://api.perplexity.ai' },
  { label: '零一万物 (Yi)', baseUrl: 'https://api.lingyiwanwu.com/v1' },
  { label: 'Moonshot (月之暗面)', baseUrl: 'https://api.moonshot.cn/v1' },
  { label: '阿里云 (通义千问)', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1' },
  { label: '百度千帆', baseUrl: 'https://qianfan.baobao.baidu.com/v2' },
  { label: '硅基流动', baseUrl: 'https://api.siliconflow.cn/v1' },
  { label: '小米', baseUrl: 'https://token-plan-cn.xiaomimimo.com/v1' }
]

// ---------- 左侧列表 ----------

const items = computed(() => store.items)
const selectedId = ref<string>('')
const [collapsed, toggleCollapse] = useBoolState(false)

const isCreating = ref(false)

// ---------- 右侧表单 ----------

let form = reactive({
  id: '',
  name: '',
  baseUrl: providerPresets[0].baseUrl,
  key: '',
  models: [] as AiModel[]
})

// 选中提供方：填充表单
function selectItem(id: string) {
  if (id === selectedId.value) {
    selectedId.value = ''
    isCreating.value = false
    form.id = ''
    form.name = ''
    form.baseUrl = ''
    form.key = ''
    form.models = [] as AiModel[]
    return
  }
  selectedId.value = id
  const item = store.items.find((i) => i.id === id)
  if (item) {
    isCreating.value = false
    form.id = item.id
    form.name = item.name
    form.baseUrl = item.baseUrl
    form.key = item.key
    form.models = item.models.map((m) => ({ ...m }))
  }
}

const saving = ref(false)

async function handleSave() {
  if (!form.name) {
    MessageUtil.warning('请输入提供方名称')
    return
  }
  if (!form.baseUrl) {
    MessageUtil.warning('请输入接口地址')
    return
  }
  if (!form.key) {
    MessageUtil.warning('请输入密钥')
    return
  }
  saving.value = true
  try {
    await store.put({
      id: form.id || undefined,
      name: form.name,
      baseUrl: form.baseUrl,
      key: form.key,
      models: toRaw(form.models)
    })
    // 新增完成后，选中刚刚保存的项，退出创建模式
    if (isCreating.value) {
      // 新增完成后，选中刚刚保存的项
      const added = store.items.find(
        (item) => item.name === form.name && item.baseUrl === form.baseUrl
      )
      if (added) selectItem(added.id)
      isCreating.value = false
    }
    MessageUtil.success('保存成功')
  } catch (e) {
    MessageUtil.error('保存失败: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}

const namePresets = providerPresets.map((p) => ({ label: p.label, value: p.label }))

function onNameChange(value: any) {
  if (value) {
    const matched = providerPresets.find((p) => p.label === value)
    if (matched) {
      form.baseUrl = matched.baseUrl
      return
    }
  }
}

// ---------- 新增提供方 ----------

function handleAdd() {
  isCreating.value = true
  form.id = ''
  form.name = ''
  form.baseUrl = providerPresets[0].baseUrl
  form.key = ''
  form.models = []
  selectedId.value = ''
}

// ---------- 删除提供方 ----------

async function handleDelete(id: string) {
  await store.remove(id)
  if (selectedId.value === id) {
    if (store.items.length > 0) {
      selectItem(store.items[0].id)
    } else {
      selectedId.value = ''
    }
  }
}

// ---------- 模型表格 ----------

const modelColumns = [
  { colKey: 'identifier', title: '标识', width: 180 },
  { colKey: 'name', title: '名称', minWidth: 120 },
  { colKey: 'thinking', title: '支持思考', width: 100 },
  { colKey: 'thinkingDepth', title: '思考深度', width: 100 },
  { colKey: 'action', title: '操作', width: 60 }
]

// ---------- 手动添加模型 ----------

const showModelDialog = ref(false)
const modelSaving = ref(false)
const modelForm = reactive<{
  identifier: string
  name: string
  thinking: boolean
  thinkingDepth: 'high' | 'max'
}>({
  identifier: '',
  name: '',
  thinking: false,
  thinkingDepth: 'high'
})

function handleAddModel() {
  modelForm.identifier = ''
  modelForm.name = ''
  modelForm.thinking = false
  modelForm.thinkingDepth = 'high'
  showModelDialog.value = true
}

function handleAddModelConfirm() {
  if (!modelForm.identifier) {
    MessageUtil.warning('请输入模型标识')
    return
  }
  if (!modelForm.name) {
    MessageUtil.warning('请输入显示名称')
    return
  }
  const exists = form.models.some((m) => m.identifier === modelForm.identifier)
  if (exists) {
    MessageUtil.warning('模型标识已存在')
    return
  }
  form.models.push({
    identifier: modelForm.identifier,
    name: modelForm.name,
    thinking: modelForm.thinking,
    thinkingDepth: modelForm.thinking ? modelForm.thinkingDepth : 'high'
  })
  showModelDialog.value = false
  MessageUtil.success('模型已添加')
}

// ---------- 删除模型 ----------

function handleDeleteModel(row: AiModel) {
  const index = form.models.findIndex((m) => m.identifier === row.identifier)
  if (index > -1) {
    form.models.splice(index, 1)
  }
}

// ---------- 从接口获取模型 ----------

const fetching = ref(false)
const showFetchDialog = ref(false)
const fetchedModels = ref<Array<{ id: string; name: string }>>([])
const selectedFetchModels = ref<string[]>([])
const importingModels = ref(false)

async function handleFetchModels() {
  if (!form.baseUrl || !form.key) {
    MessageUtil.warning('请先填写接口地址和密钥')
    return
  }
  fetching.value = true
  try {
    const client = new OpenAI({
      baseURL: form.baseUrl,
      apiKey: form.key,
      dangerouslyAllowBrowser: true
    })
    const response = await client.models.list()
    const models = response.data || []
    fetchedModels.value = models
      .filter((m: { id: string }) => !form.models.some((fm) => fm.identifier === m.id))
      .map((m: { id: string; owned_by?: string }) => ({
        id: m.id,
        name: m.id
      }))
    selectedFetchModels.value = fetchedModels.value.map((m) => m.id)
    showFetchDialog.value = fetchedModels.value.length > 0
    if (fetchedModels.value.length === 0) {
      MessageUtil.info('未获取到新模型，或所有模型已存在')
    }
  } catch (e) {
    MessageUtil.error('获取模型失败: ' + (e as Error).message)
  } finally {
    fetching.value = false
  }
}

function handleImportModels() {
  if (selectedFetchModels.value.length === 0) {
    MessageUtil.warning('请至少选择一个模型')
    return
  }
  importingModels.value = true
  try {
    const matched = fetchedModels.value.filter((m) => selectedFetchModels.value.includes(m.id))
    for (const m of matched) {
      form.models.push({
        identifier: m.id,
        name: m.name,
        thinking: false,
        thinkingDepth: 'high'
      })
    }
    showFetchDialog.value = false
    MessageUtil.success(`已导入 ${matched.length} 个模型`)
  } finally {
    importingModels.value = false
  }
}
</script>

<style scoped lang="less">
.ai-setting-layout {
  display: flex;
  height: 100%;
  gap: 16px;
}

// 左侧：提供方列表
.ai-setting-sidebar {
  width: 280px;
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--td-border-level-1-color);
  padding-right: 16px;
  transition: all 0.3s ease-in-out;

  &.is-collapsed {
    width: 0;
    min-width: 0;
    overflow-x: hidden;
    padding: 0;
    border-color: transparent;
  }
  &__header {
    width: 280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-right: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--td-text-color-primary);
  }

  &__list {
    width: 280px;
    min-width: 280px;
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: var(--td-radius-default);
    transition: background-color 0.2s;
    margin-bottom: 4px;

    &:hover {
      background-color: var(--td-bg-color-secondaryhover);
    }

    &.is-active {
      background-color: var(--td-brand-color-light);
    }
  }

  &__item-content {
    flex: 1;
    cursor: pointer;
  }

  &__item-name {
    font-size: 14px;
    color: var(--td-text-color-primary);
  }
}

// 右侧：编辑面板
.ai-setting-main {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  padding-right: 24px;
  padding-bottom: 24px;
  z-index: 1;
}

.ai-setting-form {
  max-width: 640px;
}

// 模型区域
.model-section {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--td-text-color-primary);
  }
}

.text-muted {
  color: var(--td-text-color-placeholder);
}
</style>
