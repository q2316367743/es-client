import {defineStore} from "pinia";
import RequestRecordEvent from "@/entity/event/RequestRecordEvent";

export const useErrorStore = defineStore('error', {
    state: () => ({
        records: new Array<RequestRecordEvent>(),
        hasNew: false
    }),
    actions: {
        /**
         * 新增事件
         * @param event 事件
         */
        addEvent(event: Omit<RequestRecordEvent, 'id'>) {
            this.records.unshift({
                ...event,
                id: event.createTime.getTime() + Math.floor(Math.random() * 100)
            });
            if (event.code !== 200) {
                this.hasNew = true;
            }
        },
        clear() {
            this.records = [];
        },
        read() {
            this.hasNew = false;
        }
    }
})
