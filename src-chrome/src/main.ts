/**
 * 两件事：
 * 1. 图标点击事件：跳转指定网页
 * 2. 增加事件
 */

// 图标点击事件：跳转指定网页
import Message from "./entity/Message";
import FetchArgs from "./entity/FetchArgs";
import MessageTypeEnum from "./enumeration/MessageTypeEnum";

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({'url': "https://es-client.esion.xyz/web/index.html"})
        .then(() => console.log("页面跳转成功"))
        .catch(e => console.error(e));
});

// 增加事件
chrome.runtime.onMessage.addListener((message: Message<FetchArgs>, sender, sendResponse) => {
    // 判断事件
    switch (message.type) {
        case MessageTypeEnum.FETCH:
            fetchHandler(message.args, sender).then(response => {
                sendResponse(response);
            })
            break;
        case MessageTypeEnum.PING:
            pingHandler(sendResponse);
            break;
    }
    return true;
});

/**
 * fetch处理器
 * @param message 消息
 * @param sender 发送者
 */
function fetchHandler(
    message: FetchArgs,
    sender: chrome.runtime.MessageSender
): Promise<any> {
    // TODO: 只处理指定的fetch
    return new Promise<any>(resolve => {
        fetch(message.url, {
            headers: message.headers,
            body: message.data ? typeof message.data === 'string' ? message.data : JSON.stringify(message.data) : undefined,
            method: message.method
        }).then(response => {
            response.json().then(body => {
                resolve({
                    // 是否成功
                    ok: response.ok,
                    msg: '正常响应',
                    // 状态码
                    status: response.status,
                    // 失败原因，只有失败才会有
                    reason: undefined,
                    // 相应体内容
                    data: body
                });
            }).catch(() => {
                response.text().then(text => {
                    resolve({
                        // 是否成功
                        ok: response.ok,
                        msg: '解码错误，转为text',
                        // 状态码
                        status: response.status,
                        // 失败原因，只有失败才会有
                        reason: undefined,
                        // 相应体内容
                        data: text
                    });
                }).catch(e => {
                    resolve({
                        // 是否成功
                        ok: false,
                        msg: '解码错误，无法解码',
                        // 状态码
                        status: response.status,
                        // 失败原因，只有失败才会有
                        reason: e,
                        // 相应体内容
                        data: e
                    });
                    console.error('解码错误，无法解码', message, e);
                })
            })
        }).catch(reason => {
            console.error('请求错误', message, reason);
            resolve({
                // 是否成功
                ok: false,
                msg: '请求错误',
                // 状态码
                status: reason ? reason.response ? reason.response.data ? reason.response.data.status : 0 : 0 : 0,
                // 失败原因，只有失败才会有
                reason: reason ?
                    reason.response
                        ? reason.response.data
                            ? reason.response.data.error
                                ? reason.response.data.error.reason : ''
                            : ''
                        : ''
                    : '',
                // 相应体内容
                data: reason
            });
        })
    })
}

function pingHandler(sendResponse: (response?: any) => void) {
    sendResponse('pong');
}