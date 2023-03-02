import DownloadType from "./DownloadType";

/**
 * 原生策略
 * 部分平台的一些原生api无法使用，需要替换
 */
export default interface NativeStrategy {

    /**
     * 打开链接
     * @param link 链接
     */
    openLink(link: string): void;

    /**
     * 检查更新
     */
    checkUpdate(): void;

    /**
     * 执行拷贝
     * @param value 拷贝内容
     */
    copy(value: string): void;

    /**
     * 下载文件
     * @param value 下载文件内容
     * @param name 文件名
     * @param type 文件类型
     */
    download(value: string, name: string, type: DownloadType): void;

}