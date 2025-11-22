import {defineStore} from "pinia";
import {
  createSeniorSearchRequestContent,
  SeniorSearchRequest,
  SeniorSearchRequestContent
} from "@/entity/history/SeniorSearchRequest";
import {getFromOneByAsync, listByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import TableNameEnum from "@/enumeration/TableNameEnum";

/**
 * 高级查询请求，此处只保存单个请求
 */
export const useSeniorSearchRequestStore = defineStore('senior-search-request', () => {
  const requests = ref(new Array<SeniorSearchRequest>());

  async function init() {
    const res = await listByAsync<SeniorSearchRequest>(TableNameEnum.SENIOR_SEARCH_REQUEST);
    requests.value = res.list;
  }

  init().then(() => console.log("存储「高级查询请求记录」初始化成功")).catch(e => console.log("存储「高级查询请求记录」初始化失败", e));

  async function post(request: SeniorSearchRequestContent) {
    const index = requests.value.findIndex(item => item.id === request.id);
    const base = {
      id: request.id,
      name: request.name,
      description: request.description,
    };
    if (index >= 0) {
      requests.value[index] = base;
    } else {
      requests.value.push({
        id: request.id,
        name: request.name,
        description: request.description,
      });
    }
    // 先保存记录
    await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + base.id, request);
    // 在保存列表
    await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST, requests.value);
  }

  async function remove(id: number) {
    const index = requests.value.findIndex(item => item.id === id);
    if (index >= 0) {
      requests.value.splice(index, 1);
      await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST, requests.value);
    }
    await removeOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + id);
  }

  async function getById(id: number) {
    return getFromOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + id, createSeniorSearchRequestContent());
  }

  return {requests, getById, post, remove};

})
