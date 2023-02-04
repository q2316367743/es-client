import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import SyncSetting from "@/domain/SyncSetting";
import SyncModeEnum from "@/enumeration/SyncModeEnum";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";

const useSyncStore = defineStore('sync-setting', {
    state: () => {
        return {
            syncSetting: {
                mode: SyncModeEnum.DISABLE,
                server: {
                    url: '',
                    token: ''
                }
            }
        }
    },
    getters: {
        getSync: (state): SyncSetting => state.syncSetting,
        getSyncMode: (state): SyncModeEnum => state.syncSetting.mode,
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