import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

interface Result<T> {
    success: boolean;
    msg: string;
    data: T;
}

const instance = axios.create({
    timeout: 5000,
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }
});


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
