// 导出库
import x2js from 'x2js';
import {Parser} from '@json2csv/plainjs';
import jsYaml from 'js-yaml';

import {nativeStrategyContext} from "@/global/BeanFactory";
import {ExportConfig, ExportHeader, ExportMode, ExportScope, ExportSource, ExportType} from "./domain";
import Assert from "@/utils/Assert";
import DownloadType from "@/strategy/NativeStrategy/DownloadType";
import {toRaw} from "vue";
import MessageUtil from '@/utils/MessageUtil';

// ------------------------------------------------ 渲染库 ------------------------------------------------

const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});
const json2Csv = new Parser({});
const json2Tsv = new Parser({
    delimiter: '\t'
});

// ------------------------------------------------ 非结构化导出 ------------------------------------------------

function exportNoSql(config: ExportConfig, data: any): ExportContent | undefined {
    let obj: {};
    if (config.source === ExportSource.HIT) {
        Assert.isFalse(!data || !data.hits || !data.hits.hits,
            "结构错误无法导出");
        obj = data.hits.hits;
    } else if (config.source === ExportSource.SOURCE) {
        Assert.isFalse(!data || !data.hits || !data.hits.hits,
            "结构错误无法导出");
        obj = (data.hits.hits as Array<any>).map(e => e['_source']);
    } else {
        obj = data;
    }
    if (config.type === ExportType.JSON) {
        return {
            type: DownloadType.JSON,
            content: JSON.stringify(obj)
        };
    } else if (config.type === ExportType.XML) {
        return {
            type: DownloadType.XML,
            content: json2xml.js2xml(obj)
        };
    } else if (config.type === ExportType.YML) {
        return {
            type: DownloadType.YML,
            content: jsYaml.dump(obj)
        };
    }
}

// ------------------------------------------------ 结构化解析 ------------------------------------------------

interface Result {

    keys: Array<string>;

    records: Array<any>;
}

function renderRecord(config: ExportConfig, data: any): Result {
    let records = new Array<any>();
    let keys = new Set<string>();
    if (config.source === ExportSource.HIT) {
        Assert.isFalse(!data || !data.hits || !data.hits.hits,
            "结构错误无法导出");
        (data.hits.hits as Array<any>).forEach(item => {
            let temp = {} as Record<string, any>;
            Object.keys(item).forEach(key => {
                if (key === '_source') {
                    let _source = item['_source'];
                    Object.keys(_source).forEach(key1 => {
                        temp[key1] = _source[key1];
                        keys.add(key1);
                    })
                } else {
                    temp[key] = item[key];
                    keys.add(key);
                }
            });
            records.push(temp);
        })
    } else if (config.source === ExportSource.SOURCE) {
        Assert.isFalse(!data || !data.hits || !data.hits.hits,
            "结构错误无法导出");
        records = (data.hits.hits as Array<any>).map(e => e['_source']);
        records.forEach(record => Object.keys(record)
            .forEach(key => {
                keys.add(key);
            }));
    } else {
        throw new Error('结构错误无法导出');
    }
    if (config.header === ExportHeader.DEEP) {
        // 深度
        keys = new Set<string>();
        let tempRecords = new Array<Record<string, any>>();
        records.forEach(record => {
            let tempRecord = {} as Record<string, any>;
            deepParse(record, keys, tempRecord, '')
            tempRecords.push(tempRecord);
        });
        records = tempRecords;
    }
    return {
        keys: Array.from(keys),
        records
    }
}

/**
 * 解析对象为扁平化数据
 * @param items 要解析的数据
 * @param keys key
 * @param record 记录
 * @param prefix 前缀
 */
function deepParse(items: Record<string, any>, keys: Set<string>, record: Record<string, any>, prefix: string) {
    for (let key in items) {
        let item = items[key];
        let currentKey = prefix === '' ? key : (prefix + '.' + key);
        if (typeof item === 'object') {
            deepParse(item, keys, record, currentKey);
        } else {
            record[currentKey] = item;
        }
    }
}

// ------------------------------------------------ 结构化导出 ------------------------------------------------

function exportForHtml(config: ExportConfig, data: any): ExportContent {
    let {keys, records} = renderRecord(config, data);
    return {
        type: DownloadType.HTML,
        content: htmlTemplate(config.name, keys, records)
    }
}

function htmlTemplate(name: string, keys: Array<string>, records: Array<any>) {
    return `<html lang="zh">
    <head>
        <title>${name}</title>
    </head>
    <body>
        <table>
            <thead>
                <th>${keys.map(e => `<td>${e}</td>`).join('\n')}</th>
            </thead>
            <tbody>
                ${records
        .map(record => keys.map(key => {
            if (typeof record[key] === 'undefined') {
                return '<td></td>';
            } else if (typeof record[key] === 'object') {
                return `<td>${JSON.stringify(record[key])}</td>`;
            } else {
                return `<td>${record[key]}</td>`;
            }
        }).join('\n'))
        .map(e => `<tr>${e}</tr>`)
        .join('\n')}
            </tbody>
        </table>
    <body>
</html>    
`
}

function exportForCsv(config: ExportConfig, data: any): ExportContent {
    let {records} = renderRecord(config, data);
    return {
        type: DownloadType.CSV,
        content: json2Csv.parse(records)
    }
}

function exportForTsv(config: ExportConfig, data: any): ExportContent {
    let {records} = renderRecord(config, data);
    return {
        type: DownloadType.TXT,
        content: json2Tsv.parse(records)
    }
}

function exportForTxt(config: ExportConfig, data: any): ExportContent {
    let {records} = renderRecord(config, data);
    const json2Txt = new Parser({
        delimiter: config.separator
    });
    return {
        type: DownloadType.TXT,
        content: json2Txt.parse(records)
    }
}

// ------------------------------------------------ 导出 ------------------------------------------------

interface ExportContent {

    type: DownloadType;

    content: string;

}

/**
 * 导出数据
 *
 * @param config 到处配置
 * @param data 导出的源数据
 */
export function exportData(config: ExportConfig, data: any): void {
    data = toRaw(data);
    let content: ExportContent | undefined;
    switch (config.scope) {
        case ExportScope.CURRENT:
            switch (config.type) {
                case ExportType.JSON:
                case ExportType.YML:
                case ExportType.XML:
                    content = exportNoSql(config, data);
                    break;
                case ExportType.HTML:
                    content = exportForHtml(config, data);
                    break;
                case ExportType.CSV:
                    content = exportForCsv(config, data);
                    break;
                case ExportType.TSV:
                    content = exportForTsv(config, data);
                    break;
                case ExportType.TXT:
                    content = exportForTxt(config, data);
                    break;
            }
            break;
    }
    if (content) {
        if (config.mode === ExportMode.DOWNLOAD) {
            nativeStrategyContext.getStrategy().download(content.content,
                config.name + '.' + content.type,
                content.type);
        } else if (config.mode === ExportMode.COPY) {
            nativeStrategyContext.getStrategy().copy(content.content)
        }
    } else {
        MessageUtil.error('导出异常，无法获取导出内容');
    }
}