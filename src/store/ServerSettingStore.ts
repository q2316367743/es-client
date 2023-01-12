import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import ServerSetting from "@/entity/ServerSetting";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import Optional from "@/utils/Optional";

const useServerStore = defineStore('server-setting', {
    state: () => {
        return {
            serverSetting: useLocalStorage<ServerSetting>('setting-server', {
                mode: ServerModeEnum.CLIENT,
                url: '',
                token: ''
            } as ServerSetting)
        }
    },
    getters: {
        getServer: (state): ServerSetting => state.serverSetting,
        getServerMode: (state): ServerModeEnum => Optional.ofNullable(state.serverSetting).map(e => e.mode).orElse(ServerModeEnum.CLIENT)
    },
    actions: {
        setServer(serverSetting: ServerSetting): void {
            this.serverSetting = serverSetting;
        },
        setServerMode(mode: ServerModeEnum) {
            this.serverSetting.mode = mode;
        }
    }
});

export default useServerStore;