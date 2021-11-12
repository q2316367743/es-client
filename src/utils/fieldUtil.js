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

/**
 * 美化时间
 * @param time 时间戳
 */
export function prettyDate(time, format) {
    let date = new Date(time);
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}