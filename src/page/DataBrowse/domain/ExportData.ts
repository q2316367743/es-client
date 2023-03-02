import { VXETable } from 'vxe-table';
import jsYaml from 'js-yaml';

import { json2xml, nativeStrategyContext } from '@/global/BeanFactory';

import ExportConfig from "./ExportConfig";
import BrowserUtil from "@/utils/BrowserUtil";
import DownloadType from '@/strategy/NativeStrategy/DownloadType';

function verifyExportConfig(exportConfig: ExportConfig) {
    if (exportConfig.name === '') {
        throw new Error('请输入文件名称');
    }
    // 自动增加文件后缀
    switch (exportConfig.type) {
        case 1:
            if (!exportConfig.name.endsWith('.json')) {
                exportConfig.name = exportConfig.name + '.json';
            }
            break;
        case 2:
            if (!exportConfig.name.endsWith('.html')) {
                exportConfig.name = exportConfig.name + '.html';
            }
            break;
        case 3:
            if (!exportConfig.name.endsWith('.xml')) {
                exportConfig.name = exportConfig.name + '.xml';
            }
            break;
        case 4:
            if (!exportConfig.name.endsWith('.yaml')) {
                exportConfig.name = exportConfig.name + '.yaml';
            }
            break;
    }
}

function buildObj(exportConfig: ExportConfig, records: Array<any>, result: any): any {
    let items = new Array<any>();
    if (exportConfig.result === 1) {
        for (let record of records) {
            let item = {} as any;
            for (let key in record) {
                if (key !== '_source') {
                    item[key] = record[key];
                }
            }
            items.push(item);
        }
    } else if (exportConfig.result === 2) {
        for (let record of records) {
            items.push(record['_source']);
        }
    } else if (exportConfig.result === 3) {
        return result;
    } else {
        throw new Error('结果集类型错误，无法打印');
    }
    return items;
}

/**
 * 导出为JSON
 * 
 * @param exportConfig 导出配置
 * @param records 渲染结果集
 * @param result 原始数据
 */
function exportForJson(exportConfig: ExportConfig, records: Array<any>, result: any): string {
    return JSON.stringify(buildObj(exportConfig, records, result), null, 4);
}


/**
 * 导出为html
 * 
 * @param exportConfig 导出配置
 * @param records 渲染结果集
 * @param result 原始数据
 */
function exportForHtml(exportConfig: ExportConfig, records: Array<any>, result: any): string {
    if (exportConfig.result === 3) {
        throw new Error('原始结果集无法导出HTML格式');
    }
    return 'HTML';
}

/**
 * 导出为xml
 * 
 * @param exportConfig 导出配置
 * @param records 渲染结果集
 * @param result 原始数据
 */
function exportForXml(exportConfig: ExportConfig, records: Array<any>, result: any): string {
    return formatXml(json2xml.js2xml(buildObj(exportConfig, records, result)));
}

/**
 * 导出为yaml
 * 
 * @param exportConfig 导出配置
 * @param records 渲染结果集
 * @param result 原始数据
 */
function exportForYaml(exportConfig: ExportConfig, records: Array<any>, result: any): string {
    return jsYaml.dump(buildObj(exportConfig, records, result), {
        indent: 2
    });
}

export default function exportData(exportConfig: ExportConfig, records: Array<any>, result: any) {
    // 验证数据类型
    verifyExportConfig(exportConfig)
    let content = '';
    // 渲染数据
    if (exportConfig.type === 1) {
        content = exportForJson(exportConfig, records, result);
    } else if (exportConfig.type === 2) {
        content = exportForHtml(exportConfig, records, result);
    } else if (exportConfig.type === 3) {
        content = exportForXml(exportConfig, records, result);
    } else if (exportConfig.type === 4) {
        content = exportForYaml(exportConfig, records, result);
    } else {
        throw new Error('文件类型错误');
    }
    if (exportConfig.config === 1) {
        // 复制到剪切板
        BrowserUtil.copy(content, false);
    } else if (exportConfig.config === 2) {
        // 打印
        VXETable.print({
            sheetName: exportConfig.name,
            content
        })
    } else if (exportConfig.config === 3) {
        // 下载
        if (exportConfig.type === 1) {
            nativeStrategyContext.getStrategy().download(content, exportConfig.name, DownloadType.JSON);
        } else if (exportConfig.type === 2) {
            nativeStrategyContext.getStrategy().download(content, exportConfig.name, DownloadType.HTML);
        } else if (exportConfig.type === 3) {
            nativeStrategyContext.getStrategy().download(content, exportConfig.name, DownloadType.XML);
        } else if (exportConfig.type === 4) {
            nativeStrategyContext.getStrategy().download(content, exportConfig.name, DownloadType.YML);
        }
    } else {
        throw new Error('导出方式未知')
    }
}



//格式化xml代码
function formatXml(xmlStr: string) {
    let text = xmlStr;
    //使用replace去空格
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");
    //处理注释
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
        let ret = '<!--' + escape(text) + '-->';
        return ret;
    }).replace(/\r/g, '\n');
    //调整格式	以压栈方式递归调整缩进
    let rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    let nodeStack = new Array<any>();
    let output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
        let isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
        let prefix = '';
        if (isBegin == '!') {//!开头
            prefix = setPrefix(nodeStack.length);
        } else {
            if (isBegin != '/') {///开头
                prefix = setPrefix(nodeStack.length);
                if (!isClosed) {//非关闭标签
                    nodeStack.push(name);
                }
            } else {
                nodeStack.pop();//弹栈
                prefix = setPrefix(nodeStack.length);
            }
        }
        let ret = '\n' + prefix + all;
        return ret;
    });
    let prefixSpace = -1;
    let outputText = output.substring(1);
    //还原注释内容
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        if (prefix.charAt(0) == '\r')
            prefix = prefix.substring(1);
        text = unescape(text).replace(/\r/g, '\n');
        let ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
        return ret;
    });
    outputText = outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    return outputText;
}

//计算头函数	用来缩进
function setPrefix(prefixIndex: number) {
    let result = '';
    let span = '    ';//缩进长度
    let output = [];
    for (let i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }
    result = output.join('');
    return result;
}