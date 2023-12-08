import {Button, Modal, ModalReturn} from "@arco-design/web-vue";
import {jsonFormat} from "@/algorithm/jsonFormat";
import MessageUtil from "@/utils/MessageUtil";
import {highlight} from "@/global/BeanFactory";
import useLoadingStore from "@/store/LoadingStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {utools} from "@/plugins/utools";
import type {RenderFunction} from 'vue';

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

export function showJson(title: string, json: string | any, options?: DialogOption) {
    // 原始值
    let value = '';
    // 格式化后的值
    let html = "";
    let needPretty = true;
    if (typeof json === 'string') {
        if (/^\s*(\{[\s\S]*}|\[[\s\S]*])\s*$/.test(json)) {
            try {
                value = jsonFormat(json)
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
        value = JSON.stringify(json, null, 4);
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
    const execCopy = () => {
        utools.copyText(value);
        MessageUtil.success("复制成功");
    };
    // 创建对话框

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
