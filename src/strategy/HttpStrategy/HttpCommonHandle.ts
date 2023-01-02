import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import useUrlStore from "@/store/UrlStore";
import i18n from "@/i18n";
import useSettingStore from "@/store/SettingStore";

export default function HttpCommonHandle(config: HttpStrategyConfig): HttpStrategyConfig {
// 基础链接每次动态取值
    config.baseURL = useUrlStore().current;
    if (!config.baseURL || config.baseURL === '') {
        throw new Error(i18n.global.locale.value == 'zh' ? '请选择链接' : 'please select a link')
    }
    // 如果有密码应该追加密码
    let url = useUrlStore().url;
    if (url && url.is_auth && url.auth_user && url.auth_password) {
        config.auth = {
            username: url.auth_user,
            password: url.auth_password
        }
    }
    // 设置超时时间
    config.timeout = useSettingStore().getTimeout
    return config;
}