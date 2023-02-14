import VersionStrategy from "@/strategy/VersionStrategy/VersionStrategy";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default class VersionStrategyContext {

    private version:string = '';
    private readonly strategies = new Array<VersionStrategy>();
    private strategy?: VersionStrategy;

    setVersion(version: string) {
        this.version = version;
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
            this.chooseVersion();
            throw new Error("无法获取版本")
        }
        return this.strategy;
    }

}