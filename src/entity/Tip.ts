import { Method } from "axios";

export default interface Tip {

    /**
     * 唯一主键
     */
    id?: number;

    /**
     * 请求方式：GET，POST，PUT，DELETE，*
     */
    method: string;

    /**
     * 链接
     */
    link: string;

    /**
     * 链接处理方式：1：等于，2：包含
     */
    mode: number;

    /**
     * 创建时间
     */
    create_time?: Date;

    /**
     * 更新时间
     */
    update_time?: Date;

}