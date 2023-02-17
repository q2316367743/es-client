import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";

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
            closable: true,
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
    },

    confirm(content: string, title: string, config: {
        confirmButtonText: string,
        cancelButtonText: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let notificationReturn = Notification.info({
                content,
                title,
                closable: true,
                duration: 10 * 1000,
                footer: () => h('div', [
                    h(Button, {
                        type: 'text',
                        onClick: () => {
                            reject();
                            notificationReturn.close();
                        }
                    }, config.cancelButtonText),
                    h(Button, {
                        type: 'primary',
                        onClick: () => {
                            resolve();
                            notificationReturn.close();
                        }
                    }, config.confirmButtonText)
                ]),
            });
        })
    }
}