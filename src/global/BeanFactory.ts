import {useEventBus} from "@vueuse/core";


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
import useUrlStore from "@/store/UrlStore";
import useBaseSearchHistoryStore from "@/store/history/BaseSearchHistoryStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import ConditionExportEvent from "@/entity/event/ConditionExportEvent";

window.rain = {
    env: window.utools ? 'utools' : 'web'
}

window.utools = window.utools || utools;
window.preload = window.preload || preload;

export const baseSearchRecordService = new BaseSearchRecordService();
export const seniorSearchRecordService = new SeniorSearchRecordService();

// 版本策略
export const versionStrategyContext = new VersionStrategyContext();
versionStrategyContext.register(new V6VersionStrategyImpl());
versionStrategyContext.register(new V7VersionStrategyImpl());
versionStrategyContext.register(new V8VersionStrategyImpl());

// 事件
export const useExportEvent = useEventBus<ConditionExportEvent>(EventBusEnum.CONDITION_EXPORT);
export const useUrlEditEvent = useEventBus<Url>(EventBusEnum.URL_EDIT);
export const useIndexManageEvent = useEventBus<string>(EventBusEnum.INDEX_MANAGE);
export const useSeniorShowResultEvent = useEventBus<void>(EventBusEnum.SENIOR_SHOW_RESULT);

// 代码高亮
highlight.registerLanguage('json', highlightJson);
export {highlight};

export const statistics = new Statistics();
statistics.init();
statistics.open()

export async function initData(): Promise<void> {
    await Promise.all([
        useUrlStore().init(),
        useBaseSearchHistoryStore().init(),
        useEditorSettingStore().init(),
        // 设置
        useGlobalSettingStore().init(),
        useEditorSettingStore().init(),
        useBaseSearchSettingStore().init()
    ]);
    return Promise.resolve();
}
