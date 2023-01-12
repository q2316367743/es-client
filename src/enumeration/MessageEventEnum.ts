enum MessageEventEnum {

    // 事件

    /**
     * 链接更新
     */
    URL_UPDATE = 'event:url:update',

    /**
     * 索引连接 - 已更新
     */
    INDEX_CONNECT = 'event:index:connect',

    /**
     * 索引清空
     */
    INDEX_CLEAN = 'event:index:clean',

    /**
     * 索引刷新，索引不变，索引列表刷新
     */
    INDEX_REFRESH = 'event:index:refresh',

    /**
     * 主题变更
     */
    SYSTEM_THEME = 'event:system:theme',

    /**
     * 临时记录更新
     */
    TEMP_RECORD_UPDATE = 'event:temp:record:update',

    /**
     * 历史记录更新
     */
    HISTORY_UPDATE = 'event:history:update',

    // 执行

    /**
     * 页面选择 - 执行页面选择后触发
     */
    PAGE_ACTIVE = 'execute:page:active',

    /**
     * 设置页面切换
     */
    PAGE_SETTING_ACTIVE = 'execute:page:setting:active',

    /**
     * 执行链接刷新
     */
    REFRESH_URL = 'execute:refresh:url'

}

export default MessageEventEnum;