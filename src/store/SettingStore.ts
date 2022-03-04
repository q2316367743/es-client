import { defineStore } from "pinia";
import { getDefaultLanguage } from '@/utils/GlobalUtil';

// 初始化
let default_shard = 5;
if (localStorage.getItem('default_shard')) {
    default_shard = parseInt(localStorage.getItem('default_shard')!);
}
let default_replica = 1;
if (localStorage.getItem('default_replica')) {
    default_replica = parseInt(localStorage.getItem('default_replica')!);
}
let senior_width = 520;
if (localStorage.getItem("senior_width")) {
    senior_width = parseInt(localStorage.getItem("senior_width")!);
}

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            language: getDefaultLanguage(),
            default_shard,
            default_replica,
            senior_width
        }
    },
    getters: {
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.default_shard,
        getDefaultReplica: (state) => state.default_replica,
        getSeniorWidth: (state) => state.senior_width
    },
    actions: {
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        setDefaultShard(default_shard: number): void {
            this.default_shard = default_shard;
            localStorage.setItem('default_shard', default_shard.toString());
        },
        setDefaultReplica(default_replica: number): void {
            this.default_replica = default_replica;
            localStorage.setItem('default_replica', default_replica.toString());
        },
        setSeniorWidth(senior_width: number) {
            this.senior_width = senior_width;
            localStorage.setItem('senior_width', senior_width.toString());
        }
    }
})