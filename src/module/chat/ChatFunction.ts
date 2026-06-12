import type { ToolFunction } from '@/hooks'
import { useEsRequestJson } from '@/plugins/native/axios'
import { useIndexStore } from '@/store'
import { IndexMappingFieldMapping } from '$/shared/elasticsearch'

/**
 * 收集指定 mapping 中所有 nested / object 类型字段的路径及子字段名
 */
function collectObjectFields(
  props: Record<string, IndexMappingFieldMapping>,
  prefix = ''
): Array<{ path: string; type: string; fields: string[] }> {
  const result: Array<{ path: string; type: string; fields: string[] }> = []
  for (const [fieldName, fieldDef] of Object.entries(props)) {
    const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName
    if (fieldDef.type === 'nested' || fieldDef.type === 'object') {
      const subFields = fieldDef.properties ? Object.keys(fieldDef.properties) : []
      result.push({ path: fullPath, type: fieldDef.type, fields: subFields })
      if (fieldDef.properties) {
        result.push(...collectObjectFields(fieldDef.properties, fullPath))
      }
    }
  }
  return result
}

function validateIndex(index: string): string | null {
  const { indicesMap } = useIndexStore()
  if (!indicesMap.has(index)) {
    return `索引 "${index}" 不存在。请使用 list_indices 工具查看可用的索引列表。`
  }
  return null
}

