import {defineStore} from "pinia";
import {listByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";

const useBaseSearchHistoryStore = defineStore('base-search-history', {
    state: () => ({
        baseSearchHistories: new Array<BaseSearchHistory>(),
        rev: undefined as undefined | string,
    }),
    getters: {
        getRecords: (state): Array<BaseSearchHistory> => state.baseSearchHistories,
        hashSet: state => {
            const hashSet = new Set<string>();
            state.baseSearchHistories.forEach(e => hashSet.add(e.index + JSON.stringify(e.conditions) + JSON.stringify(e.orders)));
            return hashSet;
        }
    },
    actions: {
        async init() {
            const {list, rev} = await listByAsync<BaseSearchHistory>(LocalNameEnum.DB_BASE_SEARCH_HISTORY);
            this.baseSearchHistories = list;
            this.rev = rev;
        },
        async add(record: Omit<BaseSearchHistory, 'id' | 'createTime' | 'updateTime'>): Promise<void> {
            let hash = record.index + JSON.stringify(record.conditions) + JSON.stringify(record.orders);
            if (!this.hashSet.has(hash)) {
                this.hashSet.add(hash);
                const now = new Date();
                this.baseSearchHistories.push({
                    ...record,
                    id: now.getTime(),
                    createTime: now,
                    updateTime: now
                });
                await this._sync();
            }
            return Promise.resolve();
        },
        async removeById(id: number) {
            const index = this.baseSearchHistories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject(`基础搜索历史【${id}】不存在`);
            }
            this.baseSearchHistories.splice(index, 1);
            await this._sync();
            return Promise.resolve();
        },
        reset() {
            this.baseSearchHistories = new Array<BaseSearchHistory>();
        },
        async _sync() {
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.DB_BASE_SEARCH_HISTORY,
                _rev: this.rev,
                value: toRaw(this.baseSearchHistories)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        },
    }
});

export default useBaseSearchHistoryStore;
