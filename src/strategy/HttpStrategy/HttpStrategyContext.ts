import Constant from "@/global/Constant";
import HttpStrategy from "./HttpStrategy";
import BrowserHttpStrategy from "./impl/BrowserHttpStrategy";

class HttpStrategyContext {

    private readonly strategyMap = new Map<string, HttpStrategy>();
    private static readonly instance: HttpStrategyContext = new HttpStrategyContext();
    
    private constructor() {}

    
    public static getInstance(): HttpStrategyContext {
        return this.instance;
    }

    public register(type: string, strategy: HttpStrategy) {
        this.strategyMap.set(type, strategy);
    }

    public getStrategy(): HttpStrategy {
        let strategy = this.strategyMap.get(Constant.platform);
        if (!strategy) {
            return this.strategyMap.get('browser')!;
        }
        return strategy;
    }

}

const httpStrategyContext = HttpStrategyContext.getInstance();

httpStrategyContext.register('browser', new BrowserHttpStrategy());

export default httpStrategyContext;