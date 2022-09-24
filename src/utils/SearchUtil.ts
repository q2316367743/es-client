/**
 * 判断模板是否包含关键字
 *
 * @param template 模板
 * @param keyword 关键字
 */
function stringMatch(template: string, keyword: string): boolean {
    for (let i = 0; i < keyword.length; i++) {
        let isMatch = false;
        for (let j = 0; j < template.length; j++) {
            if (keyword.charAt(i) === template.charAt(j)) {
                isMatch = true;
                break;
            }
        }
        if (!isMatch) {
            return false;
        }
    }
    return true;
}

export default {
    /**
     * 从列表匹配包含关键字的数组
     *
     * @param items 数组
     * @param keyword 关键字
     * @param field 字段（如果是对象数组，将使用某个字符串字段）
     */
    match<T, F extends keyof T>(items: Array<T>, keyword: string, field?: F): Array<T> {
        let records = new Array<T>();
        for (let item of items) {
            if (typeof item === 'object') {
                if (!field) {
                    throw new Error('对象数组未提供字段');
                }
                // @ts-ignore
                if (stringMatch(item[field], keyword)) {
                    records.push(item);
                }
            } else {
                if (stringMatch(String(item).toString(), keyword)) {
                    records.push(item);
                }
            }
        }
        return records;
    }
}