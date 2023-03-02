// 导出库
import x2js from 'x2js';
import { Parser } from '@json2csv/plainjs';
import jsYaml from 'js-yaml';

import { nativeStrategyContext } from "@/global/BeanFactory";
import { ExportConfig, ExportSource, ExportType } from "./domain";
import Assert from "@/utils/Assert";
import DownloadType from "@/strategy/NativeStrategy/DownloadType";
import { toRaw } from "vue";

const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});
const json2Csv = new Parser({});
const json2Tsv = new Parser({
    delimiter: '\t'
});

function exportNoSql(config: ExportConfig, data: any): void {
    let obj = {};
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
        nativeStrategyContext.getStrategy().download(JSON.stringify(obj),
            config.name + '.json',
            DownloadType.JSON);
        return;
    } else if (config.type === ExportType.XML) {
        nativeStrategyContext.getStrategy().download(json2xml.js2xml(obj),
            config.name + '.xml',
            DownloadType.XML);
        return;
    } else if (config.type === ExportType.YML) {
        nativeStrategyContext.getStrategy().download(jsYaml.dump(obj),
            config.name + '.yml',
            DownloadType.YML);
        return;
    }
}

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
    console.log(keys)
    return {
        keys: Array.from(keys),
        records
    }
}

function exportForHtml(config: ExportConfig, data: any): void {
    let { keys, records } = renderRecord(config, data);
    nativeStrategyContext.getStrategy().download(htmlTemplate(config.name, keys, records),
        config.name + '.html',
        DownloadType.HTML);
}

function htmlTemplate(name: string, keys: Array<string>, records: Array<any>) {
    return `<html>
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

function exportForCsv(config: ExportConfig, data: any): void {
    let { records } = renderRecord(config, data);

    nativeStrategyContext.getStrategy().download(json2Csv.parse(records),
        config.name + '.csv',
        DownloadType.CSV);
}

function exportForTsv(config: ExportConfig, data: any): void {
    let { records } = renderRecord(config, data);
    nativeStrategyContext.getStrategy().download(json2Tsv.parse(records),
        config.name + '.txt',
        DownloadType.TXT);
}

function exportForTxt(config: ExportConfig, data: any): void {
    let { records } = renderRecord(config, data);
    const json2Txt = new Parser({
        delimiter: config.separator
    });
    nativeStrategyContext.getStrategy().download(json2Txt.parse(records),
        config.name + '.txt',
        DownloadType.TXT);
}


/**
 * 导出数据
 * 
 * @param config 到处配置
 * @param data 导出的源数据
 */
export function exportData(config: ExportConfig, data: any): void {
    data = toRaw(data);
    switch (config.type) {
        case ExportType.JSON:
        case ExportType.YML:
        case ExportType.XML:
            exportNoSql(config, data);
            break;
        case ExportType.HTML:
            exportForHtml(config, data);
            break;
        case ExportType.CSV:
            exportForCsv(config, data);
            break;
        case ExportType.TSV:
            exportForTsv(config, data);
            break;
        case ExportType.TXT:
            exportForTxt(config, data);
            break;
    }
}