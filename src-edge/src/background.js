// eslint-disable-next-line no-undef,no-unused-vars
// 图标点击事件：跳转指定网页
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({'url': chrome.runtime.getURL('es-client/index.html?td_channelid=chrome')}, function (tab) {
    });
});

console.log(chrome.browserAction)
