import useSyncStore from "@/store/SyncSettingStore";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

/**
 * 同步管理器
 * 1. 指定事件发生后，立即同步
 * 2. 设置定时任务，定时同步
 */
export default class SyncManage {

    constructor() {
        // 设置定时任务
        setTimeout(this.syncAll, 1000 * 60 * 5);
    }

    /**
     * 同步
     */
    syncAll(): void {
        if (this.verification()) {
            this.executeSync();
        }
    }

    private verification(): boolean {
        switch (useSyncStore().getSyncMode) {
            case SyncModeEnum.DISABLE:
            case SyncModeEnum.FILE:
                return false;
            case SyncModeEnum.SERVER:
            case SyncModeEnum.SFTP:
            case SyncModeEnum.WEBDAV:
                return true;
            default:
                return false;
        }

    }

    /**
     * 执行同步
     */
    private executeSync(): void {

    }

}