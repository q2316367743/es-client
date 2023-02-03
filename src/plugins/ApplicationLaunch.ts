import MessageUtil from "@/utils/MessageUtil";
import httpModeUtil from "@/strategy/HttpStrategy/HttpModeUtil";
import {ElLoading} from "element-plus";
import {storageStrategyContext} from "@/global/BeanFactory";

/**
 * 应用启动器
 */
export default class ApplicationLaunch {

    private ready: boolean = false;
    private readonly launchItems = new Array<() => void>();

    constructor() {
        // 启动
        this.init().then(() => {
            this.execute();
            this.ready = true;
        });
    }

    private async init(): Promise<void> {
        // 初始化http模式
        await httpModeUtil.getHttpModeManage().init();
        await storageStrategyContext.init();
    }

    private execute(): void {
        const loading = ElLoading.service({
            lock: true,
            text: '初始化中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 启动完成
        this.launchItems.forEach(item => {
            try {
                item();
            } catch (e) {
                MessageUtil.error('启动项启动错误', e as Error);
                console.error(e);
            }
        });
        loading.close();
    }

    /**
     * 注册启动项
     * @param launchItem 启动项
     */
    register(launchItem: () => void): void {
        this.launchItems.push(launchItem);
        if (this.ready) {
            // 已经启动了
            launchItem();
        }
    }

}