import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/MessageUtil";

export default class NativeStrategyContext {

    private strategy?: NativeStrategy;

    constructor() {
        this.init().then(() => console.log('原生策略初始化成功'));
    }

    private async init(): Promise<void> {
        let strategy;
        if (Constant.platform === 'utools') {
            strategy = await import('./impl/UtoolsNativeStrategyImpl');
        } else if (Constant.mode === 'desktop') {
            strategy = await import('./impl/TauriNativeStrategyImpl');
        } else {
            strategy = await import('./impl/BrowserNativeStrategyImpl');
        }
        this.strategy = new strategy.default();
    }

    getStrategy(): NativeStrategy {
        if (!this.strategy) {
            MessageUtil.error('原生策略初始化失败');
            throw new Error('原生策略初始化失败');
        }
        return this.strategy;
    }

}