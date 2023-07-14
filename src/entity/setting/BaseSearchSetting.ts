import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

export default interface BaseSearchSetting {

    /**
     * 默认参数
     */
    defaultParams: string;

    /**
     * 是否启用track_total_hits
     */
    enableTrackTotalHits: boolean;

    /**
     * track_total_hits
     */
    trackTotalHits: boolean;

    /**
     * 默认视图
     */
    defaultView: ViewTypeEnum;

}
