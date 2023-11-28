import {Button, Modal} from "@arco-design/web-vue";
import {h} from "vue";
import {jsonFormat} from "@/algorithm/jsonFormat";
import MessageUtil from "@/utils/MessageUtil";
import {highlight} from "@/global/BeanFactory";
import useLoadingStore from "@/store/LoadingStore";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";
import {utools} from "@/plugins/utools";

/**
 * 显示json对话框，异步加载数据
 * @param title 对话框标题
 * @param data 数据
 */
export function showJsonDialogByAsync(title: string, data: Promise<any>) {
    useLoadingStore().start("开始获取数据，请稍后");
    data.then(json => showJson(title, json))
        .catch(e => MessageUtil.error("数据获取失败", e))
        .finally(() => useLoadingStore().close());
}

export function showJson(title: string, json: string | any) {
    // 原始值
    let value = '';
    // 格式化后的值
    let html = "";
    let needPretty = true;
    if (typeof json === 'string') {
        if (/^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/.test(json)) {
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
    Modal.open({
        title: title,
        content: () => h('div', {
            style: {
                fontSize: useGlobalSettingStore().jsonFontSize + 'px',
                position: 'relative'
            },
            class: 'hljs'
        }, {
            default: () => [
                h({template: `<pre class="language-json hljs">${html}</pre>`}),
                h(Button, {
                    type: "text",
                    style: {
                        position: "absolute",
                        top: "6px",
                        right: "20px"
                    },
                    onClick: () => execCopy()
                }, {default: () => "复制"})
            ]
        }),
        draggable: true,
        width: "80vw",
        footer: false
    });

}