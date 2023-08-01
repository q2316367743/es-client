import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

import ClusterApi from "@/api/ClusterApi";
import Optional from "@/utils/Optional";
import useNotificationStore from "@/store/NotificationStore";
import useUrlStore from "@/store/UrlStore";
import { urlService } from "@/global/BeanFactory";
import V7VersionStrategyImpl from "@/strategy/VersionStrategy/impl/V7VersionStrategyImpl";

export default class VersionStrategyContext {

    private version: string = '';
    private readonly strategies = new Array<VersionStrategy>();
    private strategy?: VersionStrategy;

    setVersion() {
        this.version = useUrlStore().url?.version!;
        if (this.version === undefined || this.version === '') {
            // 自动获取版本
            ClusterApi.info()
                .then(info => {
                    // 异步执行就可以
                    this.version = Optional.ofNullable(info)
                        .map(e => e.version)
                        .map(e => e.number)
                        .orElse('');
                    // 匹配当前版本
                    if (this.chooseVersion()) {
                        MessageBoxUtil.prompt("无法获取当前版本，请手动输入版本信息，不输入将采用7.6.0版本策略", "版本获取错误", {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(value => {
                            this.version = value;
                            if (this.chooseVersion()) {
                                this.inputVersion();
                            }
                        }).catch(() => {
                            this.version = '7.6.0';
                            this.chooseVersion();
                        });
                    }
                })
                .catch(e => useNotificationStore().send(e.toString(), '获取elasticsearch版本失败'));
            return;
        }
        // 匹配当前版本
        if (this.chooseVersion()) {
            MessageBoxUtil.prompt("无法获取当前版本，请手动输入版本信息，不输入将采用7.6.0版本策略", "版本获取错误", {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(value => {
                this.version = value;
                if (this.chooseVersion()) {
                    this.inputVersion();
                }
            }).catch(() => {
                this.version = '7.6.0';
                this.chooseVersion();
            });
        }
    }

    private inputVersion() {
        MessageBoxUtil.prompt("此版本系统，不存在，请重新输入相近版本，不输入将采用7.6.0版本策略", "版本获取错误", {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(value => {
            this.version = value;
            if (this.chooseVersion()) {
                this.inputVersion();
            }
        }).catch(() => {
            this.version = '7.6.0';
            this.chooseVersion();
        });
    }

    private chooseVersion(): boolean {
        for (let strategy of this.strategies) {
            if (this.version.match(strategy.getVersionExp())) {
                this.strategy = strategy;
                // 重新更新url
                urlService.updateVersionById(useUrlStore().id!, this.version);
                return false;
            }
        }
        return true;
    }

    register(strategy: VersionStrategy) {
        this.strategies.push(strategy);
    }

    getStrategy(): VersionStrategy {
        if (!this.strategy) {
            return new V7VersionStrategyImpl();
        }
        return this.strategy;
    }

}
