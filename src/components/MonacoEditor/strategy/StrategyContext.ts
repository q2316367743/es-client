import Strategy from "./Strategy";
import StrategyType from './StrategyType'

import DocStrategy from "./DocStrategy";
import SearchStrategy from "./SearchStrategy";

/**
 * 策略上下文
 */
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

StrategyContext.register(StrategyType.ADD, new DocStrategy());
StrategyContext.register(StrategyType.SEARCH, new SearchStrategy());

export default StrategyContext; 