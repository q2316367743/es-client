import DexieInstance from "@/plugins/dexie";
import ChartService from "@/service/ChartService";
import UrlService from "@/service/UrlService";
import TipService from '@/service/TipService'

import x2js from 'x2js';
import {createGlobalState, useDark, useEventBus, useLocalStorage, useToggle} from "@vueuse/core";
import VersionManage from "@/plugins/VersionManage";
import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";
import SeniorSearchParam from "@/domain/SeniorSearchParam";

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance.getUrl());
export const chartService = new ChartService(dexieInstance.getChart());
export const tipService = new TipService(dexieInstance.getTip());

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

// 高级查询 - 事件总线
export const useSeniorSearchEvent = useEventBus<SeniorSearchParam>("senior-search-event");
// 页面跳转 - 事件总线
export const usePageJumpEvent = useEventBus<string>('page-jump-event');

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