import {defineStore} from "pinia";
import {getDefaultGlobalSetting, GlobalSetting} from "@/entity/setting/GlobalSetting";
// 工具类
import {contains} from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";
// 枚举
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

let lock = false;
let todo = false;


const useGlobalSettingStore = defineStore('global-setting', {
  state: () => {
    return {
      globalSetting: getDefaultGlobalSetting(),
    }
  },
  getters: {
    getDefaultShard: (state) => state.globalSetting.defaultShard,
    getDefaultReplica: (state) => state.globalSetting.defaultReplica,

    getPageSize: (state): number => state.globalSetting.pageSize,

    getTimeout: (state): number => Optional.ofNullable(state.globalSetting.timeout).orElse(5000),
    getNotificationTime: (state): number => Optional.ofNullable(state.globalSetting.notificationTime).orElse(5000),

    getHomeSearchState: (state): number => contains([0, 1, 2], state.globalSetting.homeSearchState) ? state.globalSetting.homeSearchState : 0,
    getHomeExcludeIndices: (state): Array<string> => Optional.ofNullable(state.globalSetting.homeExcludeIndices).orElse(new Array<string>()),
    getHomeIncludeIndices: (state): Array<string> => Optional.ofNullable(state.globalSetting.homeIncludeIndices).orElse(new Array<string>()),

    pageSize: (state): number => Optional.ofNullable(state.globalSetting.pageSize).orElse(20),
    baseDefaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.globalSetting.baseDefaultViewer).orElse(ViewTypeEnum.EDITOR),
    seniorDefaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.globalSetting.seniorDefaultViewer).orElse(ViewTypeEnum.EDITOR),

    // track_total_hits
    trackTotalHits: (state) => {
      if (state.globalSetting.trackTotalHitsMode === "custom") {
        return state.globalSetting.trackTotalHitsValue;
      } else {
        return state.globalSetting.trackTotalHitsMode === "true";
      }
    }

  },
  actions: {
    async init() {
      let globalSettingWrap = await getFromOneByAsync<GlobalSetting>(LocalNameEnum.SETTING_GLOBAL, getDefaultGlobalSetting());
      this.globalSetting = globalSettingWrap.record;
    },
    setGlobalSetting(setting: GlobalSetting) {
      this.globalSetting = setting;
      this.sync();
    },
    sync() {
      if (lock) {
        todo = true
        return;
      }
      lock = true
      saveOneByAsync(LocalNameEnum.SETTING_GLOBAL, this.globalSetting)
        .finally(() => {
          lock = false;
          if (todo) {
            todo = false;
            this.sync();
          }
        });
    }
  }
});

export default useGlobalSettingStore;
