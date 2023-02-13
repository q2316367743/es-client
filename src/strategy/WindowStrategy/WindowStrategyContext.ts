import Constant from "@/global/Constant";
import WindowStrategy from "@/strategy/WindowStrategy/WindowStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class WindowStrategyContext {

    private strategy?: WindowStrategy;

    async init(): Promise<void> {
        if (Constant.platform === 'ts') {
            let strategy = await import('./impl/TsbWindowStrategyImpl');
            this.strategy = new strategy.default();
        } else if (Constant.platform === 'utools') {
            let strategy = await import('./impl/UtoolsWindowStrategyImpl');
            this.strategy = new strategy.default();
        } else if (Constant.mode === 'desktop') {
            let strategy = await import('./impl/TauriWindowStrategyImpl');
            this.strategy = new strategy.default();
        } else {
            let strategy = await import('./impl/BrowserWindowStrategyImpl');
            this.strategy = new strategy.default();
        }
        return Promise.resolve();
    }

    getStrategy(): WindowStrategy {
        if (!this.strategy) {
            MessageUtil.error('窗口策略初始化失败，策略无法获取');
            throw new Error('策略不存在');
        }
        return this.strategy;
    }

}