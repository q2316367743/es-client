import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";
import useSettingStore from "@/store/SettingStore";

export default {
    success(content: string, title?: string): void {
        Notification.success({
            content,
            title,
            duration: useSettingStore().getNotificationTime,
            closable: true
        })
    },
    info(content: string, title?: string): void {
        Notification.info({
            content,
            title,
            duration: useSettingStore().getNotificationTime,
            closable: true,
        })
    },
    warning(content: string, title?: string): void {
        Notification.warning({
            content,
            title,
            duration: useSettingStore().getNotificationTime,
            closable: true
        })
    },
    error(content: string, title?: string): void {
        Notification.error({
            content,
            title,
            duration: useSettingStore().getNotificationTime,
            closable: true
        })
    },

    confirm(content: string, title: string, config: {
        confirmButtonText: string,
        cancelButtonText: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let flag = true;
            let notificationReturn = Notification.info({
                content,
                title,
                closable: true,
                duration: useSettingStore().getNotificationTime,
                footer: () => h('div', [
                    h(Button, {
                        type: 'text',
                        onClick: () => {
                            reject();
                            flag = false;
                            notificationReturn.close();
                        }
                    }, () => (config.cancelButtonText)),
                    h(Button, {
                        type: 'primary',
                        onClick: () => {
                            resolve();
                            flag = false;
                            notificationReturn.close();
                        }
                    }, () => (config.confirmButtonText))
                ]),
                onClose() {
                    if (flag) {
                        reject();
                    }
                }
            });
        })
    }
}