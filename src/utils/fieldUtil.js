/**
 * 美化数据单位
 * 
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value) {
    let gb = 1024 * 1024 * 1024.0;
    if (value > gb) {
        let temp = value / gb;
        return temp.toFixed(2) + 'GB';
    }
    let mb = 1024 * 1024.0;
    if (value > mb) {
        let temp = value / mb;
        return temp.toFixed(2) + 'MB';
    }
    let b = 1024.0;
    if (value > b) {
        let temp = value / b;
        return temp.toFixed(2) + 'KB';
    }
    return value + 'B';

}