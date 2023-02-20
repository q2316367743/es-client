import {defineStore} from "pinia";
import {NotificationItem} from "@/domain/NotificationItem";
import HttpStrategyConfig from "@/strategy/HttpStrategy/HttpStrategyConfig";
import {Button, Notification} from "@arco-design/web-vue";
import {h} from "vue";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

function notification(content: string, title: string) {
    let notificationReturn = Notification.info({
        content,
        title,
        closable: true,
        duration: 10 * 1000,
        footer: () => h('div', [
            h(Button, {
                type: 'text',
                onClick: () => {
                    notificationReturn.close();
                }
            }, () => ("取消")),
            h(Button, {
                type: 'primary',
                onClick: () => {
                    // 前往
                    emitter.emit(MessageEventEnum.OPEN_NOTIFICATION_MANAGE);
                    notificationReturn.close();
                }
            }, () => ("前往"))
        ])
    });
}

const useNotificationStore = defineStore('notification', {
    state: () => ({
        items: new Array<NotificationItem>(),
        hasRead: true
    }),
    actions: {
        send(content: string, title: string) {
            let now = new Date();
            const items = new Array<string>();
            this.add({
                id: now.getTime(),
                time: now,
                title: title,
                type: 'original',
                body: `${content}`,
            });
        },
        /**
         * 新增一共消息
         * @param item 消息
         */
        add(item: NotificationItem) {
            notification(item.body, item.title);
            this.items.push(item);
            this.hasRead = false;
        },
        http(config: HttpStrategyConfig, body: any) {
            let now = new Date();
            const items = new Array<string>();
            this.add({
                id: now.getTime(),
                time: now,
                title: '请求失败',
                type: 'http',
                body: '详情请看通知中心',
                httpMode: {
                    baseURL: config.baseURL,
                    url: config.url,
                    method: config.method!,
                    data: config.data,
                    rsp: body,
                }
            });
        },
        /**
         * 消息已读
         */
        read() {
            this.hasRead = true;
        }
    }
});

export default useNotificationStore;