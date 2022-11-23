self["MonacoEnvironment"] = (function (paths) {
    return {
        globalAPI: false,
        getWorkerUrl: function (moduleId, label) {
            var result = paths[label];
            if (/^((http:)|(https:)|(file:)|(\/\/))/.test(result)) {
                var currentUrl = String(window.location);
                var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
                if (result.substring(0, currentOrigin.length) !== currentOrigin) {
                    var js = '/*' + label + '*/importScripts("' + result + '");';
                    var blob = new Blob([js], { type: 'application/javascript' });
                    return URL.createObjectURL(blob);
                }
            }
            return result;
        }
    };
})({
    "json": "./monacoeditorwork/json.worker.bundle.js"
});