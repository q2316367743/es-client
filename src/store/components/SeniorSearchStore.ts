import {defineStore} from "pinia";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {jsonFormat} from "@/algorithm/jsonFormat";
import MessageUtil from "@/utils/MessageUtil";
import {fetchEs, jsonParse} from "@/plugins/axios";
import NotificationUtil from "@/utils/NotificationUtil";
import useSeniorSearchRecordStore from "@/store/seniorSearchRecordStore";
import * as monaco from "monaco-editor";
import {Grammatical, grammaticalAnalysis} from "@/algorithm/grammaticalAnalysis";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";

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
        isEnableFilter: useGlobalSettingStore().getSeniorFilter,
        filter: 'return $;',
        view: ViewTypeEnum.JSON,
        loading: false,
        displayActive: 'result'
    }),
    actions: {
        updateBody(body: string) {
            this.body = body;
        },
        updateIsEnableFilter(isEnableFilter: boolean) {
            this.isEnableFilter = isEnableFilter;
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
            let now = new Date();
            let success = true;
            if (request.method === 'POST' && request.link.indexOf('_doc') > -1 && request.params == '') {
                // 如果是新增文档，但是没有参数，不进行查询
                this.result = "{}";
                this.show = "{}"
                NotificationUtil.warning('新增文档，但没有参数', '警告');
                return;
            }
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
                success = false
            }).finally(() => {
                this.displayActive = 'result';
                useSeniorSearchRecordStore().push({
                    ...request!,
                    success,
                    time: new Date().getTime() - now.getTime(),
                    date: now
                });
                this.loading = false;
            })

        },
        execFilter() {
            if (this.isEnableFilter) {
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
            }
        },
        clearBody() {
            this.body = '';
            this.result = '';
            this.result = '';
            this.filter = "return $;"
        },
        save() {}
    }
})
