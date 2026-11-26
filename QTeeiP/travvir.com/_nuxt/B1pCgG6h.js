import {k as ce, at as le, q as O, ak as te, al as re, am as W, a9 as ne, e as ue, v as de, a as M, o as R, g as T, m as G, F as fe, x as we, a8 as Z, y as X, l as ve, z as J, a4 as ge, av as ee, G as _, A as z, Y as ie, aw as me, ax as Se, ay as ye, az as Ie, w as se, c as oe} from "./DOnB0cMv.js";
import {B as Me} from "./BGN06MKu.js";
import {L as Pe} from "./e3A67Q-e.js";
const be = ["width", "height"]
  , xe = ["transform"]
  , Le = ["onClick"]
  , ke = {
    __name: "ArrowControls",
    props: {
        size: {
            type: Number,
            default: 300
        },
        arrowSize: {
            type: Number,
            default: 36
        },
        switchingScene: {
            type: Boolean,
            default: !1
        }
    },
    emits: ["switchScene"],
    setup(x, {emit: r}) {
        const n = x
          , l = r
          , p = le();
        let h = null;
        const f = z(0)
          , u = z(0);
        let e = null;
        const {$device: g} = O()
          , $ = te()
          , c = re()
          , y = W()
          , P = ne("isPortrait")
          , F = _( () => (c?.currentScene?.linkHotspots?.filter(a => a.active !== !1)?.filter(a => a.target?.id !== void 0) || []).map(a => {
            const w = $.getScene.find(v => v.sceneId === a.target.id);
            return w ? {
                ...a,
                active: w.isActive
            } : a
        }
        ).filter(a => a.active))
          , L = _( () => {
            const t = F.value;
            if (!t.length)
                return null;
            let o = null
              , a = Number.MAX_VALUE;
            return t.forEach(w => {
                const v = Y(w.yaw, f.value);
                v < a && (a = v,
                o = w)
            }
            ),
            h = o,
            o
        }
        )
          , B = _( () => L.value ? c.getSceneById(L.value.target?.id)?.name : null)
          , H = _( () => g.isMobile)
          , V = _( () => u.value >= -.262)
          , D = _( () => u.value >= 1.309 ? 0 : {
            transform: `rotateX(${50 * (1 - Math.max(0, u.value) / 1.309)}deg)`
        })
          , Q = _( () => {
            let t = .325;
            return window.innerHeight <= 460 && !P.value && (t = .45),
            P.value && (t = -.01),
            p.name == "embed-propertyId" && (t = window.innerHeight <= 500 ? .42 : .36),
            {
                bottom: `${-t * n.size}px`
            }
        }
        )
          , Y = (t, o) => {
            const a = (t % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
              , w = (o % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            let v = Math.abs(a - w);
            return v > Math.PI && (v = 2 * Math.PI - v),
            v
        }
          , E = t => t.yaw - f.value
          , K = (t, o, a=50, w=50) => ({
            x: a + o * Math.sin(t),
            y: w - o * Math.cos(t)
        })
          , A = t => {
            const o = E(t)
              , {x: a, y: w} = K(o, 20)
              , v = o * (180 / Math.PI) + 180
              , q = -n.arrowSize / 2
              , C = -n.arrowSize / 2;
            return `translate(${a}, ${w}) rotate(${v}) translate(${q}, ${C})`
        }
          , i = () => {
            if (!L.value)
                return {
                    opacity: 0,
                    pointerEvents: "none"
                };
            const t = E(L.value)
              , o = 20
              , a = 4
              , w = n.size / 100
              , q = o * w + a
              , C = q * Math.sin(t)
              , j = -q * Math.cos(t)
              , pe = n.size / 2
              , he = n.size / 2;
            return {
                position: "absolute",
                left: `${pe}px`,
                top: `${he}px`,
                transformOrigin: "0 0",
                transform: `rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(${C}px) translateY(${j}px) translate(-50%, -50%)`,
                zIndex: 15,
                opacity: 1,
                pointerEvents: "none"
            }
        }
          , s = () => {
            c.viewer && c.viewer.view() && (f.value = c.viewer.view().yaw() || 0,
            u.value = c.viewer.view().pitch() || 0)
        }
          , d = () => {
            s(),
            e = ee(s, 25)
        }
          , m = () => {
            e && (clearInterval(e),
            e = null)
        }
          , I = (t, o) => {
            const a = F.value;
            if (!a.length)
                return null;
            let w = null
              , v = Number.MAX_VALUE;
            return a.forEach(q => {
                let C = q.yaw - f.value;
                for (; C > Math.PI; )
                    C -= 2 * Math.PI;
                for (; C < -Math.PI; )
                    C += 2 * Math.PI;
                const j = Math.min(Math.abs(C - t), Math.abs(Math.abs(C - t) - 2 * Math.PI));
                j < o && j < v && (v = j,
                w = q)
            }
            ),
            w
        }
          , b = t => {
            if (t.key === "ArrowUp") {
                const o = I(0, Math.PI / 2);
                o && S(o)
            } else if (t.key === "ArrowDown") {
                const o = I(Math.PI, Math.PI / 2);
                o && S(o)
            }
        }
          , k = t => {
            const o = c?.currentScene?._connections?.find(a => a.data?.target?.id == t.target?.id);
            return o ? c.activeHotspot === o.component.props.index : !1
        }
          , U = _( () => c.isConferenceViewer || y.ensureEmbedTabInActive(p) || y.ensureConferenceTabInActive(p))
          , S = t => {
            U.value || (H.value ? k(t) && l("switchScene", t) : l("switchScene", t))
        }
        ;
        return ue( () => {
            d(),
            window.addEventListener("keyup", b)
        }
        ),
        de( () => {
            m(),
            window.removeEventListener("keyup", b)
        }
        ),
        (t, o) => M(c).currentScene && !x.switchingScene && M(V) ? (R(),
        T("div", {
            key: 0,
            class: "arrow-controls",
            style: J(M(Q))
        }, [G("div", {
            class: "arrow-controls-container",
            style: J(M(D))
        }, [(R(),
        T("svg", {
            width: x.size,
            height: x.size,
            viewBox: "0 0 100 100"
        }, [(R(!0),
        T(fe, null, we(M(F), (a, w) => (R(),
        T("g", {
            key: w,
            transform: A(a)
        }, [M(H) ? (R(),
        T("rect", {
            key: 0,
            x: "-10",
            y: "-10",
            width: "25",
            height: "20",
            fill: "transparent",
            class: Z(["click-target", {
                "rect-icon-inactive": !k(a)
            }]),
            onClick: v => S(a)
        }, null, 10, Le)) : X("", !0), ve(M(Me), {
            color: "white",
            size: k(a) ? `${x.arrowSize}` : `${x.arrowSize * .9}`,
            class: Z(["arrow-icon", {
                "arrow-icon-inactive": !k(a) || M(U)
            }]),
            onClick: v => S(a)
        }, null, 8, ["size", "class", "onClick"])], 8, xe))), 128))], 8, be))], 4), G("div", {
            class: "target",
            style: J(i())
        }, [G("p", {
            class: Z(["target-name", {
                "conference-viewer": M(c).isConferenceViewer
            }]),
            onClick: o[0] || (o[0] = a => S(M(h)))
        }, ge(M(B)), 3)], 4)], 4)) : X("", !0)
    }
}
  , Ce = ce(ke, [["__scopeId", "data-v-189705b5"]])
  , ae = ie("travvir:debut-nuxt:viewer:scene:TextureLoader");
class _e {
    faces = ["b", "d", "f", "l", "r", "u"];
    limiter = 1e5;
    parallelLimiter = 5;
    queue = [];
    priorityQ = [];
    processed = [];
    processingQueue = !1;
    constructor() {
        this.propertyStore = W()
    }
    getImageURLs(r, n=3) {
        try {
            let l = [];
            const p = n;
            for (let h = 1; h <= p; h++) {
                let f = r.replace(/\{z\}/, h);
                for (let u = 0; u < 6; u++) {
                    let e = f.replace(/\{f\}/, this.faces[u]);
                    for (let g = 0; g < Math.pow(2, h - 1); g++) {
                        let $ = e.replace(/\{y\}/, g);
                        for (let c = 0; c < Math.pow(2, h - 1); c++) {
                            let y = $.replace(/\{x\}/, c);
                            l.push(y)
                        }
                    }
                }
            }
            return l
        } catch (l) {
            ae(l)
        }
    }
    getSceneURLs(r, n=3) {
        try {
            let l = `${this.propertyStore.propertyInfo.imagePath}/${r}/{z}/{f}/{y}/{x}.jpg`;
            return this.getImageURLs(l, n)
        } catch (l) {
            ae(l)
        }
    }
    getPreviewURLFromId(r) {
        return `${this.propertyStore.propertyInfo.imagePath}/${r}/preview.jpg`
    }
    getPreviewURL(r) {
        let n = r.split("/");
        return n = n.slice(0, n.length - 4),
        n.join("/") + "/preview.jpg"
    }
    loadSceneWithConnected(r, n=3) {
        let l = this.getSceneURLs(r.id, n)
          , p = [this.getPreviewURLFromId(r.id)];
        r.linkHotspots.forEach(f => {
            let u;
            typeof f.target == "string" ? (u = this.getSceneURLs(f.target, n),
            p.push(this.getPreviewURLFromId(f.target))) : (u = this.getSceneURLs(f.target.id, n),
            p.push(this.getPreviewURLFromId(f.target.id))),
            l = l.concat(u)
        }
        ),
        this.priorityQ = p.concat(this.priorityQ);
        let h = l?.filter(f => !this.processed.includes(f));
        this.queue = [...h],
        this.startQueue()
    }
    startQueue() {
        this.processingQueue || this.processQueue()
    }
    loadImages(r, n, l=3) {
        let p = this.getPreviewURL(r);
        this.priorityQ.push(p);
        let h = this.getImageURLs(r, l);
        n ? this.queue = h.concat(this.queue) : this.queue = this.queue.concat(h),
        this.startQueue()
    }
    processQueue() {
        if (this.priorityQ.length == 0 && this.queue.length === 0) {
            this.processingQueue = !1;
            return
        }
        if (this.processed.length >= this.limiter)
            return;
        this.processingQueue = !0;
        let n = (this.priorityQ.length > 0 ? this.priorityQ.splice(0, this.parallelLimiter) : this.queue.splice(0, this.parallelLimiter)).map(l => this.loadImage(l));
        Promise.all(n).then( () => {
            this.processQueue()
        }
        ).catch( () => {
            this.processQueue()
        }
        )
    }
    loadImage(r) {
        return new Promise( (n, l) => {
            if (this.processed.includes(r))
                return n();
            let p = new Image;
            p.crossOrigin = "anonymous",
            p.onload = () => {
                this.processed.push(r),
                n()
            }
            ,
            p.onerror = () => {
                l()
            }
            ,
            p.src = r
        }
        )
    }
}
const N = ie("travvir:debut-nuxt:viewer:scene:index");
class Ae {
    constructor() {
        this.scenes = {},
        this.memberCount = 0,
        this.inFocus = !1,
        this.minFov = z(15),
        this.autofollow = !0,
        this.maxFov = z(180),
        this.route = me(),
        this.textureLoader = null,
        this.defaultFov = z(90),
        this.autoFollowLocalState = !0,
        this.timerToSetAutoFollowOn = null,
        this.viewerStore = re(),
        this.propertyStore = W(),
        this.loader = new _e(this.propertyStore.propertyInfo.imagePath),
        this.isPortrait = ne("isPortrait")
    }
    setInFocus(r) {
        this.inFocus = r
    }
    createScene(r, n, l=!1) {
        const {$isAppleChrome: p, $isAppleWebview: h, $isIPhone: f, $isMacSafari: u, $marzipano: e} = O();
        return new Promise( (g, $) => {
            try {
                if (!r)
                    return;
                if (this.scenes[r.id])
                    return g({
                        ...this.scenes[r.id],
                        position: n
                    });
                N("creating scene ", this.scenes, r.id, r.name);
                let c = "bdflru";
                (p || h || u || f) && (c = "urlfdb"),
                N("sequence", c);
                let y, P = this.propertyStore.getLevelsLimit;
                P && r.levels.length ? (N("Applying levels limit:", P),
                y = r.levels.slice(0, P + 1)) : y = r.levels,
                N("Using levels:", y);
                let F = new e.CubeGeometry(y)
                  , L = `${this.propertyStore.propertyInfo.imagePath}/${r.id}/{z}/{f}/{y}/{x}.jpg`
                  , B = new e.ImageUrlSource.fromString(L,{
                    cubeMapPreviewUrl: `${this.propertyStore.propertyInfo.imagePath}/${r.id}/preview.jpg`,
                    cubeMapPreviewFaceOrder: c
                });
                r.autoTour && this.loader.loadImages(L, l, P);
                let H = this.minFov.value;
                y && y.length <= 4 && (H = 75);
                let V = H * Math.PI / 180
                  , D = r.upperLimit || 0
                  , Q = r.lowerLimit || 0
                  , Y = e.util.compose(e.RectilinearView.limit.vfov(V, 2), e.RectilinearView.limit.pitch(-Math.PI / 2 + D, Math.PI / 2 + Q))
                  , E = this.defaultFov.value;
                this.isPortrait.value && (E = 105);
                let K = new e.RectilinearView({
                    yaw: 0,
                    pitch: 0,
                    fov: E * Math.PI / 180
                },Y), A = this.viewerStore.viewer.createScene({
                    source: B,
                    geometry: F,
                    view: K,
                    pinFirstLevel: !0
                }), i, s;
                {
                    let S = (r.linkHotspots?.filter(t => t.active !== !1) || []).map(t => {
                        const o = te().getScene.find(a => a.sceneId === t.target.id);
                        return o ? {
                            ...t,
                            active: o.isActive
                        } : t
                    }
                    ).filter(t => t.active);
                    s = Se(A, S, this.inFocus),
                    this.propertyStore.propertyInfo?.owner?.nadirConfig?.active && this.route?.name !== "embed-do-propertyId" && (i = ye(A, this.inFocus, r.initialViewParameters))
                }
                let d;
                d = Ie(A, r.infoHotspots);
                let I = A.layer().textureStore()
                  , b = 0;
                I.addEventListener("textureLoad", () => {
                    b++,
                    b == 6 && (N("loaded => ", r.id),
                    this.loader.loadSceneWithConnected(r, P),
                    g({
                        data: r,
                        scene: A,
                        pitchCoverBadge: i,
                        connections: s,
                        position: n,
                        spots: d
                    }))
                }
                )
            } catch (c) {
                N(c),
                $(c)
            }
        }
        )
    }
}
const $e = {
    class: "tour"
}
  , Fe = {
    __name: "index",
    props: {
        ready: Boolean,
        inFocus: {
            type: Boolean,
            default: !1
        }
    },
    emits: ["viewerReady"],
    setup(x, {emit: r}) {
        const n = ie("travvir:debut-nuxt:viewer:index")
          , l = x
          , p = ne("isPortrait")
          , h = new Ae;
        h.setInFocus(l.inFocus);
        const f = r
          , u = W()
          , e = re()
          , g = te()
          , $ = z(null)
          , c = z(!1)
          , y = z(null)
          , P = le()
          , F = _( () => g.getScene.length)
          , L = _( () => g.getScene)
          , B = async () => {
            const {$marzipano: i} = O();
            try {
                n("initializing scene");
                let s = window.document.querySelector("#pano")
                  , d = {
                    controls: {}
                };
                n(s),
                e.viewer = new i.Viewer(s,d),
                e.viewer.controls().enableMethod("leftArrowKey"),
                e.viewer.controls().enableMethod("rightArrowKey"),
                e.viewer.controls().enableMethodGroup("plusMinusKeys"),
                $.value = ee( () => {
                    if (c.value || !e.currentScene || !e.viewer.view())
                        return;
                    let m = e.currentScene._connections.map(k => {
                        let U = e.viewer.view().coordinatesToScreen(k.connection.position());
                        if (U) {
                            let S = {
                                x: window.innerWidth / 2,
                                y: window.innerHeight / 2
                            };
                            return E(S, U)
                        } else
                            return 1e4
                    }
                    )
                      , I = Math.min.apply(null, m)
                      , b = m.indexOf(I);
                    e.activeHotspot = b
                }
                , 100),
                f("viewerReady"),
                n("viewer ready"),
                n("init complete")
            } catch (s) {
                n(s, "init failed")
            }
        }
          , H = async () => {
            if (n("start scene loading"),
            !e.currentScene) {
                let i = L.value[0];
                const s = P.query?.s || P.query?.S;
                if (s) {
                    const [m,I] = s.split(".")
                      , b = parseInt(m, 10) - 1;
                    if (!isNaN(b) && b >= 0 && b < g.sceneList.length) {
                        let k = g.sceneList.filter(t => t.kind === "GroupSequence"), U = g.sceneList.filter(t => t.kind === "SceneSequence"), S;
                        if (I && k.length) {
                            const t = parseInt(I, 10) - 1;
                            let o = k[b];
                            o.sceneIds.length && t < o.sceneIds.length ? S = o.sceneIds[t] : S = o.sceneIds[0]
                        } else {
                            let t = U[b];
                            t?.sceneId && (S = t.sceneId)
                        }
                        S && (i = {
                            id: S.sceneId,
                            ...S
                        })
                    }
                }
                u.selectedLevels = u.getLevelsLimit;
                let d = await h.createScene(i);
                n("first scene created", d),
                e.addNewScene(d.data.id, d),
                c.value = !0,
                await e.setCurrentScene(d.data.id, null, !0),
                n("first scene set", e.currentScene),
                c.value = !1
            }
            await V(),
            D()
        }
          , V = async () => {
            let i = g.getAutoTourScenes;
            await Q(i)
        }
          , D = async () => {
            let i = Y(2);
            n("remaining chunks => ", i);
            for (let s = 0; s < i.length; s++)
                await Q(i[s])
        }
          , Q = async i => {
            for (let s = 0; s < i.length; s++)
                try {
                    if (e.interruptSignal) {
                        n("interrupt signal found. Let's create scene", e.interruptSignal.id);
                        let m = g.getSceneDataById(e.interruptSignal.id)
                          , I = await h.createScene(m);
                        n("interrupt scene created", m, I),
                        e.addNewScene(I.data.id, I),
                        e.setCurrentScene(I.data.id, e.interruptSignal.hotspot),
                        e.interruptSignal = null
                    }
                    n("creating normal scene", i[s]);
                    let d = await h.createScene(i[s]);
                    e.addNewScene(d.data.id, d),
                    n("normal scene created", d)
                } catch (d) {
                    n("scene creation failed", d)
                }
        }
          , Y = i => {
            let s = L.value?.filter(d => !e.scenes[d.id]);
            return s.map( (d, m) => m % i === 0 ? s.slice(m, m + i) : null).filter(Boolean)
        }
          , E = (i, s) => Math.sqrt(Math.pow(s.x - i.x, 2) + Math.pow(s.y - i.y, 2))
          , K = () => {
            if (e.viewer && e.isReady) {
                n("heartbeat", e.currentScene);
                let i = e.viewer.view()
                  , s = {
                    name: "HEARTBEAT",
                    yaw: i?._yaw,
                    pitch: i?._pitch,
                    roll: i?._roll,
                    fov: i?._fov,
                    width: i?._width,
                    height: i?._height,
                    sceneId: e.currentScene?.data?.sceneId || "123",
                    sceneName: e.currentScene?.data?.name,
                    propertyId: u.propertyId,
                    conferenceKey: u.conferenceKey,
                    pageviewId: u.pvid
                };
                window.busSocket.sendEvent(s)
            }
        }
          , A = async i => {
            const {$callSocket: s} = O();
            e.isConferenceViewer || u.ensureEmbedTabInActive(P) || u.ensureConferenceTabInActive(P) || (c.value = !0,
            e.isFirstScene = !1,
            await e.setCurrentScene(i.target.id, i),
            e.isConferencePresenter && (s.sendSceneChange(i.target.id),
            window.busSocket.sendEvent({
                name: "CONFERENCE_SCENE_CHANGE",
                sceneId: i.target.id
            })),
            c.value = !1)
        }
        ;
        return ue(async () => {
            await B(),
            F.value > 0 && H(),
            window.addEventListener("orientationchange", () => {
                if (e.currentScene) {
                    const i = e.viewer.view();
                    let s = {
                        yaw: i.yaw(),
                        pitch: i.pitch()
                    };
                    p.value ? s.fov = 120 * Math.PI / 180 : s.fov = 90 * Math.PI / 180,
                    e.viewer.lookTo(s, {
                        transitionDuration: 10
                    })
                }
            }
            ),
            y.value = ee(K, 2e4)
        }
        ),
        de( () => {
            clearInterval($.value),
            clearInterval(y.value),
            e.resetCurrentScene()
        }
        ),
        se(F, () => {
            e.currentScene || H()
        }
        ),
        se( () => l.inFocus, i => {
            e.viewer && (i ? (e.viewer.controls().enableMethod("leftArrowKey"),
            e.viewer.controls().enableMethod("rightArrowKey"),
            e.viewer.controls().enableMethodGroup("plusMinusKeys")) : (e.viewer.controls().disableMethod("leftArrowKey"),
            e.viewer.controls().disableMethod("rightArrowKey"),
            e.viewer.controls().disableMethodGroup("plusMinusKeys")))
        }
        ),
        (i, s) => {
            const d = Ce
              , m = Pe;
            return R(),
            T("div", $e, [s[0] || (s[0] = G("div", {
                id: "pano"
            }, null, -1)), M(e).isReady ? (R(),
            oe(d, {
                key: 0,
                "switching-scene": M(c),
                onSwitchScene: A
            }, null, 8, ["switching-scene"])) : X("", !0), M(e).marzipanoReady ? X("", !0) : (R(),
            oe(m, {
                key: 1
            }))])
        }
    }
}
  , ze = ce(Fe, [["__scopeId", "data-v-565e36eb"]]);
export {ze as _};
//# sourceMappingURL=B1pCgG6h.js.map
