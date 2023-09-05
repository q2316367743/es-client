// 导出库
import x2js from 'x2js';
import {Parser} from '@json2csv/plainjs';
import jsYaml from 'js-yaml';
import {utils, writeFile} from 'xlsx'

import {ExportConfig, ExportMode, ExportScope, ExportSource, ExportType} from "./domain";
import Assert from "@/utils/Assert";
import {toRaw} from "vue";
import MessageUtil from '@/utils/MessageUtil';
import {jsonToTableComplete, TableViewColumnData} from "@/algorithm/jsonToTable";
import { download } from '@/utils/BrowserUtil';
import DownloadTypeEnum from '@/enumeration/DownloadTypeEnum';

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
            type: DownloadTypeEnum.JSON,
            content: JSON.stringify(obj)
        };
    } else if (config.type === ExportType.XML) {
        return {
            type: DownloadTypeEnum.XML,
            content: json2xml.js2xml(obj)
        };
    } else if (config.type === ExportType.YML) {
        return {
            type: DownloadTypeEnum.YML,
            content: jsYaml.dump(obj)
        };
    }
}

// ------------------------------------------------ 结构化导出 ------------------------------------------------

function exportForHtml(config: ExportConfig, data: any): ExportContent {
    let {columns, records} = jsonToTableComplete(data, {
        common: config.source === ExportSource.HIT,
        source: false,
        separator: '.'
    });
    return {
        type: DownloadTypeEnum.HTML,
        content: htmlTemplate(config.name, columns, records)
    }
}

function htmlTemplate(name: string, keys: Array<TableViewColumnData>, records: Array<any>) {
    return `<html lang="zh">
    <head>
        <title>${name}</title>
    </head>
    <body>
        <table>
            <thead>
                <tr>${keys.map(e => `<td>${e.dataIndex}</td>`).join('\n')}</tr>
            </thead>
            <tbody>
                ${records
        .map(record => keys.map(key => {
            if (typeof record[key.dataIndex] === 'undefined') {
                return '<td></td>';
            } else if (typeof record[key.dataIndex] === 'object') {
                return `<td>${JSON.stringify(record[key.dataIndex], null, 4)}</td>`;
            } else {
                return `<td>${record[key.dataIndex]}</td>`;
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
    let {records} = jsonToTableComplete(data, {
        common: config.source === ExportSource.HIT,
        source: false,
        separator: '.'
    });
    return {
        type: DownloadTypeEnum.CSV,
        content: json2Csv.parse(records)
    }
}

function exportForTsv(config: ExportConfig, data: any): ExportContent {
    let {records} = jsonToTableComplete(data, {
        common: config.source === ExportSource.HIT,
        source: false,
        separator: '.'
    });
    return {
        type: DownloadTypeEnum.TXT,
        content: json2Tsv.parse(records)
    }
}

function exportForTxt(config: ExportConfig, data: any): ExportContent {
    let {records} = jsonToTableComplete(data, {
        common: config.source === ExportSource.HIT,
        source: false,
        separator: '.'
    });
    const json2Txt = new Parser({
        delimiter: config.separator
    });
    return {
        type: DownloadTypeEnum.TXT,
        content: json2Txt.parse(records)
    }
}

function exportFotXlsx(config: ExportConfig, data: any) {
    let {records} = jsonToTableComplete(data, {
        common: config.source === ExportSource.HIT,
        source: false,
        separator: '.'
    });

    writeFile({
        Sheets: {
            "sheet1": utils.json_to_sheet(records)
        },
        SheetNames: ["sheet1"]
    }, `${config.name}.xlsx`, {
        type: "file", bookType: 'xlsx'
    })
}

// ------------------------------------------------ 导出 ------------------------------------------------

interface ExportContent {

    type: DownloadTypeEnum;

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
        // TODO：导出范围
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
                case ExportType.XLSX:
                    // 表格只能下载
                    exportFotXlsx(config, data);
                    return;
            }
            break;
    }
    if (content) {
        if (config.mode === ExportMode.DOWNLOAD) {
            download(content.content,
                config.name + '.' + content.type,
                content.type);
        } else if (config.mode === ExportMode.COPY) {
            utools.copyText(content.content);
        }
    } else {
        MessageUtil.error('导出异常，无法获取导出内容');
    }
}
