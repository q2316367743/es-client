/**
 * 运行时，内容注入
 */

// 增加消息
import EventTypeEnum from "./enumeration/EventTypeEnum";
import Message from "./entity/Message";
import FetchArgs from "./entity/FetchArgs";
import MessageTypeEnum from "./enumeration/MessageTypeEnum";

function sendMessage(args: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: MessageTypeEnum.FETCH,
            args: args
        } as Message<FetchArgs>, response => {
            console.log('请求成功', response)
            // 获得响应
            if (!response) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(response);
        })
    })
}

document.addEventListener(EventTypeEnum.FETCH_REQUEST, async e => {
    let detail = (e as CustomEvent).detail as FetchArgs;
    const responseEventType = `${EventTypeEnum.FETCH_RESPONSE}.${detail.id}`;
    sendMessage(detail)
        .then(response => {
            document.dispatchEvent(new CustomEvent(responseEventType, {
                detail: {
                    success: true,
                    response
                }
            }));
        })
        .catch(e => {
            document.dispatchEvent(new CustomEvent(responseEventType, {
                detail: {
                    success: false,
                    response: e
                }
            }));
        });
});
