import * as monaco from "monaco-editor";
import StrUtil from "@/utils/StrUtil";
import {supportMethods} from "@/data/EsUrl";
import MessageUtil from "@/utils/MessageUtil";
import {jsonFormat} from "@/algorithm/jsonFormat";

/**
 * 格式化rest语法
 *
 * @param instance 编辑器实例
 */
export default function formatBuild(instance: monaco.editor.IStandaloneCodeEditor): string {
    let value = instance.getValue();
    let items = new Array<string>();
    let params = new Array<string>();
    let comments = new Array<string>();
    for (let line of value.split('\n')) {
        line = line.replaceAll('\r', '');
        if (StrUtil.startWithArr(line, supportMethods)) {
            let flag = params.length === 0;
            params = paramBuild(params, items);
            if (!flag) {
                items.push("\n");
            }
            comments = commentBuild(comments, items);
            // 方法开头
            let strings = StrUtil.splitAll(line, " ");
            if (strings.length > 1) {
                items.push(strings.join(' '));
            } else {
                items.push(line);
            }
        } else if (StrUtil.notBlank(line)) {
            if (line.startsWith("//")) {
                comments.push(line);
            } else {
                params.push(line);
            }
        }
    }

    commentBuild(comments, items);
    paramBuild(params, items);
    return items.join('\n');
}

function paramBuild(params: Array<string>, items: Array<string>) {
    if (params.length > 0) {
        try {
            let json = jsonFormat(params.join("\n"));
            items.push(json);
        } catch (e) {
            MessageUtil.error("格式化失败", e as Error);
            params.forEach(param => items.push(param));
        }
    }
    return new Array<string>();
}

function commentBuild(comments: Array<string>, items: Array<string>) {
    if (comments.length > 0) {
        comments.forEach(comment => items.push(comment));
    }
    return new Array<string>();
}
