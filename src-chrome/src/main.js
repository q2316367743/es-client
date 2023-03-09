/**
 * 主要处理点击地址栏按钮，跳转页面
 * 插件相关设置
 */
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({'url': "http://es-client.esion.xyz/web/index.html"});
});


!function () {
    "use strict";

    function e(e) {
        if (!e || "object" != typeof e) return !1;
        var t = Object.getPrototypeOf(e);
        if (null === t) return !0;
        var o = t.constructor;
        return "function" == typeof o && o instanceof o
    }

    var t, o, n;
    !function (e) {
        e.open = "open", e.closed = "closed", e.leftOpenRightClosed = "leftOpenRightClosed", e.leftClosedRightOpen = "leftClosedRightOpen"
    }(t || (t = {})), function (e) {
        e.css = "css", e.js = "js", e.img = "img", e.video = "video", e.audio = "audio"
    }(o || (o = {})), function (e) {
        e.desc = "desc", e.asc = "asc"
    }(n || (n = {}));
    const r = {}, s = t => e(t) ? !0 === t.__APP_AGENT_BASE64_FILE__ ? function (e) {
        const t = atob(e.base64);
        let o = t.length;
        const n = new Uint8Array(o);
        for (; o--;) n[o] = t.charCodeAt(o);
        return new File([n], e.name, {type: e.type})
    }(t) : JSON.stringify(t) : t;
    chrome.runtime.onMessage.addListener((t, o, n) => {
        /*!
           * vtils v2.59.0
           * (c) Jay Fong <fjc0kb@gmail.com> (https://github.com/fjc0k)
           * Released under the MIT License.
           */
        var i;
        return (i = async () => {
            var o, i, a;
            switch (t.type) {
                case"__APP_AGENT_BACKGROUND_HTTP_REQUEST__":
                    if (e(t.options.body) && !0 === t.options.body.__APP_AGENT_FILE_BODY__) {
                        const {__APP_AGENT_FILE_BODY__: e, ...o} = t.options.body, n = new FormData;
                        for (const [e, t] of Object.entries(o)) Array.isArray(t) ? t.forEach(t => n.append(e, s(t))) : n.append(e, s(t));
                        t.options.body = n;
                        const r = t.options.headers;
                        r && delete r["Content-Type"]
                    }
                    const c = new URL(t.options.url).origin;
                    t.options.headers && (t.options.headers["Referrer-Policy"] = "no-referrer, strict-origin-when-cross-origin", t.options.headers.Referer = c, t.options.headers.Origin = c, t.options.mode = "cors", delete t.options.headers.cookie);
                    const d = new AbortController, {
                        requestId: l = 0,
                        timeout: p = 3e4
                    } = null !== (o = t.runtimeOptions) && void 0 !== o ? o : {}, _ = setTimeout(() => d.abort(), p);
                    r[l] = {abortId: _, abortController: d};
                    const u = await fetch(t.options.url, {...t.options, redirect: "follow", signal: d.signal});
                    delete r[l], clearTimeout(_);
                    const f = new Headers(u.headers), h = f.get("x-app-agent-http-headers");
                    if (null != h) {
                        f.delete("x-app-agent-http-headers");
                        for (const [e, t] of Object.entries(JSON.parse(h))) f.set(e, t)
                    }
                    const y = Object.fromEntries(f.entries()), b = function (e, t, o) {
                        let n = "";
                        const r = new Uint8Array(e), s = r.byteLength;
                        for (let e = 0; e < s; e++) n += String.fromCharCode(r[e]);
                        return {__APP_AGENT_BASE64_FILE__: !0, base64: btoa(n), name: t, type: o}
                    }(await u.arrayBuffer(), "file", y["content-type"] || "application/octet-stream"), {
                        ok: g,
                        status: A,
                        statusText: m
                    } = u;
                    n({
                        error: null,
                        data: {ok: g, status: A, statusText: m, headers: y, base64File: b, arrayBuffer: new Uint8Array}
                    });
                    break;
                case"__APP_AGENT_HTTP_REQUEST_ABORT_LISTENER__":
                    const {requestId: E = 0} = null !== (i = t.runtimeOptions) && void 0 !== i ? i : {},
                        T = null === (a = r[E]) || void 0 === a ? void 0 : a.abortId;
                    T && clearTimeout(T), delete r[E]
            }
        }, i()).catch(e => {
            n({error: {message: String(e)}})
        }), !0
    }), chrome.action.onClicked.addListener((function (e) {
        chrome.tabs.create({url: "https://apifox.cn/web"})
    }))
}();
