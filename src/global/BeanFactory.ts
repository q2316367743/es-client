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
import {preload} from "@/plugins/preload";
import {tauri, tauriPreload} from "@/plugins/tauri";
import {serverUtools, serverPreload} from "@/plugins/server";
// 存储
import useUrlStore from "@/store/UrlStore";
import useBaseSearchHistoryStore from "@/store/history/BaseSearchHistoryStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {useBaseSearchSettingStore} from "@/store/setting/BaseSearchSettingStore";
import {useBackupSettingStore} from "@/store/setting/BackupSettingStore";
import {useSeniorSearchHistoryStore} from "@/store/history/SeniorSearchHistoryStore";

window.utools = Object.assign(utools, window.utools, tauri, serverUtools);
window.preload = Object.assign(preload, window.preload, tauriPreload, serverPreload);

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

export async function initData(): Promise<void> {
    await Promise.all([
        useUrlStore().init(),
        // 历史记录
        useBaseSearchHistoryStore().init(),
        useSeniorSearchHistoryStore().init(),
        // 设置
        useGlobalSettingStore().init(),
        useEditorSettingStore().init(),
        useBaseSearchSettingStore().init(),
        useBackupSettingStore().init()
    ]);
    return Promise.resolve();
}
