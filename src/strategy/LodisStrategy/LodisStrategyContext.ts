import Constant from "@/global/Constant";
import LodisStrategy from "@/strategy/LodisStrategy/LodisStrategy";

export default class LodisStrategyContext {

    private strategy?: LodisStrategy;

    async init(): Promise<void> {
        if (Constant.platform === 'utools') {
            let UtoolsLodisStrategyImpl = await import('@/strategy/LodisStrategy/impl/UtoolsLodisStrategyImpl');
            this.strategy = new UtoolsLodisStrategyImpl.default();
        } else {
            let BrowserLodisStrategyImpl = await import('@/strategy/LodisStrategy/impl/BrowserLodisStrategyImpl');
            this.strategy = new BrowserLodisStrategyImpl.default();
        }
        return Promise.resolve();
    }

    getStrategy(): LodisStrategy {
        return this.strategy!;
    }

}