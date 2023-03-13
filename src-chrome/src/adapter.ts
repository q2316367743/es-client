/**
 * 适配器，用于注入方法，简化操作
 */
import FetchArgs from "./entity/FetchArgs";
import EventTypeEnum from "./enumeration/EventTypeEnum";
import EventResponse from "./entity/EventResponse";
import BaseArgs from "./entity/BaseArgs";
import LodisArgs from "./entity/LodisArgs";

function execute<T extends BaseArgs>(request: EventTypeEnum, response: EventTypeEnum, detail: T): Promise<any> {
    const id = new Date().getTime();
    const responseEventType = `${response}.${id}`;
    detail.id = id;
    return new Promise<any>((resolve, reject) => {
        // 先增加消息监听
        console.debug("增加消息监听 - " + id)
        document.addEventListener(responseEventType, e => {
            let event = e as CustomEvent<EventResponse>;
            if (event.detail.success) {
                resolve(event.detail.response);
            } else {
                reject(event.detail.response);
            }
            // 移除事件
            document.removeEventListener(responseEventType, () => console.debug("移除消息监听 - " + id));
        });
        // 发送消息
        document.dispatchEvent(new CustomEvent<FetchArgs>(request, {
            detail: detail as any
        }));
    })

}

// @ts-ignore
window.esClientApi = {
    fetch(detail: FetchArgs): Promise<any> {
        return execute(EventTypeEnum.FETCH_REQUEST, EventTypeEnum.FETCH_RESPONSE, detail)
    },
    lodis(detail: LodisArgs): Promise<any> {
        return execute(EventTypeEnum.LODIS_REQUEST, EventTypeEnum.LODIS_RESPONSE, detail)
    }
}