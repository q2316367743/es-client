import Param from "@/view/Param";

export default function getParamBuild(params: Array<Param>): any {
    // 去除key为空的
    params = params.filter(e => e.key !== '');
    let result = {} as any;
    for (let param of params) {
        result[param.key] = param.value;
    }
    return result;
}