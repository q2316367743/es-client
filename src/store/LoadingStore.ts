import {defineStore} from "pinia";
import NotificationUtil from "@/utils/NotificationUtil";

const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
        text: '',
        timer: 0 as any
    }),
    getters: {
        isLoading: state => state.loading
    },
    actions: {

        addTimeout(timeout: number) {
            if (this.timer != 0) {
                // 清除上个定时器
                clearTimeout(this.timer);
            }
            // 创建新的定时器
            this.timer = setTimeout(() => {
                NotificationUtil.confirm("检测到全局加载已超过10秒，是否立即关闭全局加载框", "警告", {
                    confirmButtonText: '关闭',
                    cancelButtonText: '忽略'
                }).then(() => {
                    this.loading = false;
                    this.timer = 0;
                }).catch(() => {
                    console.log('忽略提示');
                    this.addTimeout(20);
                })
            }, timeout * 1000);
        },

        /**
         * 开始加载
         * @param text 加载显示文本
         */
        start(text: string): void {
            this.loading = true;
            this.text = text;
            this.addTimeout(10);
        },

        /**
         * 更改当前文本
         * @param text 文本
         */
        setText(text: string): void {
            if (!this.loading) {
                this.loading = true;
            }
            this.addTimeout(10);
            this.text = text;
        },

        /**
         * 关闭加载框
         */
        close(): void {
            this.loading = false;
            this.text = '';
            // 清除定时器
            clearTimeout(this.timer);
            this.timer = 0;
        }
    }
});
export default useLoadingStore;
