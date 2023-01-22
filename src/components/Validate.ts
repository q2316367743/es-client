import MessageUtil from "@/utils/MessageUtil";

/**
 * 验证器
 */
export default class Validate {

    /**
     * 验证状态
     */
    public state: boolean;

    constructor() {
        this.state = true;
    }

    public valid(): boolean {
        return this.state;
    }

    public min(source: number, target: number, message: string): void {
        if (source < target) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

    public max(source: number, target: number, message: string): void {
        if (source > target) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

    public range(source: number, min: number, max: number, message: string): void {
        if (source > max || source < min) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

    public size(source: string | Array<any>, min: number, max: number, message: string): void {
        if (source.length > max || source.length < min) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

    public notBlank(source: string, message: string): void {
        if (source === null || source === undefined) {
            this.state = false;
            MessageUtil.error(message);
        }
        source = source.trim();
        if (source.length === 0) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

    public notNull(source: any, message: string): void {
        if (source === null || source === undefined) {
            this.state = false;
            MessageUtil.error(message);
        }
    }

}