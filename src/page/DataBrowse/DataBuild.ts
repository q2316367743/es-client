import Mapping from "@/view/index/Mapping";
import Properties from "@/view/index/Properties";
import ArrayUtil from "@/utils/ArrayUtil";

/**
 * 数据构造器
 * @param mapping 索引映射
 */
export default function DataBuild(mapping: Mapping): string {
    let data = {} as any;
    let properties = mapping._doc.properties;
    for (let key in properties) {
        buildItem(key, properties[key], data);
    }
    return JSON.stringify(data, null, 4);
}

function buildItem(key: string, properties: Properties, data: any) {
    // 对象类型
    if (properties.properties) {
        data[key] = {};
        // 属于嵌套
        for (let propertiesKey in properties.properties) {
            buildItem(propertiesKey, properties.properties[propertiesKey], data[key]);
        }
        return;
    }
    // 普通类型
    if (properties.type) {
        if (ArrayUtil.contains(['date', 'keyword', 'text'], properties.type)) {
            // 字符串类型
            data[key] = '';
        }else if (ArrayUtil.contains(['long', 'integer', 'short'], properties.type)) {
            // 数值类型
            data[key] = 0;
        }else {
            // 未知类型，设置为字符串
            data[key] = '';
        }
    }
}