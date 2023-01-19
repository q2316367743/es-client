import SyncModeEnum from "@/enumeration/SyncModeEnum";
import SyncStrategy from "@/strategy/SyncStrategy/SyncStrategy";

class SyncStrategyContext {

    private static readonly instance = new SyncStrategyContext();
    private readonly strategyMap = new Map<SyncModeEnum, SyncStrategy>();

    private constructor() {
    }

    public static getInstance() {
        return this.instance;
    }

    register(mode: SyncModeEnum, strategy: SyncStrategy) {
        this.strategyMap.set(mode, strategy);
    }

    getStrategy(mode: SyncModeEnum): SyncStrategy | undefined {
        return this.strategyMap.get(mode);
    }

}

export default SyncStrategyContext;