import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import Server from "@/entity/Server";
import ServerModeEnum from "@/enumeration/ServerModeEnum";

const useServerStore = defineStore('server', {
    state: () => {
        return {
            server: useLocalStorage<Server>('server', {
                mode: ServerModeEnum.DISABLE,
                url: '',
                token: ''
            } as Server)
        }
    },
    getters: {
        getServer: (state): Server => state.server,
    },
    actions: {
        serServer(server: Server): void {
            this.server = server;
        }
    }
});

export default useServerStore;