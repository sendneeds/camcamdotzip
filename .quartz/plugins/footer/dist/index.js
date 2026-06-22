import { readFileSync } from 'fs';
import { join } from 'path';

// src/components/Footer.tsx

// src/i18n/locales/en-US.ts
var en_US_default = {
  components: {
    footer: {
      createdWith: "Created with"
    }
  }
};

// src/i18n/locales/ar-SA.ts
var ar_SA_default = {
  components: {
    footer: {
      createdWith: "\u0623\u064F\u0646\u0634\u0626 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645"
    }
  }
};

// src/i18n/locales/ca-ES.ts
var ca_ES_default = {
  components: {
    footer: {
      createdWith: "Creat amb"
    }
  }
};

// src/i18n/locales/cs-CZ.ts
var cs_CZ_default = {
  components: {
    footer: {
      createdWith: "Vytvo\u0159eno pomoc\xED"
    }
  }
};

// src/i18n/locales/de-DE.ts
var de_DE_default = {
  components: {
    footer: {
      createdWith: "Erstellt mit"
    }
  }
};

// src/i18n/locales/en-GB.ts
var en_GB_default = {
  components: {
    footer: {
      createdWith: "Created with"
    }
  }
};

// src/i18n/locales/es-ES.ts
var es_ES_default = {
  components: {
    footer: {
      createdWith: "Creado con"
    }
  }
};

// src/i18n/locales/fa-IR.ts
var fa_IR_default = {
  components: {
    footer: {
      createdWith: "\u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627"
    }
  }
};

// src/i18n/locales/fi-FI.ts
var fi_FI_default = {
  components: {
    footer: {
      createdWith: "Luotu k\xE4ytt\xE4en"
    }
  }
};

// src/i18n/locales/fr-FR.ts
var fr_FR_default = {
  components: {
    footer: {
      createdWith: "Cr\xE9\xE9 avec"
    }
  }
};

// src/i18n/locales/he-IL.ts
var he_IL_default = {
  components: {
    footer: {
      createdWith: "\u05E0\u05D5\u05E6\u05E8 \u05D1\u05D0\u05DE\u05E6\u05E2\u05D5\u05EA"
    }
  }
};

// src/i18n/locales/hu-HU.ts
var hu_HU_default = {
  components: {
    footer: {
      createdWith: "K\xE9sz\xEDtve ezzel:"
    }
  }
};

// src/i18n/locales/id-ID.ts
var id_ID_default = {
  components: {
    footer: {
      createdWith: "Dibuat dengan"
    }
  }
};

// src/i18n/locales/it-IT.ts
var it_IT_default = {
  components: {
    footer: {
      createdWith: "Creato con"
    }
  }
};

// src/i18n/locales/ja-JP.ts
var ja_JP_default = {
  components: {
    footer: {
      createdWith: "\u4F5C\u6210"
    }
  }
};

// src/i18n/locales/kk-KZ.ts
var kk_KZ_default = {
  components: {
    footer: {
      createdWith: "\u049A\u04B1\u0440\u0430\u0441\u0442\u044B\u0440\u044B\u043B\u0493\u0430\u043D \u049B\u04B1\u0440\u0430\u043B:"
    }
  }
};

// src/i18n/locales/ko-KR.ts
var ko_KR_default = {
  components: {
    footer: {
      createdWith: "Created with"
    }
  }
};

// src/i18n/locales/lt-LT.ts
var lt_LT_default = {
  components: {
    footer: {
      createdWith: "Sukurta Su"
    }
  }
};

// src/i18n/locales/nb-NO.ts
var nb_NO_default = {
  components: {
    footer: {
      createdWith: "Laget med"
    }
  }
};

// src/i18n/locales/nl-NL.ts
var nl_NL_default = {
  components: {
    footer: {
      createdWith: "Gemaakt met"
    }
  }
};

// src/i18n/locales/pl-PL.ts
var pl_PL_default = {
  components: {
    footer: {
      createdWith: "Stworzone z u\u017Cyciem"
    }
  }
};

// src/i18n/locales/pt-BR.ts
var pt_BR_default = {
  components: {
    footer: {
      createdWith: "Criado com"
    }
  }
};

// src/i18n/locales/ro-RO.ts
var ro_RO_default = {
  components: {
    footer: {
      createdWith: "Creat cu"
    }
  }
};

// src/i18n/locales/ru-RU.ts
var ru_RU_default = {
  components: {
    footer: {
      createdWith: "\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E"
    }
  }
};

// src/i18n/locales/th-TH.ts
var th_TH_default = {
  components: {
    footer: {
      createdWith: "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E14\u0E49\u0E27\u0E22"
    }
  }
};

// src/i18n/locales/tr-TR.ts
var tr_TR_default = {
  components: {
    footer: {
      createdWith: "\u015Eununla olu\u015Fturuldu"
    }
  }
};

// src/i18n/locales/uk-UA.ts
var uk_UA_default = {
  components: {
    footer: {
      createdWith: "\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043E \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E"
    }
  }
};

