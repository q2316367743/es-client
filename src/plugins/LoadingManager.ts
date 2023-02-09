import {ElLoading} from "element-plus";

/**
 * 加载管理器
 */
export default class LoadingManager {

    private load?: {
        setText: (text: string) => void;
        close: () => void;
    }

    /**
     * 开始加载
     * @param text 加载显示文本
     */
    start(text: string): void {
        if (this.load !== undefined) {
            // 关闭旧的
            this.load.close();
        }
        this.load = ElLoading.service({
            lock: true,
            text: text,
            background: 'rgba(0, 0, 0, 0.7)',
        });
    }

    /**
     * 更改当前文本
     * @param text 文本
     */
    setText(text: string): void {
        if (this.load !== undefined) {
            this.load.setText(text);
        }
    }

    /**
     * 关闭加载框
     */
    close(): void {
        if (this.load !== undefined) {
            this.load.close();
            this.load = undefined;
        }
    }

    /**
     * 是否在加载中
     */
    loading(): boolean {
        return this.load !== undefined
    }

}