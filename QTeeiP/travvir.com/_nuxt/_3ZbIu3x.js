import {k as g, $ as S, a0 as w, o, g as u, m as f, a4 as C, c as h, a8 as r, a as s, y as b, w as k, F as Q, x, a1 as D, A as E, q as V, l as y, G as p, aK as N, Y as R, ak as J, al as O, a9 as M, ae as T, am as $} from "./DOnB0cMv.js";
import {B as _, D as j} from "./BGN06MKu.js";
const ue = "data:image/x-icon;base64,AAABAAEAAAAAAAEAIABVAwAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgAAAAAeRn3ugAAAAFvck5UAc+id5oAAAMPSURBVHja7dtPSJNxGMDx3zbX1IFs649hSEphxiwMg0g0qA4VHQKLkpGUEAplp24FRoRUUlhRFIKXDlpE5imSiLAg0ugSlRWmBsvyv65hS9veOmp7Fy9Eb+98vp/z87wv75cd9r7vphQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAsbq/HJN40mwWv31n7tMMkj6tdFgyw4JZmmvp0KwZoNi/AWQIQgAAEIAABCEAAAhCAAAQgAAEIQAACEMACAVrMC3DOkgEaQyOGjIYTXFYsbOwAI2O1aRYMYN8Y2GdIoCmmHyB8ba+xI5SvdST1G5TqqH6A0QoZb5BSDicIMFZJAAIQgAAEIAAB/si5viReaUGq7rB3VfG2skBFZVXV/t07/PZ5EWDRw3fxepqWxQ16Nh25dOfJm+D41PSvr57fx4MXXfMiwNKPersPcueew7v9QseH0NyZltR5ESCzV2+3PWfWiCv/2LOR6d9Hos1CAtj8J9/O6IxICZB1tEv/blNGgJQtrVMJHjeICOCu7kn4GElCgCXnJzTJAbIav2mSA2Rej2iSA2TUTWmSA9gOjWuSAywv6tEkB7i/oTUqOkD71ZAmOkBwSJMdwAACEIAABJAXIBKeGB0eHBoeC0ViN6UFiPQ/v326alfputX+oq0HTrXVuUQFCLYd37xw9h8sHRk2QQF6G3b6lEWZEGD4SnG6UmID/Ojc41ZKboDwjRV2JTjA13qfUoIDhM54lOQAM41eJTrAvWwlOkB/iRIdYOZEiuwAXblKdIBYjUN2gJeFSnaAy+myA0wmyc/t/1mAF4XCA9x1yw4Qa1CyA0zWCA/wuUx4gL4S4QHerxEeoDtPeIDXOcIDvMomAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAP8vQOyvAvQlewDHwU8Der50lxtZX9ypuz0w+CgrSQLYfH59+R5DH6A8/e2ClU4FAAAAAAAAAAAAAAAAAAAAAAAAAAAA6PoJaL9hWyaJ6bAAAAAASUVORK5CYII="
  , H = ["textContent"]
  , W = {
    __name: "Picked",
    props: {
        selected: {
            type: String,
            default: ""
        },
        isOpen: {
            type: Boolean,
            default: !1
        },
        isDownArrowActive: {
            type: Boolean,
            default: !0
        },
        disabled: {
            type: Boolean,
            default: !1
        }
    },
    setup(e) {
        return (m, i) => S((o(),
        u("div", {
            class: r(["picker", {
                "is-open": e.isOpen
            }])
        }, [f("span", {
            class: "sceneName",
            textContent: C(e.selected)
        }, null, 8, H), e.isDownArrowActive ? (o(),
        h(s(_), {
            key: 0,
            class: r(["caret", {
                rotate: e.isOpen,
                disabled: e.disabled
            }]),
            size: "1.5em"
        }, null, 8, ["class"])) : b("", !0)], 2)), [[w, e.selected]])
    }
}
  , G = g(W, [["__scopeId", "data-v-fb8126e3"]])
  , X = {
    style: {
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    }
}
  , q = {
    class: "sub-menu"
}
  , Z = ["id", "data-id", "onClick"]
  , Y = {
    __name: "SubItem",
    props: {
        items: {
            type: Array,
            required: !0
        },
        label: {
            type: String,
            default: ""
        },
        visited: {
            type: Boolean,
            default: !1
        },
        selectedScene: {
            type: String,
            default: ""
        }
    },
    emits: ["change"],
    setup(e, {emit: m}) {
        const i = E(!1)
          , v = m
          , c = e
          , t = (n, A) => {
            A && v("change", n)
        }
          , a = () => {
            c.selectedScene && c.items.length && c.items.some(A => A.dataId === c.selectedScene) && (i.value = !0)
        }
        ;
        return k([ () => c.selectedScene, () => c.items], () => {
            a()
        }
        , {
            immediate: !0
        }),
        (n, A) => (o(),
        u("div", {
            class: "wrapper",
            onClick: A[0] || (A[0] = l => i.value = !i.value)
        }, [f("div", X, [f("p", {
            class: r({
                unseen: !e.visited
            })
        }, C(e.label), 3), e.items.length ? (o(),
        h(s(_), {
            key: 0,
            class: r(["caret", {
                rotate: i.value
            }]),
            alt: "caret"
        }, null, 8, ["class"])) : b("", !0)]), S(f("ul", q, [(o(!0),
        u(Q, null, x(e.items, l => (o(),
        u("li", {
            id: l.dataId,
            key: l.dataId,
            class: r({
                "is-active": e.selectedScene == l.dataId,
                isDisabled: !l.isActive
            }),
            "data-id": l.dataId,
            onClick: D(I => t(l.dataId, l.isActive), ["stop"])
        }, C(l.label), 11, Z))), 128))], 512), [[w, e.items.length && i.value]])]))
    }
}
  , K = g(Y, [["__scopeId", "data-v-0a59ff29"]])
  , L = ["id", "data-id"]
  , z = {
    __name: "DropdownItem",
    props: {
        dataId: {
            type: String,
            default: ""
        },
        label: {
            type: String,
            default: ""
        },
        selectedScene: {
            type: Object,
            default: null
        },
        visited: {
            type: Boolean,
            default: !1
        },
        items: {
            type: Array,
            default: () => []
        },
        isActive: {
            type: Boolean,
            default: !0
        }
    },
    emits: ["select"],
    setup(e, {emit: m}) {
        const i = m
          , {$device: v} = V()
          , c = p( () => v.isMobile);
        function t(a) {
            a && i("select", a)
        }
        return (a, n) => (o(),
        u("li", {
            id: e.dataId,
            "data-id": e.dataId,
            class: r(["dropdown-item", {
                isMobile: s(c),
                "selected-item": e.selectedScene?.id == e.dataId
            }]),
            onClick: n[1] || (n[1] = D(A => t(e.dataId), ["stop"]))
        }, [y(K, {
            "selected-scene": e.selectedScene?.id,
            items: e.items || [],
            label: e.label,
            "is-active": e.isActive,
            visited: e.visited,
            onChange: n[0] || (n[0] = A => t(A))
        }, null, 8, ["selected-scene", "items", "label", "is-active", "visited"])], 10, L))
    }
}
  , ee = g(z, [["__scopeId", "data-v-677bbd60"]])
  , te = {
    class: "dropdown-container"
}
  , se = {
    class: "dropdown-list"
}
  , ae = {
    __name: "DropdownMenu",
    props: {
        listItems: {
            type: Array,
            default: () => []
        },
        selectedScene: {
            type: Object,
            default: null
        }
    },
    emits: ["change"],
    setup(e, {emit: m}) {
        const i = m
          , v = (c, t) => {
            t && i("change", c)
        }
        ;
        return (c, t) => (o(),
        u("div", te, [f("ul", se, [(o(!0),
        u(Q, null, x(e.listItems, a => (o(),
        h(ee, N({
            id: a.dataId,
            ref_for: !0,
            ref: "dropdownItem",
            key: a.dataId
        }, {
            ref_for: !0
        }, a, {
            "selected-scene": e.selectedScene,
            class: {
                active: e.selectedScene.id == a.dataId,
                isDisabled: !a.isActive
            },
            onSelect: n => v(n, a.isActive)
        }), null, 16, ["id", "selected-scene", "class", "onSelect"]))), 128))])]))
    }
}
  , ne = g(ae, [["__scopeId", "data-v-25a90bab"]])
  , le = {
    __name: "index",
    props: {
        disabled: {
            type: Boolean,
            default: !1
        }
    },
    emits: ["change"],
    setup(e, {emit: m}) {
        const i = e
          , v = m
          , c = R("travvir:debut-nuxt:components:dropdown:index")
          , t = E(!1)
          , a = J()
          , n = O()
          , A = M("isPortrait")
          , l = p( () => {
            const d = n.getSceneById(n.selectedSceneId);
            return d || ""
        }
        )
          , I = p( () => (c("listItems", a.getDropdownScene),
        a.getDropdownScene))
          , F = () => {
            i.disabled || (t.value = !t.value,
            U())
        }
        ;
        k( () => i.disabled, d => {
            d && (t.value = !1)
        }
        );
        const B = p( () => I.value?.length ? I.value?.length == 1 ? I.value[0]?.items.length > 1 : !0 : !1)
          , P = d => {
            c("Selected scene:", d),
            v("change", d),
            t.value = !1
        }
          , U = () => {
            t.value && T( () => {
                const d = document.getElementById(l.value?.id);
                d && d.scrollIntoView({
                    behavior: "instant",
                    block: "nearest"
                })
            }
            )
        }
        ;
        return (d, Ae) => (o(),
        u("div", {
            class: r(["dropdown", {
                "is-open": s(t),
                "is-portrait": s(A),
                "is-disabled": e.disabled
            }]),
            onClick: F
        }, [y(G, {
            disabled: e.disabled,
            selected: s(l)?.name,
            "is-open": s(t),
            "is-down-arrow-active": s(B)
        }, null, 8, ["disabled", "selected", "is-open", "is-down-arrow-active"]), s(B) ? S((o(),
        h(ne, {
            key: 0,
            ref: "dropdownMenu",
            "list-items": s(I),
            "selected-scene": s(l),
            onChange: P
        }, null, 8, ["list-items", "selected-scene"])), [[w, s(t)]]) : b("", !0)], 2))
    }
}
  , me = g(le, [["__scopeId", "data-v-a4858663"]])
  , ie = {
    key: 0
}
  , ce = {
    class: "hd-badge"
}
  , oe = {
    __name: "Index",
    props: {
        custom: {
            type: Boolean,
            default: !1
        }
    },
    setup(e) {
        const m = M("isPortrait")
          , i = O()
          , v = $()
          , c = e
          , t = p( () => c.custom || m.value)
          , a = p( () => {
            const l = v.resolutionCategories.find(I => I.value === v.selectedLevels);
            return !l || l.value === 1 ? "" : l.subName
        }
        )
          , n = p( () => ({
            buttonWrapperClass: t.value ? "wrapper" : "icon-wrapper",
            buttonClass: t.value ? "quality" : "share",
            iconClass: t.value ? "icon" : "shareIcon qualityIcon",
            badgeContainerClass: t.value ? "hd-mobile-badge_container" : "hd-badge_container"
        }));
        function A() {
            i.isToggleQuality = !i.isToggleQuality
        }
        return (l, I) => (o(),
        u("button", {
            class: r(s(n).buttonClass),
            onClick: A
        }, [s(t) ? b("", !0) : (o(),
        u("p", ie, "Quality")), f("div", {
            class: r(s(n).buttonWrapperClass)
        }, [y(s(j), {
            class: r(s(n).iconClass)
        }, null, 8, ["class"]), s(a) ? (o(),
        u("div", {
            key: 0,
            class: r(s(n).badgeContainerClass)
        }, [f("p", ce, C(s(a)), 1)], 2)) : b("", !0)], 2)], 2))
    }
}
  , ve = g(oe, [["__scopeId", "data-v-ce6eafb2"]]);
export {ve as Q, me as _, ue as a};
//# sourceMappingURL=_3ZbIu3x.js.map
