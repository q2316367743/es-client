<template>
  <div class="abs-8 !right-0 material-card min-w-250px overflow-hidden">
    <!-- 工具栏 -->
    <div class="toolbar flex items-center">
      <t-space size="small">
        <t-button variant="text" size="small" @click="openFileContextmenu($event, activeKey)">
          <template #icon>
            <add-icon />
          </template>
          {{ $t('dev_tool.new') }}
        </t-button>
        <t-button variant="text" size="small" :loading="refreshing" @click="handleRefresh">
          <template #icon>
            <refresh-icon />
          </template>
          {{ $t('dev_tool.refresh') }}
        </t-button>
      </t-space>
      <div class="ml-auto">
        <t-radio-group v-model="activeKey" variant="default-filled" size="small">
          <t-radio-button value="global">{{ $t('dev_tool.global') }}</t-radio-button>
          <t-radio-button value="current" :disabled="!urlId">{{
            $t('dev_tool.current')
          }}</t-radio-button>
        </t-radio-group>
      </div>
    </div>

    <!-- 文件树 -->
    <div class="tree-container">
      <t-tree
        v-model:expanded="expanded"
        :actived="actives"
        :data="items"
        activable
        hover
        transition
        expand-parent
        @click="onClick"
      >
        <template #label="{ node }">
          <div class="tree-node-label" @contextmenu.prevent="openFileContextmenu($event, node)">
            <div class="node-icon">
              <folder-icon v-if="node.data.icon === 'folder'" class="icon-folder" />
              <file-code-icon v-else-if="node.data.icon === 'file'" class="icon-file" />
            </div>
            <div class="node-label">{{ node.label }}</div>
            <div class="node-operator">
              <t-dropdown trigger="click" :max-column-width="120">
                <t-button theme="primary" size="small" variant="text" @click.stop>
                  <template #icon>
                    <more-icon />
                  </template>
                </t-button>
                <t-dropdown-menu>
                  <t-dropdown-item
                    v-if="node.data.icon !== 'file'"
                    @click="
                      createDevTool({
                        folder: true,
                        parentId:
                          node.value === 'global' || node.value === 'current' ? '0' : node.value
                      })
                    "
                  >
                    <template #prefix-icon>
                      <file-add-icon />
                    </template>
                    {{ $t('dev_tool.new_file') }}
                  </t-dropdown-item>
                  <t-dropdown-item
                    v-if="node.data.icon !== 'file'"
                    @click="
                      createDevTool({
                        folder: true,
                        parentId:
                          node.value === 'global' || node.value === 'current' ? '0' : node.value
                      })
                    "
                  >
                    <template #prefix-icon>
                      <folder-add-icon />
                    </template>
                    {{ $t('dev_tool.new_folder') }}
                  </t-dropdown-item>
                  <t-dropdown-item
                    v-if="node.data.icon !== 'global' && node.data.icon !== 'connection'"
                    @click="handleFileRename(node)"
                  >
                    <template #prefix-icon>
                      <edit-icon />
                    </template>
                    {{ $t('dev_tool.rename') }}
                  </t-dropdown-item>
                  <t-dropdown-item
                    v-if="node.data.icon !== 'global' && node.data.icon !== 'connection'"
                    theme="error"
                    @click="handleFileDelete(node)"
                  >
                    <template #prefix-icon>
                      <delete-icon />
                    </template>
                    {{ $t('dev_tool.delete') }}
                  </t-dropdown-item>
                </t-dropdown-menu>
              </t-dropdown>
            </div>
          </div>
        </template>
      </t-tree>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TdTreeProps } from 'tdesign-vue-next'
import { useDevToolFileItemStore } from '@/store/db/DevToolFileItemStore'
import { useDevToolStore, useUrlStore } from '@/store'
import {
  handleFileDelete,
  handleFileRename,
  openFileContextmenu
} from '@/page/dev-tool/layout/DevToolFile/func/FileContextmenu'
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  FileAddIcon,
  FileCodeIcon,
  FolderAddIcon,
  FolderIcon,
  MoreIcon,
  RefreshIcon
} from 'tdesign-icons-vue-next'
import MessageUtil from '@/utils/model/MessageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { createDevTool } from '@/page/dev-tool/layout/DevToolFile/func/CreateDevTool'
import { toggleArray } from '$/util'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fileItemStore = useDevToolFileItemStore()
const searchStore = useDevToolStore()
const urlStore = useUrlStore()

// 缓存展开的节点
const expanded = useSessionStorage(LocalNameEnum.KEY_DEV_TOOL_EXPENDED, [])

const refreshing = ref(false)
const { activeKey } = toRefs(fileItemStore)

const items = computed(() => fileItemStore.items)
const actives = computed(() => [searchStore.activeId])
const urlId = computed(() => urlStore.id)

const onClick: TdTreeProps['onClick'] = ({ node }) => {
  if (node.data?._source?.folder === 1 || !node.data?._source) {
    // 文件夹，toggle
    toggleArray(expanded.value, node.value)
    return
  }
  searchStore.onFileItemClick(node.data._source)
}

// 刷新文件列表
const handleRefresh = async () => {
  refreshing.value = true
  try {
    fileItemStore.refresh()
    MessageUtil.success(t('dev_tool.refresh_success'))
  } catch (error) {
    MessageUtil.error(t('dev_tool.refresh_failed'), error)
  } finally {
    refreshing.value = false
  }
}

// 组件挂载时刷新数据
onMounted(() => {
  // 自动刷新
  fileItemStore.refresh()
})
</script>
<style scoped lang="less">
.toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  flex-shrink: 0;
}

.tree-container {
  flex: 1;
  overflow: auto;
  padding: 8px;

  .tree-node-label {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 2px 4px;
    border-radius: var(--td-radius-small);
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }

    .node-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      flex-shrink: 0;

      .icon-global {
        color: var(--td-brand-color);
      }

      .icon-connection {
        color: var(--td-success-color);
      }

      .icon-folder {
        color: var(--td-warning-color);
      }

      .icon-file {
        color: var(--td-text-color-secondary);
      }
    }

    .node-label {
      flex: 1;
      font-size: 14px;
      color: var(--td-text-color-primary);
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
