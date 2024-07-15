!function () {
    "use strict";
    if (window.utools && window.utools.isDev()) {
        // 开发环境不处理
        return;
    }
    (t => {
        const {
            screen: {
                width: e,
                height: a
            },
            navigator: {
                language: r
            },
            location: n,
            localStorage: i,
            document: c,
            history: o
        } = t, {
            hostname: s,
            href: u
        } = n, {
            currentScript: l,
            referrer: d
        } = c;
        if (!l) return;
        const f = "data-",
            m = l.getAttribute.bind(l),
            h = m(f + "website-id"),
            p = m(f + "host-url"),
            g = m(f + "tag"),
            y = "false" !== m(f + "auto-track"),
            b = "true" === m(f + "exclude-search"),
            v = m(f + "domains") || "",
            S = v.split(",").map((t => t.trim())),
            w = `${(p || "" || l.src.split("/").slice(0, -1).join("/")).replace(/\/$/, "")}/api/send`,
            N = `${e}x${a}`,
            T = /data-umami-event-([\w-_]+)/,
            A = f + "umami-event",
            x = 300,
            O = t => {
                if (t) {
                    try {
                        const e = decodeURI(t);
                        if (e !== t) return e
                    } catch {
                        return t
                    }
                    return encodeURI(t)
                }
            },
            U = t => {
                try {
                    const {
                        pathname: e,
                        search: a
                    } = new URL(t);
                    t = e + a
                } catch {
                }
                return b ? t.split("?")[0] : t
            },
            j = () => ({
                website: h,
                hostname: (window.referrer ||  '').replace("https://", ""),
                screen: N,
                language: r,
                title: O(_),
                url: O(B),
                referrer: O(window.referrer),
                tag: g || void 0
            }),
            k = (t, e, a) => {
                a && (D = B, B = U(a.toString()), B !== D && setTimeout($, x))
            },
            E = () => !h || i && i.getItem("umami.disabled") || v && !S.includes(s),
            L = async (t, e = "event") => {
                if (E()) return;
                const a = {
                    "Content-Type": "application/json"
                };
                void 0 !== K && (a["x-umami-cache"] = K);
                try {
                    const r = await fetch(w, {
                            method: "POST",
                            body: JSON.stringify({
                                type: e,
                                payload: t
                            }),
                            headers: a
                        }),
                        n = await r.text();
                    return K = n
                } catch {
                }
            }, $ = (t, e) => L("string" == typeof t ? {
                ...j(),
                name: t,
                data: "object" == typeof e ? e : void 0
            } : "object" == typeof t ? t : "function" == typeof t ? t(j()) : j()), I = t => L({
                ...j(),
                data: t
            }, "identify");
        t.umami || (t.umami = {
            track: $,
            identify: I
        });
        let K, R, B = U(u),
            D = d !== s ? d : (window.mode || ''),
            _ = c.title;
        if (y && !E()) {
            (() => {
                const t = (t, e, a) => {
                    const r = t[e];
                    return (...e) => (a.apply(null, e), r.apply(t, e))
                };
                o.pushState = t(o, "pushState", k), o.replaceState = t(o, "replaceState", k)
            })(), (() => {
                const t = new MutationObserver((([t]) => {
                        _ = t && t.target ? t.target.text : void 0
                    })),
                    e = c.querySelector("head > title");
                e && t.observe(e, {
                    subtree: !0,
                    characterData: !0,
                    childList: !0
                })
            })(), c.addEventListener("click", (async t => {
                const e = t => ["BUTTON", "A"].includes(t),
                    a = async t => {
                        const e = t.getAttribute.bind(t),
                            a = e(A);
                        if (a) {
                            const r = {};
                            return t.getAttributeNames().forEach((t => {
                                const a = t.match(T);
                                a && (r[a[1]] = e(t))
                            })), $(a, r)
                        }
                    }, r = t.target, i = e(r.tagName) ? r : ((t, a) => {
                        let r = t;
                        for (let t = 0; t < a; t++) {
                            if (e(r.tagName)) return r;
                            if (r = r.parentElement, !r) return null
                        }
                    })(r, 10);
                if (!i) return a(r);
                {
                    const {
                        href: e,
                        target: r
                    } = i, c = i.getAttribute(A);
                    if (c)
                        if ("A" === i.tagName) {
                            const o = "_blank" === r || t.ctrlKey || t.shiftKey || t.metaKey || t.button && 1 === t.button;
                            if (c && e) return o || t.preventDefault(), a(i).then((() => {
                                o || (n.href = e)
                            }))
                        } else if ("BUTTON" === i.tagName) return a(i)
                }
            }), !0);
            const t = () => {
                "complete" !== c.readyState || R || ($(), R = !0)
            };
            c.addEventListener("readystatechange", t, !0), t()
        }
    })(window)
}();
