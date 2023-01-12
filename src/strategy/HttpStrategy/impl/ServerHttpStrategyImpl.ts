import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import useServerStore from "@/store/ServerSettingStore";
import HttpModeUtil from "@/strategy/HttpStrategy/HttpModeUtil";

interface Result<T> {

    success: boolean;

    data: T | string;

}
export default class ServerHttpStrategyImpl implements HttpStrategy {

    es<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetch(config);
    }

    async fetch<T>(config: HttpStrategyConfig): Promise<T> {
        let server = useServerStore().getServer;
        let realConfig = {
            baseURL: server.url,
            url: '/api/fetch',
            method: 'POST',
            headers: {
                ...config.headers,
                token: server.token
            },
            data: config
        } as HttpStrategyConfig
        let fetch = await HttpModeUtil.getHttpMode<T>();
        let result = (await fetch(realConfig)) as Result<T>;
        if (result.success) {
            return Promise.resolve(result.data as T);
        }else {
            return Promise.reject(result.data);
        }
    }

    async native<T>(config: HttpStrategyConfig): Promise<T> {
        let server = useServerStore().getServer;
        let realConfig = {
            baseURL: server.url,
            url: config.url,
            method: config.method,
            headers: {
                ...config.headers,
                token: server.token
            },
            data: config.data
        } as HttpStrategyConfig
        let fetch = await HttpModeUtil.getHttpMode<T>();
        return fetch(realConfig);
    }

}