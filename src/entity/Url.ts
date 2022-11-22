export default interface Url {

    /**
     * ID
     */
    id?: number;

    /**
     * 链接名称
     */
    name?: string;

    /**
     * 链接值
     */
    value?: string;

    /**
     * 排序
     */
    sequence: number;

    /**
     * 创建时间
     */
    create_time?: Date;

    /**
     * 更新时间
     */
    update_time?: Date;

    /**
     * 是否需要认证
     */
    is_auth?: boolean;

    /**
     * 用户名
     */
    auth_user?: string;

    /**
     * 密码
     */
    auth_password?: string;

}