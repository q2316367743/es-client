import {useEventBus} from "@vueuse/core";

import VersionManage from "@/plugins/VersionManage";

import SeniorSearchJumpEvent from "@/event/SeniorSearchJumpEvent";

import {SeniorSearchHistoryService} from "@/service/SeniorSearchHistoryService";
import {BaseSearchRecordService} from "@/service/BaseSearchRecordService";

import PageNameEnum from "@/enumeration/PageNameEnum";
import EventBusEnum from "@/enumeration/EventBusEnum";

import StorageStrategyContext from "@/strategy/StorageStrategy/StorageStrategyContext";

import highlight from "highlight.js/lib/core";
import highlightJson from "highlight.js/lib/languages/json";


import Url from "@/entity/Url";
import VersionStrategyContext from "@/strategy/VersionStrategy/VersionStrategyContext";
import V6VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V6VersionStrategyImpl";
import V7VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V7VersionStrategyImpl";
import V8VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V8VersionStrategyImpl";
import Statistics from "@/plugins/Statistics";
import {utools} from "@/plugins/utools";
import {preload} from "@/plugins/preload";

window.rain = {
    env: window.utools ? 'utools' : 'web'
}

window.utools = window.utools || utools;
window.preload = window.preload || preload;

export const baseSearchRecordService = new BaseSearchRecordService();

export const seniorSearchHistoryService = new SeniorSearchHistoryService();

export const versionManage = new VersionManage();


// 存储策略
export const storageStrategyContext = new StorageStrategyContext();
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 应用启动器



// 事件总线
// 基础查询
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

export const statistics = new Statistics();
statistics.init();
statistics.open()
