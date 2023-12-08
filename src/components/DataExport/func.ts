// 导出库
import {Parser} from '@json2csv/plainjs';
import {utils, writeFile} from 'xlsx'

import {ApiType, ExportConfig, ExportMode, ExportScope, ExportSource, ExportType} from "./domain";
import {DocumentSearchResult} from "@/components/es/domain/DocumentSearchResult";
import {download} from "@/utils/BrowserUtil";
import DocumentApi from "@/components/es/api/DocumentApi";
import useLoadingStore from "@/store/LoadingStore";
import MessageUtil from "@/utils/MessageUtil";
import {DocumentSearchQuery} from "@/components/es/domain/DocumentSearchQuery";

// ------------------------------------------------ 渲染库 ------------------------------------------------

const json2Csv = new Parser({});
const json2Tsv = new Parser({
    delimiter: '\t'
});

// ------------------------------------------------ 非结构化导出 ------------------------------------------------

function exportJson(records: Array<Record<string, any>>): string {
    return JSON.stringify(records);
}

// ------------------------------------------------ 结构化导出 ------------------------------------------------


function exportForCsv(records: Array<Record<string, any>>): string {
    return json2Csv.parse(records)
}

function exportForTsv(records: Array<Record<string, any>>): string {
    return json2Tsv.parse(records)
}

function exportForTxt(config: ExportConfig, records: Array<Record<string, any>>): string {
    const json2Txt = new Parser({
        delimiter: config.separator
    });
    return json2Txt.parse(records)
}

function exportFotXlsx(config: ExportConfig, records: Array<Record<string, any>>): void {
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

/**
 * 获取导出数据
 * @param config 导出配置
 */
export async function getExportData(config: ExportConfig): Promise<Array<DocumentSearchResult>> {
    let page = 0;
    const size = config.size;
    let total = 0;
    const results = new Array<DocumentSearchResult>();

    try {
        switch (config.scope) {
            case ExportScope.CURRENT:
                results.push(await DocumentApi(config.index)._search(config.search));
                break;
            case ExportScope.ALL:
                const condition1 = config.search;
                if (config.apiType === ApiType.BASE) {

                    do {
                        page += 1;
                        condition1.from = (page - 1) * size;
                        condition1.size = size;
                        const result = await DocumentApi(config.index)._search(condition1);
                        results.push(result);
                        total = typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;
                        useLoadingStore().start(`正在导出${(page - 1) * size} - ${page * size}，共${total}条`);
                    } while (page * size < total);
                } else if (config.apiType === ApiType.SCROLL) {
                    // 滚动导出
                    await useScrollApi(results, config);
                } else {
                    throw new Error("导出异常，API类型不存在");
                }
                break;
            case ExportScope.CUSTOM:
                page = Math.max(config.customStart - 1, 0)
                const condition2 = config.search;
                do {
                    page += 1;
                    condition2.from = (page - 1) * size;
                    condition2.size = size;
                    const result = await DocumentApi(config.index)._search(condition2);
                    useLoadingStore().start(`正在导出${(page - 1) * size} - ${page * size}，共${total}条`);
                    results.push(result);
                } while (page <= config.customEnd);
                break;
        }
    } finally {
        useLoadingStore().close();
    }
    return Promise.resolve(results);
}

async function useScrollApi(results: Array<DocumentSearchResult>, config: ExportConfig) {
    // 第一遍查询
    const condition: DocumentSearchQuery = {
        sort: config.search.sort,
        query: config.search.query,
        size: config.size
    }
    const result = await DocumentApi(config.index)._search_first(condition, config.scrollTime);
    const scrollId = result._scroll_id;
    if (!scrollId) {
        return Promise.reject("系统异常，滚动ID不存在")
    }
    results.push(result);
    while (true) {
        const result = await DocumentApi(config.index)._search_scroll(config.scrollTime, scrollId);
        if (!result.hits.hits|| result.hits.hits.length === 0) {
            break;
        }
        useLoadingStore().start(`已经导出【${results.length * config.size}】条`);
        results.push(result);
    }

}

// ------------------------------------------------ 确定数据的范围 ------------------------------------------------

/**
 * 获取实际导出的数据
 * @param config 导出配置
 * @param results 全部的结果
 */
export function getExportRecords(config: ExportConfig, results: Array<DocumentSearchResult>): Array<Record<string, any>> {
    switch (config.source) {
        case ExportSource.ALL:
            return results;
        case ExportSource.HIT:
            return results.flatMap(result => result.hits.hits);
        case ExportSource.SOURCE:
            return results.flatMap(result => result.hits.hits).map(hit => hit._source);
        default:
            return [];
    }
}

// ------------------------------------------------ 确定导出的文件 ------------------------------------------------

/**
 * 获取导出的文件
 * @param config 导出配置
 * @param records 记录
 * @return 文件内容。xlsx无效
 */
export function getExportFile(config: ExportConfig, records: Array<Record<string, any>>): string {
    switch (config.type) {
        case ExportType.JSON:
            return exportJson(records);
        case ExportType.CSV:
            return exportForCsv(records);
        case ExportType.TSV:
            return exportForTsv(records);
        case ExportType.TXT:
            return exportForTxt(config, records);
        case ExportType.XLSX:
            // XLSX直接下载
            exportFotXlsx(config, records);
    }
    return '';
}


/**
 * 导出数据
 *
 * @param config 到处配置
 */
export async function exportData(config: ExportConfig): Promise<void> {
    console.log(config)
    // 1. 确定导出的基础数据
    const results = await getExportData(config);
    // 2. 确定数据的范围
    const records = getExportRecords(config, results);
    // 3. 确定导出的文件
    const content = getExportFile(config, records);
    if (content != '') {
        // 4, 导出的方式
        if (config.mode === ExportMode.DOWNLOAD) {
            download(content, config.name + config.type, config.type);
        } else if (config.mode === ExportMode.COPY) {
            utools.copyText(content);
            MessageUtil.success("已成功复制到剪切板");
        }
    }
    return Promise.resolve();
}
