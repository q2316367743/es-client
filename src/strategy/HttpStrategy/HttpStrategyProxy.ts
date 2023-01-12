import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import useUrlStore from "@/store/UrlStore";
import i18n from "@/i18n";
import useSettingStore from "@/store/SettingStore";

export default class HttpStrategyProxy implements HttpStrategy{

    private instance: HttpStrategy;

    constructor(instance: HttpStrategy) {
        this.instance = instance;
    }

    es<T>(config: HttpStrategyConfig): Promise<T> {
        config.baseURL = useUrlStore().current;
        if (!config.baseURL || config.baseURL === '') {
            throw new Error(i18n.global.locale.value == 'zh' ? '请选择链接' : 'please select a link')
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
        return this.instance.es<T>(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        return this.instance.fetch<T>(config);
    }

    native<T>(config: HttpStrategyConfig): Promise<T> {
        return this.instance.native<T>(config);
    }

}