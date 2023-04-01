import {
    applicationLaunch,
    useBaseSearchEvent,
    useIndexManageEvent,
    usePageJumpEvent,
    useSeniorSearchEvent
} from "@/global/BeanFactory";
import useSettingStore from "@/store/SettingStore";
import IndexView from "@/view/index/IndexView";
import DocumentApi from "@/api/DocumentApi";
import conditionBuild from "@/page/DataBrowse/build/ConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import { ref, Ref } from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import PageNameEnum from "@/enumeration/PageNameEnum";
import BaseOrder from "@/entity/BaseOrder";
import { jsonToTable, TableViewColumnData } from "@/algorithm/jsonToTable";
import Optional from "@/utils/Optional";

export default class DataBrowseComponent {

    id: string = 'data-browser-' + new Date().getTime();

    // 状态
    loading: Ref<boolean> = ref<boolean>(false);
    // 分页条件
    page: Ref<number> = ref<number>(1);
    size: Ref<number> = ref<number>(20);
    total: Ref<number> = ref<number>(1);

    // 查询条件
    must: Ref<string> = ref<string>('');
    should: Ref<string> = ref<string>('');
    mustNot: Ref<string> = ref<string>('');
    orderBy: Ref<string> = ref<string>('');

    // 当前的索引，别名是此处未空
    index: Ref<IndexView | undefined> = ref<IndexView | undefined>(undefined);
    // 当前查询的索引的名字，可能是索引，也可能是别名；
    name: string = '';
    // 当前查询的类型
    type: Ref<string> = ref<string>('');
    // 展示数据
    columns: Ref<Array<TableViewColumnData>> = ref([]);
    // 展示数据
    showColumns: Ref<Array<TableViewColumnData>> = ref([]);
    result: Ref = ref({});
    records: Ref<Array<any>> = ref([]);
    checkItems: Ref<Array<string>> = ref<Array<string>>(new Array<string>());
    allowUpdate: Ref<boolean> = ref<boolean>(true);

    selectedKeys: Ref<Array<string>> = ref<Array<string>>([]);

    constructor() {
        applicationLaunch.register(() => {
            this.size.value = useSettingStore().getPageSize;
            return Promise.resolve();
        })
    }

