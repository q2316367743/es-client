import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";

export default interface HttpStrategy {

    all(config: HttpStrategyConfig): Promise<any>;

}