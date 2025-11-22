import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {DbSetting, getDefaultDbSetting} from "@/entity/setting/DbSetting";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";

export const useDbSettingStore = defineStore(LocalNameEnum.SETTING_DATA_BROWSE, () => {

  const dbSetting = ref(getDefaultDbSetting());
  let isInit = false;

  const params = computed(() => {
    const res: Record<string, any> = {};
    if (dbSetting.value.enableTrackTotalHits) {
      res['track_total_hits'] = true;
    }
    return res;
  })

  const fixId = computed(() => dbSetting.value.fixId);

  async function init() {
    if (isInit) {
      return;
    }
    const res = await getFromOneByAsync(LocalNameEnum.SETTING_DATA_BROWSE, dbSetting.value);
    dbSetting.value = res.record;
    isInit = true;
  }

  async function save(record: DbSetting) {
    dbSetting.value = record;
    await saveOneByAsync(LocalNameEnum.SETTING_DATA_BROWSE, dbSetting.value);
  }

  return {
    dbSetting, params, fixId,
    init, save
  }

})
