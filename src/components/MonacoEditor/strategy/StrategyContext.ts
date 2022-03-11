import Strategy from "./Strategy";

import DocStrategy from "./DocStrategy";
import SearchStrategy from "./SearchStrategy";

class StrategyContext {

    private static strategyMap = new Map<String, Strategy>();

    public static register(name: string, strategy: Strategy) {
        this.strategyMap.set(name, strategy);
    }

    public static getStrategy(name: string): Strategy {
        let strategy = this.strategyMap.get(name);
        if (!strategy) {
            throw new Error('【' + name + '】策略不存在');
        }
        return strategy;
    }

}

StrategyContext.register('_doc', new DocStrategy());
StrategyContext.register('_search', new SearchStrategy());

export default StrategyContext; 