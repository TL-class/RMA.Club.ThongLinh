import {k as n, a9 as l, o as i, g as s, m as t, a5 as c, a4 as o, y as d, a8 as p, a as u} from "./DOnB0cMv.js";
const v = {
    class: "inactive-popup"
}
  , _ = {
    id: "inactive-title",
    class: "inactive-title"
}
  , m = {
    key: 0,
    class: "inactive-message"
}
  , g = {
    __name: "InactivePopUp",
    props: {
        title: {
            type: String,
            default: "Plan Expired"
        },
        description: {
            type: String,
            default: ""
        }
    },
    setup(e) {
        const r = l("isPortrait");
        return (h, a) => (i(),
        s("div", {
            class: p(["inactive-overlay", {
                isPortrait: u(r)
            }]),
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "inactive-title"
        }, [t("div", v, [t("p", _, [a[0] || (a[0] = t("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "lucide lucide-triangle-alert-icon lucide-triangle-alert"
        }, [t("path", {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        }), t("path", {
            d: "M12 9v4"
        }), t("path", {
            d: "M12 17h.01"
        })], -1)), c(" " + o(e.title), 1)]), e.description ? (i(),
        s("p", m, o(e.description), 1)) : d("", !0)])], 2))
    }
}
  , k = n(g, [["__scopeId", "data-v-fdb2ac4d"]]);
export {k as _};
//# sourceMappingURL=Dqan8qcG.js.map
