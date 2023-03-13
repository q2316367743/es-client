import EventTypeEnum from "./enumeration/EventTypeEnum";
import MessageTypeEnum from "./enumeration/MessageTypeEnum";
import EventResponse from "./entity/EventResponse";


// 增加事件
addEventListener(EventTypeEnum.FETCH_REQUEST, EventTypeEnum.FETCH_RESPONSE, MessageTypeEnum.FETCH);
addEventListener(EventTypeEnum.LODIS_REQUEST, EventTypeEnum.LODIS_RESPONSE, MessageTypeEnum.LODIS);

function addEventListener(request: EventTypeEnum, response: EventTypeEnum, type: MessageTypeEnum) {
    document.addEventListener(request, e => {
        let args = (e as CustomEvent).detail;
        const responseEventType = `${response}.${args.id}`;
        chrome.runtime.sendMessage({type, args})
            .then(response => document.dispatchEvent(new CustomEvent<EventResponse>(responseEventType, {
                detail: {
                    success: true,
                    response
                }
            })))
            .catch(e => document.dispatchEvent(new CustomEvent<EventResponse>(responseEventType, {
                detail: {
                    success: false,
                    response: e
                }
            })));
    });
}

// 注入事件监听方法
const scriptElement = document.createElement("script");
scriptElement.src = chrome.runtime.getURL("adapter.js");
scriptElement.onload = () => scriptElement.remove();
(document.head || document.documentElement).appendChild(scriptElement);


