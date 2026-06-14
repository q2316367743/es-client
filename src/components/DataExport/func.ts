// 导出库
import { utils, writeFile } from 'xlsx'
import { ApiType, ExportConfig, ExportMode, ExportScope, ExportSource, ExportType } from './domain'
import { DocumentSearchResult } from '@/domain/es/DocumentSearchResult'
import { copyText, download } from '@/utils/BrowserUtil'
import DocumentApi from '@/components/es/DocumentApi'
import MessageUtil from '@/utils/model/MessageUtil'
import { DocumentSearchQuery } from '@/domain/es/DocumentSearchQuery'
import { parseJsonWithBigIntSupport, stringifyJsonWithBigIntSupport } from '$/util'
import { useLoading, UseLoadingResult } from '@/hooks/UseLoading'
import { t } from '@/i18n'
import { Json2CsvParser } from '@/components/DataExport/Json2CsvParser'

// ------------------------------------------------ 渲染库 ------------------------------------------------

const json2Csv = new Json2CsvParser({})
const json2Tsv = new Json2CsvParser({
  delimiter: '\t'
})

// ------------------------------------------------ 非结构化导出 ------------------------------------------------

function exportJson(records: Array<Record<string, any>>): string {
  return stringifyJsonWithBigIntSupport(records)
}

// ------------------------------------------------ 结构化导出 ------------------------------------------------

function exportForCsv(records: Array<Record<string, any>>): string {
  return json2Csv.parse(records)
}

function exportForTsv(records: Array<Record<string, any>>): string {
  return json2Tsv.parse(records)
}

function exportForTxt(config: ExportConfig, records: Array<Record<string, any>>): string {
  const json2Txt = new Json2CsvParser({
    delimiter: config.separator
  })
  return json2Txt.parse(records)
}

function exportFotXlsx(config: ExportConfig, records: Array<Record<string, any>>): void {
  writeFile(
    {
      Sheets: {
        sheet1: utils.json_to_sheet(records)
      },
      SheetNames: ['sheet1']
    },
    `${config.name}.xlsx`,
    {
      type: 'file',
      bookType: 'xlsx'
    }
  )
}

// ------------------------------------------------ 导出 ------------------------------------------------

/**
 * 获取导出数据
 * @param config 导出配置
 */
export async function getExportData(config: ExportConfig): Promise<Array<DocumentSearchResult>> {
  let page = 0
  const size = config.size
  let total = 0
  const results = new Array<DocumentSearchResult>()
  const instance = useLoading(t('module.data_export.message.exporting'))
  try {
    switch (config.scope) {
      case ExportScope.CURRENT:
        results.push(
          await DocumentApi(config.index)
            ._search(config.search)
            .then((e) => parseJsonWithBigIntSupport(e))
        )
        break
      case ExportScope.ALL:
        const condition1 = config.search
        if (config.apiType === ApiType.BASE) {
          do {
            page += 1
            condition1.from = (page - 1) * size
            condition1.size = size
            const result = await DocumentApi(config.index)
              ._search(condition1)
              .then((e) => parseJsonWithBigIntSupport<DocumentSearchResult>(e))
            results.push(result)
            total =
              typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value
            instance.start(
              t('module.data_export.message.exporting_progress', {
                start: (page - 1) * size,
                end: page * size,
                total
              })
            )
          } while (page * size < total)
        } else if (config.apiType === ApiType.SCROLL) {
          // 滚动导出
          await useScrollApi(results, config, instance)
        } else {
          throw new Error(t('module.data_export.message.api_type_error'))
        }
        break
      case ExportScope.CUSTOM:
        page = Math.max(config.customStart - 1, 0)
        const condition2 = config.search
        do {
          page += 1
          condition2.from = (page - 1) * size
          condition2.size = size
          const result = await DocumentApi(config.index)
            ._search(condition2)
            .then((e) => parseJsonWithBigIntSupport<DocumentSearchResult>(e))
          instance.start(
            t('module.data_export.message.exporting_progress', {
              start: (page - 1) * size,
              end: page * size,
              total
            })
          )
          results.push(result)
        } while (page <= config.customEnd)
        break
    }
  } finally {
    instance.close()
  }
  return Promise.resolve(results)
}

async function useScrollApi(
  results: Array<DocumentSearchResult>,
  config: ExportConfig,
  instance: UseLoadingResult
) {
  // 第一遍查询
  const condition: DocumentSearchQuery = {
    sort: config.search.sort,
    query: config.search.query,
    size: config.size
  }
  const result = await DocumentApi(config.index)._search_first(condition, config.scrollTime)
  const scrollId = result._scroll_id
  if (!scrollId) {
    return Promise.reject(t('module.data_export.message.scroll_id_error'))
  }
  results.push(result)
  while (true) {
    const result = await DocumentApi(config.index)._search_scroll(config.scrollTime, scrollId)
    if (!result.hits.hits || result.hits.hits.length === 0) {
      break
    }
    instance.start(
      t('module.data_export.message.exporting_count', { count: results.length * config.size })
    )
    results.push(result)
  }
}

// ------------------------------------------------ 确定数据的范围 ------------------------------------------------

/**
 * 获取实际导出的数据
 * @param config 导出配置
 * @param results 全部的结果
 */
export function getExportRecords(
  config: ExportConfig,
  results: Array<DocumentSearchResult>
): Array<Record<string, any>> {
  switch (config.source) {
    case ExportSource.ALL:
      return results
    case ExportSource.HIT:
      return results.flatMap((result) => result.hits.hits)
    case ExportSource.SOURCE:
      return results.flatMap((result) => result.hits.hits).map((hit) => hit._source)
    default:
      return []
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
      return exportJson(records)
    case ExportType.CSV:
      return exportForCsv(records)
    case ExportType.TSV:
      return exportForTsv(records)
    case ExportType.TXT:
      return exportForTxt(config, records)
    case ExportType.XLSX:
      // XLSX直接下载
      exportFotXlsx(config, records)
  }
  return ''
}

/**
 * 导出数据
 *
 * @param config 到处配置
 */
export async function exportData(config: ExportConfig): Promise<void> {
  // 1. 确定导出的基础数据
  const results = await getExportData(config)
  // 2. 确定数据的范围
  const records = getExportRecords(config, results)
  // 3. 确定导出的文件
  const content = getExportFile(config, records)
  if (content != '') {
    // 4, 导出的方式
    if (config.mode === ExportMode.DOWNLOAD) {
      download(content, config.name + config.type, config.type)
    } else if (config.mode === ExportMode.COPY) {
      copyText(content)
      MessageUtil.success(t('module.data_export.message.copy_success'))
    }
  }
  return Promise.resolve()
}
