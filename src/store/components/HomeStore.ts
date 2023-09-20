import {createGlobalState} from "@vueuse/core";
import {ref} from "vue";


export enum OrderType {
    NAME_ASC = 1,
    NAME_DESC = 2,
    SIZE_ASC = 3,
    SIZE_DESC = 4,
    DOCS_ASC = 5,
    DOCS_DESC = 6
}

export enum Status {

    NONE = 0,

    OPEN = 1,

    CLOSE = 2

}

// useSessionStorage('home-search-keyword', '')
export const useHomeStore = createGlobalState(
    () => {
        // state
        const keyword = ref('');
        const order = ref<OrderType>(OrderType.NAME_ASC);
        const status = ref<Status>(Status.NONE)

        return {keyword, order, status}
    }
)