// src/i18n/locales/vi-VN.ts
var vi_VN_default = {
  components: {
    footer: {
      createdWith: "\u0110\u01B0\u1EE3c t\u1EA1o b\u1EB1ng"
    }
  }
};

// src/i18n/locales/zh-CN.ts
var zh_CN_default = {
  components: {
    footer: {
      createdWith: "Created with"
    }
  }
};

// src/i18n/locales/zh-TW.ts
var zh_TW_default = {
  components: {
    footer: {
      createdWith: "Created with"
    }
  }
};

// src/i18n/index.ts
var locales = {
  "en-US": en_US_default,
  "ar-SA": ar_SA_default,
  "ca-ES": ca_ES_default,
  "cs-CZ": cs_CZ_default,
  "de-DE": de_DE_default,
  "en-GB": en_GB_default,
  "es-ES": es_ES_default,
  "fa-IR": fa_IR_default,
  "fi-FI": fi_FI_default,
  "fr-FR": fr_FR_default,
  "he-IL": he_IL_default,
  "hu-HU": hu_HU_default,
  "id-ID": id_ID_default,
  "it-IT": it_IT_default,
  "ja-JP": ja_JP_default,
  "kk-KZ": kk_KZ_default,
  "ko-KR": ko_KR_default,
  "lt-LT": lt_LT_default,
  "nb-NO": nb_NO_default,
  "nl-NL": nl_NL_default,
  "pl-PL": pl_PL_default,
  "pt-BR": pt_BR_default,
  "ro-RO": ro_RO_default,
  "ru-RU": ru_RU_default,
  "th-TH": th_TH_default,
  "tr-TR": tr_TR_default,
  "uk-UA": uk_UA_default,
  "vi-VN": vi_VN_default,
  "zh-CN": zh_CN_default,
  "zh-TW": zh_TW_default
};
function i18n(locale) {
  return locales[locale] || en_US_default;
}

// src/components/styles/footer.scss
var footer_default = "footer {\n  text-align: left;\n}";
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/Footer.tsx
function getQuartzVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
    return pkg.version ?? "";
  } catch {
    return "";
  }
}
var InstagramIcon = () => /* @__PURE__ */ u2("svg", {
  width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true",
  children: [
    /* @__PURE__ */ u2("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }),
    /* @__PURE__ */ u2("circle", { cx: "12", cy: "12", r: "4.5" }),
    /* @__PURE__ */ u2("circle", { cx: "17.5", cy: "6.5", r: "1.2", fill: "currentColor", stroke: "none" })
  ]
});
var ArenaIcon = () => /* @__PURE__ */ u2("img", {
  src: "data:image/png;base64,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", alt: "Are.na", height: "13", width: "22", "aria-hidden": "true"
});
var LinkedInIcon = () => /* @__PURE__ */ u2("svg", {
  width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true",
  children: /* @__PURE__ */ u2("path", {
    d: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.11V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8z"
  })
});
var Footer_default = ((opts) => {
  const version = getQuartzVersion();
  const Footer = ({ displayClass, cfg }) => {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const links = opts?.links ?? {};
    return /* @__PURE__ */ u2("footer", { class: `${displayClass ?? ""}`, children: [
      /* @__PURE__ */ u2("div", { class: "footer-left", children: [
        /* @__PURE__ */ u2("span", { children: "created by cameron campbell" }),
        /* @__PURE__ */ u2("a", { href: "https://camcam.au", children: "https://camcam.au" })
      ] }),
      /* @__PURE__ */ u2("div", { class: "footer-center", children: [
        /* @__PURE__ */ u2("a", { href: "https://www.instagram.com/sendneeds", target: "_blank", rel: "noopener noreferrer", "aria-label": "Instagram", children: InstagramIcon() }),
        /* @__PURE__ */ u2("a", { href: "https://www.are.na/cameron-campbell-smmne9r9ufi/", target: "_blank", rel: "noopener noreferrer", "aria-label": "Are.na", children: ArenaIcon() }),
        /* @__PURE__ */ u2("a", { href: "https://www.linkedin.com/in/cameroncams/", target: "_blank", rel: "noopener noreferrer", "aria-label": "LinkedIn", children: LinkedInIcon() })
      ] }),
      /* @__PURE__ */ u2("div", { class: "footer-right", children: [
        /* @__PURE__ */ u2("p", { children: [
          i18n(cfg?.locale ?? "en-US").components.footer.createdWith,
          " ",
          /* @__PURE__ */ u2("a", { href: "https://quartz.jzhao.xyz/", children: [
            "Quartz",
            version ? ` v${version}` : ""
          ] }),
          " \xA9",
          " ",
          year
        ] }),
        /* @__PURE__ */ u2("ul", { children: Object.entries(links).map(([text, link]) => /* @__PURE__ */ u2("li", { children: /* @__PURE__ */ u2("a", { href: link, children: text }) })) })
      ] })
    ] });
  };
  Footer.css = footer_default;
  return Footer;
});

export { Footer_default as Footer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map