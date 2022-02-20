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

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            language: getDefaultLanguage(),
            default_shard,
            default_replica
        }
    },
    getters: {
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.default_shard,
        getDefaultReplica: (state) => state.default_replica

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
    }
})