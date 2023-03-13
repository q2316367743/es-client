import Message from "./entity/Message";
import FetchArgs from "./entity/FetchArgs";
import MessageTypeEnum from "./enumeration/MessageTypeEnum";

// 处理器
import FetchHandler from "./handler/FetchHandler";
import PingHandler from "./handler/PingHandler";
import LodisHandler from "./handler/LodisHandler";

// 图标点击事件：跳转指定网页
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({'url': "https://es-client.esion.xyz/web/index.html"})
        .then(() => console.log("页面跳转成功"))
        .catch(e => console.error(e));
});

// 增加事件
chrome.runtime.onMessage.addListener((message: Message<any>, sender, sendResponse) => {
    // 判断事件
    switch (message.type) {
        case MessageTypeEnum.FETCH:
            FetchHandler(message.args, sender).then(response => {
                sendResponse(response);
            })
            break;
        case MessageTypeEnum.PING:
            PingHandler(sendResponse);
            break;
        case MessageTypeEnum.LODIS:
            LodisHandler(message.args).then(response => {
                sendResponse(response);
            });
            break;
    }
    return true;
});
