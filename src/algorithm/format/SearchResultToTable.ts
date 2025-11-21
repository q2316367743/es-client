import { DataSearchResult } from "@/domain/core";
import { parseJsonWithBigIntSupport } from "@/algorithm/format";
import { flattenObject } from "@/algorithm/file";

/**
 * 搜索结果转为表格
 * @param response 搜索结果
 */
export function searchResultToTable(response: string): DataSearchResult {
  const result = parseJsonWithBigIntSupport(response);
  const hits = result.hits.hits || [];

  // 提取所有字段名
  const allFields = new Set<string>();
  allFields.add("_type");
  allFields.add("_score");
  allFields.add("_index");
  hits.forEach((hit: any) => {
    if (hit._source) {
      const extractFields = (obj: any, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            extractFields(obj[key], fullKey);
          } else {
            allFields.add(fullKey);
          }
        });
      };
      extractFields(hit._source);
    }
  });

  // 构建列配置
  const columns = Array.from(allFields).map((field) => ({
    field,
    title: field,
    width: Math.max(field.length * 16, 80),
    ellipsis: true,
    cellClass: "",
    show: true,
    sortable: {
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[]
    }
  }));

  // 构建记录数据
  const records = hits.map((hit: any) => ({
    _id: hit._id,
    _index: hit._index,
    _type: hit._type,
    _score: hit._score,
    _source: JSON.stringify(hit._source, null, 2),
    ...flattenObject(hit._source)
  }));

  return {
    columns,
    records,
    total: result.hits.total.value || result.hits.total,
    source: response
  };
}
