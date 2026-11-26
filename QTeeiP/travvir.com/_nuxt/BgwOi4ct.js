import {k as F, ak as M, al as V, a9 as G, am as O, Y as U, e as D, $ as k, a as n, o as c, g as u, m as o, F as R, x as W, a8 as b, c as Y, z as H, a0 as J, y as K, a5 as X, a4 as S, G as g, q as Z} from "./DOnB0cMv.js";
import {a as ee} from "./BGN06MKu.js";
import {d as te} from "./CTFUXZ1U.js";
const se = {
    class: "quality-list__header"
}
  , oe = {
    key: 0,
    style: {
        transform: "rotate(180deg)"
    },
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
}
  , ie = {
    key: 1,
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2.5",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
}
  , re = {
    class: "quality-list__options"
}
  , ne = ["id", "disabled", "onClick"]
  , le = {
    class: "quality-list__check"
}
  , ae = {
    class: "quality-list__label"
}
  , ce = {
    class: "quality-list__badge"
}
  , ue = {
    __name: "QualityDropdown",
    props: {
        custom: {
            type: Boolean,
            default: !1
        }
    },
    setup(C) {
        const x = M()
          , i = V()
          , m = G("isPortrait")
          , r = O()
          , v = U("travvir:debut-nuxt:components:actionQualityController:QualityDropdown")
          , L = C
          , y = g( () => L.custom || m.value);
        function $() {
            m.value || (i.isToggleQuality = !1)
        }
        function q(e) {
            r.selectedLevels = e.value,
            P(r.selectedLevels),
            i.isToggleQuality = !1
        }
        const Q = g( () => x.getScene.find(e => e.sceneId === i.selectedSceneId) ?? []);
        function P(e) {
            if (!i.viewer || !i.currentScene)
                return;
            v("Quality level changed to:", e);
            const {$marzipano: s, $isAppleChrome: t, $isAppleWebview: d, $isMacSafari: j, $isIPhone: z} = Z();
            let _ = "bdflru";
            (t || d || j || z) && (_ = "urlfdb");
            const A = i.selectedSceneId
              , h = r.propertyInfo.imagePath;
            Object.values(i.scenes).forEach(l => {
                const a = l?._scene;
                if (!a || !l.levels?.length)
                    return;
                let p = l.levels;
                e != null && p.length && (p = p.slice(0, e + 1));
                const N = new s.CubeGeometry(p)
                  , T = `${h}/${l.id}/{z}/{f}/{y}/{x}.jpg`
                  , E = new s.ImageUrlSource.fromString(T,{
                    cubeMapPreviewUrl: `${h}/${l.id}/preview.jpg`,
                    cubeMapPreviewFaceOrder: _
                })
                  , w = a.listLayers();
                a.createLayer({
                    source: E,
                    geometry: N,
                    pinFirstLevel: !0
                }),
                l.id === A ? (a.hotspotContainer().show(),
                setTimeout( () => f(w, a), 500)) : f(w, a)
            }
            )
        }
        function f(e, s) {
            !e?.length || !s || e.forEach(t => {
                try {
                    s.destroyLayer(t)
                } catch (d) {
                    v("destroyLayer cleanup warning (safe to ignore):", d.message)
                }
            }
            )
        }
        function I() {
            r.levelsLimit && r.resolutionCategories.forEach(e => {
                e.subscription = e.value <= r.levelsLimit
            }
            )
        }
        const B = g( () => r.resolutionCategories.filter(e => e.value != Q.value.levels.length));
        return D( () => {
            I()
        }
        ),
        (e, s) => k((c(),
        u("div", {
            class: b(["quality-list", {
                portrait_mode: n(y)
            }])
        }, [o("div", se, [o("div", {
            class: "quality-list__back",
            onClick: s[0] || (s[0] = t => n(i).isToggleQuality = !1)
        }, [n(y) ? (c(),
        u("svg", oe, [...s[1] || (s[1] = [o("polyline", {
            points: "15 18 9 12 15 6"
        }, null, -1)])])) : (c(),
        u("svg", ie, [...s[2] || (s[2] = [o("polyline", {
            points: "6 9 12 15 18 9"
        }, null, -1)])]))]), s[3] || (s[3] = o("span", {
            class: "quality-list__title"
        }, "Quality", -1))]), o("ul", re, [(c(!0),
        u(R, null, W(n(B), t => (c(),
        u("li", {
            id: t.value,
            key: t.value,
            disabled: !t.subscription,
            class: b({
                "is-locked": !t.subscription
            }),
            onClick: d => t.subscription && q(t)
        }, [o("span", le, [t.subscription ? k((c(),
        Y(n(ee), {
            key: 0,
            size: "14px",
            style: H(n(y) ? "padding-top: 0.05rem" : "padding-top: 0.1rem")
        }, null, 8, ["style"])), [[J, n(r).selectedLevels === t.value]]) : K("", !0)]), o("span", ae, [X(S(t.name) + " ", 1), o("sup", ce, S(t.subName), 1)])], 10, ne))), 128))])], 2)), [[n(te), $]])
    }
}
  , ge = F(ue, [["__scopeId", "data-v-d7c4a84f"]]);
export {ge as Q};
//# sourceMappingURL=BgwOi4ct.js.map
