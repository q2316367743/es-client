import {defineStore} from "pinia";
// 工具类
import MessageUtil from "@/utils/MessageUtil";
import Optional from "@/utils/Optional";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
// 组件
import DocumentApi from "@/components/es/api/DocumentApi";
// 其他
import {useIndexManageEvent} from "@/global/BeanFactory";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import IndexView from "@/view/index/IndexView";
// 存储
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {useDbResultRender} from "@/page/data-browse/store/DbResultStore";

export interface IndexInfo {
    name: string,
    type: string,
    index: IndexView | undefined
}

export const useDataBrowseStore = defineStore('data-browser', {
    state: () => ({
        // 状态
        loading: false,
        // 当前的索引，别名是此处未空
        index: undefined as IndexView | undefined,
        // 当前查询的索引的名字，可能是索引，也可能是别名；
        name: '',
        // 当前查询的类型 'index' | 'alias' | ''
        type: '',
        allowUpdate: true,

        // 选中的记录，此处是记录的全部内容
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
                DocumentApi(this.name)._search(useDbConditionStore().buildSearchQuery())
                    .then(result => {
                        if (renderHeader) {
                            this.allowUpdate = true;
                            this.selectedKeys = [];
                        }
                        useDbResultRender(result, renderHeader);
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
        add(data: string): void {
            if (this.name.trim() === '') {
                MessageUtil.error("请选择索引");
                return;
            }
            let record = {};
            try {
                record = JSON.parse(data);
            } catch (e) {
                MessageUtil.error("数据解析错误", e);
                return;
            }
            if (!this.index) {
                MessageUtil.error("请先选择索引");
                return;
            }
            DocumentApi(this.index.name)._insert(record)
                .then(result => {
                    MessageUtil.success(`新增成功，新数据ID【${result._id || ''}】`)
                    // ES 是一个近实时系统，我们写入的数据默认的情况下会在 1 秒后才能被查询到
                    setTimeout(() => {
                        this.executeQuery(false).then(() => console.log("查询成功"));
                    }, 1000);
                })
                .catch(e => MessageUtil.error("新增失败", e));
        },
        /**
         * 删除记录
         * @param deleteRow 记录ID
         */
        reduce(deleteRow?: Array<string>): void {
            if (this.name.trim() === '') {
                MessageUtil.error("请选择索引");
                return;
            }
            let deleteRowIndies = Optional.ofNullable(deleteRow)
                .orElse(this.selectedKeys.map(e => e['_id']));
            if (deleteRowIndies.length === 0) {
                MessageUtil.error("请选择要删除的行");
                MessageUtil.error("类型未知，无法更新");
                return;
            }
            let ids = new Array<string>();
            deleteRowIndies.forEach(id => ids.push(id));
            MessageBoxUtil.confirm(`确定要删除这些索引：${ids.join('、')}`, "警告", {
                confirmButtonText: '删除',
                cancelButtonText: '跳转到高级搜索'
            }).then(() => {
                DocumentApi(this.name)._delete_by_query({
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
                            this.executeQuery(false).then(() => console.log("查询成功"));
                        }, 1000);
                        // 删除后，重置选择
                        this.selectedKeys = new Array<any>();
                    })
                    .catch(e => MessageUtil.error('删除失败', e));
            }).catch((action) => {
                if (action === 'cancel') {
                    // 跳转到高级查询
                }
            });

        },
        /**
         * 更新一个数据
         * @param id 数据ID
         * @param data 新的数据
         */
        update(id: string, data: string): Promise<void> {
            if (this.name.trim() === '') {
                return Promise.reject(new Error("请选择索引"))
            }
            let record = {};
            try {
                record = JSON.parse(data);
            } catch (e) {
                MessageUtil.error("数据解析错误", e);
                return Promise.reject(e);
            }
            return new Promise<void>((resolve, reject) => {
                DocumentApi(this.name)._update(id, record).then(() => {
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


        loadEvent(index: IndexView) {
            this.indexChange({
                name: index.name,
                type: 'index',
                index: index
            })
                .then(() => router.push(PageNameEnum.DATA_BROWSE));
        },

        // ----------------------------------------- 筛选 -----------------------------------------

    }
})
