export interface Info {
    // 节点名字
    name:         string;
    // 集群名字
    cluster_name: string;
    // 集群UUID
    cluster_uuid: string;
    // 版本
    version:      Version;
    // 标签行
    tagline:      string;
}

export interface Version {
    // es版本
    number:                              string;
    build_flavor:                        string;
    build_type:                          string;
    build_hash:                          string;
    // 构建时间
    build_date:                          Date;
    // 构建快照
    build_snapshot:                      boolean;
    // lucene版本
    lucene_version:                      string;
    // 最低安全兼容性版本
    minimum_wire_compatibility_version:  string;
    // 最低索引兼容性版本
    minimum_index_compatibility_version: string;
}
