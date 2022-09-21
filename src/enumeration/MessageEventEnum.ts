enum MessageEventEnum {

    /**
     * 索引连接
     */
    INDEX_CONNECT = 'index:connect',

    /**
     * 索引清空
     */
    INDEX_CLEAN = 'index:clean',

    /**
     * 索引刷新，索引不变，索引列表刷新
     */
    INDEX_REFRESH = 'index:refresh',

    /**
     * 页面选择
     */
    PAGE_ACTIVE = 'page:active'

}

export default MessageEventEnum;