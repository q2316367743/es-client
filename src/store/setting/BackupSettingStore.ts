import {defineStore} from "pinia";
import BackupSetting from "@/entity/setting/BackupSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOne, saveOneByAsync} from "@/utils/utools/DbStorageUtil";


export function getDefaultBackupSetting(): BackupSetting {
  return {
    url: '',
    username: '',
    password: ''
  }
}


export const useBackupSettingStore = defineStore('backup-setting', {
  state: () => ({
    backupSetting: getDefaultBackupSetting(),
  }),
  actions: {
    async init() {
      const res = await getFromOne(LocalNameEnum.SETTING_BACKUP);
      if (res) {
        this.backupSetting = Object.assign(this.backupSetting, res);
      }
    },
    async save(backupSetting: BackupSetting) {
      this.backupSetting = backupSetting;
      await saveOneByAsync(LocalNameEnum.SETTING_BACKUP, toRaw(this.backupSetting));
    }
  }
})
