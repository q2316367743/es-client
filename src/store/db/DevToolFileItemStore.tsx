import { TreeOptionData } from 'tdesign-vue-next'
import { defineStore } from 'pinia'
import { DevToolFileCreateProp, DevToolFileItem } from '@/entity'
import MessageBoxUtil from '@/utils/model/MessageBoxUtil'
import { useDevToolStore } from '@/store/components/DevToolStore'
import { listToTree } from '@/page/dev-tool/func'
import { useUrlStore } from '@/store'
import {
  devToolFileCreate,
  devToolFileDelete,
  devToolFileList,
  devToolFileRename
} from '@/api/DevToolFileService'

export const useDevToolFileItemStore = defineStore('useDevToolFileItemStore', () => {
  // 全局文件
  const res = ref(new Array<DevToolFileItem>())
  const globalRes = ref(new Array<DevToolFileItem>())
  const activeKey = ref<'global' | 'current'>('global')

  const items = computed<Array<TreeOptionData>>(() => {
    if (activeKey.value === 'global') {
      // 全局文件
      return listToTree(globalRes.value)
    }

    const { id } = useUrlStore()

    // 当没有链接时，什么都不返回
    if (!id) return []

    return listToTree(res.value)
  })

  const queryList = () => {
    devToolFileList('0')
      .then((items) => {
        globalRes.value = items
      })
      .catch((error) => {
        console.error('查询全局文件失败:', error)
        globalRes.value = []
      })
    const { id } = useUrlStore()
    if (!id) {
      res.value = []
      return
    }
    devToolFileList(id)
      .then((items) => {
        res.value = items
      })
      .catch((error) => {
        console.error('查询当前文件失败:', error)
        res.value = []
      })
  }

  watch(() => useUrlStore().id, queryList, { immediate: true })

  const add = async (prop: DevToolFileCreateProp) => {
    const { id } = useUrlStore()
    await devToolFileCreate(activeKey.value === 'global' ? '0' : id || '0', prop)
    queryList()
  }

  const create = async (parentId: string, folder: boolean) => {
    const name = await MessageBoxUtil.prompt(
      '请输入文件' + (folder ? '夹' : '') + '名',
      '创建文件' + (folder ? '夹' : '')
    )

    await add({ name, folder, parentId })
  }

  const rename = async (item: DevToolFileItem) => {
    const { id } = useUrlStore()
    if (!id) {
      return Promise.reject(new Error('请先选择连接'))
    }
    const suffix = item.folder ? '夹' : ''
    const newName = await MessageBoxUtil.prompt('请输入新的' + suffix + '文件名', '重命名', {
      inputValue: item.name
    })

    await devToolFileRename(id, item.id, newName)

    queryList()
  }

  const remove = async (item: DevToolFileItem) => {
    const { id } = useUrlStore()
    if (!id) {
      return Promise.reject(new Error('请先选择连接'))
    }
    const suffix = item.folder ? '夹' : ''
    await MessageBoxUtil.confirm(`确定要删除此文件${suffix}吗？`, '删除文件' + suffix)

    await devToolFileDelete(id, item.id)

    // 关闭打开的文件
    useDevToolStore().onFileItemClose(item.id)

    queryList()
  }

  return {
    activeKey,
    items,
    add,
    create,
    rename,
    remove,
    refresh: queryList
  }
})
