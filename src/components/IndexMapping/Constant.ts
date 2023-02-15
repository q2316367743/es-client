import {SelectOptionData} from "@arco-design/web-vue";

export const typeMap = {
    'type': '数据类型',
    'format': '时间格式化',
    'analyzer': '分词器',
    'normalizer': '分析器',
    'boost': '权重',
    'coerce': '强制类型转换',
    'copy_to': '合并参数',
    // 'properties': '属性',
    'fields': '字段',
    'search_analyzer': '搜索分析器',
    'ignore_above': '忽略超越限制的字段',
    'dynamic': '动态设置',
    'null_value': '空值',
    'index': '索引',
    'doc_values': '文档值',
    'enabled': '开启字段',
    'fielddata': '字段数据',
    'ignore_malformed': '忽略格式不对的数据',
    'include_in_all': '_all 查询包含字段',
    'index_options': '索引设置',
    'norms': '标准信息',
    'position_increment_gap': '短语位置间隙',
    'similarity': '匹配方法',
    'store': '存储',
    'term_vector': '词根信息'
} as Record<string, string>

const typeList = new Array<SelectOptionData>();

for (let key in typeMap) {
    typeList.push({
        label: `${key}-${typeMap[key]}`,
        value: key
    });
}

export const typeAutoData = typeList;

export const allowEditTypes = Object.keys(typeMap).filter(i => (i !== 'properties' && i !== 'fields'));