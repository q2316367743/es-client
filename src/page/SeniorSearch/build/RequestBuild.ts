import * as monaco from "monaco-editor";
import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import StrUtil from "@/utils/StrUtil";
import {supportMethods} from "@/data/EsUrl";

/**
 * 第一排匹配，匹配请求方法和请求连接
 */
let firstRegex = /\s*(HEAD|head|GET|get|POST|post|PUT|put|DELETE|delete)\s*([-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/;
let jsonRegex = /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/;
/**
 * 请求
 */
export interface Request {

    /**
     * 请求方式
     */
    method: Method;

    /**
     * 请求链接
     */
    link: string;

    /**
     * 请求参数
     */
    params: string;

}

export function requestBuild(instance: monaco.editor.IStandaloneCodeEditor): Request | undefined {
    let value = instance.getValue();
    let position = instance.getPosition();
    if (!position) {
        return;
    }
    let list = grammaticalAnalysis(value);
    if (list.length === 0) {
        return;
    }
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (position.lineNumber) {
            if (item.number > position.lineNumber) {
                if (i > 0) {
                    return list[i - 1];
                } else {
                    return;
                }
            } else if (item.number === position.lineNumber) {
                return item;
            }
        }
    }
    return list[list.length - 1];
}

interface Grammatical extends Request {

    number: number;

}

/**
 * 语法分析
 * @return 开始行数 => 请求
 */
function grammaticalAnalysis(value: string): Array<Grammatical> {
    let list = new Array<Grammatical>();
    let request: Grammatical | undefined;
    let params = new Array<string>();
    let lineNumber = 0;
    for (let line of value.split('\n')) {
        lineNumber++;
        line = line.replaceAll('\r', '');
        if (StrUtil.startWithArr(line, supportMethods)) {
            // 新的请求
            if (request) {
                request.params = params.length === 0 ? '{}' : params.join('\n');
                list.push(request);
                request = undefined;
                params = new Array<string>();
            }
            let items = StrUtil.splitAll(line, ' ');
            request = {
                number: lineNumber,
                method: items[0] as Method,
                link: '',
                params: '{}'
            }
            if (items.length > 1) {
                request.link = items[1];
            }
        } else if (StrUtil.notBlank(line)) {
            if (line.startsWith("//")) {
                continue;
            }
            // 空白的，跳过
            params.push(line);
        }
    }
    if (request) {
        request.params = params.length === 0 ? '{}' : params.join('\n');
        list.push(request);
    }
    return list;
}