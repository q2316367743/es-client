import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";
import useGlobalSettingStore from "@/store/setting/GlobalSettingStore";

export default {
    success(content: string, title?: string): void {
        Notification.success({
            content,
            title,
            duration: useGlobalSettingStore().getNotificationTime,
            closable: true
        })
    },
    info(content: string, title?: string): void {
        Notification.info({
            content,
            title,
            duration: useGlobalSettingStore().getNotificationTime,
            closable: true,
        })
    },
    warning(content: string, title?: string): void {
        Notification.warning({
            content,
            title,
            duration: useGlobalSettingStore().getNotificationTime,
            closable: true
        })
    },
    error(content: string, title?: string): void {
        Notification.error({
            content,
            title,
            duration: useGlobalSettingStore().getNotificationTime,
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
                duration: useGlobalSettingStore().getNotificationTime,
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
