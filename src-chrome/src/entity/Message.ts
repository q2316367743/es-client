import MessageTypeEnum from "../enumeration/MessageTypeEnum";

/**
 * 消息
 */
export default interface Message<T> {

    /**
     * 消息类型
     */
    type: MessageTypeEnum;

    /**
     * 参数
     */
    args: T;

}