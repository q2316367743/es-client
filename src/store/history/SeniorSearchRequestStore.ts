import {defineStore} from "pinia";
import {ref} from "vue";
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
    let rev: string | undefined = undefined;

    async function init() {
        const res = await listByAsync<SeniorSearchRequest>(TableNameEnum.SENIOR_SEARCH_REQUEST);
        requests.value = res.list;
        rev = res.rev;
    }

    init();

    async function post(request: SeniorSearchRequestContent, contentRev?: string) {
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
        await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + base.id, request, contentRev);
        // 在保存列表
        rev = await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST, requests.value, rev);
    }

    async function remove(id: number) {
        const index = requests.value.findIndex(item => item.id === id);
        if (index >= 0) {
            requests.value.splice(index, 1);
            rev = await saveOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST, requests.value, rev);
        }
        await removeOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + id, true);
    }

    async function getById(id: number) {
        return getFromOneByAsync(TableNameEnum.SENIOR_SEARCH_REQUEST_ITEM + '/' + id, createSeniorSearchRequestContent());
    }

    return {requests, getById, post, remove};

})
