import Keyword from "@/view/index/Keyword";
import Type from "@/view/index/Type";

export default interface Properties {

    /**
     * 字段类型
     */
    type?: Type;

    /**
     * keyword独有字段
     */
    fields?: { keyword: Keyword };

    /**
     * 属性
     */
    properties?: Record<string, Properties>;

    search_analyzer?: string;

    analyzer?: string;

    /**
     * 日期类型的格式化
     */
    format?: string;

}