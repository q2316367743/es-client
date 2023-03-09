/**
 * 主要处理网络访问
 */

console.log("es-client注入 - adapter")

!function () {
    "use strict";
    /*!
       * vtils v2.59.0
       * (c) Jay Fong <fjc0kb@gmail.com> (https://github.com/fjc0k)
       * Released under the MIT License.
       */
    var e, t, r, n = function () {
        this.listeners = Object.create(null)
    };

    function s(e) {
        return new Promise((t, r) => {
            const n = new FileReader;
            n.onload = () => {
                t(function (e, t, r) {
                    let n = "";
                    const s = new Uint8Array(e), o = s.byteLength;
                    for (let e = 0; e < o; e++) n += String.fromCharCode(s[e]);
                    return {__APP_AGENT_BASE64_FILE__: !0, base64: btoa(n), name: t, type: r}
                }(n.result, e.name, e.type))
            }, n.onerror = e => r(e), n.readAsArrayBuffer(e)
        })
    }

    function o(e, t, r) {
        return new Promise((n, s) => {
            const o = new FileReader;
            o.onload = () => {
                n(o.result)
            }, o.onerror = e => s(e);
            const i = new Blob([e]);
            "dataUrl" === t && o.readAsDataURL(i), "text" === t && o.readAsText(i, r)
        })
    }

    n.prototype.on = function (e, t) {
        var r = this;
        this.listeners[e] || (this.listeners[e] = []);
        var n = this.listeners[e];
        return -1 === n.indexOf(t) && n.push(t), function () {
            return r.off(e, t)
        }
    }, n.prototype.once = function (e, t) {
        var r = this.on(e, (function () {
            for (var e = [], n = arguments.length; n--;) e[n] = arguments[n];
            r(), t.apply(void 0, e)
        }));
        return r
    }, n.prototype.off = function (e, t) {
        if (t) {
            var r = this.listeners[e], n = r.indexOf(t);
            n > -1 && r.splice(n, 1)
        } else delete this.listeners[e]
    }, n.prototype.emit = function (e) {
        for (var t = [], r = arguments.length - 1; r-- > 0;) t[r] = arguments[r + 1];
        return (this.listeners[e] || []).map((function (e) {
            return e.apply(void 0, t)
        }))
    }, function (e) {
        e.open = "open", e.closed = "closed", e.leftOpenRightClosed = "leftOpenRightClosed", e.leftClosedRightOpen = "leftClosedRightOpen"
    }(e || (e = {})), function (e) {
        e.css = "css", e.js = "js", e.img = "img", e.video = "video", e.audio = "audio"
    }(t || (t = {})), function (e) {
        e.desc = "desc", e.asc = "asc"
    }(r || (r = {}));
    let i = 0;
    const a = new n;
    document.addEventListener("__APP_AGENT_HTTP_RESPONSE_LISTENER__", e => {
        const t = JSON.parse(JSON.stringify(e.detail || {}));
        t.response.arrayBuffer = e.detail.response.arrayBuffer, a.emit("response", t)
    });
    window.foxAgentCrossRequestVersion = function () {
        return {version: "0.0.1"}
    }, window.foxAgentCrossRequest = async function (e) {
        const t = e.headers["Content-Type"] || e.headers["content-type"] || e.headers["Content-type"] || "text/plain",
            r = null == e.data ? void 0 : (e => "application/x-www-form-urlencoded" === e ? "form" : e.startsWith("multipart/form-data") ? "file" : "application/json" === e ? "json" : "raw")(t),
            n = "file" !== r ? e.data : {__APP_AGENT_FILE_BODY__: !0, ...e.data || {}, ...Object.fromEntries(await Promise.all(Object.entries(e.files || {}).map(async ([e, t]) => Array.isArray(t) ? [e, await Promise.all(t.map(s))] : [e, t && await s(t)])))},
            d = `${location.href}____${i++}`, u = a.on("response", async ({id: t, response: r}) => {
                if (t === d) {
                    if (r.error) return e.error("", void 0, new Error(r.error.message)), void u();
                    const t = {
                        header: r.headers,
                        status: r.status,
                        statusText: r.statusText,
                        body: r.arrayBuffer,
                        getBodyAsDataUrl: async () => o(r.arrayBuffer, "dataUrl"),
                        async getBodyAsText() {
                            var e;
                            return o(r.arrayBuffer, "text", (null === (e = (r.headers["content-type"] || "").match(/charset=(.*)\b/i)) || void 0 === e ? void 0 : e[1]) || "utf-8")
                        }
                    }, n = {req: e, res: t, runTime: (new Date).getTime()};
                    r.ok ? e.success(t.body, t.header, n) : e.error(t.statusText, t.header, n), u()
                }
            }), {timeout: l = 3e5} = e;
        return document.dispatchEvent(new CustomEvent("__APP_AGENT_HTTP_REQUEST_LISTENER__", {
            detail: {
                id: d,
                options: {
                    url: e.url,
                    method: e.method,
                    headers: {...e.headers, "Content-Type": t},
                    requestBodyType: r,
                    requestBody: n
                },
                runtimeOptions: {requestId: d, timeout: l}
            }
        })), {
            version: "0.0.1", requestId: d, abort: () => {
                document.dispatchEvent(new CustomEvent("__APP_AGENT_HTTP_REQUEST_ABORT_LISTENER__", {
                    detail: {
                        id: d,
                        runtimeOptions: {requestId: d, timeout: l}
                    }
                }))
            }
        }
    }
}();
