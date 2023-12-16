import {defineStore} from "pinia";
// 存储
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
// 工具类
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
// 组件
import DocumentApi from "@/components/es/api/DocumentApi";
import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";
// 其他
import {useIndexManageEvent} from "@/global/BeanFactory";
import BaseOrder from "@/entity/BaseOrder";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import IndexView from "@/view/index/IndexView";
import {jsonToTable, TableViewColumnData} from "@/algorithm/jsonToTable";
import {buildSearchQuery} from "@/page/data-browse/domain/DocumentCondition";

export interface IndexInfo {
    name: string,
    type: string,
    index: IndexView | undefined
}

export const useDataBrowseStore = defineStore('data-browser', {
    state: () => ({
        // 状态
        loading: false,
        // 分页条件
        total: 1,
        // 当前的索引，别名是此处未空
        index: undefined as IndexView | undefined,
        // 当前查询的索引的名字，可能是索引，也可能是别名；
        name: '',
        // 当前查询的类型
        type: '',
        // 展示数据
        columns: new Array<TableViewColumnData>(),
        // 展示数据
        showColumns: new Array<TableViewColumnData>(),
        result: {},
        records: new Array<any>(),
        allowUpdate: true,

        // 实际的查询条件


        checkItems: new Array<string>(),
        selectedKeys: new Array<any>()
    }),
    actions: {
        /**
         * 执行查询
         * @param renderHeader 是否渲染表头，默认渲染
         */
        executeQuery(renderHeader: boolean = true): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                if (!this.name) {
                    reject();
                    return;
                }
                this.loading = true;
                DocumentApi(this.name)._search(buildSearchQuery())
                    .then(result => {
                        this.result = result;
                        let {columns, records, total} = jsonToTable(result);
                        this.columns = columns;
                        if (renderHeader) {
                            this.showColumns = columns;
                            this.allowUpdate = true;
                            this.checkItems = columns.map(e => e.dataIndex || '');
                            this.selectedKeys = [];
                        }
                        this.records = records;
                        this.total = total;
                        this.selectedKeys = new Array<any>();
                        resolve();
                    })
                    .catch(e => {
                        MessageUtil.error('查询失败', e);
                        reject();
                    })
                    .finally(() => this.loading = false);
            })
        },
        /**
         * 索引变更
         * @param data 索引信息
         */
        indexChange(data: IndexInfo): Promise<void> {
            this.name = data.name;
            this.type = data.type;
            this.index = data.index;
            return this.executeQuery();
        },

        // ----------------------------------------- 数据更新 -----------------------------------------


        updateSelectKeys(items: any[]) {
            this.selectedKeys = items;
        },

        // ----------------------------------------- CRUD方法 -----------------------------------------

        /**
         * 新增一个记录
         * @param data 记录内容
         */
        add(data: string): Promise<void> {
            if (this.type === '') {
                MessageUtil.warning("类型未知，无法新增");
                return Promise.reject();
            } else if (this.type === 'alias') {
                MessageUtil.warning("当前选择项为别名，无法新增");
                return Promise.reject();
            }
            let record = {};
            try {
                record = JSON.parse(data);
            } catch (e) {
                MessageUtil.error("数据解析错误", e);
                return Promise.reject(e);
            }
            return new Promise<void>((resolve, reject) => {
                if (!this.index) {
                    MessageUtil.error("请先选择索引");
                    reject();
                    return;
                }
                DocumentApi(this.index.name)._insert(record)
                    .then(result => {
                        MessageUtil.success(`新增成功，新数据ID【${result._id || ''}】`)
                        // ES 是一个近实时系统，我们写入的数据默认的情况下会在 1 秒后才能被查询到
                        setTimeout(() => {
                            resolve();
                            this.executeQuery(false).then(() => console.log("查询成功"));
                        }, 1000);
                        resolve()
                    })
                    .catch(reject);
            })
        },
        /**
         * 删除记录
         * @param deleteRow 记录ID
         */
        reduce(deleteRow?: Array<string>): Promise<void> {
            if (this.type === '') {
                MessageUtil.warning("类型未知，无法删除");
                return Promise.reject();
            } else if (this.type === 'alias') {
                MessageUtil.warning("当前选择项为别名，无法删除");
                return Promise.reject();
            }
            if (this.index === undefined) {
                MessageUtil.error("请先选择索引");
                return Promise.reject();
            }
            let deleteRowIndies = Optional.ofNullable(deleteRow)
                .orElse(this.selectedKeys.map(e => e['_id']));
            if (deleteRowIndies.length === 0) {
                MessageUtil.error("请选择要删除的行");
                return Promise.reject();
            }
            return new Promise<void>((resolve, reject) => {
                MessageBoxUtil.confirm("确定要删除这些索引，删除后将无法恢复！", "警告", {
                    confirmButtonText: '删除',
                    cancelButtonText: '跳转到高级搜索'
                }).then(() => {
                    let ids = new Array<string>();
                    deleteRowIndies.forEach(id => ids.push(id));
                    DocumentApi(this.index!.name)._delete_by_query({
                        query: {
                            bool: {
                                must: [
                                    {
                                        ids: {
                                            values: ids
                                        }
                                    }
                                ]
                            }
                        }
                    })
                        .then(() => {
                            MessageUtil.success('删除成功');
                            // ES 是一个近实时系统，我们写入的数据默认的情况下会在 1 秒后才能被查询到
                            setTimeout(() => {
                                resolve();
                                this.executeQuery(false).then(() => console.log("查询成功"));
                            }, 1000);
                            // 删除后，重置选择
                            this.selectedKeys = new Array<any>();
                        })
                        .catch(e => MessageUtil.error('删除失败', e));
                }).catch((action) => {
                    if (action === 'cancel') {
                        // 跳转到高级查询
                        reject();
                    }
                });
            })

        },
        /**
         * 更新一个数据
         * @param id 数据ID
         * @param data 新的数据
         */
        update(id: string, data: string): Promise<void> {
            if (this.type === '') {
                MessageUtil.warning("类型未知，无法更新");
                return Promise.reject();
            } else if (this.type === 'alias') {
                MessageUtil.warning("当前选择项为别名，无法更新");
                return Promise.reject();
            }
            let record = {};
            try {
                record = JSON.parse(data);
            } catch (e) {
                MessageUtil.error("数据解析错误", e);
                return Promise.reject(e);
            }
            return new Promise<void>((resolve, reject) => {
                if (!this.index) {
                    MessageUtil.error('请选择索引');
                    reject();
                    return;
                }
                DocumentApi(this.index.name)._update(id, record).then(() => {
                    // ES 是一个近实时系统，我们写入的数据默认的情况下会在 1 秒后才能被查询到
                    setTimeout(() => {
                        resolve();
                        this.executeQuery(false).then(() => console.log("查询成功"));
                    }, 1000);
                    // 更新后，重置选择
                    this.selectedKeys = new Array<string>();
                }).catch(e => reject(e));
            })
        },


        // ----------------------------------------- 业务方法 -----------------------------------------

        /**
         * 打开映射对话框
         */
        openMappingDrawer() {
            if (this.type === '') {
                MessageUtil.warning("类型未知，无法打开索引结构");
                return Promise.reject();
            } else if (this.type === 'alias') {
                MessageUtil.warning("当前选择项为别名，无法打开索引结构");
                return Promise.reject();
            }
            if (!this.index) {
                return;
            }
            useIndexManageEvent.emit(this.index.name);
        },

        // ----------------------------------------- 跳转查询 -----------------------------------------

        /**
         * 跳转到基础查询
         */
        jumpToBaseSearch() {
            if (this.type === '') {
                return;
            }
            // 基础数据
            let orders = new Array<BaseOrder>();
            // 填充数据
            let count = 1;
            let condition = buildSearchQuery();
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
                index: this.name,
                conditions: [],
                orders
            })
        },
        /**
         * 跳转到高级查询
         */
        jumpToSeniorSearch(callback: () => void) {
            if (this.type === '') {
                return;
            }
            // 填充数据
            useSeniorSearchStore().loadEvent({
                link: `/${this.name}/_search`,
                method: 'POST',
                body: JSON.stringify(buildSearchQuery(), null, 4)
            }, false);
            callback();
        },
        /**
         * 以插入的方式跳转到高级查询
         * @param data
         */
        jumpToSeniorSearchByInsert(data: any): Promise<void> {
            if (!this.index) {
                return Promise.reject();
            }
            useSeniorSearchStore().loadEvent({
                link: `/${this.index.name}/_doc`,
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
            if (!this.index) {
                return Promise.reject();
            }
            useSeniorSearchStore().loadEvent({
                link: `/${this.index.name}/_doc/${id}`,
                method: 'PUT',
                body: data
            });
            return Promise.resolve();
        },

        loadEvent(index: IndexView) {
            this.indexChange({
                name: index.name,
                type: 'index',
                index: index
            })
                .then(() => router.push(PageNameEnum.DATA_BROWSE));
        },

        // ----------------------------------------- 筛选 -----------------------------------------
        /**
         * 显示的列变更
         * @param values 新的列
         */
        handleChange(values: any[]) {
            this.checkItems = values;
            this.showColumns = this.columns.filter(column => values.includes(column.dataIndex));
            this.allowUpdate = this.showColumns.length === this.columns.length;
        },
        /**
         * 重置列
         */
        resetColumn() {
            this.showColumns = this.columns;
            this.checkItems = this.showColumns.map(column => column.dataIndex!);
            this.allowUpdate = true;
        }

    }
})
