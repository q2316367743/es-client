import Properties from "@/view/index/Properties";

export default interface Mapping {

    /**
     * 文档
     */
    _doc: { properties: Record<string, Properties> };

}