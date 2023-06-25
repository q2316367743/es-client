import x2js from 'x2js';
import { useEventBus, useToggle} from "@vueuse/core";

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
import WindowStrategyContext from "@/strategy/WindowStrategy/WindowStrategyContext";
import VersionStrategyContext from "@/strategy/VersionStrategy/VersionStrategyContext";
import V6VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V6VersionStrategyImpl";
import V7VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V7VersionStrategyImpl";
import V8VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V8VersionStrategyImpl";

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
export const windowStrategyContext = new WindowStrategyContext();
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 应用启动器
export const applicationLaunch = new ApplicationLaunch(
    lodisStrategyContext, storageStrategyContext, httpStrategyContext, windowStrategyContext);

export const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});


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

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};
