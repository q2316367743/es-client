import {Request} from "@/page/SeniorSearch/build/RequestBuild";

/**
 * 临时记录
 * */
export default interface SeniorSearchRecord extends Request{

    /**
     * 是否成功
     */
    success: boolean;

    /**
     * 请求时间
     */
    date: Date;

    /**
     * 耗时
     */
    time: number;

}