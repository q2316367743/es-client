import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import Constant from "@/global/Constant";
import HttpTypeEnum from "@/enumeration/HttpTypeEnum";

class HttpModeManage {
    private fetch?: (config: HttpStrategyConfig) => Promise<any>;

    constructor() {
        this.init().then(() => console.log('http模式获取成功', Constant.mode));
    }

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
    async getHttpMode<T>(): Promise<(config: HttpStrategyConfig) => Promise<T>> {
        return httpModeManage.getFetch();
    }
}