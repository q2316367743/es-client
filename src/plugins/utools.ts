import MessageUtil from '@/utils/MessageUtil';
import { get, set, del, keys, getMany } from 'idb-keyval';
import { copy } from '@/utils/BrowserUtil';

// 模拟utools声明
export interface DbDoc {
    _id: string,
    _rev?: string,
    [key: string]: any
}

export interface DbReturn {
    id: string,
    rev?: string,
    ok?: boolean,
    error?: boolean,
    name?: string,
    message?: string
}

function generateUUID(): string {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

export const utools = {
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
              * @param docId 文档ID
              * @param attachment 附件 buffer
              * @param type 附件类型，示例：image/png, text/plain
              */
            postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn> {
                return Promise.resolve({
                    id: ''
                })
            },
            /**
              * 获取附件
              * @param docId 文档ID
              */
            getAttachment(docId: string): Promise<Uint8Array | null> {
                return Promise.resolve(null);
            },
            /**
              * 获取附件类型
              * @param docId 文档ID
              */
            getAttachmentType(docId: string): Promise<string | null> {
                return Promise.resolve(null);
            }
        }
    },
    getPath(path: string): string {
        return '';
    },
    shellOpenExternal(url: string): void {
        window.open(url);
    },
    redirect(name: string, action: any) {
        MessageUtil.warning("web环境不支持utools");
        window.open("https://u.tools");
    },
    setFeature(feature: any) {
        MessageUtil.warning("web环境不支持设置feature，请使用utools版本");
    },
    isDarkColors(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    onPluginEnter(callback: (action: { code: string, type: string, payload: any }) => void): void {
        document.addEventListener('load', () => callback({ code: 'application', type: '', payload: {} }));
    },
    showOpenDialog(options: any): (string[]) | (undefined) {
        MessageUtil.warning("web环境不支持打开文件操作，请使用utools版本");
        return [];
    },
    fetchUserPayments(): Promise<any[]> {
        return Promise.resolve([]);
    },
    getUser() {
        return { avatar: "", nickname: "web用户", type: "" };
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
        return false;
    },
    copyText(text: string) {
        copy(text);
    }
}