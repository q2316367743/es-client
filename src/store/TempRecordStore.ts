import {defineStore} from "pinia";
import HistoryEntity from "@/entity/HistoryEntity";

const useTempRecordStore = defineStore('temp-record', {
    state: () => ({
        tempRecords: new Array<HistoryEntity>(),
        hashSet: new Set<string>()
    }),
    getters: {
        getRecords: (state): Array<HistoryEntity> => state.tempRecords
    },
    actions: {
        addTempRecord(record: HistoryEntity) {
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
            this.tempRecords = new Array<HistoryEntity>();
            this.hashSet = new Set<string>()
        }
    }
});

export default useTempRecordStore;