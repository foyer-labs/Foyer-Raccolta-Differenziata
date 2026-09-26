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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, oe = {
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
}, se = (e, t) => !l(e, t), ce = {
	attribute: !0,
	type: String,
	converter: oe,
	reflect: !1,
	useDefault: !1,
	hasChanged: se
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var m = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ce) {
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
		return this.elementProperties.get(e) ?? ce;
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
			let i = (n.converter?.toAttribute === void 0 ? oe : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? oe : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? se)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[p("elementProperties")] = /* @__PURE__ */ new Map(), m[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: m }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var h = globalThis, le = (e) => e, g = h.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", x = "[ 	\n\f\r]", S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, C = RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), w = xe(1), Se = xe(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), D = v.createTreeWalker(v, 129);
function we(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var Te = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === S ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = _e : o === C ? c[0] === ">" ? (o = i ?? S, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = C : o === ge || o === _e ? o = S : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === S ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [we(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, O = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Te(t, n);
		if (this.el = e.createElement(l, r), D.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = D.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Oe : r[1] === "?" ? ke : r[1] === "@" ? Ae : A
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (be.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === fe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += _.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = v.createElement("template");
		return n.innerHTML = e, n;
	}
};
function k(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = k(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new De(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, De = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = k(this, e, t), b(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = O.createElement(we(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ce.get(e.strings);
		return t === void 0 && Ce.set(e.strings, t = new O(e)), t;
	}
	k(t) {
		me(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = le(e).nextSibling;
			le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, A = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = E, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = E;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = k(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = k(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Oe = class extends A {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, ke = class extends A {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, Ae = class extends A {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = k(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, je = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		k(this, e);
	}
}, Me = h.litHtmlPolyfillSupport;
Me?.(O, De), (h.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new De(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Pe = globalThis, j = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return T;
	}
};
j._$litElement$ = !0, j.finalized = !0, Pe.litElementHydrateSupport?.({ LitElement: j });
var Fe = Pe.litElementPolyfillSupport;
Fe?.({ LitElement: j }), (Pe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/comune/stili.ts
var M = o`
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
`, N = o`
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
function P(e) {
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
var F = o`
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
`, I = (e) => w`<span class="chip" style="background:${e.colore};color:${P(e.colore)}"
    ><ha-icon .icon=${e.icona}></ha-icon>${e.nome}</span
  >`, L = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^0-9a-f]/gi, "").slice(0, 32), R = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Ie = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, z = (e, t) => {
	let n = R(e);
	return n.setDate(n.getDate() + t), Ie(n);
}, B = (e) => (R(e).getDay() + 6) % 7, Le = (e, t) => Math.round((R(t).getTime() - R(e).getTime()) / 864e5), Re = (e) => z(e, -B(e)), V = [
	"lunedì",
	"martedì",
	"mercoledì",
	"giovedì",
	"venerdì",
	"sabato",
	"domenica"
], H = [
	"Lun",
	"Mar",
	"Mer",
	"Gio",
	"Ven",
	"Sab",
	"Dom"
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
], ze = {
	1: "primo",
	2: "secondo",
	3: "terzo",
	4: "quarto",
	[-1]: "ultimo"
}, Be = {
	1: "1°",
	2: "2°",
	3: "3°",
	4: "4°",
	[-1]: "Ultimo"
}, W = {
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
		inizioLunedi: "Dal lunedì"
	},
	profiloRimosso: (e) => e === 1 ? "Un promemoria riguardava solo questa tipologia e verrà eliminato." : `${e} promemoria riguardavano solo questa tipologia e verranno eliminati.`
};
function G(e) {
	let t = R(e);
	return `${t.getDate()} ${U[t.getMonth()]} ${t.getFullYear()}`;
}
function K(e) {
	let t = R(e);
	return `${H[B(e)].toLowerCase()} ${t.getDate()} ${U[t.getMonth()].slice(0, 3)}`;
}
function Ve(e) {
	let t = R(e);
	return `${t.getDate()} ${U[t.getMonth()].slice(0, 3)}`;
}
var He = (e) => e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} e ${e[e.length - 1]}`;
function q(e) {
	if (e.tipo === "settimanale") {
		let t = He([...e.giorni].sort().map((e) => V[e]));
		return e.ogni === 1 ? `Ogni settimana, il ${t}` : e.ogni === 2 ? `Una settimana sì e una no, il ${t}` : `Ogni ${e.ogni} settimane, il ${t}`;
	}
	return e.tipo === "mensile_posizione" ? `Il ${He([...e.posizioni].sort((e, t) => (e === -1 ? 9 : e) - (t === -1 ? 9 : t)).map((e) => ze[e]))} ${V[e.giorno]} del mese` : `Il giorno ${He([...e.giorni].sort((e, t) => e - t).map(String))} di ogni mese`;
}
var Ue = (e) => {
	let [t, n] = e.split("-").map(Number);
	return `${n} ${U[t - 1]}`;
};
function We(e) {
	return e.tipo === "sempre" ? "Tutto l'anno" : e.tipo === "annuale" ? `Dal ${Ue(e.dal)} al ${Ue(e.al)}, ogni anno` : `Dal ${G(e.dal)} al ${G(e.al)}`;
}
var Ge = {
	valore_mancante: "manca un valore",
	scelta_non_valida: "scegli una delle voci del menu",
	si_no_non_valido: "scrivi Sì o No",
	un_solo_giorno: "per il mensile va un solo giorno della settimana",
	foglio_mancante: "manca il foglio: per sostituire tutto servono tutti i fogli del modello",
	colonna_mancante: "manca la colonna",
	troppe_righe: "troppe righe (al massimo 2000)",
	file_non_valido: "non è un file Excel (.xlsx) leggibile",
	file_troppo_grande: "il file è troppo grande (al massimo 1 MB)",
	impostazione_sconosciuta: "impostazione sconosciuta: controlla il nome nella prima colonna",
	nessun_foglio: "nel file non c'è nessuno dei fogli del modello (Tipologie, Regole, …)",
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
	revisione_superata: "qualcun altro ha salvato nel frattempo",
	destinatari_mancanti: "scegli almeno un destinatario",
	destinatario_non_valido: "un destinatario non è valido",
	giorni_prima_non_validi: "da 1 a 7 giorni prima",
	quando_non_valido: "scegli quando avvisare",
	richiami_non_validi: "i solleciti vanno da 1 a 2",
	intervallo_non_valido: "l'intervallo va da 5 a 240 minuti"
}, J = (e) => Ge[e.codice] ?? e.codice, Ke = {
	tipologia_sconosciuta: "tipologia non trovata nel foglio Tipologie",
	giorni_non_validi: "giorni non riconosciuti (per esempio Lun, Gio oppure 1, 15)",
	posizioni_non_valide: "posizioni non riconosciute (per esempio 2°, ultimo)",
	data_non_valida: "data non valida (per esempio 22/09/2026, o 01/06 per «Ogni anno»)",
	orario_non_valido: "orario non valido (per esempio 20:00)",
	colore_non_valido: "colore non valido (per esempio #795548)",
	destinatario_non_valido: "destinatario non valido (per esempio mobile_app_telefono o notify.telegram)",
	destinatari_mancanti: "manca almeno un destinatario"
}, qe = (e) => Ke[e.codice] ?? Ge[e.codice] ?? e.codice;
function Je(e) {
	return [
		e.foglio,
		e.riga ? W.riga(e.riga) : "",
		e.colonna ?? ""
	].filter(Boolean).join(" · ");
}
var Ye = {
	tipologie: ["Tipologie", !0],
	regole: ["Regole", !0],
	eccezioni: ["Eccezioni", !0],
	promemoria: ["Promemoria", !1],
	sospensioni: ["Vacanze", !0],
	impostazioni: ["Impostazioni", !0]
};
function Xe(e, t) {
	let n = Ye[e];
	if (!n) return null;
	let [r, i] = n, a = (e, t) => `${e} ${t}${e === 1 ? i ? "a" : "o" : i ? "e" : "i"}`, o = [
		t.aggiunte ? a(t.aggiunte, "nuov") : null,
		t.modificate ? a(t.modificate, "modificat") : null,
		t.tolte ? a(t.tolte, "tolt") : null
	].filter(Boolean);
	return o.length ? `${r}: ${o.join(", ")}` : null;
}
function Ze(e, t) {
	let n = e.tipologia ? t(e.tipologia) : "", r = e.intervalli.map(([e, t]) => e === t ? G(e) : `dal ${G(e)} al ${G(t)}`).join(", ");
	switch (e.codice) {
		case "ritiro_festivo": return `${n}: ${G(e.data)} è un giorno festivo. Controlla cosa fa il comune.`;
		case "sovrapposizione_mista": return `${n}: la regola «${t(e.regole[0])}» cede a «${t(e.regole[1])}» ${r}.`;
		case "sovrapposizione_stesso_tipo": return `${n}: le regole «${t(e.regole[0])}» e «${t(e.regole[1])}» generano gli stessi ${e.conteggio} ritiri ${r}. Una delle due è di troppo?`;
		case "eccezione_senza_ritiro": return `${n}: il ${G(e.data)} non c'è un ritiro da togliere o spostare.`;
		case "eccezione_ridondante": return `${n}: il ${G(e.data)} il ritiro c'è già; l'eccezione non cambia nulla.`;
		case "giorno_inesistente": return `${n}: nei mesi senza il giorno ${e.giorni.join(" o ")} la regola «${t(e.regole[0])}» non genera il ritiro.`;
		case "tipologia_senza_ritiri": return `${n} non ha ritiri nei prossimi 12 mesi.`;
		case "calendario_in_scadenza": return `Il calendario vale fino al ${G(e.data)}: controlla quello nuovo del comune.`;
		case "calendario_scaduto": return `Il calendario è scaduto il ${G(e.data)}: i ritiri successivi sono da verificare.`;
		default: return e.codice;
	}
}
var Qe = (e) => e.nome || q(e.ricorrenza);
function $e(e) {
	return e.tipo === "apertura" ? "Quando si possono esporre i sacchi" : e.tipo === "giorno_stesso" ? `Il giorno del ritiro alle ${e.ora}` : `${[
		"",
		"Il giorno prima",
		"Due giorni prima",
		"Tre giorni prima",
		"Quattro giorni prima",
		"Cinque giorni prima",
		"Sei giorni prima",
		"Una settimana prima"
	][e.giorni] ?? `${e.giorni} giorni prima`} alle ${e.ora}`;
}
//#endregion
//#region src/comune/simbolo.ts
var et = Se`<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%">
  <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 13.5 V9 H38 V13.5"/><path d="M10 14.5 H54"/><path d="M13.5 20 L17 57 H47 L50.5 20 Z"/>
    <polyline points="21,34 32,25 43,34" opacity="0.5"/><polyline points="25.5,40.5 32,35 38.5,40.5"/>
  </g>
  <rect x="28.5" y="46.5" width="7" height="7" fill="#F0A835"/><circle cx="32" cy="46.5" r="3.5" fill="#F0A835"/>
</svg>`, tt = class extends j {
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
		this.styles = [M, o`
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
        outline: none;
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
        padding: 8px 20px 16px;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      footer {
        padding: 12px 20px 16px;
        border-top: 1px solid var(--rd-bordo);
      }
      footer:not(:has(*)) {
        display: none;
      }
      @media (max-width: 600px) {
        .velo {
          padding: 0;
          align-items: end;
        }
        .dialogo {
          max-width: none;
          border-radius: 20px 20px 0 0;
          max-height: 92vh;
        }
      }
    `];
	}
	updated(e) {
		e.has("aperta") && this.aperta && (this._prima = document.activeElement, this.renderRoot.querySelector(".dialogo")?.focus());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._prima?.focus?.();
	}
	_chiudi() {
		this.dispatchEvent(new CustomEvent("chiudi"));
	}
	render() {
		return w`<div
      class="velo"
      @click=${(e) => e.target === e.currentTarget && this._chiudi()}
      @keydown=${(e) => e.key === "Escape" && this._chiudi()}
    >
      <div class="dialogo" role="dialog" aria-modal="true" aria-label=${this.titolo} tabindex="-1">
        <header>
          <h3>${this.titolo}</h3>
          <button aria-label=${W.chiudi} @click=${this._chiudi}><ha-icon icon="mdi:close"></ha-icon></button>
        </header>
        <div class="contenuto"><slot></slot></div>
        <footer><slot name="azioni"></slot></footer>
      </div>
    </div>`;
	}
};
customElements.get("rd-finestra") || customElements.define("rd-finestra", tt);
//#endregion
//#region src/pannello/contesto.ts
var Y = (e, t, n) => e.dispatchEvent(new CustomEvent("proponi", {
	detail: {
		configurazione: t,
		riepilogo: n
	},
	bubbles: !0,
	composed: !0
})), nt = (e, t) => e.dispatchEvent(new CustomEvent("avvisa", {
	detail: t,
	bubbles: !0,
	composed: !0
})), X = (e, t, n) => e.dispatchEvent(new CustomEvent("naviga", {
	detail: {
		pagina: t,
		precompila: n
	},
	bubbles: !0,
	composed: !0
})), rt = (e) => e.dispatchEvent(new CustomEvent("ricarica", {
	bubbles: !0,
	composed: !0
})), Z = (e) => JSON.parse(JSON.stringify(e)), it = "foyer_raccolta_differenziata", at = class extends j {
	constructor(...e) {
		super(...e), this._nome = (e) => {
			let t = this.lettura.configurazione, n = t.tipologie.find((t) => t.id === e);
			if (n) return n.nome;
			let r = t.regole.find((t) => t.id === e);
			return r ? Qe(r) : e;
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
			type: `${it}/ritiri`,
			dal: e,
			al: z(e, 29)
		});
	}
	async _ignora(e) {
		await this.hass.callWS({
			type: `${it}/anomalie/ignora`,
			data: e.data,
			tipologia: e.tipologia
		}), rt(this);
	}
	_festivi() {
		let e = new Set(this.lettura.festivi_ignorati.map((e) => `${e.data}|${e.tipologia}`));
		return (this._ritiri?.ritiri ?? []).filter((t) => t.festivo && !e.has(`${t.data}|${t.tipologia}`));
	}
	_azioni(e) {
		switch (e.codice) {
			case "tipologia_senza_ritiri": return w`<button class="bottone piccolo" @click=${() => X(this, "eccezioni", {
				tipo: "aggiungi",
				tipologia: e.tipologia,
				data: this.lettura.oggi
			})}>${W.aggiungiData}</button>`;
			case "sovrapposizione_mista":
			case "sovrapposizione_stesso_tipo":
			case "giorno_inesistente": return w`<button class="bottone piccolo" @click=${() => X(this, "regole")}>${W.apriRegole}</button>`;
			case "eccezione_senza_ritiro":
			case "eccezione_ridondante": return w`<button class="bottone piccolo" @click=${() => X(this, "eccezioni")}>${W.pagine.eccezioni}</button>`;
			case "calendario_in_scadenza":
			case "calendario_scaduto": return w`<button class="bottone piccolo" @click=${() => X(this, "impostazioni")}>${W.pagine.impostazioni}</button>`;
			default: return E;
		}
	}
	_giorni() {
		let e = this.lettura.configurazione.tipologie, t = /* @__PURE__ */ new Map();
		for (let e of this._ritiri?.ritiri ?? []) t.set(e.data, [...t.get(e.data) ?? [], e]);
		if (!t.size) return w`<div class="vuoto">${W.nessunRitiro}</div>`;
		let n = this.lettura.oggi;
		return [...t.entries()].map(([t, r]) => {
			let i = Le(n, t), a = i === 0 ? W.oggi : i === 1 ? W.domani : H[B(t)];
			return w`<div class="giorno ${i === 0 ? "oggi" : ""}">
        <div class="quando"><b>${a}</b>${Ve(t)}</div>
        <div class="chips">
          ${r.map((t) => {
				let n = e.find((e) => e.id === t.tipologia);
				return w`${n ? I(n) : t.tipologia}
            ${t.spostato_dal ? w`<span class="nota">↪ ${Ve(t.spostato_dal)}</span>` : E}
            ${t.festivo ? w`<span class="nota avviso">${t.festivo}</span>` : E}`;
			})}
        </div>
      </div>`;
		});
	}
	_validita() {
		let e = this.lettura.configurazione.valido_fino_al;
		if (!e) return w`<p class="aiuto">${W.senzaValidita}</p>`;
		let t = Le(this.lettura.oggi, e);
		return t < 0 ? w`<p class="aiuto avviso">${W.scaduto(e)}</p>` : w`<div class="validita ${t <= 30 ? "avviso" : ""}">
      <div class="grande">${t}</div>
      <div>${W.giorniValidita}<br /><small class="aiuto">${W.validoFino(e)}</small></div>
    </div>`;
	}
	render() {
		let e = this._festivi(), t = this.lettura.anomalie, n = e.length + t.length;
		return w`
      ${this.lettura.problemi.length ? w`<div class="riquadro errore">
            ${W.configurazioneNonValida}
            <ul>${this.lettura.problemi.map((e) => w`<li>${J(e)}</li>`)}</ul>
          </div>` : E}
      <div class="griglia-2">
        <div class="riquadro">
          <h2>${W.prossimiRitiri} <span class="conta">${W.giorni30}</span></h2>
          ${this._giorni()}
        </div>
        <div class="laterale">
          <div class="riquadro">
            <h2>${W.daControllare} ${n ? w`<span class="conta">${n}</span>` : E}</h2>
            ${n === 0 ? w`<div class="vuoto">${W.tuttoInOrdine}</div>` : E}
            ${e.map((e) => w`<div class="anomalia">
                <ha-icon icon="mdi:alert-outline"></ha-icon>
                <div class="testo">
                  <b>${this._nome(e.tipologia)}</b> · ${G(e.data)}: ${e.festivo}.
                  <div class="riga-azioni">
                    <button class="bottone piccolo primario" @click=${() => X(this, "eccezioni", {
			tipo: "sposta",
			tipologia: e.tipologia,
			data: e.data
		})}>${W.creaEccezione}</button>
                    <button class="bottone piccolo" @click=${() => this._ignora(e)}>${W.ignora}</button>
                  </div>
                </div>
              </div>`)}
            ${t.map((e) => w`<div class="anomalia ${e.gravita}">
                <ha-icon icon=${e.gravita === "avviso" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
                <div class="testo">${Ze(e, this._nome)}<div class="riga-azioni">${this._azioni(e)}</div></div>
              </div>`)}
          </div>
          <div class="riquadro">
            <h2>${W.calendarioComune}</h2>
            ${this._validita()}
          </div>
        </div>
      </div>
    `;
	}
	static {
		this.styles = [
			M,
			F,
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
      @media (max-width: 820px) {
        .laterale {
          order: -1;
        }
      }
    `
		];
	}
};
customElements.get("rd-panoramica") || customElements.define("rd-panoramica", at);
//#endregion
//#region src/comune/selettore.ts
var ot = 60, st = class e extends j {
	constructor(...t) {
		super(...t), this.opzioni = [], this.scelti = [], this.multiplo = !1, this.libero = !1, this.etichetta = "", this.segnaposto = "", this.vuoto = "", this._testo = "", this._aperto = !1, this._attivo = 0, this._gruppo = "", this._idLista = `rd-suggerimenti-${++e._contatore}`;
	}
	static {
		this.properties = {
			opzioni: { attribute: !1 },
			scelti: { attribute: !1 },
			multiplo: { type: Boolean },
			libero: { type: Boolean },
			etichetta: {},
			segnaposto: {},
			vuoto: {},
			_testo: { state: !0 },
			_aperto: { state: !0 },
			_attivo: { state: !0 },
			_gruppo: { state: !0 }
		};
	}
	static {
		this._contatore = 0;
	}
	_cambia(e) {
		this.dispatchEvent(new CustomEvent("cambia", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	_suggerimenti() {
		let e = this._testo.trim().toLowerCase();
		return this.opzioni.filter((e) => !this.multiplo || !this.scelti.includes(e.id)).filter((e) => !this._gruppo || e.gruppo === this._gruppo).filter((t) => !e || t.nome.toLowerCase().includes(e) || t.id.toLowerCase().includes(e)).slice(0, ot);
	}
	_scegli(e) {
		this.multiplo ? (this._cambia([...this.scelti, e.id]), this._testo = "", this._attivo = 0, this.renderRoot.querySelector("input")?.focus()) : (this._cambia([e.id]), this._testo = "", this._aperto = !1);
	}
	_conferma() {
		let e = this._suggerimenti();
		if (e[this._attivo]) return this._scegli(e[this._attivo]);
		this.libero && this._testo.trim() && (this._cambia([this._testo.trim()]), this._testo = "", this._aperto = !1);
	}
	_tasto(e) {
		let t = this._suggerimenti().length;
		e.key === "ArrowDown" ? (e.preventDefault(), this._aperto = !0, this._attivo = t ? (this._attivo + 1) % t : 0) : e.key === "ArrowUp" ? (e.preventDefault(), this._attivo = t ? (this._attivo - 1 + t) % t : 0) : e.key === "Enter" ? (e.preventDefault(), this._conferma()) : e.key === "Escape" && this._aperto && (e.stopPropagation(), this._aperto = !1);
	}
	_riga(e, t, n) {
		return w`<li
      id=${`${this._idLista}-${t}`}
      role="option"
      aria-selected=${n}
      class=${n ? "attiva" : ""}
      @mousedown=${(e) => e.preventDefault()}
      @click=${() => this._scegli(e)}
      @mouseenter=${() => this._attivo = t}
    >
      ${e.icona ? w`<ha-icon .icon=${e.icona}></ha-icon>` : E}
      <span class="testi"><span class="nome">${e.nome}</span>${e.dettaglio ? w`<small>${e.dettaglio}</small>` : E}</span>
      ${e.etichetta ? w`<span class="etichetta ${e.etichettaEvidente ? "evidente" : ""}">${e.etichetta}</span>` : E}
    </li>`;
	}
	_scelte() {
		return this.multiplo ? this.scelti.length ? w`<ul class="scelte" aria-label=${this.etichetta}>
      ${this.scelti.map((e) => {
			let t = this.opzioni.find((t) => t.id === e);
			return w`<li class=${t ? "" : "mancante"}>
          ${t?.icona ? w`<ha-icon .icon=${t.icona}></ha-icon>` : w`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
          <span class="testi">
            <span class="nome">${t?.nome ?? e}</span>
            <small>${t ? t.dettaglio ?? e : W.nonTrovato}</small>
          </span>
          ${t?.etichetta ? w`<span class="etichetta ${t.etichettaEvidente ? "evidente" : ""}">${t.etichetta}</span>` : E}
          <button class="togli" aria-label=${`${W.togli} ${t?.nome ?? e}`} title=${W.togli} @click=${() => this._cambia(this.scelti.filter((t) => t !== e))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </li>`;
		})}
    </ul>` : w`<div class="nessuna">${this.vuoto}</div>` : E;
	}
	render() {
		let e = [...new Set(this.opzioni.map((e) => e.gruppo).filter((e) => !!e))], t = this._aperto ? this._suggerimenti() : [], n = Math.min(this._attivo, Math.max(t.length - 1, 0)), r = this.multiplo ? void 0 : this.opzioni.find((e) => e.id === this.scelti[0]);
		return w`
      ${this._scelte()}
      <div class="campo-ricerca ${this._aperto ? "aperto" : ""}">
        ${!this.multiplo && this.scelti[0] ? w`<ha-icon class="anteprima" .icon=${r?.icona ?? this.scelti[0]}></ha-icon>` : w`<ha-icon class="lente" icon="mdi:magnify"></ha-icon>`}
        <input
          role="combobox"
          aria-label=${this.etichetta}
          aria-expanded=${this._aperto}
          aria-controls=${this._idLista}
          aria-activedescendant=${t.length ? `${this._idLista}-${n}` : ""}
          autocomplete="off"
          placeholder=${!this.multiplo && this.scelti[0] ? r?.nome ?? this.scelti[0] : this.segnaposto}
          .value=${this._testo}
          @input=${(e) => {
			this._testo = e.target.value, this._aperto = !0, this._attivo = 0;
		}}
          @focus=${() => this._aperto = !0}
          @blur=${() => this._aperto = !1}
          @keydown=${this._tasto}
        />
      </div>
      ${this._aperto ? w`<div class="tendina">
            ${e.length > 1 ? w`<div class="filtri" @mousedown=${(e) => e.preventDefault()}>
                  ${["", ...e].map((e) => w`<button class=${this._gruppo === e ? "attivo" : ""} @click=${() => (this._gruppo = e, this._attivo = 0)}>
                      ${e || W.tutti}
                    </button>`)}
                </div>` : E}
            <ul id=${this._idLista} role="listbox" aria-label=${this.etichetta}>
              ${t.length ? t.map((e, t) => this._riga(e, t, t === n)) : w`<li class="niente" role="presentation">
                    ${this.libero && this._testo.trim() ? W.usaValore(this._testo.trim()) : W.nessunRisultato}
                  </li>`}
            </ul>
          </div>` : E}
    `;
	}
	static {
		this.styles = [M, o`
      :host {
        display: block;
      }
      .scelte {
        list-style: none;
        margin: 0 0 8px;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .scelte li,
      .tendina li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        --mdc-icon-size: 20px;
      }
      .scelte li {
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
      }
      .scelte li.mancante {
        border-color: var(--rd-errore);
      }
      .scelte li.mancante small {
        color: var(--rd-errore);
      }
      .testi {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .nome {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      small {
        color: var(--rd-testo-2);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .etichetta {
        font-size: 11.5px;
        color: var(--rd-testo-2);
        border: 1px solid var(--rd-bordo);
        border-radius: 6px;
        padding: 1px 6px;
        white-space: nowrap;
      }
      .etichetta.evidente {
        color: var(--rd-primario);
        border-color: var(--rd-primario);
      }
      .togli {
        border: 0;
        background: none;
        cursor: pointer;
        color: var(--rd-testo-2);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex: none;
      }
      .togli:hover,
      .togli:focus-visible {
        background: var(--rd-superficie-2);
        color: var(--rd-errore);
      }
      .nessuna {
        color: var(--rd-testo-2);
        font-size: 13.5px;
        margin-bottom: 8px;
      }
      .campo-ricerca {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        padding: 0 10px;
        background: var(--rd-superficie);
        --mdc-icon-size: 20px;
      }
      .campo-ricerca.aperto,
      .campo-ricerca:focus-within {
        border-color: var(--rd-primario);
        box-shadow: 0 0 0 1px var(--rd-primario);
      }
      .lente {
        color: var(--rd-testo-2);
      }
      input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: none;
        color: var(--rd-testo);
        font: inherit;
        padding: 10px 0;
      }
      .tendina {
        margin-top: 4px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        background: var(--rd-superficie);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }
      .filtri {
        display: flex;
        gap: 4px;
        padding: 6px;
        border-bottom: 1px solid var(--rd-bordo);
        flex-wrap: wrap;
      }
      .filtri button {
        border: 1px solid var(--rd-bordo);
        background: none;
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 12.5px;
        cursor: pointer;
      }
      .filtri button.attivo {
        background: var(--rd-primario);
        border-color: var(--rd-primario);
        color: var(--text-primary-color, #fff);
      }
      .tendina ul {
        list-style: none;
        margin: 0;
        padding: 4px 0;
        max-height: 240px;
        overflow-y: auto;
      }
      .tendina li {
        cursor: pointer;
      }
      .tendina li.attiva {
        background: color-mix(in srgb, var(--rd-primario) 12%, transparent);
      }
      .tendina li.niente {
        color: var(--rd-testo-2);
        cursor: default;
      }
    `];
	}
};
customElements.get("rd-selettore") || customElements.define("rd-selettore", st);
var ct = [
	["mdi:food-apple", "Mela · umido"],
	["mdi:food-apple-outline", "Mela, contorno"],
	["mdi:food", "Cibo"],
	["mdi:fruit-cherries", "Ciliegie"],
	["mdi:silverware-fork-knife", "Posate"],
	["mdi:pot-steam", "Pentola"],
	["mdi:coffee", "Caffè"],
	["mdi:newspaper-variant", "Giornale · carta"],
	["mdi:newspaper", "Giornale"],
	["mdi:package-variant", "Scatola · cartone"],
	["mdi:package-variant-closed", "Scatola chiusa"],
	["mdi:bottle-soda", "Bottiglia · plastica"],
	["mdi:bottle-soda-classic", "Bottiglia classica"],
	["mdi:bottle-wine", "Bottiglia di vino · vetro"],
	["mdi:glass-fragile", "Bicchiere · vetro"],
	["mdi:glass-wine", "Calice"],
	["mdi:glass-mug-variant", "Boccale"],
	["mdi:trash-can", "Bidone · secco"],
	["mdi:trash-can-outline", "Bidone, contorno"],
	["mdi:delete-variant", "Cestino"],
	["mdi:recycle", "Riciclo"],
	["mdi:recycle-variant", "Riciclo, variante"],
	["mdi:leaf", "Foglia · verde"],
	["mdi:tree", "Albero · potature"],
	["mdi:grass", "Erba · sfalci"],
	["mdi:flower", "Fiore"],
	["mdi:baby-carriage", "Passeggino · pannolini"],
	["mdi:human-baby-changing-table", "Fasciatoio"],
	["mdi:sofa", "Divano · ingombranti"],
	["mdi:bed", "Letto"],
	["mdi:fridge", "Frigorifero · RAEE"],
	["mdi:washing-machine", "Lavatrice"],
	["mdi:television", "Televisore"],
	["mdi:laptop", "Computer"],
	["mdi:cellphone", "Telefono"],
	["mdi:lightbulb", "Lampadina"],
	["mdi:battery", "Pile"],
	["mdi:pill", "Farmaci"],
	["mdi:tshirt-crew", "Abiti"],
	["mdi:shoe-sneaker", "Scarpe"],
	["mdi:oil", "Olio"],
	["mdi:bucket", "Secchio"],
	["mdi:spray-bottle", "Detersivi"],
	["mdi:car-tire-alert", "Pneumatici"],
	["mdi:paw", "Animali"],
	["mdi:cup", "Bicchiere di carta"]
].map(([e, t]) => ({
	id: e,
	nome: t,
	dettaglio: e,
	icona: e
})), lt = "foyer_raccolta_differenziata", Q = [
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
], ut = class extends j {
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
			type: `${lt}/ritiri`,
			dal: e,
			al: z(e, 365)
		}), n = {};
		for (let e of t.ritiri) n[e.tipologia] ??= e.data;
		this._prossimi = n;
	}
	_nuova() {
		let e = new Set(this.lettura.configurazione.tipologie.map((e) => e.colore.toLowerCase()));
		this._bozza = {
			id: L(),
			nome: "",
			colore: Q.find((t) => !e.has(t)) ?? Q[0],
			icona: "mdi:trash-can-outline",
			note: "",
			esposizione: null
		};
	}
	_salva() {
		let e = this._bozza, t = Z(this.lettura.configurazione), n = t.tipologie.findIndex((t) => t.id === e.id), r = {
			...e,
			nome: e.nome.trim(),
			note: e.note.trim()
		};
		n >= 0 ? t.tipologie[n] = r : t.tipologie.push(r), Y(this, t);
	}
	_elimina() {
		let e = this._bozza, t = this.lettura.configurazione, n = t.regole.filter((t) => t.tipologia === e.id).length, r = t.eccezioni.filter((t) => t.tipologia === e.id).length, i = t.promemoria.filter((t) => t.tipologie?.length === 1 && t.tipologie[0] === e.id).length, a = W.eliminaTipologia(e.nome, n, r) + (i ? ` ${W.profiloRimosso(i)}` : "");
		if (!confirm(a)) return;
		let o = Z(t);
		o.tipologie = o.tipologie.filter((t) => t.id !== e.id), o.regole = o.regole.filter((t) => t.tipologia !== e.id), o.eccezioni = o.eccezioni.filter((t) => t.tipologia !== e.id), o.promemoria = o.promemoria.map((t) => t.tipologie === null ? t : {
			...t,
			tipologie: t.tipologie.filter((t) => t !== e.id)
		}).filter((e) => e.tipologie === null || e.tipologie.length > 0), Y(this, o);
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
		if (!e) return E;
		let t = this.lettura.configurazione.tipologie.some((t) => t.id === e.id);
		return w`<rd-finestra aperta titolo=${t && e.nome || W.nuovaTipologia} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="anteprima-testa" style="background:${e.colore};color:${P(e.colore)}">
          <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome || W.nome}</b>
        </div>
        <div class="campo">
          <label for="nome">${W.nome}</label>
          <input id="nome" maxlength="40" .value=${e.nome} @input=${(e) => this._aggiorna({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${W.colore}</span>
          <div class="colori">
            ${Q.map((t) => w`<button class="colore ${t === e.colore ? "attivo" : ""}" style="background:${t}" aria-label=${t} @click=${() => this._aggiorna({ colore: t })}></button>`)}
            <label class="colore altro ${Q.includes(e.colore) ? "" : "attivo"}" style=${Q.includes(e.colore) ? "" : `background:${e.colore}`} title=${W.altroColore}>
              <ha-icon icon="mdi:palette"></ha-icon>
              <input type="color" aria-label=${W.altroColore} .value=${e.colore} @input=${(e) => this._aggiorna({ colore: e.target.value })} />
            </label>
          </div>
        </div>
        <div class="campo">
          <span class="etichetta">${W.icona}</span>
          <rd-selettore
            libero
            .opzioni=${ct}
            .scelti=${[e.icona]}
            etichetta=${W.icona}
            segnaposto=${W.cercaIcona}
            @cambia=${(e) => this._aggiorna({ icona: e.detail[0] })}
          ></rd-selettore>
          <small>${W.iconaAiuto}</small>
        </div>
        <div class="campo">
          <label for="note">${W.note}</label>
          <textarea id="note" maxlength="500" .value=${e.note} @input=${(e) => this._aggiorna({ note: e.target.value })}></textarea>
        </div>
        <label class="spunta">
          <input type="checkbox" .checked=${e.esposizione !== null} @change=${(e) => this._aggiorna({ esposizione: e.target.checked ? { ...this.lettura.configurazione.esposizione } : null })} />
          ${W.finestraPropria}
        </label>
        ${e.esposizione ? w`<div class="riga-campi">
                <div class="campo">
                  <label>${W.dalle}</label>
                  <input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._aggiornaFinestra({ inizio_ora: e.target.value })} />
                </div>
                <div class="campo">
                  <label>${W.del}</label>
                  <select @change=${(e) => this._aggiornaFinestra({ inizio_giorno: e.target.value })}>
                    ${["giorno_prima", "giorno_stesso"].map((t) => w`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${W.inizioGiorno[t]}</option>`)}
                  </select>
                </div>
              </div>
              <div class="campo">
                <label>${W.entroLe}</label>
                <input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._aggiornaFinestra({ fine_ora: e.target.value })} />
              </div>` : E}
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? w`<button class="bottone pericolo" @click=${this._elimina}>${W.elimina}</button>` : E}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${W.annulla}</button>
        <button class="bottone primario" ?disabled=${!e.nome.trim()} @click=${this._salva}>${W.salva}</button>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione.tipologie;
		return w`<div class="riquadro">
        <h2>${W.pagine.tipologie} <span class="conta">${e.length}</span></h2>
        <p class="aiuto">${W.aiutoTipologie}</p>
        <div class="griglia">
          ${e.map((e) => w`<button class="tipologia" @click=${() => this._bozza = Z(e)}>
              <div class="testa" style="background:${e.colore};color:${P(e.colore)}">
                <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome}</b>
              </div>
              <div class="corpo">${e.note || w`<i>${W.nessunaNota}</i>`}</div>
              <div class="piede">
                <span>${W.prossimo}: <b>${this._prossimi[e.id] ? Ve(this._prossimi[e.id]) : "—"}</b></span>
                <span class="link">${W.modifica}</span>
              </div>
            </button>`)}
          <button class="nuova" @click=${this._nuova}><ha-icon icon="mdi:plus"></ha-icon>${W.nuovaTipologia}</button>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			M,
			F,
			N,
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
      .colore.altro {
        position: relative;
        display: grid;
        place-items: center;
        background: conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935);
        color: #fff;
        --mdc-icon-size: 16px;
      }
      .colore.altro input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
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
customElements.get("rd-tipologie") || customElements.define("rd-tipologie", ut);
//#endregion
//#region src/pannello/pagine/regole.ts
var dt = "foyer_raccolta_differenziata", ft = {
	settimanale: (e) => ({
		tipo: "settimanale",
		ogni: 1,
		giorni: [],
		ancora: Re(e)
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
}, pt = {
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
}, mt = (e, t) => e.includes(t) ? e.filter((e) => e !== t) : [...e, t], ht = class extends j {
	constructor(...e) {
		super(...e), this._date = [], this._problemi = [], this._richiesta = 0, this._inCorso = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 },
			_date: { state: !0 },
			_problemi: { state: !0 },
			_inCorso: { state: !0 }
		};
	}
	chiudiEditor() {
		this._bozza = void 0;
	}
	_nuova(e) {
		let t = this.lettura.oggi;
		this._imposta({
			id: L(),
			tipologia: e,
			nome: "",
			ricorrenza: ft.settimanale(t),
			periodo: { tipo: "sempre" }
		});
	}
	_imposta(e) {
		e.id !== this._bozza?.id && (this._date = [], this._problemi = []), this._bozza = e, this._inCorso = !0, clearTimeout(this._timer), this._timer = window.setTimeout(() => void this._anteprima(), 250);
	}
	_candidata() {
		let e = Z(this.lettura.configurazione), t = e.regole.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nome: this._bozza.nome.trim()
		};
		return t >= 0 ? e.regole[t] = n : e.regole.push(n), e;
	}
	async _anteprima() {
		if (!this._bozza) return;
		let e = this._bozza.id, t = ++this._richiesta, n;
		try {
			n = await this.hass.callWS({
				type: `${dt}/anteprima`,
				configurazione: this._candidata(),
				giorni: 366
			});
		} catch {
			return;
		}
		t === this._richiesta && this._bozza?.id === e && (this._inCorso = !1, this._problemi = n.problemi.filter((e) => e.percorso.startsWith("regole")), this._date = n.ritiri.filter((t) => t.regole.includes(e)).slice(0, 4).map((e) => e.data));
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
	_valida(e) {
		let t = e.ricorrenza;
		return t.tipo === "settimanale" ? t.giorni.length > 0 : t.tipo === "mensile_posizione" ? t.posizioni.length > 0 : t.giorni.length > 0;
	}
	_elimina() {
		let e = Z(this.lettura.configurazione);
		e.regole = e.regole.filter((e) => e.id !== this._bozza.id), Y(this, e);
	}
	_editorRicorrenza(e) {
		let t = (t, n) => w`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			ricorrenza: ft[t](this.lettura.oggi)
		})}>${n}</button>`;
		return w`<div class="campo">
        <span class="etichetta">${W.ricorrenza}</span>
        <div class="segmenti">
          ${t("settimanale", W.ogniSettimane)} ${t("mensile_posizione", W.posizioneMese)}
          ${t("mensile_data", W.dataMese)}
        </div>
      </div>
      ${e.tipo === "settimanale" ? w`<div class="campo">
              <span class="etichetta">${W.ogniQuanteSettimane}</span>
              <div class="tonde otto" role="radiogroup" aria-label=${W.ogniQuanteSettimane}>
                ${[
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		].map((t) => w`<button role="radio" aria-checked=${e.ogni === t} class=${e.ogni === t ? "attivo" : ""} @click=${() => this._ricorrenza({ ogni: t })}>${t}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${W.neiGiorni}</span>
              <div class="tonde sette">
                ${H.map((t, n) => w`<button class=${e.giorni.includes(n) ? "attivo" : ""} aria-pressed=${e.giorni.includes(n)} aria-label=${V[n]} @click=${() => this._ricorrenza({ giorni: mt(e.giorni, n).sort() })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>
            ${e.ogni > 1 ? w`<div class="campo">
                  <label for="ancora">${W.ancora}</label>
                  <input id="ancora" type="date" .value=${e.ancora} @change=${(e) => this._ricorrenza({ ancora: e.target.value })} />
                  <small>${W.ancoraAiuto}</small>
                </div>` : E}` : E}
      ${e.tipo === "mensile_posizione" ? w`<div class="campo">
              <span class="etichetta">${W.quali}</span>
              <div class="tonde">
                ${[
			1,
			2,
			3,
			4,
			-1
		].map((t) => w`<button class=${e.posizioni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ posizioni: mt(e.posizioni, t) })}>${Be[t]}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${W.giornoSettimana}</span>
              <div class="tonde sette">
                ${H.map((t, n) => w`<button class=${e.giorno === n ? "attivo" : ""} @click=${() => this._ricorrenza({ giorno: n })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>` : E}
      ${e.tipo === "mensile_data" ? w`<div class="campo">
            <span class="etichetta">${W.giorniDelMese}</span>
            <div class="tonde calendario">
              ${Array.from({ length: 31 }, (e, t) => t + 1).map((t) => w`<button class=${e.giorni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ giorni: mt(e.giorni, t).sort((e, t) => e - t) })}>${t}</button>`)}
            </div>
          </div>` : E}`;
	}
	_meseGiorno(e, t) {
		let [n, r] = e.split("-").map(Number), i = (e, n) => t(`${String(e).padStart(2, "0")}-${String(n).padStart(2, "0")}`);
		return w`<div class="riga-campi">
      <select aria-label=${W.giorno} @change=${(e) => i(n, Number(e.target.value))}>
        ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => w`<option value=${e} ?selected=${e === r}>${e}</option>`)}
      </select>
      <select aria-label=${W.mese} @change=${(e) => i(Number(e.target.value), r)}>
        ${U.map((e, t) => w`<option value=${t + 1} ?selected=${t + 1 === n}>${e}</option>`)}
      </select>
    </div>`;
	}
	_editorPeriodo(e) {
		let t = (t, n) => w`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			periodo: pt[t](this.lettura.oggi)
		})}>${n}</button>`;
		return w`<div class="campo">
        <span class="etichetta">${W.periodo}</span>
        <div class="segmenti">${t("sempre", W.sempre)} ${t("annuale", W.annuale)} ${t("con_anno", W.conAnno)}</div>
      </div>
      ${e.tipo === "annuale" ? w`<div class="riga-campi">
            <div class="campo"><span class="etichetta">${W.dal}</span>${this._meseGiorno(e.dal, (e) => this._periodo({ dal: e }))}</div>
            <div class="campo"><span class="etichetta">${W.al}</span>${this._meseGiorno(e.al, (e) => this._periodo({ al: e }))}</div>
          </div>` : E}
      ${e.tipo === "con_anno" ? w`<div class="riga-campi">
            <div class="campo"><label>${W.dal}</label><input type="date" .value=${e.dal} @change=${(e) => this._periodo({ dal: e.target.value })} /></div>
            <div class="campo"><label>${W.al}</label><input type="date" .value=${e.al} @change=${(e) => this._periodo({ al: e.target.value })} /></div>
          </div>` : E}`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return E;
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = this.lettura.configurazione.regole.some((t) => t.id === e.id);
		return w`<rd-finestra aperta titolo=${`${n ? W.modifica : W.nuovaRegola} · ${t?.nome ?? ""}`} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="riepilogo" aria-live="polite">
          ${this._valida(e) ? q(e.ricorrenza) : W.completaLaRegola}
          <small>${We(e.periodo)}</small>
        </div>
        <div class="campo">
          <label for="nome">${W.nomeRegola}</label>
          <input id="nome" maxlength="40" .value=${e.nome} placeholder=${W.nomeRegolaAiuto} @input=${(t) => this._bozza = {
			...e,
			nome: t.target.value
		}} />
        </div>
        ${this._editorRicorrenza(e.ricorrenza)} ${this._editorPeriodo(e.periodo)}
        <div class="campo">
          <span class="etichetta">${W.prossimeDate}</span>
          ${this._problemi.length ? w`<div class="errori">${this._problemi.map((e) => w`<div>${J(e)}</div>`)}</div>` : this._date.length ? w`<div class="anteprima-date">${this._date.map((e) => w`<span>${K(e)}</span>`)}</div>` : w`<div class="aiuto">${W.nessunaData}</div>`}
        </div>
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${n ? w`<button class="bottone pericolo" @click=${this._elimina}>${W.elimina}</button>` : E}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${W.annulla}</button>
        <button class="bottone primario" ?disabled=${this._problemi.length > 0 || this._inCorso} @click=${() => Y(this, this._candidata())}>${W.salva}</button>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione;
		return w`<div class="riquadro">
        <h2>${W.pagine.regole}</h2>
        <p class="aiuto">${W.aiutoRegole}</p>
        ${e.tipologie.map((t) => {
			let n = e.regole.filter((e) => e.tipologia === t.id);
			return w`<section class="gruppo">
            <div class="titolo">${I(t)}</div>
            ${n.length ? n.map((e) => w`<button class="voce cliccabile" aria-label=${`${W.modifica}: ${e.nome || q(e.ricorrenza)}`} @click=${() => this._imposta(Z(e))}>
                    <div class="frase">
                      ${e.nome ? w`<b>${e.nome}</b> · ` : E}${q(e.ricorrenza)}
                      <small>${We(e.periodo)}</small>
                    </div>
                    <ha-icon class="freccia" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
                  </button>`) : w`<div class="vuoto">${W.nessunaRegola}</div>`}
            <button class="bottone piccolo" @click=${() => this._nuova(t.id)}><ha-icon icon="mdi:plus"></ha-icon>${W.nuovaRegola}</button>
          </section>`;
		})}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			M,
			F,
			N,
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
customElements.get("rd-regole") || customElements.define("rd-regole", ht);
//#endregion
//#region src/pannello/pagine/eccezioni.ts
var gt = "foyer_raccolta_differenziata", _t = (e) => e.tipo === "sposta" ? e.da : e.data, vt = class extends j {
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
			id: L(),
			tipo: e,
			tipologia: r,
			da: i,
			a: i,
			nota: ""
		} : {
			id: L(),
			tipo: e,
			tipologia: r,
			data: i,
			nota: ""
		}, this._problemi = [];
	}
	_candidata() {
		let e = Z(this.lettura.configurazione), t = e.eccezioni.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nota: (this._bozza.nota ?? "").trim()
		};
		return t >= 0 ? e.eccezioni[t] = n : e.eccezioni.push(n), e.eccezioni.sort((e, t) => _t(e).localeCompare(_t(t))), e;
	}
	async _salva() {
		let e = this._candidata(), t = await this.hass.callWS({
			type: `${gt}/anteprima`,
			configurazione: e
		});
		this._problemi = t.problemi, t.problemi.length || Y(this, e);
	}
	_elimina() {
		let e = Z(this.lettura.configurazione);
		e.eccezioni = e.eccezioni.filter((e) => e.id !== this._bozza.id), Y(this, e);
	}
	_aggiorna(e) {
		this._bozza = {
			...this._bozza,
			...e
		};
	}
	_data(e, t, n) {
		return w`<div class="campo">
      <label>${e}</label>
      <input type="date" .value=${n} @change=${(e) => this._aggiorna({ [t]: e.target.value })} />
    </div>`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return E;
		let t = this.lettura.configurazione.eccezioni.some((t) => t.id === e.id);
		return w`<rd-finestra aperta titolo=${{
			aggiungi: W.aggiungiRitiro,
			togli: W.togliRitiro,
			sposta: W.spostaRitiro
		}[e.tipo]} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${W.tipologia}</span>
          <div class="scelta-tipologie">
            ${this.lettura.configurazione.tipologie.map((t) => w`<button class=${t.id === e.tipologia ? "attivo" : ""} @click=${() => this._aggiorna({ tipologia: t.id })}>${I(t)}</button>`)}
          </div>
        </div>
        ${e.tipo === "sposta" ? w`<div class="riga-campi">${this._data(W.da, "da", e.da)} ${this._data(W.a, "a", e.a)}</div>` : this._data(W.data, "data", e.data)}
        <div class="campo">
          <label for="nota">${W.nota}</label>
          <input id="nota" maxlength="200" .value=${e.nota ?? ""} @input=${(e) => this._aggiorna({ nota: e.target.value })} />
        </div>
        ${this._problemi.length ? w`<div class="errori">${this._problemi.map((e) => w`<div>${J(e)}</div>`)}</div>` : E}
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? w`<button class="bottone pericolo" @click=${this._elimina}>${W.elimina}</button>` : E}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${W.annulla}</button>
        <button class="bottone primario" @click=${this._salva}>${W.salva}</button>
      </div>
    </rd-finestra>`;
	}
	_riga(e) {
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = e.tipo === "sposta" ? w`${K(e.da)} → ${K(e.a)}` : K(e.data);
		return w`<button class="voce cliccabile" aria-label=${W.modifica} @click=${() => (this._bozza = Z(e), this._problemi = [])}>
      <div class="frase">
        <span class="testa-eccezione"><span class="badge ${e.tipo}">${W.tipoEccezione[e.tipo]}</span>${t ? I(t) : E}</span>
        <b>${n}</b>${e.nota ? w`<small>${e.nota}</small>` : E}
      </div>
      <ha-icon class="freccia" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
    </button>`;
	}
	render() {
		let e = this.lettura.configurazione.eccezioni, t = this.lettura.oggi, n = (e) => e.tipo === "sposta" ? e.a > e.da ? e.a : e.da : e.data, r = e.filter((e) => n(e) >= t), i = e.filter((e) => n(e) < t);
		return w`<div class="riquadro">
        <h2>${W.pagine.eccezioni} <span class="conta">${r.length}</span></h2>
        <p class="aiuto">${W.aiutoEccezioni}</p>
        ${r.length ? r.map((e) => this._riga(e)) : w`<div class="vuoto">${W.nessunaEccezione}</div>`}
        <div class="riga-azioni">
          <button class="bottone primario" @click=${() => this._nuova("aggiungi")}><ha-icon icon="mdi:plus"></ha-icon>${W.aggiungiRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("togli")}><ha-icon icon="mdi:minus"></ha-icon>${W.togliRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("sposta")}><ha-icon icon="mdi:arrow-right"></ha-icon>${W.spostaRitiro}</button>
        </div>
        ${i.length ? w`<details @toggle=${(e) => this._passate = e.target.open}>
              <summary>${W.passate} (${i.length})</summary>
              ${this._passate ? i.map((e) => this._riga(e)) : E}
            </details>` : E}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			M,
			F,
			N,
			o`
      .testa-eccezione {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }
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
customElements.get("rd-eccezioni") || customElements.define("rd-eccezioni", vt);
//#endregion
//#region src/pannello/pagine/promemoria.ts
var yt = /* @__PURE__ */ new Set([
	"send_message",
	"persistent_notification",
	"notify"
]), bt = [
	10,
	15,
	20,
	30,
	45,
	60,
	90,
	120,
	180,
	240
], xt = {
	giorni_prima: () => ({
		tipo: "giorni_prima",
		giorni: 1,
		ora: "20:30"
	}),
	giorno_stesso: () => ({
		tipo: "giorno_stesso",
		ora: "06:30"
	}),
	apertura: () => ({ tipo: "apertura" })
}, St = (e) => `${e.tipo}:${e.id}`, Ct = (e) => {
	let [t, ...n] = e.split(":");
	return {
		tipo: t,
		id: n.join(":")
	};
}, wt = (e) => {
	let t = e.replaceAll("_", " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Tt = (e) => e.tipo === "servizio" && e.id.startsWith("mobile_app_"), Et = class extends j {
	constructor(...e) {
		super(...e), this._vacanza = {
			dal: "",
			al: ""
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 },
			_vacanza: { state: !0 }
		};
	}
	chiudiEditor() {
		this._bozza = void 0, this._vacanza = {
			dal: "",
			al: ""
		};
	}
	_disponibili() {
		let e = Object.keys(this.hass.services?.notify ?? {}).filter((e) => !yt.has(e)).map((e) => {
			let t = e.startsWith("mobile_app_");
			return {
				id: `servizio:${e}`,
				nome: wt(e.replace(/^mobile_app_/, "")),
				dettaglio: `notify.${e}`,
				etichetta: t ? W.conPulsanti : W.soloTesto,
				etichettaEvidente: t,
				icona: t ? "mdi:cellphone" : "mdi:message-text-outline",
				gruppo: t ? W.gruppoCompanion : W.gruppoServizi
			};
		}), t = Object.keys(this.hass.states ?? {}).filter((e) => e.startsWith("notify.")).map((e) => ({
			id: `entita:${e}`,
			nome: String(this.hass.states[e].attributes.friendly_name ?? e),
			dettaglio: e,
			etichetta: W.soloTesto,
			icona: "mdi:bell-badge-outline",
			gruppo: W.gruppoEntita
		})), n = [
			W.gruppoCompanion,
			W.gruppoServizi,
			W.gruppoEntita
		];
		return [...e, ...t].sort((e, t) => n.indexOf(e.gruppo) - n.indexOf(t.gruppo) || e.nome.localeCompare(t.nome));
	}
	_nuovo() {
		this._bozza = {
			id: L(),
			nome: "",
			attivo: !0,
			quando: xt.giorni_prima(),
			tipologie: null,
			destinatari: []
		};
	}
	_salvaProfilo() {
		let e = Z(this.lettura.configurazione), t = {
			...this._bozza,
			nome: this._bozza.nome.trim()
		}, n = e.promemoria.findIndex((e) => e.id === t.id);
		n >= 0 ? e.promemoria[n] = t : e.promemoria.push(t), Y(this, e);
	}
	_eliminaProfilo() {
		let e = Z(this.lettura.configurazione);
		e.promemoria = e.promemoria.filter((e) => e.id !== this._bozza.id), Y(this, e);
	}
	_attiva(e) {
		let t = Z(this.lettura.configurazione), n = t.promemoria.find((t) => t.id === e.id);
		n.attivo = !n.attivo, Y(this, t);
	}
	_solleciti(e) {
		let t = Z(this.lettura.configurazione);
		t.solleciti = {
			...t.solleciti,
			...e
		}, Y(this, t);
	}
	_aggiungiVacanza() {
		let { dal: e, al: t } = this._vacanza;
		if (!e || !t) return;
		let n = Z(this.lettura.configurazione);
		n.sospensioni = [...n.sospensioni, {
			dal: e,
			al: t
		}].sort((e, t) => e.dal.localeCompare(t.dal)), Y(this, n);
	}
	_togliVacanza(e) {
		let t = Z(this.lettura.configurazione);
		t.sospensioni = t.sospensioni.filter((t, n) => n !== e), Y(this, t);
	}
	_editor() {
		let e = this._bozza;
		if (!e) return E;
		let t = this.lettura.configurazione.promemoria.some((t) => t.id === e.id), n = this.lettura.configurazione.tipologie, r = (t) => this._bozza = {
			...e,
			...t
		}, i = e.quando, a = (e, t) => w`<button class=${i.tipo === e ? "attivo" : ""} @click=${() => i.tipo !== e && r({ quando: xt[e]() })}>${t}</button>`, o = this._disponibili(), s = e.nome.trim() && e.destinatari.length && (e.tipologie === null || e.tipologie.length);
		return w`<rd-finestra aperta titolo=${t && e.nome || W.nuovoPromemoria} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${W.nomePromemoria}</label>
          <input id="nome" maxlength="40" placeholder=${W.nomePromemoriaAiuto} .value=${e.nome} @input=${(e) => r({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${W.quando}</span>
          <div class="segmenti">${a("giorni_prima", W.giorniPrima)} ${a("giorno_stesso", W.giornoStesso)} ${a("apertura", W.apertura)}</div>
          ${i.tipo === "apertura" ? w`<small>${W.aperturaAiuto}</small>` : E}
        </div>
        ${i.tipo === "giorni_prima" ? w`<div class="campo">
              <span class="etichetta">${W.quantiGiorni}</span>
              <div class="tonde">${[
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].map((e) => w`<button class=${i.giorni === e ? "attivo" : ""} @click=${() => r({ quando: {
			...i,
			giorni: e
		} })}>${e}</button>`)}</div>
            </div>` : E}
        ${i.tipo === "apertura" ? E : w`<div class="campo">
              <label for="ora">${W.alle}</label>
              <input id="ora" type="time" .value=${i.ora} @change=${(e) => r({ quando: {
			...i,
			ora: e.target.value
		} })} />
            </div>`}
        <div class="campo">
          <span class="etichetta">${W.perQuali}</span>
          <div class="scelta">
            <button class="tutte ${e.tipologie === null ? "attivo" : ""}" @click=${() => r({ tipologie: e.tipologie === null ? n.map((e) => e.id) : null })}>${W.tutte}</button>
            ${n.map((t) => w`<button class=${e.tipologie === null || e.tipologie.includes(t.id) ? "attivo" : ""} @click=${() => {
			let i = e.tipologie ?? n.map((e) => e.id);
			r({ tipologie: i.includes(t.id) ? i.filter((e) => e !== t.id) : [...i, t.id] });
		}}>${I(t)}</button>`)}
          </div>
          <small>${W.tutteAiuto}</small>
        </div>
        <div class="campo">
          <span class="etichetta">${W.destinatari}</span>
          ${o.length || e.destinatari.length ? w`<rd-selettore
                multiplo
                .opzioni=${o}
                .scelti=${e.destinatari.map(St)}
                etichetta=${W.destinatari}
                segnaposto=${W.cercaDestinatario}
                vuoto=${W.nessunDestinatarioScelto}
                @cambia=${(e) => r({ destinatari: e.detail.map(Ct) })}
              ></rd-selettore>` : w`<div class="aiuto">${W.nessunDestinatario}</div>`}
          <small>${W.destinatariAiuto}</small>
        </div>
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? w`<button class="bottone pericolo" @click=${this._eliminaProfilo}>${W.elimina}</button>` : E}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${W.annulla}</button>
        <button class="bottone primario" ?disabled=${!s} @click=${this._salvaProfilo}>${W.salva}</button>
      </div>
    </rd-finestra>`;
	}
	_riepilogo(e) {
		let t = this.lettura.configurazione.tipologie, n = e.tipologie === null ? W.tutte : e.tipologie.map((e) => t.find((t) => t.id === e)?.nome ?? e).join(", "), r = e.destinatari.filter(Tt).length;
		return w`${n} · ${e.destinatari.length} ${e.destinatari.length === 1 ? "destinatario" : "destinatari"}${r ? w` · ${r} con pulsanti` : E}`;
	}
	render() {
		let e = this.lettura.configurazione, t = e.solleciti;
		return w`<div class="griglia-2">
        <div>
          <div class="riquadro">
            <h2>${W.pagine.promemoria} <span class="conta">${e.promemoria.length}</span></h2>
            <p class="aiuto">${W.aiutoPromemoria}</p>
            ${e.promemoria.length ? e.promemoria.map((e) => w`<div class="voce ${e.attivo ? "" : "spento"}">
                    <button class="apri" aria-label=${`${W.modifica}: ${e.nome}`} @click=${() => this._bozza = Z(e)}>
                      <ha-icon class="campana" icon=${e.attivo ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}></ha-icon>
                      <div class="frase"><b>${e.nome}</b> · ${$e(e.quando)}<small>${this._riepilogo(e)}</small></div>
                    </button>
                    <button class="levetta ${e.attivo ? "acceso" : ""}" role="switch" aria-checked=${e.attivo} aria-label=${`${W.attivo}: ${e.nome}`} @click=${() => this._attiva(e)}></button>
                  </div>`) : w`<div class="vuoto">${W.nessunPromemoria}</div>`}
            <div class="riga-azioni">
              <button class="bottone primario" @click=${this._nuovo}><ha-icon icon="mdi:plus"></ha-icon>${W.nuovoPromemoria}</button>
            </div>
          </div>
          <div class="riquadro">
            <h2>${W.solleciti}</h2>
            <div class="interruttore">
              <div>${W.sollecitaSeNonConfermo}<small>${W.sollecitiAiuto}</small></div>
              <button class="levetta ${t.attivi ? "acceso" : ""}" role="switch" aria-checked=${t.attivi} aria-label=${W.sollecitaSeNonConfermo} @click=${() => this._solleciti({ attivi: !t.attivi })}></button>
            </div>
            ${t.attivi ? w`<div class="riga-campi">
                  <div class="campo">
                    <span class="etichetta">${W.richiami}</span>
                    <div class="segmenti">${[1, 2].map((e) => w`<button class=${t.richiami === e ? "attivo" : ""} @click=${() => this._solleciti({ richiami: e })}>${e}</button>`)}</div>
                  </div>
                  <div class="campo">
                    <label for="minuti">${W.ogniMinuti}</label>
                    <select id="minuti" @change=${(e) => this._solleciti({ richiamo_dopo: Number(e.target.value) })}>
                      ${bt.map((e) => w`<option value=${e} ?selected=${t.richiamo_dopo === e}>${W.minuti(e)}</option>`)}
                    </select>
                  </div>
                </div>` : E}
          </div>
        </div>
        <div class="riquadro">
          <h2>${W.vacanze}</h2>
          <p class="aiuto">${W.vacanzeAiuto}</p>
          ${e.sospensioni.length ? e.sospensioni.map((e, t) => w`<div class="voce">
                  <ha-icon icon="mdi:beach"></ha-icon>
                  <div class="frase">${W.dalAl(e.dal, e.al)}</div>
                  <button class="bottone piccolo" @click=${() => this._togliVacanza(t)}>${W.togli}</button>
                </div>`) : w`<div class="vuoto">${W.nessunaVacanza}</div>`}
          <div class="riga-campi vacanza">
            <div class="campo"><label>${W.dal}</label><input type="date" .value=${this._vacanza.dal} @change=${(e) => this._vacanza = {
			...this._vacanza,
			dal: e.target.value
		}} /></div>
            <div class="campo"><label>${W.al}</label><input type="date" .value=${this._vacanza.al} @change=${(e) => this._vacanza = {
			...this._vacanza,
			al: e.target.value
		}} /></div>
          </div>
          <div class="riga-azioni">
            <button class="bottone" ?disabled=${!this._vacanza.dal || !this._vacanza.al} @click=${this._aggiungiVacanza}><ha-icon icon="mdi:plus"></ha-icon>${W.aggiungiVacanza}</button>
          </div>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			M,
			F,
			N,
			o`
      .voce.spento .apri {
        opacity: 0.6;
      }
      .apri {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 0;
        background: none;
        padding: 0;
        text-align: left;
        cursor: pointer;
      }
      .campana {
        color: var(--rd-primario);
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .interruttore {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 12px;
      }
      .interruttore small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .scelta {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .scelta button {
        border: 2px solid transparent;
        background: none;
        border-radius: 999px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.45;
      }
      .scelta button.attivo {
        opacity: 1;
        border-color: var(--rd-primario);
      }
      .scelta .tutte {
        padding: 3px 12px;
        border: 1px solid var(--rd-bordo);
        font-weight: 600;
        font-size: 13px;
      }
      .scelta .tutte.attivo {
        background: var(--rd-primario);
        color: var(--text-primary-color, #fff);
      }
      .destinatari {
        display: grid;
        gap: 6px;
      }
      .destinatario {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        cursor: pointer;
      }
      .destinatario input {
        width: auto;
      }
      .destinatario .nome {
        flex: 1;
        text-transform: capitalize;
      }
      .etichetta-tipo {
        font-size: 11.5px;
        color: var(--rd-testo-2);
        border: 1px solid var(--rd-bordo);
        border-radius: 6px;
        padding: 1px 6px;
      }
      .etichetta-tipo.pulsanti {
        color: var(--rd-primario);
        border-color: var(--rd-primario);
      }
      .vacanza {
        margin-top: 12px;
      }
    `
		];
	}
};
customElements.get("rd-promemoria") || customElements.define("rd-promemoria", Et);
//#endregion
//#region src/pannello/pagine/impostazioni.ts
var Dt = "foyer_raccolta_differenziata", Ot = 1048576, kt = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", At = 30;
async function jt(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
var Mt = class extends j {
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 },
			_importazione: { state: !0 }
		};
	}
	willUpdate(e) {
		if (!e.has("lettura")) return;
		let t = !this._bozza || JSON.stringify(this._bozza) === this._base;
		this._revisione !== this.lettura.revisione && t && (this._bozza = Z(this.lettura.configurazione), this._base = JSON.stringify(this._bozza), this._revisione = this.lettura.revisione);
	}
	async _barra() {
		await this.hass.callWS({
			type: `${Dt}/barra_laterale`,
			mostra: !this.lettura.mostra_barra_laterale
		}), rt(this);
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
	async _scarica(e) {
		try {
			let { path: t } = await this.hass.callWS({
				type: "auth/sign_path",
				path: `/api/${Dt}/excel${e ? "?modello=1" : ""}`
			}), n = document.createElement("a");
			n.href = t, n.download = "", document.body.append(n), n.click(), n.remove();
		} catch {
			nt(this, W.scaricamentoFallito);
		}
	}
	_scegliFile(e) {
		let t = e.target.files?.[0];
		t && this._importazione && (this._importazione = {
			...this._importazione,
			file: t,
			errori: []
		});
	}
	async _importa() {
		let e = this._importazione;
		if (e?.file && e.modo && !e.occupato) {
			if (e.file.size > Ot) {
				this._importazione = {
					...e,
					errori: [{
						foglio: "",
						riga: null,
						colonna: null,
						codice: "file_troppo_grande"
					}]
				};
				return;
			}
			this._importazione = {
				...e,
				occupato: !0,
				errori: []
			};
			try {
				let t = await this.hass.callWS({
					type: `${Dt}/excel/importa`,
					contenuto: await jt(e.file),
					modo: e.modo
				});
				if (t.configurazione) {
					this._importazione = void 0, Y(this, t.configurazione, t.riepilogo);
					return;
				}
				this._importazione = {
					...e,
					occupato: !1,
					errori: t.errori
				};
			} catch {
				this._importazione = {
					...e,
					occupato: !1
				}, nt(this, W.erroreConnessione);
			}
		}
	}
	_finestraImportazione() {
		let e = this._importazione;
		if (!e) return E;
		let t = (t, n, r) => w`<button
      class="modo ${e.modo === t ? "attivo" : ""}"
      role="radio"
      aria-checked=${e.modo === t}
      @click=${() => this._importazione = {
			...e,
			modo: t,
			errori: []
		}}
    >
      <span class="pallino" aria-hidden="true"></span>
      <span><b>${n}</b><small>${r}</small></span>
    </button>`, n = e.errori.length - At;
		return w`<rd-finestra aperta titolo=${W.importaTitolo} @chiudi=${() => this._importazione = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${W.scegliFile}</span>
          <label class="file">
            <input type="file" accept=".xlsx,${kt}" @change=${this._scegliFile} />
            <ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>
            <span class="nome-file">${e.file?.name ?? W.nessunFile}</span>
            <span class="bottone piccolo">${e.file ? W.cambiaFile : W.scegliFile}</span>
          </label>
        </div>
        <div class="campo">
          <span class="etichetta">${W.comeImportare}</span>
          <div class="modi" role="radiogroup" aria-label=${W.comeImportare}>
            ${t("sostituisci", W.sostituisci, W.sostituisciAiuto)}
            ${t("aggiungi", W.aggiungiSoltanto, W.aggiungiSoltantoAiuto)}
          </div>
        </div>
        ${e.errori.length ? w`<div class="errori-file" role="alert">
              <b>${W.fileConProblemi}</b>
              <ul>
                ${e.errori.slice(0, At).map((e) => {
			let t = Je(e);
			return w`<li>${t ? w`<span class="luogo">${t}</span>` : E}${qe(e)}</li>`;
		})}
              </ul>
              ${n > 0 ? w`<small>${W.altriProblemi(n)}</small>` : E}
            </div>` : E}
      </div>
      <div class="azioni-modulo" slot="azioni">
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._importazione = void 0}>${W.annulla}</button>
        <button class="bottone primario" ?disabled=${!e.file || !e.modo || e.occupato} @click=${this._importa}>
          ${e.occupato ? W.leggoIlFile : W.continua}
        </button>
      </div>
    </rd-finestra>`;
	}
	chiudiEditor() {
		this._base = void 0, this._bozza = void 0;
	}
	_salva() {
		let e = Z(this._bozza);
		e.patrono && !e.patrono.nome.trim() && (e.patrono = null), e.patrono && (e.patrono.nome = e.patrono.nome.trim()), e.valido_fino_al ||= null, Y(this, e);
	}
	render() {
		let e = this._bozza;
		if (!e) return w``;
		let [t, n] = (e.patrono?.data ?? "01-01").split("-").map(Number), r = (e, t) => this._patrono({ data: `${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}` }), i = JSON.stringify(e) !== this._base;
		return w`<div class="colonna">
      <div class="riquadro">
        <h2>${W.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${W.mostraBarra}<small>${W.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${W.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${W.esposizione}</h2>
        <p class="aiuto">${W.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${W.dalle}</label><input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._finestra({ inizio_ora: e.target.value })} /></div>
            <div class="campo">
              <label>${W.del}</label>
              <select @change=${(e) => this._finestra({ inizio_giorno: e.target.value })}>
                ${["giorno_prima", "giorno_stesso"].map((t) => w`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${W.inizioGiorno[t]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${W.entroLe}</label><input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._finestra({ fine_ora: e.target.value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${W.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${W.validita}</label>
            <input id="validita" type="date" .value=${e.valido_fino_al ?? ""} @change=${(t) => this._bozza = {
			...e,
			valido_fino_al: t.target.value || null
		}} />
            <small>${W.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${W.patrono}</span>
            <div class="patrono">
              <input aria-label=${W.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${e.patrono?.nome ?? ""} @input=${(e) => this._patrono({ nome: e.target.value })} />
              <select aria-label=${W.giorno} @change=${(e) => r(t, Number(e.target.value))}>
                ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => w`<option value=${e} ?selected=${e === n}>${e}</option>`)}
              </select>
              <select aria-label=${W.mese} @change=${(e) => r(Number(e.target.value), n)}>
                ${U.map((e, n) => w`<option value=${n + 1} ?selected=${n + 1 === t}>${e}</option>`)}
              </select>
            </div>
            <small>${W.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!i} @click=${() => {
			this._bozza = Z(this.lettura.configurazione), this._base = JSON.stringify(this._bozza), this._revisione = this.lettura.revisione;
		}}>${W.annulla}</button>
        <button class="bottone primario" ?disabled=${!i} @click=${this._salva}>${W.salva}</button>
      </div>

      <div class="riquadro excel">
        <h2><ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>${W.excel}</h2>
        <p class="aiuto">${W.excelAiuto}</p>
        <div class="azioni-excel">
          <button class="bottone" @click=${() => this._scarica(!0)}>
            <ha-icon icon="mdi:file-download-outline" aria-hidden="true"></ha-icon>${W.scaricaModello}
          </button>
          <button class="bottone" ?disabled=${this.lettura.problemi.length > 0} @click=${() => this._scarica(!1)}>
            <ha-icon icon="mdi:table-arrow-down" aria-hidden="true"></ha-icon>${W.esporta}
          </button>
          <button class="bottone primario" @click=${() => this._importazione = {
			errori: [],
			occupato: !1
		}}>
            <ha-icon icon="mdi:table-arrow-up" aria-hidden="true"></ha-icon>${W.importa}
          </button>
        </div>
        ${this.lettura.problemi.length ? w`<small class="avviso-excel">${W.esportaNonValida}</small>` : E}
      </div>
    </div>
    ${this._finestraImportazione()}`;
	}
	static {
		this.styles = [
			M,
			F,
			N,
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
      @media (max-width: 560px) {
        .patrono {
          grid-template-columns: 1fr 1.6fr;
        }
        .patrono input {
          grid-column: 1 / -1;
        }
      }
      .azioni-modulo {
        margin-top: 16px;
      }
      .excel {
        margin-top: 24px;
      }
      .excel h2 {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .excel h2 ha-icon {
        --mdc-icon-size: 22px;
        color: var(--rd-primario);
      }
      .azioni-excel {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .azioni-excel .bottone {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .azioni-excel ha-icon {
        --mdc-icon-size: 18px;
      }
      .avviso-excel {
        display: block;
        margin-top: 8px;
        color: var(--rd-errore);
      }
      @media (max-width: 560px) {
        .azioni-excel .bottone {
          flex: 1 1 100%;
          justify-content: center;
        }
      }
      .campo > label.file {
        position: relative;
        display: flex;
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: var(--rd-testo);
        align-items: center;
        gap: 10px;
        border: 1px dashed var(--rd-bordo);
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
      }
      .file:focus-within {
        outline: 2px solid var(--rd-primario);
        outline-offset: 2px;
      }
      .file input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
      }
      .file ha-icon {
        color: var(--rd-primario);
        flex: none;
      }
      .nome-file {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .modi {
        display: grid;
        gap: 8px;
      }
      .modo {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        text-align: left;
        border: 1px solid var(--rd-bordo);
        border-radius: 12px;
        background: none;
        color: inherit;
        font: inherit;
        padding: 12px;
        cursor: pointer;
      }
      .modo small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .modo.attivo {
        border-color: var(--rd-primario);
        background: color-mix(in srgb, var(--rd-primario) 8%, transparent);
      }
      .pallino {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid var(--rd-testo-2);
        flex: none;
        margin-top: 1px;
        box-sizing: border-box;
      }
      .modo.attivo .pallino {
        border: 5px solid var(--rd-primario);
      }
      .errori-file {
        background: color-mix(in srgb, var(--rd-errore) 10%, transparent);
        border-radius: 12px;
        padding: 10px 14px;
      }
      .errori-file b {
        color: var(--rd-errore);
      }
      .errori-file ul {
        margin: 6px 0 0;
        padding-left: 18px;
      }
      .errori-file li {
        margin: 3px 0;
      }
      .luogo {
        font-weight: 600;
        margin-right: 6px;
      }
      .luogo::after {
        content: ":";
      }
    `
		];
	}
};
customElements.get("rd-impostazioni") || customElements.define("rd-impostazioni", Mt);
//#endregion
//#region src/pannello/raccolta-pannello.ts
var $ = "foyer_raccolta_differenziata", Nt = [
	"panoramica",
	"tipologie",
	"regole",
	"eccezioni",
	"promemoria",
	"impostazioni"
], Pt = class extends j {
	constructor(...e) {
		super(...e), this.narrow = !1, this._pagina = "panoramica", this._problemi = [], this._occupato = !1;
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
			_precompila: { state: !0 },
			_occupato: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback();
		let e = new URLSearchParams(location.search).get("pagina");
		e && Nt.includes(e) && (this._pagina = e);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._disiscrivi?.then((e) => e()).catch(() => void 0), this._disiscrivi = void 0;
	}
	updated(e) {
		e.has("_pagina") && this.renderRoot.querySelector(".schede button.attiva")?.scrollIntoView({
			block: "nearest",
			inline: "nearest"
		}), e.has("hass") && this.hass && !this._disiscrivi && (this._carica(), this._disiscrivi = this.hass.connection.subscribeMessage(() => void this._carica(), { type: `${$}/iscriviti` }).catch(() => () => void 0));
	}
	async _carica() {
		try {
			this._lettura = await this.hass.callWS({ type: `${$}/config/leggi` }), this._errore = void 0;
		} catch {
			this._errore = W.nonCaricata;
		}
	}
	_mostraAvviso(e) {
		this._avviso = e, clearTimeout(this._timerAvviso), this._timerAvviso = window.setTimeout(() => this._avviso = void 0, 4e3);
	}
	async _proponi(e) {
		e.stopPropagation();
		let { configurazione: t, riepilogo: n } = e.detail;
		try {
			let e = await this.hass.callWS({
				type: `${$}/anteprima`,
				configurazione: t
			});
			this._problemi = e.problemi, this._inAttesa = {
				candidata: t,
				anteprima: e,
				riepilogo: n
			};
		} catch {
			this._mostraAvviso(W.erroreConnessione);
		}
	}
	async _salva() {
		if (!this._inAttesa || this._occupato) return;
		this._occupato = !0;
		let e;
		try {
			e = await this.hass.callWS({
				type: `${$}/config/salva`,
				configurazione: this._inAttesa.candidata,
				revisione: this._inAttesa.candidata.revisione
			});
		} catch {
			this._mostraAvviso(W.erroreConnessione);
			return;
		} finally {
			this._occupato = !1;
		}
		if (e.salvato) {
			this._inAttesa = void 0, this._problemi = [], await this._carica(), this._mostraAvviso(W.salvato), this._chiudiEditor();
			return;
		}
		if (e.problemi.some((e) => e.codice === "revisione_superata")) {
			this._inAttesa = void 0, await this._carica(), this._mostraAvviso(W.altroHaSalvato);
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
		if (!e) return E;
		let t = e.candidata.tipologie, n = (e, n) => {
			let r = t.find((e) => e.id === n.tipologia) ?? this._lettura?.configurazione.tipologie.find((e) => e.id === n.tipologia);
			return w`<div class="differenza">
        <span class="segno ${e === "+" ? "piu" : "meno"}">${e}</span>
        <b>${K(n.data)}</b>
        ${r ? I(r) : n.tipologia}
      </div>`;
		}, { aggiunti: r, tolti: i } = e.anteprima.differenze, a = [...r.map((e) => ({
			...e,
			segno: "+"
		})), ...i.map((e) => ({
			...e,
			segno: "−"
		}))].sort((e, t) => e.data.localeCompare(t.data)), o = Object.entries(e.riepilogo ?? {}).map(([e, t]) => Xe(e, t)).filter((e) => e !== null);
		return w`<rd-finestra aperta titolo=${W.primaDiSalvare} @chiudi=${() => this._inAttesa = void 0}>
      ${e.riepilogo && !this._problemi.length ? w`<div class="riepilogo">
            <b>${W.dalFile}</b>
            ${o.length ? w`<ul>${o.map((e) => w`<li>${e}</li>`)}</ul>` : w`<p>${W.nienteDalFile}</p>`}
          </div>` : E}
      ${this._problemi.length ? w`<div class="errori">
            ${W.nonSalvato}
            <ul>
              ${this._problemi.map((e) => w`<li>${J(e)}</li>`)}
            </ul>
          </div>` : w`<p class="aiuto">${a.length ? W.cosaCambia : W.nienteCambia}</p>
            <div class="differenze">${a.slice(0, 40).map((e) => n(e.segno, e))}</div>`}
      <div class="azioni-finestra" slot="azioni">
        <button class="bottone" @click=${() => this._inAttesa = void 0}>${W.annulla}</button>
        ${this._problemi.length ? E : w`<button class="bottone primario" ?disabled=${this._occupato} @click=${this._salva}>${W.salva}</button>`}
      </div>
    </rd-finestra>`;
	}
	_paginaCorrente() {
		let e = this._lettura;
		switch (this._pagina) {
			case "tipologie": return w`<rd-tipologie .hass=${this.hass} .lettura=${e}></rd-tipologie>`;
			case "regole": return w`<rd-regole .hass=${this.hass} .lettura=${e}></rd-regole>`;
			case "eccezioni": return w`<rd-eccezioni .hass=${this.hass} .lettura=${e} .precompila=${this._precompila}></rd-eccezioni>`;
			case "promemoria": return w`<rd-promemoria .hass=${this.hass} .lettura=${e}></rd-promemoria>`;
			case "impostazioni": return w`<rd-impostazioni .hass=${this.hass} .lettura=${e}></rd-impostazioni>`;
			default: return w`<rd-panoramica .hass=${this.hass} .lettura=${e}></rd-panoramica>`;
		}
	}
	render() {
		return w`
      <header class="testata">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="simbolo">${et}</span>
        <h1>${W.titolo}</h1>
      </header>
      <nav class="schede" role="tablist">
        ${Nt.map((e) => w`<button
            role="tab"
            aria-selected=${e === this._pagina}
            class=${e === this._pagina ? "attiva" : ""}
            @click=${() => {
			this._pagina = e, this._precompila = void 0;
		}}
          >
            ${W.pagine[e]}
          </button>`)}
      </nav>
      <main
        class="pagina"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @ricarica=${() => void this._carica()}
        @avvisa=${(e) => this._mostraAvviso(e.detail)}
      >
        ${this._errore ? w`<div class="vuoto">${this._errore}</div>` : this._lettura ? this._paginaCorrente() : w`<div class="vuoto">${W.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._avviso ? w`<div class="avviso" role="status">${this._avviso}</div>` : E}
    `;
	}
	static {
		this.styles = [M, o`
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
      }
      .riepilogo {
        background: color-mix(in srgb, var(--rd-primario) 8%, transparent);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 8px;
      }
      .riepilogo ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .riepilogo p {
        margin: 4px 0 0;
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
customElements.get("foyer-raccolta-pannello") || customElements.define("foyer-raccolta-pannello", Pt);
//#endregion
export { Pt as RaccoltaPannello };
