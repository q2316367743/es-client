import {defineStore} from "pinia";
import {Stats} from "@/es/Stats";

const useUrlStatsStore = defineStore('url-stats-store', {
    state: () => ({

    }),
    actions: {
        render(stats: Stats) {

        },
        reset() {

        }
    }
})