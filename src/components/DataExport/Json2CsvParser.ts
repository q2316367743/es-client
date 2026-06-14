interface Json2CsvParserOptions {
  delimiter?: string
}

interface FlattenedRecord {
  [key: string]: unknown
}

export class Json2CsvParser {
  private readonly options: Required<Json2CsvParserOptions>

  constructor(options: Partial<Json2CsvParserOptions> = {}) {
    this.options = Object.assign(
      {
        delimiter: ','
      },
      options
    )
  }

  parse(records: Array<Record<string, unknown>>): string {
    if (records.length === 0) {
      return ''
    }

    // 1. 将嵌套对象拍平为扁平 key-value 结构
    const flattenedRecords = records.map((record) => this.flatten(record))

    // 2. 收集所有 key，保持首次出现的顺序
    const headers = this.collectHeaders(flattenedRecords)

    // 3. 生成 CSV 行
    const lines: Array<string> = [
      this.escapeRow(headers),
      ...flattenedRecords.map((record) => this.escapeRow(headers.map((h) => record[h])))
    ]

    // RFC 4180: 以换行结束
    return lines.join('\r\n') + '\r\n'
  }

  /**
   * 将嵌套对象拍平，用 `.` 分隔层级
   *
   * 输入: { a: { b: 1 }, c: 2 }
   * 输出: { 'a.b': 1, 'c': 2 }
   */
  private flatten(
    obj: Record<string, unknown>,
    prefix = '',
    result: FlattenedRecord = {}
  ): FlattenedRecord {
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        this.flatten(value as Record<string, unknown>, fullKey, result)
      } else {
        result[fullKey] = value
      }
    }
    return result
  }

  /**
   * 收集所有记录中的 key，按首次出现顺序排列
   */
  private collectHeaders(records: Array<FlattenedRecord>): Array<string> {
    const headerSet = new Set<string>()
    const headers: Array<string> = []

    for (const record of records) {
      for (const key of Object.keys(record)) {
        if (!headerSet.has(key)) {
          headerSet.add(key)
          headers.push(key)
        }
      }
    }

    return headers
  }

  /**
   * 将一行值转义为 CSV 格式
   *
   * 规则:
   * - 含分隔符、双引号、换行符的值用双引号包裹
   * - 值中的双引号用两个双引号转义
   * - null / undefined 输出空串
   */
  private escapeRow(values: Array<unknown>): string {
    return values.map((value) => this.escapeCell(value)).join(this.options.delimiter)
  }

  private escapeCell(value: unknown): string {
    if (value === null || value === undefined) {
      return ''
    }

    const str = typeof value === 'string' ? value : String(value)
    const { delimiter } = this.options

    // 是否需要转义
    if (str.includes('"') || str.includes(delimiter) || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }

    return str
  }
}
