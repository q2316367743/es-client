import {IndexInstance} from "@/domain/IndexInstance";
import {IndexCreate} from "@/es/IndexCreate";

/**
 * 版本策略
 */
export default interface VersionStrategy {

    /**
     * 获取适用的版本
     */
    getVersion(): string;

    /**
     * 索引创建构造器
     * @param index 索引实例
     */
    indexCreateBuild(index: IndexInstance): IndexCreate;

}