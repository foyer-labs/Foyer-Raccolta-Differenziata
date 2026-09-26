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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, d = globalThis, ie = d.trustedTypes, ae = ie ? ie.emptyScript : "", oe = d.reactiveElementPolyfillSupport, f = (e, t) => e, p = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ae : null;
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
	converter: p,
	reflect: !1,
	useDefault: !1,
	hasChanged: se
};
Symbol.metadata ??= Symbol("metadata"), d.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
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
		let { get: r, set: i } = ee(this.prototype, e) ?? {
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
		if (this.hasOwnProperty(f("elementProperties"))) return;
		let e = re(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(f("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(f("properties"))) {
			let e = this.properties, t = [...te(e), ...ne(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? p : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? p : e.converter;
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
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[f("elementProperties")] = /* @__PURE__ */ new Map(), m[f("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: m }), (d.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var le = globalThis, ue = (e) => e, h = le.trustedTypes, de = h ? h.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fe = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + g, me = `<${pe}>`, _ = document, v = () => _.createComment(""), y = (e) => e === null || typeof e != "object" && typeof e != "function", b = Array.isArray, he = (e) => b(e) || typeof e?.[Symbol.iterator] == "function", ge = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, S = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, Se = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Se(1), Ce = Se(2), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), E = _.createTreeWalker(_, 129);
function Te(e, t) {
	if (!b(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ve : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = S : o === _e || o === ve ? o = x : (o = S, i = void 0);
		let ee = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + me : l >= 0 ? (r.push(s), n.slice(0, l) + fe + n.slice(l) + g + ee) : n + g + (l === -2 ? t : ee);
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fe)) {
					let t = u[o++], n = i.getAttribute(e).split(g), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ke : r[1] === "?" ? Ae : r[1] === "@" ? je : k
					}), i.removeAttribute(e);
				} else e.startsWith(g) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(g), t = e.length - 1;
					if (t > 0) {
						i.textContent = h ? h.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], v()), E.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], v());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === pe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(g, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += g.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = _.createElement("template");
		return n.innerHTML = e, n;
	}
};
function O(e, t, n = e, r) {
	if (t === w) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = y(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? _).importNode(t, !0);
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Oe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Me(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = _, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Oe = class e {
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
		e = O(this, e, t), y(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== w && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && y(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_.createTextNode(e)), this._$AH = e;
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
		b(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(v()), this.O(v()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ue(e).nextSibling;
			ue(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, k = class {
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
		if (i === void 0) e = O(this, e, t, 0), a = !y(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = O(this, r[n + o], t, o), s === w && (s = this._$AH[o]), a ||= !y(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ke = class extends k {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, Ae = class extends k {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, je = class extends k {
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
}, Me = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		O(this, e);
	}
}, Ne = le.litHtmlPolyfillSupport;
Ne?.(D, Oe), (le.litHtmlVersions ??= []).push("3.3.3");
var Pe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Oe(t.insertBefore(v(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Fe = globalThis, A = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Pe(t, this.renderRoot, this.renderOptions);
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
A._$litElement$ = !0, A.finalized = !0, Fe.litElementHydrateSupport?.({ LitElement: A });
var Ie = Fe.litElementPolyfillSupport;
Ie?.({ LitElement: A }), (Fe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/comune/stili.ts
var j = o`
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
`, M = o`
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
function N(e) {
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
var P = o`
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
`, F = (e) => C`<span class="chip" style="background:${e.colore};color:${N(e.colore)}"
    ><ha-icon .icon=${e.icona}></ha-icon>${e.nome}</span
  >`, I = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^0-9a-f]/gi, "").slice(0, 32), L = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Le = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, R = (e, t) => {
	let n = L(e);
	return n.setDate(n.getDate() + t), Le(n);
}, z = (e) => (L(e).getDay() + 6) % 7, Re = (e, t) => Math.round((L(t).getTime() - L(e).getTime()) / 864e5), ze = (e) => R(e, -z(e)), B = [
	"lunedì",
	"martedì",
	"mercoledì",
	"giovedì",
	"venerdì",
	"sabato",
	"domenica"
], V = [
	"Lun",
	"Mar",
	"Mer",
	"Gio",
	"Ven",
	"Sab",
	"Dom"
], H = [
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
], Be = {
	1: "primo",
	2: "secondo",
	3: "terzo",
	4: "quarto",
	[-1]: "ultimo"
}, Ve = {
	1: "1°",
	2: "2°",
	3: "3°",
	4: "4°",
	[-1]: "Ultimo"
}, U = {
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
	validoFino: (e) => `fino al ${W(e)}`,
	scaduto: (e) => `scaduto il ${W(e)}: i ritiri successivi sono da verificare`,
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
	dalAl: (e, t) => `dal ${W(e)} al ${W(t)}`,
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
	togliPiattaformaConferma: "Togliere gli orari della piattaforma ecologica? Spariscono anche dalle card, e il suo sensore.",
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
function W(e) {
	let t = L(e);
	return `${t.getDate()} ${H[t.getMonth()]} ${t.getFullYear()}`;
}
function G(e) {
	let t = L(e);
	return `${V[z(e)].toLowerCase()} ${t.getDate()} ${H[t.getMonth()].slice(0, 3)}`;
}
function He(e) {
	let t = L(e);
	return `${t.getDate()} ${H[t.getMonth()].slice(0, 3)}`;
}
var Ue = (e) => e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} e ${e[e.length - 1]}`;
function K(e) {
	if (e.tipo === "settimanale") {
		let t = Ue([...e.giorni].sort().map((e) => B[e]));
		return e.ogni === 1 ? `Ogni settimana, il ${t}` : e.ogni === 2 ? `Una settimana sì e una no, il ${t}` : `Ogni ${e.ogni} settimane, il ${t}`;
	}
	return e.tipo === "mensile_posizione" ? `Il ${Ue([...e.posizioni].sort((e, t) => (e === -1 ? 9 : e) - (t === -1 ? 9 : t)).map((e) => Be[e]))} ${B[e.giorno]} del mese` : `Il giorno ${Ue([...e.giorni].sort((e, t) => e - t).map(String))} di ogni mese`;
}
var We = (e) => {
	let [t, n] = e.split("-").map(Number);
	return `${n} ${H[t - 1]}`;
};
function Ge(e) {
	return e.tipo === "sempre" ? "Tutto l'anno" : e.tipo === "annuale" ? `Dal ${We(e.dal)} al ${We(e.al)}, ogni anno` : `Dal ${W(e.dal)} al ${W(e.al)}`;
}
var Ke = {
	piattaforma_non_valida: "gli orari della piattaforma non sono validi",
	periodi_non_validi: "servono da uno a quattro periodi",
	periodi_sovrapposti: "due periodi della piattaforma si sovrappongono",
	orari_non_validi: "l'orario settimanale di un periodo non è valido",
	fasce_non_valide: "da una a tre fasce orarie per giorno",
	fascia_non_valida: "in una fascia oraria la fine viene prima dell'inizio",
	fasce_sovrapposte: "due fasce orarie dello stesso giorno si sovrappongono",
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
}, q = (e) => Ke[e.codice] ?? e.codice, qe = {
	tipologia_sconosciuta: "tipologia non trovata nel foglio Tipologie",
	giorni_non_validi: "giorni non riconosciuti (per esempio Lun, Gio oppure 1, 15)",
	posizioni_non_valide: "posizioni non riconosciute (per esempio 2°, ultimo)",
	data_non_valida: "data non valida (per esempio 22/09/2026, o 01/06 per «Ogni anno»)",
	orario_non_valido: "orario non valido (per esempio 20:00)",
	colore_non_valido: "colore non valido (per esempio #795548)",
	destinatario_non_valido: "destinatario non valido (per esempio mobile_app_telefono o notify.telegram)",
	destinatari_mancanti: "manca almeno un destinatario"
}, Je = (e) => qe[e.codice] ?? Ke[e.codice] ?? e.codice;
function Ye(e) {
	return [
		e.foglio,
		e.riga ? U.riga(e.riga) : "",
		e.colonna ?? ""
	].filter(Boolean).join(" · ");
}
var Xe = {
	tipologie: ["Tipologie", !0],
	regole: ["Regole", !0],
	eccezioni: ["Eccezioni", !0],
	promemoria: ["Promemoria", !1],
	sospensioni: ["Vacanze", !0],
	piattaforma: ["Orari della piattaforma", !1],
	impostazioni: ["Impostazioni", !0]
};
function Ze(e, t) {
	let n = Xe[e];
	if (!n) return null;
	let [r, i] = n, a = (e, t) => `${e} ${t}${e === 1 ? i ? "a" : "o" : i ? "e" : "i"}`, o = [
		t.aggiunte ? a(t.aggiunte, "nuov") : null,
		t.modificate ? a(t.modificate, "modificat") : null,
		t.tolte ? a(t.tolte, "tolt") : null
	].filter(Boolean);
	return o.length ? `${r}: ${o.join(", ")}` : null;
}
function Qe(e, t) {
	let n = e.tipologia ? t(e.tipologia) : "", r = e.intervalli.map(([e, t]) => e === t ? W(e) : `dal ${W(e)} al ${W(t)}`).join(", ");
	switch (e.codice) {
		case "ritiro_festivo": return `${n}: ${W(e.data)} è un giorno festivo. Controlla cosa fa il comune.`;
		case "sovrapposizione_mista": return `${n}: la regola «${t(e.regole[0])}» cede a «${t(e.regole[1])}» ${r}.`;
		case "sovrapposizione_stesso_tipo": return `${n}: le regole «${t(e.regole[0])}» e «${t(e.regole[1])}» generano gli stessi ${e.conteggio} ritiri ${r}. Una delle due è di troppo?`;
		case "eccezione_senza_ritiro": return `${n}: il ${W(e.data)} non c'è un ritiro da togliere o spostare.`;
		case "eccezione_ridondante": return `${n}: il ${W(e.data)} il ritiro c'è già; l'eccezione non cambia nulla.`;
		case "giorno_inesistente": return `${n}: nei mesi senza il giorno ${e.giorni.join(" o ")} la regola «${t(e.regole[0])}» non genera il ritiro.`;
		case "tipologia_senza_ritiri": return `${n} non ha ritiri nei prossimi 12 mesi.`;
		case "calendario_in_scadenza": return `Il calendario vale fino al ${W(e.data)}: controlla quello nuovo del comune.`;
		case "calendario_scaduto": return `Il calendario è scaduto il ${W(e.data)}: i ritiri successivi sono da verificare.`;
		case "piattaforma_senza_orario": return e.data ? `Piattaforma ecologica: oggi l'orario non è indicato; il prossimo periodo inizia il ${W(e.data)}.` : "Piattaforma ecologica: gli orari inseriti sono finiti. Inserisci quelli nuovi.";
		case "piattaforma_in_scadenza": return `Piattaforma ecologica: gli orari inseriti finiscono il ${W(e.data)}. Inserisci quelli nuovi.`;
		default: return e.codice;
	}
}
var $e = (e) => e.nome || K(e.ricorrenza);
function et(e) {
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
var tt = Ce`<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%">
  <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 13.5 V9 H38 V13.5"/><path d="M10 14.5 H54"/><path d="M13.5 20 L17 57 H47 L50.5 20 Z"/>
    <polyline points="21,34 32,25 43,34" opacity="0.5"/><polyline points="25.5,40.5 32,35 38.5,40.5"/>
  </g>
  <rect x="28.5" y="46.5" width="7" height="7" fill="#F0A835"/><circle cx="32" cy="46.5" r="3.5" fill="#F0A835"/>
</svg>`, nt = document.querySelector("home-assistant") && !customElements.get("home-assistant") ? customElements.whenDefined("home-assistant") : Promise.resolve(), rt = (e) => void nt.then(e);
function J(e, t) {
	rt(() => {
		customElements.get(e) || customElements.define(e, t);
	});
}
J("rd-finestra", class extends A {
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
		this.styles = [j, o`
      :host {
        display: none;
      }
      :host([aperta]) {
        display: block;
        /* Il pannello nasconde le finestre delle pagine mentre "Prima di salvare" è
           aperta sopra di loro: una sola finestra, un solo paio di pulsanti. */
        visibility: var(--rd-visibilita-finestre, visible);
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
		return C`<div
      class="velo"
      @click=${(e) => e.target === e.currentTarget && this._chiudi()}
      @keydown=${(e) => e.key === "Escape" && this._chiudi()}
    >
      <div class="dialogo" role="dialog" aria-modal="true" aria-label=${this.titolo} tabindex="-1">
        <header>
          <h3>${this.titolo}</h3>
          <button aria-label=${U.chiudi} @click=${this._chiudi}><ha-icon icon="mdi:close"></ha-icon></button>
        </header>
        <div class="contenuto"><slot></slot></div>
        <footer><slot name="azioni"></slot></footer>
      </div>
    </div>`;
	}
});
//#endregion
//#region src/pannello/contesto.ts
var Y = (e, t, n) => e.dispatchEvent(new CustomEvent("proponi", {
	detail: {
		configurazione: t,
		riepilogo: n
	},
	bubbles: !0,
	composed: !0
})), it = (e, t) => e.dispatchEvent(new CustomEvent("avvisa", {
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
})), at = (e) => e.dispatchEvent(new CustomEvent("ricarica", {
	bubbles: !0,
	composed: !0
})), Z = (e) => JSON.parse(JSON.stringify(e)), ot = "foyer_raccolta_differenziata";
J("rd-panoramica", class extends A {
	constructor(...e) {
		super(...e), this._nome = (e) => {
			let t = this.lettura.configurazione, n = t.tipologie.find((t) => t.id === e);
			if (n) return n.nome;
			let r = t.regole.find((t) => t.id === e);
			return r ? $e(r) : e;
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
			type: `${ot}/ritiri`,
			dal: e,
			al: R(e, 29)
		});
	}
	async _ignora(e) {
		await this.hass.callWS({
			type: `${ot}/anomalie/ignora`,
			data: e.data,
			tipologia: e.tipologia
		}), at(this);
	}
	_festivi() {
		let e = new Set(this.lettura.festivi_ignorati.map((e) => `${e.data}|${e.tipologia}`));
		return (this._ritiri?.ritiri ?? []).filter((t) => t.festivo && !e.has(`${t.data}|${t.tipologia}`));
	}
	_azioni(e) {
		switch (e.codice) {
			case "tipologia_senza_ritiri": return C`<button class="bottone piccolo" @click=${() => X(this, "eccezioni", {
				tipo: "aggiungi",
				tipologia: e.tipologia,
				data: this.lettura.oggi
			})}>${U.aggiungiData}</button>`;
			case "sovrapposizione_mista":
			case "sovrapposizione_stesso_tipo":
			case "giorno_inesistente": return C`<button class="bottone piccolo" @click=${() => X(this, "regole")}>${U.apriRegole}</button>`;
			case "eccezione_senza_ritiro":
			case "eccezione_ridondante": return C`<button class="bottone piccolo" @click=${() => X(this, "eccezioni")}>${U.pagine.eccezioni}</button>`;
			case "piattaforma_senza_orario":
			case "piattaforma_in_scadenza": return C`<button class="bottone piccolo" @click=${() => X(this, "piattaforma")}>${U.pagine.piattaforma}</button>`;
			case "calendario_in_scadenza":
			case "calendario_scaduto": return C`<button class="bottone piccolo" @click=${() => X(this, "impostazioni")}>${U.pagine.impostazioni}</button>`;
			default: return T;
		}
	}
	_giorni() {
		let e = this.lettura.configurazione.tipologie, t = /* @__PURE__ */ new Map();
		for (let e of this._ritiri?.ritiri ?? []) t.set(e.data, [...t.get(e.data) ?? [], e]);
		if (!t.size) return C`<div class="vuoto">${U.nessunRitiro}</div>`;
		let n = this.lettura.oggi;
		return [...t.entries()].map(([t, r]) => {
			let i = Re(n, t), a = i === 0 ? U.oggi : i === 1 ? U.domani : V[z(t)];
			return C`<div class="giorno ${i === 0 ? "oggi" : ""}">
        <div class="quando"><b>${a}</b>${He(t)}</div>
        <div class="chips">
          ${r.map((t) => {
				let n = e.find((e) => e.id === t.tipologia);
				return C`${n ? F(n) : t.tipologia}
            ${t.spostato_dal ? C`<span class="nota">↪ ${He(t.spostato_dal)}</span>` : T}
            ${t.festivo ? C`<span class="nota avviso">${t.festivo}</span>` : T}`;
			})}
        </div>
      </div>`;
		});
	}
	_validita() {
		let e = this.lettura.configurazione.valido_fino_al;
		if (!e) return C`<p class="aiuto">${U.senzaValidita}</p>`;
		let t = Re(this.lettura.oggi, e);
		return t < 0 ? C`<p class="aiuto avviso">${U.scaduto(e)}</p>` : C`<div class="validita ${t <= 30 ? "avviso" : ""}">
      <div class="grande">${t}</div>
      <div>${U.giorniValidita}<br /><small class="aiuto">${U.validoFino(e)}</small></div>
    </div>`;
	}
	render() {
		let e = this._festivi(), t = this.lettura.anomalie, n = e.length + t.length;
		return C`
      ${this.lettura.problemi.length ? C`<div class="riquadro errore">
            ${U.configurazioneNonValida}
            <ul>${this.lettura.problemi.map((e) => C`<li>${q(e)}</li>`)}</ul>
          </div>` : T}
      <div class="griglia-2">
        <div class="riquadro">
          <h2>${U.prossimiRitiri} <span class="conta">${U.giorni30}</span></h2>
          ${this._giorni()}
        </div>
        <div class="laterale">
          <div class="riquadro">
            <h2>${U.daControllare} ${n ? C`<span class="conta">${n}</span>` : T}</h2>
            ${n === 0 ? C`<div class="vuoto">${U.tuttoInOrdine}</div>` : T}
            ${e.map((e) => C`<div class="anomalia">
                <ha-icon icon="mdi:alert-outline"></ha-icon>
                <div class="testo">
                  <b>${this._nome(e.tipologia)}</b> · ${W(e.data)}: ${e.festivo}.
                  <div class="riga-azioni">
                    <button class="bottone piccolo primario" @click=${() => X(this, "eccezioni", {
			tipo: "sposta",
			tipologia: e.tipologia,
			data: e.data
		})}>${U.creaEccezione}</button>
                    <button class="bottone piccolo" @click=${() => this._ignora(e)}>${U.ignora}</button>
                  </div>
                </div>
              </div>`)}
            ${t.map((e) => C`<div class="anomalia ${e.gravita}">
                <ha-icon icon=${e.gravita === "avviso" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
                <div class="testo">${Qe(e, this._nome)}<div class="riga-azioni">${this._azioni(e)}</div></div>
              </div>`)}
          </div>
          <div class="riquadro">
            <h2>${U.calendarioComune}</h2>
            ${this._validita()}
          </div>
        </div>
      </div>
    `;
	}
	static {
		this.styles = [
			j,
			P,
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
});
//#endregion
//#region src/comune/selettore.ts
var st = 60;
J("rd-selettore", class e extends A {
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
		return this.opzioni.filter((e) => !this.multiplo || !this.scelti.includes(e.id)).filter((e) => !this._gruppo || e.gruppo === this._gruppo).filter((t) => !e || t.nome.toLowerCase().includes(e) || t.id.toLowerCase().includes(e)).slice(0, st);
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
		return C`<li
      id=${`${this._idLista}-${t}`}
      role="option"
      aria-selected=${n}
      class=${n ? "attiva" : ""}
      @mousedown=${(e) => e.preventDefault()}
      @click=${() => this._scegli(e)}
      @mouseenter=${() => this._attivo = t}
    >
      ${e.icona ? C`<ha-icon .icon=${e.icona}></ha-icon>` : T}
      <span class="testi"><span class="nome">${e.nome}</span>${e.dettaglio ? C`<small>${e.dettaglio}</small>` : T}</span>
      ${e.etichetta ? C`<span class="etichetta ${e.etichettaEvidente ? "evidente" : ""}">${e.etichetta}</span>` : T}
    </li>`;
	}
	_scelte() {
		return this.multiplo ? this.scelti.length ? C`<ul class="scelte" aria-label=${this.etichetta}>
      ${this.scelti.map((e) => {
			let t = this.opzioni.find((t) => t.id === e);
			return C`<li class=${t ? "" : "mancante"}>
          ${t?.icona ? C`<ha-icon .icon=${t.icona}></ha-icon>` : C`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
          <span class="testi">
            <span class="nome">${t?.nome ?? e}</span>
            <small>${t ? t.dettaglio ?? e : U.nonTrovato}</small>
          </span>
          ${t?.etichetta ? C`<span class="etichetta ${t.etichettaEvidente ? "evidente" : ""}">${t.etichetta}</span>` : T}
          <button class="togli" aria-label=${`${U.togli} ${t?.nome ?? e}`} title=${U.togli} @click=${() => this._cambia(this.scelti.filter((t) => t !== e))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </li>`;
		})}
    </ul>` : C`<div class="nessuna">${this.vuoto}</div>` : T;
	}
	render() {
		let e = [...new Set(this.opzioni.map((e) => e.gruppo).filter((e) => !!e))], t = this._aperto ? this._suggerimenti() : [], n = Math.min(this._attivo, Math.max(t.length - 1, 0)), r = this.multiplo ? void 0 : this.opzioni.find((e) => e.id === this.scelti[0]);
		return C`
      ${this._scelte()}
      <div class="campo-ricerca ${this._aperto ? "aperto" : ""}">
        ${!this.multiplo && this.scelti[0] ? C`<ha-icon class="anteprima" .icon=${r?.icona ?? this.scelti[0]}></ha-icon>` : C`<ha-icon class="lente" icon="mdi:magnify"></ha-icon>`}
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
      ${this._aperto ? C`<div class="tendina">
            ${e.length > 1 ? C`<div class="filtri" @mousedown=${(e) => e.preventDefault()}>
                  ${["", ...e].map((e) => C`<button class=${this._gruppo === e ? "attivo" : ""} @click=${() => (this._gruppo = e, this._attivo = 0)}>
                      ${e || U.tutti}
                    </button>`)}
                </div>` : T}
            <ul id=${this._idLista} role="listbox" aria-label=${this.etichetta}>
              ${t.length ? t.map((e, t) => this._riga(e, t, t === n)) : C`<li class="niente" role="presentation">
                    ${this.libero && this._testo.trim() ? U.usaValore(this._testo.trim()) : U.nessunRisultato}
                  </li>`}
            </ul>
          </div>` : T}
    `;
	}
	static {
		this.styles = [j, o`
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
});
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
];
J("rd-tipologie", class extends A {
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
			al: R(e, 365)
		}), n = {};
		for (let e of t.ritiri) n[e.tipologia] ??= e.data;
		this._prossimi = n;
	}
	_nuova() {
		let e = new Set(this.lettura.configurazione.tipologie.map((e) => e.colore.toLowerCase()));
		this._bozza = {
			id: I(),
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
		let e = this._bozza, t = this.lettura.configurazione, n = t.regole.filter((t) => t.tipologia === e.id).length, r = t.eccezioni.filter((t) => t.tipologia === e.id).length, i = t.promemoria.filter((t) => t.tipologie?.length === 1 && t.tipologie[0] === e.id).length, a = U.eliminaTipologia(e.nome, n, r) + (i ? ` ${U.profiloRimosso(i)}` : "");
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
		if (!e) return T;
		let t = this.lettura.configurazione.tipologie.some((t) => t.id === e.id);
		return C`<rd-finestra aperta titolo=${t && e.nome || U.nuovaTipologia} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="anteprima-testa" style="background:${e.colore};color:${N(e.colore)}">
          <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome || U.nome}</b>
        </div>
        <div class="campo">
          <label for="nome">${U.nome}</label>
          <input id="nome" maxlength="40" .value=${e.nome} @input=${(e) => this._aggiorna({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${U.colore}</span>
          <div class="colori">
            ${Q.map((t) => C`<button class="colore ${t === e.colore ? "attivo" : ""}" style="background:${t}" aria-label=${t} @click=${() => this._aggiorna({ colore: t })}></button>`)}
            <label class="colore altro ${Q.includes(e.colore) ? "" : "attivo"}" style=${Q.includes(e.colore) ? "" : `background:${e.colore}`} title=${U.altroColore}>
              <ha-icon icon="mdi:palette"></ha-icon>
              <input type="color" aria-label=${U.altroColore} .value=${e.colore} @input=${(e) => this._aggiorna({ colore: e.target.value })} />
            </label>
          </div>
        </div>
        <div class="campo">
          <span class="etichetta">${U.icona}</span>
          <rd-selettore
            libero
            .opzioni=${ct}
            .scelti=${[e.icona]}
            etichetta=${U.icona}
            segnaposto=${U.cercaIcona}
            @cambia=${(e) => this._aggiorna({ icona: e.detail[0] })}
          ></rd-selettore>
          <small>${U.iconaAiuto}</small>
        </div>
        <div class="campo">
          <label for="note">${U.note}</label>
          <textarea id="note" maxlength="500" .value=${e.note} @input=${(e) => this._aggiorna({ note: e.target.value })}></textarea>
        </div>
        <label class="spunta">
          <input type="checkbox" .checked=${e.esposizione !== null} @change=${(e) => this._aggiorna({ esposizione: e.target.checked ? { ...this.lettura.configurazione.esposizione } : null })} />
          ${U.finestraPropria}
        </label>
        ${e.esposizione ? C`<div class="riga-campi">
                <div class="campo">
                  <label>${U.dalle}</label>
                  <input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._aggiornaFinestra({ inizio_ora: e.target.value })} />
                </div>
                <div class="campo">
                  <label>${U.del}</label>
                  <select @change=${(e) => this._aggiornaFinestra({ inizio_giorno: e.target.value })}>
                    ${["giorno_prima", "giorno_stesso"].map((t) => C`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${U.inizioGiorno[t]}</option>`)}
                  </select>
                </div>
              </div>
              <div class="campo">
                <label>${U.entroLe}</label>
                <input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._aggiornaFinestra({ fine_ora: e.target.value })} />
              </div>` : T}
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? C`<button class="bottone pericolo" @click=${this._elimina}>${U.elimina}</button>` : T}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${U.annulla}</button>
        <button class="bottone primario" ?disabled=${!e.nome.trim()} @click=${this._salva}>${U.salva}</button>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione.tipologie;
		return C`<div class="riquadro">
        <h2>${U.pagine.tipologie} <span class="conta">${e.length}</span></h2>
        <p class="aiuto">${U.aiutoTipologie}</p>
        <div class="griglia">
          ${e.map((e) => C`<button class="tipologia" @click=${() => this._bozza = Z(e)}>
              <div class="testa" style="background:${e.colore};color:${N(e.colore)}">
                <span class="cerchio"><ha-icon .icon=${e.icona}></ha-icon></span><b>${e.nome}</b>
              </div>
              <div class="corpo">${e.note || C`<i>${U.nessunaNota}</i>`}</div>
              <div class="piede">
                <span>${U.prossimo}: <b>${this._prossimi[e.id] ? He(this._prossimi[e.id]) : "—"}</b></span>
                <span class="link">${U.modifica}</span>
              </div>
            </button>`)}
          <button class="nuova" @click=${this._nuova}><ha-icon icon="mdi:plus"></ha-icon>${U.nuovaTipologia}</button>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
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
});
//#endregion
//#region src/pannello/pagine/regole.ts
var ut = "foyer_raccolta_differenziata", dt = {
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
}, ft = {
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
}, pt = (e, t) => e.includes(t) ? e.filter((e) => e !== t) : [...e, t];
J("rd-regole", class extends A {
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
			id: I(),
			tipologia: e,
			nome: "",
			ricorrenza: dt.settimanale(t),
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
				type: `${ut}/anteprima`,
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
		let t = (t, n) => C`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			ricorrenza: dt[t](this.lettura.oggi)
		})}>${n}</button>`;
		return C`<div class="campo">
        <span class="etichetta">${U.ricorrenza}</span>
        <div class="segmenti">
          ${t("settimanale", U.ogniSettimane)} ${t("mensile_posizione", U.posizioneMese)}
          ${t("mensile_data", U.dataMese)}
        </div>
      </div>
      ${e.tipo === "settimanale" ? C`<div class="campo">
              <span class="etichetta">${U.ogniQuanteSettimane}</span>
              <div class="tonde otto" role="radiogroup" aria-label=${U.ogniQuanteSettimane}>
                ${[
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		].map((t) => C`<button role="radio" aria-checked=${e.ogni === t} class=${e.ogni === t ? "attivo" : ""} @click=${() => this._ricorrenza({ ogni: t })}>${t}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${U.neiGiorni}</span>
              <div class="tonde sette">
                ${V.map((t, n) => C`<button class=${e.giorni.includes(n) ? "attivo" : ""} aria-pressed=${e.giorni.includes(n)} aria-label=${B[n]} @click=${() => this._ricorrenza({ giorni: pt(e.giorni, n).sort() })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>
            ${e.ogni > 1 ? C`<div class="campo">
                  <label for="ancora">${U.ancora}</label>
                  <input id="ancora" type="date" .value=${e.ancora} @change=${(e) => this._ricorrenza({ ancora: e.target.value })} />
                  <small>${U.ancoraAiuto}</small>
                </div>` : T}` : T}
      ${e.tipo === "mensile_posizione" ? C`<div class="campo">
              <span class="etichetta">${U.quali}</span>
              <div class="tonde">
                ${[
			1,
			2,
			3,
			4,
			-1
		].map((t) => C`<button class=${e.posizioni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ posizioni: pt(e.posizioni, t) })}>${Ve[t]}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${U.giornoSettimana}</span>
              <div class="tonde sette">
                ${V.map((t, n) => C`<button class=${e.giorno === n ? "attivo" : ""} @click=${() => this._ricorrenza({ giorno: n })}>${t.slice(0, 2)}</button>`)}
              </div>
            </div>` : T}
      ${e.tipo === "mensile_data" ? C`<div class="campo">
            <span class="etichetta">${U.giorniDelMese}</span>
            <div class="tonde calendario">
              ${Array.from({ length: 31 }, (e, t) => t + 1).map((t) => C`<button class=${e.giorni.includes(t) ? "attivo" : ""} @click=${() => this._ricorrenza({ giorni: pt(e.giorni, t).sort((e, t) => e - t) })}>${t}</button>`)}
            </div>
          </div>` : T}`;
	}
	_meseGiorno(e, t) {
		let [n, r] = e.split("-").map(Number), i = (e, n) => t(`${String(e).padStart(2, "0")}-${String(n).padStart(2, "0")}`);
		return C`<div class="riga-campi">
      <select aria-label=${U.giorno} @change=${(e) => i(n, Number(e.target.value))}>
        ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => C`<option value=${e} ?selected=${e === r}>${e}</option>`)}
      </select>
      <select aria-label=${U.mese} @change=${(e) => i(Number(e.target.value), r)}>
        ${H.map((e, t) => C`<option value=${t + 1} ?selected=${t + 1 === n}>${e}</option>`)}
      </select>
    </div>`;
	}
	_editorPeriodo(e) {
		let t = (t, n) => C`<button class=${e.tipo === t ? "attivo" : ""} @click=${() => e.tipo !== t && this._imposta({
			...this._bozza,
			periodo: ft[t](this.lettura.oggi)
		})}>${n}</button>`;
		return C`<div class="campo">
        <span class="etichetta">${U.periodo}</span>
        <div class="segmenti">${t("sempre", U.sempre)} ${t("annuale", U.annuale)} ${t("con_anno", U.conAnno)}</div>
      </div>
      ${e.tipo === "annuale" ? C`<div class="riga-campi">
            <div class="campo"><span class="etichetta">${U.dal}</span>${this._meseGiorno(e.dal, (e) => this._periodo({ dal: e }))}</div>
            <div class="campo"><span class="etichetta">${U.al}</span>${this._meseGiorno(e.al, (e) => this._periodo({ al: e }))}</div>
          </div>` : T}
      ${e.tipo === "con_anno" ? C`<div class="riga-campi">
            <div class="campo"><label>${U.dal}</label><input type="date" .value=${e.dal} @change=${(e) => this._periodo({ dal: e.target.value })} /></div>
            <div class="campo"><label>${U.al}</label><input type="date" .value=${e.al} @change=${(e) => this._periodo({ al: e.target.value })} /></div>
          </div>` : T}`;
	}
	_editor() {
		let e = this._bozza;
		if (!e) return T;
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = this.lettura.configurazione.regole.some((t) => t.id === e.id);
		return C`<rd-finestra aperta titolo=${`${n ? U.modifica : U.nuovaRegola} · ${t?.nome ?? ""}`} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="riepilogo" aria-live="polite">
          ${this._valida(e) ? K(e.ricorrenza) : U.completaLaRegola}
          <small>${Ge(e.periodo)}</small>
        </div>
        <div class="campo">
          <label for="nome">${U.nomeRegola}</label>
          <input id="nome" maxlength="40" .value=${e.nome} placeholder=${U.nomeRegolaAiuto} @input=${(t) => this._bozza = {
			...e,
			nome: t.target.value
		}} />
        </div>
        ${this._editorRicorrenza(e.ricorrenza)} ${this._editorPeriodo(e.periodo)}
        <div class="campo">
          <span class="etichetta">${U.prossimeDate}</span>
          ${this._problemi.length ? C`<div class="errori">${this._problemi.map((e) => C`<div>${q(e)}</div>`)}</div>` : this._date.length ? C`<div class="anteprima-date">${this._date.map((e) => C`<span>${G(e)}</span>`)}</div>` : C`<div class="aiuto">${U.nessunaData}</div>`}
        </div>
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${n ? C`<button class="bottone pericolo" @click=${this._elimina}>${U.elimina}</button>` : T}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${U.annulla}</button>
        <button class="bottone primario" ?disabled=${this._problemi.length > 0 || this._inCorso} @click=${() => Y(this, this._candidata())}>${U.salva}</button>
      </div>
    </rd-finestra>`;
	}
	render() {
		let e = this.lettura.configurazione;
		return C`<div class="riquadro">
        <h2>${U.pagine.regole}</h2>
        <p class="aiuto">${U.aiutoRegole}</p>
        ${e.tipologie.map((t) => {
			let n = e.regole.filter((e) => e.tipologia === t.id);
			return C`<section class="gruppo">
            <div class="titolo">${F(t)}</div>
            ${n.length ? n.map((e) => C`<button class="voce cliccabile" aria-label=${`${U.modifica}: ${e.nome || K(e.ricorrenza)}`} @click=${() => this._imposta(Z(e))}>
                    <div class="frase">
                      ${e.nome ? C`<b>${e.nome}</b> · ` : T}${K(e.ricorrenza)}
                      <small>${Ge(e.periodo)}</small>
                    </div>
                    <ha-icon class="freccia" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
                  </button>`) : C`<div class="vuoto">${U.nessunaRegola}</div>`}
            <button class="bottone piccolo" @click=${() => this._nuova(t.id)}><ha-icon icon="mdi:plus"></ha-icon>${U.nuovaRegola}</button>
          </section>`;
		})}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
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
});
//#endregion
//#region src/pannello/pagine/eccezioni.ts
var mt = "foyer_raccolta_differenziata", ht = (e) => e.tipo === "sposta" ? e.da : e.data;
J("rd-eccezioni", class extends A {
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
		if (e.has("precompila") && this.precompila && this.precompila !== this._usata) {
			this._usata = this.precompila;
			let e = this.precompila;
			this._nuova(e.tipo, e.tipologia, e.data);
		}
	}
	_nuova(e, t, n) {
		let r = t ?? this.lettura.configurazione.tipologie[0]?.id ?? "", i = n ?? this.lettura.oggi;
		this._bozza = e === "sposta" ? {
			id: I(),
			tipo: e,
			tipologia: r,
			da: i,
			a: i,
			nota: ""
		} : {
			id: I(),
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
		return t >= 0 ? e.eccezioni[t] = n : e.eccezioni.push(n), e.eccezioni.sort((e, t) => ht(e).localeCompare(ht(t))), e;
	}
	async _salva() {
		let e = this._candidata(), t = await this.hass.callWS({
			type: `${mt}/anteprima`,
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
			aggiungi: U.aggiungiRitiro,
			togli: U.togliRitiro,
			sposta: U.spostaRitiro
		}[e.tipo]} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${U.tipologia}</span>
          <div class="scelta-tipologie">
            ${this.lettura.configurazione.tipologie.map((t) => C`<button class=${t.id === e.tipologia ? "attivo" : ""} @click=${() => this._aggiorna({ tipologia: t.id })}>${F(t)}</button>`)}
          </div>
        </div>
        ${e.tipo === "sposta" ? C`<div class="riga-campi">${this._data(U.da, "da", e.da)} ${this._data(U.a, "a", e.a)}</div>` : this._data(U.data, "data", e.data)}
        <div class="campo">
          <label for="nota">${U.nota}</label>
          <input id="nota" maxlength="200" .value=${e.nota ?? ""} @input=${(e) => this._aggiorna({ nota: e.target.value })} />
        </div>
        ${this._problemi.length ? C`<div class="errori">${this._problemi.map((e) => C`<div>${q(e)}</div>`)}</div>` : T}
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? C`<button class="bottone pericolo" @click=${this._elimina}>${U.elimina}</button>` : T}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${U.annulla}</button>
        <button class="bottone primario" @click=${this._salva}>${U.salva}</button>
      </div>
    </rd-finestra>`;
	}
	_riga(e) {
		let t = this.lettura.configurazione.tipologie.find((t) => t.id === e.tipologia), n = e.tipo === "sposta" ? C`${G(e.da)} → ${G(e.a)}` : G(e.data);
		return C`<button class="voce cliccabile" aria-label=${U.modifica} @click=${() => (this._bozza = Z(e), this._problemi = [])}>
      <div class="frase">
        <span class="testa-eccezione"><span class="badge ${e.tipo}">${U.tipoEccezione[e.tipo]}</span>${t ? F(t) : T}</span>
        <b>${n}</b>${e.nota ? C`<small>${e.nota}</small>` : T}
      </div>
      <ha-icon class="freccia" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
    </button>`;
	}
	render() {
		let e = this.lettura.configurazione.eccezioni, t = this.lettura.oggi, n = (e) => e.tipo === "sposta" ? e.a > e.da ? e.a : e.da : e.data, r = e.filter((e) => n(e) >= t), i = e.filter((e) => n(e) < t);
		return C`<div class="riquadro">
        <h2>${U.pagine.eccezioni} <span class="conta">${r.length}</span></h2>
        <p class="aiuto">${U.aiutoEccezioni}</p>
        ${r.length ? r.map((e) => this._riga(e)) : C`<div class="vuoto">${U.nessunaEccezione}</div>`}
        <div class="riga-azioni">
          <button class="bottone primario" @click=${() => this._nuova("aggiungi")}><ha-icon icon="mdi:plus"></ha-icon>${U.aggiungiRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("togli")}><ha-icon icon="mdi:minus"></ha-icon>${U.togliRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("sposta")}><ha-icon icon="mdi:arrow-right"></ha-icon>${U.spostaRitiro}</button>
        </div>
        ${i.length ? C`<details @toggle=${(e) => this._passate = e.target.open}>
              <summary>${U.passate} (${i.length})</summary>
              ${this._passate ? i.map((e) => this._riga(e)) : T}
            </details>` : T}
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
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
});
//#endregion
//#region src/pannello/pagine/promemoria.ts
var gt = /* @__PURE__ */ new Set([
	"send_message",
	"persistent_notification",
	"notify"
]), _t = [
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
], vt = {
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
}, yt = (e) => `${e.tipo}:${e.id}`, bt = (e) => {
	let [t, ...n] = e.split(":");
	return {
		tipo: t,
		id: n.join(":")
	};
}, xt = (e) => {
	let t = e.replaceAll("_", " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}, St = (e) => e.tipo === "servizio" && e.id.startsWith("mobile_app_");
J("rd-promemoria", class extends A {
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
		let e = Object.keys(this.hass.services?.notify ?? {}).filter((e) => !gt.has(e)).map((e) => {
			let t = e.startsWith("mobile_app_");
			return {
				id: `servizio:${e}`,
				nome: xt(e.replace(/^mobile_app_/, "")),
				dettaglio: `notify.${e}`,
				etichetta: t ? U.conPulsanti : U.soloTesto,
				etichettaEvidente: t,
				icona: t ? "mdi:cellphone" : "mdi:message-text-outline",
				gruppo: t ? U.gruppoCompanion : U.gruppoServizi
			};
		}), t = Object.keys(this.hass.states ?? {}).filter((e) => e.startsWith("notify.")).map((e) => ({
			id: `entita:${e}`,
			nome: String(this.hass.states[e].attributes.friendly_name ?? e),
			dettaglio: e,
			etichetta: U.soloTesto,
			icona: "mdi:bell-badge-outline",
			gruppo: U.gruppoEntita
		})), n = [
			U.gruppoCompanion,
			U.gruppoServizi,
			U.gruppoEntita
		];
		return [...e, ...t].sort((e, t) => n.indexOf(e.gruppo) - n.indexOf(t.gruppo) || e.nome.localeCompare(t.nome));
	}
	_nuovo() {
		this._bozza = {
			id: I(),
			nome: "",
			attivo: !0,
			quando: vt.giorni_prima(),
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
		if (!e) return T;
		let t = this.lettura.configurazione.promemoria.some((t) => t.id === e.id), n = this.lettura.configurazione.tipologie, r = (t) => this._bozza = {
			...e,
			...t
		}, i = e.quando, a = (e, t) => C`<button class=${i.tipo === e ? "attivo" : ""} @click=${() => i.tipo !== e && r({ quando: vt[e]() })}>${t}</button>`, o = this._disponibili(), s = e.nome.trim() && e.destinatari.length && (e.tipologie === null || e.tipologie.length);
		return C`<rd-finestra aperta titolo=${t && e.nome || U.nuovoPromemoria} @chiudi=${() => this._bozza = void 0}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${U.nomePromemoria}</label>
          <input id="nome" maxlength="40" placeholder=${U.nomePromemoriaAiuto} .value=${e.nome} @input=${(e) => r({ nome: e.target.value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${U.quando}</span>
          <div class="segmenti">${a("giorni_prima", U.giorniPrima)} ${a("giorno_stesso", U.giornoStesso)} ${a("apertura", U.apertura)}</div>
          ${i.tipo === "apertura" ? C`<small>${U.aperturaAiuto}</small>` : T}
        </div>
        ${i.tipo === "giorni_prima" ? C`<div class="campo">
              <span class="etichetta">${U.quantiGiorni}</span>
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
              <label for="ora">${U.alle}</label>
              <input id="ora" type="time" .value=${i.ora} @change=${(e) => r({ quando: {
			...i,
			ora: e.target.value
		} })} />
            </div>`}
        <div class="campo">
          <span class="etichetta">${U.perQuali}</span>
          <div class="scelta">
            <button class="tutte ${e.tipologie === null ? "attivo" : ""}" @click=${() => r({ tipologie: e.tipologie === null ? n.map((e) => e.id) : null })}>${U.tutte}</button>
            ${n.map((t) => C`<button class=${e.tipologie === null || e.tipologie.includes(t.id) ? "attivo" : ""} @click=${() => {
			let i = e.tipologie ?? n.map((e) => e.id);
			r({ tipologie: i.includes(t.id) ? i.filter((e) => e !== t.id) : [...i, t.id] });
		}}>${F(t)}</button>`)}
          </div>
          <small>${U.tutteAiuto}</small>
        </div>
        <div class="campo">
          <span class="etichetta">${U.destinatari}</span>
          ${o.length || e.destinatari.length ? C`<rd-selettore
                multiplo
                .opzioni=${o}
                .scelti=${e.destinatari.map(yt)}
                etichetta=${U.destinatari}
                segnaposto=${U.cercaDestinatario}
                vuoto=${U.nessunDestinatarioScelto}
                @cambia=${(e) => r({ destinatari: e.detail.map(bt) })}
              ></rd-selettore>` : C`<div class="aiuto">${U.nessunDestinatario}</div>`}
          <small>${U.destinatariAiuto}</small>
        </div>
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${t ? C`<button class="bottone pericolo" @click=${this._eliminaProfilo}>${U.elimina}</button>` : T}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._bozza = void 0}>${U.annulla}</button>
        <button class="bottone primario" ?disabled=${!s} @click=${this._salvaProfilo}>${U.salva}</button>
      </div>
    </rd-finestra>`;
	}
	_riepilogo(e) {
		let t = this.lettura.configurazione.tipologie, n = e.tipologie === null ? U.tutte : e.tipologie.map((e) => t.find((t) => t.id === e)?.nome ?? e).join(", "), r = e.destinatari.filter(St).length;
		return C`${n} · ${e.destinatari.length} ${e.destinatari.length === 1 ? "destinatario" : "destinatari"}${r ? C` · ${r} con pulsanti` : T}`;
	}
	render() {
		let e = this.lettura.configurazione, t = e.solleciti;
		return C`<div class="griglia-2">
        <div>
          <div class="riquadro">
            <h2>${U.pagine.promemoria} <span class="conta">${e.promemoria.length}</span></h2>
            <p class="aiuto">${U.aiutoPromemoria}</p>
            ${e.promemoria.length ? e.promemoria.map((e) => C`<div class="voce ${e.attivo ? "" : "spento"}">
                    <button class="apri" aria-label=${`${U.modifica}: ${e.nome}`} @click=${() => this._bozza = Z(e)}>
                      <ha-icon class="campana" icon=${e.attivo ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}></ha-icon>
                      <div class="frase"><b>${e.nome}</b> · ${et(e.quando)}<small>${this._riepilogo(e)}</small></div>
                    </button>
                    <button class="levetta ${e.attivo ? "acceso" : ""}" role="switch" aria-checked=${e.attivo} aria-label=${`${U.attivo}: ${e.nome}`} @click=${() => this._attiva(e)}></button>
                  </div>`) : C`<div class="vuoto">${U.nessunPromemoria}</div>`}
            <div class="riga-azioni">
              <button class="bottone primario" @click=${this._nuovo}><ha-icon icon="mdi:plus"></ha-icon>${U.nuovoPromemoria}</button>
            </div>
          </div>
          <div class="riquadro">
            <h2>${U.solleciti}</h2>
            <div class="interruttore">
              <div>${U.sollecitaSeNonConfermo}<small>${U.sollecitiAiuto}</small></div>
              <button class="levetta ${t.attivi ? "acceso" : ""}" role="switch" aria-checked=${t.attivi} aria-label=${U.sollecitaSeNonConfermo} @click=${() => this._solleciti({ attivi: !t.attivi })}></button>
            </div>
            ${t.attivi ? C`<div class="riga-campi">
                  <div class="campo">
                    <span class="etichetta">${U.richiami}</span>
                    <div class="segmenti">${[1, 2].map((e) => C`<button class=${t.richiami === e ? "attivo" : ""} @click=${() => this._solleciti({ richiami: e })}>${e}</button>`)}</div>
                  </div>
                  <div class="campo">
                    <label for="minuti">${U.ogniMinuti}</label>
                    <select id="minuti" @change=${(e) => this._solleciti({ richiamo_dopo: Number(e.target.value) })}>
                      ${_t.map((e) => C`<option value=${e} ?selected=${t.richiamo_dopo === e}>${U.minuti(e)}</option>`)}
                    </select>
                  </div>
                </div>` : T}
          </div>
        </div>
        <div class="riquadro">
          <h2>${U.vacanze}</h2>
          <p class="aiuto">${U.vacanzeAiuto}</p>
          ${e.sospensioni.length ? e.sospensioni.map((e, t) => C`<div class="voce">
                  <ha-icon icon="mdi:beach"></ha-icon>
                  <div class="frase">${U.dalAl(e.dal, e.al)}</div>
                  <button class="bottone piccolo" @click=${() => this._togliVacanza(t)}>${U.togli}</button>
                </div>`) : C`<div class="vuoto">${U.nessunaVacanza}</div>`}
          <div class="riga-campi vacanza">
            <div class="campo"><label>${U.dal}</label><input type="date" .value=${this._vacanza.dal} @change=${(e) => this._vacanza = {
			...this._vacanza,
			dal: e.target.value
		}} /></div>
            <div class="campo"><label>${U.al}</label><input type="date" .value=${this._vacanza.al} @change=${(e) => this._vacanza = {
			...this._vacanza,
			al: e.target.value
		}} /></div>
          </div>
          <div class="riga-azioni">
            <button class="bottone" ?disabled=${!this._vacanza.dal || !this._vacanza.al} @click=${this._aggiungiVacanza}><ha-icon icon="mdi:plus"></ha-icon>${U.aggiungiVacanza}</button>
          </div>
        </div>
      </div>
      ${this._editor()}`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
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
});
//#endregion
//#region src/pannello/pagine/piattaforma.ts
var Ct = 4, wt = 3, Tt = ["08:00", "12:00"], Et = () => Array.from({ length: 7 }, () => []);
J("rd-piattaforma", class extends A {
	static {
		this.properties = {
			hass: { attribute: !1 },
			lettura: { attribute: !1 },
			_bozza: { state: !0 }
		};
	}
	willUpdate(e) {
		if (!e.has("lettura")) return;
		let t = this._bozza === void 0 || JSON.stringify(this._bozza) === this._base;
		this._revisione !== this.lettura.revisione && t && this._ricomincia();
	}
	_ricomincia() {
		this._bozza = Z(this.lettura.configurazione.piattaforma ?? null), this._base = JSON.stringify(this._bozza), this._revisione = this.lettura.revisione;
	}
	chiudiEditor() {
		this._bozza = void 0, this._base = void 0, this._revisione = void 0;
	}
	_aggiorna(e) {
		this._bozza = {
			...this._bozza,
			...e
		};
	}
	_nuova() {
		let e = this.lettura.oggi.slice(0, 4);
		this._bozza = {
			nome: U.piattaformaTitolo,
			nota: "",
			periodi: [{
				id: I(),
				dal: `${e}-01-01`,
				al: `${e}-12-31`,
				settimana: Et()
			}],
			eccezioni: []
		};
	}
	_periodo(e, t) {
		let n = this._bozza.periodi.map((n, r) => r === e ? {
			...n,
			...t
		} : n);
		this._aggiorna({ periodi: n });
	}
	_fasce(e, t, n) {
		let r = this._bozza.periodi[e].settimana.map((e, r) => r === t ? n : e);
		this._periodo(e, { settimana: r });
	}
	_aggiungiPeriodo() {
		let e = [...this._bozza.periodi].sort((e, t) => e.dal.localeCompare(t.dal)).at(-1), t = e ? R(e.al, 1) : this.lettura.oggi, n = {
			id: I(),
			dal: t,
			al: R(t, 364),
			settimana: e ? Z(e.settimana) : Et()
		};
		this._aggiorna({ periodi: [...this._bozza.periodi, n] });
	}
	_eccezione(e, t) {
		let n = this._bozza.eccezioni.map((n, r) => r === e ? {
			...n,
			...t
		} : n);
		this._aggiorna({ eccezioni: n });
	}
	_salva() {
		let e = Z(this.lettura.configurazione), t = this._bozza ? Z(this._bozza) : null;
		if (t) {
			t.nome = t.nome.trim(), t.nota = t.nota.trim(), t.periodi.sort((e, t) => e.dal.localeCompare(t.dal)), t.eccezioni.sort((e, t) => e.data.localeCompare(t.data));
			for (let e of t.eccezioni) e.tipo === "chiusa" && (e.fasce = []);
		}
		e.piattaforma = t, Y(this, e);
	}
	_togli() {
		confirm(U.togliPiattaformaConferma) && (this._bozza = null);
	}
	_campoOra(e, t, n) {
		return C`<input type="time" aria-label=${n} .value=${e} @change=${(e) => t(e.target.value)} />`;
	}
	_fasceModulo(e, t) {
		return C`<div class="fasce">
      ${e.length ? T : C`<span class="chiusa">${U.chiusa}</span>`}
      ${e.map(([n, r], i) => C`<span class="fascia">
          ${this._campoOra(n, (n) => t(e.map((e, t) => t === i ? [n, e[1]] : e)), U.orariDa)}
          <span aria-hidden="true">–</span>
          ${this._campoOra(r, (n) => t(e.map((e, t) => t === i ? [e[0], n] : e)), U.orariA)}
          <button class="icona" aria-label=${U.togliFascia} title=${U.togliFascia} @click=${() => t(e.filter((e, t) => t !== i))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </span>`)}
      ${e.length < wt ? C`<button class="icona" aria-label=${U.aggiungiFascia} title=${U.aggiungiFascia}
            @click=${() => t([...e, e.length ? [e.at(-1)[1], e.at(-1)[1]] : Tt])}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>` : T}
    </div>`;
	}
	_periodoModulo(e, t) {
		let n = this._bozza.periodi.length > 1;
		return C`<div class="periodo">
      <div class="testa-periodo">
        <div class="campo"><label>${U.dal}</label><input type="date" .value=${e.dal} @change=${(e) => this._periodo(t, { dal: e.target.value })} /></div>
        <div class="campo"><label>${U.al}</label><input type="date" .value=${e.al} @change=${(e) => this._periodo(t, { al: e.target.value })} /></div>
        ${n ? C`<button class="bottone piccolo pericolo" @click=${() => this._aggiorna({ periodi: this._bozza.periodi.filter((e, n) => n !== t) })}>${U.togliPeriodo}</button>` : T}
      </div>
      ${e.settimana.map((e, n) => C`<div class="giorno">
          <b>${V[n]}</b>
          ${this._fasceModulo(e, (e) => this._fasce(t, n, e))}
        </div>`)}
    </div>`;
	}
	_eccezioneModulo(e, t) {
		return C`<div class="eccezione">
      <input type="date" aria-label=${U.data} .value=${e.data} @change=${(e) => this._eccezione(t, { data: e.target.value })} />
      <div class="segmenti">
        ${["chiusa", "aperta"].map((n) => C`<button class=${e.tipo === n ? "attivo" : ""}
            @click=${() => this._eccezione(t, {
			tipo: n,
			fasce: n === "aperta" && !e.fasce.length ? [Tt] : e.fasce
		})}>
            ${n === "chiusa" ? U.chiusa : U.aperta}
          </button>`)}
      </div>
      ${e.tipo === "aperta" ? this._fasceModulo(e.fasce, (e) => this._eccezione(t, { fasce: e })) : T}
      <input class="nota" placeholder=${U.nota} maxlength="200" .value=${e.nota} @input=${(e) => this._eccezione(t, { nota: e.target.value })} />
      <button class="icona" aria-label=${U.elimina} title=${U.elimina} @click=${() => this._aggiorna({ eccezioni: this._bozza.eccezioni.filter((e, n) => n !== t) })}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`;
	}
	render() {
		if (this._bozza === void 0) return C``;
		let e = JSON.stringify(this._bozza) !== this._base, t = this._bozza, n = C`<div class="azioni-modulo">
      ${t ? C`<button class="bottone pericolo" @click=${this._togli}>${U.togliPiattaforma}</button>` : T}
      <span style="flex:1"></span>
      <button class="bottone" ?disabled=${!e} @click=${this._ricomincia}>${U.annulla}</button>
      <button class="bottone primario" ?disabled=${!e} @click=${this._salva}>${U.salva}</button>
    </div>`;
		return t ? C`<div class="colonna">
      <div class="riquadro">
        <h2><ha-icon icon="mdi:recycle" aria-hidden="true"></ha-icon>${U.piattaformaTitolo}</h2>
        <p class="aiuto">${U.piattaformaAiuto}</p>
        <div class="modulo">
          <div class="campo">
            <label for="nome">${U.nomePiattaforma}</label>
            <input id="nome" maxlength="40" .value=${t.nome} @input=${(e) => this._aggiorna({ nome: e.target.value })} />
            <small>${U.nomePiattaformaAiuto}</small>
          </div>
          <div class="campo">
            <label for="nota-p">${U.notaPiattaforma}</label>
            <input id="nota-p" maxlength="200" .value=${t.nota} @input=${(e) => this._aggiorna({ nota: e.target.value })} />
            <small>${U.notaPiattaformaAiuto}</small>
          </div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${U.periodi} <span class="conta">${t.periodi.length}</span></h2>
        <p class="aiuto">${U.periodiAiuto}</p>
        ${t.periodi.map((e, t) => this._periodoModulo(e, t))}
        ${t.periodi.length < Ct ? C`<button class="bottone" @click=${this._aggiungiPeriodo}><ha-icon icon="mdi:plus"></ha-icon>${U.aggiungiPeriodo}</button>` : T}
      </div>

      <div class="riquadro">
        <h2>${U.eccezioniPiattaforma} <span class="conta">${t.eccezioni.length}</span></h2>
        <p class="aiuto">${U.eccezioniPiattaformaAiuto}</p>
        ${t.eccezioni.map((e, t) => this._eccezioneModulo(e, t))}
        <button class="bottone"
          @click=${() => this._aggiorna({ eccezioni: [...t.eccezioni, {
			id: I(),
			data: this.lettura.oggi,
			tipo: "chiusa",
			fasce: [],
			nota: ""
		}] })}>
          <ha-icon icon="mdi:plus"></ha-icon>${U.aggiungiEccezionePiattaforma}
        </button>
      </div>
      ${n}
    </div>` : C`<div class="colonna">
        <div class="riquadro vuota">
          <ha-icon icon="mdi:recycle"></ha-icon>
          <h2>${U.piattaformaTitolo}</h2>
          <p class="aiuto">${U.piattaformaAiuto}</p>
          <p>${U.piattaformaVuota}</p>
          <button class="bottone primario" @click=${this._nuova}>${U.inserisciOrari}</button>
        </div>
        ${e ? n : T}
      </div>`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
			o`
      .colonna {
        max-width: 760px;
      }
      h2 ha-icon {
        --mdc-icon-size: 22px;
        color: var(--rd-primario);
        margin-right: 6px;
      }
      .vuota {
        text-align: center;
        padding: 28px 20px;
      }
      .vuota h2 {
        justify-content: center;
      }
      .vuota > ha-icon {
        --mdc-icon-size: 40px;
        color: var(--rd-primario);
      }
      .periodo {
        border: 1px solid var(--rd-bordo);
        border-radius: 14px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .testa-periodo {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: end;
        margin-bottom: 8px;
      }
      .testa-periodo .campo {
        flex: 1 1 140px;
        margin: 0;
      }
      .giorno {
        display: grid;
        grid-template-columns: 44px 1fr;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .fasce {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 10px;
      }
      .fascia {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .fascia input[type="time"] {
        width: 104px;
        padding: 6px 8px;
      }
      .chiusa {
        color: var(--rd-testo-2);
        font-size: 13.5px;
      }
      .icona {
        border: 0;
        background: none;
        color: var(--rd-testo-2);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        --mdc-icon-size: 18px;
      }
      .icona:hover {
        background: var(--rd-superficie-2);
        color: var(--rd-testo);
      }
      .eccezione {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 10px;
        padding: 10px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .eccezione input[type="date"] {
        width: 150px;
      }
      .eccezione .nota {
        flex: 1 1 160px;
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .azioni-modulo {
        margin-top: 16px;
      }
    `
		];
	}
});
//#endregion
//#region src/pannello/pagine/impostazioni.ts
var Dt = "foyer_raccolta_differenziata", Ot = 1048576, kt = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", At = 30;
async function jt(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
J("rd-impostazioni", class extends A {
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
		}), at(this);
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
			it(this, U.scaricamentoFallito);
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
				}, it(this, U.erroreConnessione);
			}
		}
	}
	_finestraImportazione() {
		let e = this._importazione;
		if (!e) return T;
		let t = (t, n, r) => C`<button
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
		return C`<rd-finestra aperta titolo=${U.importaTitolo} @chiudi=${() => this._importazione = void 0}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${U.scegliFile}</span>
          <label class="file">
            <input type="file" accept=".xlsx,${kt}" @change=${this._scegliFile} />
            <ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>
            <span class="nome-file">${e.file?.name ?? U.nessunFile}</span>
            <span class="bottone piccolo">${e.file ? U.cambiaFile : U.scegliFile}</span>
          </label>
        </div>
        <div class="campo">
          <span class="etichetta">${U.comeImportare}</span>
          <div class="modi" role="radiogroup" aria-label=${U.comeImportare}>
            ${t("sostituisci", U.sostituisci, U.sostituisciAiuto)}
            ${t("aggiungi", U.aggiungiSoltanto, U.aggiungiSoltantoAiuto)}
          </div>
        </div>
        ${e.errori.length ? C`<div class="errori-file" role="alert">
              <b>${U.fileConProblemi}</b>
              <ul>
                ${e.errori.slice(0, At).map((e) => {
			let t = Ye(e);
			return C`<li>${t ? C`<span class="luogo">${t}</span>` : T}${Je(e)}</li>`;
		})}
              </ul>
              ${n > 0 ? C`<small>${U.altriProblemi(n)}</small>` : T}
            </div>` : T}
      </div>
      <div class="azioni-modulo" slot="azioni">
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => this._importazione = void 0}>${U.annulla}</button>
        <button class="bottone primario" ?disabled=${!e.file || !e.modo || e.occupato} @click=${this._importa}>
          ${e.occupato ? U.leggoIlFile : U.continua}
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
		if (!e) return C``;
		let [t, n] = (e.patrono?.data ?? "01-01").split("-").map(Number), r = (e, t) => this._patrono({ data: `${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}` }), i = JSON.stringify(e) !== this._base;
		return C`<div class="colonna">
      <div class="riquadro">
        <h2>${U.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${U.mostraBarra}<small>${U.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${U.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${U.esposizione}</h2>
        <p class="aiuto">${U.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${U.dalle}</label><input type="time" .value=${e.esposizione.inizio_ora} @change=${(e) => this._finestra({ inizio_ora: e.target.value })} /></div>
            <div class="campo">
              <label>${U.del}</label>
              <select @change=${(e) => this._finestra({ inizio_giorno: e.target.value })}>
                ${["giorno_prima", "giorno_stesso"].map((t) => C`<option value=${t} ?selected=${e.esposizione.inizio_giorno === t}>${U.inizioGiorno[t]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${U.entroLe}</label><input type="time" .value=${e.esposizione.fine_ora} @change=${(e) => this._finestra({ fine_ora: e.target.value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${U.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${U.validita}</label>
            <input id="validita" type="date" .value=${e.valido_fino_al ?? ""} @change=${(t) => this._bozza = {
			...e,
			valido_fino_al: t.target.value || null
		}} />
            <small>${U.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${U.patrono}</span>
            <div class="patrono">
              <input aria-label=${U.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${e.patrono?.nome ?? ""} @input=${(e) => this._patrono({ nome: e.target.value })} />
              <select aria-label=${U.giorno} @change=${(e) => r(t, Number(e.target.value))}>
                ${Array.from({ length: 31 }, (e, t) => t + 1).map((e) => C`<option value=${e} ?selected=${e === n}>${e}</option>`)}
              </select>
              <select aria-label=${U.mese} @change=${(e) => r(Number(e.target.value), n)}>
                ${H.map((e, n) => C`<option value=${n + 1} ?selected=${n + 1 === t}>${e}</option>`)}
              </select>
            </div>
            <small>${U.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!i} @click=${() => {
			this._bozza = Z(this.lettura.configurazione), this._base = JSON.stringify(this._bozza), this._revisione = this.lettura.revisione;
		}}>${U.annulla}</button>
        <button class="bottone primario" ?disabled=${!i} @click=${this._salva}>${U.salva}</button>
      </div>

      <div class="riquadro excel">
        <h2><ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>${U.excel}</h2>
        <p class="aiuto">${U.excelAiuto}</p>
        <div class="azioni-excel">
          <button class="bottone" @click=${() => this._scarica(!0)}>
            <ha-icon icon="mdi:file-download-outline" aria-hidden="true"></ha-icon>${U.scaricaModello}
          </button>
          <button class="bottone" ?disabled=${this.lettura.problemi.length > 0} @click=${() => this._scarica(!1)}>
            <ha-icon icon="mdi:table-arrow-down" aria-hidden="true"></ha-icon>${U.esporta}
          </button>
          <button class="bottone primario" @click=${() => this._importazione = {
			errori: [],
			occupato: !1
		}}>
            <ha-icon icon="mdi:table-arrow-up" aria-hidden="true"></ha-icon>${U.importa}
          </button>
        </div>
        ${this.lettura.problemi.length ? C`<small class="avviso-excel">${U.esportaNonValida}</small>` : T}
      </div>
    </div>
    ${this._finestraImportazione()}`;
	}
	static {
		this.styles = [
			j,
			P,
			M,
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
});
//#endregion
//#region src/pannello/raccolta-pannello.ts
var $ = "foyer_raccolta_differenziata", Mt = [
	"panoramica",
	"tipologie",
	"regole",
	"eccezioni",
	"promemoria",
	"piattaforma",
	"impostazioni"
], Nt = class extends A {
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
		e && Mt.includes(e) && (this._pagina = e);
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
			this._errore = U.nonCaricata;
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
			this._mostraAvviso(U.erroreConnessione);
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
			this._mostraAvviso(U.erroreConnessione);
			return;
		} finally {
			this._occupato = !1;
		}
		if (e.salvato) {
			this._inAttesa = void 0, this._problemi = [], await this._carica(), this._mostraAvviso(U.salvato), this._chiudiEditor();
			return;
		}
		if (e.problemi.some((e) => e.codice === "revisione_superata")) {
			this._inAttesa = void 0, await this._carica(), this._mostraAvviso(U.altroHaSalvato);
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
        <b>${G(n.data)}</b>
        ${r ? F(r) : n.tipologia}
      </div>`;
		}, { aggiunti: r, tolti: i } = e.anteprima.differenze, a = [...r.map((e) => ({
			...e,
			segno: "+"
		})), ...i.map((e) => ({
			...e,
			segno: "−"
		}))].sort((e, t) => e.data.localeCompare(t.data)), o = Object.entries(e.riepilogo ?? {}).map(([e, t]) => Ze(e, t)).filter((e) => e !== null);
		return C`<rd-finestra aperta titolo=${U.primaDiSalvare} @chiudi=${() => this._inAttesa = void 0}>
      ${e.riepilogo && !this._problemi.length ? C`<div class="riepilogo">
            <b>${U.dalFile}</b>
            ${o.length ? C`<ul>${o.map((e) => C`<li>${e}</li>`)}</ul>` : C`<p>${U.nienteDalFile}</p>`}
          </div>` : T}
      ${this._problemi.length ? C`<div class="errori">
            ${U.nonSalvato}
            <ul>
              ${this._problemi.map((e) => C`<li>${q(e)}</li>`)}
            </ul>
          </div>` : C`<p class="aiuto">${a.length ? U.cosaCambia : U.nienteCambia}</p>
            <div class="differenze">${a.slice(0, 40).map((e) => n(e.segno, e))}</div>`}
      <div class="azioni-finestra" slot="azioni">
        <button class="bottone" @click=${() => this._inAttesa = void 0}>${U.indietro}</button>
        ${this._problemi.length ? T : C`<button class="bottone primario" ?disabled=${this._occupato} @click=${this._salva}>${U.salva}</button>`}
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
			case "piattaforma": return C`<rd-piattaforma .hass=${this.hass} .lettura=${e}></rd-piattaforma>`;
			case "impostazioni": return C`<rd-impostazioni .hass=${this.hass} .lettura=${e}></rd-impostazioni>`;
			default: return C`<rd-panoramica .hass=${this.hass} .lettura=${e}></rd-panoramica>`;
		}
	}
	render() {
		return C`
      <header class="testata">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="simbolo">${tt}</span>
        <h1>${U.titolo}</h1>
      </header>
      <nav class="schede" role="tablist">
        ${Mt.map((e) => C`<button
            role="tab"
            aria-selected=${e === this._pagina}
            class=${e === this._pagina ? "attiva" : ""}
            @click=${() => {
			this._pagina = e, this._precompila = void 0;
		}}
          >
            ${U.pagine[e]}
          </button>`)}
      </nav>
      <main
        class="pagina ${this._inAttesa ? "in-attesa" : ""}"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @ricarica=${() => void this._carica()}
        @avvisa=${(e) => this._mostraAvviso(e.detail)}
      >
        ${this._errore ? C`<div class="vuoto">${this._errore}</div>` : this._lettura ? this._paginaCorrente() : C`<div class="vuoto">${U.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._avviso ? C`<div class="avviso" role="status">${this._avviso}</div>` : T}
    `;
	}
	static {
		this.styles = [j, o`
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
      /* "Prima di salvare" sta sopra la finestra di modifica della pagina, che resta
         aperta per tornarci con "Indietro": intanto non si vede. Due finestre
         sovrapposte mostravano due "Annulla", e quello della finestra sotto chiudeva
         soltanto quella sopra. */
      main.in-attesa {
        --rd-visibilita-finestre: hidden;
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
J("foyer-raccolta-pannello", Nt);
//#endregion
export { Nt as RaccoltaPannello };
