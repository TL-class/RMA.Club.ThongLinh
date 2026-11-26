import {k as y, al as h, ak as q, o as a, g as c, m as o, a4 as x, a as _, z as A, G as v, L as m, aq as D, a8 as l, y as g, l as p, $ as O, c as S, ar as w, as as P, q as b, n as T, Y as L, am as I} from "./DOnB0cMv.js";
import {Q as z, _ as R, a as N} from "./_3ZbIu3x.js";
import {d as Q} from "./CTFUXZ1U.js";
import {g as V, c as U} from "./BGN06MKu.js";
const G = {
    __name: "AreaCovered",
    setup(e) {
        const n = h()
          , t = q()
          , f = v( () => "")
          , s = v( () => {
            let r = t.getScene.length
              , i = Object.values(n.scenes)?.filter(u => u.visited);
            return Math.round(i.length / r * 100)
        }
        );
        return (r, i) => (a(),
        c("div", {
            class: "area-covered",
            style: A(_(f))
        }, [o("p", null, x(_(s)) + "%", 1), i[0] || (i[0] = o("p", null, "Viewed", -1))], 4))
    }
}
  , k = y(G, [["__scopeId", "data-v-20cd377b"]])
  , M = L("travvir:debut-nuxt:components:actionBar:index")
  , {$isIPhone: j} = b()
  , X = {
    name: "ActionBar",
    components: {
        RiFullscreenExitLine: U,
        RiFullscreenLine: V,
        Dropdown: R,
        QualityController: z,
        AreaCovered: k
    },
    directives: {
        clickAway: Q
    },
    props: {
        autoOpenDropdown: {
            type: Boolean,
            default: !1
        },
        ready: {
            type: Boolean,
            default: !1
        },
        isEmbedRequest: {
            type: Boolean,
            default: !1
        },
        isPortrait: {
            type: Boolean,
            default: !1
        }
    },
    data() {
        return {
            isTutorialOn: !1,
            isFullScreen: !1,
            drawerOverlay: !1,
            viewerStore: h(),
            config: T()
        }
    },
    computed: {
        baseUrl() {
            return this.config.public.NUXT_BASE_URL
        },
        isMobile() {
            const {$device: e} = b();
            return e.isMobile
        },
        shouldShowButtons() {
            return !(j || this.isPortrait || this.owner?.firm?.id == "66518a972841394ce7b28d57")
        },
        ...P(I, ["owner", "extraResources", "tourScenes", "sceneGroups"])
    },
    mounted() {
        w.on("change", () => {
            this.isFullScreen = w.isFullscreen
        }
        )
    },
    methods: {
        onClickAway() {
            this.isPortrait && (this.viewerStore.isToggleQuality = !1)
        },
        async fullScreenToggle() {
            await this.viewerStore.toggleFullScreen()
        },
        async changeSceneFromDropdown(e) {
            M("changing scene from dropdown", e),
            this.viewerStore.setCurrentScene(e)
        }
    }
}
  , Y = ["href"]
  , H = {
    class: "group-icons-container"
}
  , J = {
    class: "group-icons quality-controller"
};
function K(e, n, t, f, s, r) {
    const i = k
      , u = R
      , C = m("QualityController")
      , F = m("RiFullscreenExitLine")
      , B = m("RiFullscreenLine")
      , E = D("click-away");
    return a(),
    c("div", {
        class: l(["action-controller", {
            "drawer-open": s.drawerOverlay,
            "top-shift": e.$device.isIOS && !1,
            tutorial: s.isTutorialOn,
            isIPhone: e.$isIPhone
        }])
    }, [o("div", {
        class: l(["top-bar", {
            isPortrait: t.isPortrait
        }])
    }, [o("div", {
        class: l(["left", {
            hidden: s.isTutorialOn
        }])
    }, [!t.isEmbedRequest || s.isFullScreen ? (a(),
    c("a", {
        key: 0,
        href: r.baseUrl,
        target: "_blank",
        rel: "noopener noreferrer"
    }, [...n[2] || (n[2] = [o("img", {
        src: N,
        alt: "travvir icon"
    }, null, -1)])], 8, Y)) : g("", !0), p(i, {
        class: l({
            isEmbedRequest: !t.isEmbedRequest,
            isEmebdRequestAndFullScreen: t.isEmbedRequest && s.isFullScreen
        })
    }, null, 8, ["class"])], 2), p(u, {
        id: "Dropdown",
        scenes: e.tourScenes,
        class: l({
            isEmbedRequest: t.isEmbedRequest
        }),
        groups: e.sceneGroups,
        onChange: n[0] || (n[0] = d => r.changeSceneFromDropdown(d))
    }, null, 8, ["scenes", "class", "groups"]), o("div", H, [o("div", J, [O(p(C, {
        custom: !0
    }, null, 512), [[E, r.onClickAway]])]), r.shouldShowButtons ? (a(),
    c("div", {
        key: 0,
        class: l(["group-icons", {
            hidden: s.isTutorialOn
        }])
    }, [o("div", {
        class: "fullscreen icon",
        onClick: n[1] || (n[1] = (...d) => r.fullScreenToggle && r.fullScreenToggle(...d))
    }, [s.isFullScreen ? (a(),
    S(F, {
        key: 0,
        size: "3em"
    })) : (a(),
    S(B, {
        key: 1,
        size: "3em"
    }))])], 2)) : g("", !0)])], 2)], 2)
}
const se = y(X, [["render", K], ["__scopeId", "data-v-6014d784"]]);
export {se as default};
//# sourceMappingURL=Ymr2MJyM.js.map
