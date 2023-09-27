import useIndexStore from "@/store/IndexStore";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

/**
 * 条件字符串构造器
 * @param value 值
 * @return 返回条件
 */
export function ConditionStrBuild(value: string): Array<string> {
    const oldStr = buildOldStr(value).trim();
    const newArr = buildNewStr(value);
    if (newArr.length === 0) {
        return [value];
    }
    return oldStr !== '' ? newArr.map(e => oldStr + ',' + e) : newArr;
}

/**
 * 构建旧的字符串
 * @param value 值
 * @return 旧的字符串
 */
function buildOldStr(value: string): string {
    if (value.trim() === '') {
        return '';
    }
    const index = value.lastIndexOf(',');
    if (index > -1) {
        return value.substring(0, index);
    }
    return '';
}

function buildNewStr(value: string): Array<string> {
    if (value.trim() === '') {
        return [];
    }
    let index = useDataBrowseStore().index;
    const fields = useIndexStore().field(index);
    return fields.map(field => {
        let str = field.name;
        if (field.type === 'text' || field.type === 'keyword'
            || field.type === 'date') {
            str += "=''";
        } else {
            str += "="
        }
        return str;
    });
}

function buildNewOrderStr(value: string): Array<string> {
    if (value.trim() === '') {
        return [];
    }
    let index = useDataBrowseStore().index;
    const fields = useIndexStore().field(index);
    return fields.flatMap(field => [field.name + ' asc', field.name + ' desc']);
}

export function OrderByStrBuild(value: string): Array<string> {
    const oldStr = buildOldStr(value).trim();
    const newArr = buildNewOrderStr(value);
    if (newArr.length === 0) {
        return [value];
    }
    return oldStr !== '' ? newArr.map(e => oldStr + ',' + e) : newArr;

}
