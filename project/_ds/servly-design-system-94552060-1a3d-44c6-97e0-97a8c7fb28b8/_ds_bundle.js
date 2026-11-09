/* @ds-bundle: {"format":4,"namespace":"ServlyDesignSystem_945520","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ImageSlot","sourcePath":"components/core/ImageSlot.jsx"},{"name":"Rating","sourcePath":"components/core/Rating.jsx"},{"name":"BottomSheet","sourcePath":"components/feedback/BottomSheet.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"BookingCard","sourcePath":"components/marketplace/BookingCard.jsx"},{"name":"Carousel","sourcePath":"components/marketplace/Carousel.jsx"},{"name":"CATEGORY_ART","sourcePath":"components/marketplace/CategoryCard.jsx"},{"name":"CategoryCard","sourcePath":"components/marketplace/CategoryCard.jsx"},{"name":"ChatBubble","sourcePath":"components/marketplace/ChatBubble.jsx"},{"name":"PromoBanner","sourcePath":"components/marketplace/PromoBanner.jsx"},{"name":"ProviderCard","sourcePath":"components/marketplace/ProviderCard.jsx"},{"name":"SectionHeader","sourcePath":"components/marketplace/SectionHeader.jsx"},{"name":"ServiceCard","sourcePath":"components/marketplace/ServiceCard.jsx"},{"name":"AppBar","sourcePath":"components/navigation/AppBar.jsx"},{"name":"ListItem","sourcePath":"components/navigation/ListItem.jsx"},{"name":"SegmentedControl","sourcePath":"components/navigation/SegmentedControl.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"assets/dev/ds-loader.js":"80576d830245","components/core/Avatar.jsx":"4af142d0771f","components/core/Badge.jsx":"4d5bd29f4387","components/core/Button.jsx":"69f2638dcac3","components/core/Chip.jsx":"5fcfb8fa2f71","components/core/Icon.jsx":"e031f4947b8a","components/core/IconButton.jsx":"b49e6c7d0db9","components/core/ImageSlot.jsx":"a93fd2a4e5ee","components/core/Rating.jsx":"9b2c36e2882f","components/feedback/BottomSheet.jsx":"7982e1175d34","components/feedback/EmptyState.jsx":"6ffb68613719","components/feedback/Toast.jsx":"347bad368e90","components/forms/Checkbox.jsx":"8a5264c51c19","components/forms/Radio.jsx":"249de0d48b66","components/forms/SearchBar.jsx":"889a6c345336","components/forms/Switch.jsx":"a10c1b1c2a61","components/forms/TextField.jsx":"8035c727cadb","components/marketplace/BookingCard.jsx":"4ee7d8299c89","components/marketplace/Carousel.jsx":"94a32b6b8761","components/marketplace/CategoryCard.jsx":"5b736413810b","components/marketplace/ChatBubble.jsx":"dbbfafd4fbff","components/marketplace/PromoBanner.jsx":"30eff20be77d","components/marketplace/ProviderCard.jsx":"ce3cbc1dfe6c","components/marketplace/SectionHeader.jsx":"3b03b26e0771","components/marketplace/ServiceCard.jsx":"51912c170ffc","components/navigation/AppBar.jsx":"23f77909407d","components/navigation/ListItem.jsx":"6cac9e5f3a1b","components/navigation/SegmentedControl.jsx":"76075f381324","components/navigation/TabBar.jsx":"4dbcfb4474a1","ui_kits/app/App.jsx":"b50e27d8bee3","ui_kits/app/Booking.jsx":"40c81d82d79c","ui_kits/app/Bookings.jsx":"601ac4b4486e","ui_kits/app/CategoryList.jsx":"f56cc54625f7","ui_kits/app/Chat.jsx":"6c42fd43d4ef","ui_kits/app/Home.jsx":"1fad5ce67ea3","ui_kits/app/Onboarding.jsx":"076f23ba82f8","ui_kits/app/Profile.jsx":"1d6bd88eada4","ui_kits/app/ProviderProfile.jsx":"1fb01bfb36de","ui_kits/app/data.js":"f8271abbc85a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ServlyDesignSystem_945520 = window.ServlyDesignSystem_945520 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/dev/ds-loader.js
try { (() => {
// Preview helper: resolves the component namespace from _ds_bundle.js when present;
// otherwise transpiles components/*.jsx in-browser (requires Babel standalone).
(function () {
  var ROOT = new URL('../../', document.currentScript.src).href;
  var FILES = ['core/Icon', 'core/ImageSlot', 'core/Button', 'core/IconButton', 'core/Badge', 'core/Chip', 'core/Avatar', 'core/Rating', 'forms/TextField', 'forms/SearchBar', 'forms/Checkbox', 'forms/Radio', 'forms/Switch', 'marketplace/CategoryCard', 'marketplace/ServiceCard', 'marketplace/ProviderCard', 'marketplace/PromoBanner', 'marketplace/Carousel', 'marketplace/SectionHeader', 'marketplace/BookingCard', 'marketplace/ChatBubble', 'navigation/AppBar', 'navigation/TabBar', 'navigation/SegmentedControl', 'navigation/ListItem', 'feedback/BottomSheet', 'feedback/Toast', 'feedback/EmptyState'];
  function findNS() {
    return Object.keys(window).map(function (k) {
      try {
        return window[k];
      } catch (e) {
        return null;
      }
    }).find(function (v) {
      try {
        return v && typeof v === 'object' && v !== window && v.CategoryCard && v.Button;
      } catch (e) {
        return false;
      }
    });
  }
  var p;
  window.loadDS = function () {
    if (p) return p;
    var ns = findNS();
    if (ns) return p = Promise.resolve(ns);
    p = Promise.all(FILES.map(function (f) {
      return fetch(ROOT + 'components/' + f + '.jsx').then(function (r) {
        return r.text();
      });
    })).then(function (srcs) {
      var names = FILES.map(function (f) {
        return f.split('/')[1];
      });
      var body = srcs.map(function (s, i) {
        return 'var ' + names[i] + ' = (function(){' + s.replace(/^import .*$/gm, '').replace(/export (function|const)/g, '$1') + '\nreturn ' + names[i] + ';})();';
      }).join('\n');
      body += '\nreturn {' + names.join(',') + '};';
      var code = Babel.transform('(function(React){' + body + '})', {
        presets: ['react']
      }).code;
      var ns = (0, eval)(code)(window.React);
      window.Servly = ns;
      return ns;
    });
    return p;
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/dev/ds-loader.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const BASE = 'https://unpkg.com/lucide-static@0.454.0/icons/';
const cache = {};
const pending = {};
function load(name) {
  if (!pending[name]) pending[name] = fetch(BASE + name + '.svg').then(r => r.ok ? r.text() : '').then(t => {
    cache[name] = t.replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, 'width="100%"').replace(/height="24"/, 'height="100%"').replace(/class="[^"]*"/, '');
    return cache[name];
  }).catch(() => cache[name] = '');
  return pending[name];
}
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth,
  filled,
  style
}) {
  const [svg, setSvg] = React.useState(cache[name] || '');
  React.useEffect(() => {
    let live = true;
    if (cache[name] != null) setSvg(cache[name]);else load(name).then(t => live && setSvg(t));
    return () => {
      live = false;
    };
  }, [name]);
  let html = strokeWidth ? svg.replace(/stroke-width="2"/, 'stroke-width="' + strokeWidth + '"') : svg;
  if (filled) html = html.replace(/fill="none"/, 'fill="currentColor"');
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      color,
      lineHeight: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
const HUES = [292, 28, 190, 240, 355, 150, 72, 268];
function Avatar({
  name = '',
  src,
  size = 44,
  online,
  verified,
  style
}) {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const h = HUES[(name.charCodeAt(0) || 0) % HUES.length];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'oklch(0.92 0.06 ' + h + ')',
      color: 'oklch(0.38 0.1 ' + h + ')',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.36)
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials), online && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: Math.max(10, size * 0.26),
      height: Math.max(10, size * 0.26),
      borderRadius: '50%',
      background: 'var(--success)',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }), verified && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: Math.max(16, size * 0.34),
      height: Math.max(16, size * 0.34),
      borderRadius: '50%',
      background: 'var(--brand)',
      boxShadow: '0 0 0 2px var(--surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: Math.max(10, size * 0.2),
    color: "#fff",
    strokeWidth: 3
  })));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  brand: ['var(--brand-tint-strong)', 'var(--brand-ink)'],
  solid: ['var(--brand)', 'var(--text-on-brand)'],
  accent: ['var(--accent)', 'var(--neutral-0)'],
  success: ['var(--success-tint)', 'var(--success)'],
  warning: ['var(--warning-tint)', 'oklch(0.48 0.11 65)'],
  danger: ['var(--danger-tint)', 'var(--danger)'],
  info: ['var(--info-tint)', 'var(--info)'],
  neutral: ['var(--neutral-100)', 'var(--text-secondary)'],
  dark: ['oklch(0.2 0.02 285 / 0.72)', 'var(--neutral-0)']
};
function Badge({
  children,
  tone = 'brand',
  icon,
  size = 'md',
  style
}) {
  const [bg, fg] = T[tone] || T.brand;
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: sm ? 20 : 24,
      padding: sm ? '0 7px' : '0 9px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: sm ? 11 : 12,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: sm ? 11 : 13
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 36,
    px: 14,
    fs: 14,
    ic: 16
  },
  md: {
    h: 44,
    px: 18,
    fs: 15,
    ic: 18
  },
  lg: {
    h: 54,
    px: 24,
    fs: 16,
    ic: 20
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--brand)',
    color: 'var(--text-on-brand)',
    boxShadow: 'var(--shadow-brand)'
  },
  secondary: {
    background: 'var(--brand-tint-strong)',
    color: 'var(--brand-ink)'
  },
  outline: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: 'inset 0 0 0 1.5px var(--border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--brand)'
  },
  dark: {
    background: 'var(--neutral-900)',
    color: 'var(--neutral-0)'
  },
  danger: {
    background: 'var(--danger-tint)',
    color: 'var(--danger)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  loading,
  onClick,
  style
}) {
  const [p, setP] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const off = disabled || loading;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: off,
    onClick: onClick,
    onPointerDown: () => setP(true),
    onPointerUp: () => setP(false),
    onPointerLeave: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      width: fullWidth ? '100%' : undefined,
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: s.fs,
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
      cursor: off ? 'default' : 'pointer',
      transform: p && !off ? 'scale(var(--press-scale))' : 'none',
      filter: p && !off ? 'brightness(0.94)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast)',
      ...VARIANTS[variant],
      ...(disabled ? {
        background: 'var(--neutral-100)',
        color: 'var(--text-disabled)',
        boxShadow: 'none'
      } : {}),
      ...style
    }
  }, loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: s.ic,
      height: s.ic,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderRightColor: 'transparent',
      animation: 'sv-spin 0.7s linear infinite'
    }
  }) : iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.ic
  }), children, iconRight && !loading && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function Chip({
  children,
  icon,
  selected,
  onClick,
  trailingIcon,
  size = 'md',
  style
}) {
  const h = size === 'sm' ? 32 : 38;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      flex: 'none',
      height: h,
      padding: '0 ' + (size === 'sm' ? 12 : 14) + 'px',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: size === 'sm' ? 13 : 14,
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base)',
      background: selected ? 'var(--neutral-900)' : 'var(--surface-card)',
      color: selected ? 'var(--neutral-0)' : 'var(--text-primary)',
      boxShadow: selected ? 'none' : 'inset 0 0 0 1px var(--border-default)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), children, trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: 14
  }));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const V = {
  filled: {
    background: 'var(--brand)',
    color: 'var(--text-on-brand)'
  },
  tonal: {
    background: 'var(--brand-tint-strong)',
    color: 'var(--brand-ink)'
  },
  surface: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-primary)',
    boxShadow: 'inset 0 0 0 1.5px var(--border-default)'
  },
  plain: {
    background: 'transparent',
    color: 'var(--text-primary)'
  },
  glass: {
    background: 'oklch(1 0 0 / 0.85)',
    color: 'var(--text-primary)',
    backdropFilter: 'var(--blur-bar)',
    WebkitBackdropFilter: 'var(--blur-bar)'
  }
};
function IconButton({
  icon,
  variant = 'surface',
  size = 44,
  dot,
  active,
  label,
  onClick,
  style
}) {
  const [p, setP] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label || icon,
    onClick: onClick,
    onPointerDown: () => setP(true),
    onPointerUp: () => setP(false),
    onPointerLeave: () => setP(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      width: size,
      height: size,
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      transform: p ? 'scale(0.92)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out)',
      ...V[variant],
      ...(active ? {
        color: 'var(--danger)'
      } : {}),
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45),
    filled: active
  }), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: size * 0.2,
      right: size * 0.22,
      width: 9,
      height: 9,
      borderRadius: 9,
      background: 'var(--accent)',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/ImageSlot.jsx
try { (() => {
const HUE = {
  coral: 28,
  amber: 72,
  green: 150,
  teal: 190,
  sky: 240,
  indigo: 268,
  violet: 300,
  pink: 355,
  neutral: 285
};
function ImageSlot({
  label = 'photo',
  tone = 'neutral',
  radius = 0,
  height = '100%',
  style
}) {
  const h = HUE[tone] ?? 285,
    c = tone === 'neutral' ? 0.01 : 0.05;
  const a = 'oklch(0.93 ' + c + ' ' + h + ')',
    b = 'oklch(0.9 ' + c + ' ' + h + ')';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height,
      borderRadius: radius,
      overflow: 'hidden',
      background: 'repeating-linear-gradient(135deg, ' + a + ' 0 10px, ' + b + ' 10px 20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      color: 'oklch(0.45 ' + c * 2 + ' ' + h + ')',
      background: 'oklch(1 0 0 / 0.7)',
      padding: '3px 7px',
      borderRadius: 6
    }
  }, label));
}
Object.assign(__ds_scope, { ImageSlot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ImageSlot.jsx", error: String((e && e.message) || e) }); }

// components/core/Rating.jsx
try { (() => {
function Rating({
  value,
  count,
  size = 'md',
  style
}) {
  const fs = size === 'sm' ? 12 : 14;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      lineHeight: 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: fs + 2,
    color: "var(--star)",
    filled: true
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, Number(value).toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontWeight: 500
    }
  }, "(", count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rating.jsx", error: String((e && e.message) || e) }); }

// components/feedback/BottomSheet.jsx
try { (() => {
function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      pointerEvents: open ? 'auto' : 'none',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface-scrim)',
      opacity: open ? 1 : 0,
      transition: 'opacity var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '88%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-lg)',
      transform: open ? 'none' : 'translateY(105%)',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 5,
      borderRadius: 5,
      background: 'var(--neutral-200)'
    }
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 4px',
      font: 'var(--type-h3)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 20px 20px'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 28px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({
  icon = 'calendar-x',
  color = 'violet',
  title,
  body,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12,
      padding: '32px 24px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 80,
      height: 80,
      borderRadius: 28,
      background: 'var(--cat-' + color + '-100)',
      color: 'var(--cat-' + color + '-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'rotate(-6deg)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 36
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)',
      color: 'var(--text-primary)',
      marginTop: 4
    }
  }, title), body && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      maxWidth: 280,
      textWrap: 'pretty'
    }
  }, body), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const T = {
  success: ['circle-check', 'var(--success)'],
  error: ['circle-alert', 'var(--danger)'],
  info: ['info', 'var(--violet-300)']
};
function Toast({
  message,
  tone = 'success',
  action,
  onAction,
  style
}) {
  const [ic, c] = T[tone] || T.success;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px 12px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-inverse)',
      color: 'var(--neutral-0)',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-sans)',
      animation: 'sv-rise var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--type-body-sm)',
      fontWeight: 600
    }
  }, message), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--violet-300)',
      font: 'var(--type-body-sm)',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, action));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label,
  description,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => onChange && onChange(!checked),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 22,
      height: 22,
      marginTop: 1,
      borderRadius: 7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--brand)' : 'var(--surface-card)',
      boxShadow: checked ? 'none' : 'inset 0 0 0 1.5px var(--border-strong)',
      transition: 'background var(--dur-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15,
    color: "#fff"
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)',
      color: 'var(--text-primary)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked,
  onChange,
  label,
  description,
  trailing,
  card,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => onChange && onChange(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...(card ? {
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: checked ? 'var(--brand-tint)' : 'var(--surface-card)',
        boxShadow: 'inset 0 0 0 ' + (checked ? 2 : 1.5) + 'px ' + (checked ? 'var(--brand)' : 'var(--border-default)')
      } : {}),
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 22,
      height: 22,
      borderRadius: '50%',
      boxShadow: 'inset 0 0 0 ' + (checked ? 7 : 1.5) + 'px ' + (checked ? 'var(--brand)' : 'var(--border-strong)'),
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur-base) var(--ease-spring)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)',
      color: 'var(--text-primary)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, description)), trailing);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
function SearchBar({
  placeholder = 'What do you need help with?',
  value,
  onChange,
  onFilter,
  elevated = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 52,
      padding: '0 6px 0 18px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-card)',
      boxShadow: elevated ? 'var(--shadow-md)' : 'inset 0 0 0 1.5px var(--border-default)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 20,
    color: "var(--text-tertiary)"
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--type-body)',
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }), onFilter !== null && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onFilter,
    "aria-label": "Filters",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--brand)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sliders-horizontal",
    size: 18
  })));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => onChange && onChange(!checked),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      position: 'relative',
      width: 50,
      height: 30,
      borderRadius: 30,
      background: checked ? 'var(--brand)' : 'var(--neutral-200)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 23 : 3,
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 2px 4px oklch(0.2 0.02 285 / 0.2)',
      transition: 'left var(--dur-base) var(--ease-spring)'
    }
  })));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  icon,
  trailing,
  helper,
  error,
  multiline,
  type = 'text',
  style
}) {
  const [f, setF] = React.useState(false);
  const ring = error ? 'var(--danger)' : f ? 'var(--brand)' : 'var(--border-default)';
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: multiline ? 'flex-start' : 'center',
      gap: 10,
      minHeight: 52,
      padding: multiline ? '14px 16px' : '0 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      boxShadow: 'inset 0 0 0 ' + (f || error ? 2 : 1.5) + 'px ' + ring + (f && !error ? ', 0 0 0 4px var(--focus-ring)' : ''),
      transition: 'box-shadow var(--dur-base) var(--ease-out)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: f ? 'var(--brand)' : 'var(--text-tertiary)'
  }), /*#__PURE__*/React.createElement(Tag, {
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    rows: multiline ? 3 : undefined,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      resize: 'none',
      font: 'var(--type-body)',
      fontWeight: 500,
      color: 'var(--text-primary)',
      padding: 0
    }
  }), trailing), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: error ? 'var(--danger)' : 'var(--text-tertiary)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/BookingCard.jsx
