import { defineStore } from "pinia";
import { lodisStrategyContext } from "@/global/BeanFactory";
import Setting from "@/domain/Setting";
// 工具类
import ArrayUtil from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";
import { getDefaultLanguage } from '@/utils/GlobalUtil';
import DefaultUtil from "@/utils/DefaultUtil";
// 枚举
import TabCloseModeEnum from "@/enumeration/TabCloseModeEnum";
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import TabLoadModeEnum from "@/enumeration/TabLoadModeEnum";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";


const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            language: getDefaultLanguage(),
            instance: DefaultUtil.getDefaultSettingValue()
        }
    },
    getters: {
        getDefaultPage: (state): PageNameEnum => Optional.ofNullable(state.instance.defaultPage).orElse(PageNameEnum.HOME),
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.instance.defaultShard,
        getDefaultReplica: (state) => state.instance.defaultReplica,
        getDefaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.instance.defaultViewer).orElse(ViewTypeEnum.JSON),
        getPageSize: (state): number => state.instance.pageSize,
        getTimeout: (state): number => Optional.ofNullable(state.instance.timeout).orElse(5000),
        getNotificationTime: (state): number => Optional.ofNullable(state.instance.notificationTime).orElse(5000),
        getAutoFullScreen: (state): boolean => state.instance.autoFullScreen,
        getHomeSearchState: (state): number => ArrayUtil.contains([0, 1, 2], state.instance.homeSearchState) ? state.instance.homeSearchState : 0,
        getHomeExcludeIndices: (state): Array<string> => Optional.ofNullable(state.instance.homeExcludeIndices).orElse(new Array<string>()),
        getHomeIncludeIndices: (state): Array<string> => Optional.ofNullable(state.instance.homeIncludeIndices).orElse(new Array<string>()),
        getShowTab: (state): boolean => Optional.ofNullable(state.instance.showTab).orElse(true),
        getTabLoadMode: (state): TabLoadModeEnum => Optional.ofNullable(state.instance.tabLoadMode).orElse(TabLoadModeEnum.APPEND),
        getTabMaxCount: (state): number => Optional.ofNullable(state.instance.tabMaxCount).orElse(10),
        getTabCloseMode: (state): TabCloseModeEnum => Optional.ofNullable(state.instance.tabCloseMode).orElse(TabCloseModeEnum.ALERT),
        getTableHeaderMode: (state): TableHeaderModeEnum => Optional.ofNullable(state.instance.tableHeaderMode).orElse(TableHeaderModeEnum.RENDER),
        getLastUrl: (state): boolean => Optional.ofNullable(state.instance.lastUrl).orElse(false),
        getJsonWarp: (state): boolean => Optional.ofNullable(state.instance.jsonWrap).orElse(false),
        getSeniorFilter: (state): boolean => Optional.ofNullable(state.instance.seniorFilter).orElse(false),

        showTab: (state): boolean => Optional.ofNullable(state.instance.showTab).orElse(true),
        pageSize: (state): number => Optional.ofNullable(state.instance.pageSize).orElse(20),
        defaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.instance.defaultViewer).orElse(ViewTypeEnum.JSON),
    },
    actions: {
        async init() {
            let setting = await lodisStrategyContext.getStrategy().get<Setting>(LocalStorageKeyEnum.SETTING);
            if (setting) {
                try {
                    this.instance = Object.assign(DefaultUtil.getDefaultSettingValue(), setting);
                } catch (e) {
                    console.error(e);
                }
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
        addHomeIncludeIndex(index: string): void {
            if (!this.instance.homeIncludeIndices) {
                this.instance.homeIncludeIndices = new Array<string>();
            }
            this.instance.homeIncludeIndices.push(index);
            this.sync();
        },
        removeHomeIncludeIndex(index: string): void {
            if (!this.instance.homeIncludeIndices) {
                this.instance.homeIncludeIndices = new Array<string>();
                return;
            }
            this.instance.homeIncludeIndices.splice(this.instance.homeIncludeIndices.indexOf(index), 1);
            this.sync();
        },
        getDefaultValue: DefaultUtil.getDefaultSettingValue,
        setInstance(setting: Setting) {
            this.instance = setting;
            this.sync();
        },
        sync() {
            lodisStrategyContext.getStrategy().set<Setting>(LocalStorageKeyEnum.SETTING, this.instance)
                .then(() => console.log("同步成功"));
        }
    }
});

export default useSettingStore;