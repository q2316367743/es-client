/**
 * 数组中是否有以关键字开头的字符
 * @param arr 数组
 * @param keyword 关键字
 * @param ignoreCase 是否忽略大小写，默认不忽略
 */
export function startWith(arr: Array<string>, keyword: string, ignoreCase: boolean = false): boolean {
    for (let item of arr) {
        if (ignoreCase) {
            if (item.toUpperCase().startsWith(keyword.toUpperCase())) {
                return true;
            }
        }else {
            if (item.startsWith(keyword)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 哦按段一个数组中，是否存在关键字
 * @param arr 数组
 * @param keyword 关键字
 */
export function contains<T>(arr: T[], keyword: T): boolean {
    try {
        for (let item of arr) {
            if (item === keyword) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * 将一个数组变为map
 *
 * @param arr 数组
 * @param attrName 获取键，默认为A（指定属性名的的类型）
 * @param attrValue 获取值，默认为T
 * @param merge key冲突合并解决办法
 * @returns map结果
 */
export function map<T extends Record<string, any>, K extends T[A], A extends keyof T, V = T>(
    arr: T[],
    attrName: A | ((item: T) => K),
    attrValue?: (item: T) => V,
    merge?: (item1: V, item2: V) => V): MapWrap<K, V> {
    let result = new MapWrap<K, V>();
    for (let item of arr) {
        let key: K;
        let value: V;
        if (typeof attrName === 'function') {
            key = attrName(item);
        } else {
            key = item[attrName];
        }
        const old = result.get(key);
        if (attrValue) {
            value = attrValue(item);
        } else {
            value = item as any;
        }
        if (old) {
            if (merge) {
                result.set(key, merge(old, value));
            } else {
                throw new Error('未设置合并方法，无法合并相同key');
            }
        } else {
            result.set(key, value);
        }
    }
    return result;
}

/**
 * 讲一个数组变为set
 * @param arr 数组
 * @param attrName 属性名
 */
export function set<T extends S[A], S extends Record<string, any>, A extends keyof S>(arr: S[], attrName: A): Set<T> {
    let result = new Set<T>();
    for (let item of arr) {
        result.add(item[attrName]);
    }
    return result;
}

/**
 * 根据指定属性名对数组进行分组
 *
 * @param arr 数据
 * @param attrName 属性名
 * @returns 分组后的结果
 */
export function group<T extends Record<any, any>, K extends T[A], A extends keyof T>(arr: T[], attrName: A): MapWrap<K, T[]> {
    let result = new MapWrap<K, T[]>();
    for (let item of arr) {
        const key = item[attrName];
        const v = result.get(key) || [];
        v.push(item);
        result.set(key, v);
    }
    return result;
}

/**
 * 根据指定的属性名进行统计数量
 *
 * @param arr 数据
 * @param attrName 属性名
 * @return 属性 -> 数量
 */
export function count<T, K extends keyof T, V extends T[K]>(arr: T[], attrName: K): MapWrap<V, number> {
    let result = new MapWrap<V, number>();
    for (let item of arr) {
        const v = item[attrName] as V;
        result.set(v, result.getOrDefault(v, 0) + 1);
    }
    return result;
}

/**
 * 统计一个数组中，指定属性的值和目标值相等的次数
 * @param arr
 * @param attrName
 * @param value
 */
export function size<T extends Record<string, V>, K extends keyof T, V>(arr: Array<T>, attrName: K, value: V): number {
    try {
        let count = 0;
        for (let t of arr) {
            if (t[attrName] === value) {
                count += 1;
            }
        }
        return count;
    } catch (e) {
        console.error(e);
        return 0;
    }
}


/**
 * 对数组进行去重
 * @param items 数据项
 * @param key 根据的key
 */
export function distinct<T extends Record<string, any>, K extends keyof T>(items: Array<T>, key: K): Array<T> {
    const keys = new Set<T[K]>();
    const results = new Array<T>();
    for (let item of items) {
        if (!keys.has(item[key])) {
            results.push(item);
            keys.add(item[key]);
        }
    }
    return results;
}

/**
 * map增强，主要增加getOrDefault方法
 */
export class MapWrap<K, V> extends Map<K, V> {

    getOrDefault(key: K, defaultValue: V): V {
        return this.get(key) || defaultValue;
    }

}
