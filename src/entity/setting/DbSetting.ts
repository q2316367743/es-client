export interface DbSetting {

    /**
     * 是否启用track_total_hits
     */
    enableTrackTotalHits: boolean;

}

export function getDefaultDbSetting(): DbSetting {
    return {
        enableTrackTotalHits: false
    }
}
