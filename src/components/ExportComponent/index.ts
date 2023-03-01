import { json2xml } from "@/global/BeanFactory";
import jsYaml from 'js-yaml';
import BrowserUtil from "@/utils/BrowserUtil";
import { ExportConfig, ExportScope, ExportSource, ExportType } from "./domain";
import Assert from "@/utils/Assert";

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
        BrowserUtil.download(JSON.stringify(obj),
            config.name + '.json',
            "application/json");
        return;
    } else if (config.type === ExportType.XML) {
        BrowserUtil.download(json2xml.js2xml(obj),
            config.name + '.xml',
            "application/xml");
        return;
    } else if (config.type === ExportType.YML) {
        BrowserUtil.download(jsYaml.dump(obj),
            config.name + '.yml',
            "application/yml");
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
    } else {
        throw new Error('结构错误无法导出');
    }
    return {
        keys: Array.from(keys),
        records
    }
}

function exportForHtml(config: ExportConfig, data: any): void {
    let { keys, records } = renderRecord(config, data);
    BrowserUtil.download(htmlTemplate(config.name, keys, records),
        config.name + '.html',
        "application/html");
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

function exportForTxt(config: ExportConfig, data: any): void {
    let { keys, records } = renderRecord(config, data);
    BrowserUtil.download(txtTemplate(config.separator, keys, records),
        config.name + '.txt',
        "txt/plain");
}

function txtTemplate(separator: string, keys: Array<string>, records: Array<any>): string {
    return `${keys.join(separator)}
    ${records
            .map(record => keys.map(key => {
                if (typeof record[key] === 'object') {
                    return `$${JSON.stringify(record[key])}`;
                } else {
                    return `${record[key]}`;
                }
            }).join(separator))
            .join('\n')}`;
}

/**
 * 导出数据
 * 
 * @param config 到处配置
 * @param data 导出的源数据
 */
export function exportData(config: ExportConfig, data: any): void {
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
        case ExportType.TSV:
        case ExportType.TXT:
            exportForTxt(config, data);
            break;
    }
}