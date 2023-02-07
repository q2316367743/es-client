import MessageUtil from "@/utils/MessageUtil";
import {ElLoading} from "element-plus";
import {versionManage} from "@/global/BeanFactory";
import useSettingStore from "@/store/SettingStore";
import LodisStrategyContext from "@/strategy/LodisStrategy/LodisStrategyContext";
import StorageStrategyContext from "@/strategy/StorageStrategy/StorageStrategyContext";
import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";

/**
 * 应用启动器
 */
export default class ApplicationLaunch {

    private ready: boolean = false;
    private readonly launchItems = new Array<(setText?: (text: string) => void) => Promise<void>>();
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
        const loading = ElLoading.service({
            lock: true,
            text: '初始化组件中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 启动
        this.init().then(() => {
            this.ready = true;
            this.execute(loading.setText)
                .then(() => console.log("初始化任务执行完成"))
                .finally(() => loading.close());
        });
    }

    private async init(): Promise<void> {
        // 本地存储
        await this.lodisStrategyContext.init();
        versionManage.init();
        useSettingStore().init();
        // 初始化http模式
        await this.httpStrategyContext.init();
        await this.storageStrategyContext.init();
    }

    private async execute(setText: (text: string) => void): Promise<void> {
        setText("初始化任务执行中")
        // 启动完成
        for (let launchItem of this.launchItems) {
            try {
                await launchItem(setText);
            } catch (e) {
                MessageUtil.error('启动项启动错误', e as Error);
                console.error(e);
            }
        }
        return Promise.resolve();
    }

    /**
     * 注册启动项
     * @param launchItem 启动项
     */
    register(launchItem: (setText?: (text: string) => void) => Promise<void>): void {
        this.launchItems.push(launchItem);
        if (this.ready) {
            // 已经启动了
            launchItem().then(() => console.log("应用已启动，任务执行成功"));
        }
    }

}