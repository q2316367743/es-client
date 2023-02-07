import {defineStore} from "pinia";
import SyncSetting from "@/domain/SyncSetting";
import SyncTypeEnum from "@/enumeration/SyncTypeEnum";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

const useSyncStore = defineStore('sync-setting', {
    state: () => {
        return {
            syncSetting: {
                type: SyncTypeEnum.DISABLE,
                mode: SyncModeEnum.COVER
            }
        }
    },
    getters: {
        getSync: (state): SyncSetting => state.syncSetting,
    },
    actions: {
        init() {
            let syncSetting = lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING_SYNC);
            if (syncSetting && syncSetting !== '') {
                this.syncSetting = JSON.parse(syncSetting);
            }
        },
        setSync(syncSetting: SyncSetting): void {
            this.syncSetting = syncSetting;
            this.sync();
        },
        sync() {
            lodisStrategyContext.getStrategy().set(
                LocalStorageKeyEnum.SETTING_SYNC,
                JSON.stringify(this.syncSetting)
            );
        }
    }
});

export default useSyncStore;