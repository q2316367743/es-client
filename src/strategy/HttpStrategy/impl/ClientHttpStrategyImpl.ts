import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpModeUtil from "@/strategy/HttpStrategy/HttpModeUtil";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";


export default class ClientHttpStrategyImpl implements HttpStrategy {
    es<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetch(config);
    }

    async fetch<T>(config: HttpStrategyConfig): Promise<T> {
        let fetch = await HttpModeUtil.getHttpMode<T>();
        return fetch(config);
    }

    native<T>(config: HttpStrategyConfig): Promise<T> {
        return this.fetch(config);
    }

}