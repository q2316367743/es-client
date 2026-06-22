import { TreeNodeModel } from 'tdesign-vue-next'
import { AddIcon, CopyIcon, DeleteIcon, HighlightIcon } from 'tdesign-icons-vue-next'
import Cxt, { type MenuItem } from '@imengyu/vue3-context-menu'
import { useGlobalStore } from '@/store/GlobalStore'
import { copyText } from '@/utils/BrowserUtil'
import { decodeValue, useDataBrowseStore } from '@/store/components/DataBrowseStore'
import { useDataBrowserViewStore } from '@/store/components/DataBrowserViewStore'
import { useDataBrowserQueryStore } from '@/store/components/DataBrowserQueryStore'
import MessageUtil from '@/utils/model/MessageUtil'
import { useUrlStore } from '@/store'
import i18n from '@/i18n'

const t = (key: string) => i18n.global.t(key)

export function openContextmenu(node: TreeNodeModel, e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  const { empty } = useUrlStore()
  if (empty) return
  const { isDark } = useGlobalStore()
  const items: MenuItem[] = []
  const { type, id } = decodeValue(`${node.value}`)
  switch (type) {
    case 'folder':
      switch (id) {
        case 'view':
          items.push({
            label: t('module.data_browse.add_view'),
            icon: () => <AddIcon />,
            onClick: () => useDataBrowserViewStore().add()
          })
          break
        case 'query':
          items.push({
            label: t('module.data_browse.add_query'),
            icon: () => <AddIcon />,
            onClick: () => useDataBrowserQueryStore().add()
          })
      }
      break
    case 'view':
    case 'query':
      items.push(
        {
          label: t('module.data_browse.rename'),
          icon: () => <HighlightIcon />,
          onClick: () => {
            if (type === 'view') {
              MessageUtil.error(t('module.data_browse.rename_view_error'))
            } else {
              useDataBrowserQueryStore()
                .rename(id, node.label!)
                .catch((e) => MessageUtil.error(t('module.data_browse.rename_failed'), e))
            }
          }
        },
        {
          label: t('module.data_browse.delete'),
          icon: () => <DeleteIcon />,
          onClick: () => {
            if (type === 'view') {
              useDataBrowserViewStore()
                .remove(id, node.label!)
                .catch((e) => MessageUtil.error(t('module.data_browse.delete_failed'), e))
            } else {
              useDataBrowserQueryStore()
                .remove(id, node.label!)
                .catch((e) => MessageUtil.error(t('module.data_browse.delete_failed'), e))
            }
          }
        }
      )
    case 'index':
    case 'alias':
      if (type === 'index' || type === 'alias') {
        items.unshift({
          label: t('module.data_browse.copy_name'),
          icon: () => <CopyIcon />,
          onClick: () => {
            if (node.label) copyText(node.label)
          }
        })
      }
      items.unshift({
        label: t('module.data_browse.open'),
        icon: () => <HighlightIcon />,
        onClick: () => {
          useDataBrowseStore().openTab(`${node.value}`, node.label || `${Date.now()}`)
        }
      })
      break
  }
  if (items.length === 0) return
  Cxt.showContextMenu({
    x: e.x,
    y: e.y,
    theme: isDark ? 'mac dark' : 'mac',
    items: items
  })
}
