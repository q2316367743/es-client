import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import ServerSetting from "@/domain/ServerSetting";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import Optional from "@/utils/Optional";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";

const useServerStore = defineStore('server-setting', {
    state: () => {
        return {
            serverSetting: {
                mode: ServerModeEnum.CLIENT,
                url: '',
                token: ''
            }
        }
    },
    getters: {
        getServer: (state): ServerSetting => state.serverSetting,
        getServerMode: (state): ServerModeEnum => Optional.ofNullable(state.serverSetting).map(e => e.mode).orElse(ServerModeEnum.CLIENT)
    },
    actions: {
        init() {
            let serverSetting = lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING_SERVER);
            if (serverSetting && serverSetting !== '') {
                this.serverSetting = JSON.parse(serverSetting);
            }
        },
        setServer(serverSetting: ServerSetting): void {
            this.serverSetting = serverSetting;
            this.sync();
        },
        setServerMode(mode: ServerModeEnum) {
            this.serverSetting.mode = mode;
            this.sync();
        },
        sync() {
            lodisStrategyContext.getStrategy().set(
                LocalStorageKeyEnum.SETTING_SERVER,
                JSON.stringify(this.serverSetting));
        }
    }
});

export default useServerStore;