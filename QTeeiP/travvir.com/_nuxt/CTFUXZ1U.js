const s = function() {
    return document.ontouchstart !== null ? "click" : "touchstart"
}
  , e = "__vue_click_away__"
  , d = function(t, n, o) {
    i(t);
    let l = o.context
      , c = n.value
      , u = !1;
    setTimeout(function() {
        u = !0
    }, 0),
    t[e] = function(a) {
        if ((!t || !t.contains(a.target)) && c && u && typeof c == "function")
            return c.call(l, a)
    }
    ,
    document.addEventListener(s(), t[e], !1)
}
  , i = function(t) {
    document.removeEventListener(s(), t[e], !1),
    delete t[e]
}
  , r = function(t, n, o) {
    n.value !== n.oldValue && d(t, n, o)
}
  , f = {
    mounted: d,
    updated: r,
    unmounted: i
};
export {f as d};
//# sourceMappingURL=CTFUXZ1U.js.map
