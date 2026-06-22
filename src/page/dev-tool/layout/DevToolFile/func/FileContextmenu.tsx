import {
  ComponentRadioIcon,
  DeleteIcon,
  EditIcon,
  FileAddIcon,
  FolderAddIcon
} from 'tdesign-icons-vue-next'
import { TreeNodeModel } from 'tdesign-vue-next'
import { DevToolFileItem } from '@/entity'
import Ctx, { MenuItem } from '@imengyu/vue3-context-menu'
import { useDevToolFileItemStore } from '@/store/db/DevToolFileItemStore'
import { useDevToolStore } from '@/store/components/DevToolStore'
import MessageUtil from '@/utils/model/MessageUtil'
import { useGlobalStore, useUrlStore } from '@/store'
import i18n from '@/i18n'

const t = (key: string) => i18n.global.t(key)

export function handleFileRename(node: TreeNodeModel) {
  const p = node.data._source as DevToolFileItem
  useDevToolFileItemStore()
    .rename(p)
    .then(() => {
      MessageUtil.success(t('dev_tool.rename_success'))
    })
    .catch((e) => {
      if (e !== 'cancel') MessageUtil.error(t('dev_tool.rename_failed'), e)
    })
}

export function handleFileDelete(node: TreeNodeModel) {
  const p = node.data._source as DevToolFileItem
  useDevToolFileItemStore()
    .remove(p)
    .then(() => {
      MessageUtil.success(t('dev_tool.delete_success'))
    })
    .catch((e) => {
      if (e !== 'cancel') MessageUtil.error(t('dev_tool.delete_failed'), e)
    })
}

export const openFileContextmenu = async (
  e: MouseEvent,
  active: 'global' | 'current',
  node?: TreeNodeModel
) => {
  e.preventDefault()
  e.stopPropagation()
  const { id } = useUrlStore()
  if (!id) {
    if (active === 'current') {
      return
    }
  }

  // 是否是根节点
  const root = !node
  // 是否是文件夹节点
  const folder = node?.data?._source?.folder !== 0
  const p = node?.data._source as DevToolFileItem
  const items = new Array<MenuItem>()

  // 为根节点和文件夹节点添加创建选项
  if (root || folder) {
    const parentId = root ? '0' : p.id

    items.push({
      label: t('dev_tool.new_file'),
      icon: () => <FileAddIcon />,
      onClick: () => {
        useDevToolFileItemStore()
          .create(parentId, false)
          .then(() => {
            MessageUtil.success(t('dev_tool.create_success'))
          })
      }
    })

    items.push({
      label: t('dev_tool.new_folder'),
      icon: () => <FolderAddIcon />,
      onClick: () => {
        useDevToolFileItemStore()
          .create(parentId, true)
          .then(() => {
            MessageUtil.success(t('dev_tool.create_success'))
          })
      }
    })
  }

  // 为文件节点添加打开选项
  if (!root && !folder) {
    items.push({
      label: t('dev_tool.open'),
      icon: () => <ComponentRadioIcon />,
      onClick: () => {
        useDevToolStore().onFileItemClick(p)
      }
    })
  }

  // 为非根节点添加重命名和删除选项
  if (!root) {
    items.push(
      {
        label: t('dev_tool.rename'),
        icon: () => <EditIcon />,
        onClick: () => {
          handleFileRename(node)
        }
      },
      {
        label: t('dev_tool.delete'),
        icon: () => <DeleteIcon />,
        onClick: () => {
          useDevToolFileItemStore()
            .remove(p)
            .then(() => {
              MessageUtil.success(t('dev_tool.delete_success'))
            })
            .catch((e) => {
              if (e !== 'cancel') MessageUtil.error(t('dev_tool.delete_failed'), e)
            })
        }
      }
    )
  }

  if (items.length === 0) return

  e.preventDefault()
  e.stopPropagation()
  Ctx.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'mac dark' : 'mac',
    items
  })
}
