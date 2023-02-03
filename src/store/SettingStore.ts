import {defineStore} from "pinia";
import {getDefaultLanguage} from '@/utils/GlobalUtil';
import {useLocalStorage} from "@vueuse/core";
import Setting from "@/domain/Setting";
import ArrayUtil from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";

function getDefaultValue(): Setting {
    return {

        // 布局设置
        defaultPage: PageNameEnum.HOME,

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
        jsonThemeByLight: 'github',
        jsonThemeByDark: 'github-dark',

        // 标签栏设置
        showTab: true,
        tabMaxCount: 10,
        tabCloseMode: TabCloseModeEnum.ALERT,

        // 其他设置
        autoFullScreen: false,
    };
}

const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            language: getDefaultLanguage(),
            instance: getDefaultValue()
        }
    },
    getters: {
        getDefaultPage: (state) => Optional.ofNullable(state.instance.defaultPage).orElse(PageNameEnum.HOME),
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
        init() {
            let setting = lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING);
            if (setting && setting !== '') {
                this.instance = JSON.parse(setting);
            } else {
                this.instance = getDefaultValue();
            }
        },
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        addHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
            }
            this.instance.homeExcludeIndices.push(index);
            this.sync();
        },
        removeHomeExcludeIndex(index: string): void {
            if (!this.instance.homeExcludeIndices) {
                this.instance.homeExcludeIndices = new Array<string>();
                return;
            }
            this.instance.homeExcludeIndices.splice(this.instance.homeExcludeIndices.indexOf(index), 1);
            this.sync();
        },
        getDefaultValue,
        setInstance(setting: Setting) {
            this.instance = setting;
            this.sync();
        },
        sync() {
            lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.SETTING, JSON.stringify(this.instance));
        }
    }
});

export default useSettingStore;