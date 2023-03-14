import {Method} from "@/strategy/HttpStrategy/HttpStrategyConfig";
import {BLANK_REGEX, COMMENT_REGEX, URL_REGEX} from "@/data/EsUrl";

/**
 * 请求
 */

export interface Grammatical {

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

    /**
     * 所在行 - 开始
     */
    lineNumberStart: number;

    /**
     * 所在行 - 结束
     */
    lineNumberEnd: number;

    /**
     * 索引，第几个
     */
    index: number;

}

interface Line {

    /**
     * 这一行的值
     */
    value: string;

    /**
     * 行数
     */
    lineNumber: number;

}

/**
 * 语法分析
 * @return 开始行数 => 请求
 */
export function grammaticalAnalysis(value: string): Array<Grammatical> {

    // 全部的请求
    const requests = new Array<Array<Line>>();
    // 单独的请求
    let request = new Array<Line>();

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
                request = new Array<Line>();
            }
        }
        request.push({
            value: line,
            lineNumber: i
        });
    }

    if (request.length > 0) {
        // 还有请求，加入到请求集合里
        requests.push(request);
    }
    let grammaticalItems = new Array<Grammatical>();
    for (let i = 0; i < requests.length; i++) {
        let grammatical = renderGrammatical(requests[i], i);
        if (grammatical) {
            grammaticalItems.push(grammatical);
        }
    }
    return grammaticalItems;
}

function renderGrammatical(lines: Array<Line>, index: number): Grammatical | null {
    let first = lines[0].value.match(URL_REGEX);
    if (first) {
        return {
            method: first[1] as Method,
            link: first[2],
            index,
            params: lines.slice(1).map(e => e.value).join('\n'),
            lineNumberStart: lines[0].lineNumber,
            lineNumberEnd: lines[lines.length - 1].lineNumber
        }
    }
    return null;
}