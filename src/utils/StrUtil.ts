export default {

    matchAll(str: string, regexes: Array<string>): boolean {
        if (!regexes || regexes.length === 0 || !str || str === '') {
            return false;
        }
        for (let regex of regexes) {
            if (str.match(regex)) {
                return true;
            }
        }
        return false;
    },

    splitAll(str: string, splitChar: string): Array<string> {
        let items = new Array<string>();
        let temp = '';
        for (let item of str) {
            if (item === splitChar) {
                if (temp !== '') {
                    items.push(temp);
                    temp = '';
                }
            }else {
                temp += item;
            }
        }
        return items;
    },

    /**
     * 是否以指定数组中任意一个字符串为开头
     * @param str 字符串
     * @param arr 字符数组
     * @param ignoreCase 是否忽略大小写，默认不忽略
     */
    startWithArr(str: string, arr: Array<string>, ignoreCase: boolean = false): boolean {
        for (let item of arr) {
            if (ignoreCase) {
                if (str.toUpperCase().startsWith(item.toUpperCase())) {
                    return true;
                }
            }else {
                if (str.startsWith(item)) {
                    return true;
                }
            }
        }
        return false;
    }

}