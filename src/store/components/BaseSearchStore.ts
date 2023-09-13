import {defineStore} from "pinia";
import {BaseSearchItemBody} from "@/page/base-search/domain/BaseSearchItem";
import BaseQuery from "@/entity/BaseQuery";
import BaseOrder from "@/entity/BaseOrder";
import Field from "@/view/Field";
import DocumentApi from "@/components/es/api/DocumentApi";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {useIndexManageEvent} from "@/global/BeanFactory";
import useIndexStore from "@/store/IndexStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";

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

export const useBaseSearchStore = defineStore('base-search', {
    state: () => ({
        current: getDefaultBaseSearch(),

        // 字典
        fields: [{
            name: '_id',
            dataIndex: '_id',
            type: 'string'
        }] as Array<Field>,

        loading: false,
        visibility: true,

        // 条件对话框
        condition: {
            dialog: false,
            data: {}
        },
        historyDialog: false,
        settingDialog: false,

        // 视图
        showTop: true,

    }),
    actions: {
        setCurrentIndex(index: string) {
            this.current.index = index;
            if (index.length > 0) {
                this.fields = useIndexStore().field(index).sort((a, b) => {
                    return a.name.localeCompare(b.name, "zh-CN");
                });
                this.current.page = 1;
                this.current.size = useGlobalSettingStore().pageSize;
                return;
            }
            if (index === '') {
                this.clear();
            }
            this.fields = [{
                name: '_id',
                dataIndex: '_id',
                type: 'string'
            }]
        },
        setCurrentCondition(conditions: Array<BaseQuery>) {
            this.current.conditions = conditions;
        },
        setCurrentOrders(orders: Array<BaseOrder>) {
            this.current.orders = orders;
        },
        setCurrentPage(page: number) {
            this.current.page = page;
            this.search()
        },
        search() {
            if (this.current.index.length === 0) {
                MessageUtil.error("请选择索引")
                return;
            }
            this.loading = true;
            try {
                DocumentApi(this.current.index)._search(
                    QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders)
                ).then((response) => {
                    // 结果
                    this.current.result = response as Record<string, any>;
                    // 解析总数
                    if (response.hits) {
                        if (parseInt(response.hits.total)) {
                            this.current.total = parseInt(response.hits.total)
                        } else if (parseInt(response.hits.total.value)) {
                            this.current.total = parseInt(response.hits.total.value);
                        } else {
                            this.current.total = 0;
                        }
                    } else {
                        this.current.total = 0;
                    }
                }).catch((e) => {
                    this.current.result = e.response.data;
                }).finally(() => {
                    this.loading = false;
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
                this.loading = false;
            }
        },
        openIndexManage() {
            if (this.current.index === '') {
                MessageUtil.error('请先选择索引');
                return;
            }
            let index = useIndexStore().indexAliasMap.get(this.current.index);
            if (index) {
                useIndexManageEvent.emit(index);
            } else {
                MessageUtil.warning(`索引【${this.current.index}】未找到`)
            }
        },
        clear(clearIndex: boolean = false) {
            this.current.page = 1;
            this.current.size = useGlobalSettingStore().pageSize;
            this.current.total = 0;
            this.current.conditions = new Array<BaseQuery>();
            this.current.orders = new Array<BaseOrder>();
            this.current.result = {};
            this.condition = {
                dialog: false,
                data: {}
            }
            if (clearIndex) {
                this.current.index = '';
            }
        },
    }
})
