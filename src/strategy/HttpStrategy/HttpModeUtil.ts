import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";

let fetch: (config: HttpStrategyConfig) => Promise<any>;

if (Constant.mode === HttpTypeEnum.BROWSER) {
    let fetchPacking = await import('./mode/BrowserMode');
    fetch = fetchPacking.default<any>;
} else if (Constant.mode === HttpTypeEnum.SERVER) {
    let fetchPacking = await import('./mode/TauriMode');
    fetch = fetchPacking.default<any>;
} else {
    let fetchPacking = await import('./mode/BrowserMode');
    fetch = fetchPacking.default<any>;
}


export default {
    async getHttpMode<T>(): Promise<(config: HttpStrategyConfig) => Promise<T>> {
        return fetch;
    }
}