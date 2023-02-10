// eslint-disable-next-line no-undef,no-unused-vars
chrome.browserAction.onClicked.addListener(function (tab) {
    // eslint-disable-next-line no-undef,no-unused-vars
    chrome.tabs.create({'url': chrome.extension.getURL('es-client/index.html')}, function (tab) {
    });
});
