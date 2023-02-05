import HttpStrategy from "./HttpStrategy";

// 默认策略
import useServerStore from "@/store/ServerSettingStore";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import HttpStrategyProxy from "@/strategy/HttpStrategy/HttpStrategyProxy";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";

export default class HttpStrategyContext {

    private strategy?: HttpStrategy;

    async init() {
        if (Constant.mode === HttpTypeEnum.BROWSER) {
            let fetchPacking = await import('./mode/BrowserMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else if (Constant.mode === HttpTypeEnum.DESKTOP) {
            let fetchPacking = await import('./mode/TauriMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else if (Constant.mode === HttpTypeEnum.SERVER) {
            let fetchPacking = await import('./mode/ServerMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        } else {
            let fetchPacking = await import('./mode/BrowserMode');
            this.strategy = new HttpStrategyProxy(fetchPacking.default<any>);
        }
    }

    getStrategy(): HttpStrategy {
        return this.strategy!;
    }

}