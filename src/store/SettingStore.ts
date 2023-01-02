import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/entity/Setting";

const useSettingStore = defineStore('setting', {
    state: () => {
        let setting = useLocalStorage('setting', {
            defaultViewer: 2,
            defaultReplica: 1,
            defaultShard: 5,
            seniorWidth: 520,
            pageSize: 20,
            pageStep: 10,
            homeSearchState: 0,
            autoFullScreen: false
        } as Setting);
        return {
            language: getDefaultLanguage(),
            instance: setting
        }
    },
    getters: {
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.instance.defaultShard,
        getDefaultReplica: (state) => state.instance.defaultReplica,
        getSeniorWidth: (state) => state.instance.seniorWidth,
        getDefaultViewer: (state) => state.instance.defaultViewer in [1, 2, 3] ? state.instance.defaultViewer : 1,
        getPageSize: (state) => state.instance.pageSize,
        getPageStep: (state) => state.instance.pageStep,
        getTimeout: (state): number => state.instance.timeout,
        getHomeSearchState: (state): number => state.instance.homeSearchState,
        getAutoFullScreen: (state): boolean => state.instance.autoFullScreen,
    },
    actions: {
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        }
    }
});

export default useSettingStore;