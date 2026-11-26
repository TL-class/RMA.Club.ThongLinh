import {_ as F} from "./B1R2zV4_.js";
import {_ as C} from "./gaYZnnBY.js";
import {k as U, a9 as V, o as d, g as S, a as e, l as R, a3 as M, a5 as W, y as v, m as t, Y, ak as X, q as H, am as J, G as g, A as m, n as Q, e as Z, c as E, a4 as T, $ as ee, a2 as te, ao as oe, aa as se} from "./DOnB0cMv.js";
const re = {
    class: "no-scene-page"
}
  , ae = {
    key: 0,
    class: "nav"
}
  , ne = {
    class: "scene-container"
}
  , le = {
    class: "content"
}
  , ie = {
    class: "app-links-container"
}
  , ce = {
    href: "https://play.google.com/store/apps/details?id=com.travvir.studio",
    class: "app-link",
    target: "_blank",
    "aria-label": "Download from Google Play Store"
}
  , ue = {
    href: "https://apps.apple.com/in/app/travvir-360-views-from-phone/id6443536819",
    class: "app-link",
    target: "_blank",
    "aria-label": "Download from App Store"
}
  , pe = {
    __name: "NoSceneFound",
    setup(u) {
        const a = V("isPortrait");
        return (i, s) => {
            const p = F
              , n = C;
            return d(),
            S("div", re, [e(a) ? (d(),
            S("div", ae, [R(p, {
                to: "/",
                class: "logo",
                external: "",
                "aria-label": "go to home"
            }, {
                default: M( () => [...s[1] || (s[1] = [W("Travvir", -1)])]),
                _: 1
            })])) : v("", !0), t("div", ne, [t("div", le, [s[3] || (s[3] = t("p", {
                class: "scene-message"
            }, "No Scan Available", -1)), s[4] || (s[4] = t("p", {
                class: "scene-description"
            }, " Create your first 360° scan using our mobile app. ", -1)), t("div", ie, [t("a", ce, [R(n, {
                src: "https://d19e0oo8ox6zs5.cloudfront.net/static/images/play-store.png",
                alt: "Google Play Store",
                class: "play-store-img",
                width: "135",
                height: "40"
            })]), t("a", ue, [R(n, {
                src: "https://d19e0oo8ox6zs5.cloudfront.net/static/images/AppStore.png",
                alt: "Apple App Store",
                class: "app-store-img",
                width: "135",
                height: "40"
            })])]), v("", !0)])])])
        }
    }
}
  , Ne = U(pe, [["__scopeId", "data-v-8b08ff24"]])
  , K = Y("travvir:debut-nuxt:composables:useTourAccess")
  , de = "kanri_token"
  , x = m("")
  , N = m(null)
  , w = m("")
  , b = m("");
let O = !1;
const A = m(!1)
  , I = m(!1)
  , P = m(!1)
  , k = m(!1);
