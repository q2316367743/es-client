import x2js from 'x2js';
import {createGlobalState, useDark, useEventBus, useToggle} from "@vueuse/core";

import VersionManage from "@/plugins/VersionManage";

import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";
import BaseSearchJumpEvent from "@/event/BaseSearchJumpEvent";

import UrlService from "@/service/UrlService";
import {SeniorSearchHistoryService} from "@/service/SeniorSearchHistoryService";
import {BaseSearchHistoryService} from "@/service/BaseSearchHistoryService";

import PageNameEnum from "@/enumeration/PageNameEnum";
import EventBusEnum from "@/enumeration/EventBusEnum";

import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";
import StorageStrategyContext from "@/strategy/StorageStrategy/StorageStrategyContext";
import LodisStrategyContext from "@/strategy/LodisStrategy/LodisStrategyContext";

import highlight from "highlight.js/lib/core";
import highlightJson from "highlight.js/lib/languages/json";


import ApplicationLaunch from "@/plugins/ApplicationLaunch";
import Url from "@/entity/Url";
import {ref} from "vue";
import LoadingManager from "@/plugins/LoadingManager";

export const urlService = new UrlService();
export const baseSearchHistoryService = new BaseSearchHistoryService();
export const seniorSearchHistoryService = new SeniorSearchHistoryService();

export const versionManage = new VersionManage();

// 策略模式

// HTTP策略
export const httpStrategyContext = new HttpStrategyContext();
// 存储策略
export const storageStrategyContext = new StorageStrategyContext();
export const lodisStrategyContext = new LodisStrategyContext();

// 加载管理器
export const loadingManager = new LoadingManager();
// 应用启动器
export const applicationLaunch = new ApplicationLaunch(
    lodisStrategyContext, storageStrategyContext, httpStrategyContext);

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
// 链接选择
export const useUrlSelectEvent = useEventBus<number>(EventBusEnum.URL_SELECT_EVENT);
export const useUrlEditEvent = useEventBus<Url>(EventBusEnum.URL_EDIT);
export const useIndexManageEvent = useEventBus<string>(EventBusEnum.INDEX_MANAGE);

// 全局状态

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
export const useFullScreen = createGlobalState(() => {
    let fullScreen = ref(false);

    function toggle() {
        fullScreen.value = !fullScreen.value;
    }

    function setFullScreen(value: boolean) {
        fullScreen.value = value;
    }

    return {fullScreen, toggle, setFullScreen}
})();

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};