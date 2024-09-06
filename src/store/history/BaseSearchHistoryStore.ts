import {defineStore} from "pinia";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, toRaw} from "vue";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";



const useBaseSearchHistoryStore = defineStore('base-search-history', () => {
    // baseSearchHistories: new Array<BaseSearchHistory>()
    const baseSearchHistories = ref<Array<BaseSearchHistory>>([]);
    let rev: string | undefined = undefined;


    const getRecords = () => baseSearchHistories.value;
    const hashSet = computed(() => {
        const hashSet = new Set<string>();
        baseSearchHistories.value.forEach(e => hashSet.add(e.index + JSON.stringify(e.conditions) + JSON.stringify(e.orders)));
        return hashSet;
    })

    async function init() {
        const res = await listByAsync<BaseSearchHistory>(LocalNameEnum.DB_BASE_SEARCH_HISTORY);
        baseSearchHistories.value = res.list;
        rev = res.rev;
    }

    init();

    async function _sync() {
        rev = await saveListByAsync(LocalNameEnum.DB_BASE_SEARCH_HISTORY, toRaw(baseSearchHistories.value), rev);
    }

    async function add(record: Omit<BaseSearchHistory, 'id' | 'createTime' | 'updateTime'>): Promise<void> {
        let hash = record.index + JSON.stringify(record.conditions) + JSON.stringify(record.orders);
        if (!hashSet.value.has(hash)) {
            const now = new Date();
            baseSearchHistories.value.push({
                ...record,
                id: now.getTime(),
                createTime: now,
                updateTime: now
            });
            await _sync();
        }
        return Promise.resolve();
    }

    async function removeById(id: number) {
        const index = baseSearchHistories.value.findIndex(e => e.id === id);
        if (index === -1) {
            return Promise.reject(`基础搜索历史【${id}】不存在`);
        }
        baseSearchHistories.value.splice(index, 1);
        await _sync();
        return Promise.resolve();
    }

    function reset() {
        baseSearchHistories.value = new Array<BaseSearchHistory>();
    }

    return {baseSearchHistories, add}

});

export default useBaseSearchHistoryStore;
