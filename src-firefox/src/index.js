// eslint-disable-next-line no-undef,no-unused-vars
browser.browserAction.onClicked.addListener(function (tab) {
    // eslint-disable-next-line no-undef,no-unused-vars
    browser.tabs.create({'url': browser.extension.getURL('es-client/index.html?td_channelid=firefox')}, function (tab) {
    });
});
