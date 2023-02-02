import StorageStrategy from "@/strategy/StorageStrategy/StorageStrategy";
import Constant from "@/global/Constant";
import BrowserStorageStrategyImpl from "@/strategy/StorageStrategy/impl/BrowserStorageStrategyImpl";
import UtoolsStorageStrategyImpl from "@/strategy/StorageStrategy/impl/UtoolsStorageStrategyImpl";

class StorageStrategyContext {

    private readonly strategy: StorageStrategy;

    constructor() {
        if (Constant.storage === 'utools') {
            this.strategy = new UtoolsStorageStrategyImpl();
        } else {
            this.strategy = new BrowserStorageStrategyImpl();
        }
    }

    getStrategy(): StorageStrategy {
        return this.strategy;
    }

}

const storageStrategyContext = new StorageStrategyContext();

export default {
    getStorageStrategy(): StorageStrategy {
        return storageStrategyContext.getStrategy();
    }
}