import {defineStore} from "pinia";
import * as monaco from "monaco-editor";
// 工具类
import MessageUtil from "@/utils/MessageUtil";
import NotificationUtil from "@/utils/NotificationUtil";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {fetchEs, jsonParse} from "@/plugins/axios";
//算法
import restFormat from "@/algorithm/restFormat";
import {jsonFormat} from "@/algorithm/jsonFormat";
import {Grammatical, grammaticalAnalysis} from "@/algorithm/grammaticalAnalysis";
import SeniorSearchJumpEvent from "@/entity/event/SeniorSearchJumpEvent";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {seniorSearchRecordService} from "@/global/BeanFactory";
import useUrlStore from "@/store/UrlStore";

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

export const useSeniorSearchStore = defineStore('senior-search', {
    state: () => ({
        body: '',

        // 实际的结果
        result: '',
        json: {},
        // 展示的结果
        show: '',

        filter: '',

        view: ViewTypeEnum.JSON,
        loading: false,
    }),
    actions: {
        updateBody(body: string) {
            this.body = body;
        },
        updateFilter(filter: string) {
            this.filter = filter;
        },
        updateView(view: ViewTypeEnum) {
            this.view = view;
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
            let success = true;
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
                .catch(e => MessageUtil.error("新增高级查询历史记录失败", e))
            fetchEs<string>({
                url: request.link,
                method: request.method,
                data: request.params,
                responseType: 'text',
                headers: {
                    'content-type': 'application/json'
                }
            }).then((response) => {
                this.result = response;
                this.show = response;
                try {
                    this.json = jsonParse(this.result);
                } catch (e) {
                    this.json = {};
                }
                this.execFilter();
            }).catch((e) => {
                this.result = e.data;
                this.show = this.result;
                success = false;
                MessageUtil.error("执行失败", e);
            }).finally(() => {
                this.loading = false;
            })

        },
        execFilter() {
            try {
                // 使用过滤
                let filterFunc = new Function('$', this.filter);
                let resultJson = filterFunc(this.json);
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
        clearBody() {
            this.body = '';
            this.result = '';
            this.result = '';
            this.filter = "return $;"
        },
        save() {
        },
        formatDocument() {
            try {
                this.body = restFormat(this.body);
            } catch (e: any) {
                MessageUtil.error('格式化失败', e);
            }
        },
        loadEvent(event: SeniorSearchJumpEvent) {
            router.push(PageNameEnum.SENIOR_SEARCH).then(() => console.log('基础搜索跳转'));
            this.body = this.body +
                '\n\n' +
                `${event.method} ${event.link}\n` +
                event.body
        }
    }
})
