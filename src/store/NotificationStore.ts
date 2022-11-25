import { defineStore } from "pinia";
import Notification from "@/domain/Notification";

const useNotificationStore = defineStore('notification', {
    state: () => ({
        items: new Array<Notification>,
        current: undefined as Notification | undefined
    }),
    actions: {
        sendNotification(title: string, content: string) {
            this.items.push({
                id: new Date().getTime(),
                title,
                content,
                time: new Date()
            });
        }
    }
});

export default useNotificationStore;