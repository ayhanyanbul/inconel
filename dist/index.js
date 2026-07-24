import { jsx as s, jsxs as k } from "react/jsx-runtime";
import { forwardRef as ze, useId as Me, useState as F, useRef as xe, useMemo as Ae, useEffect as G, useCallback as ae, useImperativeHandle as Qe } from "react";
import { useFloating as Re, autoUpdate as Ze, offset as en, flip as nn, shift as tn, size as rn } from "@floating-ui/react";
import { useVirtualizer as ln } from "@tanstack/react-virtual";
import { createPortal as on } from "react-dom";
function Ce({
  hint: t,
  errorMessage: c,
  hintId: l,
  errorId: i,
  className: o
}) {
  return c ? /* @__PURE__ */ s(
    "p",
    {
      id: i,
      className: ["inconel-field-feedback", "is-error", o ?? ""].join(
        " "
      ),
      role: "alert",
      children: c
    }
  ) : t ? /* @__PURE__ */ s(
    "p",
    {
      id: l,
      className: ["inconel-field-feedback", "is-hint", o ?? ""].join(
        " "
      ),
      children: t
    }
  ) : null;
}
const cn = [
  "number",
  "currency",
  "percent"
], sn = [
  "text",
  "email",
  "password"
];
function ie(t) {
  return cn.some((c) => c === t);
}
function Ke(t) {
  return sn.some((c) => c === t);
}
function Xe(t) {
  const c = new Intl.NumberFormat(t).formatToParts(1000.1);
  return {
    group: c.find((l) => l.type === "group")?.value ?? ".",
    decimal: c.find((l) => l.type === "decimal")?.value ?? ","
  };
}
function an(t, c) {
  if (!t || t === "-") return null;
  const { group: l, decimal: i } = Xe(c), o = t.split(l).join("").replace(i, "."), u = Number(o);
  return Number.isNaN(u) ? null : u;
}
function un(t, c, l) {
  const i = 10 ** c;
  return l === "ceil" ? Math.ceil(t * i) / i : l === "round" ? Math.round(t * i) / i : t >= 0 ? Math.floor(t * i) / i : Math.ceil(t * i) / i;
}
function _e(t, c) {
  const l = String(t ?? "").replace(/\D/g, "");
  let i = 0, o = "";
  for (const u of c)
    if (u === "X") {
      if (i >= l.length) break;
      o += l[i++];
    } else i < l.length && (o += u);
  return o;
}
function Ye(t, c, l, i, o, u) {
  return t == null || t === "" ? "" : c === "phone" && u ? _e(t, u) : !ie(c) || typeof t != "number" || Number.isNaN(t) ? String(t) : new Intl.NumberFormat(l, {
    style: c === "currency" ? "currency" : c === "percent" ? "percent" : "decimal",
    currency: c === "currency" ? o : void 0,
    minimumFractionDigits: i,
    maximumFractionDigits: i
  }).format(t);
}
function dn(t, {
  required: c,
  type: l,
  min: i,
  max: o,
  mask: u,
  messages: m
}) {
  if (c && (t == null || t === ""))
    return m.required ?? null;
  if (t == null || t === "")
    return null;
  if (l === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(t)))
    return m.invalidEmail ?? null;
  if (l === "phone") {
    const I = String(t).replace(/\D/g, ""), T = u ? (u.match(/X/g) ?? []).length : I.startsWith("0") ? 11 : 10;
    if (I.length !== T) return m.invalidPhone ?? null;
  }
  if (Ke(l)) {
    if (typeof i == "number" && String(t).length < i)
      return m.minLength?.replace("{min}", String(i)) ?? null;
    if (typeof o == "number" && String(t).length > o)
      return m.maxLength?.replace("{max}", String(o)) ?? null;
  }
  if (ie(l)) {
    if (typeof t != "number" || Number.isNaN(t))
      return m.invalidNumber ?? null;
    if (typeof i == "number" && t < i)
      return m.minNumber?.replace("{min}", String(i)) ?? null;
    if (typeof o == "number" && t > o)
      return m.maxNumber?.replace("{max}", String(o)) ?? null;
  }
  return null;
}
const yn = ze(function({
  id: c,
  label: l,
  hint: i,
  errorMessage: o,
  startAdornment: u,
  endAdornment: m,
  fullWidth: I = !1,
  inputClassName: T,
  labelClassName: D,
  className: O,
  required: M,
  disabled: h,
  value: V,
  defaultValue: C = "",
  onChange: $,
  onBlur: S,
  onFocus: Y,
  onKeyDown: W,
  onMouseEnter: J,
  onMouseLeave: ke,
  type: p = "text",
  locale: K = "tr-TR",
  currency: Q = "TRY",
  decimalScale: R = 0,
  roundMode: Te = "floor",
  roundOnBlur: le = !1,
  min: H,
  max: oe,
  allowNegative: ue = !1,
  debounceMs: de = 0,
  validateOnSubmit: fe = !1,
  validationMessages: y,
  mask: a,
  limit: j,
  isClearable: Ve = !1,
  readOnly: pe = !1,
  clearButtonLabel: me,
  readOnlyEmptyValue: $e = null,
  autoComplete: B = "off",
  "aria-describedby": he,
  ...ge
}, be) {
  const ye = Me(), X = c ?? `inconel-input-${ye.replace(/:/g, "")}`, P = `${X}-hint`, Z = `${X}-error`, d = V !== void 0, [Ie, L] = F(C), g = d ? V : Ie, [b, w] = F(""), [je, we] = F(!1), [Be, ee] = F(null), A = xe(null), Ne = y ?? {}, N = o ?? Be, U = (n) => dn(n, {
    required: !!M,
    type: p,
    min: H,
    max: oe,
    mask: a,
    messages: Ne
  }), q = Ae(
    () => Ye(
      g,
      p,
      K,
      R,
      Q,
      a
    ),
    [g, Q, R, K, a, p]
  ), x = (n, f, v = null) => ({
    rawValue: n,
    formattedValue: Ye(
      n,
      p,
      K,
      R,
      Q,
      a
    ),
    error: !!U(n),
    char: v,
    eventType: f
  }), _ = (n, f = !1) => {
    d || L(n.rawValue), A.current && clearTimeout(A.current), $ && (f || de <= 0 ? $(n) : A.current = setTimeout(() => $(n), de));
  };
  G(() => () => {
    A.current && clearTimeout(A.current);
  }, []), G(() => {
    fe && ee(U(g));
  }, [fe]);
  const ne = (n) => {
    if (p === "phone" && a) return n.replace(/\D/g, "");
    if (ie(p)) {
      const f = an(n, K);
      return f === null ? n === "" ? null : n : ue ? f : Math.abs(f);
    }
    return n;
  }, ce = (n) => {
    const f = n.replace(/\D/g, "");
    if (j && (ie(p) || p === "phone") && f.length > j || j && Ke(p) && n.length > j) return;
    const v = ne(n);
    typeof v == "number" && (typeof H == "number" && v < H || typeof oe == "number" && v > oe) || (w(
      p === "phone" && a ? _e(v, a) : n
    ), _(x(v, "change", n.slice(-1) || null)));
  }, Fe = [
    he,
    i && !N ? P : void 0,
    N ? Z : void 0
  ].filter(Boolean).join(" ") || void 0;
  return pe ? /* @__PURE__ */ k("div", { className: ["inconel-field", I ? "inconel-field--full-width" : "", O ?? ""].join(" "), children: [
    l && /* @__PURE__ */ s("span", { className: ["inconel-field__label", D ?? ""].join(" "), children: l }),
    /* @__PURE__ */ s("div", { className: "inconel-input-readonly", "aria-label": l, children: q || $e })
  ] }) : /* @__PURE__ */ k("div", { className: ["inconel-field", I ? "inconel-field--full-width" : "", O ?? ""].join(" "), children: [
    l && /* @__PURE__ */ k("label", { className: ["inconel-field__label", D ?? ""].join(" "), htmlFor: X, children: [
      l,
      M && /* @__PURE__ */ s("span", { className: "inconel-field__required", "aria-hidden": "true", children: " *" })
    ] }),
    /* @__PURE__ */ k("div", { className: ["inconel-input-control", N ? "is-invalid" : "", h ? "is-disabled" : ""].join(" "), children: [
      u && /* @__PURE__ */ s("span", { className: "inconel-input-adornment", "aria-hidden": "true", children: u }),
      /* @__PURE__ */ s(
        "input",
        {
          ...ge,
          ref: be,
          id: X,
          type: p === "password" || p === "email" ? p : "text",
          inputMode: ie(p) ? "decimal" : p === "phone" ? "tel" : void 0,
          value: je ? b : q,
          required: M,
          disabled: h,
          autoComplete: B,
          "aria-invalid": !!N,
          "aria-describedby": Fe,
          className: ["inconel-input", T ?? ""].join(" "),
          onChange: (n) => ce(n.target.value),
          onFocus: (n) => {
            if (h) return;
            we(!0);
            const f = p === "phone" && a ? _e(g, a) : ie(p) ? String(g ?? "").replace(".", Xe(K).decimal) : String(g ?? "");
            w(f), Y?.(x(g, "focus"), n);
          },
          onBlur: (n) => {
            we(!1), A.current && clearTimeout(A.current);
            let f = ne(b);
            typeof f == "number" && (f = un(f, R, le ? Te : "floor")), ee(U(f));
            const v = x(f, "blur");
            _(v, !0), S?.(v, n);
          },
          onKeyDown: (n) => {
            !ue && (n.key === "-" || n.key === "Subtract") && n.preventDefault(), W?.(x(g, "keydown", n.key), n);
          },
          onMouseEnter: (n) => J?.(x(g, "mouseenter"), n),
          onMouseLeave: (n) => ke?.(x(g, "mouseleave"), n)
        }
      ),
      Ve && !h && q && me && /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "inconel-input-clear",
          "aria-label": me,
          onClick: () => {
            w(""), ee(U(null)), _(x(null, "clear"), !0);
          },
          children: "×"
        }
      ),
      m && /* @__PURE__ */ s("span", { className: "inconel-input-adornment", "aria-hidden": "true", children: m })
    ] }),
    /* @__PURE__ */ s(
      Ce,
      {
        hint: i,
        errorMessage: N,
        hintId: P,
        errorId: Z
      }
    )
  ] });
});
function z(...t) {
  return t.filter(Boolean).join(" ");
}
function fn({
  id: t,
  name: c,
  label: l,
  options: i,
  value: o,
  onChange: u,
  optionLabel: m,
  optionValue: I,
  getOptionSearchText: T,
  isOptionDisabled: D = () => !1,
  placeholder: O,
  isClearable: M = !1,
  isDisabled: h = !1,
  isReadOnly: V = !1,
  isRequired: C = !1,
  isLoading: $ = !1,
  loadOptions: S,
  loadOptionsDebounceMs: Y = 250,
  hint: W,
  errorMessage: J,
  asyncErrorMessage: ke,
  loadingMessage: p,
  noOptionsMessage: K,
  clearButtonLabel: Q,
  openMenuButtonLabel: R,
  closeMenuButtonLabel: Te,
  searchLocale: le,
  menuPortalTarget: H,
  virtualize: oe = !1,
  virtualizationThreshold: ue = 100,
  optionHeight: de = 44,
  className: fe,
  classNames: y = {},
  styles: a = {},
  onInputChange: j,
  onMenuOpen: Ve,
  onMenuClose: pe
}, me) {
  const $e = Me(), B = t ?? `inconel-select-${$e.replace(/:/g, "")}`, he = `${B}-label`, ge = `${B}-listbox`, be = `${B}-message`, ye = `${B}-hint`, X = xe(null), P = xe(null), Z = xe(null), [d, Ie] = F(!1), [L, g] = F(""), [b, w] = F(0), [je, we] = F(null), [Be, ee] = F(!1), [A, Ne] = F(!1);
  G(() => {
    if (!S) return;
    const e = new AbortController(), r = window.setTimeout(async () => {
      ee(!0), Ne(!1);
      try {
        const E = await S(
          L,
          e.signal
        );
        e.signal.aborted || we(E);
      } catch {
        e.signal.aborted || Ne(!0);
      } finally {
        e.signal.aborted || ee(!1);
      }
    }, Y);
    return () => {
      window.clearTimeout(r), e.abort();
    };
  }, [L, S, Y]);
  const N = S ? je ?? i : i, U = $ || Be, q = ae(
    (e) => typeof m == "function" ? m(e) : String(e[m]),
    [m]
  ), x = ae(
    (e) => {
      if (T) return T(e);
      const r = q(e);
      return typeof r == "string" || typeof r == "number" ? String(r) : "";
    },
    [q, T]
  ), _ = ae(
    (e) => {
      const r = typeof I == "function" ? I(e) : e[I];
      if (typeof r != "string" && typeof r != "number")
        throw new TypeError("optionValue must resolve to a string or number.");
      return r;
    },
    [I]
  ), ne = Ae(() => {
    const e = /* @__PURE__ */ new Set();
    return N.map(_).filter((r) => e.has(r) ? !0 : (e.add(r), !1));
  }, [N, _]);
  G(() => {
    ne.length && console.warn(
      `Duplicate optionValue found in Select "${l}":`,
      ne
    );
  }, [ne, l]);
  const ce = [...i, ...N].find(
    (e) => _(e) === o
  ), Fe = ce ? x(ce) : "", n = Ae(() => {
    const e = L.trim().toLocaleLowerCase(le);
    return !e || S ? N : N.filter(
      (r) => x(r).toLocaleLowerCase(le).includes(e)
    );
  }, [N, x, L, S, le]), { refs: f, floatingStyles: v } = Re({
    open: d,
    placement: "bottom-start",
    strategy: H ? "fixed" : "absolute",
    whileElementsMounted: Ze,
    middleware: [
      en(8),
      nn({ padding: 12 }),
      tn({ padding: 12 }),
      rn({
        padding: 12,
        apply({ availableHeight: e, rects: r, elements: E }) {
          Object.assign(E.floating.style, {
            maxHeight: `${Math.min(230, e)}px`,
            width: `${r.reference.width}px`
          });
        }
      })
    ]
  }), ve = oe || n.length >= ue, Ee = ln({
    count: n.length,
    getScrollElement: () => Z.current,
    estimateSize: () => de,
    overscan: 5,
    enabled: ve && d
  }), te = ae(() => {
    Ie(!1), g(""), j?.(""), pe?.();
  }, [j, pe]), se = () => {
    h || V || (d || Ve?.(), Ie(!0));
  }, Se = ae(() => {
    h || V || (u(null, null), g(""), w(0), j?.(""), P.current?.focus());
  }, [h, V, u, j]);
  Qe(
    me,
    () => ({
      focus: () => P.current?.focus(),
      blur: () => P.current?.blur(),
      clear: Se
    }),
    [Se]
  ), G(() => {
    const e = (r) => {
      const E = r.target;
      !X.current?.contains(E) && !Z.current?.contains(E) && te();
    };
    return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
  }, [te]), G(() => {
    b >= n.length && w(0);
  }, [b, n.length]), G(() => {
    ve && d && n[b] && Ee.scrollToIndex(b, { align: "auto" });
  }, [
    b,
    n,
    d,
    ve,
    Ee
  ]);
  const He = (e) => {
    D(e) || (u(_(e), e), te(), P.current?.focus());
  }, qe = (e) => {
    if (!n.length) return;
    let r = b;
    do
      r = (r + e + n.length) % n.length;
    while (D(n[r]) && r !== b);
    w(r);
  }, De = (e = !1) => {
    const r = n.map((E, re) => ({ option: E, index: re }));
    return e && r.reverse(), r.find(({ option: E }) => !D(E))?.index ?? 0;
  }, Ge = (e) => {
    if (e.key === "Backspace" && !L && o !== null && M) {
      e.preventDefault(), Se();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp")
      e.preventDefault(), d ? qe(e.key === "ArrowDown" ? 1 : -1) : (se(), w(De(e.key === "ArrowUp")));
    else if (e.key === "Home" && d)
      e.preventDefault(), w(De());
    else if (e.key === "End" && d)
      e.preventDefault(), w(De(!0));
    else if (e.key === "Enter" && d) {
      e.preventDefault();
      const r = n[b];
      r && He(r);
    } else e.key === "Escape" && d ? (e.preventDefault(), te()) : e.key === "Tab" && te();
  }, Pe = (e, r, E) => {
    const re = _(e), Ue = D(e);
    return /* @__PURE__ */ k(
      "div",
      {
        id: `${B}-option-${r}`,
        role: "option",
        "aria-selected": re === o,
        "aria-disabled": Ue,
        "aria-posinset": r + 1,
        "aria-setsize": n.length,
        className: z(
          "inconel-select-option",
          r === b && "is-active",
          re === o && "is-selected",
          Ue && "is-disabled",
          y.option
        ),
        style: { ...E, ...a.option },
        onMouseEnter: () => w(r),
        onMouseDown: (Je) => Je.preventDefault(),
        onClick: () => He(e),
        children: [
          /* @__PURE__ */ s("span", { children: q(e) }),
          re === o && /* @__PURE__ */ s("span", { "aria-hidden": "true", children: "✓" })
        ]
      },
      re
    );
  }, Oe = U ? /* @__PURE__ */ k(
    "div",
    {
      role: "status",
      className: z("inconel-select-message", y.message),
      style: a.message,
      children: [
        /* @__PURE__ */ s("span", { className: "inconel-select-spinner", "aria-hidden": "true" }),
        p
      ]
    }
  ) : A ? /* @__PURE__ */ s(
    "div",
    {
      role: "alert",
      className: z("inconel-select-message inconel-select-message-error", y.message),
      style: a.message,
      children: ke
    }
  ) : n.length === 0 ? /* @__PURE__ */ s(
    "div",
    {
      className: z("inconel-select-message", y.message),
      style: a.message,
      children: K
    }
  ) : ve ? /* @__PURE__ */ s(
    "div",
    {
      role: "presentation",
      className: "inconel-select-virtual-content",
      style: { height: Ee.getTotalSize() },
      children: Ee.getVirtualItems().map(
        (e) => Pe(n[e.index], e.index, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: e.size,
          transform: `translateY(${e.start}px)`
        })
      )
    }
  ) : n.map((e, r) => Pe(e, r)), Le = d ? /* @__PURE__ */ s(
    "div",
    {
      ref: (e) => {
        Z.current = e, f.setFloating(e);
      },
      id: ge,
      role: "listbox",
      "aria-labelledby": he,
      className: z(
        "inconel-select-menu",
        H && "inconel-select-menu-portal",
        y.menu
      ),
      style: { ...v, ...a.menu },
      children: Oe
    }
  ) : null, We = J ? be : W ? ye : void 0;
  return /* @__PURE__ */ k(
    "div",
    {
      ref: X,
      className: z("inconel-select-field", fe, y.root),
      style: a.root,
      children: [
        /* @__PURE__ */ k(
          "label",
          {
            id: he,
            htmlFor: B,
            className: y.label,
            style: a.label,
            children: [
              l,
              C && /* @__PURE__ */ s("span", { "aria-hidden": "true", children: " *" })
            ]
          }
        ),
        /* @__PURE__ */ k(
          "div",
          {
            ref: f.setReference,
            className: z(
              "inconel-select-control",
              d && "is-open",
              h && "is-disabled",
              !!J && "has-error",
              y.control
            ),
            style: a.control,
            children: [
              /* @__PURE__ */ s(
                "input",
                {
                  ref: P,
                  id: B,
                  role: "combobox",
                  "aria-expanded": d,
                  "aria-controls": ge,
                  "aria-autocomplete": "list",
                  "aria-activedescendant": d && n[b] ? `${B}-option-${b}` : void 0,
                  "aria-describedby": We,
                  "aria-invalid": !!J,
                  "aria-required": C,
                  "aria-busy": U,
                  required: C,
                  disabled: h,
                  readOnly: V,
                  autoComplete: "off",
                  placeholder: O,
                  value: L || Fe,
                  className: y.input,
                  style: a.input,
                  onChange: (e) => {
                    g(e.target.value), w(0), j?.(e.target.value), se();
                  },
                  onClick: se,
                  onFocus: (e) => {
                    se(), ce && !L && e.currentTarget.select();
                  },
                  onKeyDown: Ge
                }
              ),
              U && /* @__PURE__ */ s("span", { className: "inconel-select-spinner", "aria-hidden": "true" }),
              M && o !== null && !h && !V && Q && /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: z("inconel-select-clear", y.clearButton),
                  style: a.clearButton,
                  "aria-label": Q,
                  onClick: Se,
                  children: "×"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: z("inconel-select-toggle", y.toggleButton),
                  style: a.toggleButton,
                  "aria-label": d ? Te : R,
                  "aria-expanded": d,
                  disabled: h,
                  tabIndex: -1,
                  onClick: () => d ? te() : se(),
                  children: /* @__PURE__ */ s(
                    "svg",
                    {
                      "aria-hidden": "true",
                      viewBox: "0 0 20 20",
                      width: "20",
                      height: "20",
                      fill: "none",
                      children: /* @__PURE__ */ s(
                        "path",
                        {
                          d: "m5 7.5 5 5 5-5",
                          stroke: "currentColor",
                          strokeWidth: "1.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round"
                        }
                      )
                    }
                  )
                }
              )
            ]
          }
        ),
        c && /* @__PURE__ */ s(
          "input",
          {
            type: "hidden",
            name: c,
            value: o ?? "",
            required: C
          }
        ),
        /* @__PURE__ */ s(
          Ce,
          {
            hint: W,
            errorMessage: J,
            hintId: ye,
            errorId: be
          }
        ),
        H && Le ? on(Le, H) : Le
      ]
    }
  );
}
const In = ze(fn), wn = ze(
  function({
    id: c,
    label: l,
    hint: i,
    errorMessage: o,
    fullWidth: u = !1,
    resize: m = "vertical",
    className: I,
    required: T,
    disabled: D,
    "aria-describedby": O,
    style: M,
    ...h
  }, V) {
    const C = Me(), $ = c ?? `inconel-textarea-${C.replace(/:/g, "")}`, S = `${$}-hint`, Y = `${$}-error`, W = [
      O,
      i && !o ? S : void 0,
      o ? Y : void 0
    ].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ k(
      "div",
      {
        className: [
          "inconel-field",
          u ? "inconel-field--full-width" : "",
          I ?? ""
        ].join(" "),
        children: [
          l && /* @__PURE__ */ k("label", { className: "inconel-field__label", htmlFor: $, children: [
            l,
            T && /* @__PURE__ */ s("span", { "aria-hidden": "true", children: " *" })
          ] }),
          /* @__PURE__ */ s(
            "textarea",
            {
              ...h,
              ref: V,
              id: $,
              required: T,
              disabled: D,
              "aria-invalid": !!o,
              "aria-describedby": W,
              className: [
                "inconel-textarea",
                o ? "is-invalid" : ""
              ].join(" "),
              style: { ...M, resize: m }
            }
          ),
          /* @__PURE__ */ s(
            Ce,
            {
              hint: i,
              errorMessage: o,
              hintId: S,
              errorId: Y
            }
          )
        ]
      }
    );
  }
);
export {
  Ce as FieldFeedback,
  yn as Input,
  In as Select,
  wn as Textarea
};
//# sourceMappingURL=index.js.map
