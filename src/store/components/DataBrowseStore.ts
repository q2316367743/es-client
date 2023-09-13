import {defineStore} from "pinia";
import IndexView from "@/view/index/IndexView";
import {jsonToTable, TableViewColumnData} from "@/algorithm/jsonToTable";
import useSettingStore from "@/store/setting/GlobalSettingStore";
import DocumentApi from "@/components/es/api/DocumentApi";
import MessageUtil from "@/utils/MessageUtil";
import ConditionBuild from "@/page/data-browse/build/ConditionBuild";
import Optional from "@/utils/Optional";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useBaseSearchEvent, useIndexManageEvent, usePageJumpEvent, useSeniorSearchEvent} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import BaseOrder from "@/entity/BaseOrder";

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
        page: 1,
        size: useSettingStore().getPageSize,
        total: 1,
        // 查询条件
        must: '',
        should: '',
        mustNot: '',
        orderBy: '',
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


        checkItems: new Array<string>(),
        selectedKeys: new Array<string>()
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
                DocumentApi(this.name)._search(
                    ConditionBuild(this.must, this.should, this.mustNot, this.orderBy, this.page, this.size)
                )
                    .then(result => {
                        this.result = result;
                        let {columns, records, total} = jsonToTable(result, this.index);
                        this.columns = columns;
                        if (renderHeader) {
                            this.showColumns = columns;
                            this.allowUpdate = true;
                            this.checkItems = columns.map(e => e.dataIndex || '');
                            this.selectedKeys = [];
                        }
                        this.records = records;
                        this.total = total;
                        this.selectedKeys = new Array<string>();
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
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.must = '';
            this.should = '';
            this.mustNot = '';
            return this.executeQuery();
        },
        /**
         * 清空全部信息
         */
        clean() {
            // 重置条件
            if (!this.index) {
                return;
            }
            this.name = '';
            this.type = '';
            this.index = undefined;
            this.must = '';
            this.should = '';
            this.mustNot = '';
            this.orderBy = '';
            this.page = 1;
            this.size = useSettingStore().getPageSize;
            this.total = 1;
            // 展示数据
            this.columns = [] as Array<TableViewColumnData>;
            this.result = {} as any;
            this.records = new Array<any>();
            this.loading = false;
        },

        // ----------------------------------------- 数据更新 -----------------------------------------

        updatePage(page: number) {
            this.page = page;
        },
        updateSize(size: number) {
            this.size = size;
        },
        updateMust(must: string) {
            this.must = must;
        },
        updateMustNot(mustNot: string) {
            this.mustNot = mustNot;
        },
        updateShould(should: string) {
            this.should = should;
        },
        updateOrderBy(orderBy: string) {
            this.orderBy = orderBy;
        },

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
                        // 延迟100ms，
                        setTimeout(() => {
                            this.executeQuery(false).then(() => console.log("查询成功"));
                        }, 1000);
                        resolve()
                    })
                    .catch(e => {
                        MessageUtil.error('新增失败', e);
                        reject();
                    });
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
                .orElse(this.selectedKeys);
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
                            MessageUtil.success('删除成功', resolve)
                            setTimeout(() => {
                                this.executeQuery(false).then(() => console.log("查询成功"));
                            }, 1000);
                            // 删除后，重置选择
                            this.selectedKeys = new Array<string>();
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
                    // 延迟100ms，
                    setTimeout(() => {
                        this.executeQuery(false).then(() => console.log("查询成功"));
                    }, 1000);
                    // 更新后，重置选择
                    this.selectedKeys = new Array<string>();
                    resolve();
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
        conditionBuild() {
            return ConditionBuild(
                this.must, this.should, this.mustNot, this.orderBy,
                this.page, this.size);
        },

        // ----------------------------------------- 跳转查询 -----------------------------------------


        /**
         * 跳转到基础查询
         */
        jumpToBaseSearch() {
            if (this.type === '') {
                return;
            }
            // 页面跳转
            usePageJumpEvent.emit(PageNameEnum.BASE_SEARCH);
            // 基础数据
            let orders = new Array<BaseOrder>();
            // 填充数据
            let count = 1;
            let condition = this.conditionBuild();
            // 排序
            for (let key in condition.sort) {
                orders.push({
                    id: count++,
                    field: `${key}`,
                    type: condition.sort[key].order,
                    isEnable: true
                });
            }
            useBaseSearchEvent.emit({
                execute: true,
                name: this.name,
                index: this.name,
                conditions: [],
                orders
            });
        },
        /**
         * 跳转到高级查询
         */
        jumpToSeniorSearch() {
            if (this.type === '') {
                return;
            }
            // 跳转页面
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            // 填充数据
            useSeniorSearchEvent.emit({
                name: this.name,
                link: `/${this.name}/_search`,
                method: 'POST',
                params: JSON.stringify(this.conditionBuild(), null, 4)
            })
        },
        /**
         * 以插入的方式跳转到高级查询
         * @param data
         */
        jumpToSeniorSearchByInsert(data: any): Promise<void> {
            if (!this.index) {
                return Promise.reject();
            }
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                link: `/${this.index.name}/_doc`,
                method: 'POST',
                params: data
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
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            useSeniorSearchEvent.emit({
                link: `/${this.index.name}/_doc/${id}`,
                method: 'PUT',
                params: data
            });
            return Promise.resolve();
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
