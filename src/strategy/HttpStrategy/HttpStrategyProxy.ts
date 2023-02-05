import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import useUrlStore from "@/store/UrlStore";
import i18n from "@/i18n";
import useSettingStore from "@/store/SettingStore";

export default class HttpStrategyProxy {

    private readonly fetchSelf: (config: HttpStrategyConfig) => Promise<any>;

    constructor(fetchSelf: (config: HttpStrategyConfig) => Promise<any>) {
        this.fetchSelf = fetchSelf;
    }

    es<T>(config: HttpStrategyConfig): Promise<T> {
        config.baseURL = useUrlStore().current;
        if (!config.baseURL || config.baseURL === '') {
            throw new Error(i18n.global.locale.value == 'zhCn' ? '请选择链接' : 'please select a link')
        }

        // 处理链接
        if (config.baseURL?.endsWith('/')) {
            config.baseURL = config.baseURL?.substring(0, config.baseURL?.length - 1);
        }
        if (config.url.startsWith("/")) {
            config.url = config.url.substring(1, config.url.length);
        }

        // 如果有密码应该追加密码
        let url = useUrlStore().url;
        if (url && url.isAuth && url.authUser && url.authPassword) {
            config.auth = {
                username: url.authUser,
                password: url.authPassword
            }
        }
        // 设置超时时间
        config.timeout = useSettingStore().getTimeout
        return this.fetchSelf(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetchSelf(config);
    }

    native<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetchSelf(config);
    }

}