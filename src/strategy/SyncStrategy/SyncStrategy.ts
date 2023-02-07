import Url from "@/entity/Url";
import BaseSearchHistory from "@/entity/BaseSearchHistory";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";

export default interface SyncStrategy {

    /**
     * 同步
     */
    sync(remoteList?: {
        remoteUrlList: Array<Url>,
        remoteBaseSearchHistoryList: Array<BaseSearchHistory>,
        remoteSeniorSearchHistoryList: Array<SeniorSearchHistory>
    }): Promise<void>;

    /**
     * 备份
     */
    backup(): Promise<void>;

}