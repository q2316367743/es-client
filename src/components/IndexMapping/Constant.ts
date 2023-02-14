import {SelectOptionData} from "@arco-design/web-vue";

export const typeMap = {
    'type': '数据类型',
    'format': '时间格式化',
    'analyzer': '分词器',
    'normalizer': '分析器',
    'boost': '权重',
    'coerce': '时间格式化',
    'copy_to': '合并参数',
    'properties': '属性',
    'fields': '字段',
    'search_analyzer': '搜索分析器',
    'ignore_above': '忽略超越限制的字段',
    'dynamic': '动态设置',
    'null_value': '空值',
    'index': '索引'
} as Record<string, string>

const typeList = new Array<SelectOptionData>();

for (let key in typeMap) {
    typeList.push({
        label: `${key}-${typeMap[key]}`,
        value: key
    });
}

export const typeAutoData = typeList;

export const allowEditTypes = ['type', 'format', 'analyzer', 'normalizer', 'dynamic', 'null_value', 'index',
    'boost', 'coerce', 'copy_to', 'search_analyzer', 'ignore_above'];