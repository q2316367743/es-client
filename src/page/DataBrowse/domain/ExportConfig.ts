export default interface ExportConfig {

    /**
     * 文件名
     */
    name: string;

    /**
     * 文件类型
     * 1：JSON数据（*.json）
     * 2：网页（*.html）
     * 3：XML数据（*.xml）
     */
    type: number;

    /**
     * 数据类型
     * 1：当前数据（当前页的数据）
     * 2：选中数据（当前页选中的数据）
     */
    data: number;

    /**
     * 结果类型
     * 1：表格数据
     * 2：原始数据
     * 3：原始结果集
     */
    result: number;

    /**
     * 导出方式
     * 
     * 1. 复制到剪切板
     * 2. 打印
     * 3. 下载
     */
    config: number;

    /**
     * 导出的字段
     */
    fields: Array<string>;

}