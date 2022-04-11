import Strategy from "./Strategy";
import StrategyTypeEnum from '../enumeration/StrategyTypeEnum'

import DefaultStrategyImpl from './impl/DefaultStrategyImpl'
import DocStrategyImpl from "./impl/DocStrategyImpl";
import NewStrategyImpl from './impl/NewStrategyImpl';
import SearchStrategyImpl from "./impl/SearchStrategyImpl";

/**
 * 策略上下文
 */
class StrategyContext {

    private strategyMap = new Map<String, Strategy>();
    private static instance = new StrategyContext();

    private constructor(){}

    public static getInstance(): StrategyContext {
        return this.instance;
    }

    public register(name: string, strategy: Strategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(name: string): Strategy {
        let strategy = this.strategyMap.get(name);
        if (!strategy) {
            return this.strategyMap.get(StrategyTypeEnum.DEFAULT)!;
        }
        return strategy;
    }

}

const strategyContext = StrategyContext.getInstance();

strategyContext.register(StrategyTypeEnum.DEFAULT, new DefaultStrategyImpl());
strategyContext.register(StrategyTypeEnum.ADD, new DocStrategyImpl());
strategyContext.register(StrategyTypeEnum.NEW, new NewStrategyImpl());
strategyContext.register(StrategyTypeEnum.SEARCH, new SearchStrategyImpl());

export default strategyContext; 