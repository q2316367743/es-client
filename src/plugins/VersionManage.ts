import Constant from "@/global/Constant";
import useSettingStore from "@/store/SettingStore";
import {lodisStrategyContext} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";

export default class VersionManage {

    private readonly currentVersion = Constant.version;
    private storageVersion?: string;

    init() {
        this.storageVersion = lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.VERSION) || '';
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
            this._init();
        }
        lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.VERSION, this.currentVersion);
        this.storageVersion = this.currentVersion + '';
    }

    private _init() {
        // 第一次使用
        if (Constant.platform === 'utools') {
            // utools默认设置
            useSettingStore().instance.autoFullScreen = true;
            useSettingStore().instance.showTab = false;
            useSettingStore().sync();
            lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.VERSION, LayoutModeEnum.CLASSIC);
            document.body.setAttribute('layout-mode', LayoutModeEnum.CLASSIC);
        }
    }

}