import Base from "@/entity/Base";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";

export default interface Url extends Base {

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
    sequence?: number;

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
     * 认证类型那个，默认Basic认证
     */
    authType?: UrlAuthTypeEnum;

    /**
     * 用户名
     */
    authUser?: string;

    /**
     * 密码
     */
    authPassword?: string;

    /**
     * 版本信息
     */
    version?: string;

}