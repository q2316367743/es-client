/**
 * 在数组中匹配关键字，关键字拆分
 *
 * @param arr 列表
 * @param keyword 关键字
 *
 * @return 匹配的数组
 */
export function match(arr: Array<string>, keyword: string): Array<string> {
    let records = new Array<string>(arr.length);
    for (let item of arr) {
        if (stringContain(item, keyword)) {
            records.push(item)
        }
    }
    return records;
}

/**
 * 字符串是否包含指定字符
 * @param template 模板
 * @param keyword 关键字
 * @param toLow 是否大小写敏感，默认不敏感
 *
 * @return 是否包含
 */
export function stringContain(template: string, keyword: string, toLow: boolean = false): boolean {
    if (!keyword || keyword == '') {
        return true;
    }
    for (let i = 0; i < keyword.length; i++) {
        let isContain = false;
        for (let j = 0; j < template.length; j++) {
            if (keyword.charAt(i) === template.charAt(j)) {
                isContain = true;
                break;
            }
        }
        if (!isContain) {
            // 存在不包含的
            return false;
        }
    }
    return true;
}