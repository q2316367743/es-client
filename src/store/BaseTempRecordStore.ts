import {defineStore} from "pinia";
import BaseSearchHistory from "@/entity/BaseSearchHistory";

const useBaseTempRecordStore = defineStore('base-temp-record', {
    state: () => ({
        tempRecords: new Array<BaseSearchHistory>(),
        hashSet: new Set<string>()
    }),
    getters: {
        getRecords: (state): Array<BaseSearchHistory> => state.tempRecords
    },
    actions: {
        addTempRecord(record: BaseSearchHistory) {
            let hash = record.index + JSON.stringify(record.conditions) + JSON.stringify(record.orders);
            if (!this.hashSet.has(hash)) {
                this.hashSet.add(hash);
                this.tempRecords.push(record);
            }
        },
        removeById(id: number) {
            for (let i = 0; i < this.tempRecords.length; i++) {
                let tempRecord = this.tempRecords[i];
                if (tempRecord.id === id) {
                    this.tempRecords.splice(i, 1);
                    let hash = tempRecord.index + JSON.stringify(tempRecord.conditions) + JSON.stringify(tempRecord.orders);
                    this.hashSet.delete(hash);
                    return;
                }
            }
        },
        reset() {
            this.tempRecords = new Array<BaseSearchHistory>();
            this.hashSet = new Set<string>()
        }
    }
});

export default useBaseTempRecordStore;