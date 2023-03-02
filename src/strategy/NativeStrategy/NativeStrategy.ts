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

}