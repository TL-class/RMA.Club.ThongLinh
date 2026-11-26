const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["./Ymr2MJyM.js", "./DOnB0cMv.js", "./entry.Cw7Ex1wD.css", "./_3ZbIu3x.js", "./BGN06MKu.js", "./Index.-fg4g8-U.css", "./CTFUXZ1U.js", "./index.BNcA3nis.css"]))) => i.map(i => d[i]);
import {k as g, am as S, o, g as y, l as f, y as c, G as x, a9 as Q, at as U, ak as z, al as G, q as J, A as I, an as Y, e as Z, a as t, c as i, E as j, $ as H, a0 as W, m as N, ap as K, a3 as X, au as ee, F as te, d as re, _ as oe} from "./DOnB0cMv.js";
import {_ as T} from "./gaYZnnBY.js";
import {_ as ne} from "./B1pCgG6h.js";
import {_ as ae} from "./Dqan8qcG.js";
import {u as se, P as ie, a as ce, N as ue} from "./BMIS6vMC.js";
import {Q as pe} from "./BgwOi4ct.js";
import "./BGN06MKu.js";
import "./e3A67Q-e.js";
import "./B1R2zV4_.js";
import "./CTFUXZ1U.js";
const le = {
    key: 0,
    class: "client"
}
  , me = {
    __name: "ClientInfo",
    setup(w) {
        const a = S()
          , m = x( () => a.propertyInfo?.owner?.squareImage ? a.propertyInfo.owner?.squareImage : a.propertyInfo.owner?.image || a.propertyInfo?.creator?.image);
        return (P, E) => {
            const d = T;
            return m.value ? (o(),
            y("div", le, [f(d, {
                src: m.value,
                alt: "firmImage"
            }, null, 8, ["src"])])) : c("", !0)
        }
    }
}
  , de = g(me, [["__scopeId", "data-v-510f6c1d"]])
  , _e = {}
  , fe = {
    class: "embed-pano-watermark"
};
function ye(w, a) {
    return o(),
    y("div", fe)
}
const ve = g(_e, [["render", ye], ["__scopeId", "data-v-4ae184c5"]])
  , Ie = {
    class: "embed-viewer-wrap"
}
  , ge = {
    key: 2
}
  , we = {
    class: "action-overlay"
}
  , Pe = {
    __name: "index",
    async setup(w) {
        let a, m;
        const P = re( () => oe( () => import("./Ymr2MJyM.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7]), import.meta.url))
          , E = Q("isPortrait")
          , d = U()
          , h = z()
          , _ = G()
          , {$busSocket: v} = J()
          , r = S()
          , {isPlacePasswordProtected: D, isPlacePrivateProtected: R, initTourAccess: C} = se()
          , p = I(!1)
          , l = I("This embed link is invalid or the place no longer exists.")
          , n = x( () => {
            const e = d.params.propertyId;
            return Array.isArray(e) ? e[0] || "" : e || ""
        }
        );
        function F() {
            const e = String(d.query.embedded || "").toLowerCase();
            return e === "1" || e === "true"
        }
        const u = I(F());
        function q() {
            try {
                return window.self !== window.top
            } catch {
                return !1
            }
        }
        function b() {
            const e = d.query.msg;
            if (!e)
                return {};
            try {
                return JSON.parse(decodeURIComponent(String(e)))
            } catch {
                try {
                    return JSON.parse(String(e))
                } catch {
                    return {
                        raw: String(e)
                    }
                }
            }
        }
        function A() {
            const e = b();
            return {
                referer: e.referer || "",
                location: e.location || "",
                userAgent: e.userAgent || navigator.userAgent || ""
            }
        }
        function M() {
            const e = b()
              , s = {
                ...e,
                propertyId: n.value || "",
                propertyName: r.propertyInfo?.name || "",
                propertyValid: !p.value
            };
            return e.status === "NO_TARGET" || (n.value ? p.value ? (s.status = "PROPERTY_NOT_FOUND",
            s.error = l.value) : s.status || (s.status = "LOADED") : (s.status = "INVALID_PROPERTY",
            s.error = l.value)),
            s
        }
        function k() {
            p.value = !0,
            l.value = "Property ID is missing."
        }
        if (n.value) {
            const e = ([a,m] = Y( () => r.getProperty(n.value, {
                softFail: !0
            })),
            a = await a,
            m(),
            a);
            p.value = !!(e?.notFound || e?.error),
            e?.notFound ? l.value = "Property not found" : e?.error && (l.value = "Unable to load this place right now.")
        } else
            u.value && k();
        return Z(async () => {
            u.value || (u.value = q()),
            !n.value && u.value && k(),
            u.value ? v.sendView(n.value || "", r.propertyInfo?.name || "", A()) : n.value && v.sendView(n.value, r.propertyInfo?.name || ""),
            v.sendEvent({
                name: u.value ? "EMBED_SCRIPT_INITIALIZED" : "EMBED_INITIALIZED",
                propertyId: n.value,
                propertyName: r.propertyInfo?.name,
                propertyOwnerName: r.propertyInfo?.owner?.name,
                embedMetadata: A(),
                msg: M()
            }),
            n.value && !p.value && (await C(n.value),
            _.setIsReady(!0))
        }
        ),
        (e, s) => {
            const O = T
              , V = ne
              , B = de
              , $ = ve
              , L = ae;
            return t(p) ? (o(),
            i(j, {
                key: 0,
                "hide-logo": t(u),
                error: {
                    statusCode: 404,
                    message: t(l)
                }
            }, null, 8, ["hide-logo", "error"])) : (o(),
            y(te, {
                key: 1
            }, [t(_).marzipanoReady ? c("", !0) : H((o(),
            i(O, {
                key: 0,
                src: t(r).propertyInfo?.previewImage,
                alt: "property thumbnail",
                class: "property-thumbnail",
                preload: ""
            }, null, 8, ["src"])), [[W, t(r).propertyInfo?.previewImage]]), N("div", Ie, [f(V, {
                "in-focus": !0
            })]), t(h).noSceneFound ? (o(),
            i(ue, {
                key: 1
            })) : c("", !0), t(_).marzipanoReady && !t(h).noSceneFound ? (o(),
            y("div", ge, [(o(),
            i(K(t(r).isEmbedActive ? t(P) : null), {
                "is-embed-request": t(u),
                "is-portrait": t(E)
            }, null, 8, ["is-embed-request", "is-portrait"])), N("div", we, [f(B)]), t(r).isEmbedActive ? c("", !0) : (o(),
            i($, {
                key: 0
            })), t(r).isEmbedActive ? c("", !0) : (o(),
            i(L, {
                key: 1,
                title: "Plan Expired",
                description: "Please upgrade your plan to embed this place"
            }))])) : c("", !0), t(D) ? (o(),
            i(ie, {
                key: 3,
                "property-info": t(r).propertyInfo
            }, null, 8, ["property-info"])) : c("", !0), f(ee, {
                name: "quality-right"
            }, {
                default: X( () => [t(_).isToggleQuality ? (o(),
                i(pe, {
                    key: 0,
                    custom: !0,
                    class: "quality-dropdwon"
                })) : c("", !0)]),
                _: 1
            }), t(R) ? (o(),
            i(ce, {
                key: 4,
                "property-info": t(r).propertyInfo
            }, null, 8, ["property-info"])) : c("", !0)], 64))
        }
    }
}
  , Re = g(Pe, [["__scopeId", "data-v-98d0e144"]]);
export {Re as default};
//# sourceMappingURL=Dp93hb8-.js.map
