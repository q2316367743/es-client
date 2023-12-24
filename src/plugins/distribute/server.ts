import {DbReturn} from "@/utils/utools/DbStorageUtil";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

interface Result<T> {
    success: boolean;
    msg: string;
    data: T;
}

async function render(response: AxiosResponse): Promise<any> {
    const data: Result<any> = response.data;
    if (data.success) {
        return data.data;
    } else {
        return Promise.reject(data.msg);
    }
}

const instance = axios.create({
    timeout: 5000,
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }
});

export const server = {
    db: {
        promises: {
            /**
             * 创建/更新文档
             */
            async put(doc: DbDoc): Promise<DbReturn> {
                return instance.post("./api/data/save", doc).then(render)
            },
            /**
             * 获取文档
             */
            get(id: string): Promise<DbDoc | undefined> {
                return instance.post("./api/data/get", {
                    _id: id
                }).then(render)
            },
            /**
             * 删除文档
             */
            async remove(id: string): Promise<DbReturn> {
                return instance.post("./api/data/remove", {
                    _id: id
                }).then(render)

            },
            /**
             * 获取所有文档 可根据文档id前缀查找
             */
            async allDocs(key?: string): Promise<DbDoc[]> {
                return instance.post("./api/data/allDocs", {
                    key: key
                }).then(render)
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
    }
}

export const serverPreload = {
    async axios(config: AxiosRequestConfig) {
        const response: AxiosResponse<Result<any>> = await instance.post("/api/preload/fetch", config);
        const data = response.data;
        if (data.success) {
            return Promise.resolve({
                status: response.status,
                statusText: "OK",
                headers: response.headers,
                config: config as any,
                data: response.data.data
            });
        } else {
            return Promise.reject(data.msg);
        }
    }
}
