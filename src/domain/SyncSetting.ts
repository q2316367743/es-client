import SyncTypeEnum from "@/enumeration/SyncTypeEnum";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

/**
 * 同步设置
 */
export default interface SyncSetting {

    /**
     * 同步模式
     */
    type: SyncTypeEnum;

    /**
     * 同步模式
     */
    mode: SyncModeEnum;

}

