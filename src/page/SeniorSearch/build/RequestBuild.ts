import * as monaco from "monaco-editor";
import { Method } from "@/strategy/HttpStrategy/HttpStrategyConfig";
import { BLANK_REGEX, COMMENT_REGEX, URL_REGEX } from "@/data/EsUrl";

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

export function requestBuild(instance: monaco.editor.IStandaloneCodeEditor, index: number): Request | undefined {
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

interface Grammatical extends Request {

    number: number;

}

/**
 * 语法分析
 * @return 开始行数 => 请求
 */
function grammaticalAnalysis(value: string): Array<Grammatical> {

    // 全部的请求
    const requests = new Array<Array<string>>();
    // 单独的请求
    let request = new Array<string>();

    // 多行
    let lines = value.split('\n');
    // 遍历每一行
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        // 去除多余部分
        line = line.replaceAll('\r', '');
        // 注释、空白，跳过
        if (COMMENT_REGEX.test(line) || BLANK_REGEX.test(line)) {
            continue;
        }
        if (URL_REGEX.test(line)) {
            // 如果此行是新的请求
            if (request.length > 0) {
                // 存在请求，加入到请求集合里
                requests.push(request);
                // 重置请求
                request = new Array<string>();
            }
        }
        request.push(line);
    }

    if (request.length > 0) {
        // 还有请求，加入到请求集合里
        requests.push(request);
    }
    let grammaticalItems = new Array<Grammatical>();
    for(let i= 0;i < requests.length; i++) {
        let grammatical = renderGrammatical(request, i);
        if(grammatical) {
            grammaticalItems.push(grammatical);
        }
    }
    return grammaticalItems;
}

function renderGrammatical(lines: Array<string>, index: number): Grammatical | null {
    let first = lines[0].match(URL_REGEX);
    if (first) {
        return {
            method: first[1] as Method,
            link: first[2],
            number: index,
            params: lines.slice(1).join('\n')
        }
    }
    return null;
}