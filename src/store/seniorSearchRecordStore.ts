import SeniorSearchRecord from "@/page/SeniorSearch/domain/SeniorSearchRecord";
import {defineStore} from "pinia";

const useSeniorSearchRecordStore = defineStore('senior-search-record',{
    state: () => ({
        records: new Array<SeniorSearchRecord>()
    }),
    actions: {
        push(record: SeniorSearchRecord) {
            this.records.push(record);
        },
        clear(){
            this.records = new Array<SeniorSearchRecord>();
        }
    }
});

export default useSeniorSearchRecordStore;