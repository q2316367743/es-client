import HttpStrategy from "./HttpStrategy";

// 默认策略
import useServerStore from "@/store/ServerSettingStore";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import HttpStrategyProxy from "@/strategy/HttpStrategy/HttpStrategyProxy";

class HttpStrategyContext {

    private strategyMap: Map<ServerModeEnum, HttpStrategy> = new Map<ServerModeEnum, HttpStrategy>();


    register(serverMode: ServerModeEnum, httpStrategy: HttpStrategy) {
        this.strategyMap.set(serverMode, new HttpStrategyProxy(httpStrategy));
    }

    public getStrategy(): HttpStrategy {
        let httpStrategy = this.strategyMap.get(useServerStore().getServerMode);
        if (!httpStrategy) {
            throw new Error("服务器模式异常，请正确的设置服务器模式");
        }
        return httpStrategy;
    }

}

export default HttpStrategyContext;