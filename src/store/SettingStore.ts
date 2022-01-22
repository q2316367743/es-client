import { defineStore } from "pinia";
import { getDefaultLanguage } from '@/utils/GlobalUtil';

// 初始化
let is_save_log = true;
if (localStorage.getItem('is_save_log')) {
    is_save_log = localStorage.getItem('is_save_log') !== '0';
}
let log_max_day = 30;
if (localStorage.getItem('log_max_day')) {
    log_max_day = parseInt(localStorage.getItem('log_max_day')!);
}
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
            is_save_log,
            log_max_day,
            language: getDefaultLanguage(),
            default_shard,
            default_replica
        }
    },
    getters: {
        getIsSaveLog: (state) => state.is_save_log,
        getLogMaxDay: (state) => state.log_max_day,
        getLanguage: (state) => state.language,
        getDefaultShard: (state) => state.default_shard,
        getDefayltReplica: (state) => state.default_replica

    },
    actions: {
        setIsSaveLog(is_save_log: boolean): void {
            this.is_save_log = is_save_log;
            localStorage.setItem('is_save_log', is_save_log ? '1' : '0');
        },
        setLogMaxDay(log_max_day: number): void {
            this.log_max_day = log_max_day;
            localStorage.setItem('log_max_day', log_max_day.toString());
        },
        setLanguage(language: string): void {
            this.language = language;
            localStorage.setItem('language', language);
        },
        setDefauletShard(default_shard: number): void {
            this.default_shard = default_shard;
            localStorage.setItem('default_shard', default_shard.toString());
        },
        setDefaultReplica(default_replica: number): void {
            this.default_replica = default_replica;
            localStorage.setItem('default_replica', default_replica.toString());
        },
    }
})