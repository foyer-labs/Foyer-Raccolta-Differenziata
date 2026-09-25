/*! Foyer Raccolta Differenziata — Apache-2.0. Vedi LICENSE e NOTICE.
* Include Lit (https://lit.dev): Copyright 2017 Google LLC, BSD-3-Clause. */
//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? se;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var g = globalThis, ce = (e) => e, _ = g.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, be = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = be(1), xe = be(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), O = y.createTreeWalker(y, 129);
function Ce(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, k = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : M
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Te = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, j = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = A(this, e, t), x(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = k.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Te(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new k(e)), t;
	}
	k(t) {
		S(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, M = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, De = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Oe = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ke = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, Ae = g.litHtmlPolyfillSupport;
Ae?.(k, j), (g.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P });
var Me = N.litElementPolyfillSupport;
Me?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/comune/stili.ts
var F = o`
  :host {
    --rd-primario: var(--primary-color, #03a9f4);
    --rd-testo: var(--primary-text-color, #1b1f24);
    --rd-testo-2: var(--secondary-text-color, #5f6873);
    --rd-superficie: var(--card-background-color, #fff);
    --rd-superficie-2: var(--secondary-background-color, #f3f4f6);
    --rd-bordo: var(--divider-color, rgba(0, 0, 0, 0.12));
    --rd-avviso: var(--warning-color, #c77700);
    --rd-errore: var(--error-color, #db4437);
    --rd-ok: var(--success-color, #2e9e4f);
    --rd-raggio: var(--ha-card-border-radius, 16px);
    color: var(--rd-testo);
  }
  button {
    font: inherit;
    color: inherit;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 3px 10px 3px 4px;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.28);
  }
  .pallino {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex: none;
  }
  .aiuto {
    color: var(--rd-testo-2);
    font-size: 13.5px;
    margin: 0 0 12px;
  }
  .bottone {
    border: 1px solid var(--rd-bordo);
    background: var(--rd-superficie);
    border-radius: 10px;
    padding: 7px 14px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .bottone:hover {
    background: var(--rd-superficie-2);
  }
  .bottone.primario {
    background: var(--rd-primario);
    border-color: var(--rd-primario);
    color: var(--text-primary-color, #fff);
  }
  .bottone.primario:hover {
    filter: brightness(1.08);
  }
  .bottone.piccolo {
    padding: 3px 10px;
    font-size: 13px;
    border-radius: 8px;
  }
  .bottone.pericolo {
    color: var(--rd-errore);
  }
  .bottone[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`, I = o`
  .modulo {
    display: grid;
    gap: 14px;
  }
  .campo > label,
  .campo > .etichetta {
    display: block;
    font-size: 13px;
    color: var(--rd-testo-2);
    margin-bottom: 6px;
    font-weight: 500;
  }
  .campo small {
    display: block;
    color: var(--rd-testo-2);
    margin-top: 4px;
    font-size: 12.5px;
  }
  input,
  select,
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid var(--rd-bordo);
    background: var(--rd-superficie);
    color: var(--rd-testo);
    font: inherit;
  }
  input[type="color"] {
    padding: 2px;
    height: 40px;
    width: 64px;
  }
  textarea {
    min-height: 64px;
    resize: vertical;
  }
  .segmenti {
    display: inline-flex;
    background: var(--rd-superficie-2);
    border-radius: 12px;
    padding: 3px;
    gap: 2px;
    flex-wrap: wrap;
  }
  .segmenti button {
    border: 0;
    background: none;
    padding: 7px 12px;
    border-radius: 9px;
    cursor: pointer;
    font-size: 14px;
  }
  .segmenti button.attivo {
    background: var(--rd-superficie);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    font-weight: 600;
  }
  .tonde {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .tonde button {
    min-width: 42px;
    height: 42px;
    padding: 0 10px;
    border-radius: 21px;
    border: 1px solid var(--rd-bordo);
    background: var(--rd-superficie);
    cursor: pointer;
    font-weight: 600;
  }
  .tonde button.attivo {
    background: var(--rd-primario);
    border-color: var(--rd-primario);
    color: var(--text-primary-color, #fff);
  }
  .riga-campi {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .anteprima-date {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .anteprima-date span {
    background: color-mix(in srgb, var(--rd-primario) 14%, transparent);
    color: var(--rd-primario);
    border-radius: 8px;
    padding: 4px 10px;
    font-weight: 600;
    font-size: 13.5px;
  }
  .errori {
    background: color-mix(in srgb, var(--rd-errore) 12%, transparent);
    color: var(--rd-errore);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 13.5px;
  }
  .errori ul {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  .azioni-modulo {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .levetta {
    width: 44px;
    height: 26px;
    border-radius: 999px;
    background: var(--rd-bordo);
    position: relative;
    flex: none;
    border: 0;
    cursor: pointer;
    padding: 0;
  }
  .levetta::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .levetta.acceso {
    background: var(--rd-primario);
  }
  .levetta.acceso::after {
    transform: translateX(18px);
  }
`;
function L(e) {
	let [t, n, r] = [
		1,
		3,
		5
	].map((t) => {
		let n = parseInt(e.slice(t, t + 2), 16) / 255;
		return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
	});
	return .2126 * t + .7152 * n + .0722 * r > .4 ? "#1b1f24" : "#ffffff";
}
var R = o`
  .riquadro {
    background: var(--rd-superficie);
    border: 1px solid var(--rd-bordo);
    border-radius: var(--rd-raggio);
    box-shadow: var(--ha-card-box-shadow, none);
    padding: 16px;
  }
  .riquadro + .riquadro {
    margin-top: 16px;
  }
  .riquadro h2 {
    font-size: 16px;
    margin: 0 0 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .riquadro h2 .conta {
    margin-left: auto;
    font-weight: 500;
    color: var(--rd-testo-2);
    font-size: 13px;
  }
  .griglia-2 {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 820px) {
    .griglia-2 {
      grid-template-columns: 1fr;
    }
  }
  .voce {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--rd-bordo);
    border-radius: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }
  .voce .frase {
    flex: 1;
    min-width: 180px;
  }
  .voce .frase small {
    display: block;
    color: var(--rd-testo-2);
  }
  .vuoto {
    color: var(--rd-testo-2);
    font-size: 14px;
    padding: 8px 0;
  }
  .riga-azioni {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
`, z = (e) => T`<span class="chip" style="background:${e.colore};color:${L(e.colore)}"
    ><ha-icon .icon=${e.icona}></ha-icon>${e.nome}</span
  >`, B = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^0-9a-f]/gi, "").slice(0, 32), V = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Ne = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, H = (e, t) => {
	let n = V(e);
	return n.setDate(n.getDate() + t), Ne(n);
}, U = (e) => (V(e).getDay() + 6) % 7, Pe = (e, t) => Math.round((V(t).getTime() - V(e).getTime()) / 864e5), Fe = (e) => H(e, -U(e)), Ie = [
	"lunedì",
	"martedì",
	"mercoledì",
	"giovedì",
	"venerdì",
	"sabato",
	"domenica"
], W = [
	"Lun",
	"Mar",
	"Mer",
	"Gio",
	"Ven",
	"Sab",
	"Dom"
], G = [
	"gennaio",
	"febbraio",
	"marzo",
	"aprile",
	"maggio",
	"giugno",
	"luglio",
	"agosto",
	"settembre",
	"ottobre",
	"novembre",
	"dicembre"
], Le = {
	1: "primo",
	2: "secondo",
	3: "terzo",
	4: "quarto",
	[-1]: "ultimo"
}, Re = {
	1: "1°",
	2: "2°",
	3: "3°",
	4: "4°",
	[-1]: "Ultimo"
}, K = {
	titolo: "Raccolta differenziata",
	carica: "Caricamento…",
	nonCaricata: "L'integrazione Raccolta differenziata non è caricata. Controlla Impostazioni → Dispositivi e servizi.",
	pagine: {
		panoramica: "Panoramica",
		tipologie: "Tipologie",
		regole: "Regole",
		eccezioni: "Eccezioni",
		promemoria: "Promemoria",
		impostazioni: "Impostazioni"
	},
	oggi: "Oggi",
	domani: "Domani",
	nessunRitiro: "Nessun ritiro",
	salva: "Salva",
	annulla: "Annulla",
	modifica: "Modifica",
	elimina: "Elimina",
	chiudi: "Chiudi",
	primaDiSalvare: "Prima di salvare",
	cosaCambia: "Ecco cosa cambia nei prossimi 60 giorni.",
	nienteCambia: "Nessun ritiro cambia nei prossimi 60 giorni.",
	salvato: "Salvato",
	altroHaSalvato: "Qualcun altro ha salvato nel frattempo: la pagina è stata aggiornata, riprova.",
	nonSalvato: "Non salvato: correggi questi punti.",
	prossimiRitiri: "Prossimi ritiri",
	giorni30: "30 giorni",
	daControllare: "Da controllare",
	tuttoInOrdine: "Tutto in ordine: nessuna segnalazione.",
	calendarioComune: "Calendario del comune",
	giorniValidita: "giorni di validità",
	validoFino: (e) => `fino al ${q(e)}`,
	scaduto: (e) => `scaduto il ${q(e)}: i ritiri successivi sono da verificare`,
	senzaValidita: "Non hai indicato fino a quando vale. Indicalo in Impostazioni: un mese prima ti ricorderemo di controllare quello nuovo.",
	creaEccezione: "Crea eccezione",
	ignora: "Ignora",
	aggiungiData: "Aggiungi una data",
	apriRegole: "Vedi le regole",
	festiviIgnorati: "Festivi ignorati",
	ripristina: "Ripristina avviso",
	configurazioneNonValida: "La configurazione salvata non è valida: i sensori non sono disponibili finché non la correggi.",
	aiutoTipologie: "Una tipologia senza regole prende i ritiri solo dalle date aggiunte: va bene per gli ingombranti.",
	nuovaTipologia: "Nuova tipologia",
	nessunaNota: "Nessuna nota",
	prossimo: "Prossimo",
	nome: "Nome",
	colore: "Colore",
	icona: "Icona",
	iconaAiuto: "Un'icona di Material Design, per esempio mdi:food-apple",
	note: "Note: cosa ci va",
	finestraPropria: "Orario di esposizione diverso da quello generale",
	eliminaTipologia: (e, t, n) => `Eliminare ${e}? Spariscono anche ${t} ${t === 1 ? "regola" : "regole"} e ${n} ${n === 1 ? "eccezione" : "eccezioni"}, e il suo sensore.`,
	aiutoRegole: "Una regola dice ogni quanto passa un rifiuto. Più regole della stessa tipologia si sommano; una regola con l'anno sostituisce le altre nel suo periodo.",
	nuovaRegola: "Nuova regola",
	nessunaRegola: "Nessuna regola: i ritiri vengono solo dalle eccezioni.",
	nomeRegola: "Nome (facoltativo)",
	nomeRegolaAiuto: "Per riconoscerla: Estate, Inverno, Calendario 2027…",
	ricorrenza: "Ricorrenza",
	ogniSettimane: "Ogni N settimane",
	posizioneMese: "N-esimo giorno del mese",
	dataMese: "Giorno del mese",
	ogni: "Ogni",
	settimane: (e) => e === 1 ? "settimana" : `${e} settimane`,
	neiGiorni: "Nei giorni",
	ancora: "Un giorno in cui questo ritiro c'è stato o ci sarà",
	ancoraAiuto: "Serve a capire quali settimane contano: un giorno sbagliato di una settimana sposta tutto il calendario.",
	quali: "Quali",
	giornoSettimana: "Giorno della settimana",
	giorniDelMese: "Giorni del mese",
	periodo: "Periodo",
	sempre: "Tutto l'anno",
	annuale: "Ogni anno dal… al…",
	conAnno: "Solo dal… al…",
	dal: "Dal",
	al: "Al",
	mese: "Mese",
	giorno: "Giorno",
	prossimeDate: "Le prossime date",
	nessunaData: "Nessuna data nei prossimi 12 mesi",
	aiutoEccezioni: "Le date che il calendario del comune cambia: un ritiro in più, uno annullato, uno spostato.",
	nessunaEccezione: "Nessuna eccezione.",
	aggiungiRitiro: "Aggiungi un ritiro",
	togliRitiro: "Togli un ritiro",
	spostaRitiro: "Sposta un ritiro",
	tipoEccezione: {
		aggiungi: "Aggiunto",
		togli: "Tolto",
		sposta: "Spostato"
	},
	tipologia: "Tipologia",
	data: "Data",
	da: "Da",
	a: "A",
	nota: "Nota (facoltativa)",
	passate: "Passate",
	mostraBarra: "Mostra nella barra laterale",
	mostraBarraAiuto: "Se la nascondi, trovi il pannello nella pagina del dispositivo «Raccolta differenziata», o in Impostazioni → Dispositivi e servizi.",
	validita: "Calendario valido fino al",
	validitaAiuto: "Un mese prima ti ricordiamo di controllare il calendario nuovo del comune.",
	patrono: "Santo patrono",
	patronoAiuto: "Segnalato come festivo, come le feste nazionali.",
	nomePatrono: "Nome",
	esposizione: "Quando si espongono i sacchi",
	esposizioneAiuto: "Vale per tutte le tipologie che non hanno un orario proprio.",
	inizioGiorno: {
		giorno_prima: "il giorno prima",
		giorno_stesso: "il giorno stesso"
	},
	dalle: "Dalle",
	del: "del",
	entroLe: "Entro le (giorno del ritiro)",
	togli: "Togli"
};
function q(e) {
	let t = V(e);
	return `${t.getDate()} ${G[t.getMonth()]} ${t.getFullYear()}`;
}
function J(e) {
	let t = V(e);
	return `${W[U(e)].toLowerCase()} ${t.getDate()} ${G[t.getMonth()].slice(0, 3)}`;
}
function ze(e) {
	let t = V(e);
	return `${t.getDate()} ${G[t.getMonth()].slice(0, 3)}`;
}
var Be = (e) => e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} e ${e[e.length - 1]}`;
function Ve(e) {
	if (e.tipo === "settimanale") {
		let t = Be([...e.giorni].sort().map((e) => Ie[e]));
		return e.ogni === 1 ? `Ogni settimana, il ${t}` : e.ogni === 2 ? `Una settimana sì e una no, il ${t}` : `Ogni ${e.ogni} settimane, il ${t}`;
	}
	return e.tipo === "mensile_posizione" ? `Il ${Be([...e.posizioni].sort((e, t) => (e === -1 ? 9 : e) - (t === -1 ? 9 : t)).map((e) => Le[e]))} ${Ie[e.giorno]} del mese` : `Il giorno ${Be([...e.giorni].sort((e, t) => e - t).map(String))} di ogni mese`;
}
var He = (e) => {
	let [t, n] = e.split("-").map(Number);
	return `${n} ${G[t - 1]}`;
};
function Ue(e) {
	return e.tipo === "sempre" ? "Tutto l'anno" : e.tipo === "annuale" ? `Dal ${He(e.dal)} al ${He(e.al)}, ogni anno` : `Dal ${q(e.dal)} al ${q(e.al)}`;
}
var We = {
	nome_non_valido: "il nome è vuoto o troppo lungo",
	nome_duplicato: "c'è già una tipologia con questo nome",
	colore_non_valido: "il colore non è valido",
	icona_non_valida: "l'icona deve iniziare con mdi:",
	note_troppo_lunghe: "le note sono troppo lunghe (massimo 500 caratteri)",
	fine_prima_di_inizio: "la fine viene prima dell'inizio",
	orario_non_valido: "un orario non è valido",
	settimane_non_valide: "il numero di settimane va da 1 a 8",
	giorni_non_validi: "scegli almeno un giorno",
	posizioni_non_valide: "scegli almeno una posizione nel mese",
	data_non_valida: "una data non è valida (ammesse dal 2000 al 2099)",
	"29_febbraio": "il 29 febbraio non può iniziare o finire un periodo annuale",
	eccezione_duplicata: "c'è già un'eccezione su quel giorno per questa tipologia",
	spostamento_sullo_stesso_giorno: "lo spostamento deve andare su un altro giorno",
	tipologia_sconosciuta: "la tipologia non esiste più",
	id_duplicato: "identificativo duplicato",
	revisione_superata: "qualcun altro ha salvato nel frattempo"
}, Y = (e) => We[e.codice] ?? e.codice;
function Ge(e, t) {
	let n = e.tipologia ? t(e.tipologia) : "", r = e.intervalli.map(([e, t]) => e === t ? q(e) : `dal ${q(e)} al ${q(t)}`).join(", ");
	switch (e.codice) {
		case "ritiro_festivo": return `${n}: ${q(e.data)} è un giorno festivo. Controlla cosa fa il comune.`;
		case "sovrapposizione_mista": return `${n}: la regola «${t(e.regole[0])}» cede a «${t(e.regole[1])}» ${r}.`;
		case "sovrapposizione_stesso_tipo": return `${n}: le regole «${t(e.regole[0])}» e «${t(e.regole[1])}» generano gli stessi ${e.conteggio} ritiri ${r}. Una delle due è di troppo?`;
		case "eccezione_senza_ritiro": return `${n}: il ${q(e.data)} non c'è un ritiro da togliere o spostare.`;
		case "eccezione_ridondante": return `${n}: il ${q(e.data)} il ritiro c'è già; l'eccezione non cambia nulla.`;
		case "giorno_inesistente": return `${n}: nei mesi senza il giorno ${e.giorni.join(" o ")} la regola «${t(e.regole[0])}» non genera il ritiro.`;
		case "tipologia_senza_ritiri": return `${n} non ha ritiri nei prossimi 12 mesi.`;
		case "calendario_in_scadenza": return `Il calendario vale fino al ${q(e.data)}: controlla quello nuovo del comune.`;
		case "calendario_scaduto": return `Il calendario è scaduto il ${q(e.data)}: i ritiri successivi sono da verificare.`;
		default: return e.codice;
	}
}
var Ke = (e) => e.nome || Ve(e.ricorrenza), qe = xe`<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%">
  <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 13.5 V9 H38 V13.5"/><path d="M10 14.5 H54"/><path d="M13.5 20 L17 57 H47 L50.5 20 Z"/>
    <polyline points="21,34 32,25 43,34" opacity="0.5"/><polyline points="25.5,40.5 32,35 38.5,40.5"/>
  </g>
  <rect x="28.5" y="46.5" width="7" height="7" fill="#F0A835"/><circle cx="32" cy="46.5" r="3.5" fill="#F0A835"/>
</svg>`, Je = class extends P {
	constructor(...e) {
		super(...e), this.titolo = "", this.aperta = !1;
	}
	static {
		this.properties = {
			titolo: {},
			aperta: {
				type: Boolean,
				reflect: !0
			}
		};
	}
	static {
		this.styles = [F, o`
      :host {
        display: none;
      }
      :host([aperta]) {
        display: block;
      }
      .velo {
        position: fixed;
        inset: 0;
        background: rgba(10, 14, 20, 0.5);
        display: grid;
        place-items: center;
        z-index: 20;
        padding: 16px;
        overflow-y: auto;
      }
      .dialogo {
        background: var(--rd-superficie);
        border-radius: 20px;
        max-width: 560px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        max-height: calc(100vh - 32px);
        display: flex;
        flex-direction: column;
      }
      header {
        display: flex;
        align-items: center;
        padding: 16px 20px 8px;
        gap: 8px;
      }
      h3 {
        margin: 0;
        font-size: 18px;
        flex: 1;
      }
      header button {
        border: 0;
        background: none;
        cursor: pointer;
        color: var(--rd-testo-2);
        --mdc-icon-size: 22px;
      }
      .contenuto {
        padding: 8px 20px 20px;
        overflow-y: auto;
      }
    `];
	}
	_chiudi() {
		this.dispatchEvent(new CustomEvent("chiudi"));
	}
	render() {
		return T`<div
      class="velo"
      @click=${(e) => e.target === e.currentTarget && this._chiudi()}
      @keydown=${(e) => e.key === "Escape" && this._chiudi()}
    >
      <div class="dialogo" role="dialog" aria-modal="true" aria-label=${this.titolo}>
        <header>
          <h3>${this.titolo}</h3>
          <button aria-label=${K.chiudi} @click=${this._chiudi}><ha-icon icon="mdi:close"></ha-icon></button>
        </header>
        <div class="contenuto"><slot></slot></div>
      </div>
    </div>`;
	}
};
customElements.get("rd-finestra") || customElements.define("rd-finestra", Je);
//#endregion
//#region src/pannello/contesto.ts
var X = (e, t) => e.dispatchEvent(new CustomEvent("proponi", {
	detail: t,
	bubbles: !0,
	composed: !0
})), Z = (e, t, n) => e.dispatchEvent(new CustomEvent("naviga", {
	detail: {
		pagina: t,
		precompila: n
	},
	bubbles: !0,
	composed: !0
})), Ye = (e) => e.dispatchEvent(new CustomEvent("ricarica", {
	bubbles: !0,
	composed: !0
})), Q = (e) => JSON.parse(JSON.stringify(e)), Xe = "foyer_raccolta_differenziata", Ze = class extends P {
	constructor(...e) {
		super(...e), this._nome = (e) => {
			let t = this.lettura.configurazione, n = t.tipologie.find((t) => t.id === e);
			if (n) return n.nome;
			let r = t.regole.find((t) => t.id === e);
			return r ? Ke(r) : e;
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_ritiri: { state: !0 }
		};
	}
	updated(e) {
		e.has("lettura") && this._carica();
	}
	async _carica() {
		let e = this.lettura.oggi;
		this._ritiri = await this.hass.callWS({
			type: `${Xe}/ritiri`,
			dal: e,
			al: H(e, 29)
		});
	}
	async _ignora(e) {
		await this.hass.callWS({
			type: `${Xe}/anomalie/ignora`,
			data: e.data,
			tipologia: e.tipologia
		}), Ye(this);
	}
	_festivi() {
		let e = new Set(this.lettura.festivi_ignorati.map((e) => `${e.data}|${e.tipologia}`));
		return (this._ritiri?.ritiri ?? []).filter((t) => t.festivo && !e.has(`${t.data}|${t.tipologia}`));
	}
	_azioni(e) {
		switch (e.codice) {
			case "tipologia_senza_ritiri": return T`<button class="bottone piccolo" @click=${() => Z(this, "eccezioni", {
				tipo: "aggiungi",
				tipologia: e.tipologia,
				data: this.lettura.oggi
			})}>${K.aggiungiData}</button>`;
			case "sovrapposizione_mista":
			case "sovrapposizione_stesso_tipo":
			case "giorno_inesistente": return T`<button class="bottone piccolo" @click=${() => Z(this, "regole")}>${K.apriRegole}</button>`;
			case "eccezione_senza_ritiro":
			case "eccezione_ridondante": return T`<button class="bottone piccolo" @click=${() => Z(this, "eccezioni")}>${K.pagine.eccezioni}</button>`;
			case "calendario_in_scadenza":
			case "calendario_scaduto": return T`<button class="bottone piccolo" @click=${() => Z(this, "impostazioni")}>${K.pagine.impostazioni}</button>`;
			default: return D;
		}
	}
	_giorni() {
		let e = this.lettura.configurazione.tipologie, t = /* @__PURE__ */ new Map();
		for (let e of this._ritiri?.ritiri ?? []) t.set(e.data, [...t.get(e.data) ?? [], e]);
		if (!t.size) return T`<div class="vuoto">${K.nessunRitiro}</div>`;
		let n = this.lettura.oggi;
		return [...t.entries()].map(([t, r]) => {
			let i = Pe(n, t), a = i === 0 ? K.oggi : i === 1 ? K.domani : W[U(t)];
			return T`<div class="giorno ${i === 0 ? "oggi" : ""}">
        <div class="quando"><b>${a}</b>${ze(t)}</div>
        <div class="chips">
          ${r.map((t) => {
				let n = e.find((e) => e.id === t.tipologia);
				return T`${n ? z(n) : t.tipologia}
            ${t.spostato_dal ? T`<span class="nota">↪ ${ze(t.spostato_dal)}</span>` : D}
            ${t.festivo ? T`<span class="nota avviso">${t.festivo}</span>` : D}`;
			})}
        </div>
      </div>`;
		});
	}
	_validita() {
		let e = this.lettura.configurazione.valido_fino_al;
		if (!e) return T`<p class="aiuto">${K.senzaValidita}</p>`;
		let t = Pe(this.lettura.oggi, e);
		return t < 0 ? T`<p class="aiuto avviso">${K.scaduto(e)}</p>` : T`<div class="validita ${t <= 30 ? "avviso" : ""}">
      <div class="grande">${t}</div>
      <div>${K.giorniValidita}<br /><small class="aiuto">${K.validoFino(e)}</small></div>
    </div>`;
	}
	render() {
		let e = this._festivi(), t = this.lettura.anomalie, n = e.length + t.length;
		return T`
      ${this.lettura.problemi.length ? T`<div class="riquadro errore">
            ${K.configurazioneNonValida}
            <ul>${this.lettura.problemi.map((e) => T`<li>${Y(e)}</li>`)}</ul>
          </div>` : D}
      <div class="griglia-2">
        <div class="riquadro">
          <h2>${K.prossimiRitiri} <span class="conta">${K.giorni30}</span></h2>
          ${this._giorni()}
        </div>
        <div>
          <div class="riquadro">
            <h2>${K.daControllare} ${n ? T`<span class="conta">${n}</span>` : D}</h2>
            ${n === 0 ? T`<div class="vuoto">${K.tuttoInOrdine}</div>` : D}
            ${e.map((e) => T`<div class="anomalia">
                <ha-icon icon="mdi:alert-outline"></ha-icon>
                <div class="testo">
                  <b>${this._nome(e.tipologia)}</b> · ${q(e.data)}: ${e.festivo}.
                  <div class="riga-azioni">
                    <button class="bottone piccolo primario" @click=${() => Z(this, "eccezioni", {
			tipo: "sposta",
			tipologia: e.tipologia,
			data: e.data
		})}>${K.creaEccezione}</button>
                    <button class="bottone piccolo" @click=${() => this._ignora(e)}>${K.ignora}</button>
                  </div>
                </div>
              </div>`)}
            ${t.map((e) => T`<div class="anomalia ${e.gravita}">
                <ha-icon icon=${e.gravita === "avviso" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
                <div class="testo">${Ge(e, this._nome)}<div class="riga-azioni">${this._azioni(e)}</div></div>
              </div>`)}
          </div>
          <div class="riquadro">
            <h2>${K.calendarioComune}</h2>
            ${this._validita()}
          </div>
        </div>
      </div>
    `;
	}
	static {
		this.styles = [
			F,
			R,
			o`
      .giorno {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--rd-bordo);
        align-items: center;
      }
      .giorno:first-of-type {
        border-top: 0;
      }
      .quando {
        color: var(--rd-testo-2);
        font-size: 13px;
        line-height: 1.2;
      }
      .quando b {
        display: block;
        color: var(--rd-testo);
        font-size: 15px;
      }
      .giorno.oggi .quando b {
        color: var(--rd-primario);
      }
      .chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        align-items: center;
      }
      .nota {
        font-size: 12px;
        color: var(--rd-testo-2);
      }
      .nota.avviso,
      p.avviso,
      .validita.avviso .grande {
        color: var(--rd-avviso);
      }
      .anomalia {
        display: flex;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--rd-avviso) 12%, transparent);
        margin-bottom: 8px;
        align-items: flex-start;
        --mdc-icon-size: 20px;
      }
      .anomalia ha-icon {
        color: var(--rd-avviso);
      }
      .anomalia.info {
        background: var(--rd-superficie-2);
      }
      .anomalia.info ha-icon {
        color: var(--rd-testo-2);
      }
      .anomalia .testo {
        flex: 1;
        font-size: 14px;
      }
      .validita {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .validita .grande {
        font-size: 32px;
        font-weight: 600;
      }
      .errore {
        margin-bottom: 16px;
        color: var(--rd-errore);
      }
    `
		];
	}
};
customElements.get("rd-panoramica") || customElements.define("rd-panoramica", Ze);
//#endregion
//#region src/pannello/pagine/tipologie.ts
var Qe = "foyer_raccolta_differenziata", $e = [
	"#795548",
	"#1e88e5",
	"#fdd835",
	"#43a047",
	"#757575",
	"#8bc34a",
	"#e53935",
	"#8e24aa",
	"#fb8c00",
	"#00897b"
], et = class extends P {
	constructor(...e) {
		super(...e), this._prossimi = {};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 },
			_prossimi: { state: !0 }
		};
	}
	updated(e) {
		e.has("lettura") && this._caricaProssimi();
	}
	chiudiEditor() {
		this._bozza = void 0;
	}
	async _caricaProssimi() {
		let e = this.lettura.oggi, t = await this.hass.callWS({
			type: `${Qe}/ritiri`,
			dal: e,
			al: H(e, 365)
		}), n = {};
		for (let e of t.ritiri) n[e.tipologia] ??= e.data;
		this._prossimi = n;
	}
	_nuova() {
		let e = new Set(this.lettura.configurazione.tipologie.map((e) => e.colore.toLowerCase()));
		this._bozza = {
			id: B(),
			nome: "",
			colore: $e.find((t) => !e.has(t)) ?? $e[0],
			icona: "mdi:trash-can-outline",
			note: "",
			esposizione: null
		};
	}
	_salva() {
		let e = this._bozza, t = Q(this.lettura.configurazione), n = t.tipologie.findIndex((t) => t.id === e.id), r = {
			...e,
			nome: e.nome.trim(),
			note: e.note.trim()
		};
		n >= 0 ? t.tipologie[n] = r : t.tipologie.push(r), X(this, t);
	}
	_elimina() {
		let e = this._bozza, t = this.lettura.configurazione, n = t.regole.filter((t) => t.tipologia === e.id).length, r = t.eccezioni.filter((t) => t.tipologia === e.id).length;
		if (!confirm(K.eliminaTipologia(e.nome, n, r))) return;
		let i = Q(t);
		i.tipologie = i.tipologie.filter((t) => t.id !== e.id), i.regole = i.regole.filter((t) => t.tipologia !== e.id), i.eccezioni = i.eccezioni.filter((t) => t.tipologia !== e.id), X(this, i);
	}
	_aggiorna(e) {
		this._bozza = {
			...this._bozza,
			...e
		};
	}
	_aggiornaFinestra(e) {
		let t = this._bozza.esposizione ?? { ...this.lettura.configurazione.esposizione };
		this._aggiorna({ esposizione: {
			...t,
			...e
		} });
	}
	_editor() {
		let e = this._bozza;
		if (!e) return D;
		let t = this.lettura.configurazione.tipologie.some((t) => t.id === e.id);
		return T`<rd-finestra aperta titolo=${t && e.nome || K.nuovaTipologia} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="anteprima-testa" style="background:${e.colore};color:${L(e.colore)}">
          <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome || K.nome}</b>
        </div>
        <div class="campo">
          <label for="nome">${K.nome}</label>
          <input id="nome" maxlength="40" .value=${e.nome} @input=${(e) => this._aggiorna({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${K.colore}</span>
          <div class="colori">
            ${$e.map((t) => T`<button class="colore ${t === e.colore ? "attivo" : ""}" style="background:${t}" aria-label=${t} @click=${() => this._aggiorna({ colore: t })}></button>`)}
            <input type="color" .value=${e.colore} @input=${(e) => this._aggiorna({ colore: e.target.value })} />
          </div>
        </div>
        <div class="campo">
          <label for="icona">${K.icona}</label>
          <input id="icona" .value=${e.icona} @input=${(e) => this._aggiorna({ icona: e.target.value.trim() })} />
          <small>${K.iconaAiuto}</small>
        </div>
        <div class="campo">
          <label for="note">${K.note}</label>
          <textarea id="note" maxlength="500" .value=${e.note} @input=${(e) => this._aggiorna({ note: e.target.value })}></textarea>
        </div>
        <label class="spunta">
          <input type="checkbox" .checked=${e.esposizione !== null} @change=${(e) => this._aggiorna({ esposizione: e.target.checked ? { ...this.lettura.configurazione.esposizione } : null })} />
          ${K.finestraPropria}
        </label>
        ${e.esposizione ? T`<div class="riga-campi">
                <div class="campo">
                  <label>${K.dalle}</label>
                  <input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._aggiornaFinestra({ inizio_ora: e.target.value })} />
                </div>
                <div class="campo">
                  <label>${K.del}</label>
                  <select @change=${(e) => this._aggiornaFinestra({ inizio_giorno: e.target.value })}>
                    ${["giorno_prima", "giorno_stesso"].map((t) => T`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${K.inizioGiorno[t]}</option>`)}
                  </select>
                </div>
              </div>
              <div class="campo">
                <label>${K.entroLe}</label>
                <input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._aggiornaFinestra({ fine_ora: e.target.value })} />
              </div>` : D}
        <div class="azioni-modulo">
          ${t ? T`<button class="bottone pericolo" @click=${this._elimina}>${K.elimina}</button>` : D}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${K.annulla}</button>
          <button class="bottone primario" ?disabled=${!e.nome.trim()} @click=${this._salva}>${K.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione.tipologie;
		return T`<div class="riquadro">
        <h2>${K.pagine.tipologie} <span class="conta">${e.length}</span></h2>
        <p class="aiuto">${K.aiutoTipologie}</p>
        <div class="griglia">
          ${e.map((e) => T`<button class="tipologia" @click=${() => this._bozza = Q(e)}>
              <div class="testa" style="background:${e.colore};color:${L(e.colore)}">
                <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome}</b>
              </div>
              <div class="corpo">${e.note || T`<i>${K.nessunaNota}</i>`}</div>
              <div class="piede">
                <span>${K.prossimo}: <b>${this._prossimi[e.id] ? ze(this._prossimi[e.id]) : "—"}</b></span>
                <span class="link">${K.modifica}</span>
              </div>
            </button>`)}
          <button class="nuova" @click=${this._nuova}><ha-icon icon="mdi:plus"></ha-icon>${K.nuovaTipologia}</button>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			F,
			R,
			I,
			o`
      .griglia {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
      }
      .tipologia {
        border: 1px solid var(--rd-bordo);
        border-radius: 14px;
        overflow: hidden;
        background: var(--rd-superficie);
        display: flex;
        flex-direction: column;
        text-align: left;
        padding: 0;
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .tipologia:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }
      .testa,
      .anteprima-testa {
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
      }
      .anteprima-testa {
        border-radius: 14px;
      }
      .cerchio {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        display: grid;
        place-items: center;
        flex: none;
      }
      .corpo {
        padding: 12px 14px;
        font-size: 13.5px;
        color: var(--rd-testo-2);
        flex: 1;
      }
      .piede {
        padding: 8px 14px;
        border-top: 1px solid var(--rd-bordo);
        display: flex;
        justify-content: space-between;
        font-size: 13px;
      }
      .link {
        color: var(--rd-primario);
      }
      .nuova {
        border: 2px dashed var(--rd-bordo);
        border-radius: 14px;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 6px;
        min-height: 150px;
        color: var(--rd-testo-2);
        cursor: pointer;
        background: none;
      }
      .colori {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .colore {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        padding: 0;
      }
      .colore.attivo {
        border-color: var(--rd-testo);
        box-shadow: 0 0 0 2px var(--rd-superficie) inset;
      }
      .spunta {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 14px;
      }
      .spunta input {
        width: auto;
      }
    `
		];
	}
};
customElements.get("rd-tipologie") || customElements.define("rd-tipologie", et);
//#endregion
//#region src/pannello/pagine/regole.ts
var tt = "foyer_raccolta_differenziata", nt = {
	settimanale: (e) => ({
		tipo: "settimanale",
		ogni: 1,
		giorni: [],
		ancora: Fe(e)
	}),
	mensile_posizione: () => ({
		tipo: "mensile_posizione",
		posizioni: [1],
		giorno: 0
	}),
	mensile_data: () => ({
		tipo: "mensile_data",
		giorni: [1]
	})
}, rt = {
	sempre: () => ({ tipo: "sempre" }),
	annuale: () => ({
		tipo: "annuale",
		dal: "04-01",
		al: "10-31"
	}),
	con_anno: (e) => ({
		tipo: "con_anno",
		dal: e,
		al: `${e.slice(0, 4)}-12-31`
	})
}, it = (e, t) => e.includes(t) ? e.filter((e) => e !== t) : [...e, t], at = class extends P {
	constructor(...e) {
		super(...e), this._date = [], this._problemi = [];
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 },
			_date: { state: !0 },
			_problemi: { state: !0 }
		};
	}
	chiudiEditor() {
		this._bozza = void 0;
	}
	_nuova(e) {
		let t = this.lettura.oggi;
		this._imposta({
			id: B(),
			tipologia: e,
			nome: "",
			ricorrenza: nt.settimanale(t),
			periodo: { tipo: "sempre" }
		});
	}
	_imposta(e) {
		this._bozza = e, clearTimeout(this._timer), this._timer = window.setTimeout(() => void this._anteprima(), 250);
	}
	_candidata() {
		let e = Q(this.lettura.configurazione), t = e.regole.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nome: this._bozza.nome.trim()
		};
		return t >= 0 ? e.regole[t] = n : e.regole.push(n), e;
	}
	async _anteprima() {
		if (!this._bozza) return;
		let e = this._bozza.id, t = await this.hass.callWS({
			type: `${tt}/anteprima`,
			configurazione: this._candidata(),
			giorni: 366
		});
		this._bozza?.id === e && (this._problemi = t.problemi.filter((e) => e.percorso.startsWith("regole")), this._date = t.ritiri.filter((t) => t.regole.includes(e)).slice(0, 4).map((e) => e.data));
	}
	_ricorrenza(e) {
		this._imposta({
			...this._bozza,
			ricorrenza: {
				...this._bozza.ricorrenza,
				...e
			}
		});
	}
	_periodo(e) {
		this._imposta({
			...this._bozza,
			periodo: {
				...this._bozza.periodo,
				...e
			}
		});
	}
	_elimina() {
		let e = Q(this.lettura.configurazione);
		e.regole = e.regole.filter((e) => e.id !== this._bozza.id), X(this, e);
	}
	_editorRicorrenza(e) {
		let t = (t, n) => T`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			ricorrenza: nt[t](this.lettura.oggi)
		})}>${n}</button>`;
		return T`<div class="campo">
        <span class="etichetta">${K.ricorrenza}</span>
        <div class="segmenti">
          ${t("settimanale", K.ogniSettimane)} ${t("mensile_posizione", K.posizioneMese)}
          ${t("mensile_data", K.dataMese)}
        </div>
      </div>
      ${e.tipo === "settimanale" ? T`<div class="campo">
              <span class="etichetta">${K.ogni}</span>
              <div class="segmenti">
                ${[
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		].map((t) => T`<button class=${e.ogni === t ? "attivo" : ""} @click=${() => this._ricorrenza({ ogni: t })}>${t === 1 || t === 2 ? K.settimane(t) : t}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${K.neiGiorni}</span>
              <div class="tonde">
                ${W.map((t, n) => T`<button class=${e.giorni.includes(n) ? "attivo" : ""} aria-pressed=${e.giorni.includes(n)} @click=${() => this._ricorrenza({ giorni: it(e.giorni, n).sort() })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>
            ${e.ogni > 1 ? T`<div class="campo">
                  <label for="ancora">${K.ancora}</label>
                  <input id="ancora" type="date" .value=${e.ancora} @change=${(e) => this._ricorrenza({ ancora: e.target.value })} />
                  <small>${K.ancoraAiuto}</small>
                </div>` : D}` : D}
      ${e.tipo === "mensile_posizione" ? T`<div class="campo">
              <span class="etichetta">${K.quali}</span>
              <div class="tonde">
                ${[
			1,
			2,
			3,
			4,
			-1
		].map((t) => T`<button class=${e.posizioni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ posizioni: it(e.posizioni, t) })}>${Re[t]}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${K.giornoSettimana}</span>
              <div class="tonde">
                ${W.map((t, n) => T`<button class=${e.giorno === n ? "attivo" : ""} @click=${() => this._ricorrenza({ giorno: n })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>` : D}
      ${e.tipo === "mensile_data" ? T`<div class="campo">
            <span class="etichetta">${K.giorniDelMese}</span>
            <div class="tonde calendario">
              ${Array.from({ length: 31 }, (e, t) => t + 1).map((t) => T`<button class=${e.giorni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ giorni: it(e.giorni, t).sort((e, t) => e - t) })}>${t}</button>`)}
            </div>
          </div>` : D}`;
	}
	_meseGiorno(e, t) {
		let [n, r] = e.split("-").map(Number), i = (e, n) => t(`${String(e).padStart(2, "0")}-${String(n).padStart(2, "0")}`);
		return T`<div class="riga-campi">
      <select aria-label=${K.giorno} @change=${(e) => i(n, Number(e.target.value))}>
        ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => T`<option value=${e} ?selected=${e === r}>${e}</option>`)}
      </select>
      <select aria-label=${K.mese} @change=${(e) => i(Number(e.target.value), r)}>
        ${G.map((e, t) => T`<option value=${t + 1} ?selected=${t + 1 === n}>${e}</option>`)}
      </select>
    </div>`;
	}
	_editorPeriodo(e) {
		let t = (t, n) => T`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			periodo: rt[t](this.lettura.oggi)
		})}>${n}</button>`;
		return T`<div class="campo">
        <span class="etichetta">${K.periodo}</span>
        <div class="segmenti">${t("sempre", K.sempre)} ${t("annuale", K.annuale)} ${t("con_anno", K.conAnno)}</div>
      </div>
      ${e.tipo === "annuale" ? T`<div class="riga-campi">
            <div class="campo"><span class="etichetta">${K.dal}</span>${this._meseGiorno(e.dal, (e) => this._periodo({ dal: e }))}</div>
            <div class="campo"><span class="etichetta">${K.al}</span>${this._meseGiorno(e.al, (e) => this._periodo({ al: e }))}</div>
          </div>` : D}
      ${e.tipo === "con_anno" ? T`<div class="riga-campi">
            <div class="campo"><label>${K.dal}</label><input type="date" .value=${e.dal} @change=${(e) => this._periodo({ dal: e.target.value })} /></div>
            <div class="campo"><label>${K.al}</label><input type="date" .value=${e.al} @change=${(e) => this._periodo({ al: e.target.value })} /></div>
          </div>` : D}`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return D;
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = this.lettura.configurazione.regole.some((t) => t.id === e.id);
		return T`<rd-finestra aperta titolo=${`${n ? K.modifica : K.nuovaRegola} · ${t?.nome ?? ""}`} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${K.nomeRegola}</label>
          <input id="nome" maxlength="40" .value=${e.nome} placeholder=${K.nomeRegolaAiuto} @input=${(t) => this._bozza = {
			...e,
			nome: t.target.value
		}} />
        </div>
        ${this._editorRicorrenza(e.ricorrenza)} ${this._editorPeriodo(e.periodo)}
        <div class="campo">
          <span class="etichetta">${K.prossimeDate}</span>
          ${this._problemi.length ? T`<div class="errori">${this._problemi.map((e) => T`<div>${Y(e)}</div>`)}</div>` : this._date.length ? T`<div class="anteprima-date">${this._date.map((e) => T`<span>${J(e)}</span>`)}</div>` : T`<div class="aiuto">${K.nessunaData}</div>`}
        </div>
        <div class="azioni-modulo">
          ${n ? T`<button class="bottone pericolo" @click=${this._elimina}>${K.elimina}</button>` : D}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${K.annulla}</button>
          <button class="bottone primario" ?disabled=${this._problemi.length > 0} @click=${() => X(this, this._candidata())}>${K.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione;
		return T`<div class="riquadro">
        <h2>${K.pagine.regole}</h2>
        <p class="aiuto">${K.aiutoRegole}</p>
        ${e.tipologie.map((t) => {
			let n = e.regole.filter((e) => e.tipologia === t.id);
			return T`<section class="gruppo">
            <div class="titolo">${z(t)}</div>
            ${n.length ? n.map((e) => T`<div class="voce">
                    <div class="frase">
                      ${e.nome ? T`<b>${e.nome}</b> · ` : D}${Ve(e.ricorrenza)}
                      <small>${Ue(e.periodo)}</small>
                    </div>
                    <button class="bottone piccolo" @click=${() => this._imposta(Q(e))}>${K.modifica}</button>
                  </div>`) : T`<div class="vuoto">${K.nessunaRegola}</div>`}
            <button class="bottone piccolo" @click=${() => this._nuova(t.id)}><ha-icon icon="mdi:plus"></ha-icon>${K.nuovaRegola}</button>
          </section>`;
		})}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			F,
			R,
			I,
			o`
      .gruppo {
        padding: 12px 0 16px;
        border-top: 1px solid var(--rd-bordo);
      }
      .gruppo:first-of-type {
        border-top: 0;
      }
      .titolo {
        margin-bottom: 8px;
      }
      .bottone ha-icon {
        --mdc-icon-size: 16px;
      }
      .calendario {
        display: grid;
        grid-template-columns: repeat(7, 42px);
      }
    `
		];
	}
};
customElements.get("rd-regole") || customElements.define("rd-regole", at);
//#endregion
//#region src/pannello/pagine/eccezioni.ts
var ot = "foyer_raccolta_differenziata", st = (e) => e.tipo === "sposta" ? e.da : e.data, ct = class extends P {
	constructor(...e) {
		super(...e), this._problemi = [], this._passate = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			precompila: { attribute: !1 },
			_bozza: { state: !0 },
			_problemi: { state: !0 },
			_passate: { state: !0 }
		};
	}
	chiudiEditor() {
		this._bozza = void 0;
	}
	updated(e) {
		if (e.has("precompila") && this.precompila) {
			let e = this.precompila;
			this._nuova(e.tipo, e.tipologia, e.data), this.precompila = void 0;
		}
	}
	_nuova(e, t, n) {
		let r = t ?? this.lettura.configurazione.tipologie[0]?.id ?? "", i = n ?? this.lettura.oggi;
		this._bozza = e === "sposta" ? {
			id: B(),
			tipo: e,
			tipologia: r,
			da: i,
			a: i,
			nota: ""
		} : {
			id: B(),
			tipo: e,
			tipologia: r,
			data: i,
			nota: ""
		}, this._problemi = [];
	}
	_candidata() {
		let e = Q(this.lettura.configurazione), t = e.eccezioni.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nota: (this._bozza.nota ?? "").trim()
		};
		return t >= 0 ? e.eccezioni[t] = n : e.eccezioni.push(n), e.eccezioni.sort((e, t) => st(e).localeCompare(st(t))), e;
	}
	async _salva() {
		let e = this._candidata(), t = await this.hass.callWS({
			type: `${ot}/anteprima`,
			configurazione: e
		});
		this._problemi = t.problemi, t.problemi.length || X(this, e);
	}
	_elimina() {
		let e = Q(this.lettura.configurazione);
		e.eccezioni = e.eccezioni.filter((e) => e.id !== this._bozza.id), X(this, e);
	}
	_aggiorna(e) {
		this._bozza = {
			...this._bozza,
			...e
		};
	}
	_data(e, t, n) {
		return T`<div class="campo">
      <label>${e}</label>
      <input type="date" .value=${n} @change=${(e) => this._aggiorna({ [t]: e.target.value })} />
    </div>`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return D;
		let t = this.lettura.configurazione.eccezioni.some((t) => t.id === e.id);
		return T`<rd-finestra aperta titolo=${{
			aggiungi: K.aggiungiRitiro,
			togli: K.togliRitiro,
			sposta: K.spostaRitiro
		}[e.tipo]} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${K.tipologia}</span>
          <div class="scelta-tipologie">
            ${this.lettura.configurazione.tipologie.map((t) => T`<button class=${t.id === e.tipologia ? "attivo" : ""} @click=${() => this._aggiorna({ tipologia: t.id })}>${z(t)}</button>`)}
          </div>
        </div>
        ${e.tipo === "sposta" ? T`<div class="riga-campi">${this._data(K.da, "da", e.da)} ${this._data(K.a, "a", e.a)}</div>` : this._data(K.data, "data", e.data)}
        <div class="campo">
          <label for="nota">${K.nota}</label>
          <input id="nota" maxlength="200" .value=${e.nota ?? ""} @input=${(e) => this._aggiorna({ nota: e.target.value })} />
        </div>
        ${this._problemi.length ? T`<div class="errori">${this._problemi.map((e) => T`<div>${Y(e)}</div>`)}</div>` : D}
        <div class="azioni-modulo">
          ${t ? T`<button class="bottone pericolo" @click=${this._elimina}>${K.elimina}</button>` : D}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${K.annulla}</button>
          <button class="bottone primario" @click=${this._salva}>${K.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	_riga(e) {
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = e.tipo === "sposta" ? T`${J(e.da)} → ${J(e.a)}` : J(e.data);
		return T`<div class="voce">
      <span class="badge ${e.tipo}">${K.tipoEccezione[e.tipo]}</span>
      ${t ? z(t) : D}
      <div class="frase"><b>${n}</b>${e.nota ? T`<small>${e.nota}</small>` : D}</div>
      <button class="bottone piccolo" @click=${() => (this._bozza = Q(e), this._problemi = [])}>${K.modifica}</button>
    </div>`;
	}
	render() {
		let e = this.lettura.configurazione.eccezioni, t = this.lettura.oggi, n = (e) => e.tipo === "sposta" ? e.a > e.da ? e.a : e.da : e.data, r = e.filter((e) => n(e) >= t), i = e.filter((e) => n(e) < t);
		return T`<div class="riquadro">
        <h2>${K.pagine.eccezioni} <span class="conta">${r.length}</span></h2>
        <p class="aiuto">${K.aiutoEccezioni}</p>
        ${r.length ? r.map((e) => this._riga(e)) : T`<div class="vuoto">${K.nessunaEccezione}</div>`}
        <div class="riga-azioni">
          <button class="bottone primario" @click=${() => this._nuova("aggiungi")}><ha-icon icon="mdi:plus"></ha-icon>${K.aggiungiRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("togli")}><ha-icon icon="mdi:minus"></ha-icon>${K.togliRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("sposta")}><ha-icon icon="mdi:arrow-right"></ha-icon>${K.spostaRitiro}</button>
        </div>
        ${i.length ? T`<details @toggle=${(e) => this._passate = e.target.open}>
              <summary>${K.passate} (${i.length})</summary>
              ${this._passate ? i.map((e) => this._riga(e)) : D}
            </details>` : D}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			F,
			R,
			I,
			o`
      .badge {
        font-size: 11.5px;
        font-weight: 700;
        border-radius: 6px;
        padding: 2px 8px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .badge.aggiungi {
        background: color-mix(in srgb, var(--rd-ok) 18%, transparent);
        color: var(--rd-ok);
      }
      .badge.togli {
        background: color-mix(in srgb, var(--rd-errore) 16%, transparent);
        color: var(--rd-errore);
      }
      .badge.sposta {
        background: color-mix(in srgb, var(--rd-primario) 16%, transparent);
        color: var(--rd-primario);
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .scelta-tipologie {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .scelta-tipologie button {
        border: 2px solid transparent;
        background: none;
        border-radius: 999px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.55;
      }
      .scelta-tipologie button.attivo {
        border-color: var(--rd-primario);
        opacity: 1;
      }
      details {
        margin-top: 16px;
      }
      summary {
        cursor: pointer;
        color: var(--rd-testo-2);
        margin-bottom: 8px;
      }
    `
		];
	}
};
customElements.get("rd-eccezioni") || customElements.define("rd-eccezioni", ct);
//#endregion
//#region src/pannello/pagine/impostazioni.ts
var lt = "foyer_raccolta_differenziata", ut = class extends P {
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 }
		};
	}
	updated(e) {
		e.has("lettura") && (this._bozza = Q(this.lettura.configurazione));
	}
	async _barra() {
		await this.hass.callWS({
			type: `${lt}/barra_laterale`,
			mostra: !this.lettura.mostra_barra_laterale
		}), Ye(this);
	}
	_finestra(e) {
		this._bozza = {
			...this._bozza,
			esposizione: {
				...this._bozza.esposizione,
				...e
			}
		};
	}
	_patrono(e) {
		let t = this._bozza.patrono ?? {
			data: "01-01",
			nome: ""
		};
		this._bozza = {
			...this._bozza,
			patrono: {
				...t,
				...e
			}
		};
	}
	_salva() {
		let e = Q(this._bozza);
		e.patrono && !e.patrono.nome.trim() && (e.patrono = null), e.patrono && (e.patrono.nome = e.patrono.nome.trim()), e.valido_fino_al ||= null, X(this, e);
	}
	render() {
		let e = this._bozza;
		if (!e) return T``;
		let [t, n] = (e.patrono?.data ?? "01-01").split("-").map(Number), r = (e, t) => this._patrono({ data: `${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}` }), i = JSON.stringify(e) !== JSON.stringify(this.lettura.configurazione);
		return T`<div class="colonna">
      <div class="riquadro">
        <h2>${K.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${K.mostraBarra}<small>${K.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${K.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${K.esposizione}</h2>
        <p class="aiuto">${K.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${K.dalle}</label><input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._finestra({ inizio_ora: e.target.value })} /></div>
            <div class="campo">
              <label>${K.del}</label>
              <select @change=${(e) => this._finestra({ inizio_giorno: e.target.value })}>
                ${["giorno_prima", "giorno_stesso"].map((t) => T`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${K.inizioGiorno[t]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${K.entroLe}</label><input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._finestra({ fine_ora: e.target.value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${K.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${K.validita}</label>
            <input id="validita" type="date" .value=${e.valido_fino_al ?? ""} @change=${(t) => this._bozza = {
			...e,
			valido_fino_al: t.target.value || null
		}} />
            <small>${K.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${K.patrono}</span>
            <div class="patrono">
              <input aria-label=${K.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${e.patrono?.nome ?? ""} @input=${(e) => this._patrono({ nome: e.target.value })} />
              <select aria-label=${K.giorno} @change=${(e) => r(t, Number(e.target.value))}>
                ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => T`<option value=${e} ?selected=${e === n}>${e}</option>`)}
              </select>
              <select aria-label=${K.mese} @change=${(e) => r(Number(e.target.value), n)}>
                ${G.map((e, n) => T`<option value=${n + 1} ?selected=${n + 1 === t}>${e}</option>`)}
              </select>
            </div>
            <small>${K.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!i} @click=${() => this._bozza = Q(this.lettura.configurazione)}>${K.annulla}</button>
        <button class="bottone primario" ?disabled=${!i} @click=${this._salva}>${K.salva}</button>
      </div>
    </div>`;
	}
	static {
		this.styles = [
			F,
			R,
			I,
			o`
      .colonna {
        max-width: 680px;
      }
      .interruttore {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .interruttore small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .patrono {
        display: grid;
        grid-template-columns: 2fr 1fr 1.4fr;
        gap: 8px;
      }
      .azioni-modulo {
        margin-top: 16px;
      }
    `
		];
	}
};
customElements.get("rd-impostazioni") || customElements.define("rd-impostazioni", ut);
//#endregion
//#region src/pannello/raccolta-pannello.ts
var $ = "foyer_raccolta_differenziata", dt = [
	"panoramica",
	"tipologie",
	"regole",
	"eccezioni",
	"impostazioni"
], ft = class extends P {
	constructor(...e) {
		super(...e), this.narrow = !1, this._pagina = "panoramica", this._problemi = [];
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			_lettura: { state: !0 },
			_errore: { state: !0 },
			_pagina: { state: !0 },
			_inAttesa: { state: !0 },
			_problemi: { state: !0 },
			_avviso: { state: !0 },
			_precompila: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback();
		let e = new URLSearchParams(location.search).get("pagina");
		e && dt.includes(e) && (this._pagina = e);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._disiscrivi?.then((e) => e()).catch(() => void 0), this._disiscrivi = void 0;
	}
	updated(e) {
		e.has("hass") && this.hass && !this._lettura && !this._errore && (this._carica(), this._disiscrivi = this.hass.connection.subscribeMessage(() => void this._carica(), { type: `${$}/iscriviti` }).catch(() => () => void 0));
	}
	async _carica() {
		try {
			this._lettura = await this.hass.callWS({ type: `${$}/config/leggi` }), this._errore = void 0;
		} catch {
			this._errore = K.nonCaricata;
		}
	}
	_mostraAvviso(e) {
		this._avviso = e, clearTimeout(this._timerAvviso), this._timerAvviso = window.setTimeout(() => this._avviso = void 0, 4e3);
	}
	async _proponi(e) {
		e.stopPropagation();
		let t = e.detail, n = await this.hass.callWS({
			type: `${$}/anteprima`,
			configurazione: t
		});
		this._problemi = n.problemi, this._inAttesa = {
			candidata: t,
			anteprima: n
		};
	}
	async _salva() {
		if (!this._inAttesa || !this._lettura) return;
		let e = await this.hass.callWS({
			type: `${$}/config/salva`,
			configurazione: this._inAttesa.candidata,
			revisione: this._lettura.revisione
		});
		if (e.salvato) {
			this._inAttesa = void 0, this._problemi = [], await this._carica(), this._mostraAvviso(K.salvato), this._chiudiEditor();
			return;
		}
		if (e.problemi.some((e) => e.codice === "revisione_superata")) {
			this._inAttesa = void 0, await this._carica(), this._mostraAvviso(K.altroHaSalvato);
			return;
		}
		this._problemi = e.problemi;
	}
	_chiudiEditor() {
		this.renderRoot.querySelector(".pagina > *")?.chiudiEditor?.();
	}
	_naviga(e) {
		this._pagina = e.detail.pagina, this._precompila = e.detail.precompila;
	}
	_finestraSalvataggio() {
		let e = this._inAttesa;
		if (!e) return D;
		let t = e.candidata.tipologie, n = (e, n) => {
			let r = t.find((e) => e.id === n.tipologia) ?? this._lettura?.configurazione.tipologie.find((e) => e.id === n.tipologia);
			return T`<div class="differenza">
        <span class="segno ${e === "+" ? "piu" : "meno"}">${e}</span>
        <b>${J(n.data)}</b>
        ${r ? z(r) : n.tipologia}
      </div>`;
		}, { aggiunti: r, tolti: i } = e.anteprima.differenze, a = [...r.map((e) => ({
			...e,
			segno: "+"
		})), ...i.map((e) => ({
			...e,
			segno: "−"
		}))].sort((e, t) => e.data.localeCompare(t.data));
		return T`<rd-finestra aperta titolo=${K.primaDiSalvare} @chiudi=${() => this._inAttesa = void 0}>
      ${this._problemi.length ? T`<div class="errori">
            ${K.nonSalvato}
            <ul>
              ${this._problemi.map((e) => T`<li>${Y(e)}</li>`)}
            </ul>
          </div>` : T`<p class="aiuto">${a.length ? K.cosaCambia : K.nienteCambia}</p>
            <div class="differenze">${a.slice(0, 40).map((e) => n(e.segno, e))}</div>`}
      <div class="azioni-finestra">
        <button class="bottone" @click=${() => this._inAttesa = void 0}>${K.annulla}</button>
        ${this._problemi.length ? D : T`<button class="bottone primario" @click=${this._salva}>${K.salva}</button>`}
      </div>
    </rd-finestra>`;
	}
	_paginaCorrente() {
		let e = this._lettura;
		switch (this._pagina) {
			case "tipologie": return T`<rd-tipologie .hass=${this.hass} .lettura=${e}></rd-tipologie>`;
			case "regole": return T`<rd-regole .hass=${this.hass} .lettura=${e}></rd-regole>`;
			case "eccezioni": return T`<rd-eccezioni .hass=${this.hass} .lettura=${e} .precompila=${this._precompila}></rd-eccezioni>`;
			case "impostazioni": return T`<rd-impostazioni .hass=${this.hass} .lettura=${e}></rd-impostazioni>`;
			default: return T`<rd-panoramica .hass=${this.hass} .lettura=${e}></rd-panoramica>`;
		}
	}
	render() {
		return T`
      <header class="testata">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="simbolo">${qe}</span>
        <h1>${K.titolo}</h1>
      </header>
      <nav class="schede" role="tablist">
        ${dt.map((e) => T`<button
            role="tab"
            aria-selected=${e === this._pagina}
            class=${e === this._pagina ? "attiva" : ""}
            @click=${() => {
			this._pagina = e, this._precompila = void 0;
		}}
          >
            ${K.pagine[e]}
          </button>`)}
      </nav>
      <main
        class="pagina"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @ricarica=${() => void this._carica()}
      >
        ${this._errore ? T`<div class="vuoto">${this._errore}</div>` : this._lettura ? this._paginaCorrente() : T`<div class="vuoto">${K.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._avviso ? T`<div class="avviso" role="status">${this._avviso}</div>` : D}
    `;
	}
	static {
		this.styles = [F, o`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color, #f3f4f6);
      }
      .testata {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 16px 0 4px;
        height: var(--header-height, 56px);
        background: var(--app-header-background-color, var(--rd-superficie));
        color: var(--app-header-text-color, var(--rd-testo));
        border-bottom: 1px solid var(--rd-bordo);
        position: sticky;
        top: 0;
        z-index: 3;
        box-sizing: border-box;
      }
      .simbolo {
        width: 30px;
        height: 30px;
        margin-left: 8px;
        flex: none;
      }
      h1 {
        font-size: 20px;
        margin: 0;
        font-weight: 400;
      }
      .schede {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        background: var(--rd-superficie);
        border-bottom: 1px solid var(--rd-bordo);
        overflow-x: auto;
        position: sticky;
        top: var(--header-height, 56px);
        z-index: 3;
        scrollbar-width: none;
      }
      .schede button {
        border: 0;
        background: none;
        padding: 12px 14px;
        cursor: pointer;
        color: var(--rd-testo-2);
        border-bottom: 2px solid transparent;
        white-space: nowrap;
        font-weight: 500;
      }
      .schede button.attiva {
        color: var(--rd-primario);
        border-bottom-color: var(--rd-primario);
      }
      main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 20px 16px 96px;
      }
      .vuoto {
        text-align: center;
        color: var(--rd-testo-2);
        padding: 48px 16px;
      }
      .differenza {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .segno {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #fff;
        flex: none;
      }
      .piu {
        background: var(--rd-ok);
      }
      .meno {
        background: var(--rd-errore);
      }
      .azioni-finestra {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
      .errori {
        background: color-mix(in srgb, var(--rd-errore) 12%, transparent);
        color: var(--rd-errore);
        border-radius: 10px;
        padding: 10px 12px;
      }
      .errori ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .avviso {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        background: var(--rd-testo);
        color: var(--rd-superficie);
        padding: 10px 18px;
        border-radius: 12px;
        z-index: 30;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        max-width: calc(100vw - 32px);
      }
    `];
	}
};
customElements.get("foyer-raccolta-pannello") || customElements.define("foyer-raccolta-pannello", ft);
//#endregion
export { ft as RaccoltaPannello };
