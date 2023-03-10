/**
 * 运行时，内容注入
 */

// 增加消息
import EventTypeEnum from "./enumeration/EventTypeEnum";
import Message from "./entity/Message";
import FetchArgs from "./entity/FetchArgs";
import MessageTypeEnum from "./enumeration/MessageTypeEnum";
import EventResponse from "./entity/EventResponse";

/**
 * 发送消息
 * @param args 参数
 */
function sendMessage(args: any): Promise<any> {
    return chrome.runtime.sendMessage({
        type: MessageTypeEnum.FETCH,
        args: args
    } as Message<FetchArgs>);
}

// 增加事件
document.addEventListener(EventTypeEnum.FETCH_REQUEST, async e => {
    let detail = (e as CustomEvent).detail as FetchArgs;
    const responseEventType = `${EventTypeEnum.FETCH_RESPONSE}.${detail.id}`;
    try {
        let response = await sendMessage(detail);
        document.dispatchEvent(new CustomEvent<EventResponse>(responseEventType, {
            detail: {
                success: true,
                response
            }
        }));
    } catch (e) {
        document.dispatchEvent(new CustomEvent<EventResponse>(responseEventType, {
            detail: {
                success: false,
                response: e
            }
        }));
    }
});

// 注入事件
const scriptElement = document.createElement("script");
scriptElement.src = chrome.runtime.getURL("adapter.js");
scriptElement.onload = () => scriptElement.remove();
(document.head || document.documentElement).appendChild(scriptElement);


