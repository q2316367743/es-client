chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('es-client/index.html')}, function (tab) {
  });
});
