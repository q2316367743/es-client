import {defineStore} from "pinia";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, toRaw} from "vue";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
import {stringifyJsonWithBigIntSupport} from "@/algorithm/format";


const useBaseSearchHistoryStore = defineStore('base-search-history', () => {
  // baseSearchHistories: new Array<BaseSearchHistory>()
  const baseSearchHistories = ref<Array<BaseSearchHistory>>([]);


  const getRecords = () => baseSearchHistories.value;
  const hashSet = computed(() => {
    const hashSet = new Set<string>();
    baseSearchHistories.value.forEach(e => hashSet.add(e.index + stringifyJsonWithBigIntSupport(e.conditions) + stringifyJsonWithBigIntSupport(e.orders)));
    return hashSet;
  })

  async function init() {
    const res = await listByAsync<BaseSearchHistory>(LocalNameEnum.DB_BASE_SEARCH_HISTORY);
    baseSearchHistories.value = res.list;
  }

  init().then(() => console.log("初始化「基础搜索历史」成功")).catch(e => console.log("初始化「基础搜索历史」失败", e));

  async function _sync() {
    await saveListByAsync(LocalNameEnum.DB_BASE_SEARCH_HISTORY, toRaw(baseSearchHistories.value));
  }

  async function add(record: Omit<BaseSearchHistory, 'id' | 'createTime' | 'updateTime'>): Promise<void> {
    let hash = record.index + stringifyJsonWithBigIntSupport(record.conditions) + stringifyJsonWithBigIntSupport(record.orders);
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
