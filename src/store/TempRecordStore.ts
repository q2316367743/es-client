import {defineStore} from "pinia";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";

const useTempRecordStore = defineStore('temp-record', {
    state: () => ({
        tempRecords: new Array<SeniorSearchHistory>(),
        hashSet: new Set<string>()
    }),
    getters: {
        getRecords: (state): Array<SeniorSearchHistory> => state.tempRecords
    },
    actions: {
        addTempRecord(record: SeniorSearchHistory) {
            let hash = record.link + record.method + record.params;
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
                    let hash = tempRecord.link + tempRecord.method + tempRecord.params;
                    this.hashSet.delete(hash);
                    return;
                }
            }
        },
        reset() {
            this.tempRecords = new Array<SeniorSearchHistory>();
            this.hashSet = new Set<string>()
        }
    }
});

export default useTempRecordStore;