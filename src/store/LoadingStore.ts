import {defineStore} from "pinia";

const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
        text: ''
    }),
    getters: {
        isLoading: state => state.loading
    },
    actions: {

        /**
         * 开始加载
         * @param text 加载显示文本
         */
        start(text: string): void {
            this.loading = true;
            this.text = text;
        },

        /**
         * 更改当前文本
         * @param text 文本
         */
        setText(text: string): void {
            if (!this.loading) {
                this.loading = true;
            }
            this.text = text;
        },

        /**
         * 关闭加载框
         */
        close(): void {
            this.loading = false;
            this.text = '';
        }
    }
});
export default useLoadingStore;