import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {DbDoc} from "@/utils/utools/DbStorageUtil";

let utools = {}

let preload = {}

/**
 * 响应体
 */
interface Result<T = void> {
    success: boolean,
    message: string;
    data: T;
}

if (Constant.mode === PluginModeEnum.SERVER) {
    // 注入
    utools = {
        db: {
            promises: {
                /**
                 * 创建/更新文档
                 */
                async put(doc: DbDoc): Promise<DbReturn> {
                    return new Promise<DbReturn>(resolve => {
                        axios.put<Result>('./api/db/put', doc)
                            .then(rsp => {
                                const result = rsp.data;
                                if (result.success) {
                                    resolve({
                                        id: doc._id,
                                        rev: ''
                                    });
                                } else {
                                    resolve({
                                        id: doc._id,
                                        error: true,
                                        message: result.message,
                                        ok: false
                                    });
                                }
                            })
                            .catch(e => {
                                resolve({
                                    id: doc._id,
                                    error: true,
                                    message: `${e}`,
                                    ok: false
                                })
                            });
                    });
                },
                /**
                 * 获取文档
                 */
                async get(id: string): Promise<DbDoc | undefined> {
                    const rsp = await axios.get<Result<DbDoc>>('./api/db/get', {
                        params: {
                            _id: decodeURIComponent(id)
                        }
                    });

                    const result = rsp.data;
                    if (result.success) {
                        return Promise.resolve(result.data);
                    } else {
                        return Promise.resolve(undefined);
                    }

                },
                /**
                 * 删除文档
                 */
                async remove(id: string): Promise<DbReturn> {
                    return new Promise<DbReturn>(resolve => {
                        axios.delete<Result>('./api/db/put', {
                            params: {
                                _id: decodeURIComponent(id)
                            }
                        })
                            .then(rsp => {
                                const result = rsp.data;
                                if (result.success) {
                                    resolve({
                                        id: id,
                                        rev: ''
                                    });
                                } else {
                                    resolve({
                                        id: id,
                                        error: true,
                                        message: result.message,
                                        ok: false
                                    });
                                }
                            })
                            .catch(e => {
                                resolve({
                                    id: id,
                                    error: true,
                                    message: `${e}`,
                                    ok: false
                                })
                            });
                    })

                },
                /**
                 * 获取所有文档 可根据文档id前缀查找
                 */
                async allDocs(key?: string): Promise<DbDoc[]> {
                    const rsp = await axios.get<Result<DbDoc[]>>('./api/db/allDocs', {
                        params: {
                            key: key
                        }
                    });
                    const result = rsp.data;
                    if (result.success) {
                        return Promise.resolve(result.data);
                    }else {
                        return Promise.reject(result.message);
                    }
                },
                /**
                 * 存储附件到新文档
                 */
                postAttachment(): Promise<DbReturn> {
                    return Promise.reject("server不支持保存附件")
                },
                /**
                 * 获取附件
                 */
                getAttachment(): Promise<Uint8Array | null> {
                    return Promise.reject("server不支持获取附件")
                },
                /**
                 * 获取附件类型
                 */
                getAttachmentType(): Promise<string | null> {
                    return Promise.reject("server不支持获取附件类型")
                }
            }
        },
    }

    preload = {
        axios: (config: AxiosRequestConfig): Promise<AxiosResponse> => {
            return new Promise<AxiosResponse>((resolve, reject) => {
                axios.post<Result<AxiosResponse>>('./api/fetch', config)
                    .then(rsp => {
                        const result = rsp.data;
                        if (result.success) {
                            resolve(result.data);
                        } else {
                            reject(result.message);
                        }
                    })
            })
        }
    }
}

export const serverUtools = utools;
export const serverPreload = preload;