export const chatFunctions: Array<ToolFunction> = [
  // ──────────────────────────────────────────────
  //  1. 索引列表
  // ──────────────────────────────────────────────
  {
    name: 'list_indices',
    description:
      '获取当前 Elasticsearch 集群中所有索引和别名的名称列表，用于确认可查询的数据源。执行任何查询前建议先调用此工具确认索引存在',
    parameters: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      const { indicesMap } = useIndexStore()
      return Array.from(indicesMap.keys())
    }
  },

  // ──────────────────────────────────────────────
  //  2. 索引映射（字段名 + 类型）
  // ──────────────────────────────────────────────
  {
    name: 'get_index_mapping',
    description:
      '获取指定索引的字段映射信息（字段名、字段类型）。用于编写 query / agg 时准确知道有哪些字段可用以及每个字段的数据类型，避免写错字段名或类型',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index } = params as { index: string }
      const err = validateIndex(index)
      if (err) return { error: err }

      const { mappingMap } = useIndexStore()
      const mapping = mappingMap.get(index)
      if (!mapping) return { error: `索引 "${index}" 的 mapping 信息不可用` }
      return mapping
    }
  },

  // ──────────────────────────────────────────────
  //  3. 索引配置
  // ──────────────────────────────────────────────
  {
    name: 'get_index_settings',
    description:
      '获取指定索引的配置信息，包括分片数、副本数、refresh_interval、路由分配、分词器（analysis）等。用于了解索引的分片情况，避免对不可查索引生成 DSL',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index } = params as { index: string }
      const err = validateIndex(index)
      if (err) return { error: err }

      return useEsRequestJson({
        method: 'GET',
        url: `/${encodeURIComponent(index)}/_settings`
      })
    }
  },

  // ──────────────────────────────────────────────
  //  4. 样本文档
  // ──────────────────────────────────────────────
  {
    name: 'sample_docs',
    description:
      '从指定索引中抽取少量文档样本，让 AI 看到真实数据的字段值格式、嵌套结构、内容样式，从而减少字段名、字段结构和值格式的幻觉。默认返回 3 条，最大 10 条',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        },
        size: {
          type: 'number',
          description: '返回文档数量（默认 3，最大 10）'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index, size = 3 } = params as { index: string; size?: number }
      const err = validateIndex(index)
      if (err) return { error: err }

      return useEsRequestJson({
        method: 'POST',
        url: `/${encodeURIComponent(index)}/_search`,
        data: {
          query: { match_all: {} },
          size: Math.min(size, 10),
          sort: [{ _doc: { order: 'desc' } }]
        }
      })
    }
  },

  // ──────────────────────────────────────────────
  //  5. 常用字段
  // ──────────────────────────────────────────────
  {
    name: 'get_common_fields',
    description:
      '获取指定索引中所有可用字段（含字段名和类型）。帮助判断哪些字段最常用、可查询，便于优先在 query / agg 中使用这些字段',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index } = params as { index: string }
      const { fieldOptionMap } = useIndexStore()
      const fields = fieldOptionMap[index]
      if (!fields) return { error: `索引 "${index}" 不存在` }
      return fields
    }
  },

  // ──────────────────────────────────────────────
  //  6. 日期字段
  // ──────────────────────────────────────────────
  {
    name: 'get_date_fields',
    description:
      '获取指定索引中所有日期类型（date / date_nanos）字段的列表。用于正确选择时间字段来编写 range 查询，避免误用非日期字段做时间过滤',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index } = params as { index: string }
      const { fieldOptionMap } = useIndexStore()
      const fields = fieldOptionMap[index]
      if (!fields) return { error: `索引 "${index}" 不存在` }
      return fields.filter((f) => f.type === 'date' || f.type === 'date_nanos')
    }
  },

  // ──────────────────────────────────────────────
  //  7. 索引时间范围
  // ──────────────────────────────────────────────
  {
    name: 'get_index_time_range',
    description:
      '通过 min/max 聚合获取指定索引中某个日期字段的最小时间和最大时间范围。用于判断时间条件是否合理、避免查空数据，或在编写 range 查询时选择合适的起止时间',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        },
        field: {
          type: 'string',
          description: '日期字段名称，必须是 date / date_nanos 类型'
        }
      },
      required: ['index', 'field']
    },
    handler: async (params) => {
      const { index, field } = params as { index: string; field: string }
      const err = validateIndex(index)
      if (err) return { error: err }

      return useEsRequestJson({
        method: 'POST',
        url: `/${encodeURIComponent(index)}/_search`,
        data: {
          aggs: {
            min_date: { min: { field } },
            max_date: { max: { field } }
          },
          size: 0
        }
      })
    }
  },

  // ──────────────────────────────────────────────
  //  8. 嵌套 / object 字段
  // ──────────────────────────────────────────────
  {
    name: 'list_nested_fields',
    description:
      '列出指定索引中所有 nested 和 object 类型的字段路径及其子字段名。用于正确处理 nested 查询路径、避免在聚合 / 查询中用错路径写法',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        }
      },
      required: ['index']
    },
    handler: async (params) => {
      const { index } = params as { index: string }
      const { mappingMap } = useIndexStore()
      const mapping = mappingMap.get(index)
      if (!mapping) return { error: `索引 "${index}" 不存在或 mapping 不可用` }

      return collectObjectFields(mapping.properties)
    }
  },

  // ──────────────────────────────────────────────
  //  9. 生成搜索 DSL（不执行，仅返回请求描述供用户审阅后手动执行）
  // ──────────────────────────────────────────────
  {
    name: 'generate_search_dsl',
    description:
      '【核心】根据用户需求生成 Elasticsearch 搜索查询 DSL，返回请求方法、URL 和请求体（不直接执行）。用户审阅确认后可手动发起请求。使用前建议先通过 list_indices / get_index_mapping / sample_docs / get_index_time_range 等工具确认索引和字段信息',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        },
        body: {
          type: 'object',
          description:
            'ES 搜索请求体 JSON，可包含 query、from、size、sort、_source、aggs、post_filter、highlight、collapse 等标准 DSL 字段。注意：query 必须包含一个有效查询子句（如 bool、term、range、match、match_all 等），不要留空'
        },
        method: {
          type: 'string',
          description: 'HTTP 请求方法，默认 POST',
          enum: ['GET', 'POST']
        }
      },
      required: ['index', 'body']
    },
    handler: async (params) => {
      const { index, body, method = 'POST' } = params as {
        index: string
        body: Record<string, unknown>
        method?: string
      }
      const err = validateIndex(index)
      if (err) return { error: err }

      return {
        type: 'dsl',
        label: '搜索查询',
        method: method.toUpperCase(),
        url: `/${encodeURIComponent(index)}/_search`,
        body
      }
    }
  },

  // ──────────────────────────────────────────────
  //  10. 生成聚合 DSL（不执行，仅返回请求描述供用户审阅后手动执行）
  // ──────────────────────────────────────────────
  {
    name: 'generate_aggregation_dsl',
    description:
      '生成 ES 聚合查询 DSL，专门用于数据统计分析场景（如 group by、求均值/最大/最小、日期直方图等）。与 generate_search_dsl 分开可以降低复杂聚合写错的概率。仅返回请求描述，不直接执行。注意：body 中的 query 是可选的过滤条件，不传 query 则统计全部数据',
    parameters: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: '索引名称或别名'
        },
        body: {
          type: 'object',
          description:
            'ES 聚合请求体 JSON，包含 aggs（必须）和可选的 query（过滤条件）、size（默认 0）。示例：{ "query": { ... }, "aggs": { "my_agg": { "terms": { "field": "xxx" } } }, "size": 0 }'
        },
        method: {
          type: 'string',
          description: 'HTTP 请求方法，默认 POST',
          enum: ['GET', 'POST']
        }
      },
      required: ['index', 'body']
    },
    handler: async (params) => {
      const { index, body: rawBody, method = 'POST' } = params as {
        index: string
        body: Record<string, unknown>
        method?: string
      }
      const err = validateIndex(index)
      if (err) return { error: err }

      const body = { ...rawBody }
      if (body.size === undefined) body.size = 0

      return {
        type: 'dsl',
        label: '聚合查询',
        method: method.toUpperCase(),
        url: `/${encodeURIComponent(index)}/_search`,
        body
      }
    }
  }
]
