import Constant from "@/global/Constant";
import HttpStrategy from "./HttpStrategy";
import BrowserHttpStrategy from "./impl/BrowserHttpStrategy";
import HttpType from "@/enumeration/HttpType";
import ServerHttpStrategy from "@/strategy/HttpStrategy/impl/ServerHttpStrategy";

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
            return this.strategyMap.get(HttpType.BROWSER)!;
        }
        return strategy;
    }

}

const httpStrategyContext = HttpStrategyContext.getInstance();

httpStrategyContext.register(HttpType.BROWSER, new BrowserHttpStrategy());
httpStrategyContext.register(HttpType.SERVER, new ServerHttpStrategy());

export default httpStrategyContext;