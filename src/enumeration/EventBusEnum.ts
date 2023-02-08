enum EventBusEnum {

    /**
     * 基础查询事件
     */
    BASE_SEARCH_EVENT = 'base-search-event',

    /**
     * 高级查询事件
     */
    SENIOR_SEARCH_EVENT = 'senior-search-event',

    /**
     * 页面跳转事件
     */
    PAGE_JUMP_EVENT = 'page-jump-event',

    /**
     * APP中发放执行
     */
    URL_SELECT_EVENT = 'url-select',

    /**
     * 链接编辑
     */
    URL_EDIT = 'url-edit',

    /**
     * 索引管理
     */
    INDEX_MANAGE = 'index-manage'

}

export default EventBusEnum;