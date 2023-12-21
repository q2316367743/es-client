import {jsonToTable, TableViewColumnData} from "@/algorithm/jsonToTable";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";
import {defineStore} from "pinia";
import BaseOrder from "@/entity/BaseOrder";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

/**
 * 数据浏览展示对象
 */
export const useDbResultStore = defineStore('db-result-store', {
    state: () => ({
        columns: new Array<TableViewColumnData>(),
        showColumns: new Array<TableViewColumnData>(),
        records: new Array<any>(),
        result: {} as Partial<DocumentSearchResult>,
        total: 1
    }),
    actions: {
        render(result: DocumentSearchResult, renderHeader: boolean) {
            this.result = result;
            const {columns, records, total} = jsonToTable(result);
            this.columns = columns;
            if (renderHeader) {
                this.showColumns = columns;
            }
            this.records = records;
            this.total = total;
        },
        resetColumn() {
            this.showColumns = this.columns;
        },
        setColumn(values: any[]) {
            this.showColumns = this.columns.filter(column => values.includes(column.dataIndex));
        },

        /**
         * 跳转到基础查询
         */
        jumpToBaseSearch(callback: () => void) {
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
            useBaseSearchStore().loadEvent({
                execute: true,
                index: useDataBrowseStore().name,
                conditions: [],
                orders
            });
            callback();
        },
        /**
         * 跳转到高级查询
         */
        jumpToSeniorSearch(callback: () => void) {
            // 填充数据
            useSeniorSearchStore().loadEvent({
                link: `/${useDataBrowseStore().name}/_search`,
                method: 'POST',
                body: JSON.stringify(useDbConditionStore().buildSearchQuery(), null, 4)
            }, false);
            callback();
        },
        /**
         * 以插入的方式跳转到高级查询
         * @param data
         */
        jumpToSeniorSearchByInsert(data: any): Promise<void> {
            if (!useDataBrowseStore().index) {
                return Promise.reject();
            }
            useSeniorSearchStore().loadEvent({
                link: `/${useDataBrowseStore().name}/_doc`,
                method: 'POST',
                body: data
            });
            return Promise.resolve();
        },
        /**
         * 以更新的方式跳转到高级查询
         * @param id
         * @param data
         */
        jumpToSeniorSearchByUpdate(id: string, data: any): Promise<void> {
            if (!useDataBrowseStore().index) {
                return Promise.reject();
            }
            useSeniorSearchStore().loadEvent({
                link: `/${useDataBrowseStore().name}/_doc/${id}`,
                method: 'PUT',
                body: data
            });
            return Promise.resolve();
        },
    }
});
