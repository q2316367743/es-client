import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/domain/Setting";
import ArrayUtil from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";

const useSettingStore = defineStore('setting', {
    state: () => {
        let setting = useLocalStorage<Setting>('setting', {

            // 新建索引
            defaultReplica: 1,
            defaultShard: 5,

            // http设置
            timeout: 5000,

            // 全局索引查询条件
            homeSearchState: 0,
            homeExcludeIndices: new Array<string>(),

            // 显示设置
            pageSize: 20,
            defaultViewer: 2,
            jsonThemeByLight: 'docco',
            jsonThemeByDark: 'github-dark',

            // 标签栏设置
            showTab: true,
            tabMaxCount: 10,
            tabCloseMode: TabCloseModeEnum.ALERT,

            // 其他设置
            autoFullScreen: false,
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
        getDefaultViewer: (state) => ArrayUtil.contains([1, 2, 3], state.instance.defaultViewer) ? state.instance.defaultViewer : 1,
        getPageSize: (state) => state.instance.pageSize,
        getTimeout: (state): number => Optional.ofNullable(state.instance.timeout).orElse(5000),
        getAutoFullScreen: (state): boolean => state.instance.autoFullScreen,
        getHomeSearchState: (state): number => ArrayUtil.contains([0, 1, 2], state.instance.homeSearchState) ? state.instance.homeSearchState : 0,
        getHomeExcludeIndices: (state): Array<string> => Optional.ofNullable(state.instance.homeExcludeIndices).orElse(new Array<string>()),
        getShowTab: (state): boolean => Optional.ofNullable(state.instance.showTab).orElse(true),
        getTabMaxCount: (state): number => Optional.ofNullable(state.instance.tabMaxCount).orElse(10),
        getTabCloseMode: (state): TabCloseModeEnum => Optional.ofNullable(state.instance.tabCloseMode).orElse(TabCloseModeEnum.ALERT)
    },
    actions: {
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        addHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
            }
            this.instance.homeExcludeIndices.push(index);
        },
        removeHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
                return;
            }
            this.instance.homeExcludeIndices.splice(this.instance.homeExcludeIndices.indexOf(index), 1);
        }
    }
});

export default useSettingStore;