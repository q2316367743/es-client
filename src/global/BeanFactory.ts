import DexieInstance from "@/plugins/dexie";
import UrlService from "@/service/UrlService";

import x2js from 'x2js';
import {createGlobalState, useDark, useEventBus, useLocalStorage, useToggle} from "@vueuse/core";
import VersionManage from "@/plugins/VersionManage";
import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";
import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";
import {SeniorSearchHistoryService} from "@/service/SeniorSearchHistoryService";
import TableNameEnum from "@/enumeration/TableNameEnum";
import EventBusEnum from "@/enumeration/EventBusEnum";
import {BaseSearchHistoryService} from "@/service/BaseSearchHistoryService";
import BaseSearchJumpEvent from "@/event/BaseSearchJumpEvent";
import PageNameEnum from "@/enumeration/PageNameEnum";

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance.table(TableNameEnum.URL));
export const baseSearchHistoryService = new BaseSearchHistoryService(dexieInstance.table(TableNameEnum.BASE_SEARCH_HISTORY));
export const seniorSearchHistoryService = new SeniorSearchHistoryService(dexieInstance.table(TableNameEnum.SENIOR_SEARCH_HISTORY))

export const versionManage = new VersionManage();

export const httpStrategyContext = new HttpStrategyContext();

export const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});

// 黑夜模式
export const isDark = useDark({
    initialValue: "light",
    selector: 'body',
    attribute: 'theme-mode',
    valueDark: 'dark',
    valueLight: 'light',
});
export const toggleDark = useToggle(isDark);

// 事件总线
// 基础查询
export const useBaseSearchEvent = useEventBus<BaseSearchJumpEvent>(EventBusEnum.BASE_SEARCH_EVENT)
// 高级查询
export const useSeniorSearchEvent = useEventBus<SeniorSearchJumpEvent>(EventBusEnum.SENIOR_SEARCH_EVENT);
// 页面跳转
export const usePageJumpEvent = useEventBus<PageNameEnum>(EventBusEnum.PAGE_JUMP_EVENT);

// 数据存储
export const layoutMode = useLocalStorage<string>('layoutMode', 'default');

// es版本
export const useEsVersion = createGlobalState(() => {
    let version = '';

    function setVersion(newValue: string) {
        version = newValue;
    }

    function getVersion() {
        return version;
    }

    return {version, setVersion, getVersion};
})