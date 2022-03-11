import AbstractStrategy from "./AbstractStrategy";

class StrategyContext {

    private static strategyMap = new Map<String, AbstractStrategy>();

    public static register(name: string, strategy: AbstractStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public static getStrategy(name: string): AbstractStrategy {
        let strategy = this.strategyMap.get(name);
        if (!strategy) {
            throw new Error('策略不存在');
        }
        return strategy;
    }

}

export default StrategyContext; 