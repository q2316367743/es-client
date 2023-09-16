import {useEventBus} from "@vueuse/core";

import VersionManage from "@/plugins/VersionManage";

import {BaseSearchRecordService} from "@/service/BaseSearchRecordService";

import EventBusEnum from "@/enumeration/EventBusEnum";


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
import {SeniorSearchRecordService} from "@/service/SeniorSearchRecordService";

window.rain = {
    env: window.utools ? 'utools' : 'web'
}

window.utools = window.utools || utools;
window.preload = window.preload || preload;

export const baseSearchRecordService = new BaseSearchRecordService();
export const seniorSearchRecordService = new SeniorSearchRecordService();


export const versionManage = new VersionManage();


// 存储策略
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 应用启动器

// 页面跳转
// 链接选择
export const useUrlEditEvent = useEventBus<Url>(EventBusEnum.URL_EDIT);
export const useIndexManageEvent = useEventBus<string>(EventBusEnum.INDEX_MANAGE);

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};

export const statistics = new Statistics();
statistics.init();
statistics.open()
