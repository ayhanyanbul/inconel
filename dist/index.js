import { jsxs as p, jsx as r } from "react/jsx-runtime";
import { useRef as ue, useEffect as H, forwardRef as Me, useId as Ue, useState as w, useMemo as je, useCallback as se, useImperativeHandle as en } from "react";
import { useFloating as nn, autoUpdate as tn, offset as rn, flip as ln, shift as on, size as an } from "@floating-ui/react";
import { useVirtualizer as cn } from "@tanstack/react-virtual";
import { createPortal as sn } from "react-dom";
import { ReactSVG as un } from "react-svg";
function f(...e) {
  return e.filter(Boolean).join(" ");
}
function dn({
  loading: e = !1,
  fullWidth: n = !1,
  variant: t = "primary",
  disabled: l,
  className: o,
  children: c,
  ...s
}) {
  return /* @__PURE__ */ p(
    "button",
    {
      ...s,
      disabled: l || e,
      className: f(
        "inconel-button",
        `inconel-button--${t}`,
        n && "inconel-button--full-width",
        e && "inconel-is-loading",
        o
      ),
      children: [
        e && /* @__PURE__ */ r("span", { className: "inconel-button__spinner", "aria-hidden": "true" }),
        c
      ]
    }
  );
}
function fn({
  label: e,
  indeterminate: n = !1,
  className: t,
  ...l
}) {
  const o = ue(null);
  return H(() => {
    o.current && (o.current.indeterminate = n);
  }, [n]), /* @__PURE__ */ p("label", { className: f("inconel-checkbox", t), children: [
    /* @__PURE__ */ r("input", { ...l, ref: o, type: "checkbox" }),
    /* @__PURE__ */ r("span", { className: "inconel-checkbox__control", "aria-hidden": "true" }),
    e && /* @__PURE__ */ r("span", { className: "inconel-checkbox__label", children: e })
  ] });
}
function pn(e, n) {
  return e.includes(n) ? e.filter((t) => t !== n) : [...e, n];
}
function hn({
  options: e,
  value: n = [],
  onChange: t,
  name: l,
  className: o
}) {
  const c = (s) => t?.(pn(n, s));
  return /* @__PURE__ */ r("div", { className: f("inconel-checkbox-group", o), children: e.map((s) => /* @__PURE__ */ r(
    fn,
    {
      name: l,
      label: s.label,
      value: s.value,
      checked: n.includes(s.value),
      disabled: s.disabled,
      onChange: () => c(s.value)
    },
    s.value
  )) });
}
function Oe({
  hint: e,
  errorMessage: n,
  hintId: t,
  errorId: l,
  className: o
}) {
  return n ? /* @__PURE__ */ r(
    "p",
    {
      id: l,
      className: [
        "inconel-field-feedback",
        "inconel-is-error",
        o ?? ""
      ].join(" "),
      role: "alert",
      children: n
    }
  ) : e ? /* @__PURE__ */ r(
    "p",
    {
      id: t,
      className: [
        "inconel-field-feedback",
        "inconel-is-hint",
        o ?? ""
      ].join(" "),
      children: e
    }
  ) : null;
}
const mn = [
  "number",
  "currency",
  "percent"
], bn = [
  "text",
  "email",
  "password"
];
function le(e) {
  return mn.some((n) => n === e);
}
function Ge(e) {
  return bn.some((n) => n === e);
}
function We(e) {
  const n = new Intl.NumberFormat(e).formatToParts(1000.1);
  return {
    group: n.find((t) => t.type === "group")?.value ?? ".",
    decimal: n.find((t) => t.type === "decimal")?.value ?? ","
  };
}
function gn(e, n) {
  if (!e || e === "-") return null;
  const { group: t, decimal: l } = We(n), o = e.split(t).join("").replace(l, "."), c = Number(o);
  return Number.isNaN(c) ? null : c;
}
function Nn(e, n, t) {
  const l = 10 ** n;
  return t === "ceil" ? Math.ceil(e * l) / l : t === "round" ? Math.round(e * l) / l : e >= 0 ? Math.floor(e * l) / l : Math.ceil(e * l) / l;
}
function Ce(e, n) {
  const t = String(e ?? "").replace(/\D/g, "");
  let l = 0, o = "";
  for (const c of n)
    if (c === "X") {
      if (l >= t.length) break;
      o += t[l++];
    } else l < t.length && (o += c);
  return o;
}
function Re(e, n, t, l, o, c) {
  return e == null || e === "" ? "" : n === "phone" && c ? Ce(e, c) : !le(n) || typeof e != "number" || Number.isNaN(e) ? String(e) : new Intl.NumberFormat(t, {
    style: n === "currency" ? "currency" : n === "percent" ? "percent" : "decimal",
    currency: n === "currency" ? o : void 0,
    minimumFractionDigits: l,
    maximumFractionDigits: l
  }).format(e);
}
function _n(e, {
  required: n,
  type: t,
  min: l,
  max: o,
  mask: c,
  messages: s
}) {
  if (n && (e == null || e === ""))
    return s.required ?? null;
  if (e == null || e === "")
    return null;
  if (t === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)))
    return s.invalidEmail ?? null;
  if (t === "phone") {
    const d = String(e).replace(/\D/g, ""), m = c ? (c.match(/X/g) ?? []).length : d.startsWith("0") ? 11 : 10;
    if (d.length !== m) return s.invalidPhone ?? null;
  }
  if (Ge(t)) {
    if (typeof l == "number" && String(e).length < l)
      return s.minLength?.replace("{min}", String(l)) ?? null;
    if (typeof o == "number" && String(e).length > o)
      return s.maxLength?.replace("{max}", String(o)) ?? null;
  }
  if (le(t)) {
    if (typeof e != "number" || Number.isNaN(e))
      return s.invalidNumber ?? null;
    if (typeof l == "number" && e < l)
      return s.minNumber?.replace("{min}", String(l)) ?? null;
    if (typeof o == "number" && e > o)
      return s.maxNumber?.replace("{max}", String(o)) ?? null;
  }
  return null;
}
const ze = Me(function({
  id: n,
  label: t,
  hint: l,
  errorMessage: o,
  startAdornment: c,
  endAdornment: s,
  fullWidth: d = !1,
  inputClassName: m,
  labelClassName: h,
  className: K,
  required: U,
  disabled: y,
  value: x,
  defaultValue: O = "",
  onChange: F,
  onBlur: S,
  onFocus: Y,
  onKeyDown: X,
  onMouseEnter: q,
  onMouseLeave: De,
  type: _ = "text",
  locale: R = "tr-TR",
  currency: J = "TRY",
  decimalScale: Q = 0,
  roundMode: Le = "floor",
  roundOnBlur: ie = !1,
  min: z,
  max: oe,
  allowNegative: de = !1,
  debounceMs: fe = 0,
  validateOnSubmit: pe = !1,
  validationMessages: k,
  mask: b,
  limit: V,
  isClearable: we = !1,
  readOnly: he = !1,
  clearButtonLabel: me,
  readOnlyEmptyValue: Se = null,
  autoComplete: B = "off",
  "aria-describedby": be,
  ...ge
}, Ne) {
  const _e = Ue(), G = n ?? `inconel-input-${_e.replace(/:/g, "")}`, $ = `${G}-hint`, Z = `${G}-error`, g = x !== void 0, [ye, j] = w(O), v = g ? x : ye, [E, T] = w(""), [Ae, ve] = w(!1), [xe, ee] = w(null), C = ue(null), Ee = k ?? {}, I = o ?? xe, P = (a) => _n(a, {
    required: !!U,
    type: _,
    min: z,
    max: oe,
    mask: b,
    messages: Ee
  }), W = je(
    () => Re(
      v,
      _,
      R,
      Q,
      J,
      b
    ),
    [v, J, Q, R, b, _]
  ), A = (a, N, D = null) => ({
    rawValue: a,
    formattedValue: Re(
      a,
      _,
      R,
      Q,
      J,
      b
    ),
    error: !!P(a),
    char: D,
    eventType: N
  }), M = (a, N = !1) => {
    g || j(a.rawValue), C.current && clearTimeout(C.current), F && (N || fe <= 0 ? F(a) : C.current = setTimeout(() => F(a), fe));
  };
  H(() => () => {
    C.current && clearTimeout(C.current);
  }, []), H(() => {
    pe && ee(P(v));
  }, [pe]);
  const ne = (a) => {
    if (_ === "phone" && b) return a.replace(/\D/g, "");
    if (le(_)) {
      const N = gn(a, R);
      return N === null ? a === "" ? null : a : de ? N : Math.abs(N);
    }
    return a;
  }, ae = (a) => {
    const N = a.replace(/\D/g, "");
    if (V && (le(_) || _ === "phone") && N.length > V || V && Ge(_) && a.length > V) return;
    const D = ne(a);
    typeof D == "number" && (typeof z == "number" && D < z || typeof oe == "number" && D > oe) || (T(
      _ === "phone" && b ? Ce(D, b) : a
    ), M(A(D, "change", a.slice(-1) || null)));
  }, Fe = [
    be,
    l && !I ? $ : void 0,
    I ? Z : void 0
  ].filter(Boolean).join(" ") || void 0;
  return he ? /* @__PURE__ */ p("div", { className: ["inconel-field", d ? "inconel-field--full-width" : "", K ?? ""].join(" "), children: [
    t && /* @__PURE__ */ r("span", { className: ["inconel-field__label", h ?? ""].join(" "), children: t }),
    /* @__PURE__ */ r("div", { className: "inconel-input-readonly", "aria-label": t, children: W || Se })
  ] }) : /* @__PURE__ */ p("div", { className: ["inconel-field", d ? "inconel-field--full-width" : "", K ?? ""].join(" "), children: [
    t && /* @__PURE__ */ p("label", { className: ["inconel-field__label", h ?? ""].join(" "), htmlFor: G, children: [
      t,
      U && /* @__PURE__ */ r("span", { className: "inconel-field__required", "aria-hidden": "true", children: " *" })
    ] }),
    /* @__PURE__ */ p("div", { className: ["inconel-input-control", I ? "inconel-is-invalid" : "", y ? "inconel-is-disabled" : ""].join(" "), children: [
      c && /* @__PURE__ */ r("span", { className: "inconel-input-adornment", "aria-hidden": "true", children: c }),
      /* @__PURE__ */ r(
        "input",
        {
          ...ge,
          ref: Ne,
          id: G,
          type: _ === "password" || _ === "email" ? _ : "text",
          inputMode: le(_) ? "decimal" : _ === "phone" ? "tel" : void 0,
          value: Ae ? E : W,
          required: U,
          disabled: y,
          autoComplete: B,
          "aria-invalid": !!I,
          "aria-describedby": Fe,
          className: ["inconel-input", m ?? ""].join(" "),
          onChange: (a) => ae(a.target.value),
          onFocus: (a) => {
            if (y) return;
            ve(!0);
            const N = _ === "phone" && b ? Ce(v, b) : le(_) ? String(v ?? "").replace(".", We(R).decimal) : String(v ?? "");
            T(N), Y?.(A(v, "focus"), a);
          },
          onBlur: (a) => {
            ve(!1), C.current && clearTimeout(C.current);
            let N = ne(E);
            typeof N == "number" && (N = Nn(N, Q, ie ? Le : "floor")), ee(P(N));
            const D = A(N, "blur");
            M(D, !0), S?.(D, a);
          },
          onKeyDown: (a) => {
            !de && (a.key === "-" || a.key === "Subtract") && a.preventDefault(), X?.(A(v, "keydown", a.key), a);
          },
          onMouseEnter: (a) => q?.(A(v, "mouseenter"), a),
          onMouseLeave: (a) => De?.(A(v, "mouseleave"), a)
        }
      ),
      we && !y && W && me && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "inconel-input-clear",
          "aria-label": me,
          onClick: () => {
            T(""), ee(P(null)), M(A(null, "clear"), !0);
          },
          children: "×"
        }
      ),
      s && /* @__PURE__ */ r("span", { className: "inconel-input-adornment", "aria-hidden": "true", children: s })
    ] }),
    /* @__PURE__ */ r(
      Oe,
      {
        hint: l,
        errorMessage: I,
        hintId: $,
        errorId: Z
      }
    )
  ] });
});
function Hn(e) {
  return /* @__PURE__ */ r(ze, { ...e, type: "currency" });
}
function yn({
  label: e,
  onLabel: n,
  offLabel: t,
  checked: l,
  defaultChecked: o,
  onChange: c,
  className: s,
  ...d
}) {
  return /* @__PURE__ */ p("label", { className: f("inconel-switch", s), children: [
    e && /* @__PURE__ */ r("span", { className: "inconel-switch__label", children: e }),
    /* @__PURE__ */ r(
      "input",
      {
        ...d,
        type: "checkbox",
        checked: l,
        defaultChecked: o,
        onChange: (m) => c?.(m.target.checked, m)
      }
    ),
    /* @__PURE__ */ r("span", { className: "inconel-switch__track", children: /* @__PURE__ */ r("span", { className: "inconel-switch__thumb" }) }),
    (n || t) && /* @__PURE__ */ r("span", { className: "inconel-switch__state", children: l ? n : t })
  ] });
}
const Yn = yn, vn = "Kayıt bulunamadı.";
function En(e, n, t) {
  return typeof t == "function" ? t(e, n) : t ? String(e[t]) : n;
}
function $e({
  columns: e,
  data: n,
  rowKey: t,
  emptyMessage: l = vn,
  onRowClick: o,
  className: c,
  ...s
}) {
  return /* @__PURE__ */ r("div", { className: "inconel-table-wrapper", children: /* @__PURE__ */ p("table", { ...s, className: f("inconel-table", c), children: [
    /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ r("tr", { children: e.map((d) => /* @__PURE__ */ r("th", { className: d.className, children: d.header }, String(d.key))) }) }),
    /* @__PURE__ */ p("tbody", { children: [
      n.map((d, m) => /* @__PURE__ */ r(
        "tr",
        {
          onClick: () => o?.(d, m),
          children: e.map((h) => /* @__PURE__ */ r("td", { className: h.className, children: h.render ? h.render(d, m) : String(d[h.key] ?? "") }, String(h.key)))
        },
        En(d, m, t)
      )),
      n.length === 0 && /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", { className: "inconel-table__empty", colSpan: e.length, children: l }) })
    ] })
  ] }) });
}
const Rn = $e;
function kn(e) {
  return e instanceof Date ? e.toISOString().slice(0, 10) : e ?? "";
}
function Gn({
  value: e,
  onChange: n,
  label: t,
  className: l,
  ...o
}) {
  const c = kn(e);
  return /* @__PURE__ */ p("label", { className: f("inconel-date-picker", l), children: [
    t && /* @__PURE__ */ r("span", { className: "inconel-field__label", children: t }),
    /* @__PURE__ */ r(
      "input",
      {
        ...o,
        type: "date",
        value: c,
        onChange: (s) => n?.(s.target.value, s)
      }
    )
  ] });
}
const Tn = "Dosya seç";
function Ke({
  label: e = Tn,
  files: n,
  multiple: t,
  onFilesChange: l,
  className: o,
  ...c
}) {
  return /* @__PURE__ */ p("label", { className: f("inconel-file-upload", o), children: [
    /* @__PURE__ */ r("span", { className: "inconel-file-upload__button", children: e }),
    /* @__PURE__ */ r(
      "input",
      {
        ...c,
        type: "file",
        multiple: t,
        onChange: (s) => l?.(Array.from(s.target.files ?? []))
      }
    ),
    n && n.length > 0 && /* @__PURE__ */ r("span", { className: "inconel-file-upload__text", children: n.map((s) => s.name).join(", ") })
  ] });
}
const In = "Dosyaları buraya bırakın";
function Dn({
  onDropFiles: e,
  dropLabel: n = In,
  className: t,
  ...l
}) {
  const [o, c] = w(!1), s = (d) => {
    d.preventDefault(), c(!1), e?.(Array.from(d.dataTransfer.files));
  };
  return /* @__PURE__ */ p(
    "div",
    {
      className: f(
        "inconel-drag-drop-upload",
        o && "inconel-is-dragging",
        t
      ),
      onDragEnter: () => c(!0),
      onDragLeave: () => c(!1),
      onDragOver: (d) => d.preventDefault(),
      onDrop: s,
      children: [
        /* @__PURE__ */ r("span", { children: n }),
        /* @__PURE__ */ r(Ke, { ...l })
      ]
    }
  );
}
const Wn = Dn, Ln = "Yükleniyor...";
function Kn({
  label: e = Ln,
  className: n,
  ...t
}) {
  return /* @__PURE__ */ p(
    "span",
    {
      ...t,
      className: f("inconel-dot-loader", n),
      role: "status",
      "aria-label": e,
      children: [
        /* @__PURE__ */ r("i", {}),
        /* @__PURE__ */ r("i", {}),
        /* @__PURE__ */ r("i", {})
      ]
    }
  );
}
const Xn = $e, qn = Ke;
function Jn({
  children: e,
  onClear: n,
  clearLabel: t = "Temizle",
  className: l,
  ...o
}) {
  return /* @__PURE__ */ p("div", { ...o, className: f("inconel-filter", l), children: [
    /* @__PURE__ */ r("div", { className: "inconel-filter__content", children: e }),
    n && /* @__PURE__ */ r(dn, { type: "button", variant: "ghost", onClick: n, children: t })
  ] });
}
const Qn = $e;
function wn({
  value: e,
  onChange: n,
  placeholder: t,
  readOnly: l = !1,
  className: o,
  ...c
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      ...c,
      className: f("inconel-editor", o),
      contentEditable: !l,
      suppressContentEditableWarning: !0,
      "data-placeholder": t,
      dangerouslySetInnerHTML: { __html: e ?? "" },
      onInput: (s) => n?.(s.currentTarget.innerHTML)
    }
  );
}
const Zn = ze, Sn = "Yükleniyor...";
function An({
  label: e = Sn,
  fullscreen: n = !1,
  className: t,
  ...l
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      ...l,
      className: f(
        "inconel-loader",
        n && "inconel-loader--fullscreen",
        t
      ),
      role: "status",
      "aria-label": e,
      children: /* @__PURE__ */ r("span", { className: "inconel-loader__spinner", "aria-hidden": "true" })
    }
  );
}
function et(e) {
  return /* @__PURE__ */ r(An, { ...e, className: f("inconel-loader--mini", e.className) });
}
const xn = "Kapat";
function nt({
  open: e,
  title: n,
  children: t,
  footer: l,
  closeLabel: o = xn,
  closeOnBackdrop: c = !0,
  onClose: s,
  className: d
}) {
  return e ? /* @__PURE__ */ r(
    "div",
    {
      className: "inconel-modal-backdrop",
      role: "presentation",
      onMouseDown: (m) => {
        c && m.target === m.currentTarget && s?.();
      },
      children: /* @__PURE__ */ p(
        "section",
        {
          className: f("inconel-modal", d),
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof n == "string" ? n : void 0,
          children: [
            /* @__PURE__ */ p("header", { className: "inconel-modal__header", children: [
              /* @__PURE__ */ r("div", { className: "inconel-modal__title", children: n }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "inconel-modal__close",
                  "aria-label": o,
                  onClick: s,
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "inconel-modal__content", children: t }),
            l && /* @__PURE__ */ r("footer", { className: "inconel-modal__footer", children: l })
          ]
        }
      )
    }
  ) : null;
}
function Fn({
  options: e,
  value: n = [],
  onChange: t,
  label: l,
  className: o
}) {
  return /* @__PURE__ */ p("fieldset", { className: f("inconel-multi-select", o), children: [
    l && /* @__PURE__ */ r("legend", { children: l }),
    /* @__PURE__ */ r(hn, { options: e, value: n, onChange: t })
  ] });
}
const tt = Fn;
function Vn({
  selected: e,
  disabled: n,
  icon: t,
  children: l,
  className: o,
  ...c
}) {
  return /* @__PURE__ */ p(
    "div",
    {
      ...c,
      role: "option",
      "aria-selected": e,
      "aria-disabled": n,
      className: f(
        "inconel-option",
        e && "inconel-is-selected",
        n && "inconel-is-disabled",
        o
      ),
      children: [
        t && /* @__PURE__ */ r("span", { className: "inconel-option__icon", children: t }),
        l
      ]
    }
  );
}
const rt = Vn;
function lt({
  options: e,
  value: n,
  onChange: t,
  name: l,
  className: o
}) {
  return /* @__PURE__ */ r("div", { className: f("inconel-radio-group", o), children: e.map((c) => /* @__PURE__ */ p("label", { className: "inconel-radio", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "radio",
        name: l,
        value: c.value,
        checked: c.value === n,
        disabled: c.disabled,
        onChange: () => t?.(c.value)
      }
    ),
    /* @__PURE__ */ r("span", { className: "inconel-radio__control", "aria-hidden": "true" }),
    /* @__PURE__ */ r("span", { children: c.label })
  ] }, c.value)) });
}
const Bn = "—";
function it({
  label: e,
  value: n,
  emptyValue: t = Bn,
  className: l,
  ...o
}) {
  return /* @__PURE__ */ p("div", { ...o, className: f("inconel-read-only", l), children: [
    e && /* @__PURE__ */ r("span", { className: "inconel-read-only__label", children: e }),
    /* @__PURE__ */ r("span", { className: "inconel-read-only__value", children: n == null || n === "" ? t : n })
  ] });
}
function jn({
  id: e,
  name: n,
  label: t,
  options: l,
  value: o,
  onChange: c,
  optionLabel: s,
  optionValue: d,
  getOptionSearchText: m,
  isOptionDisabled: h = () => !1,
  placeholder: K,
  isClearable: U = !1,
  isDisabled: y = !1,
  isReadOnly: x = !1,
  isRequired: O = !1,
  isLoading: F = !1,
  loadOptions: S,
  loadOptionsDebounceMs: Y = 250,
  hint: X,
  errorMessage: q,
  asyncErrorMessage: De,
  loadingMessage: _,
  noOptionsMessage: R,
  clearButtonLabel: J,
  openMenuButtonLabel: Q,
  closeMenuButtonLabel: Le,
  searchLocale: ie,
  menuPortalTarget: z,
  virtualize: oe = !1,
  virtualizationThreshold: de = 100,
  optionHeight: fe = 44,
  className: pe,
  classNames: k = {},
  styles: b = {},
  onInputChange: V,
  onMenuOpen: we,
  onMenuClose: he
}, me) {
  const Se = Ue(), B = e ?? `inconel-select-${Se.replace(/:/g, "")}`, be = `${B}-label`, ge = `${B}-listbox`, Ne = `${B}-message`, _e = `${B}-hint`, G = ue(null), $ = ue(null), Z = ue(null), [g, ye] = w(!1), [j, v] = w(""), [E, T] = w(0), [Ae, ve] = w(null), [xe, ee] = w(!1), [C, Ee] = w(!1);
  H(() => {
    if (!S) return;
    const i = new AbortController(), u = window.setTimeout(async () => {
      ee(!0), Ee(!1);
      try {
        const L = await S(
          j,
          i.signal
        );
        i.signal.aborted || ve(L);
      } catch {
        i.signal.aborted || Ee(!0);
      } finally {
        i.signal.aborted || ee(!1);
      }
    }, Y);
    return () => {
      window.clearTimeout(u), i.abort();
    };
  }, [j, S, Y]);
  const I = S ? Ae ?? l : l, P = F || xe, W = se(
    (i) => typeof s == "function" ? s(i) : String(i[s]),
    [s]
  ), A = se(
    (i) => {
      if (m) return m(i);
      const u = W(i);
      return typeof u == "string" || typeof u == "number" ? String(u) : "";
    },
    [W, m]
  ), M = se(
    (i) => {
      const u = typeof d == "function" ? d(i) : i[d];
      if (typeof u != "string" && typeof u != "number")
        throw new TypeError("optionValue must resolve to a string or number.");
      return u;
    },
    [d]
  ), ne = je(() => {
    const i = /* @__PURE__ */ new Set();
    return I.map(M).filter((u) => i.has(u) ? !0 : (i.add(u), !1));
  }, [I, M]);
  H(() => {
    ne.length && console.warn(
      `Duplicate optionValue found in Select "${t}":`,
      ne
    );
  }, [ne, t]);
  const ae = [...l, ...I].find(
    (i) => M(i) === o
  ), Fe = ae ? A(ae) : "", a = je(() => {
    const i = j.trim().toLocaleLowerCase(ie);
    return !i || S ? I : I.filter(
      (u) => A(u).toLocaleLowerCase(ie).includes(i)
    );
  }, [I, A, j, S, ie]), { refs: N, floatingStyles: D } = nn({
    open: g,
    placement: "bottom-start",
    strategy: z ? "fixed" : "absolute",
    whileElementsMounted: tn,
    middleware: [
      rn(8),
      ln({ padding: 12 }),
      on({ padding: 12 }),
      an({
        padding: 12,
        apply({ availableHeight: i, rects: u, elements: L }) {
          Object.assign(L.floating.style, {
            maxHeight: `${Math.min(230, i)}px`,
            width: `${u.reference.width}px`
          });
        }
      })
    ]
  }), ke = oe || a.length >= de, Te = cn({
    count: a.length,
    getScrollElement: () => Z.current,
    estimateSize: () => fe,
    overscan: 5,
    enabled: ke && g
  }), te = se(() => {
    ye(!1), v(""), V?.(""), he?.();
  }, [V, he]), ce = () => {
    y || x || (g || we?.(), ye(!0));
  }, Ie = se(() => {
    y || x || (c(null, null), v(""), T(0), V?.(""), $.current?.focus());
  }, [y, x, c, V]);
  en(
    me,
    () => ({
      focus: () => $.current?.focus(),
      blur: () => $.current?.blur(),
      clear: Ie
    }),
    [Ie]
  ), H(() => {
    const i = (u) => {
      const L = u.target;
      !G.current?.contains(L) && !Z.current?.contains(L) && te();
    };
    return document.addEventListener("mousedown", i), () => document.removeEventListener("mousedown", i);
  }, [te]), H(() => {
    E >= a.length && T(0);
  }, [E, a.length]), H(() => {
    ke && g && a[E] && Te.scrollToIndex(E, { align: "auto" });
  }, [
    E,
    a,
    g,
    ke,
    Te
  ]);
  const Pe = (i) => {
    h(i) || (c(M(i), i), te(), $.current?.focus());
  }, Xe = (i) => {
    if (!a.length) return;
    let u = E;
    do
      u = (u + i + a.length) % a.length;
    while (h(a[u]) && u !== E);
    T(u);
  }, Ve = (i = !1) => {
    const u = a.map((L, re) => ({ option: L, index: re }));
    return i && u.reverse(), u.find(({ option: L }) => !h(L))?.index ?? 0;
  }, qe = (i) => {
    if (i.key === "Backspace" && !j && o !== null && U) {
      i.preventDefault(), Ie();
      return;
    }
    if (i.key === "ArrowDown" || i.key === "ArrowUp")
      i.preventDefault(), g ? Xe(i.key === "ArrowDown" ? 1 : -1) : (ce(), T(Ve(i.key === "ArrowUp")));
    else if (i.key === "Home" && g)
      i.preventDefault(), T(Ve());
    else if (i.key === "End" && g)
      i.preventDefault(), T(Ve(!0));
    else if (i.key === "Enter" && g) {
      i.preventDefault();
      const u = a[E];
      u && Pe(u);
    } else i.key === "Escape" && g ? (i.preventDefault(), te()) : i.key === "Tab" && te();
  }, He = (i, u, L) => {
    const re = M(i), Ye = h(i);
    return /* @__PURE__ */ p(
      "div",
      {
        id: `${B}-option-${u}`,
        role: "option",
        "aria-selected": re === o,
        "aria-disabled": Ye,
        "aria-posinset": u + 1,
        "aria-setsize": a.length,
        className: f(
          "inconel-select-option",
          u === E && "inconel-is-active",
          re === o && "inconel-is-selected",
          Ye && "inconel-is-disabled",
          k.option
        ),
        style: { ...L, ...b.option },
        onMouseEnter: () => T(u),
        onMouseDown: (Ze) => Ze.preventDefault(),
        onClick: () => Pe(i),
        children: [
          /* @__PURE__ */ r("span", { children: W(i) }),
          re === o && /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "✓" })
        ]
      },
      re
    );
  }, Je = P ? /* @__PURE__ */ p(
    "div",
    {
      role: "status",
      className: f("inconel-select-message", k.message),
      style: b.message,
      children: [
        /* @__PURE__ */ r("span", { className: "inconel-select-spinner", "aria-hidden": "true" }),
        _
      ]
    }
  ) : C ? /* @__PURE__ */ r(
    "div",
    {
      role: "alert",
      className: f("inconel-select-message inconel-select-message-error", k.message),
      style: b.message,
      children: De
    }
  ) : a.length === 0 ? /* @__PURE__ */ r(
    "div",
    {
      className: f("inconel-select-message", k.message),
      style: b.message,
      children: R
    }
  ) : ke ? /* @__PURE__ */ r(
    "div",
    {
      role: "presentation",
      className: "inconel-select-virtual-content",
      style: { height: Te.getTotalSize() },
      children: Te.getVirtualItems().map(
        (i) => He(a[i.index], i.index, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: i.size,
          transform: `translateY(${i.start}px)`
        })
      )
    }
  ) : a.map((i, u) => He(i, u)), Be = g ? /* @__PURE__ */ r(
    "div",
    {
      ref: (i) => {
        Z.current = i, N.setFloating(i);
      },
      id: ge,
      role: "listbox",
      "aria-labelledby": be,
      className: f(
        "inconel-select-menu",
        z && "inconel-select-menu-portal",
        k.menu
      ),
      style: { ...D, ...b.menu },
      children: Je
    }
  ) : null, Qe = q ? Ne : X ? _e : void 0;
  return /* @__PURE__ */ p(
    "div",
    {
      ref: G,
      className: f("inconel-select-field", pe, k.root),
      style: b.root,
      children: [
        /* @__PURE__ */ p(
          "label",
          {
            id: be,
            htmlFor: B,
            className: k.label,
            style: b.label,
            children: [
              t,
              O && /* @__PURE__ */ r("span", { "aria-hidden": "true", children: " *" })
            ]
          }
        ),
        /* @__PURE__ */ p(
          "div",
          {
            ref: N.setReference,
            className: f(
              "inconel-select-control",
              g && "inconel-is-open",
              y && "inconel-is-disabled",
              !!q && "inconel-has-error",
              k.control
            ),
            style: b.control,
            children: [
              /* @__PURE__ */ r(
                "input",
                {
                  ref: $,
                  id: B,
                  role: "combobox",
                  "aria-expanded": g,
                  "aria-controls": ge,
                  "aria-autocomplete": "list",
                  "aria-activedescendant": g && a[E] ? `${B}-option-${E}` : void 0,
                  "aria-describedby": Qe,
                  "aria-invalid": !!q,
                  "aria-required": O,
                  "aria-busy": P,
                  required: O,
                  disabled: y,
                  readOnly: x,
                  autoComplete: "off",
                  placeholder: K,
                  value: j || Fe,
                  className: k.input,
                  style: b.input,
                  onChange: (i) => {
                    v(i.target.value), T(0), V?.(i.target.value), ce();
                  },
                  onClick: ce,
                  onFocus: (i) => {
                    ce(), ae && !j && i.currentTarget.select();
                  },
                  onKeyDown: qe
                }
              ),
              P && /* @__PURE__ */ r("span", { className: "inconel-select-spinner", "aria-hidden": "true" }),
              U && o !== null && !y && !x && J && /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: f("inconel-select-clear", k.clearButton),
                  style: b.clearButton,
                  "aria-label": J,
                  onClick: Ie,
                  children: "×"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: f("inconel-select-toggle", k.toggleButton),
                  style: b.toggleButton,
                  "aria-label": g ? Le : Q,
                  "aria-expanded": g,
                  disabled: y,
                  tabIndex: -1,
                  onClick: () => g ? te() : ce(),
                  children: /* @__PURE__ */ r(
                    "svg",
                    {
                      "aria-hidden": "true",
                      viewBox: "0 0 20 20",
                      width: "20",
                      height: "20",
                      fill: "none",
                      children: /* @__PURE__ */ r(
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
        n && /* @__PURE__ */ r(
          "input",
          {
            type: "hidden",
            name: n,
            value: o ?? "",
            required: O
          }
        ),
        /* @__PURE__ */ r(
          Oe,
          {
            hint: X,
            errorMessage: q,
            hintId: _e,
            errorId: Ne
          }
        ),
        z && Be ? sn(Be, z) : Be
      ]
    }
  );
}
const ot = Me(jn);
function Cn({
  items: e,
  value: n,
  defaultValue: t,
  onChange: l,
  className: o
}) {
  const [c, s] = w(
    t ?? e[0]?.id
  ), d = n ?? c, m = e.find((h) => h.id === d);
  return /* @__PURE__ */ p("div", { className: f("inconel-tabs", o), children: [
    /* @__PURE__ */ r("div", { className: "inconel-tabs__list", role: "tablist", children: e.map((h) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        role: "tab",
        disabled: h.disabled,
        "aria-selected": h.id === d,
        className: f(
          "inconel-tabs__tab",
          h.id === d && "inconel-is-active"
        ),
        onClick: () => {
          s(h.id), l?.(h.id);
        },
        children: h.label
      },
      h.id
    )) }),
    m?.content !== void 0 && /* @__PURE__ */ r("div", { className: "inconel-tabs__panel", role: "tabpanel", children: m.content })
  ] });
}
const at = Cn;
function ct({
  connected: e,
  connectedLabel: n = "Bağlı",
  disconnectedLabel: t = "Bağlantı yok",
  className: l,
  ...o
}) {
  return /* @__PURE__ */ p(
    "span",
    {
      ...o,
      className: f(
        "inconel-socket-status",
        e ? "inconel-is-connected" : "inconel-is-disconnected",
        l
      ),
      role: "status",
      children: [
        /* @__PURE__ */ r("i", { "aria-hidden": "true" }),
        e ? n : t
      ]
    }
  );
}
function st({
  className: e,
  src: n,
  title: t,
  render: l = !0,
  ...o
}) {
  if (!l || !n)
    return null;
  const c = ["inconel-svg", e].filter(Boolean).join(" ");
  return /* @__PURE__ */ r(
    un,
    {
      ...o,
      className: c,
      src: n,
      title: t ?? void 0,
      wrapper: "span"
    }
  );
}
const ut = wn, dt = ze, ft = Me(
  function({
    id: n,
    label: t,
    hint: l,
    errorMessage: o,
    fullWidth: c = !1,
    resize: s = "vertical",
    className: d,
    required: m,
    disabled: h,
    "aria-describedby": K,
    style: U,
    ...y
  }, x) {
    const O = Ue(), F = n ?? `inconel-textarea-${O.replace(/:/g, "")}`, S = `${F}-hint`, Y = `${F}-error`, X = [
      K,
      l && !o ? S : void 0,
      o ? Y : void 0
    ].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ p(
      "div",
      {
        className: [
          "inconel-field",
          c ? "inconel-field--full-width" : "",
          d ?? ""
        ].join(" "),
        children: [
          t && /* @__PURE__ */ p("label", { className: "inconel-field__label", htmlFor: F, children: [
            t,
            m && /* @__PURE__ */ r("span", { "aria-hidden": "true", children: " *" })
          ] }),
          /* @__PURE__ */ r(
            "textarea",
            {
              ...y,
              ref: x,
              id: F,
              required: m,
              disabled: h,
              "aria-invalid": !!o,
              "aria-describedby": X,
              className: [
                "inconel-textarea",
                o ? "inconel-is-invalid" : ""
              ].join(" "),
              style: { ...U, resize: s }
            }
          ),
          /* @__PURE__ */ r(
            Oe,
            {
              hint: l,
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
function pt({
  content: e,
  children: n,
  placement: t = "top",
  className: l
}) {
  return /* @__PURE__ */ p(
    "span",
    {
      className: f(
        "inconel-tooltip",
        `inconel-tooltip--${t}`,
        l
      ),
      children: [
        n,
        /* @__PURE__ */ r("span", { className: "inconel-tooltip__content", role: "tooltip", children: e })
      ]
    }
  );
}
export {
  dn as Button,
  fn as Checkbox,
  hn as CheckboxGroup,
  Hn as CurrencyInput,
  Yn as CustomizableSwitch,
  Rn as DataGrid,
  Gn as DatePicker,
  Wn as DndFileUpload,
  Kn as DotLoader,
  Dn as DragDropUpload,
  Xn as ExcelTable,
  Oe as FieldFeedback,
  Ke as FileUpload,
  qn as FileUploadText,
  Jn as Filter,
  Qn as HTMLTable,
  wn as HtmlEditor,
  ze as Input,
  Zn as InputText,
  An as Loader,
  et as LoaderMini,
  nt as Modal,
  Fn as MultiSelect,
  tt as MultiSelectWithCheckbox,
  Vn as Option,
  rt as OptionWithIcon,
  lt as RadioGroup,
  it as ReadOnly,
  ot as Select,
  at as SlideTabs,
  ct as SocketStatus,
  st as Svg,
  yn as Switch,
  $e as Table,
  Cn as Tabs,
  ut as TextEditor,
  dt as TextInput,
  ft as Textarea,
  pt as Tooltip
};
//# sourceMappingURL=index.js.map
