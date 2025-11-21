import axios, {AxiosRequestConfig} from "axios";
import useUrlStore from "@/store/UrlStore";
import UrlAuthTypeEnum from "@/enumeration/UrlAuthTypeEnum";
import {jsonParse} from "@/algorithm/json";


export interface RequestConfig extends AxiosRequestConfig {

  /**
   * 是否是调试模式，如果是调试模式，则不会监控
   */
  debug?: boolean
}


export async function useRequest(url: string, config: RequestConfig = {}): Promise<string> {
  const response = await axios.request<string>({
    ...config,
    url,
    responseType: 'text'
  });
  return response.data;
}

export async function useRequestJson<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
  const r = await useRequest(url, config);
  return jsonParse<T>(r);
}

export async function useEsRequest(config: RequestConfig = {}): Promise<string> {
  const {url, current} = useUrlStore();
  if (current.trim() === '') {
    return Promise.reject("请先选择链接！");
  }

  let headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8'
  };

  // 如果有密码应该追加密码
  if (url) {
    if (url.isAuth) {
      if (url.authType === UrlAuthTypeEnum.HEADER) {
        headers[url.authUser] = url.authPassword;
      }
      if (url.authType === UrlAuthTypeEnum.COOKIE) {
        headers['Cookie'] = url.authPassword;
      } else {
        config.auth = {
          username: url.authUser,
          password: url.authPassword
        }
      }
    }
  }
  return useRequest(config.url || '', {
    ...config,
    baseURL: current,
    headers: {
      ...config.headers,
      ...headers
    },
    responseEncoding: "utf-8"
  })
}


export async function useEsRequestJson<T = any>(config: RequestConfig = {}): Promise<T> {
  const r = await useEsRequest(config);
  return jsonParse<T>(r);
}