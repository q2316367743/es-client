import { defineStore } from 'pinia'
import { getDefaultGlobalSetting, GlobalSetting } from '@/entity/setting/GlobalSetting'
// 工具类
import { contains } from '@/utils/lang'
import Optional from '@/utils/Optional'
// 枚举
import ViewTypeEnum from '@/enumeration/ViewTypeEnum'
import { getFromOneByAsync, saveOneByAsync } from '@/utils/utools/DbStorageUtil'
import LocalNameEnum from '@/enumeration/LocalNameEnum'
import { computed, ref } from 'vue'

let lock = false
let todo = false

export const useGlobalSettingStore = defineStore('global-setting', () => {
  const globalSetting = ref<GlobalSetting>(getDefaultGlobalSetting())

  // Getters
  const getDefaultShard = computed(() => globalSetting.value.defaultShard)
  const getDefaultReplica = computed(() => globalSetting.value.defaultReplica)
  const getPageSize = computed((): number => globalSetting.value.pageSize)
  const getTimeout = computed((): number =>
    Optional.ofNullable(globalSetting.value.timeout).orElse(5000)
  )
  const getNotificationTime = computed((): number =>
    Optional.ofNullable(globalSetting.value.notificationTime).orElse(5000)
  )
  const getHomeSearchState = computed((): number =>
    contains([0, 1, 2], globalSetting.value.homeSearchState)
      ? globalSetting.value.homeSearchState
      : 0
  )
  const getHomeExcludeIndices = computed(
    (): Array<string> =>
      Optional.ofNullable(globalSetting.value.homeExcludeIndices).orElse(new Array<string>())
  )
  const getHomeIncludeIndices = computed(
    (): Array<string> =>
      Optional.ofNullable(globalSetting.value.homeIncludeIndices).orElse(new Array<string>())
  )
  const pageSize = computed((): number =>
    Optional.ofNullable(globalSetting.value.pageSize).orElse(20)
  )
  const baseDefaultViewer = computed(
    (): ViewTypeEnum =>
      Optional.ofNullable(globalSetting.value.baseDefaultViewer).orElse(ViewTypeEnum.EDITOR)
  )
  const seniorDefaultViewer = computed(
    (): ViewTypeEnum =>
      Optional.ofNullable(globalSetting.value.seniorDefaultViewer).orElse(ViewTypeEnum.EDITOR)
  )
  const trackTotalHitsMode = computed(() => globalSetting.value.trackTotalHitsMode)
  const trackTotalHitsValue = computed(() => globalSetting.value.trackTotalHitsValue)
  const indexOrderBy = computed(() => globalSetting.value.indexOrderBy || 'asc')
  const dataBrowserShowMeta = computed((): boolean =>
    Optional.ofNullable(globalSetting.value.dataBrowserShowMeta).orElse(false)
  )
  const baseSearchShowMeta = computed((): boolean =>
    Optional.ofNullable(globalSetting.value.baseSearchShowMeta).orElse(false)
  )
  const devToolViewer = computed(
    (): ViewTypeEnum =>
      Optional.ofNullable(globalSetting.value.devToolViewer).orElse(ViewTypeEnum.EDITOR)
  )
  const devToolShowMeta = computed((): boolean =>
    Optional.ofNullable(globalSetting.value.devToolShowMeta).orElse(false)
  )

  // track_total_hits
  const trackTotalHits = computed(() => {
    if (globalSetting.value.trackTotalHitsMode === 'custom') {
      return globalSetting.value.trackTotalHitsValue
    } else {
      return globalSetting.value.trackTotalHitsMode === 'true'
    }
  })

  const getLastUrl = computed((): boolean => globalSetting.value.lastUrl)

  // Actions
  async function init() {
    let globalSettingWrap = await getFromOneByAsync<GlobalSetting>(
      LocalNameEnum.SETTING_GLOBAL,
      getDefaultGlobalSetting()
    )
    globalSetting.value = globalSettingWrap.record
    console.log('初始化全局设置')
  }

  watchDebounced(globalSetting, sync)

  function sync() {
    if (lock) {
      todo = true
      return
    }
    lock = true
    saveOneByAsync(LocalNameEnum.SETTING_GLOBAL, globalSetting.value).finally(() => {
      lock = false
      if (todo) {
        todo = false
        sync()
      }
    })
  }

  return {
    // State
    globalSetting,

    // Getters
    getDefaultShard,
    getDefaultReplica,
    getPageSize,
    getTimeout,
    getNotificationTime,
    getHomeSearchState,
    getHomeExcludeIndices,
    getHomeIncludeIndices,
    pageSize,

    dataBrowserShowMeta,
    baseDefaultViewer,
    baseSearchShowMeta,
    devToolViewer,
    devToolShowMeta,
    seniorDefaultViewer,

    trackTotalHitsMode,
    trackTotalHitsValue,
    trackTotalHits,
    getLastUrl,
    indexOrderBy,

    // Actions
    init
  }
})
