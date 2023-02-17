import Constant from "@/global/Constant";
import useSettingStore from "@/store/SettingStore";
import {
    httpStrategyContext,
    lodisStrategyContext,
    nativeStrategyContext,
    seniorSearchHistoryService
} from "@/global/BeanFactory";
import LayoutModeEnum from "@/enumeration/LayoutModeEnum";
import LocalStorageKeyEnum from "@/enumeration/LocalStorageKeyEnum";
import useLoadingStore from "@/store/LoadingStore";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import Optional from "@/utils/Optional";
import BrowserUtil from "@/utils/BrowserUtil";
import {Log} from "@/view/Data";
import NotificationUtil from "@/utils/NotificationUtil";

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
     * 检查更新（基础）
     * 1：新用户
     * 2：需要更新
     * 3：不需要更新
     */
    public checkBasicUpdate(): number {
        return this.status;
    }

    /**
     * 检测客户端更新
     */
    public checkDesktopUpdate(show: boolean = false): void {
        if (Constant.mode === 'desktop') {
            httpStrategyContext.getStrategy().fetch<Log>({
                url: Constant.updater,
                method: 'GET',
                responseType: "json"
            }).then(content => {
                console.log(content);
                console.log(Constant.sign, content.sign)
                if (content.sign > Constant.sign) {
                    // 存在更新
                    NotificationUtil.confirm(
                        `检测到新版本【${content.version}】，当前版本【${Constant.version}】，请前往gitee或网盘中下载安装包更新。`,
                        "版本更新",
                        {
                            confirmButtonText: "前往下载",
                            cancelButtonText: "取消"
                        }).then(() => {
                            nativeStrategyContext.getStrategy().openLink(Constant.repositories[0].url);
                    })
                }else {
                    if (show) {
                        MessageUtil.info("当前已是最新版本");
                    }
                }
            })
        }
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
        } else if (this.storageVersion === '2.5.0') {
            await this.update250();
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

    private async update250() {
        MessageUtil.info("此次更新可能导致设置信息丢失，请注意保存");
        lodisStrategyContext.getStrategy().get(LocalStorageKeyEnum.SETTING).then(content => {
            let json = Optional.ofNullable(content).orElse("{}");
            MessageBoxUtil.alert(`设置信息：\n${json}`, "设置信息", {
                confirmButtonText: "复制到剪切板"
            }).then(() => {
                BrowserUtil.copy(json);
            })
        })
    }

}