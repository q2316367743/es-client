import {defineStore} from "pinia";
import {GlobalSetting, getDefaultGlobalSetting} from "@/entity/setting/GlobalSetting";
// 工具类
import ArrayUtil from "@/utils/ArrayUtil";
import Optional from "@/utils/Optional";
// 枚举
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import TableHeaderModeEnum from "@/enumeration/TableHeaderModeEnum";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useGlobalStore} from "@/store/GlobalStore";

let lock = false;
let todo = false;


const useGlobalSettingStore = defineStore('global-setting', {
    state: () => {
        return {
            globalSetting: getDefaultGlobalSetting(),
            rev: undefined as undefined | string
        }
    },
    getters: {
        getDefaultShard: (state) => state.globalSetting.defaultShard,
        getDefaultReplica: (state) => state.globalSetting.defaultReplica,

        getDefaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.globalSetting.defaultViewer).orElse(ViewTypeEnum.JSON),
        getPageSize: (state): number => state.globalSetting.pageSize,

        getTimeout: (state): number => Optional.ofNullable(state.globalSetting.timeout).orElse(5000),
        getNotificationTime: (state): number => Optional.ofNullable(state.globalSetting.notificationTime).orElse(5000),

        getHomeSearchState: (state): number => ArrayUtil.contains([0, 1, 2], state.globalSetting.homeSearchState) ? state.globalSetting.homeSearchState : 0,
        getHomeExcludeIndices: (state): Array<string> => Optional.ofNullable(state.globalSetting.homeExcludeIndices).orElse(new Array<string>()),
        getHomeIncludeIndices: (state): Array<string> => Optional.ofNullable(state.globalSetting.homeIncludeIndices).orElse(new Array<string>()),
        getTableHeaderMode: (state): TableHeaderModeEnum => Optional.ofNullable(state.globalSetting.tableHeaderMode).orElse(TableHeaderModeEnum.RENDER),
        getLastUrl: (state): boolean => Optional.ofNullable(state.globalSetting.lastUrl).orElse(false),
        jsonWrap: (state): boolean => Optional.ofNullable(state.globalSetting.jsonWrap).orElse(false),
        jsonFontSize: state => state.globalSetting.jsonFontSize,

        pageSize: (state): number => Optional.ofNullable(state.globalSetting.pageSize).orElse(20),
        defaultViewer: (state): ViewTypeEnum => Optional.ofNullable(state.globalSetting.defaultViewer).orElse(ViewTypeEnum.JSON),


        jsonTheme: state => {
            if (useGlobalStore().isDark) {
                return Optional.ofNullable(state.globalSetting.jsonThemeByDark).orElse('atom-one-dark');
            } else {
                return Optional.ofNullable(state.globalSetting.jsonThemeByLight).orElse('github');
            }
        }
    },
    actions: {
        async init() {
            let globalSetting = await getFromOneByAsync<GlobalSetting>(LocalNameEnum.SETTING_GLOBAL, getDefaultGlobalSetting());
            if (globalSetting) {
                try {
                    Object.assign(this.globalSetting, globalSetting);
                    this.rev = globalSetting.rev;
                } catch (e) {
                    console.error(e);
                }
            }
            return Promise.resolve();
        },
        addHomeExcludeIndex(index: string): void {
            if (!this.globalSetting.homeExcludeIndices) {
                this.globalSetting.homeExcludeIndices = new Array<string>();
            }
            this.globalSetting.homeExcludeIndices.push(index);
            this.sync();
        },
        removeHomeExcludeIndex(index: string): void {
            if (!this.globalSetting.homeExcludeIndices) {
                this.globalSetting.homeExcludeIndices = new Array<string>();
                return;
            }
            this.globalSetting.homeExcludeIndices.splice(this.globalSetting.homeExcludeIndices.indexOf(index), 1);
            this.sync();
        },
        addHomeIncludeIndex(index: string): void {
            if (!this.globalSetting.homeIncludeIndices) {
                this.globalSetting.homeIncludeIndices = new Array<string>();
            }
            this.globalSetting.homeIncludeIndices.push(index);
            this.sync();
        },
        removeHomeIncludeIndex(index: string): void {
            if (!this.globalSetting.homeIncludeIndices) {
                this.globalSetting.homeIncludeIndices = new Array<string>();
                return;
            }
            this.globalSetting.homeIncludeIndices.splice(this.globalSetting.homeIncludeIndices.indexOf(index), 1);
            this.sync();
        },
        setGlobalSetting(setting: GlobalSetting) {
            this.globalSetting = setting;
            this.sync();
        },
        sync() {
            if (lock) {
                todo = true
                return;
            }
            lock = true
            saveOneByAsync(LocalNameEnum.SETTING_GLOBAL, this.globalSetting, this.rev).then(rev => this.rev = rev)
                .finally(() => {
                    lock = false;
                    if (todo) {
                        todo = false;
                        this.sync();
                    }
                });
        }
    }
});

export default useGlobalSettingStore;
