import HttpStrategy from "./HttpStrategy";

// 默认策略
import HttpStrategyProxy from "@/strategy/HttpStrategy/HttpStrategyProxy";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";

export default class HttpStrategyContext {

    private strategy?: HttpStrategy;

    async init() {
        let fetchPacking;
        if (Constant.mode === HttpTypeEnum.BROWSER) {
            fetchPacking = await import('./mode/BrowserMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else if (Constant.mode === HttpTypeEnum.UTOOLS) {
            fetchPacking = await import('./mode/UtoolsMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else if (Constant.mode === HttpTypeEnum.DESKTOP) {
            fetchPacking = await import('./mode/TauriMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else if (Constant.mode === HttpTypeEnum.SERVER) {
            fetchPacking = await import('./mode/ServerMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else {
            fetchPacking = await import('./mode/BrowserMode');
        }
        this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
    }

    getStrategy(): HttpStrategy {
        return this.strategy!;
    }

}
