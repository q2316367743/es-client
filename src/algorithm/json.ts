import JSONBig from "json-bigint";

// TODO: 替换
/**
 * JSON解析，将字符串解析为对象
 * @param data
 * @deprecated parseJsonWithBigIntSupport
 */
export function jsonParse<T = any>(data: string): T {
  return JSONBig.parse(data, (_key, value) => {
    try {
      if (typeof value === 'object') {
        if (value.constructor) {
          // 存在构造器，是个类
          if (value.constructor.name == 'BigNumber2') {
            return value.toString();
          } else if (value.constructor.name == 'BigNumber') {
            return value.toString();
          } else if (value.constructor.name == 'Array') {
            return value;
          } else {
            // 尝试解决数据异常问题
            return `${value}`;
          }
        }
      }
    } catch (e) {
      return value;
    }
    return value;
  })
}


// TODO: 替换
/**
 * @deprecated
 * @param json
 */
export function jsonFormat(json: string | object): string {
  return JSON.stringify(typeof json === 'string' ? jsonParse(json) : json, null, 4);

}
