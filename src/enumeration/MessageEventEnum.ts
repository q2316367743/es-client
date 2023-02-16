enum MessageEventEnum {

    // 事件

    /**
     * 链接更新
     */
    URL_UPDATE = 'event:url:update',

    /**
     * 链接刷新
     */
    URL_REFRESH = 'event:url:refresh',

    /**
     * 主题变更
     */
    SYSTEM_THEME = 'event:system:theme',

    /**
     * 临时记录更新
     */
    TEMP_RECORD_UPDATE = 'event:temp:record:update',

    /**
     * 普通查询 - 历史记录更新
     */
    BASE_HISTORY_UPDATE = 'event:history:base:update',

    /**
     * 高级查询 - 历史记录更新
     */
    SENIOR_HISTORY_UPDATE = 'event:history:senior:update',

    /**
     * 编辑器设置更新
     */
    EDITOR_SETTING_UPDATE = 'event:editor:setting:update',

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