import {defineStore} from "pinia";
import {ref} from "vue";
import {SeniorSearchRequest} from "@/entity/history/SeniorSearchRequest";
import {listByAsync} from "@/utils/utools/DbStorageUtil";
import TableNameEnum from "@/enumeration/TableNameEnum";

/**
 * 高级查询请求，此处只保存单个请求
 */
export const useSeniorSearchRequestStore = defineStore('senior-search-request', () => {
    let isInitialized = false;
    const requests = ref(new Array<SeniorSearchRequest>());
    let rev: string | undefined = undefined;

    async function init() {
        const res = await listByAsync<SeniorSearchRequest>(TableNameEnum.SENIOR_SEARCH_REQUEST);
        requests.value = res.list;
        rev = res.rev;
    }

})
