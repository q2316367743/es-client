import {useEventBus} from "@vueuse/core";

import {BaseSearchRecordService} from "@/service/BaseSearchRecordService";

import EventBusEnum from "@/enumeration/EventBusEnum";

import highlight from "highlight.js/lib/core";
import highlightJson from "highlight.js/lib/languages/json";

import {Url} from "@/entity/Url";
// 策略
import VersionStrategyContext from "@/strategy/VersionStrategy/VersionStrategyContext";
import V6VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V6VersionStrategyImpl";
import V7VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V7VersionStrategyImpl";
import V8VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V8VersionStrategyImpl";
import {SeniorSearchRecordService} from "@/service/SeniorSearchRecordService";
// 插件
import Statistics from "@/plugins/Statistics";
import {utools} from "@/plugins/utools";
import {tauri, tauriPreload} from "@/plugins/tauri";
import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";


if (Constant.mode === PluginModeEnum.TAURI) {
    // 目前，只有tauri需要处理
    // @ts-ignore
    window.utools = Object.assign(utools, tauri);
    // @ts-ignore
    window.preload = tauriPreload;
}else if (Constant.mode === PluginModeEnum.ELECTRON) {
    // 大部分还是使用web提供的功能
    window.utools = Object.assign(utools, window.utools);
}


export const baseSearchRecordService = new BaseSearchRecordService();
export const seniorSearchRecordService = new SeniorSearchRecordService();

// 版本策略
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 事件
export const useUrlEditEvent = useEventBus<Url>(EventBusEnum.URL_EDIT);
export const useIndexManageEvent = useEventBus<string>(EventBusEnum.INDEX_MANAGE);
export const useSeniorShowResultEvent = useEventBus<void>(EventBusEnum.SENIOR_SHOW_RESULT);

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};

export const statistics = new Statistics();
statistics.init();
statistics.open()
