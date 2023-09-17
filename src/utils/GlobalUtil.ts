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
