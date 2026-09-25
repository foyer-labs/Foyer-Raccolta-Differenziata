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
var h = globalThis, le = (e) => e, g = h.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", ge = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, S = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, Se = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Se(1), Ce = Se(2), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), E = v.createTreeWalker(v, 129);
function Te(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ve : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = S : o === _e || o === ve ? o = x : (o = S, i = void 0);
		let d = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, D = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ee(t, n);
		if (this.el = e.createElement(l, r), E.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = E.nextNode()) !== null && c.length < s;) {
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
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), E.nextNode(), c.push({
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
function O(e, t, n = e, r) {
	if (t === w) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = O(e, i._$AS(e, t.values), i, r)), t;
}
var De = class {
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
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new k(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, k = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = O(this, e, t), b(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== w && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = D.createElement(Te(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new De(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = we.get(e.strings);
		return t === void 0 && we.set(e.strings, t = new D(e)), t;
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
		this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = T;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = O(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = O(this, r[n + o], t, o), s === w && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Oe = class extends A {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, ke = class extends A {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, Ae = class extends A {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = O(this, e, t, 0) ?? T) === w) return;
		let n = this._$AH, r = e === T && n !== T || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== T && (n === T || r);
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
		O(this, e);
	}
}, Me = h.litHtmlPolyfillSupport;
Me?.(D, k), (h.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new k(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, j = globalThis, M = class extends m {
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
		return w;
	}
};
M._$litElement$ = !0, M.finalized = !0, j.litElementHydrateSupport?.({ LitElement: M });
var Pe = j.litElementPolyfillSupport;
Pe?.({ LitElement: M }), (j.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/comune/stili.ts
var N = o`
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
`, P = o`
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
function F(e) {
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
var I = o`
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
`, L = (e) => C`<span class="chip" style="background:${e.colore};color:${F(e.colore)}"
    ><ha-icon .icon=${e.icona}></ha-icon>${e.nome}</span
  >`, R = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^0-9a-f]/gi, "").slice(0, 32), z = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Fe = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, Ie = (e, t) => {
	let n = z(e);
	return n.setDate(n.getDate() + t), Fe(n);
}, Le = (e) => (z(e).getDay() + 6) % 7, Re = (e, t) => Math.round((z(t).getTime() - z(e).getTime()) / 864e5), ze = (e) => Ie(e, -Le(e)), Be = [
	"lunedì",
	"martedì",
	"mercoledì",
	"giovedì",
	"venerdì",
	"sabato",
	"domenica"
], B = [
	"Lun",
	"Mar",
	"Mer",
	"Gio",
	"Ven",
	"Sab",
	"Dom"
], V = [
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
], Ve = {
	1: "primo",
	2: "secondo",
	3: "terzo",
	4: "quarto",
	[-1]: "ultimo"
}, He = {
	1: "1°",
	2: "2°",
	3: "3°",
	4: "4°",
	[-1]: "Ultimo"
}, H = {
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
	validoFino: (e) => `fino al ${U(e)}`,
	scaduto: (e) => `scaduto il ${U(e)}: i ritiri successivi sono da verificare`,
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
	togli: "Togli",
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
	dalAl: (e, t) => `dal ${U(e)} al ${U(t)}`,
	card: {
		titolo: "Raccolta",
		nonDisponibile: "Il calendario della raccolta non è disponibile. Controlla Riparazioni in Impostazioni.",
		staseraFuori: "Stasera fuori",
		daEsporreOra: "Da esporre ora",
		oggi: "Oggi",
		domani: "Domani",
		prossimo: "Prossimo ritiro",
		entroLe: (e, t) => `entro le ${e}${t ? "" : " di domani"}`,
		dalle: (e) => `da mettere fuori dalle ${e}`,
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
function U(e) {
	let t = z(e);
	return `${t.getDate()} ${V[t.getMonth()]} ${t.getFullYear()}`;
}
function W(e) {
	let t = z(e);
	return `${B[Le(e)].toLowerCase()} ${t.getDate()} ${V[t.getMonth()].slice(0, 3)}`;
}
function Ue(e) {
	let t = z(e);
	return `${t.getDate()} ${V[t.getMonth()].slice(0, 3)}`;
}
var We = (e) => e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} e ${e[e.length - 1]}`;
function Ge(e) {
	if (e.tipo === "settimanale") {
		let t = We([...e.giorni].sort().map((e) => Be[e]));
		return e.ogni === 1 ? `Ogni settimana, il ${t}` : e.ogni === 2 ? `Una settimana sì e una no, il ${t}` : `Ogni ${e.ogni} settimane, il ${t}`;
	}
	return e.tipo === "mensile_posizione" ? `Il ${We([...e.posizioni].sort((e, t) => (e === -1 ? 9 : e) - (t === -1 ? 9 : t)).map((e) => Ve[e]))} ${Be[e.giorno]} del mese` : `Il giorno ${We([...e.giorni].sort((e, t) => e - t).map(String))} di ogni mese`;
}
var Ke = (e) => {
	let [t, n] = e.split("-").map(Number);
	return `${n} ${V[t - 1]}`;
};
function qe(e) {
	return e.tipo === "sempre" ? "Tutto l'anno" : e.tipo === "annuale" ? `Dal ${Ke(e.dal)} al ${Ke(e.al)}, ogni anno` : `Dal ${U(e.dal)} al ${U(e.al)}`;
}
var Je = {
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
}, G = (e) => Je[e.codice] ?? e.codice;
function Ye(e, t) {
	let n = e.tipologia ? t(e.tipologia) : "", r = e.intervalli.map(([e, t]) => e === t ? U(e) : `dal ${U(e)} al ${U(t)}`).join(", ");
	switch (e.codice) {
		case "ritiro_festivo": return `${n}: ${U(e.data)} è un giorno festivo. Controlla cosa fa il comune.`;
		case "sovrapposizione_mista": return `${n}: la regola «${t(e.regole[0])}» cede a «${t(e.regole[1])}» ${r}.`;
		case "sovrapposizione_stesso_tipo": return `${n}: le regole «${t(e.regole[0])}» e «${t(e.regole[1])}» generano gli stessi ${e.conteggio} ritiri ${r}. Una delle due è di troppo?`;
		case "eccezione_senza_ritiro": return `${n}: il ${U(e.data)} non c'è un ritiro da togliere o spostare.`;
		case "eccezione_ridondante": return `${n}: il ${U(e.data)} il ritiro c'è già; l'eccezione non cambia nulla.`;
		case "giorno_inesistente": return `${n}: nei mesi senza il giorno ${e.giorni.join(" o ")} la regola «${t(e.regole[0])}» non genera il ritiro.`;
		case "tipologia_senza_ritiri": return `${n} non ha ritiri nei prossimi 12 mesi.`;
		case "calendario_in_scadenza": return `Il calendario vale fino al ${U(e.data)}: controlla quello nuovo del comune.`;
		case "calendario_scaduto": return `Il calendario è scaduto il ${U(e.data)}: i ritiri successivi sono da verificare.`;
		default: return e.codice;
	}
}
var Xe = (e) => e.nome || Ge(e.ricorrenza);
function Ze(e) {
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
var Qe = Ce`<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%">
  <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 13.5 V9 H38 V13.5"/><path d="M10 14.5 H54"/><path d="M13.5 20 L17 57 H47 L50.5 20 Z"/>
    <polyline points="21,34 32,25 43,34" opacity="0.5"/><polyline points="25.5,40.5 32,35 38.5,40.5"/>
  </g>
  <rect x="28.5" y="46.5" width="7" height="7" fill="#F0A835"/><circle cx="32" cy="46.5" r="3.5" fill="#F0A835"/>
</svg>`, $e = class extends M {
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
		this.styles = [N, o`
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
		return C`<div
      class="velo"
      @click=${(e) => e.target === e.currentTarget && this._chiudi()}
      @keydown=${(e) => e.key === "Escape" && this._chiudi()}
    >
      <div class="dialogo" role="dialog" aria-modal="true" aria-label=${this.titolo}>
        <header>
          <h3>${this.titolo}</h3>
          <button aria-label=${H.chiudi} @click=${this._chiudi}><ha-icon icon="mdi:close"></ha-icon></button>
        </header>
        <div class="contenuto"><slot></slot></div>
      </div>
    </div>`;
	}
};
customElements.get("rd-finestra") || customElements.define("rd-finestra", $e);
//#endregion
//#region src/pannello/contesto.ts
var K = (e, t) => e.dispatchEvent(new CustomEvent("proponi", {
	detail: t,
	bubbles: !0,
	composed: !0
})), q = (e, t, n) => e.dispatchEvent(new CustomEvent("naviga", {
	detail: {
		pagina: t,
		precompila: n
	},
	bubbles: !0,
	composed: !0
})), et = (e) => e.dispatchEvent(new CustomEvent("ricarica", {
	bubbles: !0,
	composed: !0
})), J = (e) => JSON.parse(JSON.stringify(e)), tt = "foyer_raccolta_differenziata", nt = class extends M {
	constructor(...e) {
		super(...e), this._nome = (e) => {
			let t = this.lettura.configurazione, n = t.tipologie.find((t) => t.id === e);
			if (n) return n.nome;
			let r = t.regole.find((t) => t.id === e);
			return r ? Xe(r) : e;
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
			type: `${tt}/ritiri`,
			dal: e,
			al: Ie(e, 29)
		});
	}
	async _ignora(e) {
		await this.hass.callWS({
			type: `${tt}/anomalie/ignora`,
			data: e.data,
			tipologia: e.tipologia
		}), et(this);
	}
	_festivi() {
		let e = new Set(this.lettura.festivi_ignorati.map((e) => `${e.data}|${e.tipologia}`));
		return (this._ritiri?.ritiri ?? []).filter((t) => t.festivo && !e.has(`${t.data}|${t.tipologia}`));
	}
	_azioni(e) {
		switch (e.codice) {
			case "tipologia_senza_ritiri": return C`<button class="bottone piccolo" @click=${() => q(this, "eccezioni", {
				tipo: "aggiungi",
				tipologia: e.tipologia,
				data: this.lettura.oggi
			})}>${H.aggiungiData}</button>`;
			case "sovrapposizione_mista":
			case "sovrapposizione_stesso_tipo":
			case "giorno_inesistente": return C`<button class="bottone piccolo" @click=${() => q(this, "regole")}>${H.apriRegole}</button>`;
			case "eccezione_senza_ritiro":
			case "eccezione_ridondante": return C`<button class="bottone piccolo" @click=${() => q(this, "eccezioni")}>${H.pagine.eccezioni}</button>`;
			case "calendario_in_scadenza":
			case "calendario_scaduto": return C`<button class="bottone piccolo" @click=${() => q(this, "impostazioni")}>${H.pagine.impostazioni}</button>`;
			default: return T;
		}
	}
	_giorni() {
		let e = this.lettura.configurazione.tipologie, t = /* @__PURE__ */ new Map();
		for (let e of this._ritiri?.ritiri ?? []) t.set(e.data, [...t.get(e.data) ?? [], e]);
		if (!t.size) return C`<div class="vuoto">${H.nessunRitiro}</div>`;
		let n = this.lettura.oggi;
		return [...t.entries()].map(([t, r]) => {
			let i = Re(n, t), a = i === 0 ? H.oggi : i === 1 ? H.domani : B[Le(t)];
			return C`<div class="giorno ${i === 0 ? "oggi" : ""}">
        <div class="quando"><b>${a}</b>${Ue(t)}</div>
        <div class="chips">
          ${r.map((t) => {
				let n = e.find((e) => e.id === t.tipologia);
				return C`${n ? L(n) : t.tipologia}
            ${t.spostato_dal ? C`<span class="nota">↪ ${Ue(t.spostato_dal)}</span>` : T}
            ${t.festivo ? C`<span class="nota avviso">${t.festivo}</span>` : T}`;
			})}
        </div>
      </div>`;
		});
	}
	_validita() {
		let e = this.lettura.configurazione.valido_fino_al;
		if (!e) return C`<p class="aiuto">${H.senzaValidita}</p>`;
		let t = Re(this.lettura.oggi, e);
		return t < 0 ? C`<p class="aiuto avviso">${H.scaduto(e)}</p>` : C`<div class="validita ${t <= 30 ? "avviso" : ""}">
      <div class="grande">${t}</div>
      <div>${H.giorniValidita}<br /><small class="aiuto">${H.validoFino(e)}</small></div>
    </div>`;
	}
	render() {
		let e = this._festivi(), t = this.lettura.anomalie, n = e.length + t.length;
		return C`
      ${this.lettura.problemi.length ? C`<div class="riquadro errore">
            ${H.configurazioneNonValida}
            <ul>${this.lettura.problemi.map((e) => C`<li>${G(e)}</li>`)}</ul>
          </div>` : T}
      <div class="griglia-2">
        <div class="riquadro">
          <h2>${H.prossimiRitiri} <span class="conta">${H.giorni30}</span></h2>
          ${this._giorni()}
        </div>
        <div>
          <div class="riquadro">
            <h2>${H.daControllare} ${n ? C`<span class="conta">${n}</span>` : T}</h2>
            ${n === 0 ? C`<div class="vuoto">${H.tuttoInOrdine}</div>` : T}
            ${e.map((e) => C`<div class="anomalia">
                <ha-icon icon="mdi:alert-outline"></ha-icon>
                <div class="testo">
                  <b>${this._nome(e.tipologia)}</b> · ${U(e.data)}: ${e.festivo}.
                  <div class="riga-azioni">
                    <button class="bottone piccolo primario" @click=${() => q(this, "eccezioni", {
			tipo: "sposta",
			tipologia: e.tipologia,
			data: e.data
		})}>${H.creaEccezione}</button>
                    <button class="bottone piccolo" @click=${() => this._ignora(e)}>${H.ignora}</button>
                  </div>
                </div>
              </div>`)}
            ${t.map((e) => C`<div class="anomalia ${e.gravita}">
                <ha-icon icon=${e.gravita === "avviso" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
                <div class="testo">${Ye(e, this._nome)}<div class="riga-azioni">${this._azioni(e)}</div></div>
              </div>`)}
          </div>
          <div class="riquadro">
            <h2>${H.calendarioComune}</h2>
            ${this._validita()}
          </div>
        </div>
      </div>
    `;
	}
	static {
		this.styles = [
			N,
			I,
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
customElements.get("rd-panoramica") || customElements.define("rd-panoramica", nt);
//#endregion
//#region src/pannello/pagine/tipologie.ts
var rt = "foyer_raccolta_differenziata", Y = [
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
], it = class extends M {
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
			type: `${rt}/ritiri`,
			dal: e,
			al: Ie(e, 365)
		}), n = {};
		for (let e of t.ritiri) n[e.tipologia] ??= e.data;
		this._prossimi = n;
	}
	_nuova() {
		let e = new Set(this.lettura.configurazione.tipologie.map((e) => e.colore.toLowerCase()));
		this._bozza = {
			id: R(),
			nome: "",
			colore: Y.find((t) => !e.has(t)) ?? Y[0],
			icona: "mdi:trash-can-outline",
			note: "",
			esposizione: null
		};
	}
	_salva() {
		let e = this._bozza, t = J(this.lettura.configurazione), n = t.tipologie.findIndex((t) => t.id === e.id), r = {
			...e,
			nome: e.nome.trim(),
			note: e.note.trim()
		};
		n >= 0 ? t.tipologie[n] = r : t.tipologie.push(r), K(this, t);
	}
	_elimina() {
		let e = this._bozza, t = this.lettura.configurazione, n = t.regole.filter((t) => t.tipologia === e.id).length, r = t.eccezioni.filter((t) => t.tipologia === e.id).length, i = t.promemoria.filter((t) => t.tipologie?.length === 1 && t.tipologie[0] === e.id).length, a = H.eliminaTipologia(e.nome, n, r) + (i ? ` ${H.profiloRimosso(i)}` : "");
		if (!confirm(a)) return;
		let o = J(t);
		o.tipologie = o.tipologie.filter((t) => t.id !== e.id), o.regole = o.regole.filter((t) => t.tipologia !== e.id), o.eccezioni = o.eccezioni.filter((t) => t.tipologia !== e.id), o.promemoria = o.promemoria.map((t) => t.tipologie === null ? t : {
			...t,
			tipologie: t.tipologie.filter((t) => t !== e.id)
		}).filter((e) => e.tipologie === null || e.tipologie.length > 0), K(this, o);
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
		if (!e) return T;
		let t = this.lettura.configurazione.tipologie.some((t) => t.id === e.id);
		return C`<rd-finestra aperta titolo=${t && e.nome || H.nuovaTipologia} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="anteprima-testa" style="background:${e.colore};color:${F(e.colore)}">
          <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome || H.nome}</b>
        </div>
        <div class="campo">
          <label for="nome">${H.nome}</label>
          <input id="nome" maxlength="40" .value=${e.nome} @input=${(e) => this._aggiorna({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${H.colore}</span>
          <div class="colori">
            ${Y.map((t) => C`<button class="colore ${t === e.colore ? "attivo" : ""}" style="background:${t}" aria-label=${t} @click=${() => this._aggiorna({ colore: t })}></button>`)}
            <input type="color" .value=${e.colore} @input=${(e) => this._aggiorna({ colore: e.target.value })} />
          </div>
        </div>
        <div class="campo">
          <label for="icona">${H.icona}</label>
          <input id="icona" .value=${e.icona} @input=${(e) => this._aggiorna({ icona: e.target.value.trim() })} />
          <small>${H.iconaAiuto}</small>
        </div>
        <div class="campo">
          <label for="note">${H.note}</label>
          <textarea id="note" maxlength="500" .value=${e.note} @input=${(e) => this._aggiorna({ note: e.target.value })}></textarea>
        </div>
        <label class="spunta">
          <input type="checkbox" .checked=${e.esposizione !== null} @change=${(e) => this._aggiorna({ esposizione: e.target.checked ? { ...this.lettura.configurazione.esposizione } : null })} />
          ${H.finestraPropria}
        </label>
        ${e.esposizione ? C`<div class="riga-campi">
                <div class="campo">
                  <label>${H.dalle}</label>
                  <input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._aggiornaFinestra({ inizio_ora: e.target.value })} />
                </div>
                <div class="campo">
                  <label>${H.del}</label>
                  <select @change=${(e) => this._aggiornaFinestra({ inizio_giorno: e.target.value })}>
                    ${["giorno_prima", "giorno_stesso"].map((t) => C`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${H.inizioGiorno[t]}</option>`)}
                  </select>
                </div>
              </div>
              <div class="campo">
                <label>${H.entroLe}</label>
                <input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._aggiornaFinestra({ fine_ora: e.target.value })} />
              </div>` : T}
        <div class="azioni-modulo">
          ${t ? C`<button class="bottone pericolo" @click=${this._elimina}>${H.elimina}</button>` : T}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${H.annulla}</button>
          <button class="bottone primario" ?disabled=${!e.nome.trim()} @click=${this._salva}>${H.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione.tipologie;
		return C`<div class="riquadro">
        <h2>${H.pagine.tipologie} <span class="conta">${e.length}</span></h2>
        <p class="aiuto">${H.aiutoTipologie}</p>
        <div class="griglia">
          ${e.map((e) => C`<button class="tipologia" @click=${() => this._bozza = J(e)}>
              <div class="testa" style="background:${e.colore};color:${F(e.colore)}">
                <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome}</b>
              </div>
              <div class="corpo">${e.note || C`<i>${H.nessunaNota}</i>`}</div>
              <div class="piede">
                <span>${H.prossimo}: <b>${this._prossimi[e.id] ? Ue(this._prossimi[e.id]) : "—"}</b></span>
                <span class="link">${H.modifica}</span>
              </div>
            </button>`)}
          <button class="nuova" @click=${this._nuova}><ha-icon icon="mdi:plus"></ha-icon>${H.nuovaTipologia}</button>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			N,
			I,
			P,
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
customElements.get("rd-tipologie") || customElements.define("rd-tipologie", it);
//#endregion
//#region src/pannello/pagine/regole.ts
var at = "foyer_raccolta_differenziata", ot = {
	settimanale: (e) => ({
		tipo: "settimanale",
		ogni: 1,
		giorni: [],
		ancora: ze(e)
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
}, st = {
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
}, X = (e, t) => e.includes(t) ? e.filter((e) => e !== t) : [...e, t], ct = class extends M {
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
			id: R(),
			tipologia: e,
			nome: "",
			ricorrenza: ot.settimanale(t),
			periodo: { tipo: "sempre" }
		});
	}
	_imposta(e) {
		this._bozza = e, clearTimeout(this._timer), this._timer = window.setTimeout(() => void this._anteprima(), 250);
	}
	_candidata() {
		let e = J(this.lettura.configurazione), t = e.regole.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nome: this._bozza.nome.trim()
		};
		return t >= 0 ? e.regole[t] = n : e.regole.push(n), e;
	}
	async _anteprima() {
		if (!this._bozza) return;
		let e = this._bozza.id, t = await this.hass.callWS({
			type: `${at}/anteprima`,
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
		let e = J(this.lettura.configurazione);
		e.regole = e.regole.filter((e) => e.id !== this._bozza.id), K(this, e);
	}
	_editorRicorrenza(e) {
		let t = (t, n) => C`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			ricorrenza: ot[t](this.lettura.oggi)
		})}>${n}</button>`;
		return C`<div class="campo">
        <span class="etichetta">${H.ricorrenza}</span>
        <div class="segmenti">
          ${t("settimanale", H.ogniSettimane)} ${t("mensile_posizione", H.posizioneMese)}
          ${t("mensile_data", H.dataMese)}
        </div>
      </div>
      ${e.tipo === "settimanale" ? C`<div class="campo">
              <span class="etichetta">${H.ogni}</span>
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
		].map((t) => C`<button class=${e.ogni === t ? "attivo" : ""} @click=${() => this._ricorrenza({ ogni: t })}>${t === 1 || t === 2 ? H.settimane(t) : t}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${H.neiGiorni}</span>
              <div class="tonde">
                ${B.map((t, n) => C`<button class=${e.giorni.includes(n) ? "attivo" : ""} aria-pressed=${e.giorni.includes(n)} @click=${() => this._ricorrenza({ giorni: X(e.giorni, n).sort() })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>
            ${e.ogni > 1 ? C`<div class="campo">
                  <label for="ancora">${H.ancora}</label>
                  <input id="ancora" type="date" .value=${e.ancora} @change=${(e) => this._ricorrenza({ ancora: e.target.value })} />
                  <small>${H.ancoraAiuto}</small>
                </div>` : T}` : T}
      ${e.tipo === "mensile_posizione" ? C`<div class="campo">
              <span class="etichetta">${H.quali}</span>
              <div class="tonde">
                ${[
			1,
			2,
			3,
			4,
			-1
		].map((t) => C`<button class=${e.posizioni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ posizioni: X(e.posizioni, t) })}>${He[t]}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${H.giornoSettimana}</span>
              <div class="tonde">
                ${B.map((t, n) => C`<button class=${e.giorno === n ? "attivo" : ""} @click=${() => this._ricorrenza({ giorno: n })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>` : T}
      ${e.tipo === "mensile_data" ? C`<div class="campo">
            <span class="etichetta">${H.giorniDelMese}</span>
            <div class="tonde calendario">
              ${Array.from({ length: 31 }, (e, t) => t + 1).map((t) => C`<button class=${e.giorni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ giorni: X(e.giorni, t).sort((e, t) => e - t) })}>${t}</button>`)}
            </div>
          </div>` : T}`;
	}
	_meseGiorno(e, t) {
		let [n, r] = e.split("-").map(Number), i = (e, n) => t(`${String(e).padStart(2, "0")}-${String(n).padStart(2, "0")}`);
		return C`<div class="riga-campi">
      <select aria-label=${H.giorno} @change=${(e) => i(n, Number(e.target.value))}>
        ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => C`<option value=${e} ?selected=${e === r}>${e}</option>`)}
      </select>
      <select aria-label=${H.mese} @change=${(e) => i(Number(e.target.value), r)}>
        ${V.map((e, t) => C`<option value=${t + 1} ?selected=${t + 1 === n}>${e}</option>`)}
      </select>
    </div>`;
	}
	_editorPeriodo(e) {
		let t = (t, n) => C`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			periodo: st[t](this.lettura.oggi)
		})}>${n}</button>`;
		return C`<div class="campo">
        <span class="etichetta">${H.periodo}</span>
        <div class="segmenti">${t("sempre", H.sempre)} ${t("annuale", H.annuale)} ${t("con_anno", H.conAnno)}</div>
      </div>
      ${e.tipo === "annuale" ? C`<div class="riga-campi">
            <div class="campo"><span class="etichetta">${H.dal}</span>${this._meseGiorno(e.dal, (e) => this._periodo({ dal: e }))}</div>
            <div class="campo"><span class="etichetta">${H.al}</span>${this._meseGiorno(e.al, (e) => this._periodo({ al: e }))}</div>
          </div>` : T}
      ${e.tipo === "con_anno" ? C`<div class="riga-campi">
            <div class="campo"><label>${H.dal}</label><input type="date" .value=${e.dal} @change=${(e) => this._periodo({ dal: e.target.value })} /></div>
            <div class="campo"><label>${H.al}</label><input type="date" .value=${e.al} @change=${(e) => this._periodo({ al: e.target.value })} /></div>
          </div>` : T}`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return T;
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = this.lettura.configurazione.regole.some((t) => t.id === e.id);
		return C`<rd-finestra aperta titolo=${`${n ? H.modifica : H.nuovaRegola} · ${t?.nome ?? ""}`} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${H.nomeRegola}</label>
          <input id="nome" maxlength="40" .value=${e.nome} placeholder=${H.nomeRegolaAiuto} @input=${(t) => this._bozza = {
			...e,
			nome: t.target.value
		}} />
        </div>
        ${this._editorRicorrenza(e.ricorrenza)} ${this._editorPeriodo(e.periodo)}
        <div class="campo">
          <span class="etichetta">${H.prossimeDate}</span>
          ${this._problemi.length ? C`<div class="errori">${this._problemi.map((e) => C`<div>${G(e)}</div>`)}</div>` : this._date.length ? C`<div class="anteprima-date">${this._date.map((e) => C`<span>${W(e)}</span>`)}</div>` : C`<div class="aiuto">${H.nessunaData}</div>`}
        </div>
        <div class="azioni-modulo">
          ${n ? C`<button class="bottone pericolo" @click=${this._elimina}>${H.elimina}</button>` : T}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${H.annulla}</button>
          <button class="bottone primario" ?disabled=${this._problemi.length > 0} @click=${() => K(this, this._candidata())}>${H.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione;
		return C`<div class="riquadro">
        <h2>${H.pagine.regole}</h2>
        <p class="aiuto">${H.aiutoRegole}</p>
        ${e.tipologie.map((t) => {
			let n = e.regole.filter((e) => e.tipologia === t.id);
			return C`<section class="gruppo">
            <div class="titolo">${L(t)}</div>
            ${n.length ? n.map((e) => C`<div class="voce">
                    <div class="frase">
                      ${e.nome ? C`<b>${e.nome}</b> · ` : T}${Ge(e.ricorrenza)}
                      <small>${qe(e.periodo)}</small>
                    </div>
                    <button class="bottone piccolo" @click=${() => this._imposta(J(e))}>${H.modifica}</button>
                  </div>`) : C`<div class="vuoto">${H.nessunaRegola}</div>`}
            <button class="bottone piccolo" @click=${() => this._nuova(t.id)}><ha-icon icon="mdi:plus"></ha-icon>${H.nuovaRegola}</button>
          </section>`;
		})}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			N,
			I,
			P,
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
customElements.get("rd-regole") || customElements.define("rd-regole", ct);
//#endregion
//#region src/pannello/pagine/eccezioni.ts
var lt = "foyer_raccolta_differenziata", ut = (e) => e.tipo === "sposta" ? e.da : e.data, dt = class extends M {
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
			id: R(),
			tipo: e,
			tipologia: r,
			da: i,
			a: i,
			nota: ""
		} : {
			id: R(),
			tipo: e,
			tipologia: r,
			data: i,
			nota: ""
		}, this._problemi = [];
	}
	_candidata() {
		let e = J(this.lettura.configurazione), t = e.eccezioni.findIndex((e) => e.id === this._bozza.id), n = {
			...this._bozza,
			nota: (this._bozza.nota ?? "").trim()
		};
		return t >= 0 ? e.eccezioni[t] = n : e.eccezioni.push(n), e.eccezioni.sort((e, t) => ut(e).localeCompare(ut(t))), e;
	}
	async _salva() {
		let e = this._candidata(), t = await this.hass.callWS({
			type: `${lt}/anteprima`,
			configurazione: e
		});
		this._problemi = t.problemi, t.problemi.length || K(this, e);
	}
	_elimina() {
		let e = J(this.lettura.configurazione);
		e.eccezioni = e.eccezioni.filter((e) => e.id !== this._bozza.id), K(this, e);
	}
	_aggiorna(e) {
		this._bozza = {
			...this._bozza,
			...e
		};
	}
	_data(e, t, n) {
		return C`<div class="campo">
      <label>${e}</label>
      <input type="date" .value=${n} @change=${(e) => this._aggiorna({ [t]: e.target.value })} />
    </div>`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return T;
		let t = this.lettura.configurazione.eccezioni.some((t) => t.id === e.id);
		return C`<rd-finestra aperta titolo=${{
			aggiungi: H.aggiungiRitiro,
			togli: H.togliRitiro,
			sposta: H.spostaRitiro
		}[e.tipo]} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${H.tipologia}</span>
          <div class="scelta-tipologie">
            ${this.lettura.configurazione.tipologie.map((t) => C`<button class=${t.id === e.tipologia ? "attivo" : ""} @click=${() => this._aggiorna({ tipologia: t.id })}>${L(t)}</button>`)}
          </div>
        </div>
        ${e.tipo === "sposta" ? C`<div class="riga-campi">${this._data(H.da, "da", e.da)} ${this._data(H.a, "a", e.a)}</div>` : this._data(H.data, "data", e.data)}
        <div class="campo">
          <label for="nota">${H.nota}</label>
          <input id="nota" maxlength="200" .value=${e.nota ?? ""} @input=${(e) => this._aggiorna({ nota: e.target.value })} />
        </div>
        ${this._problemi.length ? C`<div class="errori">${this._problemi.map((e) => C`<div>${G(e)}</div>`)}</div>` : T}
        <div class="azioni-modulo">
          ${t ? C`<button class="bottone pericolo" @click=${this._elimina}>${H.elimina}</button>` : T}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${H.annulla}</button>
          <button class="bottone primario" @click=${this._salva}>${H.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	_riga(e) {
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = e.tipo === "sposta" ? C`${W(e.da)} → ${W(e.a)}` : W(e.data);
		return C`<div class="voce">
      <span class="badge ${e.tipo}">${H.tipoEccezione[e.tipo]}</span>
      ${t ? L(t) : T}
      <div class="frase"><b>${n}</b>${e.nota ? C`<small>${e.nota}</small>` : T}</div>
      <button class="bottone piccolo" @click=${() => (this._bozza = J(e), this._problemi = [])}>${H.modifica}</button>
    </div>`;
	}
	render() {
		let e = this.lettura.configurazione.eccezioni, t = this.lettura.oggi, n = (e) => e.tipo === "sposta" ? e.a > e.da ? e.a : e.da : e.data, r = e.filter((e) => n(e) >= t), i = e.filter((e) => n(e) < t);
		return C`<div class="riquadro">
        <h2>${H.pagine.eccezioni} <span class="conta">${r.length}</span></h2>
        <p class="aiuto">${H.aiutoEccezioni}</p>
        ${r.length ? r.map((e) => this._riga(e)) : C`<div class="vuoto">${H.nessunaEccezione}</div>`}
        <div class="riga-azioni">
          <button class="bottone primario" @click=${() => this._nuova("aggiungi")}><ha-icon icon="mdi:plus"></ha-icon>${H.aggiungiRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("togli")}><ha-icon icon="mdi:minus"></ha-icon>${H.togliRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("sposta")}><ha-icon icon="mdi:arrow-right"></ha-icon>${H.spostaRitiro}</button>
        </div>
        ${i.length ? C`<details @toggle=${(e) => this._passate = e.target.open}>
              <summary>${H.passate} (${i.length})</summary>
              ${this._passate ? i.map((e) => this._riga(e)) : T}
            </details>` : T}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			N,
			I,
			P,
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
customElements.get("rd-eccezioni") || customElements.define("rd-eccezioni", dt);
//#endregion
//#region src/pannello/pagine/promemoria.ts
var ft = /* @__PURE__ */ new Set([
	"send_message",
	"persistent_notification",
	"notify"
]), pt = [
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
], mt = {
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
}, Z = (e) => `${e.tipo}:${e.id}`, Q = (e) => e.tipo === "servizio" && e.id.startsWith("mobile_app_"), ht = class extends M {
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
		let e = Object.keys(this.hass.services?.notify ?? {}).filter((e) => !ft.has(e)).sort().map((e) => ({
			destinatario: {
				tipo: "servizio",
				id: e
			},
			nome: e.replace(/^mobile_app_/, "").replaceAll("_", " ")
		})), t = Object.keys(this.hass.states ?? {}).filter((e) => e.startsWith("notify.")).sort().map((e) => ({
			destinatario: {
				tipo: "entita",
				id: e
			},
			nome: String(this.hass.states[e].attributes.friendly_name ?? e)
		})), n = new Set([...e, ...t].map((e) => Z(e.destinatario))), r = (this._bozza?.destinatari ?? []).filter((e) => !n.has(Z(e))).map((e) => ({
			destinatario: e,
			nome: e.id
		}));
		return [
			...e,
			...t,
			...r
		];
	}
	_nuovo() {
		this._bozza = {
			id: R(),
			nome: "",
			attivo: !0,
			quando: mt.giorni_prima(),
			tipologie: null,
			destinatari: []
		};
	}
	_salvaProfilo() {
		let e = J(this.lettura.configurazione), t = {
			...this._bozza,
			nome: this._bozza.nome.trim()
		}, n = e.promemoria.findIndex((e) => e.id === t.id);
		n >= 0 ? e.promemoria[n] = t : e.promemoria.push(t), K(this, e);
	}
	_eliminaProfilo() {
		let e = J(this.lettura.configurazione);
		e.promemoria = e.promemoria.filter((e) => e.id !== this._bozza.id), K(this, e);
	}
	_attiva(e) {
		let t = J(this.lettura.configurazione), n = t.promemoria.find((t) => t.id === e.id);
		n.attivo = !n.attivo, K(this, t);
	}
	_solleciti(e) {
		let t = J(this.lettura.configurazione);
		t.solleciti = {
			...t.solleciti,
			...e
		}, K(this, t);
	}
	_aggiungiVacanza() {
		let { dal: e, al: t } = this._vacanza;
		if (!e || !t) return;
		let n = J(this.lettura.configurazione);
		n.sospensioni = [...n.sospensioni, {
			dal: e,
			al: t
		}].sort((e, t) => e.dal.localeCompare(t.dal)), K(this, n);
	}
	_togliVacanza(e) {
		let t = J(this.lettura.configurazione);
		t.sospensioni = t.sospensioni.filter((t, n) => n !== e), K(this, t);
	}
	_editor() {
		let e = this._bozza;
		if (!e) return T;
		let t = this.lettura.configurazione.promemoria.some((t) => t.id === e.id), n = this.lettura.configurazione.tipologie, r = (t) => this._bozza = {
			...e,
			...t
		}, i = e.quando, a = (e, t) => C`<button class=${i.tipo === e ? "attivo" : ""} @click=${() => i.tipo !== e && r({ quando: mt[e]() })}>${t}</button>`, o = new Set(e.destinatari.map(Z)), s = this._disponibili(), c = e.nome.trim() && e.destinatari.length && (e.tipologie === null || e.tipologie.length);
		return C`<rd-finestra aperta titolo=${t && e.nome || H.nuovoPromemoria} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${H.nomePromemoria}</label>
          <input id="nome" maxlength="40" placeholder=${H.nomePromemoriaAiuto} .value=${e.nome} @input=${(e) => r({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${H.quando}</span>
          <div class="segmenti">${a("giorni_prima", H.giorniPrima)} ${a("giorno_stesso", H.giornoStesso)} ${a("apertura", H.apertura)}</div>
          ${i.tipo === "apertura" ? C`<small>${H.aperturaAiuto}</small>` : T}
        </div>
        ${i.tipo === "giorni_prima" ? C`<div class="campo">
              <span class="etichetta">${H.quantiGiorni}</span>
              <div class="tonde">${[
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].map((e) => C`<button class=${i.giorni === e ? "attivo" : ""} @click=${() => r({ quando: {
			...i,
			giorni: e
		} })}>${e}</button>`)}</div>
            </div>` : T}
        ${i.tipo === "apertura" ? T : C`<div class="campo">
              <label for="ora">${H.alle}</label>
              <input id="ora" type="time" .value=${i.ora} @change=${(e) => r({ quando: {
			...i,
			ora: e.target.value
		} })} />
            </div>`}
        <div class="campo">
          <span class="etichetta">${H.perQuali}</span>
          <div class="scelta">
            <button class="tutte ${e.tipologie === null ? "attivo" : ""}" @click=${() => r({ tipologie: e.tipologie === null ? n.map((e) => e.id) : null })}>${H.tutte}</button>
            ${n.map((t) => C`<button class=${e.tipologie === null || e.tipologie.includes(t.id) ? "attivo" : ""} @click=${() => {
			let i = e.tipologie ?? n.map((e) => e.id);
			r({ tipologie: i.includes(t.id) ? i.filter((e) => e !== t.id) : [...i, t.id] });
		}}>${L(t)}</button>`)}
          </div>
          <small>${H.tutteAiuto}</small>
        </div>
        <div class="campo">
          <span class="etichetta">${H.destinatari}</span>
          ${s.length ? C`<div class="destinatari">
                ${s.map(({ destinatario: t, nome: n }) => C`<label class="destinatario">
                  <input type="checkbox" .checked=${o.has(Z(t))} @change=${(n) => {
			let i = n.target.checked;
			r({ destinatari: i ? [...e.destinatari, t] : e.destinatari.filter((e) => Z(e) !== Z(t)) });
		}} />
                  <ha-icon .icon=${Q(t) ? "mdi:cellphone" : "mdi:message-text-outline"}></ha-icon>
                  <span class="nome">${n}</span>
                  <span class="etichetta-tipo ${Q(t) ? "pulsanti" : ""}">${Q(t) ? H.conPulsanti : H.soloTesto}</span>
                </label>`)}
              </div>` : C`<div class="aiuto">${H.nessunDestinatario}</div>`}
          <small>${H.destinatariAiuto}</small>
        </div>
        <div class="azioni-modulo">
          ${t ? C`<button class="bottone pericolo" @click=${this._eliminaProfilo}>${H.elimina}</button>` : T}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => this._bozza = void 0}>${H.annulla}</button>
          <button class="bottone primario" ?disabled=${!c} @click=${this._salvaProfilo}>${H.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
	}
	_riepilogo(e) {
		let t = this.lettura.configurazione.tipologie, n = e.tipologie === null ? H.tutte : e.tipologie.map((e) => t.find((t) => t.id === e)?.nome ?? e).join(", "), r = e.destinatari.filter(Q).length;
		return C`${n} · ${e.destinatari.length} ${e.destinatari.length === 1 ? "destinatario" : "destinatari"}${r ? C` · ${r} con pulsanti` : T}`;
	}
	render() {
		let e = this.lettura.configurazione, t = e.solleciti;
		return C`<div class="griglia-2">
        <div>
          <div class="riquadro">
            <h2>${H.pagine.promemoria} <span class="conta">${e.promemoria.length}</span></h2>
            <p class="aiuto">${H.aiutoPromemoria}</p>
            ${e.promemoria.length ? e.promemoria.map((e) => C`<div class="voce ${e.attivo ? "" : "spento"}">
                    <ha-icon class="campana" icon=${e.attivo ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}></ha-icon>
                    <div class="frase"><b>${e.nome}</b> · ${Ze(e.quando)}<small>${this._riepilogo(e)}</small></div>
                    <button class="levetta ${e.attivo ? "acceso" : ""}" role="switch" aria-checked=${e.attivo} aria-label=${H.attivo} @click=${() => this._attiva(e)}></button>
                    <button class="bottone piccolo" @click=${() => this._bozza = J(e)}>${H.modifica}</button>
                  </div>`) : C`<div class="vuoto">${H.nessunPromemoria}</div>`}
            <div class="riga-azioni">
              <button class="bottone primario" @click=${this._nuovo}><ha-icon icon="mdi:plus"></ha-icon>${H.nuovoPromemoria}</button>
            </div>
          </div>
          <div class="riquadro">
            <h2>${H.solleciti}</h2>
            <div class="interruttore">
              <div>${H.sollecitaSeNonConfermo}<small>${H.sollecitiAiuto}</small></div>
              <button class="levetta ${t.attivi ? "acceso" : ""}" role="switch" aria-checked=${t.attivi} aria-label=${H.sollecitaSeNonConfermo} @click=${() => this._solleciti({ attivi: !t.attivi })}></button>
            </div>
            ${t.attivi ? C`<div class="riga-campi">
                  <div class="campo">
                    <span class="etichetta">${H.richiami}</span>
                    <div class="segmenti">${[1, 2].map((e) => C`<button class=${t.richiami === e ? "attivo" : ""} @click=${() => this._solleciti({ richiami: e })}>${e}</button>`)}</div>
                  </div>
                  <div class="campo">
                    <label for="minuti">${H.ogniMinuti}</label>
                    <select id="minuti" @change=${(e) => this._solleciti({ richiamo_dopo: Number(e.target.value) })}>
                      ${pt.map((e) => C`<option value=${e} ?selected=${t.richiamo_dopo === e}>${H.minuti(e)}</option>`)}
                    </select>
                  </div>
                </div>` : T}
          </div>
        </div>
        <div class="riquadro">
          <h2>${H.vacanze}</h2>
          <p class="aiuto">${H.vacanzeAiuto}</p>
          ${e.sospensioni.length ? e.sospensioni.map((e, t) => C`<div class="voce">
                  <ha-icon icon="mdi:beach"></ha-icon>
                  <div class="frase">${H.dalAl(e.dal, e.al)}</div>
                  <button class="bottone piccolo" @click=${() => this._togliVacanza(t)}>${H.togli}</button>
                </div>`) : C`<div class="vuoto">${H.nessunaVacanza}</div>`}
          <div class="riga-campi vacanza">
            <div class="campo"><label>${H.dal}</label><input type="date" .value=${this._vacanza.dal} @change=${(e) => this._vacanza = {
			...this._vacanza,
			dal: e.target.value
		}} /></div>
            <div class="campo"><label>${H.al}</label><input type="date" .value=${this._vacanza.al} @change=${(e) => this._vacanza = {
			...this._vacanza,
			al: e.target.value
		}} /></div>
          </div>
          <div class="riga-azioni">
            <button class="bottone" ?disabled=${!this._vacanza.dal || !this._vacanza.al} @click=${this._aggiungiVacanza}><ha-icon icon="mdi:plus"></ha-icon>${H.aggiungiVacanza}</button>
          </div>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			N,
			I,
			P,
			o`
      .voce.spento {
        opacity: 0.6;
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
customElements.get("rd-promemoria") || customElements.define("rd-promemoria", ht);
//#endregion
//#region src/pannello/pagine/impostazioni.ts
var gt = "foyer_raccolta_differenziata", _t = class extends M {
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 }
		};
	}
	updated(e) {
		e.has("lettura") && (this._bozza = J(this.lettura.configurazione));
	}
	async _barra() {
		await this.hass.callWS({
			type: `${gt}/barra_laterale`,
			mostra: !this.lettura.mostra_barra_laterale
		}), et(this);
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
		let e = J(this._bozza);
		e.patrono && !e.patrono.nome.trim() && (e.patrono = null), e.patrono && (e.patrono.nome = e.patrono.nome.trim()), e.valido_fino_al ||= null, K(this, e);
	}
	render() {
		let e = this._bozza;
		if (!e) return C``;
		let [t, n] = (e.patrono?.data ?? "01-01").split("-").map(Number), r = (e, t) => this._patrono({ data: `${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}` }), i = JSON.stringify(e) !== JSON.stringify(this.lettura.configurazione);
		return C`<div class="colonna">
      <div class="riquadro">
        <h2>${H.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${H.mostraBarra}<small>${H.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${H.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${H.esposizione}</h2>
        <p class="aiuto">${H.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${H.dalle}</label><input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._finestra({ inizio_ora: e.target.value })} /></div>
            <div class="campo">
              <label>${H.del}</label>
              <select @change=${(e) => this._finestra({ inizio_giorno: e.target.value })}>
                ${["giorno_prima", "giorno_stesso"].map((t) => C`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${H.inizioGiorno[t]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${H.entroLe}</label><input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._finestra({ fine_ora: e.target.value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${H.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${H.validita}</label>
            <input id="validita" type="date" .value=${e.valido_fino_al ?? ""} @change=${(t) => this._bozza = {
			...e,
			valido_fino_al: t.target.value || null
		}} />
            <small>${H.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${H.patrono}</span>
            <div class="patrono">
              <input aria-label=${H.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${e.patrono?.nome ?? ""} @input=${(e) => this._patrono({ nome: e.target.value })} />
              <select aria-label=${H.giorno} @change=${(e) => r(t, Number(e.target.value))}>
                ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => C`<option value=${e} ?selected=${e === n}>${e}</option>`)}
              </select>
              <select aria-label=${H.mese} @change=${(e) => r(Number(e.target.value), n)}>
                ${V.map((e, n) => C`<option value=${n + 1} ?selected=${n + 1 === t}>${e}</option>`)}
              </select>
            </div>
            <small>${H.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!i} @click=${() => this._bozza = J(this.lettura.configurazione)}>${H.annulla}</button>
        <button class="bottone primario" ?disabled=${!i} @click=${this._salva}>${H.salva}</button>
      </div>
    </div>`;
	}
	static {
		this.styles = [
			N,
			I,
			P,
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
customElements.get("rd-impostazioni") || customElements.define("rd-impostazioni", _t);
//#endregion
//#region src/pannello/raccolta-pannello.ts
var $ = "foyer_raccolta_differenziata", vt = [
	"panoramica",
	"tipologie",
	"regole",
	"eccezioni",
	"promemoria",
	"impostazioni"
], yt = class extends M {
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
		e && vt.includes(e) && (this._pagina = e);
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
			this._errore = H.nonCaricata;
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
			this._inAttesa = void 0, this._problemi = [], await this._carica(), this._mostraAvviso(H.salvato), this._chiudiEditor();
			return;
		}
		if (e.problemi.some((e) => e.codice === "revisione_superata")) {
			this._inAttesa = void 0, await this._carica(), this._mostraAvviso(H.altroHaSalvato);
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
		if (!e) return T;
		let t = e.candidata.tipologie, n = (e, n) => {
			let r = t.find((e) => e.id === n.tipologia) ?? this._lettura?.configurazione.tipologie.find((e) => e.id === n.tipologia);
			return C`<div class="differenza">
        <span class="segno ${e === "+" ? "piu" : "meno"}">${e}</span>
        <b>${W(n.data)}</b>
        ${r ? L(r) : n.tipologia}
      </div>`;
		}, { aggiunti: r, tolti: i } = e.anteprima.differenze, a = [...r.map((e) => ({
			...e,
			segno: "+"
		})), ...i.map((e) => ({
			...e,
			segno: "−"
		}))].sort((e, t) => e.data.localeCompare(t.data));
		return C`<rd-finestra aperta titolo=${H.primaDiSalvare} @chiudi=${() => this._inAttesa = void 0}>
      ${this._problemi.length ? C`<div class="errori">
            ${H.nonSalvato}
            <ul>
              ${this._problemi.map((e) => C`<li>${G(e)}</li>`)}
            </ul>
          </div>` : C`<p class="aiuto">${a.length ? H.cosaCambia : H.nienteCambia}</p>
            <div class="differenze">${a.slice(0, 40).map((e) => n(e.segno, e))}</div>`}
      <div class="azioni-finestra">
        <button class="bottone" @click=${() => this._inAttesa = void 0}>${H.annulla}</button>
        ${this._problemi.length ? T : C`<button class="bottone primario" @click=${this._salva}>${H.salva}</button>`}
      </div>
    </rd-finestra>`;
	}
	_paginaCorrente() {
		let e = this._lettura;
		switch (this._pagina) {
			case "tipologie": return C`<rd-tipologie .hass=${this.hass} .lettura=${e}></rd-tipologie>`;
			case "regole": return C`<rd-regole .hass=${this.hass} .lettura=${e}></rd-regole>`;
			case "eccezioni": return C`<rd-eccezioni .hass=${this.hass} .lettura=${e} .precompila=${this._precompila}></rd-eccezioni>`;
			case "promemoria": return C`<rd-promemoria .hass=${this.hass} .lettura=${e}></rd-promemoria>`;
			case "impostazioni": return C`<rd-impostazioni .hass=${this.hass} .lettura=${e}></rd-impostazioni>`;
			default: return C`<rd-panoramica .hass=${this.hass} .lettura=${e}></rd-panoramica>`;
		}
	}
	render() {
		return C`
      <header class="testata">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="simbolo">${Qe}</span>
        <h1>${H.titolo}</h1>
      </header>
      <nav class="schede" role="tablist">
        ${vt.map((e) => C`<button
            role="tab"
            aria-selected=${e === this._pagina}
            class=${e === this._pagina ? "attiva" : ""}
            @click=${() => {
			this._pagina = e, this._precompila = void 0;
		}}
          >
            ${H.pagine[e]}
          </button>`)}
      </nav>
      <main
        class="pagina"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @ricarica=${() => void this._carica()}
      >
        ${this._errore ? C`<div class="vuoto">${this._errore}</div>` : this._lettura ? this._paginaCorrente() : C`<div class="vuoto">${H.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._avviso ? C`<div class="avviso" role="status">${this._avviso}</div>` : T}
    `;
	}
	static {
		this.styles = [N, o`
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
customElements.get("foyer-raccolta-pannello") || customElements.define("foyer-raccolta-pannello", yt);
//#endregion
export { yt as RaccoltaPannello };
