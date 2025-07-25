! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).window = t.window || {})
}(this, (function(t) {
    "use strict";
    const e = (t, e = 1e4) => (t = parseFloat(t + "") || 0, Math.round((t + Number.EPSILON) * e) / e),
        i = function(t) {
            if (!(t && t instanceof Element && t.offsetParent)) return !1;
            const e = t.scrollHeight > t.clientHeight,
                i = window.getComputedStyle(t).overflowY,
                n = -1 !== i.indexOf("hidden"),
                s = -1 !== i.indexOf("visible");
            return e && !n && !s
        },
        n = function(t, e) {
            return !(!t || t === document.body || e && t === e) && (i(t) ? t : n(t.parentElement, e))
        },
        s = function(t) {
            var e = (new DOMParser).parseFromString(t, "text/html").body;
            if (e.childElementCount > 1) {
                for (var i = document.createElement("div"); e.firstChild;) i.appendChild(e.firstChild);
                return i
            }
            return e.firstChild
        },
        o = t => `${t||""}`.split(" ").filter((t => !!t)),
        a = (t, e, i) => {
            o(e).forEach((e => {
                t && t.classList.toggle(e, i || !1)
            }))
        };
    class r {
        constructor(t) {
            Object.defineProperty(this, "pageX", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "pageY", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "clientX", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "clientY", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "id", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "time", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "nativePointer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), this.nativePointer = t, this.pageX = t.pageX, this.pageY = t.pageY, this.clientX = t.clientX, this.clientY = t.clientY, this.id = self.Touch && t instanceof Touch ? t.identifier : -1, this.time = Date.now()
        }
    }
    const l = {
        passive: !1
    };
    class c {
        constructor(t, {
            start: e = (() => !0),
            move: i = (() => {}),
            end: n = (() => {})
        }) {
            Object.defineProperty(this, "element", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "startCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "moveCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "endCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "currentPointers", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), Object.defineProperty(this, "startPointers", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), this.element = t, this.startCallback = e, this.moveCallback = i, this.endCallback = n;
            for (const t of ["onPointerStart", "onTouchStart", "onMove", "onTouchEnd", "onPointerEnd", "onWindowBlur"]) this[t] = this[t].bind(this);
            this.element.addEventListener("mousedown", this.onPointerStart, l), this.element.addEventListener("touchstart", this.onTouchStart, l), this.element.addEventListener("touchmove", this.onMove, l), this.element.addEventListener("touchend", this.onTouchEnd), this.element.addEventListener("touchcancel", this.onTouchEnd)
        }
        onPointerStart(t) {
            if (!t.buttons || 0 !== t.button) return;
            const e = new r(t);
            this.currentPointers.some((t => t.id === e.id)) || this.triggerPointerStart(e, t) && (window.addEventListener("mousemove", this.onMove), window.addEventListener("mouseup", this.onPointerEnd), window.addEventListener("blur", this.onWindowBlur))
        }
        onTouchStart(t) {
            for (const e of Array.from(t.changedTouches || [])) this.triggerPointerStart(new r(e), t);
            window.addEventListener("blur", this.onWindowBlur)
        }
        onMove(t) {
            const e = this.currentPointers.slice(),
                i = "changedTouches" in t ? Array.from(t.changedTouches || []).map((t => new r(t))) : [new r(t)],
                n = [];
            for (const t of i) {
                const e = this.currentPointers.findIndex((e => e.id === t.id));
                e < 0 || (n.push(t), this.currentPointers[e] = t)
            }
            n.length && this.moveCallback(t, this.currentPointers.slice(), e)
        }
        onPointerEnd(t) {
            t.buttons > 0 && 0 !== t.button || (this.triggerPointerEnd(t, new r(t)), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur))
        }
        onTouchEnd(t) {
            for (const e of Array.from(t.changedTouches || [])) this.triggerPointerEnd(t, new r(e))
        }
        triggerPointerStart(t, e) {
            return !!this.startCallback(e, t, this.currentPointers.slice()) && (this.currentPointers.push(t), this.startPointers.push(t), !0)
        }
        triggerPointerEnd(t, e) {
            const i = this.currentPointers.findIndex((t => t.id === e.id));
            i < 0 || (this.currentPointers.splice(i, 1), this.startPointers.splice(i, 1), this.endCallback(t, e, this.currentPointers.slice()))
        }
        onWindowBlur() {
            this.clear()
        }
        clear() {
            for (; this.currentPointers.length;) {
                const t = this.currentPointers[this.currentPointers.length - 1];
                this.currentPointers.splice(this.currentPointers.length - 1, 1), this.startPointers.splice(this.currentPointers.length - 1, 1), this.endCallback(new Event("touchend", {
                    bubbles: !0,
                    cancelable: !0,
                    clientX: t.clientX,
                    clientY: t.clientY
                }), t, this.currentPointers.slice())
            }
        }
        stop() {
            this.element.removeEventListener("mousedown", this.onPointerStart, l), this.element.removeEventListener("touchstart", this.onTouchStart, l), this.element.removeEventListener("touchmove", this.onMove, l), this.element.removeEventListener("touchend", this.onTouchEnd), this.element.removeEventListener("touchcancel", this.onTouchEnd), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur)
        }
    }

    function h(t, e) {
        return e ? Math.sqrt(Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2)) : 0
    }

    function d(t, e) {
        return e ? {
            clientX: (t.clientX + e.clientX) / 2,
            clientY: (t.clientY + e.clientY) / 2
        } : t
    }
    const u = t => "object" == typeof t && null !== t && t.constructor === Object && "[object Object]" === Object.prototype.toString.call(t),
        p = (t, ...e) => {
            const i = e.length;
            for (let n = 0; n < i; n++) {
                const i = e[n] || {};
                Object.entries(i).forEach((([e, i]) => {
                    const n = Array.isArray(i) ? [] : {};
                    t[e] || Object.assign(t, {
                        [e]: n
                    }), u(i) ? Object.assign(t[e], p(n, i)) : Array.isArray(i) ? Object.assign(t, {
                        [e]: [...i]
                    }) : Object.assign(t, {
                        [e]: i
                    })
                }))
            }
            return t
        },
        f = function(t, e) {
            return t.split(".").reduce(((t, e) => "object" == typeof t ? t[e] : void 0), e)
        };
    class m {
        constructor(t = {}) {
            Object.defineProperty(this, "options", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: t
            }), Object.defineProperty(this, "events", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: new Map
            }), this.setOptions(t);
            for (const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) t.startsWith("on") && "function" == typeof this[t] && (this[t] = this[t].bind(this))
        }
        setOptions(t) {
            this.options = t ? p({}, this.constructor.defaults, t) : {};
            for (const [t, e] of Object.entries(this.option("on") || {})) this.on(t, e)
        }
        option(t, ...e) {
            let i = f(t, this.options);
            return i && "function" == typeof i && (i = i.call(this, this, ...e)), i
        }
        optionFor(t, e, i, ...n) {
            let s = f(e, t);
            var o;
            "string" != typeof(o = s) || isNaN(o) || isNaN(parseFloat(o)) || (s = parseFloat(s)), "true" === s && (s = !0), "false" === s && (s = !1), s && "function" == typeof s && (s = s.call(this, this, t, ...n));
            let a = f(e, this.options);
            return a && "function" == typeof a ? s = a.call(this, this, t, ...n, s) : void 0 === s && (s = a), void 0 === s ? i : s
        }
        cn(t) {
            const e = this.options.classes;
            return e && e[t] || ""
        }
        localize(t, e = []) {
            t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, ((t, e, i) => {
                let n = "";
                return i ? n = this.option(`${e[0]+e.toLowerCase().substring(1)}.l10n.${i}`) : e && (n = this.option(`l10n.${e}`)), n || (n = t), n
            }));
            for (let i = 0; i < e.length; i++) t = t.split(e[i][0]).join(e[i][1]);
            return t = t.replace(/\{\{(.*?)\}\}/g, ((t, e) => e))
        }
        on(t, e) {
            let i = [];
            "string" == typeof t ? i = t.split(" ") : Array.isArray(t) && (i = t), this.events || (this.events = new Map), i.forEach((t => {
                let i = this.events.get(t);
                i || (this.events.set(t, []), i = []), i.includes(e) || i.push(e), this.events.set(t, i)
            }))
        }
        off(t, e) {
            let i = [];
            "string" == typeof t ? i = t.split(" ") : Array.isArray(t) && (i = t), i.forEach((t => {
                const i = this.events.get(t);
                if (Array.isArray(i)) {
                    const t = i.indexOf(e);
                    t > -1 && i.splice(t, 1)
                }
            }))
        }
        emit(t, ...e) {
            [...this.events.get(t) || []].forEach((t => t(this, ...e))), "*" !== t && this.emit("*", t, ...e)
        }
    }
    Object.defineProperty(m, "version", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: "5.0.19"
    }), Object.defineProperty(m, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    });
    class g extends m {
        constructor(t = {}) {
            super(t), Object.defineProperty(this, "plugins", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: {}
            })
        }
        attachPlugins(t = {}) {
            const e = new Map;
            for (const [i, n] of Object.entries(t)) {
                const t = this.option(i),
                    s = this.plugins[i];
                s || !1 === t ? s && !1 === t && (s.detach(), delete this.plugins[i]) : e.set(i, new n(this, t || {}))
            }
            for (const [t, i] of e) this.plugins[t] = i, i.attach();
            this.emit("attachPlugins")
        }
        detachPlugins(t) {
            t = t || Object.keys(this.plugins);
            for (const e of t) {
                const t = this.plugins[e];
                t && t.detach(), delete this.plugins[e]
            }
            return this.emit("detachPlugins"), this
        }
    }
    var b;
    ! function(t) {
        t[t.Init = 0] = "Init", t[t.Error = 1] = "Error", t[t.Ready = 2] = "Ready", t[t.Panning = 3] = "Panning", t[t.Mousemove = 4] = "Mousemove", t[t.Destroy = 5] = "Destroy"
    }(b || (b = {}));
    const v = ["a", "b", "c", "d", "e", "f"],
        y = {
            PANUP: "Move up",
            PANDOWN: "Move down",
            PANLEFT: "Move left",
            PANRIGHT: "Move right",
            ZOOMIN: "Zoom in",
            ZOOMOUT: "Zoom out",
            TOGGLEZOOM: "Toggle zoom level",
            TOGGLE1TO1: "Toggle zoom level",
            ITERATEZOOM: "Toggle zoom level",
            ROTATECCW: "Rotate counterclockwise",
            ROTATECW: "Rotate clockwise",
            FLIPX: "Flip horizontally",
            FLIPY: "Flip vertically",
            FITX: "Fit horizontally",
            FITY: "Fit vertically",
            RESET: "Reset",
            TOGGLEFS: "Toggle fullscreen"
        },
        w = {
            content: null,
            width: "auto",
            height: "auto",
            panMode: "drag",
            touch: !0,
            dragMinThreshold: 3,
            lockAxis: !1,
            mouseMoveFactor: 1,
            mouseMoveFriction: .12,
            zoom: !0,
            pinchToZoom: !0,
            panOnlyZoomed: "auto",
            minScale: 1,
            maxScale: 2,
            friction: .25,
            dragFriction: .35,
            decelFriction: .05,
            click: "toggleZoom",
            dblClick: !1,
            wheel: "zoom",
            wheelLimit: 7,
            spinner: !0,
            bounds: "auto",
            infinite: !1,
            rubberband: !0,
            bounce: !0,
            maxVelocity: 75,
            transformParent: !1,
            classes: {
                content: "f-panzoom__content",
                isLoading: "is-loading",
                canZoomIn: "can-zoom_in",
                canZoomOut: "can-zoom_out",
                isDraggable: "is-draggable",
                isDragging: "is-dragging",
                inFullscreen: "in-fullscreen",
                htmlHasFullscreen: "with-panzoom-in-fullscreen"
            },
            l10n: y
        },
        x = '<div class="f-spinner"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle><circle cx="25" cy="25" r="20"></circle></svg></div>',
        S = t => t && null !== t && t instanceof Element && "nodeType" in t,
        E = (t, e) => {
            t && o(e).forEach((e => {
                t.classList.remove(e)
            }))
        },
        P = (t, e) => {
            t && o(e).forEach((e => {
                t.classList.add(e)
            }))
        },
        C = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        },
        M = 1e5,
        T = 1e3,
        O = "mousemove",
        A = "drag",
        z = "content";
    let L = null,
        R = null;
    class k extends g {
        get isTouchDevice() {
            return null === R && (R = window.matchMedia("(hover: none)").matches), R
        }
        get isMobile() {
            return null === L && (L = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)), L
        }
        get panMode() {
            return this.options.panMode !== O || this.isTouchDevice ? A : O
        }
        get panOnlyZoomed() {
            const t = this.options.panOnlyZoomed;
            return "auto" === t ? this.isTouchDevice : t
        }
        get isInfinite() {
            return this.option("infinite")
        }
        get angle() {
            return 180 * Math.atan2(this.current.b, this.current.a) / Math.PI || 0
        }
        get targetAngle() {
            return 180 * Math.atan2(this.target.b, this.target.a) / Math.PI || 0
        }
        get scale() {
            const {
                a: t,
                b: e
            } = this.current;
            return Math.sqrt(t * t + e * e) || 1
        }
        get targetScale() {
            const {
                a: t,
                b: e
            } = this.target;
            return Math.sqrt(t * t + e * e) || 1
        }
        get minScale() {
            return this.option("minScale") || 1
        }
        get fullScale() {
            const {
                contentRect: t
            } = this;
            return t.fullWidth / t.fitWidth || 1
        }
        get maxScale() {
            return this.fullScale * (this.option("maxScale") || 1) || 1
        }
        get coverScale() {
            const {
                containerRect: t,
                contentRect: e
            } = this, i = Math.max(t.height / e.fitHeight, t.width / e.fitWidth) || 1;
            return Math.min(this.fullScale, i)
        }
        get isScaling() {
            return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting
        }
        get isContentLoading() {
            const t = this.content;
            return !!(t && t instanceof HTMLImageElement) && !t.complete
        }
        get isResting() {
            if (this.isBouncingX || this.isBouncingY) return !1;
            for (const t of v) {
                const e = "e" == t || "f" === t ? .001 : 1e-5;
                if (Math.abs(this.target[t] - this.current[t]) > e) return !1
            }
            return !(!this.ignoreBounds && !this.checkBounds().inBounds)
        }
        constructor(t, e = {}, i = {}) {
            var n;
            if (super(e), Object.defineProperty(this, "pointerTracker", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "resizeObserver", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "updateTimer", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "clickTimer", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "rAF", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "isTicking", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "friction", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "ignoreBounds", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "isBouncingX", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "isBouncingY", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "clicks", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "trackingPoints", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "pwt", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "cwd", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "pmme", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "state", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: b.Init
                }), Object.defineProperty(this, "isDragging", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "container", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "content", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "spinner", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "containerRect", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0
                    }
                }), Object.defineProperty(this, "contentRect", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        fullWidth: 0,
                        fullHeight: 0,
                        fitWidth: 0,
                        fitHeight: 0,
                        width: 0,
                        height: 0
                    }
                }), Object.defineProperty(this, "dragStart", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        x: 0,
                        y: 0,
                        top: 0,
                        left: 0,
                        time: 0
                    }
                }), Object.defineProperty(this, "dragOffset", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        x: 0,
                        y: 0,
                        time: 0
                    }
                }), Object.defineProperty(this, "current", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: Object.assign({}, C)
                }), Object.defineProperty(this, "target", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: Object.assign({}, C)
                }), Object.defineProperty(this, "velocity", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: 0,
                        f: 0
                    }
                }), Object.defineProperty(this, "lockedAxis", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), !t) throw new Error("Container Element Not Found");
            this.container = t, this.initContent(), this.attachPlugins(Object.assign(Object.assign({}, k.Plugins), i)), this.emit("init");
            const o = this.content;
            if (o.addEventListener("load", this.onLoad), o.addEventListener("error", this.onError), this.isContentLoading) {
                if (this.option("spinner")) {
                    t.classList.add(this.cn("isLoading"));
                    const e = s(x);
                    !t.contains(o) || o.parentElement instanceof HTMLPictureElement ? this.spinner = t.appendChild(e) : this.spinner = (null === (n = o.parentElement) || void 0 === n ? void 0 : n.insertBefore(e, o)) || null
                }
                this.emit("beforeLoad")
            } else queueMicrotask((() => {
                this.enable()
            }))
        }
        initContent() {
            const {
                container: t
            } = this, e = this.cn(z);
            let i = this.option(z) || t.querySelector(`.${e}`);
            if (i || (i = t.querySelector("img,picture") || t.firstElementChild, i && P(i, e)), i instanceof HTMLPictureElement && (i = i.querySelector("img")), !i) throw new Error("No content found");
            this.content = i
        }
        onLoad() {
            this.spinner && (this.spinner.remove(), this.spinner = null), this.option("spinner") && this.container.classList.remove(this.cn("isLoading")), this.emit("afterLoad"), this.state === b.Init ? this.enable() : this.updateMetrics()
        }
        onError() {
            this.state !== b.Destroy && (this.spinner && (this.spinner.remove(), this.spinner = null), this.stop(), this.detachEvents(), this.state = b.Error, this.emit("error"))
        }
        attachObserver() {
            var t;
            const e = () => Math.abs(this.containerRect.width - this.container.getBoundingClientRect().width) > .1 || Math.abs(this.containerRect.height - this.container.getBoundingClientRect().height) > .1;
            this.resizeObserver || void 0 === window.ResizeObserver || (this.resizeObserver = new ResizeObserver((() => {
                this.updateTimer || (e() ? (this.onResize(), this.isMobile && (this.updateTimer = setTimeout((() => {
                    e() && this.onResize(), this.updateTimer = null
                }), 500))) : this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null))
            }))), null === (t = this.resizeObserver) || void 0 === t || t.observe(this.container)
        }
        detachObserver() {
            var t;
            null === (t = this.resizeObserver) || void 0 === t || t.disconnect()
        }
        attachEvents() {
            const {
                container: t
            } = this;
            t.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.addEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.pointerTracker = new c(t, {
                start: this.onPointerDown,
                move: this.onPointerMove,
                end: this.onPointerUp
            }), document.addEventListener(O, this.onMouseMove)
        }
        detachEvents() {
            var t;
            const {
                container: e
            } = this;
            e.removeEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), e.removeEventListener("wheel", this.onWheel, {
                passive: !1
            }), null === (t = this.pointerTracker) || void 0 === t || t.stop(), this.pointerTracker = null, document.removeEventListener(O, this.onMouseMove), document.removeEventListener("keydown", this.onKeydown, !0), this.clickTimer && (clearTimeout(this.clickTimer), this.clickTimer = null), this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null)
        }
        animate() {
            const t = this.friction;
            this.setTargetForce();
            const e = this.option("maxVelocity");
            for (const i of v) t ? (this.velocity[i] *= 1 - t, e && !this.isScaling && (this.velocity[i] = Math.max(Math.min(this.velocity[i], e), -1 * e)), this.current[i] += this.velocity[i]) : this.current[i] = this.target[i];
            this.setTransform(), this.setEdgeForce(), !this.isResting || this.isDragging ? this.rAF = requestAnimationFrame((() => this.animate())) : this.stop("current")
        }
        setTargetForce() {
            for (const t of v) "e" === t && this.isBouncingX || "f" === t && this.isBouncingY || (this.velocity[t] = (1 / (1 - this.friction) - 1) * (this.target[t] - this.current[t]))
        }
        checkBounds(t = 0, e = 0) {
            const {
                current: i
            } = this, n = i.e + t, s = i.f + e, o = this.getBounds(), {
                x: a,
                y: r
            } = o, l = a.min, c = a.max, h = r.min, d = r.max;
            let u = 0,
                p = 0;
            return l !== 1 / 0 && n < l ? u = l - n : c !== 1 / 0 && n > c && (u = c - n), h !== 1 / 0 && s < h ? p = h - s : d !== 1 / 0 && s > d && (p = d - s), Math.abs(u) < .001 && (u = 0), Math.abs(p) < .001 && (p = 0), Object.assign(Object.assign({}, o), {
                xDiff: u,
                yDiff: p,
                inBounds: !u && !p
            })
        }
        clampTargetBounds() {
            const {
                target: t
            } = this, {
                x: e,
                y: i
            } = this.getBounds();
            e.min !== 1 / 0 && (t.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (t.e = Math.min(t.e, e.max)), i.min !== 1 / 0 && (t.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (t.f = Math.min(t.f, i.max))
        }
        calculateContentDim(t = this.current) {
            const {
                content: e,
                contentRect: i
            } = this, {
                fitWidth: n,
                fitHeight: s,
                fullWidth: o,
                fullHeight: a
            } = i;
            let r = o,
                l = a;
            if (this.option("zoom") || 0 !== this.angle) {
                const i = !(e instanceof HTMLImageElement) && ("none" === window.getComputedStyle(e).maxWidth || "none" === window.getComputedStyle(e).maxHeight),
                    c = i ? o : n,
                    h = i ? a : s,
                    d = this.getMatrix(t),
                    u = new DOMPoint(0, 0).matrixTransform(d),
                    p = new DOMPoint(0 + c, 0).matrixTransform(d),
                    f = new DOMPoint(0 + c, 0 + h).matrixTransform(d),
                    m = new DOMPoint(0, 0 + h).matrixTransform(d),
                    g = Math.abs(f.x - u.x),
                    b = Math.abs(f.y - u.y),
                    v = Math.abs(m.x - p.x),
                    y = Math.abs(m.y - p.y);
                r = Math.max(g, v), l = Math.max(b, y)
            }
            return {
                contentWidth: r,
                contentHeight: l
            }
        }
        setEdgeForce() {
            if (this.ignoreBounds || this.isDragging || this.panMode === O || this.targetScale < this.scale) return this.isBouncingX = !1, void(this.isBouncingY = !1);
            const {
                target: t
            } = this, {
                x: e,
                y: i,
                xDiff: n,
                yDiff: s
            } = this.checkBounds();
            const o = this.option("maxVelocity");
            let a = this.velocity.e,
                r = this.velocity.f;
            0 !== n ? (this.isBouncingX = !0, n * a <= 0 ? a += .14 * n : (a = .14 * n, e.min !== 1 / 0 && (this.target.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (this.target.e = Math.min(t.e, e.max))), o && (a = Math.max(Math.min(a, o), -1 * o))) : this.isBouncingX = !1, 0 !== s ? (this.isBouncingY = !0, s * r <= 0 ? r += .14 * s : (r = .14 * s, i.min !== 1 / 0 && (this.target.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (this.target.f = Math.min(t.f, i.max))), o && (r = Math.max(Math.min(r, o), -1 * o))) : this.isBouncingY = !1, this.isBouncingX && (this.velocity.e = a), this.isBouncingY && (this.velocity.f = r)
        }
        enable() {
            const {
                content: t
            } = this, e = new DOMMatrixReadOnly(window.getComputedStyle(t).transform);
            for (const t of v) this.current[t] = this.target[t] = e[t];
            this.updateMetrics(), this.attachObserver(), this.attachEvents(), this.state = b.Ready, this.emit("ready")
        }
        onClick(t) {
            var e;
            this.isDragging && (null === (e = this.pointerTracker) || void 0 === e || e.clear(), this.trackingPoints = [], this.startDecelAnim());
            const i = t.target;
            if (!i || t.defaultPrevented) return;
            if (i && i.hasAttribute("disabled")) return t.preventDefault(), void t.stopPropagation();
            if ((() => {
                    const t = window.getSelection();
                    return t && "Range" === t.type
                })() && !i.closest("button")) return;
            const n = i.closest("[data-panzoom-action]"),
                s = i.closest("[data-panzoom-change]"),
                o = n || s,
                a = o && S(o) ? o.dataset : null;
            if (a) {
                const e = a.panzoomChange,
                    i = a.panzoomAction;
                if ((e || i) && t.preventDefault(), e) {
                    let t = {};
                    try {
                        t = JSON.parse(e)
                    } catch (t) {
                        console && console.warn("The given data was not valid JSON")
                    }
                    return void this.applyChange(t)
                }
                if (i) return void(this[i] && this[i]())
            }
            if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3) return t.preventDefault(), void t.stopPropagation();
            const r = this.content.getBoundingClientRect();
            if (this.dragStart.time && !this.canZoomOut() && (Math.abs(r.x - this.dragStart.x) > 2 || Math.abs(r.y - this.dragStart.y) > 2)) return;
            this.dragStart.time = 0;
            const l = e => {
                    this.option("zoom") && e && "string" == typeof e && /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(e) && "function" == typeof this[e] && (t.preventDefault(), this[e]({
                        event: t
                    }))
                },
                c = this.option("click", t),
                h = this.option("dblClick", t);
            h ? (this.clicks++, 1 == this.clicks && (this.clickTimer = setTimeout((() => {
                1 === this.clicks ? (this.emit("click", t), !t.defaultPrevented && c && l(c)) : (this.emit("dblClick", t), t.defaultPrevented || l(h)), this.clicks = 0, this.clickTimer = null
            }), 350))) : (this.emit("click", t), !t.defaultPrevented && c && l(c))
        }
        addTrackingPoint(t) {
            const e = this.trackingPoints.filter((t => t.time > Date.now() - 100));
            e.push(t), this.trackingPoints = e
        }
        onPointerDown(t, e, i) {
            var n;
            this.pwt = 0, this.dragOffset = {
                x: 0,
                y: 0,
                time: 0
            }, this.trackingPoints = [];
            const s = this.content.getBoundingClientRect();
            if (this.dragStart = {
                    x: s.x,
                    y: s.y,
                    top: s.top,
                    left: s.left,
                    time: Date.now()
                }, this.clickTimer) return !1;
            if (this.panMode === O && this.targetScale > 1) return t.preventDefault(), t.stopPropagation(), !1;
            if (!i.length) {
                const e = t.composedPath()[0];
                if (["A", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].includes(e.nodeName) || e.closest("[contenteditable]") || e.closest("[data-selectable]") || e.closest("[data-draggable]") || e.closest("[data-panzoom-change]") || e.closest("[data-panzoom-action]")) return !1;
                null === (n = window.getSelection()) || void 0 === n || n.removeAllRanges()
            }
            if ("mousedown" === t.type) t.preventDefault();
            else if (Math.abs(this.velocity.a) > .3) return !1;
            return this.target.e = this.current.e, this.target.f = this.current.f, this.stop(), this.isDragging || (this.isDragging = !0, this.addTrackingPoint(e), this.emit("touchStart", t)), !0
        }
        onPointerMove(t, i, s) {
            if (!1 === this.option("touch", t)) return;
            if (!this.isDragging) return;
            if (i.length < 2 && this.panOnlyZoomed && e(this.targetScale) <= e(this.minScale)) return;
            if (this.emit("touchMove", t), t.defaultPrevented) return;
            this.addTrackingPoint(i[0]);
            const {
                content: o
            } = this, a = d(s[0], s[1]), r = d(i[0], i[1]);
            let l = 0,
                c = 0;
            if (i.length > 1) {
                const t = o.getBoundingClientRect();
                l = a.clientX - t.left - .5 * t.width, c = a.clientY - t.top - .5 * t.height
            }
            const u = h(s[0], s[1]),
                p = h(i[0], i[1]);
            let f = u ? p / u : 1,
                m = r.clientX - a.clientX,
                g = r.clientY - a.clientY;
            this.dragOffset.x += m, this.dragOffset.y += g, this.dragOffset.time = Date.now() - this.dragStart.time;
            let b = e(this.targetScale) === e(this.minScale) && this.option("lockAxis");
            if (b && !this.lockedAxis)
                if ("xy" === b || "y" === b || "touchmove" === t.type) {
                    if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) return void t.preventDefault();
                    const e = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
                    this.lockedAxis = e > 45 && e < 135 ? "y" : "x", this.dragOffset.x = 0, this.dragOffset.y = 0, m = 0, g = 0
                } else this.lockedAxis = b;
            if (n(t.target, this.content) && (b = "x", this.dragOffset.y = 0), b && "xy" !== b && this.lockedAxis !== b && e(this.targetScale) === e(this.minScale)) return;
            t.cancelable && t.preventDefault(), this.container.classList.add(this.cn("isDragging"));
            const v = this.checkBounds(m, g);
            this.option("rubberband") ? ("x" !== this.isInfinite && (v.xDiff > 0 && m < 0 || v.xDiff < 0 && m > 0) && (m *= Math.max(0, .5 - Math.abs(.75 / this.contentRect.fitWidth * v.xDiff))), "y" !== this.isInfinite && (v.yDiff > 0 && g < 0 || v.yDiff < 0 && g > 0) && (g *= Math.max(0, .5 - Math.abs(.75 / this.contentRect.fitHeight * v.yDiff)))) : (v.xDiff && (m = 0), v.yDiff && (g = 0));
            const y = this.targetScale,
                w = this.minScale,
                x = this.maxScale;
            y < .5 * w && (f = Math.max(f, w)), y > 1.5 * x && (f = Math.min(f, x)), "y" === this.lockedAxis && e(y) === e(w) && (m = 0), "x" === this.lockedAxis && e(y) === e(w) && (g = 0), this.applyChange({
                originX: l,
                originY: c,
                panX: m,
                panY: g,
                scale: f,
                friction: this.option("dragFriction"),
                ignoreBounds: !0
            })
        }
        onPointerUp(t, e, i) {
            if (i.length) return this.dragOffset.x = 0, this.dragOffset.y = 0, void(this.trackingPoints = []);
            this.container.classList.remove(this.cn("isDragging")), this.isDragging && (this.addTrackingPoint(e), this.panOnlyZoomed && this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1 && (this.trackingPoints = []), n(t.target, this.content) && "y" === this.lockedAxis && (this.trackingPoints = []), this.emit("touchEnd", t), this.isDragging = !1, this.lockedAxis = !1, this.state !== b.Destroy && (t.defaultPrevented || this.startDecelAnim()))
        }
        startDecelAnim() {
            var t;
            const i = this.isScaling;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
            for (const t of v) this.velocity[t] = 0;
            this.target.e = this.current.e, this.target.f = this.current.f, E(this.container, "is-scaling"), E(this.container, "is-animating"), this.isTicking = !1;
            const {
                trackingPoints: n
            } = this, s = n[0], o = n[n.length - 1];
            let a = 0,
                r = 0,
                l = 0;
            o && s && (a = o.clientX - s.clientX, r = o.clientY - s.clientY, l = o.time - s.time);
            const c = (null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1;
            1 !== c && (a *= c, r *= c);
            let h = 0,
                d = 0,
                u = 0,
                p = 0,
                f = this.option("decelFriction");
            const m = this.targetScale;
            if (l > 0) {
                u = Math.abs(a) > 3 ? a / (l / 30) : 0, p = Math.abs(r) > 3 ? r / (l / 30) : 0;
                const t = this.option("maxVelocity");
                t && (u = Math.max(Math.min(u, t), -1 * t), p = Math.max(Math.min(p, t), -1 * t))
            }
            u && (h = u / (1 / (1 - f) - 1)), p && (d = p / (1 / (1 - f) - 1)), ("y" === this.option("lockAxis") || "xy" === this.option("lockAxis") && "y" === this.lockedAxis && e(m) === this.minScale) && (h = u = 0), ("x" === this.option("lockAxis") || "xy" === this.option("lockAxis") && "x" === this.lockedAxis && e(m) === this.minScale) && (d = p = 0);
            const g = this.dragOffset.x,
                b = this.dragOffset.y,
                y = this.option("dragMinThreshold") || 0;
            Math.abs(g) < y && Math.abs(b) < y && (h = d = 0, u = p = 0), (m < this.minScale - 1e-5 || m > this.maxScale + 1e-5 || i && !h && !d) && (f = .35), this.applyChange({
                panX: h,
                panY: d,
                friction: f
            }), this.emit("decel", u, p, g, b)
        }
        onWheel(t) {
            var e = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function(t, e) {
                return Math.abs(e) > Math.abs(t) ? e : t
            }));
            const i = Math.max(-1, Math.min(1, e));
            if (this.emit("wheel", t, i), this.panMode === O) return;
            if (t.defaultPrevented) return;
            const n = this.option("wheel");
            "pan" === n ? (t.preventDefault(), this.panOnlyZoomed && !this.canZoomOut() || this.applyChange({
                panX: 2 * -t.deltaX,
                panY: 2 * -t.deltaY,
                bounce: !1
            })) : "zoom" === n && !1 !== this.option("zoom") && this.zoomWithWheel(t)
        }
        onMouseMove(t) {
            this.panWithMouse(t)
        }
        onKeydown(t) {
            "Escape" === t.key && this.toggleFS()
        }
        onResize() {
            this.updateMetrics(), this.checkBounds().inBounds || this.requestTick()
        }
        setTransform() {
            this.emit("beforeTransform");
            const {
                current: t,
                target: i,
                content: n,
                contentRect: s
            } = this, o = Object.assign({}, C);
            for (const n of v) {
                const s = "e" == n || "f" === n ? T : M;
                o[n] = e(t[n], s), Math.abs(i[n] - t[n]) < ("e" == n || "f" === n ? .51 : .001) && (t[n] = i[n])
            }
            let {
                a: a,
                b: r,
                c: l,
                d: c,
                e: h,
                f: d
            } = o, u = `matrix(${a}, ${r}, ${l}, ${c}, ${h}, ${d})`, p = n.parentElement instanceof HTMLPictureElement ? n.parentElement : n;
            if (this.option("transformParent") && (p = p.parentElement || p), p.style.transform === u) return;
            p.style.transform = u;
            const {
                contentWidth: f,
                contentHeight: m
            } = this.calculateContentDim();
            s.width = f, s.height = m, this.emit("afterTransform")
        }
        updateMetrics(t = !1) {
            var i;
            if (!this || this.state === b.Destroy) return;
            if (this.isContentLoading) return;
            const n = Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1),
                {
                    container: s,
                    content: o
                } = this,
                a = o instanceof HTMLImageElement,
                r = s.getBoundingClientRect(),
                l = getComputedStyle(this.container);
            let c = r.width * n,
                h = r.height * n;
            const d = parseFloat(l.paddingTop) + parseFloat(l.paddingBottom),
                u = c - (parseFloat(l.paddingLeft) + parseFloat(l.paddingRight)),
                p = h - d;
            this.containerRect = {
                width: c,
                height: h,
                innerWidth: u,
                innerHeight: p
            };
            let f = this.option("width") || "auto",
                m = this.option("height") || "auto";
            "auto" === f && (f = parseFloat(o.dataset.width || "") || (t => {
                let e = 0;
                return e = t instanceof HTMLImageElement ? t.naturalWidth : t instanceof SVGElement ? t.width.baseVal.value : Math.max(t.offsetWidth, t.scrollWidth), e || 0
            })(o)), "auto" === m && (m = parseFloat(o.dataset.height || "") || (t => {
                let e = 0;
                return e = t instanceof HTMLImageElement ? t.naturalHeight : t instanceof SVGElement ? t.height.baseVal.value : Math.max(t.offsetHeight, t.scrollHeight), e || 0
            })(o));
            let g = o.parentElement instanceof HTMLPictureElement ? o.parentElement : o;
            this.option("transformParent") && (g = g.parentElement || g);
            const v = g.getAttribute("style") || "";
            g.style.setProperty("transform", "none", "important"), a && (g.style.width = "", g.style.height = ""), g.offsetHeight;
            const y = o.getBoundingClientRect();
            let w = y.width * n,
                x = y.height * n,
                S = 0,
                E = 0;
            a && (Math.abs(f - w) > 1 || Math.abs(m - x) > 1) && ({
                width: w,
                height: x,
                top: S,
                left: E
            } = ((t, e, i, n) => {
                const s = i / n;
                return s > t / e ? (i = t, n = t / s) : (i = e * s, n = e), {
                    width: i,
                    height: n,
                    top: .5 * (e - n),
                    left: .5 * (t - i)
                }
            })(w, x, f, m)), this.contentRect = Object.assign(Object.assign({}, this.contentRect), {
                top: y.top - r.top + S,
                bottom: r.bottom - y.bottom + S,
                left: y.left - r.left + E,
                right: r.right - y.right + E,
                fitWidth: w,
                fitHeight: x,
                width: w,
                height: x,
                fullWidth: f,
                fullHeight: m
            }), g.style.cssText = v, a && (g.style.width = `${w}px`, g.style.height = `${x}px`), this.setTransform(), !0 !== t && this.emit("refresh"), this.ignoreBounds || (e(this.targetScale) < e(this.minScale) ? this.zoomTo(this.minScale, {
                friction: 0
            }) : this.targetScale > this.maxScale ? this.zoomTo(this.maxScale, {
                friction: 0
            }) : this.state === b.Init || this.checkBounds().inBounds || this.requestTick()), this.updateControls()
        }
        getBounds() {
            const t = this.option("bounds");
            if ("auto" !== t) return t;
            const {
                contentWidth: i,
                contentHeight: n
            } = this.calculateContentDim(this.target);
            let s = 0,
                o = 0,
                a = 0,
                r = 0;
            const l = this.option("infinite");
            if (!0 === l || this.lockedAxis && l === this.lockedAxis) s = -1 / 0, a = 1 / 0, o = -1 / 0, r = 1 / 0;
            else {
                let {
                    containerRect: t,
                    contentRect: l
                } = this, c = e(this.contentRect.fitWidth * this.targetScale, T), h = e(this.contentRect.fitHeight * this.targetScale, T), {
                    innerWidth: d,
                    innerHeight: u
                } = t;
                if (this.containerRect.width === c && (d = t.width), this.containerRect.width === h && (u = t.height), i > d) {
                    a = .5 * (i - d), s = -1 * a;
                    let t = .5 * (l.right - l.left);
                    s += t, a += t
                }
                if (this.contentRect.fitWidth > d && i < d && (s -= .5 * (this.contentRect.fitWidth - d), a -= .5 * (this.contentRect.fitWidth - d)), n > u) {
                    r = .5 * (n - u), o = -1 * r;
                    let t = .5 * (l.bottom - l.top);
                    o += t, r += t
                }
                this.contentRect.fitHeight > u && n < u && (s -= .5 * (this.contentRect.fitHeight - u), a -= .5 * (this.contentRect.fitHeight - u))
            }
            return {
                x: {
                    min: s,
                    max: a
                },
                y: {
                    min: o,
                    max: r
                }
            }
        }
        updateControls() {
            const t = this,
                i = t.container,
                {
                    panMode: n,
                    contentRect: s,
                    fullScale: o,
                    targetScale: r,
                    coverScale: l,
                    maxScale: c,
                    minScale: h
                } = t;
            let d = {
                    toggleMax: r - h < .5 * (c - h) ? c : h,
                    toggleCover: r - h < .5 * (l - h) ? l : h,
                    toggleZoom: r - h < .5 * (o - h) ? o : h
                }[t.option("click") || ""] || h,
                u = t.canZoomIn(),
                p = t.canZoomOut(),
                f = p && n === A;
            e(r) < e(h) && !this.panOnlyZoomed && (f = !0), (e(s.width, 1) > e(s.fitWidth, 1) || e(s.height, 1) > e(s.fitHeight, 1)) && (f = !0), e(s.width * r, 1) < e(s.fitWidth, 1) && (f = !1), n === O && (f = !1);
            let m = u && e(d) > e(r),
                g = !m && !f && p && e(d) < e(r);
            a(i, this.cn("canZoomIn"), m), a(i, this.cn("canZoomOut"), g), a(i, this.cn("isDraggable"), f);
            for (const t of i.querySelectorAll('[data-panzoom-action="zoomIn"]')) u ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
            for (const t of i.querySelectorAll('[data-panzoom-action="zoomOut"]')) p ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
            for (const t of i.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
                u || p ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
                const e = t.querySelector("g");
                e && (e.style.display = u ? "" : "none")
            }
        }
        panTo({
            x: t = this.target.e,
            y: e = this.target.f,
            scale: i = this.targetScale,
            friction: n = this.option("friction"),
            angle: s = 0,
            originX: o = 0,
            originY: a = 0,
            flipX: r = !1,
            flipY: l = !1,
            ignoreBounds: c = !1
        }) {
            this.state !== b.Destroy && this.applyChange({
                panX: t - this.target.e,
                panY: e - this.target.f,
                scale: i / this.targetScale,
                angle: s,
                originX: o,
                originY: a,
                friction: n,
                flipX: r,
                flipY: l,
                ignoreBounds: c
            })
        }
        applyChange({
            panX: t = 0,
            panY: i = 0,
            scale: n = 1,
            angle: s = 0,
            originX: o = -this.current.e,
            originY: a = -this.current.f,
            friction: r = this.option("friction"),
            flipX: l = !1,
            flipY: c = !1,
            ignoreBounds: h = !1,
            bounce: d = this.option("bounce")
        }) {
            if (this.state === b.Destroy) return;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.friction = r || 0, this.ignoreBounds = h;
            const {
                current: u
            } = this, p = u.e, f = u.f, m = this.getMatrix(this.target);
            let g = (new DOMMatrix).translate(p, f).translate(o, a).translate(t, i);
            if (this.option("zoom")) {
                if (!h) {
                    const t = this.targetScale,
                        e = this.minScale,
                        i = this.maxScale;
                    t * n < e && (n = e / t), t * n > i && (n = i / t)
                }
                g = g.scale(n)
            }
            g = g.translate(-o, -a).translate(-p, -f).multiply(m), s && (g = g.rotate(s)), l && (g = g.scale(-1, 1)), c && (g = g.scale(1, -1));
            for (const t of v) "e" !== t && "f" !== t && (g[t] > this.minScale + 1e-5 || g[t] < this.minScale - 1e-5) ? this.target[t] = g[t] : this.target[t] = e(g[t], T);
            (this.targetScale < this.scale || Math.abs(n - 1) > .1 || this.panMode === O || !1 === d) && !h && this.clampTargetBounds(), this.isResting || (this.state = b.Panning, this.requestTick())
        }
        stop(t = !1) {
            if (this.state === b.Init || this.state === b.Destroy) return;
            const e = this.isTicking;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
            for (const e of v) this.velocity[e] = 0, "current" === t ? this.current[e] = this.target[e] : "target" === t && (this.target[e] = this.current[e]);
            this.setTransform(), E(this.container, "is-scaling"), E(this.container, "is-animating"), this.isTicking = !1, this.state = b.Ready, e && (this.emit("endAnimation"), this.updateControls())
        }
        requestTick() {
            this.isTicking || (this.emit("startAnimation"), this.updateControls(), P(this.container, "is-animating"), this.isScaling && P(this.container, "is-scaling")), this.isTicking = !0, this.rAF || (this.rAF = requestAnimationFrame((() => this.animate())))
        }
        panWithMouse(t, i = this.option("mouseMoveFriction")) {
            if (this.pmme = t, this.panMode !== O || !t) return;
            if (e(this.targetScale) <= e(this.minScale)) return;
            this.emit("mouseMove", t);
            const {
                container: n,
                containerRect: s,
                contentRect: o
            } = this, a = s.width, r = s.height, l = n.getBoundingClientRect(), c = (t.clientX || 0) - l.left, h = (t.clientY || 0) - l.top;
            let {
                contentWidth: d,
                contentHeight: u
            } = this.calculateContentDim(this.target);
            const p = this.option("mouseMoveFactor");
            p > 1 && (d !== a && (d *= p), u !== r && (u *= p));
            let f = .5 * (d - a) - c / a * 100 / 100 * (d - a);
            f += .5 * (o.right - o.left);
            let m = .5 * (u - r) - h / r * 100 / 100 * (u - r);
            m += .5 * (o.bottom - o.top), this.applyChange({
                panX: f - this.target.e,
                panY: m - this.target.f,
                friction: i
            })
        }
        zoomWithWheel(t) {
            if (this.state === b.Destroy || this.state === b.Init) return;
            const i = Date.now();
            if (i - this.pwt < 45) return void t.preventDefault();
            this.pwt = i;
            var n = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function(t, e) {
                return Math.abs(e) > Math.abs(t) ? e : t
            }));
            const s = Math.max(-1, Math.min(1, n)),
                {
                    targetScale: o,
                    maxScale: a,
                    minScale: r
                } = this;
            let l = o * (100 + 45 * s) / 100;
            e(l) < e(r) && e(o) <= e(r) ? (this.cwd += Math.abs(s), l = r) : e(l) > e(a) && e(o) >= e(a) ? (this.cwd += Math.abs(s), l = a) : (this.cwd = 0, l = Math.max(Math.min(l, a), r)), this.cwd > this.option("wheelLimit") || (t.preventDefault(), e(l) !== e(o) && this.zoomTo(l, {
                event: t
            }))
        }
        canZoomIn() {
            return this.option("zoom") && (e(this.contentRect.width, 1) < e(this.contentRect.fitWidth, 1) || e(this.targetScale) < e(this.maxScale))
        }
        canZoomOut() {
            return this.option("zoom") && e(this.targetScale) > e(this.minScale)
        }
        zoomIn(t = 1.25, e) {
            this.zoomTo(this.targetScale * t, e)
        }
        zoomOut(t = .8, e) {
            this.zoomTo(this.targetScale * t, e)
        }
        zoomToFit(t) {
            this.zoomTo("fit", t)
        }
        zoomToCover(t) {
            this.zoomTo("cover", t)
        }
        zoomToFull(t) {
            this.zoomTo("full", t)
        }
        zoomToMax(t) {
            this.zoomTo("max", t)
        }
        toggleZoom(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.fullScale - this.minScale) ? "full" : "fit", t)
        }
        toggleMax(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.maxScale - this.minScale) ? "max" : "fit", t)
        }
        toggleCover(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.coverScale - this.minScale) ? "cover" : "fit", t)
        }
        iterateZoom(t) {
            this.zoomTo("next", t)
        }
        zoomTo(t = 1, {
            friction: e = "auto",
            originX: i = 0,
            originY: n = 0,
            event: s
        } = {}) {
            if (this.isContentLoading || this.state === b.Destroy) return;
            const {
                targetScale: o
            } = this;
            this.stop();
            let a = 1;
            if (this.panMode === O && (s = this.pmme || s), s) {
                const t = this.content.getBoundingClientRect(),
                    e = s.clientX || 0,
                    o = s.clientY || 0;
                i = e - t.left - .5 * t.width, n = o - t.top - .5 * t.height
            }
            const r = this.fullScale,
                l = this.maxScale;
            let c = this.coverScale;
            "number" == typeof t ? a = t / o : ("next" === t && (r - c < .2 && (c = r), t = o < r - 1e-5 ? "full" : o < l - 1e-5 ? "max" : "fit"), a = "full" === t ? r / o || 1 : "cover" === t ? c / o || 1 : "max" === t ? l / o || 1 : 1 / o || 1), e = "auto" === e ? a > 1 ? .15 : .25 : e, this.applyChange({
                scale: a,
                originX: i,
                originY: n,
                friction: e
            }), s && this.panMode === O && this.panWithMouse(s, e)
        }
        rotateCCW() {
            this.applyChange({
                angle: -90
            })
        }
        rotateCW() {
            this.applyChange({
                angle: 90
            })
        }
        flipX() {
            this.applyChange({
                flipX: !0
            })
        }
        flipY() {
            this.applyChange({
                flipY: !0
            })
        }
        fitX() {
            this.stop("target");
            const {
                containerRect: t,
                contentRect: e,
                target: i
            } = this;
            this.applyChange({
                panX: .5 * t.width - (e.left + .5 * e.fitWidth) - i.e,
                panY: .5 * t.height - (e.top + .5 * e.fitHeight) - i.f,
                scale: t.width / e.fitWidth / this.targetScale,
                originX: 0,
                originY: 0,
                ignoreBounds: !0
            })
        }
        fitY() {
            this.stop("target");
            const {
                containerRect: t,
                contentRect: e,
                target: i
            } = this;
            this.applyChange({
                panX: .5 * t.width - (e.left + .5 * e.fitWidth) - i.e,
                panY: .5 * t.innerHeight - (e.top + .5 * e.fitHeight) - i.f,
                scale: t.height / e.fitHeight / this.targetScale,
                originX: 0,
                originY: 0,
                ignoreBounds: !0
            })
        }
        toggleFS() {
            const {
                container: t
            } = this, e = this.cn("inFullscreen"), i = this.cn("htmlHasFullscreen");
            t.classList.toggle(e);
            const n = t.classList.contains(e);
            n ? (document.documentElement.classList.add(i), document.addEventListener("keydown", this.onKeydown, !0)) : (document.documentElement.classList.remove(i), document.removeEventListener("keydown", this.onKeydown, !0)), this.updateMetrics(), this.emit(n ? "enterFS" : "exitFS")
        }
        getMatrix(t = this.current) {
            const {
                a: e,
                b: i,
                c: n,
                d: s,
                e: o,
                f: a
            } = t;
            return new DOMMatrix([e, i, n, s, o, a])
        }
        reset(t) {
            if (this.state !== b.Init && this.state !== b.Destroy) {
                this.stop("current");
                for (const t of v) this.target[t] = C[t];
                this.target.a = this.minScale, this.target.d = this.minScale, this.clampTargetBounds(), this.isResting || (this.friction = void 0 === t ? this.option("friction") : t, this.state = b.Panning, this.requestTick())
            }
        }
        destroy() {
            this.stop(), this.state = b.Destroy, this.detachEvents(), this.detachObserver();
            const {
                container: t,
                content: e
            } = this, i = this.option("classes") || {};
            for (const e of Object.values(i)) t.classList.remove(e + "");
            e && (e.removeEventListener("load", this.onLoad), e.removeEventListener("error", this.onError)), this.detachPlugins()
        }
    }
    Object.defineProperty(k, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: w
    }), Object.defineProperty(k, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    });
    const I = function(t, e) {
            let i = !0;
            return (...n) => {
                i && (i = !1, t(...n), setTimeout((() => {
                    i = !0
                }), e))
            }
        },
        D = (t, e) => {
            let i = [];
            return t.childNodes.forEach((t => {
                t.nodeType !== Node.ELEMENT_NODE || e && !t.matches(e) || i.push(t)
            })), i
        },
        F = {
            viewport: null,
            track: null,
            enabled: !0,
            slides: [],
            axis: "x",
            transition: "fade",
            preload: 1,
            slidesPerPage: "auto",
            initialPage: 0,
            friction: .12,
            Panzoom: {
                decelFriction: .12
            },
            center: !0,
            infinite: !0,
            fill: !0,
            dragFree: !1,
            adaptiveHeight: !1,
            direction: "ltr",
            classes: {
                container: "f-carousel",
                viewport: "f-carousel__viewport",
                track: "f-carousel__track",
                slide: "f-carousel__slide",
                isLTR: "is-ltr",
                isRTL: "is-rtl",
                isHorizontal: "is-horizontal",
                isVertical: "is-vertical",
                inTransition: "in-transition",
                isSelected: "is-selected"
            },
            l10n: {
                NEXT: "Next slide",
                PREV: "Previous slide",
                GOTO: "Go to slide #%d"
            }
        };
    var j;
    ! function(t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Destroy = 2] = "Destroy"
    }(j || (j = {}));
    const H = t => {
            if ("string" == typeof t && (t = {
                    html: t
                }), !(t instanceof String || t instanceof HTMLElement)) {
                const e = t.thumb;
                void 0 !== e && ("string" == typeof e && (t.thumbSrc = e), e instanceof HTMLImageElement && (t.thumbEl = e, t.thumbElSrc = e.src, t.thumbSrc = e.src), delete t.thumb)
            }
            return Object.assign({
                html: "",
                el: null,
                isDom: !1,
                class: "",
                index: -1,
                dim: 0,
                gap: 0,
                pos: 0,
                transition: !1
            }, t)
        },
        B = (t = {}) => Object.assign({
            index: -1,
            slides: [],
            dim: 0,
            pos: -1
        }, t);
    class _ extends m {
        constructor(t, e) {
            super(e), Object.defineProperty(this, "instance", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: t
            })
        }
        attach() {}
        detach() {}
    }
    const N = {
        classes: {
            list: "f-carousel__dots",
            isDynamic: "is-dynamic",
            hasDots: "has-dots",
            dot: "f-carousel__dot",
            isBeforePrev: "is-before-prev",
            isPrev: "is-prev",
            isCurrent: "is-current",
            isNext: "is-next",
            isAfterNext: "is-after-next"
        },
        dotTpl: '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>',
        dynamicFrom: 11,
        maxCount: 1 / 0,
        minCount: 2
    };
    class W extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "isDynamic", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "list", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onRefresh() {
            this.refresh()
        }
        build() {
            let t = this.list;
            return t || (t = document.createElement("ul"), P(t, this.cn("list")), t.setAttribute("role", "tablist"), this.instance.container.appendChild(t), P(this.instance.container, this.cn("hasDots")), this.list = t), t
        }
        refresh() {
            var t;
            const e = this.instance.pages.length,
                i = Math.min(2, this.option("minCount")),
                n = Math.max(2e3, this.option("maxCount")),
                s = this.option("dynamicFrom");
            if (e < i || e > n) return void this.cleanup();
            const o = "number" == typeof s && e > 5 && e >= s,
                r = !this.list || this.isDynamic !== o || this.list.children.length !== e;
            r && this.cleanup();
            const l = this.build();
            if (a(l, this.cn("isDynamic"), !!o), r)
                for (let t = 0; t < e; t++) l.append(this.createItem(t));
            let c, h = 0;
            for (const e of [...l.children]) {
                const i = h === this.instance.page;
                i && (c = e), a(e, this.cn("isCurrent"), i), null === (t = e.children[0]) || void 0 === t || t.setAttribute("aria-selected", i ? "true" : "false");
                for (const t of ["isBeforePrev", "isPrev", "isNext", "isAfterNext"]) E(e, this.cn(t));
                h++
            }
            if (c = c || l.firstChild, o && c) {
                const t = c.previousElementSibling,
                    e = t && t.previousElementSibling;
                P(t, this.cn("isPrev")), P(e, this.cn("isBeforePrev"));
                const i = c.nextElementSibling,
                    n = i && i.nextElementSibling;
                P(i, this.cn("isNext")), P(n, this.cn("isAfterNext"))
            }
            this.isDynamic = o
        }
        createItem(t = 0) {
            var e;
            const i = document.createElement("li");
            i.setAttribute("role", "presentation");
            const n = s(this.instance.localize(this.option("dotTpl"), [
                ["%d", t + 1]
            ]).replace(/\%i/g, t + ""));
            return i.appendChild(n), null === (e = i.children[0]) || void 0 === e || e.setAttribute("role", "tab"), i
        }
        cleanup() {
            this.list && (this.list.remove(), this.list = null), this.isDynamic = !1, E(this.instance.container, this.cn("hasDots"))
        }
        attach() {
            this.instance.on(["refresh", "change"], this.onRefresh)
        }
        detach() {
            this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup()
        }
    }
    Object.defineProperty(W, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: N
    });
    const $ = "disabled",
        X = "next",
        Y = "prev";
    class q extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "prev", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "next", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onRefresh() {
            const t = this.instance,
                e = t.pages.length,
                i = t.page;
            if (e < 2) return void this.cleanup();
            this.build();
            let n = this.prev,
                s = this.next;
            n && s && (n.removeAttribute($), s.removeAttribute($), t.isInfinite || (i <= 0 && n.setAttribute($, ""), i >= e - 1 && s.setAttribute($, "")))
        }
        createButton(t) {
            const e = this.instance,
                i = document.createElement("button");
            i.setAttribute("tabindex", "0"), i.setAttribute("title", e.localize(`{{${t.toUpperCase()}}}`)), P(i, this.cn("button") + " " + this.cn(t === X ? "isNext" : "isPrev"));
            const n = e.isRTL ? t === X ? Y : X : t;
            var s;
            return i.innerHTML = e.localize(this.option(`${n}Tpl`)), i.dataset[`carousel${s=t,s?s.match("^[a-z]")?s.charAt(0).toUpperCase()+s.substring(1):s:""}`] = "true", i
        }
        build() {
            let t = this.container;
            t || (this.container = t = document.createElement("div"), P(t, this.cn("container")), this.instance.container.appendChild(t)), this.next || (this.next = t.appendChild(this.createButton(X))), this.prev || (this.prev = t.appendChild(this.createButton(Y)))
        }
        cleanup() {
            this.prev && this.prev.remove(), this.next && this.next.remove(), this.container && this.container.remove(), this.prev = null, this.next = null, this.container = null
        }
        attach() {
            this.instance.on(["refresh", "change"], this.onRefresh)
        }
        detach() {
            this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup()
        }
    }
    Object.defineProperty(q, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            classes: {
                container: "f-carousel__nav",
                button: "f-button",
                isNext: "is-next",
                isPrev: "is-prev"
            },
            nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
            prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>'
        }
    });
    class V extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "selectedIndex", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "target", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "nav", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        addAsTargetFor(t) {
            this.target = this.instance, this.nav = t, this.attachEvents()
        }
        addAsNavFor(t) {
            this.nav = this.instance, this.target = t, this.attachEvents()
        }
        attachEvents() {
            this.nav && this.target && (this.nav.options.initialSlide = this.target.options.initialPage, this.nav.on("ready", this.onNavReady), this.nav.state === j.Ready && this.onNavReady(this.nav), this.target.on("ready", this.onTargetReady), this.target.state === j.Ready && this.onTargetReady(this.target))
        }
        onNavReady(t) {
            t.on("createSlide", this.onNavCreateSlide), t.on("Panzoom.click", this.onNavClick), t.on("Panzoom.touchEnd", this.onNavTouch), this.onTargetChange()
        }
        onTargetReady(t) {
            t.on("change", this.onTargetChange), t.on("Panzoom.refresh", this.onTargetChange), this.onTargetChange()
        }
        onNavClick(t, e, i) {
            i.pointerType || this.onNavTouch(t, t.panzoom, i)
        }
        onNavTouch(t, e, i) {
            var n, s;
            if (Math.abs(e.dragOffset.x) > 3 || Math.abs(e.dragOffset.y) > 3) return;
            const o = i.target,
                {
                    nav: a,
                    target: r
                } = this;
            if (!a || !r || !o) return;
            const l = o.closest("[data-index]");
            if (i.stopPropagation(), i.preventDefault(), !l) return;
            const c = parseInt(l.dataset.index || "", 10) || 0,
                h = r.getPageForSlide(c),
                d = a.getPageForSlide(c);
            a.slideTo(d), r.slideTo(h, {
                friction: (null === (s = null === (n = this.nav) || void 0 === n ? void 0 : n.plugins) || void 0 === s ? void 0 : s.Sync.option("friction")) || 0
            }), this.markSelectedSlide(c)
        }
        onNavCreateSlide(t, e) {
            e.index === this.selectedIndex && this.markSelectedSlide(e.index)
        }
        onTargetChange() {
            const {
                target: t,
                nav: e
            } = this;
            if (!t || !e) return;
            if (e.state !== j.Ready || t.state !== j.Ready) return;
            const i = t.pages[t.page].slides[0].index,
                n = e.getPageForSlide(i);
            this.markSelectedSlide(i), e.slideTo(n)
        }
        markSelectedSlide(t) {
            const e = this.nav;
            e && e.state === j.Ready && (this.selectedIndex = t, [...e.slides].map((e => {
                e.el && e.el.classList[e.index === t ? "add" : "remove"]("is-nav-selected")
            })))
        }
        attach() {
            const t = this;
            let e = t.options.target,
                i = t.options.nav;
            e ? t.addAsNavFor(e) : i && t.addAsTargetFor(i)
        }
        detach() {
            const t = this,
                e = t.nav,
                i = t.target;
            e && (e.off("ready", t.onNavReady), e.off("createSlide", t.onNavCreateSlide), e.off("Panzoom.click", t.onNavClick), e.off("Panzoom.touchEnd", t.onNavTouch)), t.nav = null, i && (i.off("ready", t.onTargetReady), i.off("refresh", t.onTargetChange), i.off("change", t.onTargetChange)), t.target = null
        }
    }
    Object.defineProperty(V, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            friction: .35
        }
    });
    const Z = {
        Navigation: q,
        Dots: W,
        Sync: V
    };
    class G extends g {
        get axis() {
            return this.isHorizontal ? "e" : "f"
        }
        get isEnabled() {
            return this.state === j.Ready
        }
        get isInfinite() {
            let t = !1;
            const {
                contentDim: e,
                viewportDim: i,
                pages: n,
                slides: s
            } = this;
            return n.length >= 2 && e + s[0].dim >= i && (t = this.option("infinite")), t
        }
        get isRTL() {
            return "rtl" === this.option("direction")
        }
        get isHorizontal() {
            return "x" === this.option("axis")
        }
        constructor(t, e = {}, i = {}) {
            if (super(), Object.defineProperty(this, "userOptions", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {}
                }), Object.defineProperty(this, "userPlugins", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {}
                }), Object.defineProperty(this, "bp", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: ""
                }), Object.defineProperty(this, "lp", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "state", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: j.Init
                }), Object.defineProperty(this, "page", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "prevPage", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "container", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "viewport", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "track", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "slides", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "pages", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "panzoom", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "inTransition", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: new Set
                }), Object.defineProperty(this, "contentDim", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "viewportDim", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), "string" == typeof t && (t = document.querySelector(t)), !t || !S(t)) throw new Error("No Element found");
            this.container = t, this.slideNext = I(this.slideNext.bind(this), 150), this.slidePrev = I(this.slidePrev.bind(this), 150), this.userOptions = e, this.userPlugins = i, queueMicrotask((() => {
                this.processOptions()
            }))
        }
        processOptions() {
            const t = p({}, G.defaults, this.userOptions);
            let e = "";
            const i = t.breakpoints;
            if (i && u(i))
                for (const [n, s] of Object.entries(i)) window.matchMedia(n).matches && u(s) && (e += n, p(t, s));
            e === this.bp && this.state !== j.Init || (this.bp = e, this.state === j.Ready && (t.initialSlide = this.pages[this.page].slides[0].index), this.state !== j.Init && this.destroy(), super.setOptions(t), !1 === this.option("enabled") ? this.attachEvents() : setTimeout((() => {
                this.init()
            }), 0))
        }
        init() {
            this.state = j.Init, this.emit("init"), this.attachPlugins(Object.assign(Object.assign({}, G.Plugins), this.userPlugins)), this.initLayout(), this.initSlides(), this.updateMetrics(), this.setInitialPosition(), this.initPanzoom(), this.attachEvents(), this.state = j.Ready, this.emit("ready")
        }
        initLayout() {
            const {
                container: t
            } = this, e = this.option("classes");
            P(t, this.cn("container")), a(t, e.isLTR, !this.isRTL), a(t, e.isRTL, this.isRTL), a(t, e.isVertical, !this.isHorizontal), a(t, e.isHorizontal, this.isHorizontal);
            let i = this.option("viewport") || t.querySelector(`.${e.viewport}`);
            i || (i = document.createElement("div"), P(i, e.viewport), i.append(...D(t, `.${e.slide}`)), t.prepend(i));
            let n = this.option("track") || t.querySelector(`.${e.track}`);
            n || (n = document.createElement("div"), P(n, e.track), n.append(...Array.from(i.childNodes))), n.setAttribute("aria-live", "polite"), i.contains(n) || i.prepend(n), this.viewport = i, this.track = n, this.emit("initLayout")
        }
        initSlides() {
            const {
                track: t
            } = this;
            if (t) {
                this.slides = [], [...D(t, `.${this.cn("slide")}`)].forEach((t => {
                    if (S(t)) {
                        const e = H({
                            el: t,
                            isDom: !0,
                            index: this.slides.length
                        });
                        this.slides.push(e), this.emit("initSlide", e, this.slides.length)
                    }
                }));
                for (let t of this.option("slides", [])) {
                    const e = H(t);
                    e.index = this.slides.length, this.slides.push(e), this.emit("initSlide", e, this.slides.length)
                }
                this.emit("initSlides")
            }
        }
        setInitialPage() {
            let t = 0;
            const e = this.option("initialSlide");
            t = "number" == typeof e ? this.getPageForSlide(e) : parseInt(this.option("initialPage", 0) + "", 10) || 0, this.page = t
        }
        setInitialPosition() {
            if (!this.track || !this.pages.length) return;
            const t = this.isHorizontal;
            let e = this.page;
            this.pages[e] || (this.page = e = 0);
            const i = this.pages[e].pos * (this.isRTL && t ? 1 : -1),
                n = t ? `${i}px` : "0",
                s = t ? "0" : `${i}px`;
            this.track.style.transform = `translate3d(${n}, ${s}, 0) scale(1)`, this.option("adaptiveHeight") && this.setViewportHeight()
        }
        initPanzoom() {
            this.panzoom && (this.panzoom.destroy(), this.panzoom = null);
            const t = this.option("Panzoom") || {};
            this.panzoom = new k(this.viewport, p({}, {
                content: this.track,
                zoom: !1,
                panOnlyZoomed: !1,
                lockAxis: this.isHorizontal ? "x" : "y",
                infinite: this.isInfinite,
                click: !1,
                dblClick: !1,
                touch: t => !(this.pages.length < 2 && !t.options.infinite),
                bounds: () => this.getBounds(),
                maxVelocity: t => Math.abs(t.target[this.axis] - t.current[this.axis]) < 2 * this.viewportDim ? 100 : 0
            }, t)), this.panzoom.on("*", ((t, e, ...i) => {
                this.emit(`Panzoom.${e}`, t, ...i)
            })), this.panzoom.on("decel", this.onDecel), this.panzoom.on("refresh", this.onRefresh), this.panzoom.on("beforeTransform", this.onBeforeTransform), this.panzoom.on("endAnimation", this.onEndAnimation)
        }
        attachEvents() {
            const t = this.container;
            t && (t.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.addEventListener("slideTo", this.onSlideTo)), window.addEventListener("resize", this.onResize)
        }
        createPages() {
            let t = [];
            const {
                contentDim: e,
                viewportDim: i
            } = this;
            let n = this.option("slidesPerPage");
            ("number" != typeof n || e <= i) && (n = 1 / 0);
            let s = 0,
                o = 0,
                a = 0;
            for (const e of this.slides)(!t.length || o + e.dim > i || a === n) && (t.push(B()), s = t.length - 1, o = 0, a = 0), t[s].slides.push(e), o += e.dim + e.gap, a++;
            return t
        }
        processPages() {
            const t = this.pages,
                {
                    contentDim: i,
                    viewportDim: n
                } = this,
                s = this.option("center"),
                o = this.option("fill"),
                a = o && s && i > n && !this.isInfinite;
            if (t.forEach(((t, e) => {
                    t.index = e, t.pos = t.slides[0].pos, t.dim = 0;
                    for (const [e, i] of t.slides.entries()) t.dim += i.dim, e < t.slides.length - 1 && (t.dim += i.gap);
                    a && t.pos + .5 * t.dim < .5 * n ? t.pos = 0 : a && t.pos + .5 * t.dim >= i - .5 * n ? t.pos = i - n : s && (t.pos += -.5 * (n - t.dim))
                })), t.forEach(((t, s) => {
                    o && !this.isInfinite && i > n && (t.pos = Math.max(t.pos, 0), t.pos = Math.min(t.pos, i - n)), t.pos = e(t.pos, 1e3), t.dim = e(t.dim, 1e3), t.pos < .1 && t.pos > -.1 && (t.pos = 0)
                })), this.isInfinite) return t;
            const r = [];
            let l;
            return t.forEach((t => {
                const e = Object.assign({}, t);
                l && e.pos === l.pos ? (l.dim += e.dim, l.slides = [...l.slides, ...e.slides]) : (e.index = r.length, l = e, r.push(e))
            })), r
        }
        getPageFromIndex(t = 0) {
            const e = this.pages.length;
            let i;
            return t = parseInt((t || 0).toString()) || 0, i = this.isInfinite ? (t % e + e) % e : Math.max(Math.min(t, e - 1), 0), i
        }
        getSlideMetrics(t) {
            var i;
            const n = this.isHorizontal ? "width" : "height";
            let s = 0,
                o = 0,
                a = t.el;
            if (a ? s = parseFloat(a.dataset[n] || "") || 0 : (a = document.createElement("div"), a.style.visibility = "hidden", P(a, this.cn("slide") + " " + t.class), (this.track || document.body).prepend(a)), s) a.style[n] = `${s}px`, a.style["width" === n ? "height" : "width"] = "";
            else {
                const t = Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1);
                s = a.getBoundingClientRect()[n] * t
            }
            const r = getComputedStyle(a);
            return "content-box" === r.boxSizing && (this.isHorizontal ? (s += parseFloat(r.paddingLeft) || 0, s += parseFloat(r.paddingRight) || 0) : (s += parseFloat(r.paddingTop) || 0, s += parseFloat(r.paddingBottom) || 0)), o = parseFloat(r[this.isHorizontal ? "marginRight" : "marginBottom"]) || 0, t.el || a.remove(), {
                dim: e(s, 1e3),
                gap: e(o, 1e3)
            }
        }
        getBounds() {
            const {
                isInfinite: t,
                isRTL: e,
                isHorizontal: i,
                pages: n
            } = this;
            let s = {
                min: 0,
                max: 0
            };
            if (t) s = {
                min: -1 / 0,
                max: 1 / 0
            };
            else if (n.length) {
                const t = n[0].pos,
                    o = n[n.length - 1].pos;
                s = e && i ? {
                    min: t,
                    max: o
                } : {
                    min: -1 * o,
                    max: -1 * t
                }
            }
            return {
                x: i ? s : {
                    min: 0,
                    max: 0
                },
                y: i ? {
                    min: 0,
                    max: 0
                } : s
            }
        }
        repositionSlides() {
            let t, {
                    isHorizontal: i,
                    isRTL: n,
                    isInfinite: s,
                    viewport: o,
                    viewportDim: a,
                    contentDim: r,
                    page: l,
                    pages: c,
                    slides: h,
                    panzoom: d
                } = this,
                u = 0,
                p = 0,
                f = 0,
                m = 0;
            d ? m = -1 * d.current[this.axis] : c[l] && (m = c[l].pos || 0), t = i ? n ? "right" : "left" : "top", n && i && (m *= -1);
            for (const i of h) i.el ? ("top" === t ? (i.el.style.right = "", i.el.style.left = "") : i.el.style.top = "", i.index !== u ? i.el.style[t] = 0 === p ? "" : `${e(p,1e3)}px` : i.el.style[t] = "", f += i.dim + i.gap, u++) : p += i.dim + i.gap;
            if (s && f && o) {
                let n = getComputedStyle(o),
                    s = "padding",
                    l = i ? "Right" : "Bottom",
                    c = parseFloat(n[s + (i ? "Left" : "Top")]);
                m -= c, a += c, a += parseFloat(n[s + l]);
                for (const i of h) i.el && (e(i.pos) < e(a) && e(i.pos + i.dim + i.gap) < e(m) && e(m) > e(r - a) && (i.el.style[t] = `${e(p+f,1e3)}px`), e(i.pos + i.gap) >= e(r - a) && e(i.pos) > e(m + a) && e(m) < e(a) && (i.el.style[t] = `-${e(f,1e3)}px`))
            }
            let g, b, v = [...this.inTransition];
            if (v.length > 1 && (g = c[v[0]], b = c[v[1]]), g && b) {
                let i = 0;
                for (const n of h) n.el ? this.inTransition.has(n.index) && g.slides.indexOf(n) < 0 && (n.el.style[t] = `${e(i+(g.pos-b.pos),1e3)}px`) : i += n.dim + n.gap
            }
        }
        createSlideEl(t) {
            const {
                track: e,
                slides: i
            } = this;
            if (!e || !t) return;
            if (t.el) return;
            const n = document.createElement("div");
            P(n, this.cn("slide")), P(n, t.class), P(n, t.customClass), t.html && (n.innerHTML = t.html);
            const s = [];
            i.forEach(((t, e) => {
                t.el && s.push(e)
            }));
            const o = t.index;
            let a = null;
            if (s.length) {
                a = i[s.reduce(((t, e) => Math.abs(e - o) < Math.abs(t - o) ? e : t))]
            }
            const r = a && a.el ? a.index < t.index ? a.el.nextSibling : a.el : null;
            e.insertBefore(n, e.contains(r) ? r : null), t.el = n, this.emit("createSlide", t)
        }
        removeSlideEl(t, e = !1) {
            const i = t.el;
            if (!i) return;
            if (E(i, this.cn("isSelected")), t.isDom && !e) return i.removeAttribute("aria-hidden"), i.removeAttribute("data-index"), E(i, this.cn("isSelected")), void(i.style.left = "");
            this.emit("removeSlide", t);
            const n = new CustomEvent("animationend");
            i.dispatchEvent(n), t.el && t.el.remove(), t.el = null
        }
        transitionTo(t = 0, i = this.option("transition")) {
            if (!i) return !1;
            const {
                pages: n,
                panzoom: s
            } = this;
            t = parseInt((t || 0).toString()) || 0;
            const o = this.getPageFromIndex(t);
            if (!s || !n[o] || n.length < 2 || Math.abs(n[this.page].slides[0].dim - this.viewportDim) > 1) return !1;
            const a = t > this.page ? 1 : -1,
                r = this.pages[o].pos * (this.isRTL ? 1 : -1);
            if (this.page === o && e(r, 1e3) === e(s.target[this.axis], 1e3)) return !1;
            this.clearTransitions();
            const l = s.isResting;
            P(this.container, this.cn("inTransition"));
            const c = this.pages[this.page].slides[0],
                h = this.pages[o].slides[0];
            this.inTransition.add(h.index), this.createSlideEl(h);
            let d = c.el,
                u = h.el;
            l || "slide" === i || (i = "fadeFast", d = null);
            const p = this.isRTL ? "next" : "prev",
                f = this.isRTL ? "prev" : "next";
            return d && (this.inTransition.add(c.index), c.transition = i, d.addEventListener("animationend", this.onAnimationEnd), d.classList.add(`f-${i}Out`, `to-${a>0?f:p}`)), u && (h.transition = i, u.addEventListener("animationend", this.onAnimationEnd), u.classList.add(`f-${i}In`, `from-${a>0?p:f}`)), s.panTo({
                x: this.isHorizontal ? r : 0,
                y: this.isHorizontal ? 0 : r,
                friction: 0
            }), this.onChange(o), !0
        }
        manageSlideVisiblity() {
            const t = new Set,
                e = new Set,
                i = this.getVisibleSlides(parseFloat(this.option("preload", 0) + "") || 0);
            for (const n of this.slides) i.has(n) ? t.add(n) : e.add(n);
            for (const e of this.inTransition) t.add(this.slides[e]);
            for (const e of t) this.createSlideEl(e), this.lazyLoadSlide(e);
            for (const i of e) t.has(i) || this.removeSlideEl(i);
            this.markSelectedSlides(), this.repositionSlides()
        }
        markSelectedSlides() {
            if (!this.pages[this.page] || !this.pages[this.page].slides) return;
            const t = "aria-hidden";
            let e = this.cn("isSelected");
            if (e)
                for (const i of this.slides) i.el && (i.el.dataset.index = `${i.index}`, this.pages[this.page].slides.includes(i) ? (i.el.classList.contains(e) || (P(i.el, e), this.emit("selectSlide", i)), i.el.removeAttribute(t)) : (i.el.classList.contains(e) && (E(i.el, e), this.emit("unselectSlide", i)), i.el.setAttribute(t, "true")))
        }
        flipInfiniteTrack() {
            const t = this.panzoom;
            if (!t || !this.isInfinite) return;
            const e = "x" === this.option("axis") ? "e" : "f",
                {
                    viewportDim: i,
                    contentDim: n
                } = this;
            let s = t.current[e],
                o = t.target[e] - s,
                a = 0,
                r = .5 * i,
                l = n;
            this.isRTL && this.isHorizontal ? (s < -r && (a = -1, s += l), s > l - r && (a = 1, s -= l)) : (s > r && (a = 1, s -= l), s < -l + r && (a = -1, s += l)), a && (t.current[e] = s, t.target[e] = s + o)
        }
        lazyLoadSlide(t) {
            const e = this,
                i = t && t.el;
            if (!i) return;
            const n = new Set,
                o = "f-fadeIn";
            i.querySelectorAll("[data-lazy-srcset]").forEach((t => {
                t instanceof HTMLImageElement && n.add(t)
            }));
            let a = Array.from(i.querySelectorAll("[data-lazy-src]"));
            i.dataset.lazySrc && a.push(i), a.map((t => {
                t instanceof HTMLImageElement ? n.add(t) : S(t) && (t.style.backgroundImage = `url('${t.dataset.lazySrc||""}')`, delete t.dataset.lazySrc)
            }));
            const r = (t, i, n) => {
                n && (n.remove(), n = null), i.complete && (i.classList.add(o), setTimeout((() => {
                    i.classList.remove(o)
                }), 350), i.style.display = ""), this.option("adaptiveHeight") && t.el && this.pages[this.page].slides.indexOf(t) > -1 && (e.updateMetrics(), e.setViewportHeight()), this.emit("load", t)
            };
            for (const e of n) {
                let i = null;
                e.src = e.dataset.lazySrcset || e.dataset.lazySrc || "", delete e.dataset.lazySrc, delete e.dataset.lazySrcset, e.style.display = "none", e.addEventListener("error", (() => {
                    r(t, e, i)
                })), e.addEventListener("load", (() => {
                    r(t, e, i)
                })), setTimeout((() => {
                    e.parentNode && t.el && (e.complete ? r(t, e, i) : (i = s(x), e.parentNode.insertBefore(i, e)))
                }), 300)
            }
        }
        onAnimationEnd(t) {
            var e;
            const i = t.target,
                n = i ? parseInt(i.dataset.index || "", 10) || 0 : -1,
                s = this.slides[n],
                o = t.animationName;
            if (!i || !s || !o) return;
            const a = !!this.inTransition.has(n) && s.transition;
            a && o.substring(0, a.length + 2) === `f-${a}` && this.inTransition.delete(n), this.inTransition.size || this.clearTransitions(), n === this.page && (null === (e = this.panzoom) || void 0 === e ? void 0 : e.isResting) && this.emit("settle")
        }
        onDecel(t, e = 0, i = 0, n = 0, s = 0) {
            const {
                isRTL: o,
                isHorizontal: a,
                axis: r,
                pages: l
            } = this, c = l.length, h = Math.abs(Math.atan2(i, e) / (Math.PI / 180));
            let d = 0;
            if (d = h > 45 && h < 135 ? a ? 0 : i : a ? e : 0, !c) return;
            const u = this.option("dragFree");
            let p = this.page,
                f = o && a ? 1 : -1;
            const m = t.target[r] * f,
                g = t.current[r] * f;
            let {
                pageIndex: b
            } = this.getPageFromPosition(m), {
                pageIndex: v
            } = this.getPageFromPosition(g);
            u ? this.onChange(b) : (Math.abs(d) > 5 ? (l[p].dim < document.documentElement["client" + (this.isHorizontal ? "Width" : "Height")] - 1 && (p = v), p = o && a ? d < 0 ? p - 1 : p + 1 : d < 0 ? p + 1 : p - 1) : p = 0 === n && 0 === s ? p : v, this.slideTo(p, {
                transition: !1,
                friction: t.option("decelFriction")
            }))
        }
        onClick(t) {
            const e = t.target,
                i = e && S(e) ? e.dataset : null;
            let n, s;
            i && (void 0 !== i.carouselPage ? (s = "slideTo", n = i.carouselPage) : void 0 !== i.carouselNext ? s = "slideNext" : void 0 !== i.carouselPrev && (s = "slidePrev")), s ? (t.preventDefault(), t.stopPropagation(), e && !e.hasAttribute("disabled") && this[s](n)) : this.emit("click", t)
        }
        onSlideTo(t) {
            const e = t.detail || 0;
            this.slideTo(this.getPageForSlide(e), {
                friction: 0
            })
        }
        onChange(t, e = 0) {
            const i = this.page;
            this.prevPage = i, this.page = t, this.option("adaptiveHeight") && this.setViewportHeight(), t !== i && (this.markSelectedSlides(), this.emit("change", t, i, e))
        }
        onRefresh() {
            let t = this.contentDim,
                e = this.viewportDim;
            this.updateMetrics(), this.contentDim === t && this.viewportDim === e || this.slideTo(this.page, {
                friction: 0,
                transition: !1
            })
        }
        onResize() {
            this.option("breakpoints") && this.processOptions()
        }
        onBeforeTransform(t) {
            this.lp !== t.current[this.axis] && (this.flipInfiniteTrack(), this.manageSlideVisiblity()), this.lp = t.current.e
        }
        onEndAnimation() {
            this.inTransition.size || this.emit("settle")
        }
        reInit(t = null, e = null) {
            this.destroy(), this.state = j.Init, this.userOptions = t || this.userOptions, this.userPlugins = e || this.userPlugins, this.processOptions()
        }
        slideTo(t = 0, {
            friction: e = this.option("friction"),
            transition: i = this.option("transition")
        } = {}) {
            if (this.state === j.Destroy) return;
            const {
                axis: n,
                isHorizontal: s,
                isRTL: o,
                pages: a,
                panzoom: r
            } = this, l = a.length, c = o && s ? 1 : -1;
            if (!r || !l) return;
            if (this.transitionTo(t, i)) return;
            const h = this.getPageFromIndex(t);
            let d = a[h].pos;
            if (this.isInfinite) {
                const e = this.contentDim,
                    i = r.target[n] * c;
                if (2 === l) d += e * Math.floor(parseFloat(t + "") / 2);
                else {
                    const t = i;
                    d = [d, d - e, d + e].reduce((function(e, i) {
                        return Math.abs(i - t) < Math.abs(e - t) ? i : e
                    }))
                }
            }
            d *= c, Math.abs(r.target[n] - d) < .1 || (r.panTo({
                x: s ? d : 0,
                y: s ? 0 : d,
                friction: e
            }), this.onChange(h))
        }
        slideToClosest(t) {
            if (this.panzoom) {
                const {
                    pageIndex: e
                } = this.getPageFromPosition(this.panzoom.current[this.isHorizontal ? "e" : "f"]);
                this.slideTo(e, t)
            }
        }
        slideNext() {
            this.slideTo(this.page + 1)
        }
        slidePrev() {
            this.slideTo(this.page - 1)
        }
        clearTransitions() {
            this.inTransition.clear(), E(this.container, this.cn("inTransition"));
            const t = ["to-prev", "to-next", "from-prev", "from-next"];
            for (const e of this.slides) {
                const i = e.el;
                if (i) {
                    i.removeEventListener("animationend", this.onAnimationEnd), i.classList.remove(...t);
                    const n = e.transition;
                    n && i.classList.remove(`f-${n}Out`, `f-${n}In`)
                }
            }
            this.manageSlideVisiblity()
        }
        prependSlide(t) {
            var e, i;
            let n = Array.isArray(t) ? t : [t];
            for (const t of n.reverse()) this.slides.unshift(H(t));
            for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
            const s = (null === (e = this.pages[this.page]) || void 0 === e ? void 0 : e.pos) || 0;
            this.page += n.length, this.updateMetrics();
            const o = (null === (i = this.pages[this.page]) || void 0 === i ? void 0 : i.pos) || 0;
            if (this.panzoom) {
                const t = this.isRTL ? s - o : o - s;
                this.panzoom.target.e -= t, this.panzoom.current.e -= t, this.panzoom.requestTick()
            }
        }
        appendSlide(t) {
            let e = Array.isArray(t) ? t : [t];
            for (const t of e) {
                const e = H(t);
                e.index = this.slides.length, this.slides.push(e), this.emit("initSlide", t, this.slides.length)
            }
            this.updateMetrics()
        }
        removeSlide(t) {
            const e = this.slides.length;
            t = (t % e + e) % e, this.removeSlideEl(this.slides[t], !0), this.slides.splice(t, 1);
            for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
            this.updateMetrics(), this.slideTo(this.page, {
                friction: 0,
                transition: !1
            })
        }
        updateMetrics() {
            const {
                panzoom: t,
                viewport: i,
                track: n,
                isHorizontal: s
            } = this;
            if (!n) return;
            const o = s ? "width" : "height",
                a = s ? "offsetWidth" : "offsetHeight";
            if (i) {
                let t = Math.max(i[a], e(i.getBoundingClientRect()[o], 1e3)),
                    n = getComputedStyle(i),
                    r = "padding",
                    l = s ? "Right" : "Bottom";
                t -= parseFloat(n[r + (s ? "Left" : "Top")]) + parseFloat(n[r + l]), this.viewportDim = t
            }
            let r, l = this.pages.length,
                c = 0;
            for (const [t, i] of this.slides.entries()) {
                let n = 0,
                    s = 0;
                !i.el && r ? (n = r.dim, s = r.gap) : (({
                    dim: n,
                    gap: s
                } = this.getSlideMetrics(i)), r = i), n = e(n, 1e3), s = e(s, 1e3), i.dim = n, i.gap = s, i.pos = c, c += n, (this.isInfinite || t < this.slides.length - 1) && (c += s)
            }
            const h = this.contentDim;
            c = e(c, 1e3), this.contentDim = c, t && (t.contentRect[o] = c, t.contentRect["e" === this.axis ? "fullWidth" : "fullHeight"] = c), this.pages = this.createPages(), this.pages = this.processPages(), this.state === j.Init && this.setInitialPage(), this.page = Math.max(0, Math.min(this.page, this.pages.length - 1)), t && l === this.pages.length && Math.abs(c - h) > .5 && (t.target[this.axis] = -1 * this.pages[this.page].pos, t.current[this.axis] = -1 * this.pages[this.page].pos, t.stop()), this.manageSlideVisiblity(), this.emit("refresh")
        }
        getProgress(t, i = !1) {
            void 0 === t && (t = this.page);
            const n = this,
                s = n.panzoom,
                o = n.pages[t] || 0;
            if (!o || !s) return 0;
            let a = -1 * s.current.e,
                r = n.contentDim;
            var l = [e((a - o.pos) / (1 * o.dim), 1e3), e((a + r - o.pos) / (1 * o.dim), 1e3), e((a - r - o.pos) / (1 * o.dim), 1e3)].reduce((function(t, e) {
                return Math.abs(e) < Math.abs(t) ? e : t
            }));
            return i ? l : Math.max(-1, Math.min(1, l))
        }
        setViewportHeight() {
            const {
                page: t,
                pages: e,
                viewport: i,
                isHorizontal: n
            } = this;
            if (!i || !e[t]) return;
            let s = 0;
            n && this.track && (this.track.style.height = "auto", e[t].slides.forEach((t => {
                t.el && (s = Math.max(s, t.el.offsetHeight))
            }))), i.style.height = s ? `${s}px` : ""
        }
        getPageForSlide(t) {
            for (const e of this.pages)
                for (const i of e.slides)
                    if (i.index === t) return e.index;
            return -1
        }
        getVisibleSlides(t = 0) {
            var e;
            const i = new Set;
            let {
                contentDim: n,
                viewportDim: s,
                pages: o,
                page: a
            } = this;
            n = n + (null === (e = this.slides[this.slides.length - 1]) || void 0 === e ? void 0 : e.gap) || 0;
            let r = 0;
            r = this.panzoom ? -1 * this.panzoom.current[this.axis] : o[a] && o[a].pos || 0, this.isInfinite && (r -= Math.floor(r / n) * n), this.isRTL && this.isHorizontal && (r *= -1);
            const l = r - s * t,
                c = r + s * (t + 1),
                h = this.isInfinite ? [-1, 0, 1] : [0];
            for (const t of this.slides)
                for (const e of h) {
                    const s = t.pos + e * n,
                        o = t.pos + t.dim + t.gap + e * n;
                    s < c && o > l && i.add(t)
                }
            return i
        }
        getPageFromPosition(t) {
            const {
                viewportDim: e,
                contentDim: i
            } = this, n = this.pages.length, s = this.slides.length, o = this.slides[s - 1];
            let a = 0,
                r = 0,
                l = 0;
            const c = this.option("center");
            c && (t += .5 * e), this.isInfinite || (t = Math.max(this.slides[0].pos, Math.min(t, o.pos)));
            const h = i + o.gap;
            l = Math.floor(t / h) || 0, t -= l * h;
            let d = o,
                u = this.slides.find((e => {
                    const i = t + (d && !c ? .5 * d.dim : 0);
                    return d = e, e.pos <= i && e.pos + e.dim + e.gap > i
                }));
            return u || (u = o), r = this.getPageForSlide(u.index), a = r + l * n, {
                page: a,
                pageIndex: r
            }
        }
        destroy() {
            if ([j.Destroy].includes(this.state)) return;
            this.state = j.Destroy;
            const {
                container: t,
                viewport: e,
                track: i,
                slides: n,
                panzoom: s
            } = this, o = this.option("classes");
            t.removeEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.removeEventListener("slideTo", this.onSlideTo), window.removeEventListener("resize", this.onResize), s && (s.destroy(), this.panzoom = null), n && n.forEach((t => {
                this.removeSlideEl(t)
            })), this.detachPlugins(), e && e.offsetParent && i && i.offsetParent && e.replaceWith(...i.childNodes);
            for (const [e, i] of Object.entries(o)) "container" !== e && i && t.classList.remove(i);
            this.track = null, this.viewport = null, this.page = 0, this.slides = [];
            const a = this.events.get("ready");
            this.events = new Map, a && this.events.set("ready", a)
        }
    }
    Object.defineProperty(G, "Panzoom", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: k
    }), Object.defineProperty(G, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: F
    }), Object.defineProperty(G, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Z
    });
    const U = function(t) {
            const e = window.pageYOffset,
                i = window.pageYOffset + window.innerHeight;
            if (!S(t)) return 0;
            const n = t.getBoundingClientRect(),
                s = n.y + window.pageYOffset,
                o = n.y + n.height + window.pageYOffset;
            if (e > o || i < s) return 0;
            if (e < s && i > o) return 100;
            if (s < e && o > i) return 100;
            let a = n.height;
            s < e && (a -= window.pageYOffset - s), o > i && (a -= o - i);
            const r = a / window.innerHeight * 100;
            return Math.round(r)
        },
        K = !("undefined" == typeof window || !window.document || !window.document.createElement);
    let J;
    const Q = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])'].join(","),
        tt = t => {
            if (t && K) {
                void 0 === J && document.createElement("div").focus({
                    get preventScroll() {
                        return J = !0, !1
                    }
                });
                try {
                    if (J) t.focus({
                        preventScroll: !0
                    });
                    else {
                        const e = window.pageXOffset || document.body.scrollTop,
                            i = window.pageYOffset || document.body.scrollLeft;
                        t.focus(), document.body.scrollTo({
                            top: e,
                            left: i,
                            behavior: "auto"
                        })
                    }
                } catch (t) {}
            }
        },
        et = {
            dragToClose: !0,
            hideScrollbar: !0,
            Carousel: {
                classes: {
                    container: "fancybox__carousel",
                    viewport: "fancybox__viewport",
                    track: "fancybox__track",
                    slide: "fancybox__slide"
                }
            },
            contentClick: "toggleZoom",
            contentDblClick: !1,
            backdropClick: "close",
            animated: !0,
            idle: 3500,
            showClass: "f-zoomInUp",
            hideClass: "f-fadeOut",
            commonCaption: !1,
            parentEl: null,
            startIndex: 0,
            l10n: Object.assign(Object.assign({}, y), {
                CLOSE: "Close",
                NEXT: "Next",
                PREV: "Previous",
                MODAL: "You can close this modal content with the ESC key",
                ERROR: "Something Went Wrong, Please Try Again Later",
                IMAGE_ERROR: "Image Not Found",
                ELEMENT_NOT_FOUND: "HTML Element Not Found",
                AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
                AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
                IFRAME_ERROR: "Error Loading Page",
                TOGGLE_ZOOM: "Toggle zoom level",
                TOGGLE_THUMBS: "Toggle thumbnails",
                TOGGLE_SLIDESHOW: "Toggle slideshow",
                TOGGLE_FULLSCREEN: "Toggle full-screen mode",
                DOWNLOAD: "Download"
            }),
            tpl: {
                closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>',
                main: '<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">\n    <div class="fancybox__backdrop"></div>\n    <div class="fancybox__carousel"></div>\n    <div class="fancybox__footer"></div>\n  </div>'
            },
            groupAll: !1,
            groupAttr: "data-fancybox",
            defaultType: "image",
            defaultDisplay: "block",
            autoFocus: !0,
            trapFocus: !0,
            placeFocusBack: !0,
            closeButton: "auto",
            keyboard: {
                Escape: "close",
                Delete: "close",
                Backspace: "close",
                PageUp: "next",
                PageDown: "prev",
                ArrowUp: "prev",
                ArrowDown: "next",
                ArrowRight: "next",
                ArrowLeft: "prev"
            },
            Fullscreen: {
                autoStart: !1
            },
            compact: () => window.matchMedia("(max-width: 578px), (max-height: 578px)").matches,
            wheel: "zoom"
        };
    var it, nt;
    ! function(t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Closing = 2] = "Closing", t[t.CustomClosing = 3] = "CustomClosing", t[t.Destroy = 4] = "Destroy"
    }(it || (it = {})),
    function(t) {
        t[t.Loading = 0] = "Loading", t[t.Opening = 1] = "Opening", t[t.Ready = 2] = "Ready", t[t.Closing = 3] = "Closing"
    }(nt || (nt = {}));
    const st = () => {
        queueMicrotask((() => {
            (() => {
                const {
                    slug: t,
                    index: e
                } = ot.parseURL(), i = _t.getInstance();
                if (i && !1 !== i.option("Hash")) {
                    const n = i.carousel;
                    if (t && n) {
                        for (let e of n.slides)
                            if (e.slug && e.slug === t) return n.slideTo(e.index);
                        if (t === i.option("slug")) return n.slideTo(e - 1);
                        const s = i.getSlide(),
                            o = s && s.triggerEl && s.triggerEl.dataset;
                        if (o && o.fancybox === t) return n.slideTo(e - 1)
                    }
                    ot.hasSilentClose = !0, i.close()
                }
                ot.startFromUrl()
            })()
        }))
    };
    class ot extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "origHash", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: ""
            }), Object.defineProperty(this, "timer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onChange() {
            const t = this.instance,
                e = t.carousel;
            this.timer && clearTimeout(this.timer);
            const i = t.getSlide();
            if (!e || !i) return;
            const n = t.isOpeningSlide(i),
                s = new URL(document.URL).hash;
            let o, a = i.slug || void 0,
                r = i.triggerEl || void 0;
            o = a || this.instance.option("slug"), !o && r && r.dataset && (o = r.dataset.fancybox);
            let l = "";
            o && "true" !== o && (l = "#" + o + (!a && e.slides.length > 1 ? "-" + (i.index + 1) : "")), n && (this.origHash = s !== l ? s : ""), l && s !== l && (this.timer = setTimeout((() => {
                try {
                    t.state === it.Ready && window.history[n ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + l)
                } catch (t) {}
            }), 300))
        }
        onClose() {
            if (this.timer && clearTimeout(this.timer), !0 !== ot.hasSilentClose) try {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (this.origHash || ""))
            } catch (t) {}
        }
        attach() {
            const t = this.instance;
            t.on("Carousel.ready", this.onChange), t.on("Carousel.change", this.onChange), t.on("close", this.onClose)
        }
        detach() {
            const t = this.instance;
            t.off("Carousel.ready", this.onChange), t.off("Carousel.change", this.onChange), t.off("close", this.onClose)
        }
        static parseURL() {
            const t = window.location.hash.slice(1),
                e = t.split("-"),
                i = e[e.length - 1],
                n = i && /^\+?\d+$/.test(i) && parseInt(e.pop() || "1", 10) || 1;
            return {
                hash: t,
                slug: e.join("-"),
                index: n
            }
        }
        static startFromUrl() {
            if (ot.hasSilentClose = !1, _t.getInstance() || !1 === _t.defaults.Hash) return;
            const {
                hash: t,
                slug: e,
                index: i
            } = ot.parseURL();
            if (!e) return;
            let n = document.querySelector(`[data-slug="${t}"]`);
            if (n && n.dispatchEvent(new CustomEvent("click", {
                    bubbles: !0,
                    cancelable: !0
                })), _t.getInstance()) return;
            const s = document.querySelectorAll(`[data-fancybox="${e}"]`);
            s.length && (n = s[i - 1], n && n.dispatchEvent(new CustomEvent("click", {
                bubbles: !0,
                cancelable: !0
            })))
        }
        static destroy() {
            window.removeEventListener("hashchange", st, !1)
        }
    }

    function at() {
        window.addEventListener("hashchange", st, !1), setTimeout((() => {
            ot.startFromUrl()
        }), 500)
    }
    Object.defineProperty(ot, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    }), Object.defineProperty(ot, "hasSilentClose", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: !1
    }), K && (/complete|interactive|loaded/.test(document.readyState) ? at() : document.addEventListener("DOMContentLoaded", at));
    class rt extends _ {
        onCreateSlide(t, e, i) {
            const n = this.instance.optionFor(i, "src") || "";
            i.el && "image" === i.type && "string" == typeof n && this.setImage(i, n)
        }
        onRemoveSlide(t, e, i) {
            i.panzoom && i.panzoom.destroy(), i.panzoom = void 0, i.imageEl = void 0
        }
        onChange(t, e, i, n) {
            for (const t of e.slides) {
                const e = t.panzoom;
                e && t.index !== i && e.reset(.35)
            }
        }
        onClose() {
            var t;
            const e = this.instance,
                i = e.container,
                n = e.getSlide();
            if (!i || !i.parentElement || !n) return;
            const {
                el: s,
                contentEl: o,
                panzoom: a
            } = n, r = n.thumbElSrc;
            if (!s || !r || !o || !a || a.isContentLoading || a.state === b.Init || a.state === b.Destroy) return;
            a.updateMetrics();
            let l = this.getZoomInfo(n);
            if (!l) return;
            this.instance.state = it.CustomClosing, i.classList.remove("is-zooming-in"), i.classList.add("is-zooming-out"), o.style.backgroundImage = `url('${r}')`;
            const c = i.getBoundingClientRect();
            1 === ((null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1) && Object.assign(i.style, {
                position: "absolute",
                top: `${window.pageYOffset}px`,
                left: `${window.pageXOffset}px`,
                bottom: "auto",
                right: "auto",
                width: `${c.width}px`,
                height: `${c.height}px`,
                overflow: "hidden"
            });
            const {
                x: h,
                y: d,
                scale: u,
                opacity: p
            } = l;
            if (p) {
                const t = ((t, e, i, n) => {
                    const s = e - t,
                        o = n - i;
                    return e => i + ((e - t) / s * o || 0)
                })(a.scale, u, 1, 0);
                a.on("afterTransform", (() => {
                    o.style.opacity = t(a.scale) + ""
                }))
            }
            a.on("endAnimation", (() => {
                e.destroy()
            })), a.target.a = u, a.target.b = 0, a.target.c = 0, a.target.d = u, a.panTo({
                x: h,
                y: d,
                scale: u,
                friction: p ? .2 : .33,
                ignoreBounds: !0
            }), a.isResting && e.destroy()
        }
        setImage(t, e) {
            const i = this.instance;
            t.src = e, this.process(t, e).then((e => {
                var n;
                const s = t.contentEl,
                    o = t.imageEl,
                    a = t.thumbElSrc;
                if (i.isClosing() || !s || !o) return;
                s.offsetHeight;
                const r = !!i.isOpeningSlide(t) && this.getZoomInfo(t);
                if (this.option("protected")) {
                    null === (n = t.el) || void 0 === n || n.addEventListener("contextmenu", (t => {
                        t.preventDefault()
                    }));
                    const e = document.createElement("div");
                    P(e, "fancybox-protected"), s.appendChild(e)
                }
                if (a && r) {
                    const n = e.contentRect,
                        o = Math.max(n.fullWidth, n.fullHeight);
                    let c = null;
                    !r.opacity && o > 1200 && (c = document.createElement("img"), P(c, "fancybox-ghost"), c.src = a, s.appendChild(c));
                    const h = () => {
                        c && (P(c, "f-fadeFastOut"), setTimeout((() => {
                            c && (c.remove(), c = null)
                        }), 200))
                    };
                    (l = a, new Promise(((t, e) => {
                        const i = new Image;
                        i.onload = t, i.onerror = e, i.src = l
                    }))).then((() => {
                        t.state = nt.Opening, this.instance.emit("reveal", t), this.zoomIn(t).then((() => {
                            h(), this.instance.done(t)
                        }), (() => {
                            i.hideLoading(t)
                        })), c && setTimeout((() => {
                            h()
                        }), o > 2500 ? 800 : 200)
                    }), (() => {
                        i.hideLoading(t), i.revealContent(t)
                    }))
                } else {
                    const n = this.optionFor(t, "initialSize"),
                        s = this.optionFor(t, "zoom"),
                        o = {
                            event: i.prevMouseMoveEvent || i.options.event,
                            friction: s ? .12 : 0
                        };
                    let a = i.optionFor(t, "showClass") || void 0,
                        r = !0;
                    i.isOpeningSlide(t) && ("full" === n ? e.zoomToFull(o) : "cover" === n ? e.zoomToCover(o) : "max" === n ? e.zoomToMax(o) : r = !1, e.stop("current")), r && a && (a = e.isDragging ? "f-fadeIn" : ""), i.revealContent(t, a)
                }
                var l
            }), (() => {
                i.setError(t, "{{IMAGE_ERROR}}")
            }))
        }
        process(t, e) {
            return new Promise(((i, n) => {
                var o, a;
                const r = this.instance,
                    l = t.el;
                r.clearContent(t), r.showLoading(t);
                let c = this.optionFor(t, "content");
                "string" == typeof c && (c = s(c)), c && S(c) || (c = document.createElement("img"), c instanceof HTMLImageElement && (c.src = e || "", c.alt = (null === (o = t.caption) || void 0 === o ? void 0 : o.replace(/<[^>]+>/gi, "").substring(0, 1e3)) || `Image ${t.index+1} of ${null===(a=r.carousel)||void 0===a?void 0:a.pages.length}`, c.draggable = !1, t.srcset && c.setAttribute("srcset", t.srcset)), t.sizes && c.setAttribute("sizes", t.sizes)), c.classList.add("fancybox-image"), t.imageEl = c, r.setContent(t, c, !1);
                t.panzoom = new k(l, p({}, this.option("Panzoom") || {}, {
                    content: c,
                    width: r.optionFor(t, "width", "auto"),
                    height: r.optionFor(t, "height", "auto"),
                    wheel: () => {
                        const t = r.option("wheel");
                        return ("zoom" === t || "pan" == t) && t
                    },
                    click: (e, i) => {
                        var n, s;
                        if (r.isCompact || r.isClosing()) return !1;
                        if (t.index !== (null === (n = r.getSlide()) || void 0 === n ? void 0 : n.index)) return !1;
                        let o = !i || i.target && (null === (s = t.contentEl) || void 0 === s ? void 0 : s.contains(i.target));
                        return r.option(o ? "contentClick" : "backdropClick") || !1
                    },
                    dblClick: () => r.isCompact ? "toggleZoom" : r.option("contentDblClick") || !1,
                    spinner: !1,
                    panOnlyZoomed: !0,
                    wheelLimit: 1 / 0,
                    transformParent: !0,
                    on: {
                        ready: t => {
                            i(t)
                        },
                        error: () => {
                            n()
                        },
                        destroy: () => {
                            n()
                        }
                    }
                }))
            }))
        }
        zoomIn(t) {
            return new Promise(((e, i) => {
                const n = this.instance,
                    s = n.container,
                    {
                        panzoom: o,
                        contentEl: a,
                        el: r
                    } = t;
                o && o.updateMetrics();
                const l = this.getZoomInfo(t);
                if (!(l && r && a && o && s)) return void i();
                const {
                    x: c,
                    y: h,
                    scale: d,
                    opacity: u
                } = l, p = () => {
                    t.state !== nt.Closing && (u && (a.style.opacity = Math.max(Math.min(1, 1 - (1 - o.scale) / (1 - d)), 0) + ""), o.scale >= 1 && o.scale > o.targetScale - .1 && e(o))
                }, f = t => {
                    E(s, "is-zooming-in"), t.scale < .99 || t.scale > 1.01 || (a.style.opacity = "", t.off("endAnimation", f), t.off("touchStart", f), t.off("afterTransform", p), e(t))
                };
                o.on("endAnimation", f), o.on("touchStart", f), o.on("afterTransform", p), o.on(["error", "destroy"], (() => {
                    i()
                })), o.panTo({
                    x: c,
                    y: h,
                    scale: d,
                    friction: 0,
                    ignoreBounds: !0
                }), o.stop("current");
                const m = {
                        event: "mousemove" === o.panMode ? n.prevMouseMoveEvent || n.options.event : void 0
                    },
                    g = this.optionFor(t, "initialSize");
                P(s, "is-zooming-in"), n.hideLoading(t), "full" === g ? o.zoomToFull(m) : "cover" === g ? o.zoomToCover(m) : "max" === g ? o.zoomToMax(m) : o.reset(.172)
            }))
        }
        getZoomInfo(t) {
            var e;
            const {
                el: i,
                imageEl: n,
                thumbEl: s,
                panzoom: o
            } = t;
            if (!i || !n || !s || !o || U(s) < 3 || !this.optionFor(t, "zoom") || this.instance.state === it.Destroy) return !1;
            if (1 !== ((null === (e = window.visualViewport) || void 0 === e ? void 0 : e.scale) || 1)) return !1;
            let {
                top: a,
                left: r,
                width: l,
                height: c
            } = s.getBoundingClientRect(), {
                top: h,
                left: d,
                fitWidth: u,
                fitHeight: p
            } = o.contentRect;
            if (!(l && c && u && p)) return !1;
            const f = o.container.getBoundingClientRect();
            d += f.left, h += f.top;
            const m = -1 * (d + .5 * u - (r + .5 * l)),
                g = -1 * (h + .5 * p - (a + .5 * c)),
                b = l / u;
            let v = this.option("zoomOpacity") || !1;
            return "auto" === v && (v = Math.abs(l / c - u / p) > .1), {
                x: m,
                y: g,
                scale: b,
                opacity: v
            }
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.change", t.onChange), e.on("Carousel.createSlide", t.onCreateSlide), e.on("Carousel.removeSlide", t.onRemoveSlide), e.on("close", t.onClose)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.change", t.onChange), e.off("Carousel.createSlide", t.onCreateSlide), e.off("Carousel.removeSlide", t.onRemoveSlide), e.off("close", t.onClose)
        }
    }
    Object.defineProperty(rt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            initialSize: "fit",
            Panzoom: {
                maxScale: 1
            },
            protected: !1,
            zoom: !0,
            zoomOpacity: "auto"
        }
    });
    const lt = (t, e = {}) => {
            const i = new URL(t),
                n = new URLSearchParams(i.search),
                s = new URLSearchParams;
            for (const [t, i] of [...n, ...Object.entries(e)]) {
                let e = i.toString();
                "t" === t ? s.set("start", parseInt(e).toString()) : s.set(t, e)
            }
            let o = s.toString(),
                a = t.match(/#t=((.*)?\d+s)/);
            return a && (o += `#t=${a[1]}`), o
        },
        ct = {
            ajax: null,
            autoSize: !0,
            iframeAttr: {
                allow: "autoplay; fullscreen",
                scrolling: "auto"
            },
            preload: !0,
            videoAutoplay: !0,
            videoRatio: 16 / 9,
            videoTpl: '<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">\n  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos.</video>',
            videoFormat: "",
            vimeo: {
                byline: 1,
                color: "00adef",
                controls: 1,
                dnt: 1,
                muted: 0
            },
            youtube: {
                controls: 1,
                enablejsapi: 1,
                nocookie: 1,
                rel: 0,
                fs: 1
            }
        },
        ht = ["image", "html", "ajax", "inline", "clone", "iframe", "map", "pdf", "html5video", "youtube", "vimeo", "video"];
    class dt extends _ {
        onInitSlide(t, e, i) {
            this.processType(i)
        }
        onCreateSlide(t, e, i) {
            this.setContent(i)
        }
        onRemoveSlide(t, e, i) {
            i.xhr && (i.xhr.abort(), i.xhr = null);
            const n = i.iframeEl;
            n && (n.onload = n.onerror = null, n.src = "//about:blank", i.iframeEl = null);
            const s = i.contentEl,
                o = i.placeholderEl;
            if ("inline" === i.type && s && o) s.classList.remove("fancybox__content"), "none" !== s.style.display && (s.style.display = "none"), o.parentNode && o.parentNode.insertBefore(s, o), o.remove(), i.contentEl = void 0, i.placeholderEl = void 0;
            else
                for (; i.el && i.el.firstChild;) i.el.removeChild(i.el.firstChild)
        }
        onSelectSlide(t, e, i) {
            i.state === nt.Ready && this.playVideo()
        }
        onUnselectSlide(t, e, i) {
            var n, s;
            if ("html5video" === i.type) {
                try {
                    null === (s = null === (n = i.el) || void 0 === n ? void 0 : n.querySelector("video")) || void 0 === s || s.pause()
                } catch (t) {}
                return
            }
            let o;
            "vimeo" === i.type ? o = {
                method: "pause",
                value: "true"
            } : "youtube" === i.type && (o = {
                event: "command",
                func: "pauseVideo"
            }), o && i.iframeEl && i.iframeEl.contentWindow && i.iframeEl.contentWindow.postMessage(JSON.stringify(o), "*"), i.poller && clearTimeout(i.poller)
        }
        onDone(t, e) {
            t.isCurrentSlide(e) && !t.isClosing() && this.playVideo()
        }
        onRefresh(t, e) {
            e.slides.forEach((t => {
                t.el && (this.setAspectRatio(t), this.resizeIframe(t))
            }))
        }
        onMessage(t) {
            try {
                let e = JSON.parse(t.data);
                if ("https://player.vimeo.com" === t.origin) {
                    if ("ready" === e.event)
                        for (let e of Array.from(document.getElementsByClassName("fancybox__iframe"))) e instanceof HTMLIFrameElement && e.contentWindow === t.source && (e.dataset.ready = "true")
                } else if (t.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && "onReady" === e.event) {
                    const t = document.getElementById(e.id);
                    t && (t.dataset.ready = "true")
                }
            } catch (t) {}
        }
        loadAjaxContent(t) {
            const e = this.instance.optionFor(t, "src") || "";
            this.instance.showLoading(t);
            const i = this.instance,
                n = new XMLHttpRequest;
            i.showLoading(t), n.onreadystatechange = function() {
                n.readyState === XMLHttpRequest.DONE && i.state === it.Ready && (i.hideLoading(t), 200 === n.status ? i.setContent(t, n.responseText) : i.setError(t, 404 === n.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"))
            };
            const s = t.ajax || null;
            n.open(s ? "POST" : "GET", e + ""), n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.send(s), t.xhr = n
        }
        setInlineContent(t) {
            let e = null;
            if (S(t.src)) e = t.src;
            else if ("string" == typeof t.src) {
                const i = t.src.split("#", 2).pop();
                e = i ? document.getElementById(i) : null
            }
            if (e) {
                if ("clone" === t.type || e.closest(".fancybox__slide")) {
                    e = e.cloneNode(!0);
                    const i = e.dataset.animationName;
                    i && (e.classList.remove(i), delete e.dataset.animationName);
                    let n = e.getAttribute("id");
                    n = n ? `${n}--clone` : `clone-${this.instance.id}-${t.index}`, e.setAttribute("id", n)
                } else if (e.parentNode) {
                    const i = document.createElement("div");
                    i.classList.add("fancybox-placeholder"), e.parentNode.insertBefore(i, e), t.placeholderEl = i
                }
                this.instance.setContent(t, e)
            } else this.instance.setError(t, "{{ELEMENT_NOT_FOUND}}")
        }
        setIframeContent(t) {
            const {
                src: e,
                el: i
            } = t;
            if (!e || "string" != typeof e || !i) return;
            const n = this.instance,
                s = document.createElement("iframe");
            s.className = "fancybox__iframe", s.setAttribute("id", `fancybox__iframe_${n.id}_${t.index}`);
            for (const [e, i] of Object.entries(this.optionFor(t, "iframeAttr") || {})) s.setAttribute(e, i);
            s.onerror = () => {
                n.setError(t, "{{IFRAME_ERROR}}")
            }, t.iframeEl = s;
            const o = this.optionFor(t, "preload");
            if (i.classList.add("is-loading"), "iframe" !== t.type || !1 === o) return s.setAttribute("src", t.src + ""), this.resizeIframe(t), void n.setContent(t, s);
            n.showLoading(t), s.onload = () => {
                if (!s.src.length) return;
                const e = "true" !== s.dataset.ready;
                s.dataset.ready = "true", this.resizeIframe(t), e ? n.revealContent(t) : n.hideLoading(t)
            }, s.setAttribute("src", e), n.setContent(t, s, !1)
        }
        resizeIframe(t) {
            const e = t.iframeEl,
                i = null == e ? void 0 : e.parentElement;
            if (!e || !i) return;
            let n = t.autoSize,
                s = t.width || 0,
                o = t.height || 0;
            s && o && (n = !1);
            const a = i && i.style;
            if (!1 !== t.preload && !1 !== n && a) try {
                const t = window.getComputedStyle(i),
                    n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight),
                    r = parseFloat(t.paddingTop) + parseFloat(t.paddingBottom),
                    l = e.contentWindow;
                if (l) {
                    const t = l.document,
                        e = t.getElementsByTagName("html")[0],
                        i = t.body;
                    a.width = "", i.style.overflow = "hidden", s = s || e.scrollWidth + n, a.width = `${s}px`, i.style.overflow = "", a.flex = "0 0 auto", a.height = `${i.scrollHeight}px`, o = e.scrollHeight + r
                }
            } catch (t) {}
            if (s || o) {
                const t = {
                    flex: "0 1 auto",
                    width: "",
                    height: ""
                };
                s && (t.width = `${s}px`), o && (t.height = `${o}px`), Object.assign(a, t)
            }
        }
        playVideo() {
            const t = this.instance.getSlide();
            if (!t) return;
            const {
                el: e
            } = t;
            if (!e || !e.offsetParent) return;
            if (!this.optionFor(t, "videoAutoplay")) return;
            if ("html5video" === t.type) try {
                const t = e.querySelector("video");
                if (t) {
                    const e = t.play();
                    void 0 !== e && e.then((() => {})).catch((e => {
                        t.muted = !0, t.play()
                    }))
                }
            } catch (t) {}
            if ("youtube" !== t.type && "vimeo" !== t.type) return;
            const i = () => {
                if (t.iframeEl && t.iframeEl.contentWindow) {
                    let e;
                    if ("true" === t.iframeEl.dataset.ready) return e = "youtube" === t.type ? {
                        event: "command",
                        func: "playVideo"
                    } : {
                        method: "play",
                        value: "true"
                    }, e && t.iframeEl.contentWindow.postMessage(JSON.stringify(e), "*"), void(t.poller = void 0);
                    "youtube" === t.type && (e = {
                        event: "listening",
                        id: t.iframeEl.getAttribute("id")
                    }, t.iframeEl.contentWindow.postMessage(JSON.stringify(e), "*"))
                }
                t.poller = setTimeout(i, 250)
            };
            i()
        }
        processType(t) {
            if (t.html) return t.type = "html", t.src = t.html, void(t.html = "");
            const e = this.instance.optionFor(t, "src", "");
            if (!e || "string" != typeof e) return;
            let i = t.type,
                n = null;
            if (n = e.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
                const s = this.optionFor(t, "youtube"),
                    {
                        nocookie: o
                    } = s,
                    a = function(t, e) {
                        var i = {};
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (i[n] = t[n]);
                        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                            var s = 0;
                            for (n = Object.getOwnPropertySymbols(t); s < n.length; s++) e.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[s]) && (i[n[s]] = t[n[s]])
                        }
                        return i
                    }(s, ["nocookie"]),
                    r = `www.youtube${o?"-nocookie":""}.com`,
                    l = lt(e, a),
                    c = encodeURIComponent(n[2]);
                t.videoId = c, t.src = `https://${r}/embed/${c}?${l}`, t.thumbSrc = t.thumbSrc || `https://i.ytimg.com/vi/${c}/mqdefault.jpg`, i = "youtube"
            } else if (n = e.match(/^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/)) {
                const s = lt(e, this.optionFor(t, "vimeo")),
                    o = encodeURIComponent(n[1]),
                    a = n[4] || "";
                t.videoId = o, t.src = `https://player.vimeo.com/video/${o}?${a?`h=${a}${s?"&":""}`:""}${s}`, i = "vimeo"
            }
            if (!i && t.triggerEl) {
                const e = t.triggerEl.dataset.type;
                ht.includes(e) && (i = e)
            }
            i || "string" == typeof e && ("#" === e.charAt(0) ? i = "inline" : (n = e.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (i = "html5video", t.videoFormat = t.videoFormat || "video/" + ("ogv" === n[1] ? "ogg" : n[1])) : e.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? i = "image" : e.match(/\.(pdf)((\?|#).*)?$/i) ? i = "pdf" : (n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) ? (t.src = `https://maps.google.${n[1]}/?ll=${(n[2]?n[2]+"&z="+Math.floor(parseFloat(n[3]))+(n[4]?n[4].replace(/^\//,"&"):""):n[4]+"").replace(/\?/,"&")}&output=${n[4]&&n[4].indexOf("layer=c")>0?"svembed":"embed"}`, i = "map") : (n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && (t.src = `https://maps.google.${n[1]}/maps?q=${n[2].replace("query=","q=").replace("api=1","")}&output=embed`, i = "map")), i = i || this.instance.option("defaultType"), t.type = i, "image" === i && (t.thumbSrc = t.thumbSrc || t.src)
        }
        setContent(t) {
            const e = this.instance.optionFor(t, "src") || "";
            if (t && t.type && e) {
                switch (t.type) {
                    case "html":
                        this.instance.setContent(t, e);
                        break;
                    case "html5video":
                        const i = this.option("videoTpl");
                        i && this.instance.setContent(t, i.replace(/\{\{src\}\}/gi, e + "").replace(/\{\{format\}\}/gi, this.optionFor(t, "videoFormat") || "").replace(/\{\{poster\}\}/gi, t.poster || t.thumbSrc || ""));
                        break;
                    case "inline":
                    case "clone":
                        this.setInlineContent(t);
                        break;
                    case "ajax":
                        this.loadAjaxContent(t);
                        break;
                    case "pdf":
                    case "map":
                    case "youtube":
                    case "vimeo":
                        t.preload = !1;
                    case "iframe":
                        this.setIframeContent(t)
                }
                this.setAspectRatio(t)
            }
        }
        setAspectRatio(t) {
            var e;
            const i = t.contentEl,
                n = this.optionFor(t, "videoRatio"),
                s = null === (e = t.el) || void 0 === e ? void 0 : e.getBoundingClientRect();
            if (!(i && s && n && 1 !== n && t.type && ["video", "youtube", "vimeo", "html5video"].includes(t.type))) return;
            const o = s.width,
                a = s.height;
            i.style.aspectRatio = n + "", i.style.width = o / a > n ? "auto" : "", i.style.height = o / a > n ? "" : "auto"
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.initSlide", t.onInitSlide), e.on("Carousel.createSlide", t.onCreateSlide), e.on("Carousel.removeSlide", t.onRemoveSlide), e.on("Carousel.selectSlide", t.onSelectSlide), e.on("Carousel.unselectSlide", t.onUnselectSlide), e.on("Carousel.Panzoom.refresh", t.onRefresh), e.on("done", t.onDone), window.addEventListener("message", t.onMessage)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.initSlide", t.onInitSlide), e.off("Carousel.createSlide", t.onCreateSlide), e.off("Carousel.removeSlide", t.onRemoveSlide), e.off("Carousel.selectSlide", t.onSelectSlide), e.off("Carousel.unselectSlide", t.onUnselectSlide), e.off("Carousel.Panzoom.refresh", t.onRefresh), e.off("done", t.onDone), window.removeEventListener("message", t.onMessage)
        }
    }
    Object.defineProperty(dt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: ct
    });
    const ut = "play",
        pt = "pause",
        ft = "ready";
    class mt extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: ft
            }), Object.defineProperty(this, "inHover", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "timer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "progressBar", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        get isActive() {
            return this.state !== ft
        }
        onReady(t) {
            this.option("autoStart") && (t.isInfinite || t.page < t.pages.length - 1) && this.start()
        }
        onChange() {
            var t;
            (null === (t = this.instance.panzoom) || void 0 === t ? void 0 : t.isResting) || (this.removeProgressBar(), this.pause())
        }
        onSettle() {
            this.resume()
        }
        onVisibilityChange() {
            "visible" === document.visibilityState ? this.resume() : this.pause()
        }
        onMouseEnter() {
            this.inHover = !0, this.pause()
        }
        onMouseLeave() {
            var t;
            this.inHover = !1, (null === (t = this.instance.panzoom) || void 0 === t ? void 0 : t.isResting) && this.resume()
        }
        onTimerEnd() {
            const t = this.instance;
            "play" === this.state && (t.isInfinite || t.page !== t.pages.length - 1 ? t.slideNext() : t.slideTo(0))
        }
        removeProgressBar() {
            this.progressBar && (this.progressBar.remove(), this.progressBar = null)
        }
        createProgressBar() {
            var t;
            if (!this.option("showProgress")) return null;
            this.removeProgressBar();
            const e = this.instance,
                i = (null === (t = e.pages[e.page]) || void 0 === t ? void 0 : t.slides) || [];
            let n = this.option("progressParentEl");
            if (n || (n = (1 === i.length ? i[0].el : null) || e.viewport), !n) return null;
            const s = document.createElement("div");
            return P(s, "f-progress"), n.prepend(s), this.progressBar = s, s.offsetHeight, s
        }
        set() {
            const t = this,
                e = t.instance;
            if (e.pages.length < 2) return;
            if (t.timer) return;
            const i = t.option("timeout");
            t.state = ut, P(e.container, "has-autoplay");
            let n = t.createProgressBar();
            n && (n.style.transitionDuration = `${i}ms`, n.style.transform = "scaleX(1)"), t.timer = setTimeout((() => {
                t.timer = null, t.inHover || t.onTimerEnd()
            }), i), t.emit("set")
        }
        clear() {
            const t = this;
            t.timer && (clearTimeout(t.timer), t.timer = null), t.removeProgressBar()
        }
        start() {
            const t = this;
            if (t.set(), t.state !== ft) {
                if (t.option("pauseOnHover")) {
                    const e = t.instance.container;
                    e.addEventListener("mouseenter", t.onMouseEnter, !1), e.addEventListener("mouseleave", t.onMouseLeave, !1)
                }
                document.addEventListener("visibilitychange", t.onVisibilityChange, !1), t.emit("start")
            }
        }
        stop() {
            const t = this,
                e = t.state,
                i = t.instance.container;
            t.clear(), t.state = ft, i.removeEventListener("mouseenter", t.onMouseEnter, !1), i.removeEventListener("mouseleave", t.onMouseLeave, !1), document.removeEventListener("visibilitychange", t.onVisibilityChange, !1), E(i, "has-autoplay"), e !== ft && t.emit("stop")
        }
        pause() {
            const t = this;
            t.state === ut && (t.state = pt, t.clear(), t.emit(pt))
        }
        resume() {
            const t = this,
                e = t.instance;
            if (e.isInfinite || e.page !== e.pages.length - 1)
                if (t.state !== ut) {
                    if (t.state === pt && !t.inHover) {
                        const e = new Event("resume", {
                            bubbles: !0,
                            cancelable: !0
                        });
                        t.emit("resume", e), e.defaultPrevented || t.set()
                    }
                } else t.set();
            else t.stop()
        }
        toggle() {
            this.state === ut || this.state === pt ? this.stop() : this.start()
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("ready", t.onReady), e.on("Panzoom.startAnimation", t.onChange), e.on("Panzoom.endAnimation", t.onSettle), e.on("Panzoom.touchMove", t.onChange)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("ready", t.onReady), e.off("Panzoom.startAnimation", t.onChange), e.off("Panzoom.endAnimation", t.onSettle), e.off("Panzoom.touchMove", t.onChange), t.stop()
        }
    }
    Object.defineProperty(mt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            autoStart: !0,
            pauseOnHover: !0,
            progressParentEl: null,
            showProgress: !0,
            timeout: 3e3
        }
    });
    class gt extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "ref", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onPrepare(t) {
            const e = t.carousel;
            if (!e) return;
            const i = t.container;
            i && (e.options.Autoplay = p({
                autoStart: !1
            }, this.option("Autoplay") || {}, {
                pauseOnHover: !1,
                timeout: this.option("timeout"),
                progressParentEl: () => this.option("progressParentEl") || null,
                on: {
                    start: () => {
                        t.emit("startSlideshow")
                    },
                    set: e => {
                        var n;
                        i.classList.add("has-slideshow"), (null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) !== nt.Ready && e.pause()
                    },
                    stop: () => {
                        i.classList.remove("has-slideshow"), t.isCompact || t.endIdle(), t.emit("endSlideshow")
                    },
                    resume: (e, i) => {
                        var n, s, o;
                        !i || !i.cancelable || (null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) === nt.Ready && (null === (o = null === (s = t.carousel) || void 0 === s ? void 0 : s.panzoom) || void 0 === o ? void 0 : o.isResting) || i.preventDefault()
                    }
                }
            }), e.attachPlugins({
                Autoplay: mt
            }), this.ref = e.plugins.Autoplay)
        }
        onReady(t) {
            const e = t.carousel,
                i = this.ref;
            e && i && this.option("playOnStart") && (e.isInfinite || e.page < e.pages.length - 1) && i.start()
        }
        onDone(t, e) {
            const i = this.ref;
            if (!i) return;
            const n = e.panzoom;
            n && n.on("startAnimation", (() => {
                t.isCurrentSlide(e) && i.stop()
            })), t.isCurrentSlide(e) && i.resume()
        }
        onKeydown(t, e) {
            var i;
            const n = this.ref;
            n && e === this.option("key") && "BUTTON" !== (null === (i = document.activeElement) || void 0 === i ? void 0 : i.nodeName) && n.toggle()
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.init", t.onPrepare), e.on("Carousel.ready", t.onReady), e.on("done", t.onDone), e.on("keydown", t.onKeydown)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.init", t.onPrepare), e.off("Carousel.ready", t.onReady), e.off("done", t.onDone), e.off("keydown", t.onKeydown)
        }
    }
    Object.defineProperty(gt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            key: " ",
            playOnStart: !1,
            progressParentEl: t => {
                var e;
                return (null === (e = t.instance.container) || void 0 === e ? void 0 : e.querySelector(".fancybox__toolbar [data-fancybox-toggle-slideshow]")) || t.instance.container
            },
            timeout: 3e3
        }
    });
    const bt = {
        classes: {
            container: "f-thumbs f-carousel__thumbs",
            viewport: "f-thumbs__viewport",
            track: "f-thumbs__track",
            slide: "f-thumbs__slide",
            isResting: "is-resting",
            isSelected: "is-selected",
            isLoading: "is-loading",
            hasThumbs: "has-thumbs"
        },
        minCount: 2,
        parentEl: null,
        thumbTpl: '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',
        type: "modern"
    };
    var vt;
    ! function(t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Hidden = 2] = "Hidden", t[t.Disabled = 3] = "Disabled"
    }(vt || (vt = {}));
    let yt = class extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "type", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: "modern"
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "track", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "carousel", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "panzoom", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "thumbWidth", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbClipWidth", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbHeight", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbGap", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbExtraGap", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "shouldCenter", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !0
            }), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: vt.Init
            })
        }
        formatThumb(t, e) {
            return this.instance.localize(e, [
                ["%i", t.index],
                ["%d", t.index + 1],
                ["%s", t.thumbSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"]
            ])
        }
        getSlides() {
            const t = [],
                e = this.option("thumbTpl") || "";
            if (e)
                for (const i of this.instance.slides || []) {
                    let n = "";
                    i.type && (n = `for-${i.type}`, i.type && ["video", "youtube", "vimeo", "html5video"].includes(i.type) && (n += " for-video")), t.push({
                        html: this.formatThumb(i, e),
                        customClass: n
                    })
                }
            return t
        }
        onInitSlide(t, e) {
            const i = e.el;
            i && (e.thumbSrc = i.dataset.thumbSrc || e.thumbSrc || "", e.thumbClipWidth = parseFloat(i.dataset.thumbClipWidth || "") || e.thumbClipWidth || 0, e.thumbHeight = parseFloat(i.dataset.thumbHeight || "") || e.thumbHeight || 0)
        }
        onInitSlides() {
            this.state === vt.Init && this.build()
        }
        onRefreshM() {
            this.refreshModern()
        }
        onChangeM() {
            "modern" === this.type && (this.shouldCenter = !0, this.centerModern())
        }
        onClickModern(t) {
            t.preventDefault(), t.stopPropagation();
            const e = this.instance,
                i = e.page,
                n = t => {
                    if (t) {
                        const e = t.closest("[data-carousel-index]");
                        if (e) return parseInt(e.dataset.carouselIndex || "", 10) || 0
                    }
                    return -1
                },
                s = (t, e) => {
                    const i = document.elementFromPoint(t, e);
                    return i ? n(i) : -1
                };
            let o = n(t.target);
            o < 0 && (o = s(t.clientX + this.thumbGap, t.clientY), o === i && (o = i - 1)), o < 0 && (o = s(t.clientX - this.thumbGap, t.clientY), o === i && (o = i + 1)), o < 0 && (o = (e => {
                let n = s(t.clientX - e, t.clientY),
                    a = s(t.clientX + e, t.clientY);
                return o < 0 && n === i && (o = i + 1), o < 0 && a === i && (o = i - 1), o
            })(this.thumbExtraGap)), o === i ? this.centerModern() : o > -1 && o < e.pages.length && e.slideTo(o)
        }
        onTransformM() {
            if ("modern" !== this.type) return;
            const {
                instance: t,
                container: e,
                track: i
            } = this, n = t.panzoom;
            if (!(e && i && n && this.panzoom)) return;
            a(e, this.cn("isResting"), n.state !== b.Init && n.isResting);
            const s = this.thumbGap,
                o = this.thumbExtraGap,
                r = this.thumbClipWidth;
            let l = 0,
                c = 0,
                h = 0;
            for (const e of t.slides) {
                let i = e.index,
                    n = e.thumbSlideEl;
                if (!n) continue;
                a(n, this.cn("isSelected"), i === t.page), c = 1 - Math.abs(t.getProgress(i)), n.style.setProperty("--progress", c ? c + "" : "");
                const d = .5 * ((e.thumbWidth || 0) - r);
                l += s, l += d, c && (l -= c * (d + o)), n.style.setProperty("--shift", l - s + ""), l += d, c && (l -= c * (d + o)), l -= s, 0 === i && (h = o * c)
            }
            i && (i.style.setProperty("--left", h + ""), i.style.setProperty("--width", l + h + s + o * c + "")), this.shouldCenter && this.centerModern()
        }
        buildClassic() {
            const {
                container: t,
                track: e
            } = this, i = this.getSlides();
            if (!t || !e || !i) return;
            const n = new this.instance.constructor(t, p({
                track: e,
                infinite: !1,
                center: !0,
                fill: !0,
                dragFree: !0,
                slidesPerPage: 1,
                transition: !1,
                Dots: !1,
                Navigation: !1,
                classes: {
                    container: "f-thumbs",
                    viewport: "f-thumbs__viewport",
                    track: "f-thumbs__track",
                    slide: "f-thumbs__slide"
                }
            }, this.option("Carousel") || {}, {
                Sync: {
                    target: this.instance
                },
                slides: i
            }));
            this.carousel = n, this.track = e, n.on("ready", (() => {
                this.emit("ready")
            })), n.on("createSlide", ((t, e) => {
                this.emit("createSlide", e, e.el)
            }))
        }
        buildModern() {
            if ("modern" !== this.type) return;
            const {
                container: t,
                track: e,
                instance: i
            } = this, n = this.option("thumbTpl") || "";
            if (!t || !e || !n) return;
            P(t, "is-horizontal"), this.updateModern();
            for (const t of i.slides || []) {
                const i = document.createElement("div");
                if (P(i, this.cn("slide")), t.type) {
                    let e = `for-${t.type}`;
                    ["video", "youtube", "vimeo", "html5video"].includes(t.type) && (e += " for-video"), P(i, e)
                }
                i.appendChild(s(this.formatThumb(t, n))), this.emit("createSlide", t, i), t.thumbSlideEl = i, e.appendChild(i), this.resizeModernSlide(t)
            }
            const o = new i.constructor.Panzoom(t, {
                content: e,
                lockAxis: "x",
                zoom: !1,
                panOnlyZoomed: !1,
                bounds: () => {
                    let t = 0,
                        e = 0,
                        n = i.slides[0],
                        s = i.slides[i.slides.length - 1],
                        o = i.slides[i.page];
                    return n && s && o && (e = -1 * this.getModernThumbPos(0), 0 !== i.page && (e += .5 * (n.thumbWidth || 0)), t = -1 * this.getModernThumbPos(i.slides.length - 1), i.page !== i.slides.length - 1 && (t += (s.thumbWidth || 0) - (o.thumbWidth || 0) - .5 * (s.thumbWidth || 0))), {
                        x: {
                            min: t,
                            max: e
                        },
                        y: {
                            min: 0,
                            max: 0
                        }
                    }
                }
            });
            o.on("touchStart", ((t, e) => {
                this.shouldCenter = !1
            })), o.on("click", ((t, e) => this.onClickModern(e))), o.on("ready", (() => {
                this.centerModern(), this.emit("ready")
            })), o.on(["afterTransform", "refresh"], (t => {
                this.lazyLoadModern()
            })), this.panzoom = o, this.refreshModern()
        }
        updateModern() {
            if ("modern" !== this.type) return;
            const {
                container: t
            } = this;
            t && (this.thumbGap = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-gap")) || 0, this.thumbExtraGap = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-extra-gap")) || 0, this.thumbWidth = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-width")) || 40, this.thumbClipWidth = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-clip-width")) || 40, this.thumbHeight = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-height")) || 40)
        }
        refreshModern() {
            var t;
            if ("modern" === this.type) {
                this.updateModern();
                for (const t of this.instance.slides || []) this.resizeModernSlide(t);
                this.onTransformM(), null === (t = this.panzoom) || void 0 === t || t.updateMetrics(!0), this.centerModern(0)
            }
        }
        centerModern(t) {
            const i = this.instance,
                {
                    container: n,
                    panzoom: s
                } = this;
            if (!n || !s || s.state === b.Init) return;
            const o = i.page;
            let a = this.getModernThumbPos(o),
                r = a;
            for (let t = i.page - 3; t < i.page + 3; t++) {
                if (t < 0 || t > i.pages.length - 1 || t === i.page) continue;
                const e = 1 - Math.abs(i.getProgress(t));
                e > 0 && e < 1 && (r += e * (this.getModernThumbPos(t) - a))
            }
            let l = 100;
            void 0 === t && (t = .2, i.inTransition.size > 0 && (t = .12), Math.abs(-1 * s.current.e - r) > s.containerRect.width && (t = .5, l = 0)), s.options.maxVelocity = l, s.applyChange({
                panX: e(-1 * r - s.target.e, 1e3),
                friction: null === i.prevPage ? 0 : t
            })
        }
        lazyLoadModern() {
            const {
                instance: t,
                panzoom: e
            } = this;
            if (!e) return;
            const i = -1 * e.current.e || 0;
            let n = this.getModernThumbPos(t.page);
            if (e.state !== b.Init || 0 === n)
                for (const n of t.slides || []) {
                    const t = n.thumbSlideEl;
                    if (!t) continue;
                    const o = t.querySelector("img[data-lazy-src]"),
                        a = n.index,
                        r = this.getModernThumbPos(a),
                        l = i - .5 * e.containerRect.innerWidth,
                        c = l + e.containerRect.innerWidth;
                    if (!o || r < l || r > c) continue;
                    let h = o.dataset.lazySrc;
                    if (!h || !h.length) continue;
                    if (delete o.dataset.lazySrc, o.src = h, o.complete) continue;
                    P(t, this.cn("isLoading"));
                    const d = s(x);
                    t.appendChild(d), o.addEventListener("load", (() => {
                        t.offsetParent && (t.classList.remove(this.cn("isLoading")), d.remove())
                    }), !1)
                }
        }
        resizeModernSlide(t) {
            if ("modern" !== this.type) return;
            if (!t.thumbSlideEl) return;
            const e = t.thumbClipWidth && t.thumbHeight ? Math.round(this.thumbHeight * (t.thumbClipWidth / t.thumbHeight)) : this.thumbWidth;
            t.thumbWidth = e
        }
        getModernThumbPos(t) {
            const i = this.instance.slides[t],
                n = this.panzoom;
            if (!n || !n.contentRect.fitWidth) return 0;
            let s = n.containerRect.innerWidth,
                o = n.contentRect.width;
            2 === this.instance.slides.length && (t -= 1, o = 2 * this.thumbClipWidth);
            let a = t * (this.thumbClipWidth + this.thumbGap) + this.thumbExtraGap + .5 * (i.thumbWidth || 0);
            return a -= o > s ? .5 * s : .5 * o, e(a || 0, 1)
        }
        build() {
            const t = this.instance,
                e = t.container,
                i = this.option("minCount") || 0;
            if (i) {
                let e = 0;
                for (const i of t.slides || []) i.thumbSrc && e++;
                if (e < i) return this.cleanup(), void(this.state = vt.Disabled)
            }
            const n = this.option("type");
            if (["modern", "classic"].indexOf(n) < 0) return void(this.state = vt.Disabled);
            this.type = n;
            const s = document.createElement("div");
            P(s, this.cn("container")), P(s, `is-${n}`);
            const o = this.option("parentEl");
            o ? o.appendChild(s) : e.after(s), this.container = s, P(e, this.cn("hasThumbs"));
            const a = document.createElement("div");
            P(a, this.cn("track")), s.appendChild(a), this.track = a, "classic" === n ? this.buildClassic() : this.buildModern(), this.state = vt.Ready, s.addEventListener("click", (e => {
                setTimeout((() => {
                    var e;
                    null === (e = null == s ? void 0 : s.querySelector(`[data-carousel-index="${t.page}"]`)) || void 0 === e || e.focus()
                }), 100)
            }))
        }
        cleanup() {
            this.carousel && this.carousel.destroy(), this.carousel = null, this.panzoom && this.panzoom.destroy(), this.panzoom = null, this.container && this.container.remove(), this.container = null, this.track = null, this.state = vt.Init, E(this.instance.container, this.cn("hasThumbs"))
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("initSlide", t.onInitSlide), e.state === j.Init ? e.on("initSlides", t.onInitSlides) : t.onInitSlides(), e.on("Panzoom.afterTransform", t.onTransformM), e.on("Panzoom.refresh", t.onRefreshM), e.on("change", t.onChangeM)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("initSlide", t.onInitSlide), e.off("initSlides", t.onInitSlides), e.off("Panzoom.afterTransform", t.onTransformM), e.off("Panzoom.refresh", t.onRefreshM), e.off("change", t.onChangeM), t.cleanup()
        }
    };
    Object.defineProperty(yt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: bt
    });
    const wt = Object.assign(Object.assign({}, bt), {
        key: "t",
        showOnStart: !0,
        parentEl: null
    });
    class xt extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "ref", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "hidden", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            })
        }
        get isEnabled() {
            const t = this.ref;
            return t && t.state !== vt.Disabled
        }
        get isHidden() {
            return this.hidden
        }
        onInit() {
            var t;
            const e = this,
                i = e.instance,
                n = i.carousel;
            if (e.ref || !n) return;
            const s = e.option("parentEl") || i.footer || i.container;
            if (!s) return;
            const o = p({}, e.options, {
                parentEl: s,
                classes: {
                    container: "f-thumbs fancybox__thumbs"
                },
                Carousel: {
                    Sync: {
                        friction: i.option("Carousel.friction") || 0
                    }
                },
                on: {
                    ready: t => {
                        const i = t.container;
                        i && this.hidden && (e.refresh(), i.style.transition = "none", e.hide(), i.offsetHeight, queueMicrotask((() => {
                            i.style.transition = "", e.show()
                        })))
                    }
                }
            });
            o.Carousel = o.Carousel || {}, o.Carousel.on = p((null === (t = e.options.Carousel) || void 0 === t ? void 0 : t.on) || {}, {
                click: (t, e) => {
                    e.stopPropagation()
                }
            }), n.options.Thumbs = o, n.attachPlugins({
                Thumbs: yt
            }), e.ref = n.plugins.Thumbs, e.option("showOnStart") || (e.ref.state = vt.Hidden, e.hidden = !0)
        }
        onResize() {
            var t;
            const e = null === (t = this.ref) || void 0 === t ? void 0 : t.container;
            e && (e.style.maxHeight = "")
        }
        onKeydown(t, e) {
            const i = this.option("key");
            i && i === e && this.toggle()
        }
        toggle() {
            const t = this.ref;
            t && t.state !== vt.Disabled && (t.state !== vt.Hidden ? this.hidden ? this.show() : this.hide() : t.build())
        }
        show() {
            const t = this.ref,
                e = t && t.state !== vt.Disabled && t.container;
            e && (this.refresh(), e.offsetHeight, e.removeAttribute("aria-hidden"), e.classList.remove("is-hidden"), this.hidden = !1)
        }
        hide() {
            const t = this.ref,
                e = t && t.container;
            e && (this.refresh(), e.offsetHeight, e.classList.add("is-hidden"), e.setAttribute("aria-hidden", "true")), this.hidden = !0
        }
        refresh() {
            const t = this.ref;
            if (!t || t.state === vt.Disabled) return;
            const e = t.container,
                i = (null == e ? void 0 : e.firstChild) || null;
            e && i && i.childNodes.length && (e.style.maxHeight = `${i.getBoundingClientRect().height}px`)
        }
        attach() {
            const t = this,
                e = t.instance;
            e.state === it.Init ? e.on("Carousel.init", t.onInit) : t.onInit(), e.on("resize", t.onResize), e.on("keydown", t.onKeydown)
        }
        detach() {
            var t;
            const e = this,
                i = e.instance;
            i.off("Carousel.init", e.onInit), i.off("resize", e.onResize), i.off("keydown", e.onKeydown), null === (t = i.carousel) || void 0 === t || t.detachPlugins(["Thumbs"]), e.ref = null
        }
    }
    Object.defineProperty(xt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: wt
    });
    const St = {
        panLeft: {
            icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>',
            change: {
                panX: -100
            }
        },
        panRight: {
            icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>',
            change: {
                panX: 100
            }
        },
        panUp: {
            icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>',
            change: {
                panY: -100
            }
        },
        panDown: {
            icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>',
            change: {
                panY: 100
            }
        },
        zoomIn: {
            icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>',
            action: "zoomIn"
        },
        zoomOut: {
            icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "zoomOut"
        },
        toggle1to1: {
            icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>',
            action: "toggleZoom"
        },
        toggleZoom: {
            icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "toggleZoom"
        },
        iterateZoom: {
            icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "iterateZoom"
        },
        rotateCCW: {
            icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>',
            action: "rotateCCW"
        },
        rotateCW: {
            icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>',
            action: "rotateCW"
        },
        flipX: {
            icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>',
            action: "flipX"
        },
        flipY: {
            icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>',
            action: "flipY"
        },
        fitX: {
            icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>',
            action: "fitX"
        },
        fitY: {
            icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>',
            action: "fitY"
        },
        reset: {
            icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>',
            action: "reset"
        },
        toggleFS: {
            icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>',
            action: "toggleFS"
        }
    };
    var Et;
    ! function(t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Disabled = 2] = "Disabled"
    }(Et || (Et = {}));
    const Pt = {
            absolute: "auto",
            display: {
                left: ["infobar"],
                middle: [],
                right: ["iterateZoom", "slideshow", "fullscreen", "thumbs", "close"]
            },
            enabled: "auto",
            items: {
                infobar: {
                    tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>'
                },
                download: {
                    tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>'
                },
                prev: {
                    tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>'
                },
                next: {
                    tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>'
                },
                slideshow: {
                    tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>'
                },
                fullscreen: {
                    tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>'
                },
                thumbs: {
                    tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>'
                },
                close: {
                    tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>'
                }
            },
            parentEl: null
        },
        Ct = {
            tabindex: "-1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg"
        };
    class Mt extends _ {
        constructor() {
            super(...arguments), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: Et.Init
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onReady(t) {
            var e;
            if (!t.carousel) return;
            let i = this.option("display"),
                n = this.option("absolute"),
                s = this.option("enabled");
            if ("auto" === s) {
                const t = this.instance.carousel;
                let e = 0;
                if (t)
                    for (const i of t.slides)(i.panzoom || "image" === i.type) && e++;
                e || (s = !1)
            }
            s || (i = void 0);
            let o = 0;
            const a = {
                left: [],
                middle: [],
                right: []
            };
            if (i)
                for (const t of ["left", "middle", "right"])
                    for (const n of i[t]) {
                        const i = this.createEl(n);
                        i && (null === (e = a[t]) || void 0 === e || e.push(i), o++)
                    }
            let r = null;
            if (o && (r = this.createContainer()), r) {
                for (const [t, e] of Object.entries(a)) {
                    const i = document.createElement("div");
                    P(i, "fancybox__toolbar__column is-" + t);
                    for (const t of e) i.appendChild(t);
                    "auto" !== n || "middle" !== t || e.length || (n = !0), r.appendChild(i)
                }!0 === n && P(r, "is-absolute"), this.state = Et.Ready, this.onRefresh()
            } else this.state = Et.Disabled
        }
        onClick(t) {
            var e, i;
            const n = this.instance,
                s = n.getSlide(),
                o = null == s ? void 0 : s.panzoom,
                a = t.target,
                r = a && S(a) ? a.dataset : null;
            if (!r) return;
            if (void 0 !== r.fancyboxToggleThumbs) return t.preventDefault(), t.stopPropagation(), void(null === (e = n.plugins.Thumbs) || void 0 === e || e.toggle());
            if (void 0 !== r.fancyboxToggleFullscreen) return t.preventDefault(), t.stopPropagation(), void this.instance.toggleFullscreen();
            if (void 0 !== r.fancyboxToggleSlideshow) {
                t.preventDefault(), t.stopPropagation();
                const e = null === (i = n.carousel) || void 0 === i ? void 0 : i.plugins.Autoplay;
                let s = e.isActive;
                return o && "mousemove" === o.panMode && !s && o.reset(), void(s ? e.stop() : e.start())
            }
            const l = r.panzoomAction,
                c = r.panzoomChange;
            if ((c || l) && (t.preventDefault(), t.stopPropagation()), c) {
                let t = {};
                try {
                    t = JSON.parse(c)
                } catch (t) {}
                o && o.applyChange(t)
            } else l && o && o[l] && o[l]()
        }
        onChange() {
            this.onRefresh()
        }
        onRefresh() {
            if (this.instance.isClosing()) return;
            const t = this.container;
            if (!t) return;
            const e = this.instance.getSlide();
            if (!e || e.state !== nt.Ready) return;
            const i = e && !e.error && e.panzoom;
            for (const e of t.querySelectorAll("[data-panzoom-action]")) i ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            let n = i && i.canZoomIn(),
                s = i && i.canZoomOut();
            for (const e of t.querySelectorAll('[data-panzoom-action="zoomIn"]')) n ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            for (const e of t.querySelectorAll('[data-panzoom-action="zoomOut"]')) s ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            for (const e of t.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
                s || n ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
                const t = e.querySelector("g");
                t && (t.style.display = n ? "" : "none")
            }
        }
        onDone(t, e) {
            var i;
            null === (i = e.panzoom) || void 0 === i || i.on("afterTransform", (() => {
                this.instance.isCurrentSlide(e) && this.onRefresh()
            })), this.instance.isCurrentSlide(e) && this.onRefresh()
        }
        createContainer() {
            const t = this.instance.container;
            if (!t) return null;
            const e = this.option("parentEl") || t,
                i = document.createElement("div");
            return P(i, "fancybox__toolbar"), e.prepend(i), i.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !0
            }), t && P(t, "has-toolbar"), this.container = i, i
        }
        createEl(t) {
            const e = this.instance,
                i = e.carousel;
            if (!i) return null;
            if ("toggleFS" === t) return null;
            if ("fullscreen" === t && !e.fsAPI) return null;
            let n = null;
            const o = i.slides.length || 0;
            let a = 0,
                r = 0;
            for (const t of i.slides)(t.panzoom || "image" === t.type) && a++, ("image" === t.type || t.downloadSrc) && r++;
            if (o < 2 && ["infobar", "prev", "next"].includes(t)) return n;
            if (void 0 !== St[t] && !a) return null;
            if ("download" === t && !r) return null;
            if ("thumbs" === t) {
                const t = e.plugins.Thumbs;
                if (!t || !t.isEnabled) return null
            }
            if ("slideshow" === t) {
                if (!i.plugins.Autoplay || o < 2) return null
            }
            if (void 0 !== St[t]) {
                const e = St[t];
                n = document.createElement("button"), n.setAttribute("title", this.instance.localize(`{{${t.toUpperCase()}}}`)), P(n, "f-button"), e.action && (n.dataset.panzoomAction = e.action), e.change && (n.dataset.panzoomChange = JSON.stringify(e.change)), n.appendChild(s(this.instance.localize(e.icon)))
            } else {
                const e = (this.option("items") || [])[t];
                e && (n = s(this.instance.localize(e.tpl)), "function" == typeof e.click && n.addEventListener("click", (t => {
                    t.preventDefault(), t.stopPropagation(), "function" == typeof e.click && e.click.call(this, this, t)
                })))
            }
            const l = null == n ? void 0 : n.querySelector("svg");
            if (l)
                for (const [t, e] of Object.entries(Ct)) l.getAttribute(t) || l.setAttribute(t, String(e));
            return n
        }
        removeContainer() {
            const t = this.container;
            t && t.remove(), this.container = null, this.state = Et.Disabled;
            const e = this.instance.container;
            e && E(e, "has-toolbar")
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.initSlides", t.onReady), e.on("done", t.onDone), e.on("reveal", t.onChange), e.on("Carousel.change", t.onChange), t.onReady(t.instance)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.initSlides", t.onReady), e.off("done", t.onDone), e.off("reveal", t.onChange), e.off("Carousel.change", t.onChange), t.removeContainer()
        }
    }
    Object.defineProperty(Mt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Pt
    });
    const Tt = {
            Hash: ot,
            Html: dt,
            Images: rt,
            Slideshow: gt,
            Thumbs: xt,
            Toolbar: Mt
        },
        Ot = "with-fancybox",
        At = "hide-scrollbar",
        zt = "--fancybox-scrollbar-compensate",
        Lt = "--fancybox-body-margin",
        Rt = "is-animated",
        kt = "is-compact",
        It = "is-loading",
        Dt = function() {
            var t = window.getSelection();
            return t && "Range" === t.type
        };
    let Ft = null,
        jt = null;
    const Ht = new Map;
    let Bt = 0;
    class _t extends g {
        get isIdle() {
            return this.idle
        }
        get isCompact() {
            return this.option("compact")
        }
        constructor(t = [], e = {}, i = {}) {
            super(e), Object.defineProperty(this, "userSlides", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), Object.defineProperty(this, "userPlugins", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: {}
            }), Object.defineProperty(this, "idle", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "idleTimer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "clickTimer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "pwt", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "ignoreFocusChange", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: it.Init
            }), Object.defineProperty(this, "id", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "footer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "caption", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "carousel", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "lastFocus", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "prevMouseMoveEvent", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "fsAPI", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), this.fsAPI = (() => {
                let t, e = "",
                    i = "",
                    n = "";
                return document.fullscreenEnabled ? (e = "requestFullscreen", i = "exitFullscreen", n = "fullscreenElement") : document.webkitFullscreenEnabled && (e = "webkitRequestFullscreen", i = "webkitExitFullscreen", n = "webkitFullscreenElement"), e && (t = {
                    request: function(t) {
                        return "webkitRequestFullscreen" === e ? t[e](Element.ALLOW_KEYBOARD_INPUT) : t[e]()
                    },
                    exit: function() {
                        return document[n] && document[i]()
                    },
                    isFullscreen: function() {
                        return document[n]
                    }
                }), t
            })(), this.id = e.id || ++Bt, Ht.set(this.id, this), this.userSlides = t, this.userPlugins = i, queueMicrotask((() => {
                this.init()
            }))
        }
        init() {
            if (this.state === it.Destroy) return;
            this.state = it.Init, this.attachPlugins(Object.assign(Object.assign({}, _t.Plugins), this.userPlugins)), this.emit("init"), !0 === this.option("hideScrollbar") && (() => {
                if (!K) return;
                const t = document.body;
                if (t.classList.contains(At)) return;
                let e = window.innerWidth - document.documentElement.getBoundingClientRect().width;
                e < 0 && (e = 0);
                const i = t.currentStyle || window.getComputedStyle(t),
                    n = parseFloat(i.marginRight);
                document.documentElement.style.setProperty(zt, `${e}px`), n && t.style.setProperty(Lt, `${n}px`), t.classList.add(At)
            })(), this.initLayout(), this.scale();
            const t = () => {
                    this.initCarousel(this.userSlides), this.state = it.Ready, this.attachEvents(), this.emit("ready"), setTimeout((() => {
                        this.container && this.container.setAttribute("aria-hidden", "false")
                    }), 16)
                },
                e = this.fsAPI;
            this.option("Fullscreen.autoStart") && e && !e.isFullscreen() ? e.request(this.container).then((() => t())).catch((() => t())) : t()
        }
        initLayout() {
            var t, e;
            const i = this.option("parentEl") || document.body,
                n = s(this.localize(this.option("tpl.main") || ""));
            n && (n.setAttribute("id", `fancybox-${this.id}`), n.setAttribute("aria-label", this.localize("{{MODAL}}")), n.classList.toggle(kt, this.isCompact), P(n, this.option("mainClass") || ""), this.container = n, this.footer = n.querySelector(".fancybox__footer"), i.appendChild(n), P(document.documentElement, Ot), Ft && jt || (Ft = document.createElement("span"), P(Ft, "fancybox-focus-guard"), Ft.setAttribute("tabindex", "0"), Ft.setAttribute("aria-hidden", "true"), Ft.setAttribute("aria-label", "Focus guard"), jt = Ft.cloneNode(), null === (t = n.parentElement) || void 0 === t || t.insertBefore(Ft, n), null === (e = n.parentElement) || void 0 === e || e.append(jt)), this.option("animated") && (P(n, Rt), setTimeout((() => {
                this.isClosing() || E(n, Rt)
            }), 350)), this.emit("initLayout"))
        }
        initCarousel(t) {
            const e = this.container;
            if (!e) return;
            const n = e.querySelector(".fancybox__carousel");
            if (!n) return;
            const s = this.carousel = new G(n, p({}, {
                slides: t,
                transition: "fade",
                Panzoom: {
                    lockAxis: this.option("dragToClose") ? "xy" : "x",
                    infinite: !!this.option("dragToClose") && "y"
                },
                Dots: !1,
                Navigation: {
                    classes: {
                        container: "fancybox__nav",
                        button: "f-button",
                        isNext: "is-next",
                        isPrev: "is-prev"
                    }
                },
                initialPage: this.option("startIndex"),
                l10n: this.option("l10n")
            }, this.option("Carousel") || {}));
            s.on("*", ((t, e, ...i) => {
                this.emit(`Carousel.${e}`, t, ...i)
            })), s.on(["ready", "change"], (() => {
                var t;
                const e = this.getSlide();
                e && (null === (t = e.panzoom) || void 0 === t || t.updateControls()), this.manageCaption(e)
            })), this.on("Carousel.removeSlide", ((t, e, i) => {
                i.contentEl && (i.contentEl.remove(), i.contentEl = void 0);
                const n = i.el;
                n && (E(n, "has-error"), E(n, "has-unknown"), E(n, `has-${i.type||"unknown"}`)), i.closeBtnEl && i.closeBtnEl.remove(), i.closeBtnEl = void 0, i.captionEl && i.captionEl.remove(), i.captionEl = void 0, i.spinnerEl && i.spinnerEl.remove(), i.spinnerEl = void 0, i.state = void 0
            })), s.on("Panzoom.touchStart", (() => {
                this.isCompact || this.endIdle()
            })), s.on("settle", (() => {
                this.idleTimer || this.isCompact || !this.option("idle") || this.setIdle(), this.option("autoFocus") && this.checkFocus()
            })), this.option("dragToClose") && (s.on("Panzoom.afterTransform", ((t, e) => {
                const n = this.getSlide();
                if (n && i(n.el)) return;
                const s = this.container;
                if (s) {
                    const t = Math.abs(e.current.f),
                        i = t < 1 ? "" : Math.max(.5, Math.min(1, 1 - t / e.contentRect.fitHeight * 1.5));
                    s.style.setProperty("--fancybox-ts", i ? "0s" : ""), s.style.setProperty("--fancybox-opacity", i + "")
                }
            })), s.on("Panzoom.touchEnd", ((t, e, n) => {
                var s;
                const o = this.getSlide();
                if (o && i(o.el)) return;
                if (e.isMobile && document.activeElement && -1 !== ["TEXTAREA", "INPUT"].indexOf(null === (s = document.activeElement) || void 0 === s ? void 0 : s.nodeName)) return;
                const a = Math.abs(e.dragOffset.y);
                "y" === e.lockedAxis && (a >= 200 || a >= 50 && e.dragOffset.time < 300) && (n && n.cancelable && n.preventDefault(), this.close(n, "f-throwOut" + (e.current.f < 0 ? "Up" : "Down")))
            }))), s.on("change", (t => {
                var e;
                let i = null === (e = this.getSlide()) || void 0 === e ? void 0 : e.triggerEl;
                if (i) {
                    const e = new CustomEvent("slideTo", {
                        bubbles: !0,
                        cancelable: !0,
                        detail: t.page
                    });
                    i.dispatchEvent(e)
                }
            })), s.on(["refresh", "change"], (t => {
                const e = this.container;
                if (!e) return;
                for (const i of e.querySelectorAll("[data-fancybox-current-index]")) i.innerHTML = t.page + 1;
                for (const i of e.querySelectorAll("[data-fancybox-count]")) i.innerHTML = t.pages.length;
                if (!t.isInfinite) {
                    for (const i of e.querySelectorAll("[data-fancybox-next]")) t.page < t.pages.length - 1 ? (i.removeAttribute("disabled"), i.removeAttribute("tabindex")) : (i.setAttribute("disabled", ""), i.setAttribute("tabindex", "-1"));
                    for (const i of e.querySelectorAll("[data-fancybox-prev]")) t.page > 0 ? (i.removeAttribute("disabled"), i.removeAttribute("tabindex")) : (i.setAttribute("disabled", ""), i.setAttribute("tabindex", "-1"))
                }
                const i = this.getSlide();
                if (!i) return;
                let n = i.downloadSrc || "";
                n || "image" !== i.type || i.error || "string" != typeof i.src || (n = i.src);
                const s = "disabled",
                    o = "tabindex",
                    a = "download",
                    r = "href";
                for (const t of e.querySelectorAll("[data-fancybox-download]")) {
                    const e = i.downloadFilename;
                    n ? (t.removeAttribute(s), t.removeAttribute(o), t.setAttribute(r, n), t.setAttribute(a, e || n), t.setAttribute("target", "_blank")) : (t.setAttribute(s, ""), t.setAttribute(o, "-1"), t.removeAttribute(r), t.removeAttribute(a))
                }
            })), this.emit("initCarousel")
        }
        attachEvents() {
            const t = this,
                e = t.container;
            if (!e) return;
            e.addEventListener("click", t.onClick, {
                passive: !1,
                capture: !1
            }), e.addEventListener("wheel", t.onWheel, {
                passive: !1,
                capture: !1
            }), document.addEventListener("keydown", t.onKeydown, {
                passive: !1,
                capture: !0
            }), document.addEventListener("visibilitychange", t.onVisibilityChange, !1), document.addEventListener("mousemove", t.onMousemove), t.option("trapFocus") && document.addEventListener("focus", t.onFocus, !0), window.addEventListener("resize", t.onResize);
            const i = window.visualViewport;
            i && (i.addEventListener("scroll", t.onResize), i.addEventListener("resize", t.onResize))
        }
        detachEvents() {
            const t = this,
                e = t.container;
            if (!e) return;
            document.removeEventListener("keydown", t.onKeydown, {
                passive: !1,
                capture: !0
            }), e.removeEventListener("wheel", t.onWheel, {
                passive: !1,
                capture: !1
            }), e.removeEventListener("click", t.onClick, {
                passive: !1,
                capture: !1
            }), document.removeEventListener("mousemove", t.onMousemove), window.removeEventListener("resize", t.onResize);
            const i = window.visualViewport;
            i && (i.removeEventListener("resize", t.onResize), i.removeEventListener("scroll", t.onResize)), document.removeEventListener("visibilitychange", t.onVisibilityChange, !1), document.removeEventListener("focus", t.onFocus, !0)
        }
        scale() {
            const t = this.container;
            if (!t) return;
            const e = window.visualViewport,
                i = Math.max(1, (null == e ? void 0 : e.scale) || 1);
            let n = "",
                s = "",
                o = "";
            if (e && i > 1) {
                let t = `${e.offsetLeft}px`,
                    a = `${e.offsetTop}px`;
                n = e.width * i + "px", s = e.height * i + "px", o = `translate3d(${t}, ${a}, 0) scale(${1/i})`
            }
            t.style.transform = o, t.style.width = n, t.style.height = s
        }
        onClick(t) {
            var e, i;
            const {
                container: n,
                isCompact: s
            } = this;
            if (!n || this.isClosing()) return;
            !s && this.option("idle") && this.resetIdle();
            const o = document.activeElement;
            if (Dt() && o && n.contains(o)) return;
            const a = t.composedPath()[0];
            if (a === (null === (e = this.carousel) || void 0 === e ? void 0 : e.container)) return;
            if (a.closest(".f-spinner") || a.closest("[data-fancybox-close]")) return t.preventDefault(), void this.close(t);
            if (a.closest("[data-fancybox-prev]")) return t.preventDefault(), void this.prev();
            if (a.closest("[data-fancybox-next]")) return t.preventDefault(), void this.next();
            if (s && "image" === (null === (i = this.getSlide()) || void 0 === i ? void 0 : i.type)) return void(this.clickTimer ? (clearTimeout(this.clickTimer), this.clickTimer = null) : this.clickTimer = setTimeout((() => {
                this.toggleIdle(), this.clickTimer = null
            }), 350));
            if (this.emit("click", t), t.defaultPrevented) return;
            let r = !1;
            if (a.closest(".fancybox__content")) {
                if (o) {
                    if (o.closest("[contenteditable]")) return;
                    a.matches(Q) || o.blur()
                }
                if (Dt()) return;
                r = this.option("contentClick")
            } else a.closest(".fancybox__carousel") && !a.matches(Q) && (r = this.option("backdropClick"));
            "close" === r ? (t.preventDefault(), this.close(t)) : "next" === r ? (t.preventDefault(), this.next()) : "prev" === r && (t.preventDefault(), this.prev())
        }
        onWheel(t) {
            var e;
            let i = this.option("wheel", t);
            (null === (e = t.target) || void 0 === e ? void 0 : e.closest(".fancybox__thumbs")) && (i = "slide");
            const n = "slide" === i,
                s = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function(t, e) {
                    return Math.abs(e) > Math.abs(t) ? e : t
                })),
                o = Math.max(-1, Math.min(1, s)),
                a = Date.now();
            this.pwt && a - this.pwt < 300 ? n && t.preventDefault() : (this.pwt = a, this.emit("wheel", t), t.defaultPrevented || ("close" === i ? (t.preventDefault(), this.close(t)) : "slide" === i && (t.preventDefault(), this[o > 0 ? "prev" : "next"]())))
        }
        onKeydown(t) {
            if (!this.isTopmost()) return;
            this.isCompact || !this.option("idle") || this.isClosing() || this.resetIdle();
            const e = t.key,
                i = this.option("keyboard");
            if (!i || t.ctrlKey || t.altKey || t.shiftKey) return;
            const n = t.composedPath()[0],
                s = document.activeElement && document.activeElement.classList,
                o = s && s.contains("f-button") || n.dataset.carouselPage || n.dataset.carouselIndex;
            if ("Escape" !== e && !o && S(n)) {
                if (n.isContentEditable || -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(n.nodeName)) return
            }
            this.emit("keydown", e, t);
            const a = i[e];
            "function" == typeof this[a] && (t.preventDefault(), this[a]())
        }
        onResize() {
            const t = this.container;
            if (!t) return;
            const e = this.isCompact;
            t.classList.toggle("is-compact", e), this.manageCaption(this.getSlide()), this.isCompact ? this.clearIdle() : this.endIdle(), this.scale(), this.emit("resize")
        }
        onFocus(t) {
            this.isTopmost() && this.checkFocus(t)
        }
        onMousemove(t) {
            this.prevMouseMoveEvent = t, !this.isCompact && this.option("idle") && this.resetIdle()
        }
        onVisibilityChange() {
            "visible" === document.visibilityState ? this.checkFocus() : this.endIdle()
        }
        manageCloseBtn(t) {
            const e = this.optionFor(t, "closeButton") || !1;
            if ("auto" === e) {
                const t = this.plugins.Toolbar;
                if (t && t.state === Et.Ready) return
            }
            if (!e) return;
            if (!t.contentEl || t.closeBtnEl) return;
            const i = this.option("tpl.closeButton");
            if (i) {
                const e = s(this.localize(i));
                t.closeBtnEl = t.contentEl.appendChild(e), t.el && P(t.el, "has-close-btn")
            }
        }
        manageCaption(t) {
            var e, i;
            const n = "fancybox__caption",
                s = "has-caption",
                o = this.container;
            if (!o) return;
            const a = this.isCompact || this.option("commonCaption"),
                r = !a;
            if (this.caption && this.stop(this.caption), r && this.caption && (this.caption.remove(), this.caption = null), a && !this.caption)
                for (const t of (null === (e = this.carousel) || void 0 === e ? void 0 : e.slides) || []) t.captionEl && (t.captionEl.remove(), t.captionEl = void 0, E(t.el, s), null === (i = t.el) || void 0 === i || i.removeAttribute("aria-labelledby"));
            if (t || (t = this.getSlide()), !t || a && !this.isCurrentSlide(t)) return;
            const l = t.el;
            let c = this.optionFor(t, "caption", "");
            if ("string" != typeof c || !c.length) return void(a && this.caption && this.animate(this.caption, "f-fadeOut", (() => {
                var t;
                null === (t = this.caption) || void 0 === t || t.remove(), this.caption = null
            })));
            let h = null;
            if (r) {
                if (h = t.captionEl || null, l && !h) {
                    const e = `fancybox__caption_${this.id}_${t.index}`;
                    h = document.createElement("div"), P(h, n), h.setAttribute("id", e), t.captionEl = l.appendChild(h), P(l, s), l.setAttribute("aria-labelledby", e)
                }
            } else {
                if (h = this.caption, h || (h = o.querySelector("." + n)), !h) {
                    h = document.createElement("div"), h.dataset.fancyboxCaption = "", P(h, n), h.innerHTML = c;
                    (this.footer || o).prepend(h)
                }
                P(o, s), this.caption = h
            }
            h && (h.innerHTML = c)
        }
        checkFocus(t) {
            var e;
            const i = document.activeElement || null;
            i && (null === (e = this.container) || void 0 === e ? void 0 : e.contains(i)) || this.focus(t)
        }
        focus(t) {
            var e;
            if (this.ignoreFocusChange) return;
            const i = document.activeElement || null,
                n = (null == t ? void 0 : t.target) || null,
                s = this.container,
                o = this.getSlide();
            if (!s || !(null === (e = this.carousel) || void 0 === e ? void 0 : e.viewport)) return;
            if (!t && i && s.contains(i)) return;
            const a = o && o.state === nt.Ready ? o.el : null;
            if (!a || a.contains(i) || s === i) return;
            t && t.cancelable && t.preventDefault(), this.ignoreFocusChange = !0;
            const r = Array.from(s.querySelectorAll(Q));
            let l = [],
                c = null;
            for (let t of r) {
                const e = !t.offsetParent || t.closest('[aria-hidden="true"]'),
                    i = a && a.contains(t),
                    n = !this.carousel.viewport.contains(t);
                t === s || (i || n) && !e ? (l.push(t), void 0 !== t.dataset.origTabindex && (t.tabIndex = parseFloat(t.dataset.origTabindex)), t.removeAttribute("data-orig-tabindex"), !t.hasAttribute("autoFocus") && c || (c = t)) : (t.dataset.origTabindex = void 0 === t.dataset.origTabindex ? t.getAttribute("tabindex") || void 0 : t.dataset.origTabindex, t.tabIndex = -1)
            }
            let h = null;
            t ? (!n || l.indexOf(n) < 0) && (h = c || s, l.length && (i === jt ? h = l[0] : this.lastFocus !== s && i !== Ft || (h = l[l.length - 1]))) : h = o && "image" === o.type ? s : c || s, h && tt(h), this.lastFocus = document.activeElement, this.ignoreFocusChange = !1
        }
        next() {
            const t = this.carousel;
            t && t.pages.length > 1 && t.slideNext()
        }
        prev() {
            const t = this.carousel;
            t && t.pages.length > 1 && t.slidePrev()
        }
        jumpTo(...t) {
            this.carousel && this.carousel.slideTo(...t)
        }
        isTopmost() {
            var t;
            return (null === (t = _t.getInstance()) || void 0 === t ? void 0 : t.id) == this.id
        }
        animate(t = null, e = "", i) {
            if (!t || !e) return void(i && i());
            this.stop(t);
            const n = s => {
                s.target === t && t.dataset.animationName && (t.removeEventListener("animationend", n), delete t.dataset.animationName, i && i(), E(t, e))
            };
            t.dataset.animationName = e, t.addEventListener("animationend", n), P(t, e)
        }
        stop(t) {
            t && t.dispatchEvent(new CustomEvent("animationend", {
                bubbles: !1,
                cancelable: !0,
                currentTarget: t
            }))
        }
        setContent(t, e = "", i = !0) {
            if (this.isClosing()) return;
            const n = t.el;
            if (!n) return;
            let o = null;
            if (S(e) ? o = e : (o = s(e + ""), S(o) || (o = document.createElement("div"), o.innerHTML = e + "")), ["img", "picture", "iframe", "video", "audio"].includes(o.nodeName.toLowerCase())) {
                const t = document.createElement("div");
                t.appendChild(o), o = t
            }
            S(o) && t.filter && !t.error && (o = o.querySelector(t.filter)), o && S(o) ? (P(o, "fancybox__content"), t.id && o.setAttribute("id", t.id), "none" !== o.style.display && "none" !== getComputedStyle(o).getPropertyValue("display") || (o.style.display = t.display || this.option("defaultDisplay") || "flex"), n.classList.add(`has-${t.error?"error":t.type||"unknown"}`), n.prepend(o), t.contentEl = o, i && this.revealContent(t), this.manageCloseBtn(t), this.manageCaption(t)) : this.setError(t, "{{ELEMENT_NOT_FOUND}}")
        }
        revealContent(t, e) {
            const i = t.el,
                n = t.contentEl;
            i && n && (this.emit("reveal", t), this.hideLoading(t), t.state = nt.Opening, (e = this.isOpeningSlide(t) ? void 0 === e ? this.optionFor(t, "showClass") : e : "f-fadeIn") ? this.animate(n, e, (() => {
                this.done(t)
            })) : this.done(t))
        }
        done(t) {
            this.isClosing() || (t.state = nt.Ready, this.emit("done", t), P(t.el, "is-done"), this.isCurrentSlide(t) && this.option("autoFocus") && queueMicrotask((() => {
                this.option("autoFocus") && (this.option("autoFocus") ? this.focus() : this.checkFocus())
            })), this.isOpeningSlide(t) && !this.isCompact && this.option("idle") && this.setIdle())
        }
        isCurrentSlide(t) {
            const e = this.getSlide();
            return !(!t || !e) && e.index === t.index
        }
        isOpeningSlide(t) {
            var e, i;
            return null === (null === (e = this.carousel) || void 0 === e ? void 0 : e.prevPage) && t.index === (null === (i = this.getSlide()) || void 0 === i ? void 0 : i.index)
        }
        showLoading(t) {
            t.state = nt.Loading;
            const e = t.el;
            if (!e) return;
            P(e, It), this.emit("loading", t), t.spinnerEl || setTimeout((() => {
                if (!this.isClosing() && !t.spinnerEl && t.state === nt.Loading) {
                    let i = s(x);
                    t.spinnerEl = i, e.prepend(i), this.animate(i, "f-fadeIn")
                }
            }), 250)
        }
        hideLoading(t) {
            const e = t.el;
            if (!e) return;
            const i = t.spinnerEl;
            this.isClosing() ? null == i || i.remove() : (E(e, It), i && this.animate(i, "f-fadeOut", (() => {
                i.remove()
            })), t.state === nt.Loading && (this.emit("loaded", t), t.state = nt.Ready))
        }
        setError(t, e) {
            if (this.isClosing()) return;
            const i = new Event("error", {
                bubbles: !0,
                cancelable: !0
            });
            if (this.emit("error", i, t), i.defaultPrevented) return;
            t.error = e, this.hideLoading(t), this.clearContent(t);
            const n = document.createElement("div");
            n.classList.add("fancybox-error"), n.innerHTML = this.localize(e || "<p>{{ERROR}}</p>"), this.setContent(t, n)
        }
        clearContent(t) {
            var e;
            null === (e = this.carousel) || void 0 === e || e.emit("removeSlide", t)
        }
        getSlide() {
            var t;
            const e = this.carousel;
            return (null === (t = null == e ? void 0 : e.pages[null == e ? void 0 : e.page]) || void 0 === t ? void 0 : t.slides[0]) || void 0
        }
        close(t, e) {
            if (this.isClosing()) return;
            const i = new Event("shouldClose", {
                bubbles: !0,
                cancelable: !0
            });
            if (this.emit("shouldClose", i, t), i.defaultPrevented) return;
            t && t.cancelable && (t.preventDefault(), t.stopPropagation());
            const n = this.fsAPI,
                s = () => {
                    this.proceedClose(t, e)
                };
            n && n.isFullscreen() ? Promise.resolve(n.exit()).then((() => s())) : s()
        }
        clearIdle() {
            this.idleTimer && clearTimeout(this.idleTimer), this.idleTimer = null
        }
        setIdle(t = !1) {
            const e = () => {
                this.clearIdle(), this.idle = !0, P(this.container, "is-idle"), this.emit("setIdle")
            };
            if (this.clearIdle(), !this.isClosing())
                if (t) e();
                else {
                    const t = this.option("idle");
                    t && (this.idleTimer = setTimeout(e, t))
                }
        }
        endIdle() {
            this.clearIdle(), this.idle && !this.isClosing() && (this.idle = !1, E(this.container, "is-idle"), this.emit("endIdle"))
        }
        resetIdle() {
            this.endIdle(), this.setIdle()
        }
        toggleIdle() {
            this.idle ? this.endIdle() : this.setIdle(!0)
        }
        toggleFullscreen() {
            const t = this.fsAPI;
            t && (t.isFullscreen() ? t.exit() : this.container && t.request(this.container))
        }
        isClosing() {
            return [it.Closing, it.CustomClosing, it.Destroy].includes(this.state)
        }
        proceedClose(t, e) {
            var i, n;
            this.state = it.Closing, this.clearIdle(), this.detachEvents();
            const s = this.container,
                o = this.carousel,
                a = this.getSlide(),
                r = a && this.option("placeFocusBack") ? a.triggerEl || this.option("triggerEl") : null;
            if (r && (U(r) ? tt(r) : r.focus()), s && (P(s, "is-closing"), s.setAttribute("aria-hidden", "true"), this.option("animated") && P(s, Rt), s.style.pointerEvents = "none"), o) {
                o.clearTransitions(), null === (i = o.panzoom) || void 0 === i || i.destroy(), null === (n = o.plugins.Navigation) || void 0 === n || n.detach();
                for (const t of o.slides) {
                    t.state = nt.Closing, this.hideLoading(t);
                    const e = t.contentEl;
                    e && this.stop(e);
                    const i = null == t ? void 0 : t.panzoom;
                    i && (i.stop(), i.detachEvents(), i.detachObserver()), this.isCurrentSlide(t) || o.emit("removeSlide", t)
                }
            }
            this.emit("close", t), this.state !== it.CustomClosing ? (void 0 === e && a && (e = this.optionFor(a, "hideClass")), e && a ? (this.animate(a.contentEl, e, (() => {
                o && o.emit("removeSlide", a)
            })), setTimeout((() => {
                this.destroy()
            }), 500)) : this.destroy()) : setTimeout((() => {
                this.destroy()
            }), 500)
        }
        destroy() {
            var t;
            if (this.state === it.Destroy) return;
            this.state = it.Destroy, null === (t = this.carousel) || void 0 === t || t.destroy();
            const e = this.container;
            e && e.remove(), Ht.delete(this.id);
            const i = _t.getInstance();
            i ? i.focus() : (Ft && (Ft.remove(), Ft = null), jt && (jt.remove(), jt = null), E(document.documentElement, Ot), (() => {
                if (!K) return;
                const t = document,
                    e = t.body;
                e.classList.remove(At), e.style.setProperty(Lt, ""), t.documentElement.style.setProperty(zt, "")
            })(), this.emit("destroy"))
        }
        static bind(t, e, i) {
            if (!K) return;
            let n, s = "",
                o = {};
            if (void 0 === t ? n = document.body : "string" == typeof t ? (n = document.body, s = t, "object" == typeof e && (o = e || {})) : (n = t, "string" == typeof e && (s = e), "object" == typeof i && (o = i || {})), !n || !S(n)) return;
            s = s || "[data-fancybox]";
            const a = _t.openers.get(n) || new Map;
            a.set(s, o), _t.openers.set(n, a), 1 === a.size && n.addEventListener("click", _t.fromEvent)
        }
        static unbind(t, e) {
            let i, n = "";
            if ("string" == typeof t ? (i = document.body, n = t) : (i = t, "string" == typeof e && (n = e)), !i) return;
            const s = _t.openers.get(i);
            s && n && s.delete(n), n && s || (_t.openers.delete(i), i.removeEventListener("click", _t.fromEvent))
        }
        static destroy() {
            let t;
            for (; t = _t.getInstance();) t.destroy();
            for (const t of _t.openers.keys()) t.removeEventListener("click", _t.fromEvent);
            _t.openers = new Map
        }
        static fromEvent(t) {
            if (t.defaultPrevented) return;
            if (t.button && 0 !== t.button) return;
            if (t.ctrlKey || t.metaKey || t.shiftKey) return;
            let e = t.composedPath()[0];
            const i = e.closest("[data-fancybox-trigger]");
            if (i) {
                const t = i.dataset.fancyboxTrigger || "",
                    n = document.querySelectorAll(`[data-fancybox="${t}"]`),
                    s = parseInt(i.dataset.fancyboxIndex || "", 10) || 0;
                e = n[s] || e
            }
            if (!(e && e instanceof Element)) return;
            let n, s, o, a;
            if ([..._t.openers].reverse().find((([t, i]) => !(!t.contains(e) || ![...i].reverse().find((([i, r]) => {
                    let l = e.closest(i);
                    return !!l && (n = t, s = i, o = l, a = r, !0)
                }))))), !n || !s || !o) return;
            a = a || {}, t.preventDefault(), e = o;
            let r = [],
                l = p({}, et, a);
            l.event = t, l.triggerEl = e, l.delegate = i;
            const c = l.groupAll,
                h = l.groupAttr,
                d = h && e ? e.getAttribute(`${h}`) : "";
            if ((!e || d || c) && (r = [].slice.call(n.querySelectorAll(s))), e && !c && (r = d ? r.filter((t => t.getAttribute(`${h}`) === d)) : [e]), !r.length) return;
            const u = _t.getInstance();
            return u && u.options.triggerEl && r.indexOf(u.options.triggerEl) > -1 ? void 0 : (e && (l.startIndex = r.indexOf(e)), _t.fromNodes(r, l))
        }
        static fromSelector(t, e) {
            let i = null,
                n = "";
            if ("string" == typeof t ? (i = document.body, n = t) : t instanceof HTMLElement && "string" == typeof e && (i = t, n = e), !i || !n) return !1;
            const s = _t.openers.get(i);
            if (!s) return !1;
            const o = s.get(n);
            return !!o && _t.fromNodes(Array.from(i.querySelectorAll(n)), o)
        }
        static fromNodes(t, e) {
            e = p({}, et, e || {});
            const i = [];
            for (const n of t) {
                const t = n.dataset || {},
                    s = t.src || n.getAttribute("href") || n.getAttribute("currentSrc") || n.getAttribute("src") || void 0;
                let o;
                const a = e.delegate;
                let r;
                a && i.length === e.startIndex && (o = a instanceof HTMLImageElement ? a : a.querySelector("img:not([aria-hidden])")), o || (o = n instanceof HTMLImageElement ? n : n.querySelector("img:not([aria-hidden])")), o && (r = o.currentSrc || o.src || void 0, !r && o.dataset && (r = o.dataset.lazySrc || o.dataset.src || void 0));
                const l = {
                    src: s,
                    triggerEl: n,
                    thumbEl: o,
                    thumbElSrc: r,
                    thumbSrc: r
                };
                for (const e in t) "fancybox" !== e && (l[e] = t[e] + "");
                i.push(l)
            }
            return new _t(i, e)
        }
        static getInstance(t) {
            if (t) return Ht.get(t);
            return Array.from(Ht.values()).reverse().find((t => !t.isClosing() && t)) || null
        }
        static getSlide() {
            var t;
            return (null === (t = _t.getInstance()) || void 0 === t ? void 0 : t.getSlide()) || null
        }
        static show(t = [], e = {}) {
            return new _t(t, e)
        }
        static next() {
            const t = _t.getInstance();
            t && t.next()
        }
        static prev() {
            const t = _t.getInstance();
            t && t.prev()
        }
        static close(t = !0, ...e) {
            if (t)
                for (const t of Ht.values()) t.close(...e);
            else {
                const t = _t.getInstance();
                t && t.close(...e)
            }
        }
    }
    Object.defineProperty(_t, "version", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: "5.0.19"
    }), Object.defineProperty(_t, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: et
    }), Object.defineProperty(_t, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Tt
    }), Object.defineProperty(_t, "openers", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new Map
    }), t.Carousel = G, t.Fancybox = _t, t.Panzoom = k
}));