import {BaseSearchItemBody} from "@/page/base-search/domain/BaseSearchItem";
import {BaseQuery} from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";
import Field from "@/view/Field";
import DocumentApi from "@/components/es/DocumentApi";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {baseSearchRecordService, useIndexManageEvent} from "@/global/BeanFactory";
import useIndexStore from "@/store/IndexStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {BaseSearchRecord} from "@/entity/record/BaseSearchRecord";
import useUrlStore from "@/store/UrlStore";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
import BaseSearchJumpEvent from "@/entity/event/BaseSearchJumpEvent";
import {DocumentSearchQuery} from "@/domain/es/DocumentSearchQuery";
import {ref, watch} from "vue";
import {Router} from "vue-router";

function getDefaultBaseSearch(): BaseSearchItemBody {
    return {
        index: '',
        conditions: new Array<BaseQuery>(),
        orders: new Array<BaseOrder>(),
        page: 1,
        size: 20,
        total: 0,
        result: {}
    };
}

export const fields = ref(new Array<Field>());
export const baseSearchLoading = ref(false);

export const current = ref(getDefaultBaseSearch());

export function clear() {
    current.value = getDefaultBaseSearch();
    fields.value = [];
}

watch(() => current.value.index, value => {
    if (value != null) {
        fields.value = useIndexStore().field(value).sort((a, b) => {
            return a.name.localeCompare(b.name, "zh-CN");
        });
        current.value.page = 1;
        current.value.size = useGlobalSettingStore().pageSize;
        return;
    } else {
        clear();
    }
});
watch(() => current.value.page, () => baseSearchExecute());
watch(() => current.value.size, () => baseSearchExecute());

export function getBaseSearchCondition(): DocumentSearchQuery {
    return QueryConditionBuild(current.value.conditions, current.value.page, current.value.size, current.value.orders);
}

export function baseSearchExecute() {
    if (current.value.index.length === 0) {
        MessageUtil.error("请选择索引")
        return;
    }
    baseSearchLoading.value = true;
    try {
        DocumentApi(current.value.index)._search(getBaseSearchCondition()).then((response) => {
            // 结果
            current.value.result = response as Record<string, any>;
            // 解析总数
            if (response.hits) {
                if (typeof response.hits.total === 'number') {
                    current.value.total = response.hits.total
                } else if (response.hits.total) {
                    current.value.total = response.hits.total.value;
                } else {
                    current.value.total = 0;
                }
            } else {
                current.value.total = 0;
            }
        }).catch((e) => {
            current.value.result = e.response.data;
        }).finally(() => {
            baseSearchLoading.value = false;
        });
        // 新增历史记录
        baseSearchRecordService.save({
            urlId: useUrlStore().id || 0,
            index: current.value.index,
            conditions: current.value.conditions,
            orders: current.value.orders
        }).then(() => console.log("新增历史记录成功"))
            .catch(e => MessageUtil.error("新增历史记录失败", e))
    } catch (e) {
        MessageUtil.error('条件构造错误', e);
        baseSearchLoading.value = false;
    }
}

export function openIndexManage() {
    if (current.value.index === '') {
        MessageUtil.error('请先选择索引');
        return;
    }
    let index = useIndexStore().indexAliasMap.get(current.value.index);
    if (index) {
        useIndexManageEvent.emit(index);
    } else {
        MessageUtil.warning(`索引【${current.value.index}】未找到`)
    }
}

/**
 * 加载历史保存记录
 * @param history 历史保存记录
 */
export function baseSearchLoadHistory(history: BaseSearchHistory) {
    current.value.conditions = history.conditions;
    current.value.orders = history.orders;
    current.value.index = history.index;
    baseSearchExecute();
}

/**
 * 加载历史记录
 * @param record 历史记录
 */
export function baseSearchLoadRecord(record: BaseSearchRecord) {
    current.value.conditions = record.conditions;
    current.value.orders = record.orders;
    current.value.index = record.index;
    baseSearchExecute();
}

export function baseSearchLoadEvent(event: BaseSearchJumpEvent, rt?: Router) {
    (rt || router).push(PageNameEnum.BASE_SEARCH).then(() => console.log('基础搜索跳转'));
    current.value.conditions = event.conditions;
    current.value.orders = event.orders;
    current.value.index = event.index;
    if (event.execute) {
        baseSearchExecute()
    }
}
