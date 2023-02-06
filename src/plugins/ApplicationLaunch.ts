import MessageUtil from "@/utils/MessageUtil";
import {ElLoading} from "element-plus";
import {versionManage} from "@/global/BeanFactory";
import useSettingStore from "@/store/SettingStore";
import useSyncStore from "@/store/SyncSettingStore";
import useServerStore from "@/store/ServerSettingStore";
import LodisStrategyContext from "@/strategy/LodisStrategy/LodisStrategyContext";
import StorageStrategyContext from "@/strategy/StorageStrategy/StorageStrategyContext";
import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";

/**
 * 应用启动器
 */
export default class ApplicationLaunch {

    private ready: boolean = false;
    private readonly launchItems = new Array<(setText?: (text: string) => void) => void>();
    private lodisStrategyContext: LodisStrategyContext;
    private storageStrategyContext: StorageStrategyContext;
    private httpStrategyContext: HttpStrategyContext;

    constructor(
        lodisStrategyContext: LodisStrategyContext,
        storageStrategyContext: StorageStrategyContext,
        httpStrategyContext: HttpStrategyContext
    ) {
        this.lodisStrategyContext = lodisStrategyContext;
        this.storageStrategyContext = storageStrategyContext;
        this.httpStrategyContext = httpStrategyContext;
        // 启动
        this.init().then(() => {
            this.execute();
            this.ready = true;
        });
    }

    private async init(): Promise<void> {
        // 本地存储
        await this.lodisStrategyContext.init();
        versionManage.init();
        useSettingStore().init();
        useSyncStore().init();
        useServerStore().init();
        // 初始化http模式
        await this.httpStrategyContext.init();
        await this.storageStrategyContext.init();
    }

    private execute(): void {
        const loading = ElLoading.service({
            lock: true,
            text: '初始化中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 启动完成
        for (let launchItem of this.launchItems) {
            try {
                launchItem(loading.setText);
            } catch (e) {
                MessageUtil.error('启动项启动错误', e as Error);
                console.error(e);
            }
        }
        loading.close();
    }

    /**
     * 注册启动项
     * @param launchItem 启动项
     */
    register(launchItem: (setText?: (text: string) => void) => void): void {
        this.launchItems.push(launchItem);
        if (this.ready) {
            // 已经启动了
            launchItem();
        }
    }

}