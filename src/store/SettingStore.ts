import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/entity/Setting";
import ArrayUtil from "@/utils/ArrayUtil";

const useSettingStore = defineStore('setting', {
    state: () => {
        let setting = useLocalStorage<Setting>('setting', {
            defaultViewer: 2,
            defaultReplica: 1,
            defaultShard: 5,
            seniorWidth: 520,
            pageSize: 20,
            pageStep: 10,
            timeout: 5000,
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
        getDefaultViewer: (state) => ArrayUtil.contains([1, 2, 3], state.instance.defaultViewer) ? state.instance.defaultViewer : 1,
        getPageSize: (state) => state.instance.pageSize,
        getPageStep: (state) => state.instance.pageStep,
        getTimeout: (state): number => state.instance.timeout,
        getHomeSearchState: (state): number => ArrayUtil.contains([0, 1, 2], state.instance.homeSearchState) ? state.instance.homeSearchState : 0,
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