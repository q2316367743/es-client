export interface Overview {
    name: string;
    cluster_name: string;
    cluster_uuid: string;
    version: Version;
    tagline: string;
}

interface Version {
    number: string;
    build_flavor: string;
    build_type: string;
    build_hash: string;
    build_date: string;
    build_snapshot: boolean;
    lucene_version: string;
    minimum_wire_compatibility_version: string;
    minimum_index_compatibility_version: string;
}
