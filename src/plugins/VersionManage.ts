import Constant from "@/global/Constant";
import useSettingStore from "@/store/SettingStore";
import {layoutMode} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";

export default class VersionManage {

    private readonly currentVersion = Constant.version;
    private storageVersion: string;

    private readonly KEY = 'es-client.version'

    constructor() {
        this.storageVersion = localStorage.getItem(this.KEY) || '';
    }

    /**
     * 检查更新
     * 1：新用户
     * 2：需要更新
     * 3：不需要更新
     */
    public checkUpdate(): number {
        return this.storageVersion === '' ? 1 :  this.currentVersion !== this.storageVersion ? 2 : 3;
    }

    public execUpdate(): void {
        if (this.storageVersion === '') {
            this.init();
        }
        localStorage.setItem(this.KEY, this.currentVersion);
        this.storageVersion = this.currentVersion + '';
    }

    private init() {
        // 第一次使用
        if (Constant.platform === 'utools') {
            // utools默认设置
            useSettingStore().instance.autoFullScreen = true;
            useSettingStore().instance.showTab = false;
            layoutMode.value = LayoutModeEnum.CLASSIC;
        }
    }

}