try { (() => {
const STATUS = {
  upcoming: ['brand', 'Upcoming'],
  progress: ['warning', 'In progress'],
  done: ['success', 'Completed'],
  cancelled: ['neutral', 'Cancelled']
};
function BookingCard({
  service,
  provider,
  date,
  time,
  price,
  status = 'upcoming',
  icon = 'sparkles',
  color = 'violet',
  actions,
  onClick,
  style
}) {
  const [tone, txt] = STATUS[status] || STATUS.upcoming;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 16,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-tile)',
      background: 'var(--cat-' + color + '-100)',
      color: 'var(--cat-' + color + '-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)'
    }
  }, service), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: provider,
    size: 18
  }), provider)), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: tone,
    size: "sm"
  }, txt)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)',
      font: 'var(--type-body-sm)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 15,
    color: "var(--text-tertiary)"
  }), date), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 15,
    color: "var(--text-tertiary)"
  }), time), price && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontWeight: 800
    }
  }, price)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, actions));
}
Object.assign(__ds_scope, { BookingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/BookingCard.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/Carousel.jsx
try { (() => {
function Carousel({
  children,
  itemWidth,
  gap = 12,
  padding = 20,
  dots = false,
  snap = true,
  autoplay = 0,
  style
}) {
  const ref = React.useRef(null);
  const [i, setI] = React.useState(0);
  const items = React.Children.toArray(children);
  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.children[0]) return;
    const w = el.children[0].getBoundingClientRect().width + gap;
    setI(Math.round(el.scrollLeft / w));
  };
  React.useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el || !el.children[0]) return;
      const w = el.children[0].getBoundingClientRect().width + gap;
      const n = (Math.round(el.scrollLeft / w) + 1) % items.length;
      el.scrollTo({
        left: n * w,
        behavior: 'smooth'
      });
    }, autoplay);
    return () => clearInterval(t);
  }, [autoplay, items.length, gap]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: onScroll,
    style: {
      display: 'flex',
      gap,
      overflowX: 'auto',
      scrollSnapType: snap ? 'x mandatory' : 'none',
      scrollPadding: '0 ' + padding + 'px',
      padding: '4px ' + padding + 'px 12px',
      margin: '-4px 0 -12px',
      scrollbarWidth: 'none'
    }
  }, items.map((c, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 'none',
      width: itemWidth,
      scrollSnapAlign: 'start'
    }
  }, c))), dots && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 6
    }
  }, items.map((_, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      height: 6,
      width: k === i ? 20 : 6,
      borderRadius: 6,
      background: k === i ? 'var(--brand)' : 'var(--neutral-200)',
      transition: 'width var(--dur-slow) var(--ease-out), background var(--dur-slow)'
    }
  }))));
}
Object.assign(__ds_scope, { Carousel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/Carousel.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/CategoryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ART_BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/';
const CATEGORY_ART = {
  cleaning: 'Broom/3D/broom_3d.png',
  plumbing: 'Wrench/3D/wrench_3d.png',
  electrical: 'Light%20bulb/3D/light_bulb_3d.png',
  beauty: 'Lipstick/3D/lipstick_3d.png',
  moving: 'Delivery%20truck/3D/delivery_truck_3d.png',
  repairs: 'Hammer%20and%20wrench/3D/hammer_and_wrench_3d.png',
  pets: 'Paw%20prints/3D/paw_prints_3d.png',
  tutoring: 'Graduation%20cap/3D/graduation_cap_3d.png'
};
const artUrl = a => !a ? null : /^(https?:|\.|\/)/.test(a) ? a : CATEGORY_ART[a] ? ART_BASE + CATEGORY_ART[a] : null;
function CategoryCard({
  icon,
  art,
  label,
  subtitle,
  color = 'violet',
  variant = 'tile',
  count,
  onClick,
  style
}) {
  const src = artUrl(art);
  const [p, setP] = React.useState(false);
  const c = n => 'var(--cat-' + color + '-' + n + ')';
  const press = {
    onPointerDown: () => setP(true),
    onPointerUp: () => setP(false),
    onPointerLeave: () => setP(false),
    onClick
  };
  const tr = {
    transform: p ? 'scale(0.95)' : 'none',
    transition: 'transform var(--dur-base) var(--ease-spring)'
  };
  if (variant === 'hero') {
    const light = color === 'amber';
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button"
    }, press, {
      style: {
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        aspectRatio: '1 / 0.92',
        padding: '16px 16px',
        border: 'none',
        borderRadius: 24,
        background: light ? 'oklch(0.83 0.16 84)' : c(600),
        color: light ? 'var(--neutral-900)' : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
        ...tr,
        ...style
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: '-18%',
        bottom: '-22%',
        width: '80%',
        aspectRatio: '1',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(1 0 0 / 0.28) 0%, oklch(1 0 0 / 0.06) 55%, transparent 70%)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        font: '800 20px/24px var(--font-sans)',
        letterSpacing: 'var(--ls-tight)'
      }
    }, label), (subtitle || count != null) && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        font: 'var(--type-body-sm)',
        opacity: light ? 0.75 : 0.9
      }
    }, subtitle || count + ' pros nearby'), src ? /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      style: {
        position: 'absolute',
        right: '-6%',
        bottom: '-12%',
        width: '60%',
        aspectRatio: '1',
        objectFit: 'contain',
        filter: 'drop-shadow(0 12px 14px oklch(0.25 0.08 285 / 0.35))',
        pointerEvents: 'none'
      }
    }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: icon,
      size: 56,
      style: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        opacity: 0.9
      }
    }));
  }
  if (variant === 'feature') return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, press, {
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: 150,
      height: 168,
      padding: 16,
      border: 'none',
      borderRadius: 'var(--radius-card)',
      background: c(600),
      color: '#fff',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      ...tr,
      ...style
    }
  }), src ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -34,
      top: -34,
      width: 150,
      height: 150,
      borderRadius: '50%',
      background: 'radial-gradient(circle, oklch(1 0 0 / 0.32) 0%, oklch(1 0 0 / 0.08) 55%, transparent 72%)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      position: 'absolute',
      right: -8,
      top: -4,
      width: 100,
      height: 100,
      objectFit: 'contain',
      transform: 'rotate(-10deg)',
      filter: 'drop-shadow(0 10px 12px oklch(0.3 0.1 285 / 0.35))',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -28,
      bottom: -28,
      width: 110,
      height: 110,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.14)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-tile)',
      background: 'oklch(1 0 0 / 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)'
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      opacity: 0.9
    }
  }, count, " pros nearby")));
  if (variant === 'row') return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, press, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      padding: 12,
      border: 'none',
      borderRadius: 'var(--radius-card)',
      background: c(50),
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      ...tr,
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-tile)',
      background: src ? c(100) : c(500),
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: 38,
      height: 38,
      filter: 'drop-shadow(0 4px 5px oklch(0.3 0.1 285 / 0.25))'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)',
      color: c(800)
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, count, " pros nearby")), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 20,
    color: c(800)
  }));
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, press, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      width: 76,
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...tr,
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-lg)',
      background: c(100),
      color: c(600),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: src ? 'inset 0 1px 0 oklch(1 0 0 / 0.7), inset 0 -6px 12px ' + c(50) : 'none'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: 42,
      height: 42,
      transform: 'rotate(-6deg)',
      filter: 'drop-shadow(0 5px 5px oklch(0.3 0.1 285 / 0.25))'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 28
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-primary)',
      textAlign: 'center'
    }
  }, label));
}
Object.assign(__ds_scope, { CATEGORY_ART, CategoryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/CategoryCard.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/ChatBubble.jsx
try { (() => {
function ChatBubble({
  children,
  mine,
  time,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: mine ? 'flex-end' : 'flex-start',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '10px 14px',
      font: 'var(--type-body)',
      textWrap: 'pretty',
      borderRadius: 20,
      borderBottomRightRadius: mine ? 6 : 20,
      borderBottomLeftRadius: mine ? 20 : 6,
      background: mine ? 'var(--brand)' : 'var(--surface-card)',
      color: mine ? 'var(--text-on-brand)' : 'var(--text-primary)',
      boxShadow: mine ? 'none' : 'var(--shadow-xs)'
    }
  }, children), time && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)',
      padding: '0 6px'
    }
  }, time));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/PromoBanner.jsx
