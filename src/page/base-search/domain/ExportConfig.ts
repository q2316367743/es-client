export default interface ExportConfig {

    /**
     * 导出对话框
     */
    dialog: boolean,

    /**
     * 导出文件名
     */
    name: string,

    /**
     * 导出类型：1【当前分页】，2【指定数量】，3【全部】
     */
    count: number,

    /**
     * 自定义开始
     */
    customStart: number,

    /**
     * 自定义截止
     */
    customEnd: number,

    /**
     * 导出内容类型：1【原始结果集】，2【只导出_source】
     */
    content: number,

    /**
     * 每次分页查询的数量
     */
    size: number
}