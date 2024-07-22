import {defineStore} from "pinia";
import * as monaco from "monaco-editor";
// 工具类
import MessageUtil from "@/utils/MessageUtil";
import NotificationUtil from "@/utils/NotificationUtil";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {fetchEs} from "@/plugins/native/axios";
import {jsonParse} from "@/algorithm/json";
//算法
import restFormat from "@/algorithm/restFormat";
import {jsonFormat} from "@/algorithm/json";
import {Grammatical, grammaticalAnalysis} from "@/algorithm/grammaticalAnalysis";
import SeniorSearchJumpEvent from "@/entity/event/SeniorSearchJumpEvent";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {seniorSearchRecordService, useSeniorShowResultEvent} from "@/global/BeanFactory";
import useUrlStore from "@/store/UrlStore";
import {ref, toRaw, watch} from "vue";
import useLoadingStore from "@/store/LoadingStore";
import {useSeniorSearchHistoryStore} from "@/store/history/SeniorSearchHistoryStore";
import {getFromOne, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

function requestBuild(instance: monaco.editor.IStandaloneCodeEditor, index: number): Grammatical | undefined {
    let value = instance.getValue();
    let position = instance.getPosition();
    if (!position) {
        return;
    }
    let list = grammaticalAnalysis(value);
    if (list.length === 0) {
        return;
    }
    return list[index];
}

// 高级搜索视图，默认编辑器视图
export const seniorSearchView = ref(ViewTypeEnum.EDITOR);
// 数据初始化
getFromOne<ViewTypeEnum>(LocalNameEnum.KEY_SENIOR_SEARCH_VIEW)
    .then(res => seniorSearchView.value = (res ? res.record : seniorSearchView.value));
// 数据存储
watch(() => seniorSearchView.value, value => saveOneByAsync(LocalNameEnum.KEY_SENIOR_SEARCH_VIEW, value));

let isInit = false;

export const useSeniorSearchStore = defineStore('senior-search', {
    state: () => ({
        // 历史相关
        id: 0,
        rev: undefined as string | undefined,

        body: '',

        // 实际的结果
        result: '',
        // 展示的结果
        show: '',
        json: {},

        filter: '',

        loading: false,
    }),
    actions: {
        init() {
            if (isInit) {
                return;
            }
            isInit = true;

            getFromOne<string>(LocalNameEnum.KEY_SENIOR_SEARCH_EDITOR)
                .then(data => {
                    if (data) {
                        this.body = data.record;
                    } else {
                        this.body = '';
                    }
                }).finally(() => {
                watch(() => this.body, value => {
                    saveOneByAsync(LocalNameEnum.KEY_SENIOR_SEARCH_EDITOR, value)
                        .then(() => console.debug("保存编辑器"));
                })
            });
        },
        updateBody(body: string) {
            this.body = body;
        },
        updateFilter(filter: string) {
            this.filter = filter;
        },
        execute(index: number, instance: monaco.editor.IStandaloneCodeEditor) {

            let request = requestBuild(instance, index);

            if (!request) {
                MessageUtil.error('请求块无法识别');
                return;
            }
            if (request.link === '') {
                MessageUtil.success('链接未识别到');
                return;
            }
            this.loading = true;
            if (request.method === 'POST' && request.link.indexOf('_doc') > -1 && request.params == '') {
                // 如果是新增文档，但是没有参数，不进行查询
                this.result = "{}";
                this.show = "{}"
                NotificationUtil.warning('新增文档，但没有参数', '警告');
                return;
            }
            // 新增历史记录
            seniorSearchRecordService.save({
                urlId: useUrlStore().id,
                body: request.params,
                method: request.method,
                link: request.link
            }).then(() => console.log("新增高级查询历史记录"))
                .catch(e => MessageUtil.error("新增高级查询历史记录失败", e));

            fetchEs<string>({
                url: request.link,
                method: request.method,
                data: request.params.trim() === '' ? undefined : request.params,
                responseType: 'text',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then((response) => {
                // 真正的结果
                this.result = response;
                // 显示的结果
                this.show = response;
                // 解析后的数据，用于执行过滤器
                try {
                    this.json = jsonParse(this.result);
                } catch (e) {
                    this.json = {};
                }

                // 执行过滤
                this.execFilter();

            }).catch((e) => {
                this.result = e.response.data;
                this.show = this.result;
                MessageUtil.error("执行失败", e);
            }).finally(() => {
                this.loading = false;
                useSeniorShowResultEvent.emit();
            })

        },
        execFilter() {
            if (this.filter.trim() === '') {
                this.show = this.result;
                return;
            }
            try {
                // 使用过滤
                let filterFunc = new Function('$', 'return $' + this.filter);
                let resultJson = filterFunc(toRaw(this.json));
                if (typeof resultJson === 'object') {
                    this.show = jsonFormat(resultJson);
                } else {
                    this.show = `${resultJson}`;
                }
            } catch (e) {
                MessageUtil.error("结果集不是JSON，无法过滤", e);
                this.show = this.result;
            }
        },
        clearFilter() {
            this.filter = '';
            this.show = this.result;
        },
        clearBody() {
            this.body = '';
            this.result = '';
            this.result = '';
            this.filter = ""
        },
        formatDocument() {
            try {
                this.body = restFormat(this.body);
            } catch (e: any) {
                MessageUtil.error('格式化失败', e);
            }
        },
        loadEvent(event: SeniorSearchJumpEvent, jump: boolean = true) {
            if (jump) {
                router.push(PageNameEnum.SENIOR_SEARCH).then(() => console.log('高级搜索跳转'));
            }
            this.body = this.body +
                (this.body.trim() === '' ? '' : '\n\n') +
                `${event.method} ${event.link}` + (!event.body ? '' : ('\n' + event.body));
        },
        saveHistory() {
            useLoadingStore().start("保存中");
            if (this.id > 0) {
                useSeniorSearchHistoryStore()
                    .update(this.id, this.body)
                    .then(() => MessageUtil.success("保存成功"))
                    .catch(e => MessageUtil.error("保存失败", e))
                    .finally(() => useLoadingStore().close());
            } else {
                useSeniorSearchHistoryStore()
                    .save(this.body)
                    .then(id => {
                        this.id = id;
                        MessageUtil.success("保存成功");
                    })
                    .catch(e => MessageUtil.error("保存失败", e))
                    .finally(() => useLoadingStore().close());
            }
        },
        loadHistory(id: number) {
            this.id = id;
            useLoadingStore().start("获取历史记录中");
            useSeniorSearchHistoryStore().getInfo(this.id)
                .then(body => this.body = body)
                .catch(e => MessageUtil.error("获取详情失败", e))
                .finally(() => useLoadingStore().close());
        },
        clearHistory() {
            this.id = 0;
        }
    }
})
