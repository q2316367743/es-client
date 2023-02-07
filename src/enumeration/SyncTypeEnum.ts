enum SyncTypeEnum {

    /**
     * 禁用同步
     */
    DISABLE = 0,

    /**
     * 服务器同步
     * <p>全平台支持</p>
     */
    SERVER = 1,

    /**
     * 文件同步
     * <p>全平台支持</p>
     */
    FILE = 2,

    /**
     * WebDav同步
     * <p>客户端。服务器支持</p>
     */
    WEBDAV = 3,

    /**
     * sftp模式
     * <p>客户端。服务器支持</p>
     */
    SFTP = 4

}

export default SyncTypeEnum;