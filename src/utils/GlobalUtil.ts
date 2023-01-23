import {ElMessageBox} from "element-plus";
import ArrayUtil from "@/utils/ArrayUtil";


export function getDefaultLanguage(): string {
    let language = 'zhCn';
    if (localStorage.getItem('language')) {
        let local = localStorage.getItem('language') || "";
        if (ArrayUtil.contains(['zhCn', 'enUs'], local)) {
            language = local;
        }
    }
    return language;
}

async function showTip(): Promise<boolean> {
    try {
        await ElMessageBox.confirm('此操作为危险操作，是否继续？', '危险操作提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        });
        return Promise.resolve(true);
    } catch (e) {
        return Promise.resolve(false);
    }
}