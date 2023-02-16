import Constant from "@/global/Constant";
import useSettingStore from "@/store/SettingStore";
import {lodisStrategyContext, seniorSearchHistoryService} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import useLoadingStore from "@/store/LoadingStore";

export default class VersionManage {

    private readonly currentVersion = Constant.version;
    private storageVersion?: string;
    private status: number = 2;

    async init() {
        this.storageVersion = await lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.VERSION) || '';
        if (this.storageVersion === '') {
            this.status = 1;
        } else if (this.currentVersion === this.storageVersion) {
            this.status = 3;
        }
        return Promise.resolve();
    }

    /**
     * 检查更新
     * 1：新用户
     * 2：需要更新
     * 3：不需要更新
     */
    public checkUpdate(): number {
        return this.status;
    }

    public async execUpdate(): Promise<void> {
        if (this.status === 3) {
            console.log("已是最新版")
            return Promise.resolve();
        }
        if (this.storageVersion === '') {
            this.first();
        } else if (this.storageVersion === '2.4.0') {
            await this.update240();
        }
        // 更新数据
        await lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.VERSION, this.currentVersion);
        this.storageVersion = this.currentVersion + '';
        this.status = 2;
        return Promise.resolve();
    }

    private first() {
        // 第一次使用
        if (Constant.platform === 'utools') {
            // utools默认设置
            useSettingStore().instance.autoFullScreen = true;
            useSettingStore().instance.showTab = false;
            useSettingStore().sync();
            lodisStrategyContext.getStrategy().set(LocalStorageKeyEnum.VERSION, LayoutModeEnum.CLASSIC)
                .then(() => console.log('设置默认布局方式'));
            document.body.setAttribute('layout-mode', LayoutModeEnum.CLASSIC);
        }
    }

    private async update240() {
        useLoadingStore().setText("2.4.0版本更新 - 高级查询历史记录迁移");
        // 历史记录迁移
        let records = await seniorSearchHistoryService.list()
        for (let record of records) {
            if (!record.body) {
                // @ts-ignore
                record.body = `${record.method} ${record.link}\n${record.params}`;
                // @ts-ignore
                delete record.method
                // @ts-ignore
                delete record.link
                // @ts-ignore
                delete record.params
                await seniorSearchHistoryService.update(record);
            }
        }
        useLoadingStore().setText("2.4.0版本更新 - 服务器模式升级");
    }

}