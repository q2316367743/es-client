import Constant from "@/global/Constant";
import {http} from "@/plugins/native/axios";
import {generateUUID} from "@/utils/BrowserUtil";
import {getItem, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export type EventIdentificationEnum = 'update' | 'page_jump' | 'es_version' |
    'func_data_browser' | 'func_base_search' | 'func_senior_search' |
    'func_dashboard';


export class Statistics {

    private readonly nickname: string = '未知用户';
    private readonly profileId: string;
    private token: string = '';
    private expired: number = 0;

    constructor() {
        let user = utools.getUser();
        if (user) {
            this.nickname = user.nickname;
        }

        let token = getItem<string>(LocalNameEnum.KEY_TOKEN);
        if (!token) {
            token = generateUUID();
            setItem(LocalNameEnum.KEY_TOKEN, token);
        }
        this.profileId = token;
    }

    login() {
        window.TDAPP.login({
            profileId: this.profileId,
            profileType: 1,
            name: this.nickname
        })
    }

    register() {
        window.TDAPP.register({
            profileId: this.token,
            profileType: 1,
            name: this.nickname
        })
    }

    /**
     * 访问某个标签
     * @param event 操作
     * @param additional 附加
     */
    access(event: EventIdentificationEnum, additional?: string) {
        this.track(event, additional ? {
            additional: additional
        } : undefined);
    }

    /**
     * 时间埋点
     * @param event 操作
     * @param params 附加参数
     */
    track(event: EventIdentificationEnum, params?: Record<string, string>) {
        if (utools.isDev()) {
            return;
        }
        let system;
        if (utools.isWindows()) {
            system = "Windows";
        } else if (utools.isMacOS()) {
            system = "MacOS"
        } else if (utools.isLinux()) {
            system = "Linux"
        } else {
            system = navigator.userAgent;
        }
        try {
            // window.LA.track(event, {
            //     ...(params || {}),
            //     // 操作系统
            //     system,
            //     // 当前用户
            //     nickname: this.nickname,
            //     // 发行版
            //     platform: Constant.mode,
            //     // 使用的版本
            //     version: Constant.version
            // });
            window.TDAPP.onEvent(event, "", {
                ...(params || {}),
                // 操作系统
                system,
                // 当前用户
                nickname: this.nickname,
                // 发行版
                platform: Constant.mode,
                // 使用的版本
                version: Constant.version
            });
        } catch (e) {
            console.error("埋点统计失败", e);
        }
        try {
            const additional = params ? (params['additional'] ? params['additional'] : JSON.stringify(params)) : '';
            this._access(event, additional)
                .then(() => console.log('自定义统计成功'))
                .catch(e => console.error("自定义统计失败", e));
        } catch (e) {
            console.error("自定义埋点统计失败", e);
        }
    }

    /**
     * 访问某个标签
     * @param operate 操作
     * @param additional 附加
     */
    private async _access(operate: string, additional?: string) {
        if (utools.isDev()) {
            return;
        }
        let now = new Date();
        if (this.token === '') {
            const res = await utools.fetchUserServerTemporaryToken();
            this.token = res.token;
            this.expired = res.expiredAt + now.getTime();
        }
        if (now.getTime() > this.expired) {
            // token过期，重新获取token
            const res = await utools.fetchUserServerTemporaryToken();
            this.token = res.token;
            this.expired = res.expiredAt + now.getTime();
        }
        let system: string;
        if (utools.isWindows()) {
            system = "Windows";
        } else if (utools.isMacOS()) {
            system = "MacOS"
        } else if (utools.isLinux()) {
            system = "Linux"
        } else {
            system = navigator.userAgent;
        }
        await http({
            url: `${Constant.statistics}/webhook/5e512530-23e3-4bf4-8fa7-1720da99a6b6?id=${Constant.uid}`,
            method: "POST",
            data: {
                token: this.token,
                nickname: this.nickname,
                operate,
                additional,
                platform: Constant.mode,
                system,
                version: Constant.version
            }
        });

    }


}
