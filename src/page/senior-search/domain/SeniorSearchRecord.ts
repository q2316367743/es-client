import {Grammatical} from "@/algorithm/grammaticalAnalysis";

/**
 * 临时记录
 * */
export default interface SeniorSearchRecord extends Grammatical{

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