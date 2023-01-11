import SyncModeEnum from "@/enumeration/SyncModeEnum";

/**
 * 同步设置
 */
export default interface SyncSetting {

    /**
     * 同步模式
     */
    mode: SyncModeEnum;

    /**
     * server设置
     */
    server: SyncByServer;

}


interface SyncByServer {

    url: string;

    token: string;

}