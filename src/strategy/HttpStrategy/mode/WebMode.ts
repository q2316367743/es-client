import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import {applicationLaunch, nativeStrategyContext} from "@/global/BeanFactory";
import Optional from "@/utils/Optional";
import HttpStrategyError from "@/strategy/HttpStrategy/HttpStrategyError";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {getUrl} from "@/strategy/HttpStrategy/HttpModeUtil";

export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    // 判断是否可以
    applicationLaunch.register(() => {
        // @ts-ignore
        if (!window.esClientApi) {
            MessageBoxUtil.alert(
                "检测到您未安装插件，请安装插件后使用",
                "警告", {
                    confirmButtonText: "安装"
                }).then(() => {
                    nativeStrategyContext.getStrategy().openLink("https://es-client.esion.xyz/docs/install/web")
            });
        }
        return Promise.resolve();
    })
    return new Promise<T>((resolve, reject) => {
        // 重构URL
        config.url = getUrl(config.baseURL, config.url);
        // @ts-ignore
        if (window.esClientApi) {
            // @ts-ignore
            window.esClientApi.fetch(config).then(response => {
                if (response.ok) {
                    resolve(response.data);
                } else {
                    console.error(response)
                    reject({
                        code: response.status,
                        // response.data.error.reason
                        reason: Optional.ofNullable(response)
                            .attr("data")
                            .attr("error")
                            .attr("reason")
                            .orElse(""),
                        data: response.data
                    } as HttpStrategyError)
                }
            }).catch((reason: any) => {
                console.error(reason)
                reject({
                    code: 0,
                    reason: '系统异常',
                    data: reason
                } as HttpStrategyError)
            });
        }
    });
}