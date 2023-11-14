import Base from "@/entity/Base";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";

export interface Url extends Base {

    /**
     * 链接名称
     */
    name: string;

    /**
     * 链接值
     */
    value: string;

    /**
     * 排序
     */
    sequence: number;
    /**
     * 是否需要认证
     */
    isAuth: boolean;

    /**
     * 认证类型那个，默认Basic认证
     */
    authType: UrlAuthTypeEnum;

    /**
     * 用户名
     */
    authUser: string;

    /**
     * 密码
     */
    authPassword: string;

    /**
     * 版本信息
     */
    version: string;

}

export function getDefaultUrl(source?: Partial<Url>): Url {
    return Object.assign<Url, Partial<Url>>({
        id: 0,
        version: '',
        updateTime: new Date(),
        createTime: new Date(),
        name: '',
        value: 'http://',
        sequence: 0,
        isAuth: false,
        authType: UrlAuthTypeEnum.BASIC as UrlAuthTypeEnum,
        authUser: '',
        authPassword: ''
    }, source || {});
}
