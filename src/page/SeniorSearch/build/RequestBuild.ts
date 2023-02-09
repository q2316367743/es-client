import * as monaco from "monaco-editor";
import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * 第一排匹配，匹配请求方法和请求连接
 */
const FIRST_REGEX = /\s*(HEAD|head|GET|get|POST|post|PUT|put|DELETE|delete)\s*([-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/;
const JSON_REGEX = /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/;
const COMMENT_REGEX = /^\s*\/\/.*/;
const BLANK_REGEX = /^\s*$/;

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

    paramList: Array<string>;

}

/**
 * 语法分析
 * @return 开始行数 => 请求
 */
function grammaticalAnalysis(value: string): Array<Grammatical> {
    let list = new Array<Grammatical>();
    let request: Grammatical | undefined;
    let lines = value.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.replaceAll('\r', '');
        if (COMMENT_REGEX.test(line) || BLANK_REGEX.test(line)) {
            // 注释、空白，跳过
            continue;
        }
        let firstListTest = line.match(FIRST_REGEX);
        if (firstListTest && firstListTest.length > 0) {
            if (request) {
                // 存在请求，先新增
                request.params = request.paramList.join('\n');
                list.push(request);
            }
            request = {
                method: firstListTest[1] as Method,
                link: firstListTest[2] as string,
                params: '',
                number: i + 1,
                paramList: new Array<string>()
            };
        } else {
            if (request) {
                request.paramList.push(line);
            }
        }
    }
    if (request) {
        // 存在请求，新增
        request.params = request.paramList.join('\n');
        list.push(request);
    }
    console.log(list)
    return list;
}