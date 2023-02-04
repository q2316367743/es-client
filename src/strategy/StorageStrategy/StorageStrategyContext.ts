import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import Constant from "@/global/Constant";

export default class StorageStrategyContext {

    private strategy?: StorageStrategy;

    async init(): Promise<void> {
        if (Constant.storage === 'utools') {
            let UtoolsStorageStrategyImpl = await import('@/strategy/StorageStrategy/impl/UtoolsStorageStrategyImpl')
            this.strategy = new UtoolsStorageStrategyImpl.default();
            return Promise.resolve();
        } else {
            let BrowserStorageStrategyImpl = await import('@/strategy/StorageStrategy/impl/BrowserStorageStrategyImpl')
            this.strategy = new BrowserStorageStrategyImpl.default();
            return Promise.resolve();
        }
    }

    getStrategy(): StorageStrategy {
        return this.strategy!;
    }

}