import { defineStore } from "pinia";

// 初始化
let is_save_log = true;
if (localStorage.getItem('is_save_log')) {
    is_save_log = localStorage.getItem('is_save_log') !== '0';
}
let log_max_day = 30;
if (localStorage.getItem('log_max_day')) {
    log_max_day = parseInt(localStorage.getItem('log_max_day')!);
}

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            is_save_log,
            log_max_day
        }
    },
    getters: {
        getIsSaveLog: (state) => state.is_save_log,
        getLogMaxDay: (state) => state.log_max_day
    },
    actions: {
        setIsSaveLog(is_save_log: boolean): void {
            this.is_save_log = is_save_log;
            localStorage.setItem('is_save_log', is_save_log ? '1' : '0');
        },
        setLogMaxDay(log_max_day: number): void {
            this.log_max_day = log_max_day;
            localStorage.setItem('log_max_day', log_max_day.toString());
        }
    }
})