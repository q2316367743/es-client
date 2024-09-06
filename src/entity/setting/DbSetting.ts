export interface DbSetting {

    /**
     * 是否启用track_total_hits
     */
    enableTrackTotalHits: boolean;

    /**
     * 是否固定ID
     */
    fixId: boolean;

}

export function getDefaultDbSetting(): DbSetting {
    return {
        enableTrackTotalHits: false,
        fixId: true
    }
}
