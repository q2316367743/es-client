import {contains} from "@/utils/ArrayUtil";
import {Mapping, Property} from "@/domain/es/IndexBase";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";
import {formatJsonString} from "@/algorithm/file";

/**
 * 数据构造器
 * @param mapping 索引映射
 * @todo 此处可能需要使用新的算法
 */
export default function DataBuild(mapping: Mapping): string {
  try {
    let data = {} as any;
    // @ts-ignore
    if (!mapping || !mapping._doc || !mapping._doc.properties) {
      return '{}';
    }
    // @ts-ignore
    let properties = mapping._doc.properties;
    for (let key in properties) {
      buildItem(key, properties[key], data);
    }
    return formatJsonString(stringifyJsonWithBigIntSupport(data));
  } catch (ignore) {
    return '{}';
  }
}

function buildItem(key: string, properties: Property, data: any) {
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
    if (contains(['date', 'keyword', 'text'], properties.type)) {
      // 字符串类型
      data[key] = '';
    } else if (contains(['long', 'integer', 'short'], properties.type)) {
      // 数值类型
      data[key] = 0;
    } else {
      // 未知类型，设置为字符串
      data[key] = '';
    }
  }
}
