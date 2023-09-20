import Constant from '@/global/Constant';
import {http} from "@/plugins/axios";

export default class Statistics {

    private token: string = '';
    private nickname: string = '未知用户';
    private expired: number = 0;

    constructor() {
    }

    init() {
        let user = utools.getUser();
        if (user) {
            this.nickname = user.nickname;
        }
    }

    /**
     * 插件打开
     */
    open() {
        this.access("插件打开")
            .then(() => console.log("插件打开"));
    }

    /**
     * 访问某个标签
     * @param operate 操作
     * @param additional 附加
     */
    async access(operate: string, additional?: string) {
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
            url: `${Constant.statistics}/open/statistics?id=${Constant.uid}`,
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
