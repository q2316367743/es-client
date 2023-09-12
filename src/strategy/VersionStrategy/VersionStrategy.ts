import {IndexInstance} from "@/domain/IndexInstance";
import {IndexCreate} from "@/components/es/domain/IndexCreate";

/**
 * 版本策略
 */
export default interface VersionStrategy {

    /**
     * 获取适用的版本
     */
    getVersionExp(): RegExp;

    /**
     * 是否存在类型
     */
    hasType(): boolean;

    /**
     * 索引创建构造器
     * @param index 索引实例
     */
    indexCreateBuild(index: IndexInstance): IndexCreate;

}