try { (() => {
function PromoBanner({
  eyebrow,
  title,
  cta = 'Book now',
  color = 'violet',
  imageLabel = 'promo image',
  onClick,
  style
}) {
  const bg = color === 'brand' || color === 'violet' ? 'var(--violet-600)' : color === 'dark' ? 'var(--neutral-900)' : 'var(--cat-' + color + '-600)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'flex',
      height: 156,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      background: bg,
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: -40,
      top: -60,
      width: 180,
      height: 180,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.08)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1.25,
      padding: '18px 4px 18px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      opacity: 0.85
    }
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)',
      letterSpacing: 'var(--ls-snug)',
      textWrap: 'balance'
    }
  }, title)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 34,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      background: '#fff',
      color: 'var(--text-primary)',
      font: 'var(--type-body-sm)',
      fontWeight: 700
    }
  }, cta, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ImageSlot, {
    label: imageLabel,
    tone: color === 'violet' || color === 'brand' || color === 'dark' ? 'violet' : color,
    radius: 14
  })));
}
Object.assign(__ds_scope, { PromoBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/PromoBanner.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/ProviderCard.jsx
try { (() => {
function ProviderCard({
  name,
  role,
  rating,
  reviews,
  jobs,
  rate,
  distance,
  verified,
  available,
  onClick,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      gap: 14,
      padding: 14,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    size: 60,
    verified: verified
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, role), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 2,
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      whiteSpace: 'nowrap'
    }
  }, rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviews,
    size: "sm"
  }), jobs != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "briefcase",
    size: 13
  }), jobs, " jobs"), distance && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 13
  }), distance))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, rate && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)'
    }
  }, rate), "/hr"), action || available && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "success",
    size: "sm"
  }, "Today")));
}
Object.assign(__ds_scope, { ProviderCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/ProviderCard.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/SectionHeader.jsx
try { (() => {
function SectionHeader({
  title,
  subtitle,
  action = 'See all',
  onAction,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)',
      letterSpacing: 'var(--ls-snug)',
      color: 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, subtitle)), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      border: 'none',
      background: 'none',
      padding: '4px 0',
      cursor: 'pointer',
      font: 'var(--type-body-sm)',
      fontWeight: 700,
      color: 'var(--brand)'
    }
  }, action, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16
  })));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/marketplace/ServiceCard.jsx
