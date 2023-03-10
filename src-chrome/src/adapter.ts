/**
 * 适配器，用于注入方法，简化操作
 */
import FetchArgs from "./entity/FetchArgs";
import EventTypeEnum from "./enumeration/EventTypeEnum";
import EventResponse from "./entity/EventResponse";

// @ts-ignore
window.esClientApi = {
    fetch(detail: FetchArgs): Promise<any> {
        const id = new Date().getTime();
        const responseEventType = `${EventTypeEnum.FETCH_RESPONSE}.${id}`;
        detail.id = id;
        return new Promise<any>((resolve, reject) => {
            // 先增加消息监听
            document.addEventListener(responseEventType, e => {
                let event = e as CustomEvent<EventResponse>;
                if (event.detail.success) {
                    resolve(event.detail.response);
                } else {
                    reject(event.detail.response);
                }
            });
            // 发送消息
            document.dispatchEvent(new CustomEvent<FetchArgs>(EventTypeEnum.FETCH_REQUEST, {
                detail
            }));
        })
    }
}