    executeQuery(renderHeader: boolean = true): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.name) {
                reject();
                return;
            }
            this.loading.value = true;
            DocumentApi(this.name)._search(
                conditionBuild(this.must.value, this.should.value, this.mustNot.value, this.orderBy.value, this.page.value, this.size.value)
            )
                .then(result => {
                    this.result.value = result;
                    let { columns, records, total } = jsonToTable(result, this.index.value);
                    this.columns.value = columns;
                    if (renderHeader) {
                        this.showColumns.value = columns;
                        this.allowUpdate.value = true;
                        this.checkItems.value = columns.map(e => e.dataIndex || '');
                    }
                    this.records.value = records;
                    this.total.value = total;
                    this.selectedKeys.value = new Array<string>();
                    resolve();
                })
                .catch(e => {
                    MessageUtil.error('查询失败', e);
                    reject();
                })
                .finally(() => this.loading.value = false);
        })
    }

    indexChange(data: {
        name: string,
        type: string,
        index: IndexView | undefined
    }): Promise<void> {
        this.name = data.name;
        this.type.value = data.type;
        this.index.value = data.index;
        this.page.value = 1;
        this.size.value = useSettingStore().getPageSize;
        this.must.value = '';
        this.should.value = '';
        this.mustNot.value = '';
        return this.executeQuery();
    }

    clean() {
        // 重置条件
        if (!this.index) {
            return;
        }
        this.name = '';
        this.type.value = '';
        this.index.value = undefined;
        this.must.value = '';
        this.should.value = '';
        this.mustNot.value = '';
        this.orderBy.value = '';
        this.page.value = 1;
        this.size.value = useSettingStore().getPageSize;
        this.total.value = 1;
        // 展示数据
        this.columns.value = [] as Array<TableViewColumnData>;
        this.result.value = {} as any;
        this.records.value = new Array<any>();
        this.loading.value = false;
    }

    // ----------------------------------------- CRUD方法 -----------------------------------------

    /**
     * 新增一个记录
     * @param data 记录内容
     */
    add(data: string): Promise<void> {
        if (this.type.value === '') {
            MessageUtil.warning("类型未知，无法新增");
            return Promise.reject();
        }else if (this.type.value === 'alias') {
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
            if (!this.index.value) {
                MessageUtil.error("请先选择索引");
                reject();
                return;
            }
            DocumentApi(this.index.value.name)._insert(record)
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
    }

    /**
     * 删除记录
     * @param deleteRow 记录ID
     */
    reduce(deleteRow?: Array<string>): Promise<void> {
        if (this.type.value === '') {
            MessageUtil.warning("类型未知，无法删除");
            return Promise.reject();
        }else if (this.type.value === 'alias') {
            MessageUtil.warning("当前选择项为别名，无法删除");
            return Promise.reject();
        }
        if (this.index.value === undefined) {
            MessageUtil.error("请先选择索引");
            return Promise.reject();
        }
        let deleteRowIndies = Optional.ofNullable(deleteRow)
            .orElse(this.selectedKeys.value);
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
                DocumentApi(this.index.value!.name)._delete_by_query({
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
                        this.selectedKeys.value = new Array<string>();
                    })
                    .catch(e => MessageUtil.error('删除失败', e));
            }).catch((action) => {
                if (action === 'cancel') {
                    // 跳转到高级查询
                    reject();
                }
            });
        })

    }

    /**
     * 更新一个数据
     * @param id 数据ID
     * @param data 新的数据
     */
    update(id: string, data: string): Promise<void> {
        if (this.type.value === '') {
            MessageUtil.warning("类型未知，无法更新");
            return Promise.reject();
        }else if (this.type.value === 'alias') {
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
            if (!this.index.value) {
                MessageUtil.error('请选择索引');
                reject();
                return;
            }
            DocumentApi(this.index.value.name)._update(id, record).then(() => {
                // 延迟100ms，
                setTimeout(() => {
                    this.executeQuery(false).then(() => console.log("查询成功"));
                }, 1000);
                // 更新后，重置选择
                this.selectedKeys.value = new Array<string>();
                resolve();
            }).catch(e => reject(e));
        })
    }

    // ----------------------------------------- 数据方法 -----------------------------------------

    sortChange(column: any) {
        // 解析orderBy语句
        if (this.orderBy.value === '') {
            if (column.order) {
                this.orderBy.value = `${column.field} ${column.order}`
            } else {
                this.orderBy.value = ''
            }
        } else {
            if (this.orderBy.value.includes(column.field)) {
                // 存在排序字段
                // 如果需要排序
                let startIndex = this.orderBy.value.indexOf(column.field);
                let tempOrderBy = this.orderBy.value.substring(startIndex);
                let nextOrderByIndex = tempOrderBy.indexOf(',') > -1 ? tempOrderBy.indexOf(',') : tempOrderBy.length;
                let endIndex = startIndex + nextOrderByIndex;
                if (column.order) {
                    this.orderBy.value = this.orderBy.value.substring(0, startIndex) +
                        `${column.field} ${column.order}` +
                        this.orderBy.value.substring(endIndex, this.orderBy.value.length)
                } else {
                    this.orderBy.value = this.orderBy.value.substring(0, endIndex === this.orderBy.value.length ? startIndex - 1 : startIndex) +
                        this.orderBy.value.substring(endIndex, this.orderBy.value.length)
                }
            } else {
                // 不存在，直接拼后面
                this.orderBy.value = this.orderBy + `,${column.field} ${column.order}`
            }
        }
    }

    // ----------------------------------------- 业务方法 -----------------------------------------

    openMappingDrawer() {
        if (this.type.value === '') {
            MessageUtil.warning("类型未知，无法打开索引结构");
            return Promise.reject();
        }else if (this.type.value === 'alias') {
            MessageUtil.warning("当前选择项为别名，无法打开索引结构");
            return Promise.reject();
        }
        if (!this.index.value) {
            return;
        }
        useIndexManageEvent.emit(this.index.value.name);
    }

    private conditionBuild() {
        return conditionBuild(
            this.must.value, this.should.value, this.mustNot.value, this.orderBy.value,
            this.page.value, this.size.value);
    }

    jumpToBaseSearch() {
        if (this.type.value === '') {
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
    }

    jumpToSeniorSearch() {
        if (this.type.value === '') {
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
    }

    jumpToSeniorSearchByInsert(data: any): Promise<void> {
        if (!this.index.value) {
            return Promise.reject();
        }
        usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
        useSeniorSearchEvent.emit({
            link: `/${this.index.value.name}/_doc`,
            method: 'POST',
            params: data
        });
        return Promise.resolve();
    }

    jumpToSeniorSearchByUpdate(id: string, data: any): Promise<void> {
        if (!this.index.value) {
            return Promise.reject();
        }
        usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
        useSeniorSearchEvent.emit({
            link: `/${this.index.value.name}/_doc/${id}`,
            method: 'PUT',
            params: data
        });
        return Promise.resolve();
    }

    // ----------------------------------------- 筛选 -----------------------------------------

    handleChange(values: any[]) {
        this.showColumns.value = this.columns.value.filter(column => values.includes(column.dataIndex));
        this.allowUpdate.value = this.showColumns.value.length === this.columns.value.length;
    }

    resetColumn() {
        this.showColumns.value = this.columns.value;
        this.checkItems.value = this.showColumns.value.map(column => column.dataIndex!);
        this.allowUpdate.value = true;
    }

}