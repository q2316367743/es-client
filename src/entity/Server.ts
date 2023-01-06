import ServerModeEnum from "@/enumeration/ServerModeEnum";

/**
 * 服务器
 */
export default interface Server {

    /**
     * 模式
     */
    mode: ServerModeEnum;

    /**
     * url地址
     */
    url: string;

    /**
     * token
     */
    token: string;

}