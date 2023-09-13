import Constant from "@/global/Constant";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";

export default class VersionManage {

    private readonly currentVersion = Constant.version;
    private storageVersion?: string;
    private status: number = 2;

    async init() {
        this.storageVersion = await getItemByDefault(LocalNameEnum.KEY_VERSION, '');
        if (this.storageVersion === '') {
            this.status = 1;
        } else if (this.currentVersion === this.storageVersion) {
            this.status = 3;
        }
        return Promise.resolve();
    }

    /**
     * 检查更新（基础）
     * 1：新用户
     * 2：需要更新
     * 3：不需要更新
     */
    public checkBasicUpdate(): number {
        return this.status;
    }

    public async execUpdate(): Promise<void> {
        if (this.status === 3) {
            console.log("已是最新版")
            return Promise.resolve();
        }
        // 更新数据
        setItem(LocalNameEnum.KEY_VERSION, this.currentVersion);
        this.storageVersion = this.currentVersion + '';
        this.status = 2;
        return Promise.resolve();
    }


}
