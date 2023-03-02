import MessageUtil from "@/utils/MessageUtil";
import {versionManage} from "@/global/BeanFactory";
import useSettingStore from "@/store/SettingStore";
import LodisStrategyContext from "@/strategy/LodisStrategy/LodisStrategyContext";
import StorageStrategyContext from "@/strategy/StorageStrategy/StorageStrategyContext";
import HttpStrategyContext from "@/strategy/HttpStrategy/HttpStrategyContext";
import WindowStrategyContext from "@/strategy/WindowStrategy/WindowStrategyContext";
import useLoadingStore from "@/store/LoadingStore";
import useEditorSettingStore from "@/store/EditorSettingStore";

/**
 * 应用启动器
 */
export default class ApplicationLaunch {

    private ready: boolean = false;
    private readonly launchItems = new Array<() => Promise<void>>();
    private lodisStrategyContext: LodisStrategyContext;
    private storageStrategyContext: StorageStrategyContext;
    private httpStrategyContext: HttpStrategyContext;
    private windowStrategyContext: WindowStrategyContext;

    constructor(
        lodisStrategyContext: LodisStrategyContext,
        storageStrategyContext: StorageStrategyContext,
        httpStrategyContext: HttpStrategyContext,
        windowStrategyContext: WindowStrategyContext
    ) {
        this.lodisStrategyContext = lodisStrategyContext;
        this.storageStrategyContext = storageStrategyContext;
        this.httpStrategyContext = httpStrategyContext;
        this.windowStrategyContext = windowStrategyContext;
    }

    executeInit(): void {
        this.init().then(() => {
            this.ready = true;
            this.execute()
                .then(() => console.log("初始化任务执行完成"))
                .finally(() => useLoadingStore().close());
        });
    }

    private async init(): Promise<void> {
        useLoadingStore().start('初始化组件中')
        // 本地存储
        await this.lodisStrategyContext.init();
        await versionManage.init();
        // 设置初始化
        await useSettingStore().init();
        await useEditorSettingStore().init();
        // 初始化http模式
        await this.httpStrategyContext.init();
        await this.storageStrategyContext.init();
        await this.windowStrategyContext.init();
    }

    private async execute(): Promise<void> {
        useLoadingStore().setText("初始化任务执行中")
        // 启动完成
        for (let launchItem of this.launchItems) {
            try {
                await launchItem();
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
    register(launchItem: () => Promise<void>): void {
        this.launchItems.push(launchItem);
        if (this.ready) {
            // 已经启动了
            launchItem().then(() => console.log("应用已启动，任务执行成功"));
        }
    }

}