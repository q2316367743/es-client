import MessageUtil from '@/utils/MessageUtil';
import {copy, generateUUID} from "@/utils/BrowserUtil";
import {del, get, getMany, keys, set} from 'idb-keyval';
import axios from "axios";

// 模拟utools声明

export type ShowOpenDialogOptionProperty = 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'
    | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent';

export interface ShowOpenDialogOptionFilter {
    name: string;
    extensions: Array<string>
}

export type RedirectPreloadType = 'text' | 'img' | 'files';

export interface RedirectPreload {
    type: RedirectPreloadType;
    data: any;
}

export interface ShowOpenDialogOption {
    title?: string,
    defaultPath?: string,
    buttonLabel?: string,
    filters?: Array<ShowOpenDialogOptionFilter>,
    properties?: Array<ShowOpenDialogOptionProperty>,
    message?: string,
    securityScopedBookmarks?: boolean
}

function isMacOS(): boolean {
    return /macintosh|mac os x/i.test(navigator.userAgent);
}

function isWindows(): boolean {
    let agent = navigator.userAgent.toLowerCase();
    return agent.indexOf("win") >= 0 || agent.indexOf("wow") >= 0;
}

export const DbStorage = {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify({value}));
    },
    /**
     * 获取键名对应的值
     */
    getItem(key: string): any | null {
        const str = localStorage.getItem(key);
        if (!str) {
            return null;
        }
        try {
            const target = JSON.parse(str);
            if (target.value) {
                return target.value;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
        // 数据是错的，直接删掉
        localStorage.removeItem(key);
        return null;
    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}

export const web = {
    dbStorage: DbStorage,
    db: {
        promises: {
            /**
             * 创建/更新文档
             */
            async put(doc: DbDoc): Promise<DbReturn> {
                try {
                    await set(doc._id, doc)
                    return Promise.resolve({
                        id: doc._id,
                        rev: ''
                    });
                } catch (e) {
                    return Promise.resolve({
                        id: doc._id,
                        error: true,
                        message: `${e}`,
                        ok: false
                    });
                }
            },
            /**
             * 获取文档
             */
            get(id: string): Promise<DbDoc | undefined> {
                return get(id)
            },
            /**
             * 删除文档
             */
            async remove(id: string): Promise<DbReturn> {
                try {
                    await del(id);
                    return Promise.resolve({
                        id,
                        rev: ''
                    });
                } catch (e) {
                    return Promise.resolve({
                        id,
                        error: true,
                        message: `${e}`,
                        ok: false
                    });
                }

            },
            /**
             * 获取所有文档 可根据文档id前缀查找
             */
            async allDocs(key?: string): Promise<DbDoc[]> {
                let itemKeys = await keys();
                if (key) {
                    itemKeys = itemKeys.filter(itemKey => {
                        if (typeof itemKey === 'string') {
                            return itemKey.startsWith(key)
                        }
                        return false;
                    })
                }
                return getMany(itemKeys);
            },
            /**
             * 存储附件到新文档
             */
            postAttachment(): Promise<DbReturn> {
                return Promise.reject("Web不支持保存附件")
            },
            /**
             * 获取附件
             */
            getAttachment(): Promise<Uint8Array | null> {
                return Promise.reject("Web不支持获取附件")
            },
            /**
             * 获取附件类型
             */
            getAttachmentType(): Promise<string | null> {
                return Promise.reject("Web不支持获取附件类型")
            }
        }
    },
    getPath(): string {
        return '';
    },
    shellOpenExternal(url: string): void {
        window.open(url);
    },
    redirect(label: string[], payload: string | RedirectPreload) {
        MessageUtil.warning("web环境不支持utools");
        window.open(`utools://${label[0]}/${label[1]}?${payload}`);
    },
    setFeature() {
        MessageUtil.warning("web环境不支持设置feature，请使用utools版本");
    },
    isDarkColors(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    onPluginEnter(callback: (action: { code: string, type: string, payload: any }) => void): void {
        document.addEventListener('load', () => callback({code: 'application', type: '', payload: {}}));
    },
    showOpenDialog(options: ShowOpenDialogOption): (string[]) | (undefined) {
        MessageUtil.warning("web环境不支持打开文件操作，请使用utools版本");
        return [];
    },
    setSubInput(action: { text: string }): boolean {
        console.warn("web环境不支持子输入框事件");
        return true
    },
    setSubInputValue() {
        console.warn("web环境不支持子输入框事件");
    },
    fetchUserPayments(): Promise<any[]> {
        return Promise.resolve([]);
    },
    getUser() {
        return {avatar: "", nickname: localStorage.getItem("nickname") || "web用户", type: ""};
    },
    fetchUserServerTemporaryToken(): Promise<{ token: string, expiredAt: number }> {
        let token = localStorage.getItem("token");
        if (!token) {
            token = generateUUID();
            localStorage.setItem("token", token);
        }
        return Promise.resolve({
            token,
            expiredAt: 999999999
        })
    },
    isDev(): boolean {
        // @ts-ignore
        return import.meta.env.DEV;
    },
    isMacOS,
    isWindows,
    isLinux(): boolean {
        return !isMacOS() && !isWindows();
    },
    copyText(text: string) {
        copy(text);
    }

}

export const webPreload = {
    axios: axios
}
