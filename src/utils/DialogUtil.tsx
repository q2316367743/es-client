import {Button, Modal, ModalReturn} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";
import {highlight} from "@/global/BeanFactory";
import useLoadingStore from "@/store/LoadingStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {BrowserWindowType, createDataBrowserWindow} from "@/plugins/native/browser-window";
import Constant from "@/global/Constant";
import {formatJsonString} from "@/algorithm/file";
import {copyText} from "@/utils/BrowserUtil";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";
import {RenderFunction} from "vue";

/**
 * 对话框参数
 */
interface DialogOption {
  width: string,

}

/**
 * 显示json对话框，异步加载数据
 * @param title 对话框标题
 * @param data 数据
 * @param options 操作人
 */
export function showJsonDialogByAsync(title: string, data: Promise<any>, options?: DialogOption) {
  useLoadingStore().start("开始获取数据，请稍后");
  data.then(json => showJson(title, json, options))
    .catch(e => MessageUtil.error("数据获取失败", e))
    .finally(() => useLoadingStore().close());
}

export function jsonToHtml(json: string | any): { html: string, original: string } {
  // 原始值
  let value: string;
  // 格式化后的值
  let html: string;
  let needPretty = true;
  if (typeof json === 'string') {
    if (/^\s*(\{[\s\S]*}|\[[\s\S]*])\s*$/.test(json)) {
      try {
        value = formatJsonString(json)
      } catch (e) {
        MessageUtil.error("格式化JSON失败", e);
        value = json as string;
        needPretty = false;
      }
    } else {
      value = json as string;
      needPretty = false;
    }
  } else {
    value = stringifyJsonWithBigIntSupport(json);
  }
  // 原始值
  if (needPretty && value !== '') {
    let highlightResult = highlight.highlight(value, {
      language: 'json'
    });
    html = highlightResult.value;
  } else {
    html = value;
  }
  return {html, original: value};
}

export function showJson(title: string, json: string | any, options?: DialogOption) {
  // 原始值
  const {html, original} = jsonToHtml(json);
  const execCopy = () => {
    copyText(original);
    MessageUtil.success("复制成功");
  };
  // 创建对话框
  if (Constant.isSupportPin) {

    showDialog(title, () => <div class="hljs" style={{
      fontSize: useGlobalSettingStore().jsonFontSize + 'px',
      position: 'relative'
    }}>
      <pre class="language-json" v-html={html}></pre>
      <Button type="text" style={{
        position: "absolute",
        top: "6px",
        right: "20px"
      }} onClick={() => execCopy()}>复制</Button>
    </div>, options);
  } else {
    createDataBrowserWindow(BrowserWindowType.JSON, html, original, {
      title: title,
    });

  }

}

/**
 * 显示一个对话框
 * @param title 对话框标题
 * @param content 对话框内容
 * @param options 对话框选项
 */
export function showDialog(title: string, content: RenderFunction, options?: DialogOption): ModalReturn {
  // 创建对话框
  return Modal.open({
    title: title,
    content: content,
    draggable: true,
    width: options ? options.width : "80vw",
    footer: false,
    modalClass: "es-dialog"
  });
}
