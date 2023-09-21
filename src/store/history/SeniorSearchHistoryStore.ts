import {defineStore} from "pinia";
import {
    getDefaultSeniorSearchHistoryRecord,
    SeniorSearchHistoryIndex,
    SeniorSearchHistoryRecord
} from "@/entity/history/SeniorSearchHistory";
import {getFromOneByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";

export const useSeniorSearchHistoryStore = defineStore('senior-search-history', {
    state: () => ({
        seniorSearchHistories: new Array<SeniorSearchHistoryIndex>(),
        rev: undefined as string | undefined
    }),
    actions: {
        async init() {
            const {list, rev} = await listByAsync<BaseSearchHistory>(LocalNameEnum.INDEX_SENIOR_SEARCH_HISTORY);
            this.seniorSearchHistories = list;
            this.rev = rev;
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.INDEX_SENIOR_SEARCH_HISTORY, toRaw(this.seniorSearchHistories), this.rev);
        },
        async save(body: string): Promise<number> {
            // 先处理列表
            const now = new Date();
            const id = now.getTime();
            this.seniorSearchHistories.push({
                id: id,
                createTime: now,
                updateTime: now,
                name: '临时记录-' + id
            });
            await this._sync();
            // 再处理记录
            await saveOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id, {
                id: id,
                body: body
            });
            return Promise.resolve(id);
        },
        async update(id: number, body: string): Promise<void> {
            // 更新索引
            const index = this.seniorSearchHistories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("未找到此条历史记录");
            }
            this.seniorSearchHistories[index] = {
                ...this.seniorSearchHistories[index],
                updateTime: new Date(),
            };
            await this._sync();

            // 更新记录
            const old = await getFromOneByAsync<SeniorSearchHistoryRecord>(
                LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
                getDefaultSeniorSearchHistoryRecord());
            await saveOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
                {
                    id: id,
                    body: body
                },
                old.rev
            );
        },
        async rename(id: number, name: string): Promise<void> {
            // 更新索引
            const index = this.seniorSearchHistories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("未找到此条历史记录");
            }
            this.seniorSearchHistories[index] = {
                ...this.seniorSearchHistories[index],
                name: name,
                updateTime: new Date(),
            };
            await this._sync();
        },
        async remove(id: number) {
            // 更新索引
            const index = this.seniorSearchHistories.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("未找到此条历史记录");
            }
            this.seniorSearchHistories.splice(index, 1);
            await this._sync();
        },
        async getInfo(id: number): Promise<string> {
            const record = await getFromOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
                getDefaultSeniorSearchHistoryRecord());
            return record.record.body;
        }
    }
})
