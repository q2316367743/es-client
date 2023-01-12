import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";

/**
 * HTTP策略
 */
export default interface HttpStrategy {

    /**
     * 针对es的封装
     * @param config 配置项
     */
    es<T>(config: HttpStrategyConfig): Promise<T>;

    /**
     * 基础fetch
     * @param config 配置项
     */
    fetch<T>(config: HttpStrategyConfig): Promise<T>;

    /**
     * 原生模式
     *
     * @param config 配置项
     */
    native<T>(config: HttpStrategyConfig): Promise<T>;

}