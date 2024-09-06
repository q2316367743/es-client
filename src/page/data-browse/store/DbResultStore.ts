import {jsonToTable, TableViewColumnData} from "@/algorithm/jsonToTable";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";
import BaseOrder from "@/entity/BaseOrder";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {baseSearchLoadEvent} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {ref} from "vue";
import {arraysAreEqual} from "@/utils/ArrayUtil";

/**
 * 数据浏览展示对象
 */
// state
export const useDbResultColumns = ref(new Array<TableViewColumnData>());
export const useDbResultRecords = ref(new Array<any>());
export const useDbResultResult = ref({} as Partial<DocumentSearchResult>);
export const useDbResultTotal = ref(1);

// actions
export function useDbResultRender(searchResult: DocumentSearchResult, renderHeader: boolean) {
    useDbResultResult.value = searchResult;
    const tableData = jsonToTable(searchResult);
    useDbResultRecords.value = tableData.records;
    useDbResultTotal.value = tableData.total;
    if (renderHeader) {
        useDbResultColumns.value = tableData.columns;
        return;
    }
    // 此处需要判断是否需要渲染表头
    const oldDataIndex = useDbResultColumns.value.map(e => e.dataIndex);
    const newDataIndex = tableData.columns.map(e => e.dataIndex);

    if (arraysAreEqual(oldDataIndex, newDataIndex)) {
        // 表头没有变化，不需要重新渲染
        return;
    }
    useDbResultColumns.value = tableData.columns;
}

export function useDbResultResetColumn() {
    useDbResultColumns.value.forEach(e => {
        e.show = true;
    })
}


/**
 * 跳转到基础查询
 */
export function jumpToBaseSearch(callback: () => void) {
    if (useDataBrowseStore().type === '') {
        return;
    }
    // 基础数据
    let orders = new Array<BaseOrder>();
    // 填充数据
    let count = 1;
    let condition = useDbConditionStore().buildSearchQuery();
    // 排序
    for (let key in condition.sort) {
        orders.push({
            id: count++,
            field: `${key}`,
            type: condition.sort[key].order,
            isEnable: true
        });
    }
    baseSearchLoadEvent({
        execute: true,
        index: useDataBrowseStore().name,
        conditions: [],
        orders
    });
    callback();
}

/**
 * 跳转到高级查询
 */
export function jumpToSeniorSearch(callback: () => void) {
    // 填充数据
    useSeniorSearchStore().loadEvent({
        link: `/${useDataBrowseStore().name}/_search`,
        method: 'POST',
        body: JSON.stringify(useDbConditionStore().buildSearchQuery(), null, 4)
    }, false);
    callback();
}

/**
 * 以插入的方式跳转到高级查询
 * @param data
 */
export function jumpToSeniorSearchByInsert(data: any): Promise<void> {
    if (!useDataBrowseStore().index) {
        return Promise.reject();
    }
    useSeniorSearchStore().loadEvent({
        link: `/${useDataBrowseStore().name}/_doc`,
        method: 'POST',
        body: data
    });
    return Promise.resolve();
}

/**
 * 以更新的方式跳转到高级查询
 * @param id
 * @param data
 */
export function jumpToSeniorSearchByUpdate(id: string, data: any): Promise<void> {
    if (!useDataBrowseStore().index) {
        return Promise.reject();
    }
    useSeniorSearchStore().loadEvent({
        link: `/${useDataBrowseStore().name}/_doc/${id}`,
        method: 'PUT',
        body: data
    });
    return Promise.resolve();
}

