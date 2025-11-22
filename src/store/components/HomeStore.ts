import useIndexStore from "@/store/IndexStore";


export enum OrderType {
  NAME_ASC = 1,
  NAME_DESC = 2,
  /**
   * @deprecated
   */
  SIZE_ASC = 3,
  /**
   * @deprecated
   */
  SIZE_DESC = 4,
  /**
   * @deprecated
   */
  DOCS_ASC = 5,
  /**
   * @deprecated
   */
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
    const order = ref<OrderType>(useIndexStore().order);
    const status = ref<Status>(Status.NONE)

    return {keyword, order, status}
  }
)
