
import {BaseSearchRecordService} from "@/service/BaseSearchRecordService";

import EventBusEnum from "@/enumeration/EventBusEnum";

import highlight from "highlight.js/lib/core";
import highlightJson from "highlight.js/lib/languages/json";

// 策略
import VersionStrategyContext from "@/strategy/VersionStrategy/VersionStrategyContext";
import V6VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V6VersionStrategyImpl";
import V7VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V7VersionStrategyImpl";
import V8VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V8VersionStrategyImpl";
import {SeniorSearchRecordService} from "@/service/SeniorSearchRecordService";
// 插件
import {Statistics} from "@/plugins/Statistics";
import {instance, preload} from "@/plugins/distribute";

// 重新注入
// @ts-ignore
window.utools = instance
// @ts-ignore
window.preload = preload;

export const baseSearchRecordService = new BaseSearchRecordService();
export const seniorSearchRecordService = new SeniorSearchRecordService();

// 版本策略
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 事件
export const useIndexManageEvent = useEventBus<string>(EventBusEnum.INDEX_MANAGE);
export const useSeniorShowResultEvent = useEventBus<void>(EventBusEnum.SENIOR_SHOW_RESULT);

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};

export const statistics = new Statistics();
