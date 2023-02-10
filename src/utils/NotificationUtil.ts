import {Notification} from "@arco-design/web-vue";

export default {
    success(content: string, title?: string): void {
        Notification.success({
            content,
            title
        })
    },
    info(content: string, title?: string): void {
        Notification.info({
            content,
            title
        })
    },
    warning(content: string, title?: string): void {
        Notification.warning({
            content,
            title
        })
    },
    error(content: string, title?: string): void {
        Notification.error({
            content,
            title
        })
    }
}