try { (() => {
function ServiceCard({
  title,
  provider,
  rating,
  reviews,
  price,
  unit = '',
  badge,
  imageLabel = 'service photo',
  tone = 'neutral',
  favorite,
  onFavorite,
  onClick,
  width = 240,
  style
}) {
  const [p, setP] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onPointerDown: () => setP(true),
    onPointerUp: () => setP(false),
    onPointerLeave: () => setP(false),
    style: {
      flex: 'none',
      width,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      transform: p ? 'scale(0.98)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: Math.round(width * 0.58)
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ImageSlot, {
    label: imageLabel,
    tone: tone
  }), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "dark",
    size: "sm",
    icon: "zap",
    style: {
      position: 'absolute',
      top: 10,
      left: 10
    }
  }, badge), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "heart",
    variant: "glass",
    size: 34,
    active: favorite,
    onClick: e => {
      e && e.stopPropagation && e.stopPropagation();
      onFavorite && onFavorite();
    },
    style: {
      position: 'absolute',
      top: 8,
      right: 8
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, provider), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviews,
    size: "sm"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)',
      textWrap: 'pretty'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, "From ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--brand)',
      fontWeight: 800,
      fontSize: 16
    }
  }, price), unit)));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketplace/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppBar.jsx
try { (() => {
function AppBar({
  title,
  subtitle,
  onBack,
  actions,
  large,
  transparent,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '8px 16px',
      background: transparent ? 'transparent' : 'oklch(0.985 0.004 285 / 0.86)',
      backdropFilter: transparent ? 'none' : 'var(--blur-bar)',
      WebkitBackdropFilter: transparent ? 'none' : 'var(--blur-bar)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 44
    }
  }, onBack && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-left",
    variant: transparent ? 'glass' : 'surface',
    size: 40,
    onClick: onBack,
    label: "Back"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: large || !onBack ? 'flex-start' : 'center'
    }
  }, !large && title && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), !large && subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      minWidth: onBack && !large ? 40 : 0,
      justifyContent: 'flex-end'
    }
  }, actions)), large && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-primary)',
      padding: '4px 4px 4px'
    }
  }, title));
}
Object.assign(__ds_scope, { AppBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ListItem.jsx
try { (() => {
function ListItem({
  icon,
  color,
  title,
  subtitle,
  trailing,
  chevron = true,
  danger,
  onClick,
  style
}) {
  const tint = color ? 'var(--cat-' + color + '-100)' : 'var(--neutral-100)';
  const ink = danger ? 'var(--danger)' : color ? 'var(--cat-' + color + '-600)' : 'var(--text-primary)';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      minHeight: 56,
      padding: '10px 4px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 40,
      height: 40,
      borderRadius: 12,
      background: danger ? 'var(--danger-tint)' : tint,
      color: ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)',
      color: danger ? 'var(--danger)' : 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, subtitle)), trailing, chevron && !danger && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-tertiary)"
  }));
}
Object.assign(__ds_scope, { ListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ListItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options,
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: 4,
      gap: 4,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-100)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value,
      l = typeof o === 'string' ? o : o.label,
      on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      onClick: () => onChange && onChange(v),
      style: {
        flex: 1,
        height: 38,
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        font: 'var(--type-body-sm)',
        fontWeight: 700,
        background: on ? 'var(--surface-card)' : 'transparent',
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
        boxShadow: on ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--dur-base) var(--ease-out)'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function TabBar({
  items,
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      height: 'var(--tabbar-height)',
      padding: '6px 8px 14px',
      background: 'oklch(1 0 0 / 0.92)',
      backdropFilter: 'var(--blur-bar)',
      WebkitBackdropFilter: 'var(--blur-bar)',
      boxShadow: 'var(--shadow-up)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: on ? 'var(--brand)' : 'var(--text-tertiary)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 30,
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--brand-tint-strong)' : 'transparent',
        transition: 'background var(--dur-base) var(--ease-out)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 22
    }), it.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 0,
        right: 12,
        minWidth: 16,
        height: 16,
        padding: '0 4px',
        borderRadius: 16,
        background: 'var(--accent)',
        color: '#fff',
        font: '700 10px/16px var(--font-sans)',
        boxShadow: '0 0 0 2px #fff'
      }
    }, it.badge)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        fontWeight: on ? 700 : 600
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
function App() {
  const {
    TabBar,
    Toast,
    Icon
  } = window.DS;
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem('servly-kit') || 'null');
    } catch (e) {
      return null;
    }
  })();
  const [onb, setOnb] = React.useState(saved ? saved.onb : true);
  const [tab, setTab] = React.useState(saved ? saved.tab : 'home');
  const [stack, setStack] = React.useState([]);
  const [toastMsg, setToast] = React.useState(null);
  const scroller = React.useRef(null);
  React.useEffect(() => {
    localStorage.setItem('servly-kit', JSON.stringify({
      onb,
      tab
    }));
  }, [onb, tab]);
  React.useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [tab, stack.length]);
  const toast = m => {
    setToast(m);
    clearTimeout(window.__svT);
    window.__svT = setTimeout(() => setToast(null), 2600);
  };
  const go = (screen, arg) => {
    if (screen === 'home' || screen === 'bookings') {
      setStack([]);
      setTab(screen);
      return;
    }
    setStack(s => [...s, {
      screen,
      arg
    }]);
  };
  const back = () => setStack(s => s.slice(0, -1));
  const finish = t => {
    setStack([]);
    setTab(t);
    toast(t === 'bookings' ? 'Booking added to your calendar' : 'Booking confirmed');
  };
  const top = stack[stack.length - 1];
  let body;
  if (onb) body = /*#__PURE__*/React.createElement(Onboarding, {
    onDone: () => setOnb(false)
  });else if (top) {
    if (top.screen === 'category') body = /*#__PURE__*/React.createElement(CategoryList, {
      cat: top.arg,
      go: go,
      back: back
    });
    if (top.screen === 'provider') body = /*#__PURE__*/React.createElement(ProviderProfile, {
      p: top.arg,
      go: go,
      back: back
    });
    if (top.screen === 'booking') body = /*#__PURE__*/React.createElement(Booking, {
      ctx: top.arg,
      back: back,
      finish: finish
    });
    if (top.screen === 'chat') body = /*#__PURE__*/React.createElement(Chat, {
      t: top.arg,
      back: back
    });
  } else {
    body = tab === 'home' ? /*#__PURE__*/React.createElement(Home, {
      go: go
    }) : tab === 'bookings' ? /*#__PURE__*/React.createElement(Bookings, {
      go: go,
      toast: toast
    }) : tab === 'inbox' ? /*#__PURE__*/React.createElement(Inbox, {
      go: go
    }) : /*#__PURE__*/React.createElement(Profile, {
      toast: toast
    });
  }
  const showTabs = !onb && !top;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 54,
      padding: 10,
      background: 'var(--neutral-900)',
      boxShadow: '0 40px 80px -30px oklch(0.3 0.1 290 / 0.45)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: 44,
      overflow: 'hidden',
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      height: 46,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      font: '700 15px/1 var(--font-sans)',
      position: 'relative',
      zIndex: 5,
      color: !onb && !top && tab === 'home' ? '#fff' : 'var(--text-primary)',
      background: !onb && !top && tab === 'home' ? 'var(--brand)' : top && top.screen === 'category' ? 'var(--cat-' + top.arg.color + '-600)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 10,
      transform: 'translateX(-50%)',
      width: 110,
      height: 30,
      borderRadius: 20,
      background: '#000'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "signal",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "wifi",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "battery-full",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    "data-scroll": true,
    style: {
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      position: 'relative'
    }
  }, body), showTabs && /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: t => {
      setTab(t);
      setStack([]);
    },
    items: [{
      id: 'home',
      label: 'Home',
      icon: 'house'
    }, {
      id: 'bookings',
      label: 'Bookings',
      icon: 'calendar-check'
    }, {
      id: 'inbox',
      label: 'Inbox',
      icon: 'message-circle',
      badge: 2
    }, {
      id: 'profile',
      label: 'Profile',
      icon: 'user-round'
    }]
  }), toastMsg && /*#__PURE__*/React.createElement(Toast, {
    message: toastMsg,
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: showTabs ? 86 : 100,
      zIndex: 60
    }
  })));
}
function Stage() {
  const {
    Button
  } = window.DS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(App, null));
}
window.App = App;
window.Stage = Stage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Booking.jsx
try { (() => {
function Booking({
  ctx,
  back,
  finish
}) {
  const {
    AppBar,
    Chip,
    TextField,
    Checkbox,
    Radio,
    Button,
    Avatar,
    Icon,
    Badge
  } = window.DS;
  const [step, setStep] = React.useState(0);
  const [day, setDay] = React.useState(1);
  const [slot, setSlot] = React.useState('10:00');
  const [eco, setEco] = React.useState(true);
  const [pay, setPay] = React.useState('card');
  const days = [['Mon', 11], ['Tue', 12], ['Wed', 13], ['Thu', 14], ['Fri', 15], ['Sat', 16]];
  const slots = ['08:00', '09:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];
  const full = ['09:30', '14:30'];
  const total = ctx.pkg.price + (eco ? 8 : 0);
  const Line = ({
    l,
    v,
    b
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: b ? 'var(--type-title)' : 'var(--type-body)',
      color: b ? 'var(--text-primary)' : 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: b ? 800 : 600
    }
  }, v));
  if (step === 2) return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 28,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 96,
      height: 96,
      borderRadius: 32,
      background: 'var(--success-tint)',
      color: 'var(--success)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'rotate(-6deg)',
      animation: 'sv-rise 400ms var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check",
    size: 48
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, "Booking confirmed"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      maxWidth: 280
    }
  }, ctx.p.name, " will arrive on ", days[day][0], ", ", days[day][1], " Nov at ", slot, ". We have sent the details to your email."), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    style: {
      font: 'var(--type-mono)'
    }
  }, "BK-20481"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    onClick: () => finish('bookings')
  }, "View booking"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    fullWidth: true,
    onClick: () => finish('home')
  }, "Back to home")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    title: step === 0 ? 'Schedule' : 'Review & pay',
    subtitle: 'Step ' + (step + 1) + ' of 2',
    onBack: () => step ? setStep(0) : back()
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '0 20px 8px'
    }
  }, [0, 1].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      height: 4,
      borderRadius: 4,
      background: k <= step ? 'var(--brand)' : 'var(--neutral-200)',
      transition: 'background var(--dur-slow)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '12px 20px 120px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, step === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "November 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 8
    }
  }, days.map(([d, n], k) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    onClick: () => setDay(k),
    style: {
      height: 70,
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      background: k === day ? 'var(--brand)' : 'var(--surface-card)',
      color: k === day ? '#fff' : 'var(--text-primary)',
      boxShadow: k === day ? 'var(--shadow-brand)' : 'inset 0 0 0 1px var(--border-default)',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      opacity: 0.8
    }
  }, d), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)'
    }
  }, n))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Arrival time"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8
    }
  }, slots.map(s => /*#__PURE__*/React.createElement(Chip, {
    key: s,
    size: "sm",
    selected: slot === s,
    onClick: () => !full.includes(s) && setSlot(s),
    style: {
      justifyContent: 'center',
      opacity: full.includes(s) ? 0.4 : 1,
      textDecoration: full.includes(s) ? 'line-through' : 'none'
    }
  }, s)))), /*#__PURE__*/React.createElement(TextField, {
    label: "Address",
    icon: "map-pin",
    defaultValue: "12 Elm Street, Apt 4B"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Notes for your pro",
    multiline: true,
    placeholder: "Door code, pets, parking\u2026"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: eco,
    onChange: setEco,
    label: "Eco-friendly products",
    description: "Plant-based, fragrance-free \xB7 + $8"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      padding: 16,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: ctx.p.name,
    size: 52,
    verified: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)'
    }
  }, ctx.pkg.label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, "with ", ctx.p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 4,
      font: 'var(--type-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 14,
    color: "var(--brand)"
  }), days[day][0], ", ", days[day][1], " Nov"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14,
    color: "var(--brand)"
  }), slot)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Payment method"), /*#__PURE__*/React.createElement(Radio, {
    card: true,
    checked: pay === 'card',
    onChange: () => setPay('card'),
    label: "Visa \u2022\u2022 4242",
    description: "Expires 08/28",
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "credit-card",
      size: 22,
      color: "var(--text-tertiary)"
    })
  }), /*#__PURE__*/React.createElement(Radio, {
    card: true,
    checked: pay === 'wallet',
    onChange: () => setPay('wallet'),
    label: "Servly wallet",
    description: "Balance $24.50",
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "wallet",
      size: 22,
      color: "var(--text-tertiary)"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 16,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement(Line, {
    l: ctx.pkg.label,
    v: '$' + ctx.pkg.price
  }), eco && /*#__PURE__*/React.createElement(Line, {
    l: "Eco-friendly products",
    v: "$8"
  }), /*#__PURE__*/React.createElement(Line, {
    l: "Service fee",
    v: "$0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-default)',
      margin: '4px 0'
    }
  }), /*#__PURE__*/React.createElement(Line, {
    l: "Total",
    v: '$' + total,
    b: true
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 18,
    color: "var(--success)"
  }), "You are only charged after the job is done. Free cancellation up to 24 hours before."))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      padding: '14px 20px 26px',
      background: 'oklch(1 0 0 / 0.94)',
      backdropFilter: 'var(--blur-bar)',
      boxShadow: 'var(--shadow-up)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    iconRight: step === 0 ? 'arrow-right' : undefined,
    onClick: () => setStep(step + 1)
  }, step === 0 ? 'Continue' : 'Confirm & book · $' + total)));
}
window.Booking = Booking;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Booking.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Bookings.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Bookings({
  go,
  toast
}) {
  const {
    AppBar,
    SegmentedControl,
    BookingCard,
    Button,
    EmptyState
  } = window.DS;
  const D = window.SV_DATA;
  const [tab, setTab] = React.useState('Upcoming');
  const list = D.bookings.filter(b => tab === 'Upcoming' ? b.status !== 'done' : b.status === 'done');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    large: true,
    title: "Bookings"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Upcoming', 'Past'],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, list.length === 0 && /*#__PURE__*/React.createElement(EmptyState, {
    title: "Nothing here yet",
    body: "Services you book will show up here.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => go('home')
    }, "Explore services")
  }), list.map(b => /*#__PURE__*/React.createElement(BookingCard, _extends({
    key: b.id
  }, b, {
    actions: b.status === 'done' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      iconLeft: "star",
      style: {
        flex: 1
      }
    }, "Rate"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "rotate-ccw",
      style: {
        flex: 1
      }
    }, "Book again")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      style: {
        flex: 1
      },
      onClick: () => toast('Reschedule request sent')
    }, "Reschedule"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "message-circle",
      style: {
        flex: 1
      },
      onClick: () => go('chat', {
        name: b.provider
      })
    }, "Message"))
  })))));
}
window.Bookings = Bookings;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Bookings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CategoryList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CategoryList({
  cat,
  go,
  back
}) {
  const {
    AppBar,
    IconButton,
    SearchBar,
    Chip,
    ProviderCard,
    ServiceCard,
    BottomSheet,
    Button,
    Checkbox,
    SegmentedControl,
    Icon
  } = window.DS;
  const D = window.SV_DATA;
  const [chip, setChip] = React.useState('Top rated');
  const [sheet, setSheet] = React.useState(false);
  const [f, setF] = React.useState({
    verified: true,
    today: false,
    eco: false
  });
  const c = n => 'var(--cat-' + cat.color + '-' + n + ')';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: c(600),
      color: '#fff',
      padding: '0 0 24px',
      borderRadius: '0 0 28px 28px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -30,
      top: 10,
      width: 170,
      height: 170,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: cat.icon,
    size: 72,
    color: "oklch(1 0 0 / 0.5)"
  })), /*#__PURE__*/React.createElement(AppBar, {
    transparent: true,
    onBack: back,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "heart",
      variant: "glass",
      size: 40
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '4px 20px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, cat.label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      opacity: 0.9
    }
  }, cat.count, " pros near 12 Elm Street")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '18px 20px 0'
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    placeholder: 'Search ' + cat.label.toLowerCase(),
    onFilter: () => setSheet(true)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '16px 20px 4px',
      scrollbarWidth: 'none'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    icon: "sliders-horizontal",
    onClick: () => setSheet(true)
  }, "Filters"), ['Top rated', 'Available today', 'Under $30', 'Verified'].map(x => /*#__PURE__*/React.createElement(Chip, {
    key: x,
    selected: chip === x,
    onClick: () => setChip(x)
  }, x))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, "42 pros match"), D.providers.map(p => /*#__PURE__*/React.createElement(ProviderCard, _extends({
    key: p.id
  }, p, {
    onClick: () => go('provider', p)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 28px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '1 / -1',
      font: 'var(--type-h3)'
    }
  }, "Packages"), D.services.slice(0, 2).map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.id
  }, s, {
    tone: cat.color,
    imageLabel: s.image,
    width: "100%",
    onClick: () => go('provider', D.providers[0])
  })))), /*#__PURE__*/React.createElement(BottomSheet, {
    open: sheet,
    onClose: () => setSheet(false),
    title: "Filters",
    footer: /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      size: "lg",
      onClick: () => setSheet(false)
    }, "Show 42 pros")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)'
    }
  }, "Sort by"), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Rating', 'Price', 'Distance'],
    value: "Rating"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    checked: f.verified,
    onChange: v => setF({
      ...f,
      verified: v
    }),
    label: "Verified pros only",
    description: "ID and background checked"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: f.today,
    onChange: v => setF({
      ...f,
      today: v
    }),
    label: "Available today"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: f.eco,
    onChange: v => setF({
      ...f,
      eco: v
    }),
    label: "Eco-friendly products"
  }))));
}
window.CategoryList = CategoryList;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CategoryList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Chat.jsx
try { (() => {
function Inbox({
  go
}) {
  const {
    AppBar,
    Avatar,
    SearchBar
  } = window.DS;
  const D = window.SV_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    large: true,
    title: "Inbox"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 8px'
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    placeholder: "Search messages",
    elevated: false,
    onFilter: null
  })), D.threads.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    type: "button",
    onClick: () => go('chat', t),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: 52,
    online: t.online
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)'
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: t.unread ? 'var(--brand)' : 'var(--text-tertiary)'
    }
  }, t.time)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: t.unread ? 'var(--text-primary)' : 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t.last), t.unread > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      minWidth: 20,
      height: 20,
      borderRadius: 20,
      background: 'var(--brand)',
      color: '#fff',
      font: '700 11px/20px var(--font-sans)',
      textAlign: 'center'
    }
  }, t.unread))))));
}
function Chat({
  t,
  back
}) {
  const {
    AppBar,
    Avatar,
    IconButton,
    ChatBubble,
    Chip,
    Icon
  } = window.DS;
  const [msgs, setMsgs] = React.useState([{
    m: false,
    t: 'Hi Alex! Confirming Tuesday at 10:00 for the deep clean.',
    time: '9:30'
  }, {
    m: true,
    t: 'Great, thank you. Is it OK if I am not home?',
    time: '9:36'
  }, {
    m: false,
    t: 'Of course. Just leave a key or a door code in the booking notes.',
    time: '9:38'
  }, {
    m: false,
    t: 'See you Tuesday at 10!',
    time: '9:41'
  }]);
  const [v, setV] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.closest('[data-scroll]');
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);
  const send = x => {
    if (!x.trim()) return;
    setMsgs(m => [...m, {
      m: true,
      t: x,
      time: 'now'
    }]);
    setV('');
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 16px',
      background: 'oklch(1 0 0 / 0.92)',
      backdropFilter: 'var(--blur-bar)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    size: 40,
    variant: "plain",
    onClick: back
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: 40,
    online: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)'
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--success)'
    }
  }, "Online")), /*#__PURE__*/React.createElement(IconButton, {
    icon: "phone",
    variant: "tonal",
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: 'var(--cat-teal-100)',
      color: 'var(--cat-teal-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-strong)'
    }
  }, "Deep home cleaning"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)'
    }
  }, "Tue, 12 Nov \xB7 10:00 AM")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-tertiary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'center',
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "Today"), msgs.map((x, k) => /*#__PURE__*/React.createElement(ChatBubble, {
    key: k,
    mine: x.m,
    time: x.time
  }, x.t))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '10px 16px 24px',
      background: 'oklch(1 0 0 / 0.94)',
      backdropFilter: 'var(--blur-bar)',
      boxShadow: 'var(--shadow-up)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }
  }, ['Thanks!', 'Running late?', 'Door code is 4471'].map(q => /*#__PURE__*/React.createElement(Chip, {
    key: q,
    size: "sm",
    onClick: () => send(q)
  }, q))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "plus",
    variant: "tonal",
    size: 44
  }), /*#__PURE__*/React.createElement("input", {
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => e.key === 'Enter' && send(v),
    placeholder: "Message",
    style: {
      flex: 1,
      height: 44,
      padding: '0 16px',
      border: 'none',
      outline: 'none',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-100)',
      font: 'var(--type-body)',
      fontWeight: 500
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "send-horizontal",
    variant: "filled",
    size: 44,
    onClick: () => send(v)
  }))));
}
window.Inbox = Inbox;
window.Chat = Chat;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Chat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Home({
  go
}) {
  const {
    SearchBar,
    Carousel,
    PromoBanner,
    CategoryCard,
    SectionHeader,
    ServiceCard,
    ProviderCard,
    IconButton,
    Icon,
    Button
  } = window.DS;
  const D = window.SV_DATA;
  const [fav, setFav] = React.useState({
    s3: true
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 26,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--brand)',
      color: '#fff',
      padding: '8px 20px 52px',
      borderRadius: '0 0 32px 32px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -60,
      top: -40,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.08)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 40,
      bottom: -70,
      width: 140,
      height: 140,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      opacity: 0.8
    }
  }, "Service address"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--type-title)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16
  }), "12 Elm Street", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16
  }))), /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    variant: "glass",
    dot: true,
    style: {
      background: 'oklch(1 0 0 / 0.16)',
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)',
      marginTop: 22,
      textWrap: 'balance'
    }
  }, "Hi Alex, what needs doing today?")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      padding: '0 20px',
      marginTop: -52
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    onFilter: () => go('category', D.categories[0])
  })), /*#__PURE__*/React.createElement(Carousel, {
    itemWidth: 350,
    dots: true,
    autoplay: 4500
  }, D.promos.map((p, k) => /*#__PURE__*/React.createElement(PromoBanner, {
    key: k,
    eyebrow: p.eyebrow,
    title: p.title,
    color: p.color,
    imageLabel: p.image,
    onClick: () => go('category', D.categories[k === 1 ? 1 : k === 2 ? 3 : 0])
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Categories"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, [D.categories[2], D.categories[5], D.categories[0], D.categories[1]].map(c => /*#__PURE__*/React.createElement(CategoryCard, {
    key: c.id,
    variant: "hero",
    icon: c.icon,
    art: c.id,
    label: c.label,
    subtitle: c.sub,
    color: c.color,
    onClick: () => go('category', c)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      justifyItems: 'center',
      marginTop: 4
    }
  }, [D.categories[3], D.categories[4], D.categories[6], D.categories[7]].map(c => /*#__PURE__*/React.createElement(CategoryCard, {
    key: c.id,
    icon: c.icon,
    art: c.id,
    label: c.label,
    color: c.color,
    onClick: () => go('category', c)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Popular near you",
    subtitle: "Booked 2k+ times this week",
    style: {
      padding: '0 20px'
    }
  }), /*#__PURE__*/React.createElement(Carousel, {
    itemWidth: 232
  }, D.services.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.id
  }, s, {
    imageLabel: s.image,
    width: 232,
    favorite: !!fav[s.id],
    onFavorite: () => setFav(f => ({
      ...f,
      [s.id]: !f[s.id]
    })),
    onClick: () => go('provider', D.providers[0])
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Browse by category",
    style: {
      padding: '0 20px'
    },
    action: null
  }), /*#__PURE__*/React.createElement(Carousel, {
    itemWidth: 150
  }, D.categories.map(c => /*#__PURE__*/React.createElement(CategoryCard, {
    key: c.id,
    variant: "feature",
    icon: c.icon,
    art: c.id,
    label: c.label,
    color: c.color,
    count: c.count,
    onClick: () => go('category', c)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Top-rated pros",
    onAction: () => go('category', D.categories[0])
  }), D.providers.slice(0, 2).map(p => /*#__PURE__*/React.createElement(ProviderCard, _extends({
    key: p.id
  }, p, {
    onClick: () => go('provider', p)
  })))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Onboarding.jsx
try { (() => {
function Onboarding({
  onDone
}) {
  const {
    Button,
    CategoryCard,
    Icon
  } = window.DS;
  const D = window.SV_DATA;
  const [i, setI] = React.useState(0);
  const slides = [{
    title: 'Trusted help for every corner of home',
    body: 'Book vetted cleaners, plumbers, electricians and more in a few taps.'
  }, {
    title: 'Upfront prices, no surprises',
    body: 'See the full price before you book. Pay in the app when the job is done.'
  }, {
    title: 'Chat, track and rate your pro',
    body: 'Message your pro, follow their arrival and leave a review afterwards.'
  }];
  const s = slides[i];
  const pick = [[0, -8], [1, 6], [2, -4], [3, 10], [5, -10], [6, 4]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '800 22px/1 var(--font-sans)',
      letterSpacing: '-0.04em'
    }
  }, "servly", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, ".")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onDone
  }, "Skip")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      padding: '24px 22px',
      alignContent: 'center'
    }
  }, pick.map(([k, r], n) => {
    const c = D.categories[k];
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        transform: 'rotate(' + r + 'deg) translateY(' + (n % 3 === 1 ? 24 : 0) + 'px)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'sv-rise 500ms var(--ease-out) both',
        animationDelay: n * 60 + 'ms'
      }
    }, /*#__PURE__*/React.createElement(CategoryCard, {
      variant: "feature",
      icon: c.icon,
      art: c.id,
      label: c.label,
      color: c.color,
      style: {
        width: '100%',
        height: 128
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 24px 36px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, slides.map((_, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      height: 6,
      width: k === i ? 22 : 6,
      borderRadius: 6,
      background: k === i ? 'var(--brand)' : 'var(--neutral-200)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-display)',
      letterSpacing: 'var(--ls-tight)',
      textWrap: 'balance',
      minHeight: 76
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty',
      minHeight: 44
    }
  }, s.body), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    iconRight: "arrow-right",
    onClick: () => i < 2 ? setI(i + 1) : onDone(),
    style: {
      marginTop: 6
    }
  }, i < 2 ? 'Next' : 'Get started'), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onDone();
    }
  }, "Log in"))));
}
window.Onboarding = Onboarding;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Profile.jsx
try { (() => {
function Profile({
  toast
}) {
  const {
    Avatar,
    Badge,
    ListItem,
    Switch,
    Button,
    Icon
  } = window.DS;
  const [push, setPush] = React.useState(true);
  const Group = ({
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      padding: '0 4px'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 12px',
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, children));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Alex Morgan",
    size: 72
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h2)'
    }
  }, "Alex Morgan"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, "alex.morgan@mail.com")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, "Edit")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 18,
      borderRadius: 'var(--radius-card)',
      background: 'var(--brand)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -30,
      top: -30,
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'oklch(1 0 0 / 0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: 'oklch(1 0 0 / 0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gift",
    size: 24
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-title)'
    }
  }, "Give $10, get $10"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      opacity: 0.9
    }
  }, "Invite friends to their first booking")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20
  })), /*#__PURE__*/React.createElement(Group, {
    title: "Account"
  }, /*#__PURE__*/React.createElement(ListItem, {
    icon: "map-pin",
    color: "coral",
    title: "Saved addresses",
    subtitle: "Home, Office"
  }), /*#__PURE__*/React.createElement(ListItem, {
    icon: "credit-card",
    color: "sky",
    title: "Payment methods",
    subtitle: "Visa \u2022\u2022 4242"
  }), /*#__PURE__*/React.createElement(ListItem, {
    icon: "wallet",
    color: "green",
    title: "Servly wallet",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, "$24.50")
  }), /*#__PURE__*/React.createElement(ListItem, {
    icon: "heart",
    color: "pink",
    title: "Favourite pros",
    subtitle: "6 saved"
  })), /*#__PURE__*/React.createElement(Group, {
    title: "Preferences"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minHeight: 56,
      padding: '10px 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: 'var(--cat-violet-100)',
      color: 'var(--cat-violet-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 20
  })), /*#__PURE__*/React.createElement(Switch, {
    checked: push,
    onChange: v => {
      setPush(v);
      toast(v ? 'Notifications on' : 'Notifications off');
    },
    label: "Push notifications",
    style: {
      flex: 1
    }
  })), /*#__PURE__*/React.createElement(ListItem, {
    icon: "globe",
    color: "indigo",
    title: "Language",
    subtitle: "English"
  }), /*#__PURE__*/React.createElement(ListItem, {
    icon: "circle-help",
    color: "amber",
    title: "Help centre"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 12px',
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement(ListItem, {
    icon: "log-out",
    title: "Log out",
    danger: true
  })));
}
window.Profile = Profile;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ProviderProfile.jsx
try { (() => {
function ProviderProfile({
  p,
  go,
  back
}) {
  const {
    AppBar,
    IconButton,
    Avatar,
    Badge,
    Rating,
    SegmentedControl,
    Radio,
    Button,
    ImageSlot,
    Icon
  } = window.DS;
  const D = window.SV_DATA;
  const [tab, setTab] = React.useState('Services');
  const [pkg, setPkg] = React.useState('deep');
  const [fav, setFav] = React.useState(false);
  const price = D.packages.find(x => x.id === pkg).price;
  const Stat = ({
    v,
    l
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3)'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)'
    }
  }, l));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 230
    }
  }, /*#__PURE__*/React.createElement(ImageSlot, {
    label: "provider at work",
    tone: "teal"
  }), /*#__PURE__*/React.createElement(AppBar, {
    transparent: true,
    onBack: back,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "share-2",
      variant: "glass",
      size: 40
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "heart",
      variant: "glass",
      size: 40,
      active: fav,
      onClick: () => setFav(!fav)
    })),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: -28,
      borderRadius: '28px 28px 0 0',
      background: 'var(--bg-app)',
      padding: '0 20px 120px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 14,
      marginTop: -36
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    size: 84,
    verified: true,
    style: {
      borderRadius: '50%',
      boxShadow: '0 0 0 4px var(--bg-app)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 4,
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    size: "sm"
  }, "Available today"), /*#__PURE__*/React.createElement(Badge, {
    size: "sm",
    icon: "shield-check"
  }, "Verified"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, p.role, " \xB7 ", p.distance)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '14px 0',
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    v: '★ ' + p.rating,
    l: p.reviews + ' reviews'
  }), /*#__PURE__*/React.createElement(Stat, {
    v: p.jobs,
    l: "jobs done"
  }), /*#__PURE__*/React.createElement(Stat, {
    v: "6 yrs",
    l: "experience"
  }), /*#__PURE__*/React.createElement(Stat, {
    v: "15 min",
    l: "reply time"
  })), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['Services', 'About', 'Reviews'],
    value: tab,
    onChange: setTab
  }), tab === 'Services' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, D.packages.map(x => /*#__PURE__*/React.createElement(Radio, {
    key: x.id,
    card: true,
    checked: pkg === x.id,
    onChange: () => setPkg(x.id),
    label: x.label,
    description: x.desc,
    trailing: /*#__PURE__*/React.createElement("b", {
      style: {
        font: 'var(--type-title)'
      }
    }, '$' + x.price)
  }))), tab === 'About' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textWrap: 'pretty'
    }
  }, "I have been cleaning homes across the city for six years. I bring my own supplies, including eco-friendly options, and I am happy to work around pets."), [['languages', 'English, Mandarin'], ['badge-check', 'ID & background checked'], ['leaf', 'Eco products available']].map(([i, t]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'var(--text-primary)',
      font: 'var(--type-body-strong)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: i,
    size: 18,
    color: "var(--brand)"
  }), t))), tab === 'Reviews' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, D.reviews.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      padding: 16,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--type-body-strong)'
    }
  }, r.name), /*#__PURE__*/React.createElement(Rating, {
    value: r.rating,
    size: "sm"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, r.text), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)'
    }
  }, r.when))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 20px 26px',
      background: 'oklch(1 0 0 / 0.94)',
      backdropFilter: 'var(--blur-bar)',
      boxShadow: 'var(--shadow-up)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      fontWeight: 500,
      color: 'var(--text-tertiary)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h2)'
    }
  }, '$' + price)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "message-circle",
    variant: "tonal",
    size: 54,
    onClick: () => go('chat', {
      name: p.name
    })
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      flex: 1
    },
    onClick: () => go('booking', {
      p,
      pkg: D.packages.find(x => x.id === pkg)
    })
  }, "Book now")));
}
window.ProviderProfile = ProviderProfile;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ProviderProfile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
window.SV_DATA = {
  categories: [{
    id: 'cleaning',
    sub: 'Spotless homes',
    label: 'Cleaning',
    icon: 'sparkles',
    color: 'teal',
    count: 214
  }, {
    id: 'plumbing',
    sub: 'Leaks & fittings',
    label: 'Plumbing',
    icon: 'wrench',
    color: 'sky',
    count: 128
  }, {
    id: 'electrical',
    sub: 'Wiring & lights',
    label: 'Electrical',
    icon: 'zap',
    color: 'amber',
    count: 97
  }, {
    id: 'beauty',
    sub: 'Salon at home',
    label: 'Beauty',
    icon: 'scissors',
    color: 'pink',
    count: 96
  }, {
    id: 'moving',
    sub: 'Pack & move',
    label: 'Moving',
    icon: 'truck',
    color: 'indigo',
    count: 54
  }, {
    id: 'repairs',
    sub: 'Fix anything',
    label: 'Repairs',
    icon: 'hammer',
    color: 'coral',
    count: 143
  }, {
    id: 'pets',
    sub: 'Walks & sitting',
    label: 'Pet care',
    icon: 'paw-print',
    color: 'green',
    count: 72
  }, {
    id: 'tutoring',
    sub: 'Learn faster',
    label: 'Tutoring',
    icon: 'graduation-cap',
    color: 'violet',
    count: 61
  }],
  promos: [{
    eyebrow: 'This week',
    title: '20% off your first deep clean',
    color: 'violet',
    image: 'sunlit living room'
  }, {
    eyebrow: 'Same day',
    title: 'Leaky tap? Plumbers in 2 hrs',
    color: 'sky',
    image: 'plumber at sink'
  }, {
    eyebrow: 'New',
    title: 'At-home spa, from $35',
    color: 'pink',
    image: 'manicure close-up'
  }],
  services: [{
    id: 's1',
    title: 'Deep home cleaning',
    provider: 'SparkleCo',
    rating: 4.9,
    reviews: 820,
    price: '$79',
    badge: 'Instant book',
    tone: 'teal',
    image: 'cleaner at work'
  }, {
    id: 's2',
    title: 'Tap & leak repair',
    provider: 'Daniel Okafor',
    rating: 4.8,
    reviews: 312,
    price: '$45',
    tone: 'sky',
    image: 'kitchen tap'
  }, {
    id: 's3',
    title: 'Gel manicure at home',
    provider: 'Nail Studio Go',
    rating: 4.9,
    reviews: 1240,
    price: '$35',
    badge: 'Popular',
    tone: 'pink',
    image: 'manicure'
  }, {
    id: 's4',
    title: 'Furniture assembly',
    provider: 'FixRight',
    rating: 4.7,
    reviews: 208,
    price: '$30',
    unit: '/hr',
    tone: 'coral',
    image: 'flat-pack assembly'
  }],
  providers: [{
    id: 'p1',
    name: 'Maya Chen',
    role: 'Home cleaning · 6 yrs',
    rating: 4.9,
    reviews: 820,
    jobs: 1320,
    rate: '$28',
    distance: '1.2 km',
    verified: true,
    available: true
  }, {
    id: 'p2',
    name: 'Lucas Ferreira',
    role: 'Deep & move-out cleans',
    rating: 4.8,
    reviews: 412,
    jobs: 690,
    rate: '$26',
    distance: '2.0 km',
    verified: true
  }, {
    id: 'p3',
    name: 'Aisha Rahman',
    role: 'Eco cleaning specialist',
    rating: 4.9,
    reviews: 233,
    jobs: 380,
    rate: '$32',
    distance: '3.4 km',
    available: true
  }, {
    id: 'p4',
    name: 'Tom Becker',
    role: 'Office & window cleaning',
    rating: 4.6,
    reviews: 151,
    jobs: 240,
    rate: '$24',
    distance: '4.1 km'
  }],
  packages: [{
    id: 'std',
    label: 'Standard clean',
    desc: '3 hrs · kitchen, bath, floors',
    price: 89
  }, {
    id: 'deep',
    label: 'Deep clean',
    desc: '5 hrs · inside cabinets, oven, windows',
    price: 149
  }, {
    id: 'move',
    label: 'Move-out clean',
    desc: '6 hrs · empty home, deposit-ready',
    price: 189
  }],
  reviews: [{
    name: 'Priya S.',
    rating: 5,
    when: '2 days ago',
    text: 'Maya was on time, thorough and left the kitchen spotless. Booking again next month.'
  }, {
    name: 'James W.',
    rating: 5,
    when: '1 week ago',
    text: 'Great communication through the app. She even sorted out the balcony without being asked.'
  }],
  bookings: [{
    id: 'b1',
    service: 'Deep home cleaning',
    provider: 'Maya Chen',
    date: 'Tue, 12 Nov',
    time: '10:00 AM',
    price: '$149',
    status: 'upcoming',
    icon: 'sparkles',
    color: 'teal'
  }, {
    id: 'b2',
    service: 'Socket replacement',
    provider: 'Ravi Patel',
    date: 'Fri, 15 Nov',
    time: '2:30 PM',
    price: '$60',
    status: 'upcoming',
    icon: 'zap',
    color: 'amber'
  }, {
    id: 'b3',
    service: 'Tap & leak repair',
    provider: 'Daniel Okafor',
    date: 'Mon, 28 Oct',
    time: '9:00 AM',
    price: '$45',
    status: 'done',
    icon: 'wrench',
    color: 'sky'
  }, {
    id: 'b4',
    service: 'Dog walking · 5 days',
    provider: 'Emma Novak',
    date: 'Mon, 14 Oct',
    time: '8:00 AM',
    price: '$75',
    status: 'done',
    icon: 'paw-print',
    color: 'green'
  }],
  threads: [{
    id: 't1',
    name: 'Maya Chen',
    last: 'See you Tuesday at 10!',
    time: '9:41',
    unread: 2,
    online: true
  }, {
    id: 't2',
    name: 'Ravi Patel',
    last: 'I will bring the replacement socket.',
    time: 'Yesterday',
    unread: 0
  }, {
    id: 't3',
    name: 'Daniel Okafor',
    last: 'Thanks for the 5 stars!',
    time: 'Mon',
    unread: 0
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ImageSlot = __ds_scope.ImageSlot;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.BookingCard = __ds_scope.BookingCard;

__ds_ns.Carousel = __ds_scope.Carousel;

__ds_ns.CATEGORY_ART = __ds_scope.CATEGORY_ART;

__ds_ns.CategoryCard = __ds_scope.CategoryCard;

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.PromoBanner = __ds_scope.PromoBanner;

__ds_ns.ProviderCard = __ds_scope.ProviderCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.AppBar = __ds_scope.AppBar;

__ds_ns.ListItem = __ds_scope.ListItem;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
