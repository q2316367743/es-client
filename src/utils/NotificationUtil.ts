import {Notification} from "@arco-design/web-vue";

export default {
    success(content: string, title?: string): void {
        Notification.success({
            content,
            title,
            closable: true
        })
    },
    info(content: string, title?: string): void {
        Notification.info({
            content,
            title,
            closable: true
        })
    },
    warning(content: string, title?: string): void {
        Notification.warning({
            content,
            title,
            closable: true
        })
    },
    error(content: string, title?: string): void {
        Notification.error({
            content,
            title,
            closable: true
        })
    }
}