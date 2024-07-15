import Constant from "@/global/Constant";
import {generateUUID} from "@/utils/BrowserUtil";
import {getItem, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUmami} from "@/plugins/umami";

export type EventIdentificationEnum = 'update' | 'page_jump' | 'es_version' |
    'func_data_browser' | 'func_base_search' | 'func_senior_search' |
    'func_dashboard';


export class Statistics {

    private readonly nickname: string = '未知用户';
    private readonly profileId: string;
    private token: string = '';

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
            useUmami.track(event, params)
        } catch (e) {
            console.error("自定义埋点统计失败", e);
        }
    }



}
