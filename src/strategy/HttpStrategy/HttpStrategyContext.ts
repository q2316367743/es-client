import Constant from "@/global/Constant";
import HttpStrategy from "./HttpStrategy";
import HttpType from "@/enumeration/HttpType";

// 默认策略
import BrowserHttpStrategy from "@/strategy/HttpStrategy/impl/BrowserHttpStrategy";
import HttpStrategyProxy from "@/strategy/HttpStrategy/HttpStrategyProxy";

class HttpStrategyContext {

    private strategy?: HttpStrategy;

    constructor() {
        this.initStrategy();
    }

    public initStrategy() {
        switch (Constant.mode) {
            case HttpType.BROWSER:
                import('./impl/BrowserHttpStrategy').then((value) => {
                    this.strategy = new HttpStrategyProxy(new value.default());
                });
                break;
            case HttpType.SERVER:
                import('./impl/ServerHttpStrategy').then((value) => {
                    this.strategy = new HttpStrategyProxy(new value.default());
                });
                break;
            case HttpType.DESKTOP:
                import('./impl/TauriHttpStrategy').then((value) => {
                    this.strategy = new HttpStrategyProxy(new value.default());
                });
                break;
            default:
                this.strategy = new HttpStrategyProxy(new BrowserHttpStrategy());
        }
        // 代理
    }


    public getStrategy(): HttpStrategy {
        if (!this.strategy) {
            this.strategy = new HttpStrategyProxy(new BrowserHttpStrategy());
        }
        console.log(this.strategy)
        return this.strategy;
    }

}

export default HttpStrategyContext;