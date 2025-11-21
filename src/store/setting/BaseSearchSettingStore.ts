import BaseSearchSetting from "@/entity/setting/BaseSearchSetting";
import {defineStore} from "pinia";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {parseJsonWithBigIntSupport} from "@/algorithm/format";

export function getDefaultBaseSearchSetting(): BaseSearchSetting {
  return {
    defaultParams: "",
    enableTrackTotalHits: true,
    trackTotalHits: true,
    defaultView: ViewTypeEnum.EDITOR
  }
}

export const useBaseSearchSettingStore = defineStore('base-search-setting', {
  state: () => ({
    baseSearchSetting: getDefaultBaseSearchSetting(),
    rev: undefined as string | undefined
  }),
  getters: {
    defaultParams: state => {
      let params = {};
      if (state.baseSearchSetting.defaultParams.trim() !== '') {
        try {
          params = parseJsonWithBigIntSupport(state.baseSearchSetting.defaultParams);
        } catch (e) {
          console.error(e);
        }
      }
      return params;
    },
    enableTrackTotalHits: state => state.baseSearchSetting.enableTrackTotalHits,
    trackTotalHits: state => state.baseSearchSetting.trackTotalHits,
    defaultView: state => state.baseSearchSetting.defaultView
  },
  actions: {
    async init() {
      const {record, rev} = await getFromOneByAsync(
        LocalNameEnum.SETTING_BASE_SEARCH, getDefaultBaseSearchSetting());
      this.baseSearchSetting = record;
      this.rev = rev;
    },
    async save(setting: BaseSearchSetting) {
      this.baseSearchSetting = setting;
      this.rev = await saveOneByAsync(LocalNameEnum.SETTING_BASE_SEARCH, this.baseSearchSetting, this.rev);
    }
  }
})
