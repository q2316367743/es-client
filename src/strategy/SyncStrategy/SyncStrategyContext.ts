import SyncTypeEnum from "@/enumeration/SyncTypeEnum";
import SyncStrategy from "@/strategy/SyncStrategy/SyncStrategy";
import MessageUtil from "@/utils/MessageUtil";

export default class SyncStrategyContext {

    private readonly strategyMap = new Map<SyncTypeEnum, SyncStrategy>();

    register(type: SyncTypeEnum, strategy: SyncStrategy) {
        this.strategyMap.set(type, strategy);
    }

    getStrategy(type: SyncTypeEnum): SyncStrategy {
        if (type === SyncTypeEnum.DISABLE) {
            MessageUtil.error("备份禁用");
            throw new Error("备份禁用");
        }
        let syncStrategy = this.strategyMap.get(type);
        if (!syncStrategy) {
            MessageUtil.error("未知备份策略");
            throw new Error("未知备份策略");
        }
        return syncStrategy;
    }

}