function ve() {
    return typeof window > "u" || !window.localStorage ? "" : localStorage.getItem(de) || ""
}
const z = () => {
    const u = X()
      , {$busSocket: a} = H()
      , i = V("busSocket")
      , s = J()
      , p = Q()
      , n = g( () => s.propertyInfo?.visibility === "protected")
      , _ = g( () => s.propertyInfo?.visibility === "private")
      , l = g( () => n.value && !A.value && !!s.propertyInfo?.id)
      , y = g( () => _.value && I.value && !A.value && !!s.propertyInfo?.id);
    function h(o) {
        if (o?.code === "INCORRECT_PASSWORD") {
            w.value = "Wrong password",
            P.value = !1;
            return
        }
        _.value && (k.value || I.value) && (b.value = "Invalid credentials",
        I.value = !0,
        k.value = !1)
    }
    function B(o) {
        K("TourData", o);
        const r = o?.scenes;
        o && Array.isArray(r) && (u.setSceneList(r),
        A.value = !0,
        w.value = "",
        b.value = "",
        I.value = !1,
        P.value = !1,
        k.value = !1)
    }
    function c() {
        O || !i || (i.on("error", h),
        i.on("TOUR", B),
        O = !0)
    }
    function $() {
        x.value = "",
        w.value = "",
        b.value = "",
        A.value = !1,
        I.value = !1,
        P.value = !1,
        k.value = !1
    }
    function f(o) {
        const r = ve();
        if (!r) {
            I.value = !0;
            return
        }
        k.value = !0,
        b.value = "",
        a.getTour(o, void 0, r)
    }
    const G = async o => {
        try {
            if (!o)
                return;
            if (N.value !== o && $(),
            N.value = o,
            c(),
            _.value) {
                f(o);
                return
            }
            n.value || a.getTour(o)
        } catch (r) {
            K("Error initializing tour access", r)
        }
    }
      , L = o => {
        const r = typeof o == "string" ? o.trim() : x.value.trim();
        !N.value || !r || P.value || (x.value = r,
        w.value = "",
        P.value = !0,
        a.getTour(N.value, r))
    }
      , j = () => {
        w.value = ""
    }
      , D = () => {
        b.value = ""
    }
    ;
    return {
        password: x,
        passwordError: w,
        privateAuthError: b,
        isTourUnlocked: A,
        isSubmittingPassword: P,
        isAwaitingPrivateAuth: k,
        isPlacePasswordProtected: l,
        isPlacePrivateProtected: y,
        initTourAccess: G,
        handlePasswordSubmit: L,
        clearPasswordError: j,
        clearPrivateAuthError: D,
        handlePrivateSignIn: () => {
            D();
            const o = p.public.NUXT_BASE_URL || ""
              , r = encodeURIComponent(window.location.href)
              , q = `${o}/app/auth/login${r ? `?redirect=${r}` : ""}`;
            window.location.href = q
        }
    }
}
  , fe = {
    class: "password-protect"
}
  , me = {
    class: "header-title"
}
  , ge = {
    class: "wrapper"
}
  , _e = ["disabled"]
  , ye = {
    key: 1,
    class: "error"
}
  , he = ["disabled"]
  , we = {
    __name: "PasswordProtect",
    props: {
        propertyInfo: {
            type: Object,
            required: !0
        }
    },
    setup(u) {
        const a = u
          , {password: i, passwordError: s, isSubmittingPassword: p, handlePasswordSubmit: n, clearPasswordError: _} = z()
          , l = m(null)
          , y = g( () => a.propertyInfo?.previewImage || "")
          , h = g( () => a.propertyInfo?.owner?.image || a.propertyInfo?.creator?.image || "");
        return Z( () => {
            l.value?.focus()
        }
        ),
        (B, c) => {
            const $ = C;
            return d(),
            S("div", fe, [e(y) ? (d(),
            E($, {
                key: 0,
                src: e(y),
                alt: "property thumbnail",
                class: "password-protect__bg",
                preload: ""
            }, null, 8, ["src"])) : v("", !0), c[4] || (c[4] = t("div", {
                class: "password-protect__veil"
            }, null, -1)), t("main", null, [t("header", null, [e(h) ? (d(),
            E($, {
                key: 0,
                format: "avif",
                height: "48",
                width: "48",
                class: "thumbnail",
                src: e(h),
                alt: `${u.propertyInfo.name} logo`,
                loading: "lazy"
            }, null, 8, ["src", "alt"])) : v("", !0), t("div", me, T(u.propertyInfo.name), 1)]), t("section", null, [v("", !0), t("div", ge, [ee(t("input", {
                ref_key: "passwordInputRef",
                ref: l,
                "onUpdate:modelValue": c[0] || (c[0] = f => se(i) ? i.value = f : null),
                type: "password",
                placeholder: "Enter password",
                class: "password-input",
                autocomplete: "current-password",
                disabled: e(p),
                onInput: c[1] || (c[1] = (...f) => e(_) && e(_)(...f)),
                onKeydown: c[2] || (c[2] = oe( (...f) => e(n) && e(n)(...f), ["enter"]))
            }, null, 40, _e), [[te, e(i)]])]), e(s) ? (d(),
            S("p", ye, T(e(s)), 1)) : v("", !0), t("button", {
                class: "unlock-btn",
                disabled: !e(i).trim() || e(p),
                onClick: c[3] || (c[3] = (...f) => e(n) && e(n)(...f))
            }, T(e(p) ? "Unlocking…" : "View Tour"), 9, he)])])])
        }
    }
}
  , Ee = U(we, [["__scopeId", "data-v-3420789a"]])
  , be = {
    class: "private-protect"
}
  , Ie = {
    class: "private-protect__panel"
}
  , Pe = {
    class: "header-title"
}
  , ke = {
    key: 0,
    class: "error",
    role: "alert"
}
  , Se = {
    __name: "PrivateProtect",
    props: {
        propertyInfo: {
            type: Object,
            required: !0
        }
    },
    setup(u) {
        const a = u
          , {privateAuthError: i, handlePrivateSignIn: s} = z()
          , p = g( () => a.propertyInfo?.previewImage || "")
          , n = g( () => a.propertyInfo?.owner?.image || a.propertyInfo?.creator?.image || "");
        return (_, l) => {
            const y = C;
            return d(),
            S("div", be, [e(p) ? (d(),
            E(y, {
                key: 0,
                src: e(p),
                alt: "property thumbnail",
                class: "private-protect__bg",
                preload: ""
            }, null, 8, ["src"])) : v("", !0), l[4] || (l[4] = t("div", {
                class: "private-protect__veil"
            }, null, -1)), t("main", Ie, [v("", !0), t("header", null, [e(n) ? (d(),
            E(y, {
                key: 0,
                format: "avif",
                height: "40",
                width: "40",
                class: "thumbnail",
                src: e(n),
                alt: `${u.propertyInfo.name} logo`,
                loading: "lazy"
            }, null, 8, ["src", "alt"])) : v("", !0), t("div", Pe, T(u.propertyInfo.name), 1)]), t("section", null, [l[2] || (l[2] = t("h1", {
                class: "title"
            }, "This place is private", -1)), l[3] || (l[3] = t("p", {
                class: "subtitle"
            }, " Sign in with your account to unlock and view this tour. ", -1)), e(i) ? (d(),
            S("p", ke, T(e(i)), 1)) : v("", !0), t("button", {
                class: "signin-btn",
                type: "button",
                onClick: l[0] || (l[0] = (...h) => e(s) && e(s)(...h))
            }, " Sign in to view ")])])])
        }
    }
}
  , Re = U(Se, [["__scopeId", "data-v-24d16339"]]);
export {Ne as N, Ee as P, Re as a, z as u};
//# sourceMappingURL=BMIS6vMC.js.map
