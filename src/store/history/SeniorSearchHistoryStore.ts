import {defineStore} from "pinia";
import {
  getDefaultSeniorSearchHistoryRecord,
  SeniorSearchHistoryIndex,
  SeniorSearchHistoryRecord
} from "@/entity/history/SeniorSearchHistory";
import {getFromOneByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import BaseSearchHistory from "@/entity/history/BaseSearchHistory";
import LocalNameEnum from "@/enumeration/LocalNameEnum";


export const useSeniorSearchHistoryStore = defineStore('senior-search-history', () => {
  const seniorSearchHistories = ref<Array<SeniorSearchHistoryIndex>>([]);

  async function init() {
    const res = await listByAsync<BaseSearchHistory>(LocalNameEnum.INDEX_SENIOR_SEARCH_HISTORY);
    seniorSearchHistories.value = res.list;
  }

  init();

  async function _sync() {
    await saveListByAsync(LocalNameEnum.INDEX_SENIOR_SEARCH_HISTORY, toRaw(seniorSearchHistories.value));
  }

  async function save(body: string): Promise<number> {
    // 先处理列表
    const now = new Date();
    const id = now.getTime();
    seniorSearchHistories.value.push({
      id: id,
      createTime: now,
      updateTime: now,
      name: '临时记录-' + id
    });
    await _sync();
    // 再处理记录
    await saveOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id, {
      id: id,
      body: body
    });
    return Promise.resolve(id);
  }

  async function update(id: number, body: string): Promise<void> {
    // 更新索引
    const index = seniorSearchHistories.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("未找到此条历史记录");
    }
    seniorSearchHistories.value[index] = {
      ...seniorSearchHistories.value[index],
      updateTime: new Date(),
    };
    await _sync();

    // 更新记录
    await getFromOneByAsync<SeniorSearchHistoryRecord>(
      LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
      getDefaultSeniorSearchHistoryRecord());
    await saveOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
      {
        id: id,
        body: body
      },
    );
  }

  async function rename(id: number, name: string): Promise<void> {
    // 更新索引
    const index = seniorSearchHistories.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("未找到此条历史记录");
    }
    seniorSearchHistories.value[index] = {
      ...seniorSearchHistories.value[index],
      name: name,
      updateTime: new Date(),
    };
    await _sync();
  }

  async function remove(id: number) {
    // 更新索引
    const index = seniorSearchHistories.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("未找到此条历史记录");
    }
    seniorSearchHistories.value.splice(index, 1);
    await _sync();
  }

  async function getInfo(id: number): Promise<string> {
    const record = await getFromOneByAsync<SeniorSearchHistoryRecord>(LocalNameEnum.RECORD_SENIOR_SEARCH_HISTORY + id,
      getDefaultSeniorSearchHistoryRecord());
    return record.record.body;
  }

  return {
    seniorSearchHistories,
    save,
    update,
    rename,
    remove,
    getInfo
  }

})
