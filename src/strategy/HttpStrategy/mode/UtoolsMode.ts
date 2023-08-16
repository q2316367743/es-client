
import HttpStrategyConfig from "../HttpStrategyConfig";

import HttpStrategyError from "../HttpStrategyError";
import Optional from "@/utils/Optional";


const instance = window.preload.axios.create();

export default function fetch<T>(config: HttpStrategyConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        instance(config).then((rsp: any) => {
            resolve(rsp.data);
        }).catch((reason: any) => {
            //reason.response.status
            reject({
                code: Optional.ofNullable(reason)
                    .attr('response')
                    .attr('status')
                    .orElse(500),
                reason: Optional.ofNullable(reason)
                    .attr('message')
                    .orElse(''),
                data: Optional.ofNullable(reason)
                    .attr('response')
                    .attr('data')
                    .orElse({})
            } as HttpStrategyError)
        })
    });
}

