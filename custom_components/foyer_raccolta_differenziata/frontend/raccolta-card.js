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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: ee, getPrototypeOf: te } = Object, p = globalThis, ne = p.trustedTypes, re = ne ? ne.emptyScript : "", ie = p.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, ae = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: ae
};
Symbol.metadata ??= Symbol("metadata"), p.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = te(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...f(e), ...ee(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ae)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[m("elementProperties")] = /* @__PURE__ */ new Map(), g[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: g }), (p.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var _ = globalThis, se = (e) => e, v = _.trustedTypes, ce = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + y, de = `<${ue}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", C = Array.isArray, fe = (e) => C(e) || typeof e?.[Symbol.iterator] == "function", pe = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, ye = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), E = ye(1), be = ye(2), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), k = b.createTreeWalker(b, 129);
function Se(e, t) {
	if (!C(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [Se(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, we = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ce(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : M
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += y.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = b, r;
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
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = A(this, e, t), S(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? fe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = we.createElement(Se(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Te(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = xe.get(e.strings);
		return t === void 0 && xe.set(e.strings, t = new we(e)), t;
	}
	k(t) {
		C(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
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
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, De = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, Oe = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
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
}, Ae = _.litHtmlPolyfillSupport;
Ae?.(we, j), (_.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends g {
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
		return D;
	}
};
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P });
var Me = N.litElementPolyfillSupport;
Me?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/comune/date.ts
var F = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, I = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, L = (e, t) => {
	let n = F(e);
	return n.setDate(n.getDate() + t), I(n);
}, R = (e) => (F(e).getDay() + 6) % 7, z = (e, t) => Math.round((F(t).getTime() - F(e).getTime()) / 864e5), Ne = (e) => L(e, -R(e)), B = (e) => `${e.slice(0, 7)}-01`, Pe = (e, t) => new Date(e, t, 0).getDate(), V = (e) => e.slice(11, 16), H = [
	"lunedì",
	"martedì",
	"mercoledì",
	"giovedì",
	"venerdì",
	"sabato",
	"domenica"
], Fe = [
	"Lun",
	"Mar",
	"Mer",
	"Gio",
	"Ven",
	"Sab",
	"Dom"
], Ie = [
	"L",
	"M",
	"M",
	"G",
	"V",
	"S",
	"D"
], U = [
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
], W = {
	titolo: "Raccolta differenziata",
	carica: "Caricamento…",
	nonCaricata: "L'integrazione Raccolta differenziata non è caricata. Controlla Impostazioni → Dispositivi e servizi.",
	pagine: {
		panoramica: "Panoramica",
		tipologie: "Tipologie",
		regole: "Regole",
		eccezioni: "Eccezioni",
		promemoria: "Promemoria",
		piattaforma: "Piattaforma",
		impostazioni: "Impostazioni"
	},
	oggi: "Oggi",
	domani: "Domani",
	nessunRitiro: "Nessun ritiro",
	salva: "Salva",
	annulla: "Annulla",
	indietro: "Indietro",
	modifica: "Modifica",
	elimina: "Elimina",
	chiudi: "Chiudi",
	primaDiSalvare: "Prima di salvare",
	cosaCambia: "Ecco cosa cambia nei prossimi 60 giorni.",
	nienteCambia: "Nessun ritiro cambia nei prossimi 60 giorni.",
	salvato: "Salvato",
	erroreConnessione: "Non è stato possibile raggiungere Home Assistant. Riprova.",
	altroHaSalvato: "Qualcun altro ha salvato nel frattempo: la pagina è stata aggiornata, riprova.",
	nonSalvato: "Non salvato: correggi questi punti.",
	prossimiRitiri: "Prossimi ritiri",
	giorni30: "30 giorni",
	daControllare: "Da controllare",
	tuttoInOrdine: "Tutto in ordine: nessuna segnalazione.",
	calendarioComune: "Calendario del comune",
	giorniValidita: "giorni di validità",
	validoFino: (e) => `fino al ${G(e)}`,
	scaduto: (e) => `scaduto il ${G(e)}: i ritiri successivi sono da verificare`,
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
	iconaAiuto: "Cerca per nome (umido, carta, pannolini…) o scrivi un'icona di Material Design, per esempio mdi:recycle.",
	altroColore: "Un altro colore",
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
	ogniQuanteSettimane: "Ogni quante settimane",
	completaLaRegola: "Scegli almeno un giorno per completare la regola",
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
	excel: "Configurazione in Excel",
	excelAiuto: "Compila o cambia il calendario in un foglio di calcolo e importalo qui. Il file ha una guida e un foglio per ogni sezione; lo stesso file serve per esportare e per importare.",
	scaricaModello: "Scarica il modello",
	esporta: "Esporta in Excel",
	importa: "Importa da Excel…",
	importaTitolo: "Importa da Excel",
	scegliFile: "Scegli il file",
	cambiaFile: "Cambia file",
	nessunFile: "Un file .xlsx, dal modello o da un'esportazione.",
	comeImportare: "Come importarlo",
	sostituisci: "Sostituisci tutto",
	sostituisciAiuto: "Il file diventa la configurazione: quello che nel file non c'è viene tolto. Dopo aver esportato e modificato.",
	aggiungiSoltanto: "Aggiungi soltanto",
	aggiungiSoltantoAiuto: "Le righe del file si aggiungono; quelle che corrispondono a qualcosa che c'è lo aggiornano. Non si toglie niente.",
	continua: "Continua",
	leggoIlFile: "Leggo il file…",
	fileConProblemi: "Il file ha dei problemi: correggili nel foglio di calcolo e riprova.",
	altriProblemi: (e) => e === 1 ? "e un altro problema" : `e altri ${e} problemi`,
	esportaNonValida: "La configurazione salvata non è valida: correggila prima di esportarla.",
	scaricamentoFallito: "Il file non si è potuto preparare. Riprova.",
	dalFile: "Dal file",
	nienteDalFile: "Il file è uguale alla configurazione attuale.",
	riga: (e) => `riga ${e}`,
	configurazioneAttuale: "configurazione attuale",
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
	togli: "Togli",
	tutti: "Tutti",
	nonTrovato: "Non trovato in Home Assistant: toglilo o controlla il nome",
	nessunRisultato: "Nessun risultato",
	usaValore: (e) => `Invio per usare «${e}»`,
	cercaIcona: "Cerca un'icona o scrivi mdi:…",
	cercaDestinatario: "Cerca un telefono o un servizio di notifica…",
	nessunDestinatarioScelto: "Nessun destinatario: aggiungine almeno uno.",
	gruppoCompanion: "App Companion",
	gruppoServizi: "Altri servizi",
	gruppoEntita: "Entità notify",
	aiutoPromemoria: "Un promemoria dice quando avvisarti e chi. Più rifiuti nello stesso giorno arrivano in un solo messaggio.",
	nessunPromemoria: "Nessun promemoria: aggiungine uno per ricevere una notifica.",
	nuovoPromemoria: "Nuovo promemoria",
	nomePromemoria: "Nome",
	nomePromemoriaAiuto: "La sera prima, Il vetro, …",
	quando: "Quando",
	giorniPrima: "Giorni prima",
	giornoStesso: "Il giorno stesso",
	apertura: "All'apertura",
	aperturaAiuto: "Quando si possono mettere fuori i sacchi, secondo l'orario di esposizione di ogni tipologia.",
	quantiGiorni: "Quanti giorni prima",
	alle: "Alle",
	perQuali: "Per quali rifiuti",
	tutte: "Tutte",
	tutteAiuto: "«Tutte» comprende anche le tipologie che aggiungerai.",
	destinatari: "A chi",
	destinatariAiuto: "I telefoni con l'app Companion ricevono anche il pulsante «Esposto ✓».",
	nessunDestinatario: "Nessun servizio di notifica trovato in Home Assistant.",
	conPulsanti: "con pulsanti",
	soloTesto: "solo testo",
	attivo: "Attivo",
	solleciti: "Solleciti",
	sollecitaSeNonConfermo: "Sollecita se non confermo",
	sollecitiAiuto: "Ripete il promemoria finché qualcuno non tocca «Esposto ✓», e aggiunge il pulsante «Ricordamelo tra 30 minuti». Alla maggior parte delle persone basta la notifica.",
	richiami: "Quante volte",
	ogniMinuti: "Ogni",
	minuti: (e) => `${e} min`,
	vacanze: "Vacanze",
	vacanzeAiuto: "Nelle date indicate i promemoria tacciono; il calendario, i sensori e le card restano.",
	nessunaVacanza: "Nessuna vacanza in programma.",
	aggiungiVacanza: "Aggiungi vacanza",
	dalAl: (e, t) => `dal ${G(e)} al ${G(t)}`,
	piattaformaTitolo: "Piattaforma ecologica",
	piattaformaAiuto: "Gli orari della piattaforma (o isola) ecologica: le card mostrano se è aperta adesso, e un tocco apre gli orari. Nei giorni festivi risulta chiusa, salvo eccezione.",
	piattaformaVuota: "Non hai ancora inserito gli orari della piattaforma ecologica.",
	inserisciOrari: "Inserisci gli orari",
	nomePiattaforma: "Nome",
	nomePiattaformaAiuto: "Come la chiamate: Piattaforma ecologica, Isola ecologica, Ecocentro…",
	notaPiattaforma: "Nota (facoltativa)",
	notaPiattaformaAiuto: "Indirizzo, cosa serve per entrare, cosa si porta…",
	periodi: "Periodi",
	periodiAiuto: "Fino a quattro periodi con le date e l'anno, per esempio l'orario invernale e quello estivo. Fuori da ogni periodo l'orario non è indicato.",
	aggiungiPeriodo: "Aggiungi un periodo",
	togliPeriodo: "Togli il periodo",
	chiusa: "Chiusa",
	aggiungiFascia: "Aggiungi una fascia oraria",
	togliFascia: "Togli la fascia",
	eccezioniPiattaforma: "Giorni con un orario diverso",
	eccezioniPiattaformaAiuto: "Una chiusura straordinaria, o un'apertura in un giorno festivo.",
	aggiungiEccezionePiattaforma: "Aggiungi un giorno",
	aperta: "Aperta",
	togliPiattaforma: "Togli la piattaforma",
	periodoDalAl: (e, t) => `Periodo dal ${e} al ${t}`,
	piattaformaDaTogliere: "Gli orari della piattaforma verranno tolti quando salvi. Annulla per tenerli.",
	togliPiattaformaAvviso: "Salvando, gli orari della piattaforma ecologica spariscono dalle card, e con loro il suo sensore.",
	modificheNonSalvate: "Hai modifiche non salvate in questa pagina. Lasciarle?",
	restaQui: "Resta qui",
	lascia: "Lascia le modifiche",
	eliminatoNelFrattempo: "Quello che stavi modificando è stato eliminato nel frattempo, da un'altra finestra o da un altro dispositivo.",
	fileCambiato: "Il file è cambiato da quando l'hai scelto: sceglilo di nuovo.",
	orariDa: "dalle",
	orariA: "alle",
	card: {
		titolo: "Raccolta",
		nonDisponibile: "Il calendario della raccolta non è disponibile. Controlla Riparazioni in Impostazioni.",
		staseraFuori: "Stasera fuori",
		daEsporreOra: "Da esporre ora",
		oggi: "Oggi",
		domani: "Domani",
		prossimo: "Prossimo ritiro",
		entroLe: (e, t) => `entro le ${e}${t ? "" : " di domani"}`,
		dalle: (e, t) => `da mettere fuori ${t} dalle ${e}`,
		stasera: "stasera",
		oggiMinuscolo: "oggi",
		esposto: "Esposto ✓",
		espostoAlle: (e, t) => `Esposto alle ${e}${t ? ` da ${t}` : ""}`,
		annullaConferma: "Annulla",
		nessunRitiro: "Nessun ritiro",
		nessunRitiroSettimana: "Nessun ritiro questa settimana",
		tuttoTranquillo: "Niente da esporre nei prossimi giorni",
		sospesi: "Promemoria sospesi",
		sospesiFino: (e) => `Promemoria sospesi fino al ${e}`,
		daVerificare: "Da verificare: il calendario è scaduto",
		spostatoDal: (e) => `spostato dal ${e}`,
		festivo: (e) => `festivo: ${e}`,
		settimana: "Questa settimana",
		calendario: "Calendario",
		mesePrecedente: "Mese precedente",
		meseSuccessivo: "Mese successivo",
		confermato: "confermato",
		nomeOggi: "Raccolta: oggi e domani",
		nomeSettimana: "Raccolta: settimana",
		nomeMese: "Raccolta: mese",
		descrizioneOggi: "Cosa esporre stasera, con il pulsante Esposto.",
		descrizioneSettimana: "I ritiri dei prossimi sette giorni.",
		descrizioneMese: "Il calendario del mese, con il dettaglio del giorno.",
		campoTitolo: "Titolo",
		campoInizio: "La settimana inizia",
		inizioOggi: "Da oggi",
		inizioLunedi: "Dal lunedì",
		cosaVaDove: "Cosa va dove",
		nessunaNotaCard: "Nessuna nota: si aggiunge nel pannello, in Tipologie.",
		apriNote: "Cosa va in ogni bidone",
		campoPiattaforma: "Mostra la piattaforma ecologica",
		piattaformaAperta: (e) => `Aperta fino alle ${e}`,
		piattaformaChiusa: "Chiusa",
		piattaformaApre: (e) => `Chiusa · apre ${e}`,
		piattaformaNonIndicato: "Orario non indicato",
		alle: (e) => `alle ${e}`,
		domaniAlle: (e) => `domani alle ${e}`,
		giornoAlle: (e, t) => `${e} alle ${t}`,
		oggiMaiuscolo: "Oggi",
		chiusaFestivo: (e) => `Chiusa · ${e}`,
		orarioNonIndicato: "Orario non indicato",
		piuAvanti: "Più avanti"
	},
	profiloRimosso: (e) => e === 1 ? "Un promemoria riguardava solo questa tipologia e verrà eliminato." : `${e} promemoria riguardavano solo questa tipologia e verranno eliminati.`
};
function G(e) {
	let t = F(e);
	return `${t.getDate()} ${U[t.getMonth()]} ${t.getFullYear()}`;
}
//#endregion
//#region src/comune/stili.ts
var K = o`
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
    padding: 5px 12px;
    min-height: 32px;
    font-size: 13px;
    border-radius: 8px;
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--rd-primario);
    outline-offset: 2px;
  }
  .bottone.pericolo {
    color: var(--rd-errore);
  }
  .bottone[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`, Le = o`
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
    max-width: 100%;
    background: var(--rd-superficie-2);
    border-radius: 12px;
    padding: 3px;
    gap: 2px;
    flex-wrap: wrap;
  }
  .segmenti button {
    border: 0;
    background: none;
    padding: 8px 12px;
    min-height: 36px;
    border-radius: 9px;
    cursor: pointer;
    font-size: 14px;
    flex: 1 1 auto;
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
  /* I sette giorni della settimana stanno sempre su una riga. */
  .tonde.sette,
  .tonde.otto {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    max-width: 360px;
  }
  .tonde.otto {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    max-width: 400px;
  }
  .tonde.sette button,
  .tonde.otto button {
    min-width: 0;
    padding: 0;
  }
  .riepilogo {
    background: color-mix(in srgb, var(--rd-primario) 10%, transparent);
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 500;
  }
  .riepilogo small {
    display: block;
    color: var(--rd-testo-2);
    font-weight: 400;
    margin-top: 2px;
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
function Re(e) {
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
o`
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
    min-width: 0;
  }
  button.voce {
    width: 100%;
    background: var(--rd-superficie);
    text-align: left;
    cursor: pointer;
    font: inherit;
    flex-wrap: nowrap;
  }
  button.voce:hover {
    background: var(--rd-superficie-2);
  }
  .voce .freccia {
    color: var(--rd-testo-2);
    flex: none;
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
`;
//#endregion
//#region src/comune/chip.ts
var q = (e) => E`<span class="chip" style="background:${e.colore};color:${Re(e.colore)}"
    ><ha-icon .icon=${e.icona}></ha-icon>${e.nome}</span
  >`, ze = document.querySelector("home-assistant") && !customElements.get("home-assistant") ? customElements.whenDefined("home-assistant") : Promise.resolve(), Be = (e) => void ze.then(e);
function J(e, t) {
	Be(() => {
		customElements.get(e) || customElements.define(e, t);
	});
}
//#endregion
//#region src/comune/finestra.ts
var Ve = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
function He() {
	let e = document.activeElement;
	for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
	return e;
}
J("rd-finestra", class extends P {
	constructor(...e) {
		super(...e), this.titolo = "", this.aperta = !1, this.bloccata = !1, this._prima = null, this._giuFuori = !1;
	}
	static {
		this.properties = {
			titolo: {},
			aperta: {
				type: Boolean,
				reflect: !0
			},
			bloccata: {
				type: Boolean,
				reflect: !0
			}
		};
	}
	static {
		this.styles = [K, o`
      :host {
        display: contents;
      }
      dialog {
        /* Il pannello nasconde le finestre delle pagine mentre "Prima di salvare" è
           aperta sopra di loro: una sola finestra, un solo paio di pulsanti. */
        visibility: var(--rd-visibilita-finestre, visible);
        border: 0;
        padding: 0;
        margin: auto;
        color: var(--rd-testo);
        background: var(--rd-superficie);
        border-radius: 20px;
        width: min(560px, calc(100% - 32px));
        max-width: none;
        max-height: calc(100dvh - 32px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        overscroll-behavior: contain;
      }
      dialog:focus {
        outline: none;
      }
      dialog[open] {
        display: flex;
        flex-direction: column;
      }
      dialog::backdrop {
        background: rgba(10, 14, 20, 0.5);
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
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        flex: none;
      }
      header button svg {
        display: block;
        width: 22px;
        height: 22px;
        fill: currentColor;
      }
      header button[disabled] {
        opacity: 0.4;
        cursor: default;
      }
      .contenuto {
        padding: 8px 20px 16px;
        overflow-y: auto;
        overscroll-behavior: contain;
        flex: 1 1 auto;
      }
      footer {
        padding: 12px 20px 16px;
        border-top: 1px solid var(--rd-bordo);
      }
      footer:not(:has(*)) {
        display: none;
      }
      @media (max-width: 600px) {
        dialog {
          margin: auto 0 0;
          width: 100%;
          border-radius: 20px 20px 0 0;
          max-height: 92dvh;
        }
        footer,
        .contenuto:last-child {
          /* La barra in basso dei telefoni (iPhone, app Companion) non copre i pulsanti. */
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        }
      }
    `];
	}
	get _dialogo() {
		return this.renderRoot.querySelector("dialog");
	}
	updated() {
		let e = this._dialogo;
		e && (this.aperta && !e.open && this.isConnected ? (this._prima = He(), e.showModal(), e.focus()) : !this.aperta && e.open && (e.close(), this._prima?.focus?.()));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._prima?.isConnected && this._prima.focus();
	}
	_chiudi() {
		this.bloccata || this.dispatchEvent(new CustomEvent("chiudi"));
	}
	_annulla(e) {
		e.preventDefault(), this._chiudi();
	}
	_tasto(e) {
		e.key === "Escape" && e.stopPropagation();
	}
	render() {
		return E`<dialog
      tabindex="-1"
      aria-label=${this.titolo}
      @cancel=${this._annulla}
      @keydown=${this._tasto}
      @pointerdown=${(e) => this._giuFuori = e.target === this._dialogo}
      @click=${(e) => {
			e.target === this._dialogo && this._giuFuori && this._chiudi(), this._giuFuori = !1;
		}}
    >
      <header>
        <h3>${this.titolo}</h3>
        <button aria-label=${W.chiudi} ?disabled=${this.bloccata} @click=${this._chiudi}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${Ve} /></svg>
        </button>
      </header>
      <div class="contenuto"><slot></slot></div>
      <footer><slot name="azioni"></slot></footer>
    </dialog>`;
	}
});
//#endregion
//#region src/comune/simbolo.ts
var Ue = be`<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%">
  <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 13.5 V9 H38 V13.5"/><path d="M10 14.5 H54"/><path d="M13.5 20 L17 57 H47 L50.5 20 Z"/>
    <polyline points="21,34 32,25 43,34" opacity="0.5"/><polyline points="25.5,40.5 32,35 38.5,40.5"/>
  </g>
  <rect x="28.5" y="46.5" width="7" height="7" fill="#F0A835"/><circle cx="32" cy="46.5" r="3.5" fill="#F0A835"/>
</svg>`;
//#endregion
//#region src/comune/piattaforma.ts
function We(e) {
	let t = [];
	for (let [n, r] of [...e].sort((e, t) => Date.parse(e[0]) - Date.parse(t[0]))) {
		if (Date.parse(r) <= Date.parse(n)) continue;
		let e = t.at(-1);
		e && Date.parse(n) <= Date.parse(e[1]) ? Date.parse(r) > Date.parse(e[1]) && (e[1] = r) : t.push([n, r]);
	}
	return t;
}
function Ge(e, t) {
	let n = t.getTime(), r = e.giorni[0];
	if (!r || r.fasce === null) return { aperta: null };
	for (let [e, t] of We(r.fasce)) if (Date.parse(e) <= n && n < Date.parse(t)) return {
		aperta: !0,
		chiude: t
	};
	for (let t of e.giorni) {
		if (t.fasce === null) break;
		for (let [e] of We(t.fasce)) if (Date.parse(e) > n) return {
			aperta: !1,
			apre: e
		};
	}
	return { aperta: !1 };
}
var Y = (e) => e.slice(11, 16), Ke = (e) => We(e.fasce ?? []).map(([e, t]) => `${Y(e)}–${Y(t)}`).join(" · "), X = "foyer_raccolta_differenziata", Z = class extends P {
	constructor(...e) {
		super(...e), this._errore = !1, this._connessa = !1, this._connessioneAscoltata = !1, this._riconnessa = () => {
			this._disiscrivi?.then((e) => e()).catch(() => void 0), this._disiscrivi = void 0, this._connessa && this.hass && this._avvia();
		}, this._richiesta = 0;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_dati: { state: !0 },
			_errore: { state: !0 },
			_finestra: { state: !0 }
		};
	}
	setConfig(e) {
		let t = this._config;
		this._config = { ...e }, t && this._dati && this.hass && t.inizio !== e.inizio && this.carica(this._dati.oggi);
	}
	_oggiHa() {
		let e = this.hass?.config?.time_zone;
		if (!e) return I(/* @__PURE__ */ new Date());
		try {
			return new Intl.DateTimeFormat("en-CA", {
				timeZone: e,
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			}).format(/* @__PURE__ */ new Date());
		} catch {
			return I(/* @__PURE__ */ new Date());
		}
	}
	connectedCallback() {
		super.connectedCallback(), this._connessa = !0, this._minuto = window.setInterval(() => {
			!this._disiscrivi && this.hass ? this._avvia() : !this._dati || this._errore || this._oggiHa() !== this._dati.oggi ? this.carica() : this.requestUpdate();
		}, 6e4), this.hass && this._avvia();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._connessa = !1, clearInterval(this._minuto), this._disiscrivi?.then((e) => e()).catch(() => void 0), this._disiscrivi = void 0, this.hass?.connection.removeEventListener?.("ready", this._riconnessa), this._connessioneAscoltata = !1, this._finestra = void 0;
	}
	willUpdate(e) {
		e.has("hass") && this.hass && this._connessa && !this._disiscrivi && this._avvia();
	}
	_avvia() {
		this._connessioneAscoltata ||= (this.hass.connection.addEventListener?.("ready", this._riconnessa), !0);
		let e = this.hass.connection.subscribeMessage(() => void this.carica(), { type: `${X}/iscriviti` }).catch(() => (this._disiscrivi === e && (this._disiscrivi = void 0), this._errore = !0, () => void 0));
		this._disiscrivi = e, this.carica();
	}
	async carica(e) {
		let t = ++this._richiesta;
		try {
			let n = e ?? I(/* @__PURE__ */ new Date()), [r, i] = this.intervallo(n), a = await this.hass.callWS({
				type: `${X}/ritiri`,
				dal: r,
				al: i
			});
			if (t !== this._richiesta) return;
			if (a.oggi !== n) return this.carica(a.oggi);
			this._dati = a, this._errore = !a.disponibile;
		} catch {
			t === this._richiesta && (this._errore = !0);
		}
	}
	tipologia(e) {
		return this._dati?.tipologie.find((t) => t.id === e);
	}
	confermato(e) {
		return this._dati?.conferme.find((t) => t.data === e.data && t.tipologia === e.tipologia);
	}
	async conferma(e, t) {
		await this.hass.callWS({
			type: `${X}/conferma`,
			data: e,
			tipologie: t
		}).catch(() => this.carica());
	}
	async annulla(e, t) {
		for (let n of t) await this.hass.callWS({
			type: `${X}/annulla_conferma`,
			data: e,
			tipologia: n
		}).catch(() => void 0);
		await this.carica();
	}
	intestazione(e, t) {
		return E`<div class="intestazione">
      <span class="simbolo">${Ue}</span><b>${this._config?.titolo || e}</b>
      ${t ? E`<span class="sotto">${t}</span>` : ""}
      <span class="azioni ${t ? "" : "spinta"}">${this._pillola()}${this._punto()}</span>
    </div>`;
	}
	_punto() {
		return this._dati?.tipologie.some((e) => e.note?.trim()) ? E`<button class="punto" aria-label=${W.card.apriNote} title=${W.card.apriNote}
      @click=${() => this._finestra = { tipo: "note" }}><ha-icon icon="mdi:help-circle-outline"></ha-icon></button>` : O;
	}
	chipNota(e) {
		return e.note?.trim() ? E`<button class="chip-nota" aria-label=${`${e.nome}: ${W.card.cosaVaDove}`}
      @click=${(t) => {
			t.stopPropagation(), this._finestra = {
				tipo: "note",
				tipologia: e.id
			};
		}}>${q(e)}</button>` : q(e);
	}
	_finestraNote(e) {
		return E`<div class="elenco-note">
      ${(this._dati?.tipologie ?? []).filter((t) => !e || t.id === e).map((e) => E`<div class="nota-riga">${q(e)}<span>${e.note?.trim() || W.card.nessunaNotaCard}</span></div>`)}
    </div>`;
	}
	get _piattaforma() {
		return this._config?.piattaforma === !1 ? null : this._dati?.piattaforma ?? null;
	}
	_quandoApre(e) {
		let t = this._dati.oggi, n = e.slice(0, 10);
		if (n === t) return W.card.alle(Y(e));
		if (n === L(t, 1)) return W.card.domaniAlle(Y(e));
		let r = H[R(n)], i = n > L(t, 6);
		return W.card.giornoAlle(i ? `${r} ${F(n).getDate()}` : r, Y(e));
	}
	_pillola() {
		let e = this._piattaforma;
		if (!e) return O;
		let t = Ge(e, /* @__PURE__ */ new Date()), [n, r] = t.aperta === null ? ["ignota", W.card.piattaformaNonIndicato] : t.aperta ? ["aperta", W.card.piattaformaAperta(Y(t.chiude))] : ["chiusa", t.apre ? W.card.piattaformaApre(this._quandoApre(t.apre)) : W.card.piattaformaChiusa];
		return E`<button class="pillola ${n}" title=${`${e.nome}: ${r}`} aria-label=${`${e.nome}: ${r}`}
      @click=${() => this._finestra = { tipo: "piattaforma" }}>
      <ha-icon icon="mdi:recycle"></ha-icon><span>${r}</span>
    </button>`;
	}
	_finestraPiattaforma(e) {
		let t = e.giorni.slice(0, 7), n = e.giorni.slice(7).filter((e) => e.motivo === "eccezione" || e.motivo === "festivo"), r = (e) => e.fasce === null ? W.card.orarioNonIndicato : e.fasce.length ? Ke(e) : e.festivo ? W.card.chiusaFestivo(e.festivo) : W.card.piattaformaChiusa, i = (e) => e === this._dati.oggi ? W.card.oggiMaiuscolo : `${Fe[R(e)]} ${F(e).getDate()}`;
		return E`<div class="piattaforma">
      ${this._pillola()}
      ${e.nota ? E`<p class="nota-p">${e.nota}</p>` : O}
      <div class="orari">
        ${t.map((e) => E`<div class="orario ${e.data === this._dati.oggi ? "oggi" : ""}">
            <b>${i(e.data)}</b><span>${r(e)}${e.nota ? E`<small>${e.nota}</small>` : O}</span>
          </div>`)}
      </div>
      ${n.length ? E`<div class="avanti"><b>${W.card.piuAvanti}</b>
            ${n.map((e) => E`<div class="orario"><b>${i(e.data)}</b><span>${r(e)}${e.nota ? E`<small>${e.nota}</small>` : O}</span></div>`)}
          </div>` : O}
    </div>`;
	}
	_chiudi(e) {
		return E`<div class="piede" slot="azioni"><button class="bottone" @click=${e}>${W.chiudi}</button></div>`;
	}
	finestre() {
		let e = this._finestra;
		if (!e) return O;
		if (e.tipo === "piattaforma" && !this._piattaforma) return queueMicrotask(() => this._finestra = void 0), O;
		let t = () => this._finestra = void 0;
		if (e.tipo === "piattaforma") {
			let e = this._piattaforma;
			return e ? E`<rd-finestra aperta titolo=${e.nome} @chiudi=${t}>
        ${this._finestraPiattaforma(e)}${this._chiudi(t)}
      </rd-finestra>` : O;
		}
		return E`<rd-finestra aperta titolo=${e.tipologia ? this.tipologia(e.tipologia)?.nome ?? W.card.cosaVaDove : W.card.cosaVaDove} @chiudi=${t}>
      ${this._finestraNote(e.tipologia)}${this._chiudi(t)}
    </rd-finestra>`;
	}
	banner() {
		let e = this._dati?.sospeso;
		return e ? e.fino_al ? E`<div class="banner"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${W.card.sospesiFino(Q(e.fino_al))}</div>` : e.manuale ? E`<div class="banner"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${W.card.sospesi}</div>` : "" : "";
	}
	nonDisponibile() {
		return E`<ha-card><div class="vuota">${W.card.nonDisponibile}</div></ha-card>`;
	}
	static {
		this.stiliComuni = [K, o`
      ha-card {
        overflow: hidden;
        height: 100%;
      }
      .intestazione {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px 6px;
      }
      .simbolo {
        width: 26px;
        height: 26px;
        flex: none;
      }
      .intestazione b {
        font-size: 16px;
        font-weight: 600;
      }
      .intestazione {
        flex-wrap: wrap;
      }
      .intestazione .sotto {
        margin-left: auto;
        color: var(--rd-testo-2);
        font-size: 13px;
        text-align: right;
      }
      .azioni {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .azioni.spinta {
        margin-left: auto;
      }
      .azioni:empty {
        display: none;
      }
      .punto {
        border: 0;
        background: none;
        color: var(--rd-testo-2);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        --mdc-icon-size: 20px;
      }
      .punto:hover {
        background: var(--rd-superficie-2);
        color: var(--rd-testo);
      }
      .pillola {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border: 0;
        cursor: pointer;
        border-radius: 999px;
        padding: 4px 10px 4px 7px;
        font: inherit;
        font-size: 12.5px;
        font-weight: 500;
        --mdc-icon-size: 16px;
        white-space: nowrap;
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        max-width: 100%;
        min-width: 0;
      }
      .pillola span {
        /* In una card stretta il testo finisce con i puntini, non tagliato di netto. */
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      .azioni {
        min-width: 0;
        max-width: 100%;
      }
      .pillola.aperta {
        background: color-mix(in srgb, var(--rd-ok) 16%, transparent);
        color: var(--rd-ok);
      }
      .chip-nota {
        border: 0;
        padding: 0;
        background: none;
        cursor: pointer;
        font: inherit;
        border-radius: 999px;
      }
      .chip-nota .chip::after {
        content: "?";
        font-size: 10px;
        font-weight: 700;
        margin-left: 4px;
        opacity: 0.75;
      }
      .elenco-note {
        display: grid;
        gap: 10px;
      }
      .nota-riga {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: start;
        font-size: 14px;
      }
      .nota-riga > span:last-child {
        padding-top: 3px;
      }
      .piattaforma .pillola {
        font-size: 14px;
        padding: 6px 12px 6px 9px;
        cursor: default;
        margin-bottom: 8px;
      }
      .nota-p {
        margin: 0 0 8px;
        color: var(--rd-testo-2);
        font-size: 13.5px;
      }
      .orario {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: 8px;
        padding: 7px 0;
        border-top: 1px solid var(--rd-bordo);
        font-size: 14px;
      }
      .orario.oggi b {
        color: var(--rd-primario);
      }
      .orario small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 12.5px;
      }
      .avanti {
        margin-top: 12px;
      }
      .piede {
        display: flex;
        justify-content: flex-end;
      }
      .avanti > b {
        display: block;
        font-size: 13px;
        color: var(--rd-testo-2);
        margin-bottom: 2px;
      }
      .banner {
        margin: 0 12px 12px;
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 13px;
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        display: flex;
        gap: 8px;
        align-items: center;
        --mdc-icon-size: 18px;
      }
      .banner.avviso {
        background: color-mix(in srgb, var(--rd-avviso) 14%, transparent);
        color: var(--rd-avviso);
      }
      .vuota {
        padding: 20px 16px;
        color: var(--rd-testo-2);
        text-align: center;
      }
    `];
	}
}, Q = (e) => {
	let [, t, n] = e.split("-").map(Number);
	return `${n}/${String(t).padStart(2, "0")}`;
}, qe = Re;
function Je(e, t, n) {
	Be(() => Ye(e, t, n));
}
function Ye(e, t, n) {
	let r = window;
	r.customCards = r.customCards ?? [], r.customCards.some((t) => t.type === e) || r.customCards.push({
		type: e,
		name: t,
		description: n,
		preview: !0,
		documentationURL: "https://github.com/foyer-labs/Foyer-Raccolta-Differenziata"
	});
}
J("foyer-raccolta-editor", class extends P {
	static {
		this.properties = { _config: { state: !0 } };
	}
	setConfig(e) {
		this._config = { ...e };
	}
	_cambia(e) {
		let t = {
			...this._config,
			...e
		};
		for (let [e, n] of Object.entries(t)) (n === "" || n === void 0) && delete t[e];
		this._config = t, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this._config) return O;
		let e = this._config.type.includes("settimana");
		return E`<div class="modulo">
      <div class="campo">
        <label for="titolo">${W.card.campoTitolo}</label>
        <input id="titolo" .value=${this._config.titolo ?? ""} @input=${(e) => this._cambia({ titolo: e.target.value })} />
      </div>
      <label class="spunta">
        <input type="checkbox" .checked=${this._config.piattaforma !== !1}
          @change=${(e) => this._cambia({ piattaforma: e.target.checked ? void 0 : !1 })} />
        ${W.card.campoPiattaforma}
      </label>
      ${e ? E`<div class="campo">
            <span class="etichetta">${W.card.campoInizio}</span>
            <div class="segmenti">
              ${["oggi", "lunedi"].map((e) => E`<button class=${(this._config.inizio ?? "oggi") === e ? "attivo" : ""} @click=${() => this._cambia({ inizio: e })}>
                  ${e === "oggi" ? W.card.inizioOggi : W.card.inizioLunedi}
                </button>`)}
            </div>
          </div>` : O}
    </div>`;
	}
	static {
		this.styles = [
			K,
			Le,
			o`
      :host {
        display: block;
      }
      .spunta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0 12px;
        font-size: 14px;
      }
    `
		];
	}
});
//#endregion
//#region src/card/oggi.ts
var Xe = "foyer-raccolta-oggi-card";
J(Xe, class extends Z {
	static getConfigElement() {
		return document.createElement("foyer-raccolta-editor");
	}
	static getStubConfig() {
		return { type: `custom:${Xe}` };
	}
	getCardSize() {
		return 4;
	}
	intervallo(e) {
		return [e, L(e, 8)];
	}
	_fuoco() {
		let e = this._dati?.ritiri ?? [], t = /* @__PURE__ */ new Date(), n = e.filter((e) => new Date(e.inizio_esposizione) <= t && t < new Date(e.fine_esposizione));
		if (n.length) {
			let e = n[0].data, t = n.filter((t) => t.data === e), r = t.filter((e) => !this.confermato(e));
			return {
				ritiri: r.length ? r : t,
				stato: r.length ? "da_esporre" : "esposto"
			};
		}
		let r = e.filter((e) => new Date(e.fine_esposizione) > t);
		if (!r.length) return;
		let i = r.filter((e) => e.data === r[0].data), a = i.filter((e) => !this.confermato(e));
		return {
			ritiri: a.length ? a : i,
			stato: a.length ? "prossimo" : "esposto"
		};
	}
	_giornoInizio(e) {
		let t = e.slice(0, 10), n = z(this._dati.oggi, t);
		return n <= 0 ? Number(e.slice(11, 13)) >= 17 ? W.card.stasera : W.card.oggiMinuscolo : n === 1 ? W.card.domani.toLowerCase() : H[R(t)];
	}
	_quando(e, t) {
		let n = z(this._dati.oggi, e);
		return t === "da_esporre" ? n <= 0 ? W.card.daEsporreOra : W.card.staseraFuori : n === 0 ? W.card.oggi : n === 1 ? W.card.domani : `${H[R(e)]} ${F(e).getDate()}`;
	}
	_eroe() {
		let e = this._fuoco();
		if (!e) return E`<div class="eroe calmo"><div class="cosa piccola">${W.card.tuttoTranquillo}</div></div>`;
		let { ritiri: t, stato: n } = e, r = t.map((e) => this.tipologia(e.tipologia)).filter((e) => e !== void 0), i = r.map((e) => e.colore), a = i.length > 1 ? `linear-gradient(135deg, ${i[0]} 0%, ${i[i.length - 1]} 100%)` : i[0] ?? "var(--rd-primario)", o = qe(i[0] ?? "#03a9f4"), s = t[0].data, c = z(this._dati.oggi, s), l = V(t[0].fine_esposizione), u = V(t[0].inizio_esposizione), d = this.confermato(t[0]), f = t.map((e) => e.tipologia);
		return E`<div class="eroe ${n} ${o === "#ffffff" ? "chiaro" : ""}" style="background:${a};color:${o}">
      <ha-icon class="sfondo-icona" .icon=${r[0]?.icona ?? "mdi:trash-can-outline"}></ha-icon>
      <div class="quando">${this._quando(s, n)}</div>
      <div class="cosa">${r.map((e) => e.nome).join(" e ")}</div>
      ${n === "esposto" ? E`<div class="fino"><ha-icon icon="mdi:check-circle"></ha-icon>${W.card.espostoAlle(V(d?.istante ?? ""), d?.utente)}</div>
            <button class="conferma fatto" @click=${() => this.annulla(s, f)}>${W.card.annullaConferma}</button>` : E`<div class="fino">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              ${n === "da_esporre" ? W.card.entroLe(l, c <= 0) : W.card.dalle(u, this._giornoInizio(t[0].inizio_esposizione))}
            </div>
            ${c <= 1 ? E`<button class="conferma" @click=${() => this.conferma(s, f)}>${W.card.esposto}</button>` : O}`}
      ${t.some((e) => e.da_verificare) ? E`<div class="nota">${W.card.daVerificare}</div>` : O}
    </div>`;
	}
	_giorno(e, t) {
		let n = (this._dati?.ritiri ?? []).filter((e) => e.data === t);
		return E`<div>
      <small>${e}</small>
      <div class="chips">
        ${n.length ? n.map((e) => {
			let t = this.tipologia(e.tipologia);
			return E`<span class="con-segno">${t ? this.chipNota(t) : e.tipologia}${this.confermato(e) ? E`<ha-icon class="spunta" icon="mdi:check-circle" title=${W.card.confermato}></ha-icon>` : O}</span>`;
		}) : E`<span class="vuoto">${W.card.nessunRitiro}</span>`}
      </div>
    </div>`;
	}
	render() {
		if (!this._config) return O;
		if (this._errore) return this.nonDisponibile();
		if (!this._dati) return E`<ha-card><div class="vuota">…</div></ha-card>`;
		let e = this._dati.oggi, t = F(e);
		return E`<ha-card>
      ${this.intestazione(W.card.titolo, `${H[R(e)]} ${t.getDate()} ${U[t.getMonth()]}`)}
      ${this._eroe()}
      <div class="fila">${this._giorno(W.card.oggi, e)} ${this._giorno(W.card.domani, L(e, 1))}</div>
      ${this.banner()}
    ${this.finestre()}
    </ha-card>`;
	}
	static {
		this.styles = [...Z.stiliComuni, o`
      .eroe {
        margin: 8px 12px 12px;
        border-radius: 16px;
        padding: 16px;
        position: relative;
        overflow: hidden;
        min-height: 96px;
      }
      .eroe.calmo {
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        display: grid;
        place-items: center;
        min-height: 72px;
      }
      .eroe.chiaro .quando,
      .eroe.chiaro .cosa,
      .eroe.chiaro .fino {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.28);
      }
      .eroe.prossimo {
        filter: saturate(0.85);
      }
      .sfondo-icona {
        position: absolute;
        right: -14px;
        top: -12px;
        --mdc-icon-size: 128px;
        opacity: 0.16;
        pointer-events: none;
      }
      .quando {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.92;
      }
      .cosa {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.15;
        margin: 4px 0 10px;
        position: relative;
      }
      .cosa.piccola {
        font-size: 15px;
        font-weight: 500;
        margin: 0;
      }
      .fino {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.95;
        --mdc-icon-size: 18px;
      }
      .conferma {
        margin-top: 14px;
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 12px;
        font-weight: 700;
        font-size: 15px;
        background: rgba(255, 255, 255, 0.94);
        color: #1b1f24;
        cursor: pointer;
        position: relative;
        transition: transform 0.1s;
      }
      .conferma:active {
        transform: scale(0.98);
      }
      .conferma.fatto {
        background: rgba(255, 255, 255, 0.22);
        color: inherit;
        font-weight: 600;
        padding: 8px;
      }
      .nota {
        margin-top: 10px;
        font-size: 12.5px;
        opacity: 0.9;
      }
      .fila {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: var(--rd-bordo);
        border-top: 1px solid var(--rd-bordo);
        margin-bottom: 12px;
      }
      .fila > div {
        background: var(--rd-superficie);
        padding: 12px 16px;
      }
      .fila small {
        color: var(--rd-testo-2);
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
      }
      .chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .con-segno {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .spunta {
        --mdc-icon-size: 16px;
        color: var(--rd-ok);
      }
      .vuoto {
        color: var(--rd-testo-2);
        font-size: 14px;
      }
    `];
	}
}), Je(Xe, W.card.nomeOggi, W.card.descrizioneOggi);
//#endregion
//#region src/card/settimana.ts
var Ze = "foyer-raccolta-settimana-card";
J(Ze, class extends Z {
	static {
		this.properties = {
			...Z.properties,
			_scelto: { state: !0 }
		};
	}
	static getConfigElement() {
		return document.createElement("foyer-raccolta-editor");
	}
	static getStubConfig() {
		return {
			type: `custom:${Ze}`,
			inizio: "oggi"
		};
	}
	getCardSize() {
		return 3;
	}
	intervallo(e) {
		let t = this._config?.inizio === "lunedi" ? Ne(e) : e;
		return [t, L(t, 6)];
	}
	render() {
		if (!this._config) return O;
		if (this._errore) return this.nonDisponibile();
		if (!this._dati) return E`<ha-card><div class="vuota">…</div></ha-card>`;
		let e = this._dati.oggi, [t, n] = this.intervallo(e), r = Array.from({ length: 7 }, (e, n) => L(t, n)), i = this._dati.ritiri, a = [...new Set(i.map((e) => e.tipologia))].map((e) => this.tipologia(e)).filter((e) => e !== void 0), o = this._scelto && r.includes(this._scelto) ? this._scelto : void 0, s = o ? i.filter((e) => e.data === o) : [];
		return E`<ha-card>
      ${this.intestazione(W.card.settimana, `${Q(t)} – ${Q(n)}`)}
      <div class="settimana" role="group" aria-label=${W.card.settimana}>
        ${r.map((t) => {
			let n = i.filter((e) => e.data === t);
			return E`<button
            aria-pressed=${t === o}
            class="g ${t === e ? "oggi" : ""} ${t < e ? "passato" : ""} ${t === o ? "scelto" : ""}"
            aria-label=${`${H[R(t)]} ${F(t).getDate()}: ${n.map((e) => this.tipologia(e.tipologia)?.nome).join(", ") || W.card.nessunRitiro}`}
            @click=${() => this._scelto = t === o ? void 0 : t}
          >
            <span class="nome-g">${t === e ? W.card.oggi : Fe[R(t)]}</span>
            <span class="num">${F(t).getDate()}</span>
            ${n.map((e) => {
				let t = this.tipologia(e.tipologia), n = t?.colore ?? "#888888";
				return E`<span class="ico-t ${this.confermato(e) ? "fatto" : ""}" style="background:${n};color:${qe(n)}">
                <ha-icon .icon=${t?.icona ?? "mdi:trash-can-outline"}></ha-icon>
                ${e.spostato_dal ? E`<span class="segno">↪</span>` : O}
              </span>`;
			})}
          </button>`;
		})}
      </div>
      ${o ? E`<div class="dettaglio">
            <small>${H[R(o)]} ${F(o).getDate()}</small>
            ${s.length ? s.map((e) => {
			let t = this.tipologia(e.tipologia);
			return E`<div class="riga">
                    ${t ? this.chipNota(t) : e.tipologia}
                    <span class="note">
                      ${[t?.note, e.spostato_dal ? W.card.spostatoDal(Q(e.spostato_dal)) : ""].filter(Boolean).join(" · ")}
                    </span>
                  </div>`;
		}) : E`<span class="vuoto">${W.card.nessunRitiro}</span>`}
          </div>` : a.length ? E`<div class="legenda">${a.map((e) => E`<span><i class="pallino" style="background:${e.colore}"></i>${e.nome}</span>`)}</div>` : E`<div class="vuota">${W.card.nessunRitiroSettimana}</div>`}
      ${this.banner()}
    ${this.finestre()}
    </ha-card>`;
	}
	static {
		this.styles = [...Z.stiliComuni, o`
      .settimana {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
        padding: 8px 12px 12px;
      }
      .g {
        border: 0;
        border-radius: 12px;
        padding: 8px 2px 10px;
        background: var(--rd-superficie-2);
        min-height: 112px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: transform 0.12s;
      }
      .g:hover {
        transform: translateY(-1px);
      }
      .g.oggi {
        outline: 2px solid var(--rd-primario);
        background: color-mix(in srgb, var(--rd-primario) 12%, var(--rd-superficie));
      }
      .g.scelto {
        box-shadow: 0 0 0 2px var(--rd-testo-2) inset;
      }
      .g.passato {
        opacity: 0.5;
      }
      .nome-g {
        font-size: 11px;
        color: var(--rd-testo-2);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .num {
        font-size: 18px;
        font-weight: 700;
      }
      .ico-t {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        --mdc-icon-size: 17px;
      }
      .ico-t.fatto::after {
        content: "✓";
        position: absolute;
        right: -4px;
        bottom: -4px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--rd-ok);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        display: grid;
        place-items: center;
        box-shadow: 0 0 0 2px var(--rd-superficie);
      }
      .segno {
        position: absolute;
        left: -5px;
        top: -5px;
        font-size: 11px;
        background: var(--rd-superficie);
        color: var(--rd-testo);
        border-radius: 50%;
        width: 15px;
        height: 15px;
        display: grid;
        place-items: center;
      }
      .legenda {
        display: flex;
        gap: 8px 14px;
        flex-wrap: wrap;
        padding: 0 16px 14px;
        font-size: 12.5px;
        color: var(--rd-testo-2);
      }
      .legenda span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .dettaglio {
        border-top: 1px solid var(--rd-bordo);
        padding: 10px 16px 14px;
        display: grid;
        gap: 8px;
      }
      .dettaglio small {
        color: var(--rd-testo-2);
        font-weight: 600;
      }
      .dettaglio small::first-letter {
        text-transform: uppercase;
      }
      .riga {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .note,
      .vuoto {
        color: var(--rd-testo-2);
        font-size: 13px;
      }
    `];
	}
}), Je(Ze, W.card.nomeSettimana, W.card.descrizioneSettimana);
//#endregion
//#region src/card/mese.ts
var $ = "foyer-raccolta-mese-card";
J($, class extends Z {
	static {
		this.properties = {
			...Z.properties,
			_mese: { state: !0 },
			_scelto: { state: !0 }
		};
	}
	static getConfigElement() {
		return document.createElement("foyer-raccolta-editor");
	}
	static getStubConfig() {
		return { type: `custom:${$}` };
	}
	getCardSize() {
		return 7;
	}
	intervallo(e) {
		let t = this._mese ?? B(e), n = L(t, -R(t));
		return [n, L(n, 41)];
	}
	_sposta(e) {
		let t = F(this._mese ?? B(this._dati.oggi));
		t.setMonth(t.getMonth() + e), this._mese = I(t), this._scelto = void 0, this.carica(this._dati.oggi);
	}
	render() {
		if (!this._config) return O;
		if (this._errore) return this.nonDisponibile();
		if (!this._dati) return E`<ha-card><div class="vuota">…</div></ha-card>`;
		let e = this._dati.oggi, t = this._mese ?? B(e), [n] = this.intervallo(e), r = F(t).getFullYear(), i = F(t).getMonth(), a = Math.ceil((R(t) + Pe(r, i + 1)) / 7) * 7, o = this._scelto ?? (t === B(e) ? e : t), s = this._dati.ritiri.filter((e) => e.data === o), c = [...new Set(this._dati.ritiri.map((e) => e.tipologia))].map((e) => this.tipologia(e)).filter((e) => e !== void 0);
		return E`<ha-card>
      ${this.intestazione(W.card.calendario)}
      <div class="testa-mese">
        <button aria-label=${W.card.mesePrecedente} @click=${() => this._sposta(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <b>${U[i]} ${r}</b>
        <button aria-label=${W.card.meseSuccessivo} @click=${() => this._sposta(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
      <div class="mese">
        ${Ie.map((e) => E`<div class="intest">${e}</div>`)}
        ${Array.from({ length: a }, (t, r) => {
			let a = L(n, r), s = this._dati.ritiri.filter((e) => e.data === a);
			return E`<button
            class="c ${F(a).getMonth() === i ? "" : "fuori"} ${a < e ? "passato" : ""} ${a === e ? "oggi" : ""} ${a === o && a !== e ? "scelto" : ""}"
            aria-label=${`${F(a).getDate()} ${U[F(a).getMonth()]}${s.length ? `: ${s.map((e) => this.tipologia(e.tipologia)?.nome ?? e.tipologia).join(", ")}` : ""}`}
            @click=${() => this._scelto = a}
          >
            <span>${F(a).getDate()}</span>
            <span class="punti">
              ${s.slice(0, 4).map((e) => E`<i style="background:${this.tipologia(e.tipologia)?.colore ?? "#888"}"></i>`)}
            </span>
          </button>`;
		})}
      </div>
      <div class="dettaglio">
        <small>${H[R(o)]} ${F(o).getDate()} ${U[F(o).getMonth()]}</small>
        ${s.length ? s.map((e) => {
			let t = this.tipologia(e.tipologia), n = [
				t?.note,
				e.spostato_dal ? W.card.spostatoDal(Q(e.spostato_dal)) : "",
				e.festivo ? W.card.festivo(e.festivo) : "",
				this.confermato(e) ? W.card.confermato : ""
			].filter(Boolean);
			return E`<div class="riga">${t ? this.chipNota(t) : e.tipologia}<span class="note">${n.join(" · ")}</span></div>`;
		}) : E`<span class="note">${W.card.nessunRitiro}</span>`}
      </div>
      ${c.length ? E`<div class="legenda">${c.map((e) => E`<span><i class="pallino" style="background:${e.colore}"></i>${e.nome}</span>`)}</div>` : O}
      ${this.banner()}
    ${this.finestre()}
    </ha-card>`;
	}
	static {
		this.styles = [...Z.stiliComuni, o`
      .testa-mese {
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 8px;
      }
      .testa-mese b {
        flex: 1;
        text-align: center;
        font-size: 15px;
        text-transform: capitalize;
      }
      .testa-mese button {
        border: 0;
        background: var(--rd-superficie-2);
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      .mese {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        padding: 8px 12px 10px;
      }
      .intest {
        text-align: center;
        font-size: 11px;
        color: var(--rd-testo-2);
        font-weight: 700;
        padding: 4px 0;
      }
      .c {
        border: 0;
        background: none;
        aspect-ratio: 1;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 13.5px;
        cursor: pointer;
        padding: 0;
        min-height: 36px;
      }
      .c:hover {
        background: var(--rd-superficie-2);
      }
      .c.fuori {
        opacity: 0.4;
      }
      .c.passato:not(.oggi) {
        color: var(--rd-testo-2);
      }
      .legenda {
        display: flex;
        gap: 6px 14px;
        flex-wrap: wrap;
        padding: 0 16px 14px;
        font-size: 12.5px;
        color: var(--rd-testo-2);
      }
      .legenda span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .c.oggi {
        background: var(--rd-primario);
        color: var(--text-primary-color, #fff);
        font-weight: 700;
      }
      .c.scelto {
        box-shadow: 0 0 0 2px var(--rd-primario) inset;
      }
      .punti {
        display: flex;
        gap: 2px;
        height: 7px;
      }
      .punti i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
      .c.oggi .punti i {
        box-shadow: 0 0 0 1.5px #fff;
      }
      .dettaglio {
        border-top: 1px solid var(--rd-bordo);
        padding: 10px 16px 14px;
        display: grid;
        gap: 8px;
      }
      .dettaglio small {
        color: var(--rd-testo-2);
        font-weight: 600;
      }
      .dettaglio small::first-letter {
        text-transform: uppercase;
      }
      .riga {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .note {
        color: var(--rd-testo-2);
        font-size: 13px;
      }
    `];
	}
}), Je($, W.card.nomeMese, W.card.descrizioneMese);
//#endregion
