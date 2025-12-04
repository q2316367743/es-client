import {defineStore} from "pinia";
import * as monaco from "monaco-editor";
// 工具类
import MessageUtil from "@/utils/MessageUtil";
import NotificationUtil from "@/utils/NotificationUtil";
import {useEsRequest} from "@/plugins/native/axios";
//算法
import SeniorSearchJumpEvent from "@/entity/event/SeniorSearchJumpEvent";
import router from "@/plugins/router";
import PageNameEnum from "@/enumeration/PageNameEnum";
import {seniorSearchRecordService, useSeniorShowResultEvent} from "@/global/BeanFactory";
import useUrlStore from "@/store/UrlStore";
import useLoadingStore from "@/store/LoadingStore";
import {useSeniorSearchHistoryStore} from "@/store/history/SeniorSearchHistoryStore";
import {getFromOne, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {formatJsonString, formatRestQuery, ParsedRequest, parseRestRequests} from "@/algorithm/file";
import {parseJsonWithBigIntSupport} from "@/algorithm/format";

function requestBuild(instance: monaco.editor.IStandaloneCodeEditor, index: number): ParsedRequest | undefined {
  let value = instance.getValue();
  let position = instance.getPosition();
  if (!position) {
    return;
  }
  let list = parseRestRequests(value);
  if (list.length === 0) {
    return;
  }
  return list[index];
}

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
    // 是否出错了
    error: false,

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
      if (request.url === '') {
        MessageUtil.success('链接未识别到');
        return;
      }
      this.loading = true;
      if (request.method === 'POST' && request.url.indexOf('_doc') > -1 && request.body == '') {
        // 如果是新增文档，但是没有参数，不进行查询
        this.result = "{}";
        this.show = "{}"
        NotificationUtil.warning('新增文档，但没有参数', '警告');
        return;
      }
      // 新增历史记录
      seniorSearchRecordService.save({
        urlId: useUrlStore().id,
        body: request.body || '',
        method: request.method,
        link: request.url,
      }).then(() => console.log("新增高级查询历史记录"))
        .catch(e => MessageUtil.error("新增高级查询历史记录失败", e));

      useEsRequest({
        url: request.url,
        method: request.method,
        data: request.body,
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
          this.json = parseJsonWithBigIntSupport(this.result);
        } catch (e) {
          this.json = {};
        }
        this.error = false;

        // 执行过滤
        this.execFilter();

      }).catch((e) => {
        MessageUtil.error("执行失败", e);
        this.result = e?.response?.data || '';
        this.error = true;
        this.show = this.result;
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
          this.show = formatJsonString(resultJson);
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
        this.body = formatRestQuery(this.body);
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
