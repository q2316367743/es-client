import {writeText} from '@tauri-apps/api/clipboard';
import {isPermissionGranted, requestPermission, sendNotification} from '@tauri-apps/api/notification';
import {open} from "@tauri-apps/api/shell";
import {AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";
import {Body, fetch, ResponseType} from "@tauri-apps/api/http";

export const tauri = {
    copyText(text: string) {
        writeText(text).then(() => console.log("复制文本"));
    },
    shellOpenExternal(url: string) {
        open(url).then(() => console.log("打开链接"));
    },
    showNotification(body: string) {
        async function _show(body: string) {
            let permissionGranted = await isPermissionGranted();
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }
            if (permissionGranted) {
                sendNotification({title: 'es-client', body: body});
            }
        }

        _show(body).then(() => console.log("发送通知"));
    },
    getUser() {
        return {avatar: "", nickname: localStorage.getItem("nickname") || "客户端用户", type: ""};
    },
};
export const tauriPreload = {
    async axios<T, D>(config: AxiosRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        try {
            let body = undefined;
            if (config.data) {
                body = typeof config.data === 'string' ? Body.text(config.data) : Body.json(config.data);
            }
            let headers = {
                ...config.headers
            };
            if (config.auth) {
                headers = {
                    ...headers,
                    Authorization: 'Basic ' + btoa(`${config.auth.username}:${config.auth.password}`)
                }
            }
            const rsp = await fetch<T>((config.baseURL || '') + (config.url || ''), {
                headers: headers,
                method: config.method as any,
                query: config.params,
                timeout: config.timeout,
                responseType: config.responseType === 'text' ? ResponseType.Text : ResponseType.JSON,
                body
            });
            return Promise.resolve({
                status: rsp.status,
                statusText: rsp.ok ? "OK" : "ERROR",
                headers: rsp.headers,
                config: config as any,
                data: rsp.data
            });
        } catch (e: any) {
            console.error(e);
            throw new AxiosError(e.message);
        }
    }
};
