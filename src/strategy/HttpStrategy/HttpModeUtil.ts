import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";

export default {
    async getHttpMode<T>(): Promise<(config: HttpStrategyConfig) => Promise<T>> {
        if (Constant.mode === HttpTypeEnum.BROWSER) {
            let fetch = await import('./mode/BrowserMode');
            return fetch.default<T>;
        }else if (Constant.mode === HttpTypeEnum.SERVER) {
            let fetch = await import('./mode/TauriMode');
            return fetch.default<T>;
        }else {
            let fetch = await import('./mode/BrowserMode');
            return fetch.default<T>;
        }
    }
}