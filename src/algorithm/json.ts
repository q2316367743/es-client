import JSONBig from "json-bigint";

/**
 * JSON解析，将字符串解析为对象
 * @param data
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
                    }  else if (value.constructor.name == 'Array') {
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

// 空格数量
const SPACE_COUNT = '    ';

export function jsonFormat(json: string | object): string {
    if(typeof json ==='string') {
        let result = '';
        let indent = 0;
        for (let i = 0; i < json.length; i++) {
            const char = json[i];
            if (char === '{' || char === '[') {
                result += char + '\n' + SPACE_COUNT.repeat(indent + 1);
                indent++;
            } else if (char === '}' || char === ']') {
                indent--;
                result += '\n' + SPACE_COUNT.repeat(indent) + char;
            } else if (char === ',') {
                result += char + '\n' + SPACE_COUNT.repeat(indent);
            } else {
                result += char;
            }
        }
        return result;
    }

    return JSON.stringify(json, null, 4);

}
