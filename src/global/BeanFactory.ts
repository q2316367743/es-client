import x2js from 'x2js';
import {createGlobalState, useDark, useEventBus, useLocalStorage, useToggle} from "@vueuse/core";

import VersionManage from "@/plugins/VersionManage";
import DexieInstance from "@/plugins/dexie";

import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";
import BaseSearchJumpEvent from "@/event/BaseSearchJumpEvent";

import UrlService from "@/service/UrlService";
import {SeniorSearchHistoryService} from "@/service/SeniorSearchHistoryService";
import {BaseSearchHistoryService} from "@/service/BaseSearchHistoryService";

import PageNameEnum from "@/enumeration/PageNameEnum";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import TableNameEnum from "@/enumeration/TableNameEnum";
import EventBusEnum from "@/enumeration/EventBusEnum";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";
import ClientHttpStrategyImpl from "@/strategy/HttpStrategy/impl/ClientHttpStrategyImpl";
import ServerHttpStrategyImpl from "@/strategy/HttpStrategy/impl/ServerHttpStrategyImpl";
import SyncStrategyContext from "@/strategy/SyncStrategy/SyncStrategyContext";
import FileSyncStrategyImpl from "@/strategy/SyncStrategy/impl/FileSyncStrategyImpl";

import highlight from "highlight.js/lib/core";
import highlightJson from "highlight.js/lib/languages/json";

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance, dexieInstance.table(TableNameEnum.URL));
export const baseSearchHistoryService = new BaseSearchHistoryService(dexieInstance.table(TableNameEnum.BASE_SEARCH_HISTORY));
export const seniorSearchHistoryService = new SeniorSearchHistoryService(dexieInstance.table(TableNameEnum.SENIOR_SEARCH_HISTORY))

export const versionManage = new VersionManage();

// 策略模式

// HTTP策略
export const httpStrategyContext = new HttpStrategyContext();
httpStrategyContext.register(ServerModeEnum.CLIENT, new ClientHttpStrategyImpl());
httpStrategyContext.register(ServerModeEnum.SERVER, new ServerHttpStrategyImpl());
// 同步策略
export const syncStrategyContext = SyncStrategyContext.getInstance();
syncStrategyContext.register(SyncModeEnum.FILE, new FileSyncStrategyImpl());

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
});

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};