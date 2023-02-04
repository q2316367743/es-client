import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";

class HttpModeManage {
    private fetch?: (config: HttpStrategyConfig) => Promise<any>;

    async init() {
        if (Constant.mode === HttpTypeEnum.BROWSER) {
            let fetchPacking = await import('./mode/BrowserMode');
            this.fetch = fetchPacking.default<any>;
        } else if (Constant.mode === HttpTypeEnum.DESKTOP) {
            let fetchPacking = await import('./mode/TauriMode');
            this.fetch = fetchPacking.default<any>;
        } else {
            let fetchPacking = await import('./mode/BrowserMode');
            this.fetch = fetchPacking.default<any>;
        }
    }

    getFetch(): (config: HttpStrategyConfig) => Promise<any> {
        return this.fetch!;
    }
}

const httpModeManage = new HttpModeManage();


export default {
    getHttpModeManage(): HttpModeManage {
        return httpModeManage;
    },
    async getHttpMode<T>(): Promise<(config: HttpStrategyConfig) => Promise<T>> {
        return httpModeManage.getFetch();
    }
}