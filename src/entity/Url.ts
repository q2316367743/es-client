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
    createTime?: Date;

    /**
     * 更新时间
     */
    updateTime?: Date;

    /**
     * 是否需要认证
     */
    isAuth?: boolean;

    /**
     * 用户名
     */
    authUser?: string;

    /**
     * 密码
     */
    authPassword?: string;

}