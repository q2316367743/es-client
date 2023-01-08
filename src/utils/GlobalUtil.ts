import {ElMessageBox} from "element-plus";

let languages = ['zh', 'en'] as Array<string>;

export function getDefaultLanguage(): string {
    let language = 'zh';
    if (localStorage.getItem('language')) {
        let local = localStorage.getItem('language') || "";
        if (local in languages) {
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