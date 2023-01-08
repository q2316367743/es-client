import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import ServerSetting from "@/domain/ServerSetting";
import ServerModeEnum from "@/enumeration/ServerModeEnum";

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