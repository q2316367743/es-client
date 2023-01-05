import Constant from "@/global/Constant";
import HttpStrategy from "./HttpStrategy";
import HttpType from "@/enumeration/HttpType";

// 默认策略
import BrowserHttpStrategy from "@/strategy/HttpStrategy/impl/BrowserHttpStrategy";

class HttpStrategyContext {

    private strategy?: HttpStrategy;
    
    constructor() {
        switch (Constant.mode) {
            case HttpType.BROWSER:
                import('./impl/BrowserHttpStrategy').then((value) => {
                    this.strategy = new value.default();
                });
                break;
            case HttpType.SERVER:
                import('./impl/ServerHttpStrategy').then((value) => {
                    this.strategy = new value.default();
                });
                break;
            case HttpType.DESKTOP:
                import('./impl/TauriHttpStrategy').then((value) => {
                    this.strategy = new value.default();
                });
                break;
            default:
                this.strategy = new BrowserHttpStrategy();
        }
    }

    
    public getStrategy(): HttpStrategy {
        if (!this.strategy) {
            this.strategy = new BrowserHttpStrategy();
        }
        return this.strategy;
    }

}

export default HttpStrategyContext;