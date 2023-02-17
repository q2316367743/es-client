/**
 * 窗口操作栏是否显示
 */
export default interface WindowShow{

    /**
     * 整体可见性
     */
    visibility: boolean;

    /**
     * 最小化是否可用
     */
    min: boolean;

    /**
     * 最大化是否可用
     */
    max: boolean;

    /**
     * 关闭是否可用
     */
    close: boolean;

}