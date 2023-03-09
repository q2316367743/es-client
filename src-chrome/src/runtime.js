/**
 * 主要负责内容注入
 */

// 增加请求事件
document.addEventListener('__ES_CLIENT_FETCH_REQUEST__', fetchRequest);

/**
 * 处理fetch请求
 * @param {CustomEvent} e 自定义事件
 */
function fetchRequest(e) {
    let detail = e.detail;
    fetch(detail.url, {
        headers: detail.headers,
        body: detail.body,
        method: detail.method
    }).then(response => {
        document.dispatchEvent(new CustomEvent(`__ES_CLIENT_FETCH_RESPONSE_${detail.id}__`, {
            detail: {
                // 是否成功
                ok: response.ok,
                // 状态码
                status: response.data.status,
                // 失败原因，只有失败才会有
                reason: undefined,
                // 相应体内容
                data: response.json()
            }
        }))
    }).catch(reason => {
        document.dispatchEvent(new CustomEvent(`__ES_CLIENT_FETCH_RESPONSE_${detail.id}__`, {
            detail: {
                // 是否成功
                ok: false,
                // 状态码
                status: reason.response.data.status,
                // 失败原因，只有失败才会有
                reason: reason.response.data.error.reason,
                // 相应体内容
                data: reason
            }
        }))
    })
}


!function () {
    "use strict";

    function e(e, t, n) {
        return new Promise((r, a) => {
            const o = new FileReader;
            o.onload = () => {
                r(o.result)
            }, o.onerror = e => a(e);
            const s = function (e) {
                const t = atob(e.base64);
                let n = t.length;
                const r = new Uint8Array(n);
                for (; n--;) r[n] = t.charCodeAt(n);
                return new File([r], e.name, {type: e.type})
            }(e);
            "dataUrl" === t ? o.readAsDataURL(s) : "arrayBuffer" === t ? o.readAsArrayBuffer(s) : o.readAsText(s, n)
        })
    }

    !function (e) {
        const t = document.createElement("script");
        t.src = chrome.runtime.getURL(e), t.onload = () => t.remove(), (document.head || document.documentElement).appendChild(t)
    }("adapter.js"), document.addEventListener("__APP_AGENT_HTTP_REQUEST_LISTENER__", async t => {
        var n;
        const r = t.detail || {};
        let a;
        try {
            a = await async function (t, n) {
                const r = {url: t.url, method: t.method.toUpperCase(), headers: t.headers || {}, body: t.requestBody};
                return await new Promise((t, a) => {
                    chrome.runtime.sendMessage({
                        type: "__APP_AGENT_BACKGROUND_HTTP_REQUEST__",
                        options: r,
                        runtimeOptions: n
                    }, (async function (n) {
                        null == n ? a(chrome.runtime.lastError) : null != n.error ? a(n.error) : (n.data.arrayBuffer = await e(n.data.base64File, "arrayBuffer", n.data.base64File.type), t(n.data))
                    }))
                })
            }(r.options, r.runtimeOptions)
        } catch (e) {
            a = {error: {message: String(null !== (n = e.message) && void 0 !== n ? n : e)}}
        }
        document.dispatchEvent(new CustomEvent("__APP_AGENT_HTTP_RESPONSE_LISTENER__", {
            detail: {
                id: r.id,
                response: a
            }
        }))
    }), document.addEventListener("__APP_AGENT_HTTP_REQUEST_ABORT_LISTENER__", async e => {
        const {runtimeOptions: t} = JSON.parse(JSON.stringify(e.detail || {}));
        chrome.runtime.sendMessage({type: "__APP_AGENT_HTTP_REQUEST_ABORT_LISTENER__", runtimeOptions: t})
    })
}();
