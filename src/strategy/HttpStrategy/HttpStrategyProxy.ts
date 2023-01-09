import HttpStrategy from "@/strategy/HttpStrategy/HttpStrategy";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import {esHandle, serverHandle} from "@/strategy/HttpStrategy/HttpCommonHandle";

export default class HttpStrategyProxy implements HttpStrategy{

    private instance: HttpStrategy;

    constructor(instance: HttpStrategy) {
        this.instance = instance;
    }

    es<T>(config: HttpStrategyConfig): Promise<T> {
        esHandle(config);
        return this.instance.es<T>(config);
    }

    fetch<T>(config: HttpStrategyConfig): Promise<T> {
        return this.instance.fetch<T>(config);
    }

    server<T>(config: HttpStrategyConfig): Promise<T> {
        serverHandle(config);
        return this.instance.server<T>(config);
    }

}