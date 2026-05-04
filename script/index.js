var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
define("resource/lang/en", [], {
    "lang-label": "English",
    "lang-direction": "ltr",
    "lang-colon-suffix": ":",
    "Auto": "Auto",
    "Settings": "Settings",
    "Language": "Language",
    "Theme": "Theme",
    "Number format": "Number format",
    "Thousands separator": "Thousands separator",
    "Exponential notation": "Exponential notation",
    "Adjust exponent to multiple of 3": "Adjust exponent to multiple of 3",
    "Help": "Help"
});
define("resource/lang/ja", [], {
    "lang-label": "日本語",
    "lang-direction": "ltr",
    "lang-colon-suffix": "：",
    "Auto": "自動",
    "Settings": "設定",
    "Language": "言語",
    "Theme": "テーマ",
    "Number format": "数値表現",
    "Thousands separator": "３桁区切り記号",
    "Exponential notation": "指数表記",
    "Adjust exponent to multiple of 3": "指数を3の倍数に調整",
    "Help": "ヘルプ"
});
define("script/locale", ["require", "exports", "resource/lang/en", "resource/lang/ja"], function (require, exports, en_json_1, ja_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLocaleList = exports.resolve = exports.map = exports.getColonSuffix = exports.toRtl = exports.isLtr = exports.isRtl = exports.getDirection = exports.setLocale = exports.getLocale = exports.lookupValue = exports.master = void 0;
    en_json_1 = __importDefault(en_json_1);
    ja_json_1 = __importDefault(ja_json_1);
    exports.master = {
        en: en_json_1.default,
        ja: ja_json_1.default
    };
    const supportedLangs = Object.keys(exports.master);
    const getSegments = (text, separator, segments) => text.split(separator).slice(0, segments).join(separator);
    const lookupValue = (list, value) => list.includes(value) ? value : undefined;
    exports.lookupValue = lookupValue;
    const getMatchLang = (lang, canonicalLangs = supportedLangs) => {
        var _a;
        return (_a = (0, exports.lookupValue)(canonicalLangs, getSegments(lang, "-", 2))) !== null && _a !== void 0 ? _a : (0, exports.lookupValue)(canonicalLangs, getSegments(lang, "-", 1));
    };
    const getDefaultLang = () => {
        var _a, _b;
        return (_b = (_a = getMatchLang(navigator.language.toLowerCase())) !== null && _a !== void 0 ? _a : navigator.languages.map(i => getMatchLang(i.toLowerCase())).filter(i => i !== undefined)[0]) !== null && _b !== void 0 ? _b : "en";
    };
    let lang = getDefaultLang();
    const getLocale = () => lang;
    exports.getLocale = getLocale;
    const setLocale = (locale, urlLocale) => {
        var _a;
        switch (locale) {
            case undefined:
            case "Auto":
                if (urlLocale) {
                    lang = (_a = getMatchLang(urlLocale)) !== null && _a !== void 0 ? _a : getDefaultLang();
                }
                else {
                    lang = getDefaultLang();
                }
                break;
            default:
                lang = locale;
                break;
        }
    };
    exports.setLocale = setLocale;
    const getDirection = (l) => exports.master[l !== null && l !== void 0 ? l : lang]["lang-direction"];
    exports.getDirection = getDirection;
    const isRtl = (l) => "rtl" === (0, exports.getDirection)(l);
    exports.isRtl = isRtl;
    const isLtr = (l) => "ltr" === (0, exports.getDirection)(l);
    exports.isLtr = isLtr;
    const toRtl = (text, f) => false === f ? text : `\u202B${text}\u202C`;
    exports.toRtl = toRtl;
    const getColonSuffix = (l) => { var _a; return ((_a = exports.master[l !== null && l !== void 0 ? l : lang]["lang-colon-suffix"]) !== null && _a !== void 0 ? _a : ":"); };
    exports.getColonSuffix = getColonSuffix;
    const map = (key, l) => "" === key ? "" : exports.master[l !== null && l !== void 0 ? l : lang][key];
    exports.map = map;
    const resolve = (table, l) => {
        var _a, _b;
        return "string" === typeof table || (!table) ?
            table :
            (_b = table[(_a = getMatchLang(l !== null && l !== void 0 ? l : lang, Object.keys(table))) !== null && _a !== void 0 ? _a : "en"]) !== null && _b !== void 0 ? _b : table["en"];
    };
    exports.resolve = resolve;
    const getLocaleList = () => ["Auto", ...supportedLangs];
    exports.getLocaleList = getLocaleList;
});
define("script/url", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reloadParameters = exports.initialize = exports.get = exports.addParameter = exports.make = exports.parseParameter = void 0;
    const parseParameter = (url) => {
        const result = {};
        const urlObj = new URL(url.replace(/#/g, "?"));
        const params = urlObj.searchParams;
        params.forEach((value, key) => result[key] = value);
        return result;
    };
    exports.parseParameter = parseParameter;
    const make = () => {
        const url = new URL(window.location.href.replace(/#/g, "?"));
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
        return url.toString().replace(/\?/g, "#");
    };
    exports.make = make;
    const addParameter = (key, value) => {
        params[key] = value;
        pushUrl();
        return params;
    };
    exports.addParameter = addParameter;
    const get = (key) => params[key];
    exports.get = get;
    const pushUrl = () => window.history.replaceState({}, "", (0, exports.make)());
    const initialize = () => {
    };
    exports.initialize = initialize;
    let params = (0, exports.parseParameter)(window.location.href);
    const reloadParameters = () => params = (0, exports.parseParameter)(window.location.href);
    exports.reloadParameters = reloadParameters;
});
define("script/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTickValue = exports.getExValueNumber = exports.getViewScale = exports.viewModeList = exports.isThemeTable = exports.getNext = exports.phi = exports.isNamedNumber = exports.namedNumberList = void 0;
    exports.namedNumberList = ["phi", "e", "pi"];
    const isNamedNumber = (value) => exports.namedNumberList.includes(value);
    exports.isNamedNumber = isNamedNumber;
    exports.phi = (1 + Math.sqrt(5)) / 2;
    // phi approximately 1.618033988749895
    // e approximately 2.718281828459045
    // pi approximately 3.141592653589793
    const getNext = (list, current, isReverse) => {
        const currentIndex = list.indexOf(current);
        if (0 <= currentIndex) {
            const nextIndex = (currentIndex + (isReverse ? -1 : 1) + list.length) % list.length;
            return list[nextIndex];
        }
        else {
            throw new Error(`🦋 FIXME: getNext: current value not found in list`);
        }
    };
    exports.getNext = getNext;
    const isThemeTable = (table) => "object" === typeof table && null !== table && "light" in table && "dark" in table;
    exports.isThemeTable = isThemeTable;
    exports.viewModeList = ["ruler", "grid", "graph"];
    const getViewScale = (view) => Math.pow(10, view.viewScaleExponent);
    exports.getViewScale = getViewScale;
    const getExValueNumber = (exValue) => "number" === typeof exValue ? exValue : exValue.value;
    exports.getExValueNumber = getExValueNumber;
    const getTickValue = (tick) => (0, exports.getExValueNumber)(tick.value);
    exports.getTickValue = getTickValue;
});
define("script/element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSelector = exports.setAttributes = exports.setStyles = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.removeEvents = exports.addEvents = void 0;
    const addEvents = (element, events) => {
        for (const [event, listener] of Object.entries(events)) {
            if ("listener" in listener) {
                element.addEventListener(event, listener.listener, listener.options);
            }
            else {
                element.addEventListener(event, listener);
            }
        }
        return element;
    };
    exports.addEvents = addEvents;
    const removeEvents = (element, events) => {
        for (const [event, listener] of Object.entries(events)) {
            if ("listener" in listener) {
                element.removeEventListener(event, listener.listener, listener.options);
            }
            else {
                element.removeEventListener(event, listener);
            }
        }
        return element;
    };
    exports.removeEvents = removeEvents;
    const setTextContent = (element, text) => {
        if (element.textContent !== text) {
            element.textContent = text;
            return true;
        }
        return false;
    };
    exports.setTextContent = setTextContent;
    const setAttribute = (element, name, value) => {
        var _a;
        if (((_a = element.getAttribute(name)) !== null && _a !== void 0 ? _a : "") !== (value !== null && value !== void 0 ? value : "")) {
            if (undefined === value || null === value) {
                element.removeAttribute(name);
            }
            else {
                element.setAttribute(name, value);
            }
            return true;
        }
        return false;
    };
    exports.setAttribute = setAttribute;
    const setStyle = (element, name, value) => {
        var _a;
        if (((_a = element.style.getPropertyValue(name)) !== null && _a !== void 0 ? _a : "") !== (value !== null && value !== void 0 ? value : "")) {
            if (undefined === value || null === value || "" === value) {
                element.style.removeProperty(name);
            }
            else {
                element.style.setProperty(name, value);
            }
            return true;
        }
        return false;
    };
    exports.setStyle = setStyle;
    const setStyles = (element, styles) => {
        let changed = false;
        for (const [name, value] of Object.entries(styles)) {
            changed || (changed = (0, exports.setStyle)(element, name, value));
        }
        return changed;
    };
    exports.setStyles = setStyles;
    const setAttributes = (element, attributes) => {
        for (const [key, value] of Object.entries(attributes)) {
            switch (key) {
                case "tag":
                case "children":
                    // Ignore
                    break;
                case "textContent":
                    (0, exports.setTextContent)(element, (value !== null && value !== void 0 ? value : "").toString());
                    break;
                case "events":
                    (0, exports.addEvents)(element, value);
                    break;
                case "style":
                    if ("string" === typeof value || undefined === value || null === value) {
                        (0, exports.setAttribute)(element, key, undefined === value ? value : value.toString());
                    }
                    else {
                        (0, exports.setStyles)(element, value);
                    }
                    break;
                default:
                    (0, exports.setAttribute)(element, key, undefined === value ? value : value.toString());
                    break;
            }
        }
        return element;
    };
    exports.setAttributes = setAttributes;
    const makeSelector = (source) => {
        let selector = "";
        if ("tag" in source) {
            selector += source.tag;
        }
        if ("id" in source) {
            selector += `#${source.id}`;
        }
        if ("class" in source) {
            selector += `${source.class}`
                .split(/\s+/)
                .filter(Boolean)
                .map(c => `.${c}`)
                .join("");
        }
        for (const [key, value] of Object.entries(source)) {
            switch (key) {
                case "tag":
                case "id":
                case "class":
                case "style":
                case "textContent":
                case "events":
                case "children":
                    // Ignore
                    break;
                default:
                    selector += `[${key}="${value}"]`;
                    break;
            }
        }
        return selector;
    };
    exports.makeSelector = makeSelector;
});
define("script/html", ["require", "exports", "script/element"], function (require, exports, ELEMENT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSure = exports.make = exports.makeElement = exports.getElementById = exports.makeSelector = exports.setAttributes = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.removeEvents = exports.addEvents = void 0;
    ELEMENT = __importStar(ELEMENT);
    exports.addEvents = ELEMENT.addEvents;
    exports.removeEvents = ELEMENT.removeEvents;
    exports.setTextContent = ELEMENT.setTextContent;
    exports.setAttribute = ELEMENT.setAttribute;
    exports.setStyle = ELEMENT.setStyle;
    exports.setAttributes = ELEMENT.setAttributes;
    exports.makeSelector = ELEMENT.makeSelector;
    const getElementById = (tag, id) => {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`🦋 FIXME: HTMLElement not found: ${id}`);
        }
        if (tag !== element.tagName.toLowerCase()) {
            throw new Error(`🦋 FIXME: HTMLElement is not <${tag}>: ${id}`);
        }
        return element;
    };
    exports.getElementById = getElementById;
    const makeElement = (tag) => document.createElement(tag);
    exports.makeElement = makeElement;
    const make = (source) => {
        const result = (0, exports.makeElement)(source.tag);
        (0, exports.setAttributes)(result, source);
        if (source.children) {
            for (const child of source.children) {
                if (child instanceof Node) {
                    result.appendChild(child);
                }
                else {
                    result.appendChild((0, exports.make)(child));
                }
            }
        }
        return result;
    };
    exports.make = make;
    const makeSure = (parent, source, attributes) => {
        var _a;
        const result = (_a = parent.querySelector((0, exports.makeSelector)(source))) !== null && _a !== void 0 ? _a : parent.appendChild((0, exports.make)(source));
        if (undefined !== attributes) {
            (0, exports.setAttributes)(result, attributes);
        }
        return result;
    };
    exports.makeSure = makeSure;
});
define("script/svg", ["require", "exports", "script/element"], function (require, exports, ELEMENT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSure = exports.make = exports.makeElement = exports.getElementById = exports.makeSelector = exports.setAttributes = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.removeEvents = exports.addEvents = void 0;
    ELEMENT = __importStar(ELEMENT);
    exports.addEvents = ELEMENT.addEvents;
    exports.removeEvents = ELEMENT.removeEvents;
    exports.setTextContent = ELEMENT.setTextContent;
    exports.setAttribute = ELEMENT.setAttribute;
    exports.setStyle = ELEMENT.setStyle;
    exports.setAttributes = ELEMENT.setAttributes;
    exports.makeSelector = ELEMENT.makeSelector;
    const getElementById = (tag, id) => {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`🦋 FIXME: SVGElement not found: ${id}`);
        }
        if (tag !== element.tagName.toLowerCase()) {
            throw new Error(`🦋 FIXME: SVGElement is not <${tag}>: ${id}`);
        }
        return element;
    };
    exports.getElementById = getElementById;
    const makeElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);
    exports.makeElement = makeElement;
    const make = (source) => {
        const result = (0, exports.makeElement)(source.tag);
        (0, exports.setAttributes)(result, source);
        if (source.children) {
            for (const child of source.children) {
                if (child instanceof Node) {
                    result.appendChild(child);
                }
                else {
                    result.appendChild((0, exports.make)(child));
                }
            }
        }
        return result;
    };
    exports.make = make;
    const makeSure = (parent, source, attributes) => {
        var _a;
        const result = (_a = parent.querySelector((0, exports.makeSelector)(source))) !== null && _a !== void 0 ? _a : parent.appendChild((0, exports.make)(source));
        if (undefined !== attributes) {
            (0, exports.setAttributes)(result, attributes);
        }
        return result;
    };
    exports.makeSure = makeSure;
});
define("script/ui", ["require", "exports", "script/locale", "script/html", "script/svg"], function (require, exports, Locale, HTML, SVG) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.updateLanguage = exports.ControlPanel = exports.SettingsPanel = exports.saveImageButton = exports.rulerHelpPanel = exports.addHistoryLaneButton = exports.addEmwEnergyLaneButton = exports.addEmwFrequencyLaneButton = exports.addEmwWavelengthLaneButton = exports.addSoundFrequencyLaneButton = exports.addCountingLaneButton = exports.addTemperatureLaneButton = exports.addEnergyLaneButton = exports.addSpeedLaneButton = exports.addTimeLaneButton = exports.addMassLaneButton = exports.addVolumeLaneButton = exports.addAreaLaneButton = exports.addSizeLaneButton = exports.addPrimeDecompositionLaneButton = exports.addPrimeNumbersLaneButton = exports.add2nLaneButton = exports.addCotangentLaneButton = exports.addTangentLaneButton = exports.addCosineLaneButton = exports.addSineLaneButton = exports.addCubeRootLaneButton = exports.addSquareRootLaneButton = exports.addCubedLaneButton = exports.addSquaredLaneButton = exports.addInvertLaneButton = exports.addJaDigitLaneButton = exports.addEnDigitLaneButton = exports.addSiDigitLaneButton = exports.addSlideButton = exports.rulerNewSlidePanel = exports.graphView = exports.gridView = exports.rulerOverlay = exports.rulerSvg = exports.rulerView = exports.viewList = exports.updateRoundBar = exports.setAriaHidden = void 0;
    Locale = __importStar(Locale);
    HTML = __importStar(HTML);
    SVG = __importStar(SVG);
    // import * as Control from "./control";
    const setAriaHidden = (element, hidden) => {
        const attributeKey = "aria-hidden";
        if (hidden) {
            const attribute = document.createAttribute(attributeKey);
            attribute.value = "true";
            element.attributes.setNamedItem(attribute);
        }
        else {
            if (element.attributes.getNamedItem(attributeKey)) {
                element.attributes.removeNamedItem(attributeKey);
            }
        }
    };
    exports.setAriaHidden = setAriaHidden;
    const updateRoundBar = (button, properties) => {
        // console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        if (typeof properties === "boolean") {
            HTML.setStyle(button, "--low", "0");
            HTML.setStyle(button, "--high", properties ? "1" : "0");
            HTML.setStyle(button, "--rotate", "0");
        }
        else {
            HTML.setStyle(button, "--low", properties.low.toFixed(3));
            HTML.setStyle(button, "--high", properties.high.toFixed(3));
            HTML.setStyle(button, "--rotate", properties.rotate.toFixed(3));
        }
    };
    exports.updateRoundBar = updateRoundBar;
    exports.viewList = HTML.getElementById("div", "view-list");
    exports.rulerView = HTML.getElementById("div", "ruler-view");
    exports.rulerSvg = SVG.getElementById("svg", "ruler-svg");
    exports.rulerOverlay = SVG.getElementById("svg", "ruler-overlay-svg");
    exports.gridView = HTML.getElementById("div", "grid-view");
    exports.graphView = HTML.getElementById("div", "graph-view");
    exports.rulerNewSlidePanel = HTML.getElementById("div", "ruler-new-slide-panel");
    exports.addSlideButton = HTML.getElementById("button", "add-slide-button");
    //export const addLaneButton = HTML.getElementById("button", "add-lane-button");
    exports.addSiDigitLaneButton = HTML.getElementById("button", "add-si-digit-lane-button");
    exports.addEnDigitLaneButton = HTML.getElementById("button", "add-en-digit-lane-button");
    exports.addJaDigitLaneButton = HTML.getElementById("button", "add-ja-digit-lane-button");
    exports.addInvertLaneButton = HTML.getElementById("button", "add-invert-lane-button");
    exports.addSquaredLaneButton = HTML.getElementById("button", "add-squared-lane-button");
    exports.addCubedLaneButton = HTML.getElementById("button", "add-cubed-lane-button");
    exports.addSquareRootLaneButton = HTML.getElementById("button", "add-square-root-lane-button");
    exports.addCubeRootLaneButton = HTML.getElementById("button", "add-cube-root-lane-button");
    exports.addSineLaneButton = HTML.getElementById("button", "add-sine-lane-button");
    exports.addCosineLaneButton = HTML.getElementById("button", "add-cosine-lane-button");
    exports.addTangentLaneButton = HTML.getElementById("button", "add-tangent-lane-button");
    exports.addCotangentLaneButton = HTML.getElementById("button", "add-cotangent-lane-button");
    exports.add2nLaneButton = HTML.getElementById("button", "add-2n-lane-button");
    exports.addPrimeNumbersLaneButton = HTML.getElementById("button", "add-prime-numbers-lane-button");
    exports.addPrimeDecompositionLaneButton = HTML.getElementById("button", "add-prime-decomposition-lane-button");
    exports.addSizeLaneButton = HTML.getElementById("button", "add-size-lane-button");
    exports.addAreaLaneButton = HTML.getElementById("button", "add-area-lane-button");
    exports.addVolumeLaneButton = HTML.getElementById("button", "add-volume-lane-button");
    exports.addMassLaneButton = HTML.getElementById("button", "add-mass-lane-button");
    exports.addTimeLaneButton = HTML.getElementById("button", "add-time-lane-button");
    exports.addSpeedLaneButton = HTML.getElementById("button", "add-speed-lane-button");
    exports.addEnergyLaneButton = HTML.getElementById("button", "add-energy-lane-button");
    exports.addTemperatureLaneButton = HTML.getElementById("button", "add-temperature-lane-button");
    exports.addCountingLaneButton = HTML.getElementById("button", "add-counting-lane-button");
    exports.addSoundFrequencyLaneButton = HTML.getElementById("button", "add-sound-frequency-lane-button");
    exports.addEmwWavelengthLaneButton = HTML.getElementById("button", "add-emw-wavelength-lane-button");
    exports.addEmwFrequencyLaneButton = HTML.getElementById("button", "add-emw-frequency-lane-button");
    exports.addEmwEnergyLaneButton = HTML.getElementById("button", "add-emw-energy-lane-button");
    exports.addHistoryLaneButton = HTML.getElementById("button", "add-history-lane-button");
    exports.rulerHelpPanel = HTML.getElementById("div", "ruler-help-panel");
    exports.saveImageButton = HTML.getElementById("button", "save-image-button");
    var SettingsPanel;
    (function (SettingsPanel) {
        SettingsPanel.languageSelect = HTML.getElementById("select", "language-select");
        SettingsPanel.themeSelect = HTML.getElementById("select", "theme-select");
        SettingsPanel.threeDigitSeparatorSelect = HTML.getElementById("select", "three-digit-separator-select");
        SettingsPanel.exponentFormatSelect = HTML.getElementById("select", "exponent-format-select");
        SettingsPanel.exponentMultipleOfThreeCheckbox = HTML.getElementById("input", "exponent-multiple-of-three-checkbox");
        SettingsPanel.numberFormatSelect = HTML.getElementById("select", "number-format-select");
    })(SettingsPanel || (exports.SettingsPanel = SettingsPanel = {}));
    var ControlPanel;
    (function (ControlPanel) {
        ControlPanel.element = HTML.getElementById("div", "control-panel");
        ControlPanel.viewModeButton = HTML.getElementById("button", "view-mode-button");
        ControlPanel.viewScaleButton = HTML.getElementById("button", "view-scale-button");
        ControlPanel.viewScalePanel = HTML.getElementById("div", "view-scale-panel");
        ControlPanel.viewScaleRange = HTML.getElementById("input", "view-scale-range");
        ControlPanel.viewLockButton = HTML.getElementById("button", "view-lock-button");
    })(ControlPanel || (exports.ControlPanel = ControlPanel = {}));
    const updateLanguage = () => {
        document.querySelectorAll("span[data-lang-key]").forEach((element) => {
            const key = element.getAttribute("data-lang-key");
            if (key) {
                element.textContent = Locale.map(key);
            }
        });
    };
    exports.updateLanguage = updateLanguage;
    const initialize = () => {
        SettingsPanel.languageSelect.innerHTML = "";
        for (const language of Locale.getLocaleList()) {
            const option = document.createElement("option");
            option.value = language;
            option.textContent = "Auto" === language ?
                Locale.map("Auto") :
                `${language}${Locale.getColonSuffix()} ${Locale.toRtl(Locale.map("lang-label", language), Locale.isRtl() && Locale.isLtr(language))}`;
            SettingsPanel.languageSelect.appendChild(option);
        }
        ;
    };
    exports.initialize = initialize;
});
define("script/settings", ["require", "exports", "script/ui"], function (require, exports, UI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNumberFormat = exports.getExponentMultipleOfThree = exports.getExponentFormat = exports.getThreeDigitSeparator = exports.getTheme = void 0;
    UI = __importStar(UI);
    // export const getLanguage = (): string => UI.SettingsPanel.languageSelect.value;
    const getTheme = () => UI.SettingsPanel.themeSelect.value;
    exports.getTheme = getTheme;
    const getThreeDigitSeparator = () => UI.SettingsPanel.threeDigitSeparatorSelect.value;
    exports.getThreeDigitSeparator = getThreeDigitSeparator;
    const getExponentFormat = () => UI.SettingsPanel.exponentFormatSelect.value;
    exports.getExponentFormat = getExponentFormat;
    const getExponentMultipleOfThree = () => UI.SettingsPanel.exponentMultipleOfThreeCheckbox.checked;
    exports.getExponentMultipleOfThree = getExponentMultipleOfThree;
    const getNumberFormat = () => UI.SettingsPanel.numberFormatSelect.value;
    exports.getNumberFormat = getNumberFormat;
});
define("resource/config", [], {
    "applicationTitle": "Smart Rule",
    "repositoryUrl": "https://github.com/wraith13/smart-rule/",
    "canonicalUrl": "https://wraith13.github.io/smart-rule/",
    "description": "Smart Slide Rule Web App",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "time": {
        "anchor": {
            "humanEpoch": "1950-01-01T00:00:00Z",
            "universeEpoch": 4.3549488e17
        },
        "gregorianYearLength": 365.2422,
        "julianYearLength": 365.25,
        "pureGregorianYearsRange": {
            "lowerBound": -50,
            "upperBound": 150
        },
        "considerGregorianYearsRange": {
            "lowerBound": -100000,
            "upperBound": 100000
        }
    },
    "symbols": {
        "thinSpace": "\u2009",
        "multiplication": "\u00D7",
        "power": "^",
        "exponent": "E"
    },
    "model": {
        "lane": {
            "root": {
                "type": "logarithmic"
            },
            "presets": {
                "x": {
                    "type": "logarithmic"
                },
                "1/x": {
                    "type": "invert"
                },
                "x^2": {
                    "type": "power",
                    "exponent": 2
                },
                "x^3": {
                    "type": "power",
                    "exponent": 3
                },
                "sqrt(x)": {
                    "type": "power",
                    "exponent": 0.5
                },
                "cbrt(x)": {
                    "type": "power",
                    "exponent": 0.3333333333333333
                },
                "2^n": {
                    "type": "2^n"
                },
                "prime": {
                    "type": "prime"
                },
                "A": {
                    "type": "logarithmic"
                },
                "B": {
                    "type": "logarithmic"
                },
                "C": {
                    "type": "logarithmic"
                },
                "D": {
                    "type": "logarithmic"
                },
                "CI": {
                    "type": "logarithmic"
                },
                "DI": {
                    "type": "logarithmic"
                },
                "K": {
                    "type": "logarithmic"
                },
                "L": {
                    "type": "linear"
                },
                "S": {
                    "type": "sine"
                },
                "T": {
                    "type": "tangent"
                },
                "ST": {
                    "type": "small-tangent"
                },
                "P": {
                    "type": "power"
                },
                "LL": {
                    "type": "log-log"
                }
            }
        },
        "defaultCursor": 1,
        "primeNumber": {
            "limit": 5000000000000,
            "maxRange": 3000,
            "cacheSize": 1000000
        },
        "constantTable": {
            "standardNumberColor": {
                "light": "blue",
                "dark": "#8888FF"
            },
            "primaryNumberColor": {
                "light": "green",
                "dark": "#44FF44"
            },
            "defaultNumberColor": {
                "light": "purple",
                "dark": "violet"
            },
            "estimatedNumberColor": {
                "light": "#888800CC",
                "dark": "#FFFF00CC"
            },
            "fictionalNumberColor": {
                "light": "#888888",
                "dark": "#CCCCCC"
            }
        }
    },
    "view": {
        "defaultViewMode": "ruler",
        "defaultScaleMode": "logarithmic",
        "baseOfLogarithm": {
            "presets": ["phi", 2, "e", "pi", 10],
            "default": 10
        },
        "defaultZoomLevel": 2.25,
        "zoomRate": 0.001,
        "zooomUnit": 0.25,
        "minZoomLevel": -2.5,
        "maxZoomLevel": 12.5,
        "scrollUnit": 10,
        "touchZoomThreshold": 20
    },
    "render": {
        "ruler": {
            "frameRenderTimeLimit": 10,
            "foregroundColor": {
                "light": "#000000",
                "dark": "#FFFFFF"
            },
            "backgroundColor": {
                "light": "#FFFFFF",
                "dark": "#000000"
            },
            "lineColor": "#BB0000CC",
            "lineWidth": 1,
            "laneBackgroundColor": {
                "light": "#F0F0F0",
                "dark": "#1A1A1A"
            },
            "laneWidth": 180,
            "slideSeparatorColor": {
                "light": "#444444",
                "dark": "#CCCCCC"
            },
            "laneSeparatorColor": {
                "light": "#CCCCCC",
                "dark": "#444444"
            },
            "laneSeparatorWidth": 1,
            "denseAreaColor": "rgba(0, 160, 0, 0.6)",
            "minErrorAreaColor": "rgba(255, 0, 0, 0.6)",
            "maxErrorAreaColor": "rgba(160, 0, 160, 0.6)",
            "laneLabelBackgroundColor": {
                "light": "rgba(255, 255, 255, 0.75)",
                "dark": "rgba(0, 0, 0, 0.75)"
            },
            "primaryTickColor": "#DD0000",
            "tick": {
                "mini": {
                    "length": 5,
                    "width": 1,
                    "color": {
                        "light": "#000000",
                        "dark": "#FFFFFF"
                    }
                },
                "short": {
                    "length": 10,
                    "width": 1,
                    "color": {
                        "light": "#000000",
                        "dark": "#FFFFFF"
                    }
                },
                "medium": {
                    "length": 15,
                    "width": 1,
                    "color": {
                        "light": "#000000",
                        "dark": "#FFFFFF"
                    }
                },
                "long": {
                    "length": 20,
                    "width": 2,
                    "color": {
                        "light": "#000000",
                        "dark": "#FFFFFF"
                    }
                }
            },
            "tickLabel": {
                "fontFamily": "Arial, sans-serif",
                "fontSize": 12,
                "fontColor": {
                    "light": "#000000",
                    "dark": "#FFFFFF"
                },
                "offset": 5,
                "minInterval": 30,
                "maxInterval": 150
            },
            "tickDensityThreshold_E243": 0.03,
            "tickDensityThreshold_E81": 0.1,
            "tickDensityThreshold_E27": 0.4,
            "tickDensityThreshold_E9": 1.5,
            "tickDensityThreshold_E3": 5,
            "tickDensityThreshold_5": 20,
            "tickDensityThreshold_10": 50
        }
    }
});
define("script/number", ["require", "exports", "script/type", "script/settings", "resource/config"], function (require, exports, Type, Settings, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNamedNumberLabel = exports.groupDigits = exports.getThreeDigitSeparatorSymbol = exports.getNamedNumberValue = exports.roundE = exports.SafeOr1 = exports.System = exports.primeDecomposition = exports.isPrimeNumber = exports.primeNumbers = exports.isInteger = exports.maxMin = exports.minMax = exports.clamp = exports.MIN_VALUE = exports.MAX_VALUE = exports.MAX_SAFE_INTEGER = exports.ceilTo1Mantissa = exports.floorTo1Mantissa = exports.orUndefined = exports.parse = void 0;
    Type = __importStar(Type);
    Settings = __importStar(Settings);
    config_json_1 = __importDefault(config_json_1);
    const parse = (value) => {
        if (undefined !== value) {
            const result = parseFloat(value);
            if (!isNaN(result)) {
                return result;
            }
        }
        return undefined;
    };
    exports.parse = parse;
    const orUndefined = (value) => "number" === typeof value ? value : undefined;
    exports.orUndefined = orUndefined;
    // export const MIN_VALUE = Number.MIN_VALUE;
    // export const MAX_VALUE = Number.MAX_VALUE;
    // export const MIN_VALUE = 1e-300;
    // export const MAX_VALUE = 1e300;
    const floorTo1Mantissa = (n) => {
        if (n === 0) {
            return 0;
        }
        else {
            const sign = Math.sign(n);
            const abs = Math.abs(n);
            const exp = Math.floor(Math.log10(abs));
            return sign * Math.pow(10, exp);
        }
    };
    exports.floorTo1Mantissa = floorTo1Mantissa;
    const ceilTo1Mantissa = (n) => {
        if (n === 0) {
            return 0;
        }
        else {
            const sign = Math.sign(n);
            const abs = Math.abs(n);
            const exp = Math.ceil(Math.log10(abs));
            return sign * Math.pow(10, exp);
        }
    };
    exports.ceilTo1Mantissa = ceilTo1Mantissa;
    exports.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    // This is the minimum value achieved by sacrificing the mantissa, so values around this range have low precision and are not practical for use.
    //export const MIN_VALUE = ceilTo1Mantissa(Number.MIN_VALUE);
    exports.MAX_VALUE = (0, exports.floorTo1Mantissa)(Number.MAX_VALUE);
    exports.MIN_VALUE = 1 / exports.MAX_VALUE;
    const clamp = (value) => Math.max(Math.min(value, exports.MAX_VALUE), exports.MIN_VALUE);
    exports.clamp = clamp;
    const minMax = (value) => (0, exports.clamp)(value !== null && value !== void 0 ? value : exports.MAX_VALUE);
    exports.minMax = minMax;
    const maxMin = (value) => (0, exports.clamp)(value !== null && value !== void 0 ? value : exports.MIN_VALUE);
    exports.maxMin = maxMin;
    exports.isInteger = Number.isInteger;
    exports.primeNumbers = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
        53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
        // Values after this point are generated dynamically up to config.model.primeNumber.cacheSize.
    ];
    const isPrimeNumber = (value) => {
        if (Number.isInteger(value) && 2 <= value && value <= exports.MAX_SAFE_INTEGER) {
            const sqrt = Math.sqrt(value);
            for (const prime of exports.primeNumbers) {
                if (sqrt < prime) {
                    return true;
                }
                if (0 === value % prime) {
                    return false;
                }
            }
            for (let i = exports.primeNumbers[exports.primeNumbers.length - 1] + 2; i <= sqrt; i += 2) {
                if (exports.primeNumbers.length < config_json_1.default.model.primeNumber.cacheSize) {
                    if ((0, exports.isPrimeNumber)(i)) {
                        exports.primeNumbers.push(i);
                    }
                    else {
                        continue;
                    }
                }
                if (0 === value % i) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    exports.isPrimeNumber = isPrimeNumber;
    const primeDecomposition = (value) => {
        const result = [];
        if (Number.isInteger(value) && 2 <= value && value <= exports.MAX_SAFE_INTEGER) {
            let remainder = value;
            for (const prime of exports.primeNumbers) {
                if (prime * prime > remainder) {
                    break;
                }
                while (0 === remainder % prime) {
                    result.push(prime);
                    remainder /= prime;
                }
            }
            for (let i = exports.primeNumbers[exports.primeNumbers.length - 1] + 2; i * i <= remainder; i += 2) {
                if (exports.primeNumbers.length < config_json_1.default.model.primeNumber.cacheSize) {
                    if ((0, exports.isPrimeNumber)(i)) {
                        exports.primeNumbers.push(i);
                    }
                    else {
                        continue;
                    }
                }
                while (0 === remainder % i) {
                    result.push(i);
                    remainder /= i;
                }
            }
            if (1 < remainder) {
                result.push(remainder);
            }
        }
        return result;
    };
    exports.primeDecomposition = primeDecomposition;
    exports.System = Number;
    const SafeOr1 = (value) => 0 === value % 2 ? value + 1 : value;
    exports.SafeOr1 = SafeOr1;
    const roundE = (value, exponent = -6) => {
        const factor = Math.pow(10, -exponent);
        return Math.round(value * factor) / factor;
    };
    exports.roundE = roundE;
    const getNamedNumberValue = (value) => {
        switch (value) {
            case "phi": return Type.phi;
            case "e": return Math.E;
            case "pi": return Math.PI;
            default: return value;
        }
    };
    exports.getNamedNumberValue = getNamedNumberValue;
    const getThreeDigitSeparatorSymbol = (locales) => {
        switch (Settings.getThreeDigitSeparator()) {
            case "none": return "";
            case "custom": return (1111).toLocaleString(locales).replace(new RegExp((1).toLocaleString(locales), "g"), "");
            case "thin-space": return config_json_1.default.symbols.thinSpace;
        }
    };
    exports.getThreeDigitSeparatorSymbol = getThreeDigitSeparatorSymbol;
    const groupDigits = (value, locales) => {
        let [mantissa, exponentPart] = value.split(/e/i);
        if (undefined !== exponentPart && Settings.getExponentMultipleOfThree()) {
            const exponentValue = parseInt(exponentPart, 10);
            let adjustment = exponentValue % 3;
            if (0 !== adjustment) {
                if (exponentValue < 0) {
                    adjustment += 3;
                }
                const adjustedExponent = exponentValue - adjustment;
                const adjustedMantissa = parseFloat(mantissa) * Math.pow(10, adjustment);
                mantissa = adjustedMantissa.toFixed(mantissa.includes(".") ? mantissa.split(".")[1].length - adjustment : 0);
                exponentPart = adjustedExponent.toString();
            }
        }
        const separatorSymbol = (0, exports.getThreeDigitSeparatorSymbol)();
        // const resultExponentPart = exponentPart ? `${separatorSymbol}E${exponentPart.replace(/^(\d+)/, "+$1")}` : "";
        const resultExponentPart = exponentPart ?
            ("e" === Settings.getExponentFormat() ?
                `${config_json_1.default.symbols.exponent}${exponentPart.replace(/^(\d+)/, "+$1")}` :
                `${config_json_1.default.symbols.multiplication}10${config_json_1.default.symbols.power}${exponentPart}`) :
            "";
        if ("" === separatorSymbol) {
            return `${mantissa}${resultExponentPart}`;
        }
        else {
            const floatPointSymbol = (1.1).toLocaleString(locales).replace(new RegExp((1).toLocaleString(locales), "g"), "");
            const [integerPart, fractionalPart] = mantissa.split(floatPointSymbol);
            const groupedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separatorSymbol);
            if (undefined === fractionalPart) {
                return `${groupedIntegerPart}${resultExponentPart}`;
            }
            else {
                const groupedFractionalPart = fractionalPart.replace(/(\d{3})(?=\d)/g, `$1${separatorSymbol}`);
                return `${groupedIntegerPart}${floatPointSymbol}${groupedFractionalPart}${resultExponentPart}`;
            }
        }
    };
    exports.groupDigits = groupDigits;
    const getNamedNumberLabel = (value, locales, options) => {
        switch (value) {
            case "phi": return "φ";
            case "e": return "e";
            case "pi": return "π";
            default:
                {
                    const useGrouping = false;
                    let result = (0, exports.groupDigits)(value.toLocaleString(locales, Object.assign(Object.assign({}, options), { useGrouping })), locales);
                    // const exponentMatch = result.match(/e([+-]?\d+)$/i);
                    // if (exponentMatch)
                    // {
                    //     const exponent = parseInt(exponentMatch[1], 10);
                    //     const base = result.slice(0, exponentMatch.index);
                    //     result = `${base}×10^${exponent >= 0 ? "+" : ""}${exponent}`;
                    // }
                    return result;
                }
        }
    };
    exports.getNamedNumberLabel = getNamedNumberLabel;
});
define("script/time", ["require", "exports", "resource/config"], function (require, exports, config_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.parseRelativeUniverseEpoch = exports.yearsToUniverseEpoch = exports.universeEpochToString = exports.universeEpochToRelativeTimeString = exports.formatUniverseEpochDuration = exports.getCurrentUniverseEpoch = exports.universeEpochToHumanEpoch = exports.humanEpochToUniverseEpoch = void 0;
    config_json_2 = __importDefault(config_json_2);
    const anchorHumanEpochTime = new Date(config_json_2.default.time.anchor.humanEpoch).getTime();
    const humanEpochToUniverseEpoch = (humanEpoch) => (humanEpoch.getTime() - anchorHumanEpochTime) / 1000 + config_json_2.default.time.anchor.universeEpoch;
    exports.humanEpochToUniverseEpoch = humanEpochToUniverseEpoch;
    const universeEpochToHumanEpoch = (universeEpoch) => {
        try {
            return new Date((universeEpoch - config_json_2.default.time.anchor.universeEpoch) / 1000 + anchorHumanEpochTime);
        }
        catch (e) {
            console.error(`🦋 FIXME: Model.universeEpochToHumanEpoch: invalid universe epoch: ${universeEpoch}`);
            return new Date(NaN);
        }
    };
    exports.universeEpochToHumanEpoch = universeEpochToHumanEpoch;
    const getCurrentUniverseEpoch = () => (0, exports.humanEpochToUniverseEpoch)(new Date());
    exports.getCurrentUniverseEpoch = getCurrentUniverseEpoch;
    const formatUniverseEpochDuration = (duration) => {
        if (duration < 60) {
            return `${duration} seconds`;
        }
        else if (duration < 3600) {
            return `${duration / 60} minutes`;
        }
        else if (duration < 3600 * 24) {
            return `${duration / 3600} hours`;
        }
        else if (duration < 3600 * 24 * config_json_2.default.time.gregorianYearLength) {
            return `${duration / (3600 * 24)} days`;
        }
        else if (duration < 3600 * 24 * config_json_2.default.time.gregorianYearLength * 100) // Up to 100 years, use Gregorian calendar year
         {
            return `${duration / (3600 * 24 * config_json_2.default.time.gregorianYearLength)} years`;
        }
        else if (duration < 3600 * 24 * config_json_2.default.time.julianYearLength * 1000) // After 100 years, use Julian calendar year
         {
            return `${duration / (3600 * 24 * config_json_2.default.time.julianYearLength)} years`;
        }
        else if (duration < 3600 * 24 * config_json_2.default.time.julianYearLength * 1000) {
            return `${duration / (3600 * 24 * config_json_2.default.time.julianYearLength * 1000)} kilo years`;
        }
        else if (duration < 3600 * 24 * config_json_2.default.time.julianYearLength * 1000 * 1000 * 1000) {
            return `${duration / (3600 * 24 * config_json_2.default.time.julianYearLength * 1000 * 1000)} mega years`;
        }
        else {
            return `${duration / (3600 * 24 * config_json_2.default.time.julianYearLength * 1000 * 1000 * 1000)} giga years`;
        }
    };
    exports.formatUniverseEpochDuration = formatUniverseEpochDuration;
    const universeEpochToRelativeTimeString = (universeEpoch) => {
        const currentUniverseEpoch = config_json_2.default.time.anchor.universeEpoch;
        const diff = universeEpoch - currentUniverseEpoch;
        if (diff < 0) {
            return `${(0, exports.formatUniverseEpochDuration)(-diff)} ago`;
        }
        else {
            return `in ${(0, exports.formatUniverseEpochDuration)(diff)}`;
        }
    };
    exports.universeEpochToRelativeTimeString = universeEpochToRelativeTimeString;
    const universeEpochToString = (universeEpoch) => {
        const humanEpoch = (0, exports.universeEpochToHumanEpoch)(universeEpoch);
        if (Number.isNaN(humanEpoch.getTime())) {
            return (0, exports.universeEpochToRelativeTimeString)(universeEpoch);
        }
        else {
            return humanEpoch.toISOString();
        }
    };
    exports.universeEpochToString = universeEpochToString;
    const yearsToUniverseEpoch = (years) => {
        // JP: 「現在」は 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch )とし、グレゴリオ暦の年の長さを365.2422日( config.time.gregorianYearLength )、ユリウス暦の年の長さを365.25日( config.time.julianYearLength ) とする。
        // EN: Consider "now" as 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch ), the length of a year in the Gregorian calendar as 365.2422 days ( config.time.gregorianYearLength ), and the length of a year in the Julian calendar as 365.25 days ( config.time.julianYearLength ).
        switch (true) {
            case years < config_json_2.default.time.considerGregorianYearsRange.lowerBound:
                // JP: -100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
                // EN: For years beyond -100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
                return years * 3600 * 24 * config_json_2.default.time.julianYearLength;
            case years <= config_json_2.default.time.pureGregorianYearsRange.lowerBound:
                // JP: -100000年までは、最初の50年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
                // EN: For years up to -100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 50 years and the length of a year in the Julian calendar for the remaining years
                return (config_json_2.default.time.pureGregorianYearsRange.lowerBound * 3600 * 24 * config_json_2.default.time.gregorianYearLength) + ((years - config_json_2.default.time.pureGregorianYearsRange.lowerBound) * 3600 * 24 * config_json_2.default.time.julianYearLength);
            case years <= config_json_2.default.time.pureGregorianYearsRange.upperBound:
                // JP: -50(1900)年 から +150(2100)年までは、グレゴリオ暦の平均的な年の長さを使用する
                // EN: From -50 (1900) to +150 (2100), use the average length of a year in the Gregorian calendar
                return years * 3600 * 24 * config_json_2.default.time.gregorianYearLength;
            case years <= config_json_2.default.time.considerGregorianYearsRange.upperBound:
                // JP: 100000年までは、最初の150年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
                // EN: For years up to 100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 150 years and the length of a year in the Julian calendar for the remaining years
                return (config_json_2.default.time.pureGregorianYearsRange.upperBound * 3600 * 24 * config_json_2.default.time.gregorianYearLength) + ((years - config_json_2.default.time.pureGregorianYearsRange.upperBound) * 3600 * 24 * config_json_2.default.time.julianYearLength);
            default:
                // JP: 100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
                // EN: For years beyond 100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
                return years * 3600 * 24 * config_json_2.default.time.julianYearLength;
        }
    };
    exports.yearsToUniverseEpoch = yearsToUniverseEpoch;
    const parseRelativeUniverseEpoch = (text) => {
        const now = config_json_2.default.time.anchor.universeEpoch;
        const match = text.match(/^\s*(?:(in)\s+)?(\d+(?:\.\d+)?)\s*(seconds?|minutes?|hours?|days?|years?|kilo years?|mega years?|giga years?)\s*(ago)?\s*$/);
        const hasAgo = null !== match && match[4] && match[4].trim().endsWith("ago");
        const direction = hasAgo ? -1 : 1;
        if (null !== match) {
            const value = Number.parseFloat(match[2]);
            const unit = match[3];
            switch (unit) {
                case "second":
                case "seconds":
                    return now + value * 1 * direction;
                case "minute":
                case "minutes":
                    return now + value * 60 * direction;
                case "hour":
                case "hours":
                    return now + value * 3600 * direction;
                case "day":
                case "days":
                    return now + value * 3600 * 24 * direction;
                case "year":
                case "years":
                    return now + (0, exports.yearsToUniverseEpoch)(value * direction);
                case "kilo year":
                case "kilo years":
                    return now + (0, exports.yearsToUniverseEpoch)(value * direction * 1000);
                case "mega year":
                case "mega years":
                    return now + (0, exports.yearsToUniverseEpoch)(value * direction * 1000 * 1000);
                case "giga year":
                case "giga years":
                    return now + (0, exports.yearsToUniverseEpoch)(value * direction * 1000 * 1000 * 1000);
                default:
                    throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid unit: ${unit}`);
            }
        }
        else {
            throw new Error(`🦋 FIXME: Model.parseRelativeUniverseEpoch: invalid format: ${text}`);
        }
    };
    exports.parseRelativeUniverseEpoch = parseRelativeUniverseEpoch;
    const initialize = () => {
    };
    exports.initialize = initialize;
});
define("script/environment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isDarkMode = exports.isApple = void 0;
    const isApple = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    exports.isApple = isApple;
    const isDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    exports.isDarkMode = isDarkMode;
});
define("script/theme", ["require", "exports", "script/environment", "script/type", "script/settings"], function (require, exports, Environment, Type, Settings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.update = exports.getX = exports.resolve = exports.isDark = void 0;
    Environment = __importStar(Environment);
    Type = __importStar(Type);
    Settings = __importStar(Settings);
    const isDark = () => {
        switch (Settings.getTheme()) {
            case "light":
                return false;
            case "dark":
                return true;
            default:
                return Environment.isDarkMode();
        }
    };
    exports.isDark = isDark;
    const resolve = (table, theme) => Type.isThemeTable(table) ? table[theme !== null && theme !== void 0 ? theme : (0, exports.getX)()] : table;
    exports.resolve = resolve;
    const getX = () => !(0, exports.isDark)() ? "light" : "dark";
    exports.getX = getX;
    const update = () => {
        document.documentElement.classList.toggle("dark-theme", (0, exports.isDark)());
        document.documentElement.classList.toggle("light-theme", !(0, exports.isDark)());
    };
    exports.update = update;
});
define("script/comparer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lowerCase = exports.make = exports.basic = void 0;
    const basic = (a, b) => a < b ? -1 :
        b < a ? 1 :
            0;
    exports.basic = basic;
    const make = (source) => {
        var _a;
        const invoker = (i) => {
            const f = i;
            if ("function" === typeof f) {
                return (a, b) => (0, exports.basic)(f(a), f(b));
            }
            const r = i;
            if (undefined !== (r === null || r === void 0 ? void 0 : r.raw)) {
                return r.raw;
            }
            const s = i;
            if (undefined !== (s === null || s === void 0 ? void 0 : s.getter)) {
                const body = (a, b) => (0, exports.basic)(s.getter(a), s.getter(b));
                if (undefined === s.condition) {
                    return body;
                }
                else {
                    const f = s.condition;
                    if ("function" === typeof f) {
                        return (a, b) => f(a, b) ? body(a, b) : 0;
                    }
                    else {
                        const t = s.condition;
                        const getter = t.getter;
                        if (undefined === getter) {
                            return (a, b) => t.type === typeof a && t.type === typeof b ? body(a, b) : 0;
                        }
                        else {
                            return (a, b) => t.type === typeof getter(a) && t.type === typeof getter(b) ? body(a, b) : 0;
                        }
                    }
                }
            }
            return undefined;
        };
        if (Array.isArray(source)) {
            const comparerList = source.map(invoker).filter(i => undefined !== i);
            return (a, b) => {
                let result = 0;
                for (let i = 0; i < comparerList.length && 0 === result; ++i) {
                    result = comparerList[i](a, b);
                }
                return result;
            };
        }
        else {
            return (_a = invoker(source)) !== null && _a !== void 0 ? _a : (() => 0);
        }
    };
    exports.make = make;
    exports.lowerCase = (0, exports.make)([a => a.toLowerCase(), { raw: exports.basic }]);
});
define("script/model", ["require", "exports", "script/locale", "script/number", "script/type", "script/url", "script/theme", "script/comparer", "resource/config"], function (require, exports, Locale, Number, Type, Url, Theme, Comparer, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getLaneContext = exports.getCursorValues = exports.getCursorValue = exports.getCursorPosition = exports.makeSure = exports.removeLane = exports.makeLane = exports.addLane = exports.getSlideFromLane = exports.getLane = exports.getLastSlideAndLastLane = exports.getSlideAndLane = exports.makeSureSlide = exports.makeSlide = exports.getLaneIndex = exports.getSlideIndexFromLane = exports.getSlideIndex = exports.isRootSlide = exports.getRootSlideAndRootLane = exports.getRootSlide = exports.isPrimaryLane = exports.isRootLane = exports.getRootLane = exports.makeRootLane = exports.designTicks = exports.designPeriodicTicks = exports.designConstantTicks = exports.makeConstantStandardTickUnit = exports.designConstantTickType = exports.designConstantTickColor = exports.designConstantAreas = exports.designDigitTicks = exports.makeDigitLabel = exports.designPrimeDecompositionTicks = exports.factorsToString = exports.designPrimeNumbersTicks = exports.design2nTicks = exports.designRegularTicks = exports.addConstTicks = exports.designTicks10 = exports.designTickType = exports.getLongTickSpaceWidth = exports.makePositionTickWindowFromPositionAndWidth = exports.makePositionTickWindowFromWindow = exports.PositionTickWindowToValueTickWindow = exports.getSnapReferenceLaneIndex = exports.getWidth = exports.getPositionAt = exports.getSlideOffset = exports.getAnchorSlideAndLane = exports.getRawViewPositionAt = exports.getLinearPositionAt = exports.getValueAt = exports.getPrimaryPositionAt = exports.getPrimaryValueAt = exports.isPeriodicLane = exports.getPrimaryPeriod = exports.isInvertLane = exports.getAllLanes = exports.getAllLaneCount = exports.RootLaneIndex = exports.RootSlideIndex = exports.data = void 0;
    Locale = __importStar(Locale);
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    Theme = __importStar(Theme);
    Comparer = __importStar(Comparer);
    config_json_3 = __importDefault(config_json_3);
    exports.data = {
        slides: [],
        cursor: 0,
        offset: { x: 0, y: 0, },
    };
    exports.RootSlideIndex = 0;
    exports.RootLaneIndex = 0;
    const getAllLaneCount = () => exports.data.slides.reduce((count, slide) => count + slide.lanes.length, 0);
    exports.getAllLaneCount = getAllLaneCount;
    const getAllLanes = () => exports.data.slides.reduce((allLanes, slide) => allLanes.concat(slide.lanes), []);
    exports.getAllLanes = getAllLanes;
    const isInvertLane = (lane) => {
        let result = false;
        const slide = (0, exports.getSlideFromLane)(lane);
        for (const i of slide.lanes) {
            switch (i.type) {
                case "invert":
                    result = !result;
                    break;
            }
            if (i === lane) {
                break;
            }
        }
        return result;
    };
    exports.isInvertLane = isInvertLane;
    const getPrimaryPeriod = (lane) => {
        switch (lane.type) {
            case "sine":
            case "cosine":
                return 2 * Math.PI;
            case "tangent":
            case "cotangent":
                return Math.PI;
            default:
                return undefined;
        }
    };
    exports.getPrimaryPeriod = getPrimaryPeriod;
    const isPeriodicLane = (lane) => {
        const slide = (0, exports.getSlideFromLane)(lane);
        for (const i of slide.lanes) {
            if (undefined !== (0, exports.getPrimaryPeriod)(i)) {
                return true;
            }
            if (i === lane) {
                break;
            }
        }
        return false;
    };
    exports.isPeriodicLane = isPeriodicLane;
    // export const getPrimaryAmplitude = (lane: Type.Lane): number =>
    // {
    //     switch(lane.type)
    //     {
    //     case "sine":
    //     case "cosine":
    //         return 1;
    //     case "tangent":
    //     case "cotangent":
    //         return 1;
    //     default:
    //         return 0;
    //     }
    // };
    const getPrimaryValueAt = (lane, position) => {
        var _a;
        switch (lane.type) {
            case "logarithmic":
            case "2^n":
            case "prime":
            case "prime-decomposition":
            case "digit":
            case "constant":
                return position;
            case "invert":
                return 1 / position;
            case "power":
                return Number.clamp(Math.pow(position, (_a = lane.exponent) !== null && _a !== void 0 ? _a : 1));
            case "sine":
                return Math.sin(position);
            case "cosine":
                return Math.cos(position);
            case "tangent":
                return Math.tan(position);
            case "cotangent":
                return 1 / Math.tan(position);
            default:
                throw new Error(`🦋 FIXME: getPrimaryValueAt not implemented for lane type: ${lane.type}`);
        }
    };
    exports.getPrimaryValueAt = getPrimaryValueAt;
    const getPrimaryPositionAt = (lane, value) => {
        var _a;
        switch (lane.type) {
            case "logarithmic":
            case "2^n":
            case "prime":
            case "prime-decomposition":
            case "digit":
            case "constant":
                return value;
            case "invert":
                return 1 / value;
            case "power":
                return Number.clamp(Math.pow(value, 1 / ((_a = lane.exponent) !== null && _a !== void 0 ? _a : 1)));
            case "sine":
                return Math.asin(value);
            case "cosine":
                return Math.acos(value);
            case "tangent":
                return Math.atan(value);
            case "cotangent":
                return Math.atan(1 / value);
            default:
                throw new Error(`🦋 FIXME: getPrimaryPositionAt not implemented for lane type: ${lane.type}`);
        }
    };
    exports.getPrimaryPositionAt = getPrimaryPositionAt;
    const getValueAt = (slide, lane, position, view) => {
        try {
            const viewScale = Type.getViewScale(view);
            const offset = (0, exports.getSlideOffset)(slide, view);
            const rawPosition = Math.exp((position - offset) / viewScale);
            let value = rawPosition;
            let basePosition = 0;
            for (const i of slide.lanes) {
                const period = (0, exports.getPrimaryPeriod)(i);
                if (undefined !== period) {
                    basePosition += Math.floor(value / period) * period;
                }
                value = Number.clamp((0, exports.getPrimaryValueAt)(i, value));
                if (i === lane) {
                    break;
                }
            }
            return { value, basePosition };
        }
        catch (error) {
            console.error(`Error in getValueAt: ${error}`);
            return undefined;
        }
    };
    exports.getValueAt = getValueAt;
    const getLinearPositionAt = (lane, value) => {
        const valueWithBasePosition = typeof value === "number" ? { value, basePosition: 0 } : value;
        const basePosition = valueWithBasePosition.basePosition;
        let linearPosition = valueWithBasePosition.value;
        const slide = (0, exports.getSlideFromLane)(lane);
        for (const i of slide.lanes) {
            linearPosition = Number.clamp((0, exports.getPrimaryPositionAt)(i, linearPosition));
            if (i === lane) {
                break;
            }
        }
        return basePosition + linearPosition;
    };
    exports.getLinearPositionAt = getLinearPositionAt;
    const getRawViewPositionAt = (lane, value, view) => Math.log((0, exports.getLinearPositionAt)(lane, value)) * Type.getViewScale(view);
    exports.getRawViewPositionAt = getRawViewPositionAt;
    const getAnchorSlideAndLane = (slide) => {
        const slideIndex = (0, exports.getSlideIndex)(slide);
        if (slideIndex <= exports.RootSlideIndex) {
            return { anchorSlide: undefined, anchorLane: undefined };
        }
        else {
            const anchorSlide = exports.data.slides[slideIndex - 1];
            const anchorLane = anchorSlide.lanes[anchorSlide.lanes.length - 1];
            return { anchorSlide, anchorLane: anchorLane };
        }
    };
    exports.getAnchorSlideAndLane = getAnchorSlideAndLane;
    const getSlideOffset = (slide, view) => {
        const { anchorSlide, anchorLane } = (0, exports.getAnchorSlideAndLane)(slide);
        if (undefined === anchorSlide || undefined === anchorLane) {
            // return slide.anchor;
            return exports.data.offset.y;
        }
        else {
            return (0, exports.getPositionAt)(anchorSlide, anchorLane, slide.anchor, view);
        }
    };
    exports.getSlideOffset = getSlideOffset;
    const getPositionAt = (slide, lane, value, view) => (0, exports.getRawViewPositionAt)(lane, value, view) + (0, exports.getSlideOffset)(slide, view);
    exports.getPositionAt = getPositionAt;
    const getWidth = (slide, lane, bottom, top, view, isInvert = false) => {
        const a = (0, exports.getPositionAt)(slide, lane, top, view);
        const b = (0, exports.getPositionAt)(slide, lane, bottom, view);
        const width = a - b;
        return "auto" === isInvert ?
            Math.abs(width) :
            (!isInvert) ? width : -width;
    };
    exports.getWidth = getWidth;
    const getSnapReferenceLaneIndex = (slide) => {
        const slideIndex = (0, exports.getSlideIndex)(slide);
        if (0 <= slideIndex) {
            const previousSlide = exports.data.slides[slideIndex - 1];
            if (0 < previousSlide.lanes.length) {
                return (0, exports.getLaneIndex)(previousSlide.lanes[previousSlide.lanes.length - 1]);
            }
            else {
                throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: previous slide has no lanes`);
            }
        }
        else {
            throw new Error(`🦋 FIXME: getSnapReferenceLaneIndex: slide index out of range: ${slideIndex}`);
        }
    };
    exports.getSnapReferenceLaneIndex = getSnapReferenceLaneIndex;
    const PositionTickWindowToValueTickWindow = (slide, lane, view, positionTickWindow) => {
        var _a, _b;
        const isInvert = (0, exports.isInvertLane)(lane);
        const topValue = (_a = (0, exports.getValueAt)(slide, lane, positionTickWindow.topPosition, view)) !== null && _a !== void 0 ? _a : { value: (!isInvert ? Number.MAX_VALUE : Number.MIN_VALUE), basePosition: 0 };
        const bottomValue = (_b = (0, exports.getValueAt)(slide, lane, positionTickWindow.bottomPosition, view)) !== null && _b !== void 0 ? _b : { value: (!isInvert ? Number.MIN_VALUE : Number.MAX_VALUE), basePosition: 0 };
        return { topValue, bottomValue };
    };
    exports.PositionTickWindowToValueTickWindow = PositionTickWindowToValueTickWindow;
    const makePositionTickWindowFromWindow = () => ({
        topPosition: 0,
        bottomPosition: window.innerHeight
    });
    exports.makePositionTickWindowFromWindow = makePositionTickWindowFromWindow;
    const makePositionTickWindowFromPositionAndWidth = (position, width) => ({
        topPosition: position - (width / 2),
        bottomPosition: position + (width / 2)
    });
    exports.makePositionTickWindowFromPositionAndWidth = makePositionTickWindowFromPositionAndWidth;
    const getLongTickSpaceWidth = (slide, lane, view, ticks, value) => {
        let tick;
        let width = Infinity;
        const position = (0, exports.getPositionAt)(slide, lane, value, view);
        for (const i of ticks.filter(i => "long" === i.type)) {
            const tickPosition = (0, exports.getPositionAt)(slide, lane, i.value, view);
            const spaceWidth = Math.abs(position - tickPosition);
            if (spaceWidth < width) {
                tick = i;
                width = spaceWidth;
            }
        }
        return { tick, width };
    };
    exports.getLongTickSpaceWidth = getLongTickSpaceWidth;
    const designTickType = (slide, lane, view, ticks, value) => {
        const tickThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
        const width = (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value).width;
        switch (true) {
            case tickThreshold <= width:
                return "long";
            case tickThreshold <= width * 2:
                return "medium";
            case tickThreshold <= width * 4:
                return "short";
            case tickThreshold <= width * 8:
                return "mini";
            default:
                return "none";
        }
    };
    exports.designTickType = designTickType;
    const designTicks10 = (view, slide, lane, base, unit, parent, tickWindow) => {
        const { topValue, bottomValue } = tickWindow;
        const ticks = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const highValue = (!isInvert) ? bottomValue : topValue;
        const lowValue = (!isInvert) ? topValue : bottomValue;
        if (0 < base && base <= highValue.value && lowValue.value <= Number.minMax(base + unit)) {
            const width = (0, exports.getWidth)(slide, lane, base, base + unit, view, isInvert);
            switch (true) {
                case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                    ticks.push(...(0, exports.designTicks10)(view, slide, lane, base, unit / 10, { index: 0, width }, tickWindow));
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_5 <= width:
                    ticks.push({ value: base + (unit * 0.5), type: "mini", });
                    break;
            }
        }
        for (let b = 1; b <= 9; ++b) {
            const value = base + (unit * b);
            const nextValue = base + (unit * (b + 1));
            if (lowValue.value < nextValue) {
                if (value <= highValue.value) {
                    const width = (0, exports.getWidth)(slide, lane, value, nextValue, view, isInvert);
                    switch (true) {
                        case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                            ticks.push({ value, type: "long", });
                            ticks.push(...(0, exports.designTicks10)(view, slide, lane, value, unit / 10, { index: b, width }, tickWindow));
                            break;
                        case base <= 0 && 0 === parent.index && 1 === b:
                            ticks.push({ value, type: "long", });
                            break;
                        case 5 === b:
                            ticks.push({ value, type: "medium", isShowLabel: config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.3 <= width, });
                            break;
                        default:
                            ticks.push({ value, type: "short", isShowLabel: config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.9 <= width, });
                            break;
                    }
                    switch (true) {
                        case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                            break;
                        default:
                            if (config_json_3.default.render.ruler.tickDensityThreshold_5 <= width) {
                                ticks.push({ value: value + (unit * 0.5), type: "mini", });
                            }
                            break;
                    }
                }
                else {
                    break;
                }
            }
        }
        return ticks;
    };
    exports.designTicks10 = designTicks10;
    const addConstTicks = (slide, lane, view, ticks, tickWindow, constTicks) => {
        var _a;
        const { topValue, bottomValue } = tickWindow;
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        for (const i of constTicks) {
            const value = i.value;
            if (lowwerBoundValue <= value && value <= upperBoundValue) {
                // const tickThreshold = config.render.ruler.tickDensityThreshold_5;
                const { tick, width, } = (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value);
                const label = i.label;
                const color = i.color;
                switch (true) {
                    // case tickThreshold <= width:
                    //     ticks.push({ value, type: "long", color, label });
                    //     break;
                    // case tickThreshold <= width *2:
                    //     ticks.push({ value, type: "medium", color, label });
                    //     break;
                    // case tickThreshold <= width *4:
                    //     ticks.push({ value, type: "short", color, label });
                    //     break;
                    case 1.25 <= width:
                        // ticks.push({ value, type: "mini", color, label });
                        ticks.push({ value, type: "long", color, label });
                        break;
                    default:
                        if (tick) {
                            tick.behindTickCount = ((_a = tick === null || tick === void 0 ? void 0 : tick.behindTickCount) !== null && _a !== void 0 ? _a : 0) + 1;
                        }
                }
            }
        }
    };
    exports.addConstTicks = addConstTicks;
    const designRegularTicks = (slide, view, lane, tickWindow) => {
        const { topValue, bottomValue } = tickWindow;
        const ticks = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const beginDigit = Math.floor(Math.log10((!isInvert) ? topValue.value : bottomValue.value));
        const endDigit = Math.ceil(Math.log10((!isInvert) ? bottomValue.value : topValue.value));
        const scale = 10;
        for (let digit = beginDigit; digit <= endDigit; ++digit) {
            const a = Math.pow(10, digit);
            const width = (0, exports.getWidth)(slide, lane, a, a * scale, view, isInvert);
            switch (true) {
                case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                    ticks.push(...(0, exports.designTicks10)(view, slide, lane, 0, a, { index: 0, width }, tickWindow));
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_5 <= width:
                    ticks.push({
                        value: a,
                        type: "long",
                        color: Math.abs(digit) % 3 === 0 ? undefined : "gray",
                    });
                    ticks.push({ value: a * 5, type: "medium", });
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E3 <= width:
                    ticks.push({
                        value: a,
                        type: 0 === Math.abs(digit) % 3 ? "long" : "medium",
                    });
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E9 <= width:
                    if (0 === Math.abs(digit) % 3) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 9 ? "long" : "medium",
                        });
                    }
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E27 <= width:
                    if (0 === Math.abs(digit) % 9) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 27 ? "long" : "medium",
                        });
                    }
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E81 <= width:
                    if (0 === Math.abs(digit) % 27) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 81 ? "long" : "medium",
                        });
                    }
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E243 <= width:
                    if (0 === Math.abs(digit) % 81) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 243 ? "long" : "medium",
                        });
                    }
                    break;
                default:
                    if (0 === digit) {
                        ticks.push({
                            value: a,
                            type: "long",
                        });
                    }
                    break;
            }
        }
        // const width = getWidth(slide, lane, 1, 2, view, isInvert);
        // if (config.render.ruler.tickDensityThreshold_5 <= width)
        // {
        //     const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        //     const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        //     for(const namedNumber of Type.namedNumberList)
        //     {
        //         const value = Number.getNamedNumberValue(namedNumber);
        //         if (lowwerBoundValue <= value && value <= upperBoundValue)
        //         {
        //             // const tickThreshold = config.render.ruler.tickDensityThreshold_5;
        //             const { tick, width, } = getLongTickSpaceWidth(slide, lane, view, ticks, value);
        //             const label = Number.getNamedNumberLabel(namedNumber);
        //             //const color = "blue";
        //             const color = "green";
        //             switch(true)
        //             {
        //             // case tickThreshold <= width:
        //             //     ticks.push({ value, type: "long", color, label });
        //             //     break;
        //             // case tickThreshold <= width *2:
        //             //     ticks.push({ value, type: "medium", color, label });
        //             //     break;
        //             // case tickThreshold <= width *4:
        //             //     ticks.push({ value, type: "short", color, label });
        //             //     break;
        //             case 1.25 <= width:
        //                 // ticks.push({ value, type: "mini", color, label });
        //                 ticks.push({ value, type: "long", color, label });
        //                 break;
        //             default:
        //                 if (tick)
        //                 {
        //                     tick.behindTickCount = (tick?.behindTickCount ?? 0) +1;
        //                 }
        //             }
        //         }
        //     }
        // }
        (0, exports.addConstTicks)(slide, lane, view, ticks, tickWindow, Type.namedNumberList
            .map(namedNumber => ({
            value: Number.getNamedNumberValue(namedNumber),
            label: Number.getNamedNumberLabel(namedNumber),
            color: Theme.resolve(config_json_3.default.model.constantTable.primaryNumberColor),
        })));
        // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
        // console.log(`min: ${min}, max: ${max}`);
        const result = {
            ticks: ticks,
            areas: []
        };
        return result;
    };
    exports.designRegularTicks = designRegularTicks;
    const design2nTicks = (slide, view, lane, tickWindow) => {
        const { topValue, bottomValue } = tickWindow;
        const ticks = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const beginDigit = Math.floor(Math.log2((!isInvert) ? topValue.value : bottomValue.value));
        const endDigit = Math.ceil(Math.log2((!isInvert) ? bottomValue.value : topValue.value));
        const scale = 2;
        for (let digit = beginDigit; digit <= endDigit; ++digit) {
            const value = Math.pow(2, digit);
            const width = (0, exports.getWidth)(slide, lane, value, value * scale, view, isInvert);
            const density = -Math.floor(Math.log2(width / config_json_3.default.render.ruler.tickDensityThreshold_5));
            const threshold = Math.pow(2, density - 1);
            const label = `2${config_json_3.default.symbols.power}${digit}`;
            switch (true) {
                // case config.render.ruler.tickDensityThreshold_5 <= width:
                case density <= 0:
                    ticks.push({
                        value,
                        label,
                        type: "long",
                    });
                    break;
                // case config.render.ruler.tickDensityThreshold_5 <= width *2:
                case density <= 1:
                    ticks.push({
                        value,
                        label,
                        type: 0 === Math.abs(digit) % 2 ? "long" : "medium",
                    });
                    break;
                // case config.render.ruler.tickDensityThreshold_5 <= width *4:
                case density <= 2:
                    if (0 === Math.abs(digit) % 2) {
                        ticks.push({
                            value,
                            label,
                            type: 0 === Math.abs(digit) % 4 ? "long" : "medium",
                        });
                    }
                    break;
                default:
                    if (0 === Math.abs(digit) % threshold) {
                        ticks.push({
                            value,
                            label,
                            type: 0 === Math.abs(digit) % (threshold * 4) ? "long" : "medium",
                        });
                    }
                    break;
            }
        }
        const result = {
            ticks: ticks,
            areas: []
        };
        return result;
    };
    exports.design2nTicks = design2nTicks;
    const designPrimeNumbersTicks = (slide, view, lane, tickWindow) => {
        const locales = Locale.getLocale();
        const { topValue, bottomValue } = tickWindow;
        const { limit, maxRange } = config_json_3.default.model.primeNumber;
        // const { maxRange } = config.model.primeNumber;
        const ticks = [];
        const areas = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        const lowerBoundInvertDecimalValue = Math.ceil(1 / Math.min(1, upperBoundValue));
        const upperBoundInvertDecimalValue = Number.SafeOr1(Math.min(limit, Math.floor(1 / Math.min(1, lowwerBoundValue))));
        // const upperBoundInvertDecimalValue = Number.SafeOr1(Math.floor(1 /Math.min(1, lowwerBoundValue)));
        const tickTypeThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
        if (2 <= upperBoundInvertDecimalValue) {
            if (limit <= lowerBoundInvertDecimalValue) {
                areas.push({
                    lowerBound: Number.MIN_VALUE,
                    upperBound: 1 / lowerBoundInvertDecimalValue,
                    fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                });
            }
            else {
                if (lowerBoundInvertDecimalValue <= 2) {
                    const value = 2;
                    ticks.push({
                        value: 1 / value,
                        label: `1/${Number.groupDigits(`${value}`, locales)}`,
                        type: "long",
                        color: "green"
                    });
                }
                const start = Number.SafeOr1(Math.max(3, lowerBoundInvertDecimalValue));
                const limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (let value = start; value <= upperBoundInvertDecimalValue; value += 2) {
                    const width = (0, exports.getWidth)(slide, lane, 1 / (value + 1), 1 / value, view, isInvert);
                    if (width * Math.log(value) < 1 || limitEnd <= value) {
                        areas.push({
                            lowerBound: Number.MIN_VALUE,
                            upperBound: 1 / Math.min(value, limit),
                            // upperBound: 1 /value,
                            fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                        });
                        break;
                    }
                    //if (Number.isPrimeNumber(value))
                    if (3 === value || (0 !== value % 3 && Number.isPrimeNumber(value))) {
                        ticks.push({
                            value: 1 / value,
                            label: `1 / ${Number.groupDigits(`${value}`, locales)}`,
                            type: tickTypeThreshold <= (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, 1 / value).width ?
                                "long" :
                                "medium",
                            color: "green"
                        });
                    }
                }
            }
        }
        const lowwerBoundIntegerValue = Math.max(2, Math.ceil(lowwerBoundValue));
        const upperBoundIntegerValue = Number.SafeOr1(Math.min(Math.max(2, Math.floor(upperBoundValue)), limit));
        // const upperBoundIntegerValue = Number.SafeOr1(Math.max(2, Math.floor(upperBoundValue)));
        if (2 <= upperBoundIntegerValue) {
            if (limit <= lowwerBoundIntegerValue) {
                areas.push({
                    lowerBound: Math.max(2, lowwerBoundValue),
                    upperBound: Number.MAX_VALUE,
                    fill: (!isInvert) ? "url(#lower-dense-area-gradient)" : "url(#upper-dense-area-gradient)"
                });
            }
            else {
                if (2 <= lowwerBoundIntegerValue) {
                    const value = 2;
                    ticks.push({
                        value,
                        label: `${Number.groupDigits(`${value}`, locales)}`,
                        type: "long",
                        color: "green"
                    });
                }
                const start = Number.SafeOr1(Math.max(3, lowwerBoundIntegerValue));
                const limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (let value = start; value <= upperBoundIntegerValue; value += 2) {
                    const width = (0, exports.getWidth)(slide, lane, value, value + 1, view, isInvert);
                    if (width * Math.log(value) < 1 || limitEnd <= value) {
                        if (value < upperBoundValue) {
                            areas.push({
                                lowerBound: Math.min(value, limit),
                                // lowerBound: value,
                                upperBound: Number.MAX_VALUE,
                                fill: (!isInvert) ? "url(#lower-dense-area-gradient)" : "url(#upper-dense-area-gradient)"
                            });
                        }
                        break;
                    }
                    //if (Number.isPrimeNumber(value))
                    if (3 === value || (0 !== value % 3 && Number.isPrimeNumber(value))) {
                        ticks.push({
                            value,
                            label: `${Number.groupDigits(`${value}`, locales)}`,
                            type: tickTypeThreshold <= (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value).width ?
                                "long" :
                                "medium",
                            color: "green"
                        });
                    }
                }
            }
        }
        (0, exports.addConstTicks)(slide, lane, view, ticks, tickWindow, [
            {
                value: 1 / Number.MAX_SAFE_INTEGER,
                label: "1 / max safe integer",
                color: "blue"
            },
            {
                value: 1 / limit,
                label: "1 / calculation limit",
                color: "blue"
            },
            {
                value: limit,
                label: "calculation limit",
                color: "blue"
            },
            {
                value: Number.MAX_SAFE_INTEGER,
                label: "max safe integer",
                color: "blue"
            }
        ]);
        const result = {
            ticks: ticks,
            areas,
        };
        return result;
    };
    exports.designPrimeNumbersTicks = designPrimeNumbersTicks;
    const factorsToString = (factors, locales) => {
        const factorCounts = {};
        for (const factor of factors) {
            if (undefined === factorCounts[factor]) {
                factorCounts[factor] = 1;
            }
            else {
                factorCounts[factor] += 1;
            }
        }
        const parts = [];
        for (const factor in factorCounts) {
            const count = factorCounts[factor];
            const factorString = Number.groupDigits(`${factor}`, locales);
            if (1 < count) {
                parts.push(`${factorString}${config_json_3.default.symbols.power}${count}`);
            }
            else {
                parts.push(factorString);
            }
        }
        //return parts.join(" × ");
        // return parts.join("\u2009×\u2009");
        return parts.join(`${config_json_3.default.symbols.thinSpace}${config_json_3.default.symbols.multiplication}${config_json_3.default.symbols.thinSpace}`);
    };
    exports.factorsToString = factorsToString;
    const designPrimeDecompositionTicks = (slide, view, lane, tickWindow) => {
        const locales = Locale.getLocale();
        const { topValue, bottomValue } = tickWindow;
        const { limit, maxRange } = config_json_3.default.model.primeNumber;
        // const { maxRange } = config.model.primeNumber;
        const ticks = [];
        const areas = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        const lowerBoundInvertDecimalValue = Math.ceil(1 / Math.min(1, upperBoundValue));
        const upperBoundInvertDecimalValue = Math.min(limit, Math.floor(1 / Math.min(1, lowwerBoundValue)));
        const tickTypeThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.75;
        const type = "long";
        if (2 <= upperBoundInvertDecimalValue) {
            if (limit <= lowerBoundInvertDecimalValue) {
                areas.push({
                    lowerBound: Number.MIN_VALUE,
                    upperBound: 1 / lowerBoundInvertDecimalValue,
                    fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                });
            }
            else {
                const start = Math.max(2, lowerBoundInvertDecimalValue);
                const limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (let value = start; value <= upperBoundInvertDecimalValue; ++value) {
                    const width = (0, exports.getWidth)(slide, lane, 1 / (value + 1), 1 / value, view, isInvert);
                    if (width < tickTypeThreshold || limitEnd <= value) {
                        areas.push({
                            lowerBound: Number.MIN_VALUE,
                            upperBound: 1 / Math.min(value, limit),
                            // upperBound: 1 /value,
                            fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                        });
                        break;
                    }
                    const factors = Number.primeDecomposition(value);
                    ticks.push({
                        value: 1 / value,
                        label: `1/( ${(0, exports.factorsToString)(factors, locales)} )`,
                        type,
                        color: factors.length <= 1 ? "green" : undefined,
                    });
                }
            }
        }
        const lowwerBoundIntegerValue = Math.ceil(lowwerBoundValue);
        const upperBoundIntegerValue = Math.min(Math.floor(upperBoundValue), limit);
        if (1 <= upperBoundIntegerValue) {
            if (limit <= lowwerBoundIntegerValue) {
                areas.push({
                    lowerBound: Math.max(2, lowwerBoundValue),
                    upperBound: Number.MAX_VALUE,
                    fill: (!isInvert) ? "url(#lower-dense-area-gradient)" : "url(#upper-dense-area-gradient)"
                });
            }
            else {
                const start = Math.max(1, lowwerBoundIntegerValue);
                const limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (let value = start; value <= upperBoundIntegerValue; ++value) {
                    const width = (0, exports.getWidth)(slide, lane, value, value + 1, view, isInvert);
                    if (width < tickTypeThreshold || limitEnd <= value) {
                        if (value < upperBoundValue) {
                            areas.push({
                                lowerBound: Math.min(value, limit),
                                // lowerBound: value,
                                upperBound: Number.MAX_VALUE,
                                fill: (!isInvert) ? "url(#lower-dense-area-gradient)" : "url(#upper-dense-area-gradient)"
                            });
                        }
                        break;
                    }
                    const factors = Number.primeDecomposition(value);
                    ticks.push({
                        value,
                        label: `${(0, exports.factorsToString)(factors, locales)}`,
                        type,
                        color: factors.length <= 1 ? "green" : undefined,
                    });
                }
            }
        }
        ticks.push({
            value: 1,
            type: "long",
        });
        (0, exports.addConstTicks)(slide, lane, view, ticks, tickWindow, [
            {
                value: 1 / Number.MAX_SAFE_INTEGER,
                label: "1 / max safe integer",
                color: "blue"
            },
            // {
            //     value: 1 /limit,
            //     label: "1 / calculation limit",
            //     color: "blue"
            // },
            // {
            //     value: limit,
            //     label: "calculation limit",
            //     color: "blue"
            // },
            {
                value: Number.MAX_SAFE_INTEGER,
                label: "max safe integer",
                color: "blue"
            }
        ]);
        // ticks.push
        // (
        //     {
        //         value: 1 /Number.MAX_SAFE_INTEGER,
        //         label: "1 / max safe integer",
        //         type: "long",
        //         color: "blue"
        //     },
        //     // {
        //     //     value: 1 /limit,
        //     //     label: "1 / calculation limit",
        //     //     type: "long",
        //     //     color: "blue"
        //     // },
        //     {
        //         value: 1,
        //         type: "long",
        //     },
        //     // {
        //     //     value: limit,
        //     //     label: "calculation limit",
        //     //     type: "long",
        //     //     color: "blue"
        //     // },
        //     {
        //         value: Number.MAX_SAFE_INTEGER,
        //         label: "max safe integer",
        //         type: "long",
        //         color: "blue"
        //     }
        // );
        const result = {
            ticks: ticks,
            areas,
        };
        return result;
    };
    exports.designPrimeDecompositionTicks = designPrimeDecompositionTicks;
    const makeDigitLabel = (digit) => {
        if (undefined === digit.symbol) {
            return digit.label;
        }
        else {
            if ("string" === typeof digit.label) {
                return `${digit.symbol} (${digit.label})`;
            }
            else {
                const result = {};
                for (const lang in digit.label) {
                    result[lang] = `${digit.symbol} (${digit.label[lang]})`;
                }
                return result;
            }
        }
    };
    exports.makeDigitLabel = makeDigitLabel;
    const designDigitTicks = (slide, view, lane, tickWindow) => {
        const { topValue, bottomValue } = tickWindow;
        const ticks = [];
        const areas = [];
        // const isInvert = isInvertLane(lane);
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        if (undefined !== lane.digit) {
            ticks.push({
                value: 1,
                type: "long",
                color: Theme.resolve(config_json_3.default.model.constantTable.standardNumberColor),
            });
            for (const i of lane.digit.digits) {
                const value = Math.pow(10, i.exponent);
                if (lowwerBoundValue <= value && value <= upperBoundValue) {
                    const type = (0, exports.designConstantTickType)(slide, lane, view, ticks, value);
                    if ("none" !== type) {
                        ticks.push({
                            value,
                            label: (0, exports.makeDigitLabel)(i),
                            type,
                            color: Theme.resolve(config_json_3.default.model.constantTable.primaryNumberColor),
                        });
                    }
                }
            }
        }
        const result = {
            ticks,
            areas,
        };
        return result;
    };
    exports.designDigitTicks = designDigitTicks;
    const designConstantAreas = (slide, view, lane, tickWindow, area) => {
        var _a, _b, _c, _d;
        const { topValue, bottomValue } = tickWindow;
        const result = [];
        const isInvert = (0, exports.isInvertLane)(lane);
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        const lowerBound = (_a = area.lowerBound) !== null && _a !== void 0 ? _a : Number.MIN_VALUE;
        const upperBound = (_b = area.upperBound) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
        const width = (0, exports.getWidth)(slide, lane, lowerBound, upperBound, view, isInvert);
        const threshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
        if ((lowwerBoundValue <= upperBound && lowerBound <= upperBoundValue) || (lowerBound <= upperBoundValue && lowwerBoundValue <= upperBound)) {
            const detailsCount = ((_c = area.details) !== null && _c !== void 0 ? _c : []).length;
            const details = 0 < detailsCount && threshold * Math.max(5, detailsCount * 1.25) <= width ?
                ((_d = area.details) !== null && _d !== void 0 ? _d : []).map(detail => (0, exports.designConstantAreas)(slide, view, lane, tickWindow, detail)).reduce((a, b) => a.concat(b), []) :
                undefined;
            result.push({
                lowerBound,
                upperBound,
                fill: area.fill,
                overlay: area.overlay,
                label: threshold <= width * 1.5 ? area.label : undefined,
                color: Theme.resolve(area.color),
                details,
            });
        }
        return result;
    };
    exports.designConstantAreas = designConstantAreas;
    const designConstantTickColor = (tick) => {
        var _a;
        const color = Theme.resolve(tick.color);
        switch (color) {
            case undefined:
                return Theme.resolve(((_a = tick.priority) !== null && _a !== void 0 ? _a : 0) <= 0 ?
                    config_json_3.default.model.constantTable.primaryNumberColor :
                    config_json_3.default.model.constantTable.defaultNumberColor);
            case "$ESTIMATED":
                return Theme.resolve(config_json_3.default.model.constantTable.estimatedNumberColor);
            case "$FICTION":
                return Theme.resolve(config_json_3.default.model.constantTable.fictionalNumberColor);
            default:
                return color;
        }
    };
    exports.designConstantTickColor = designConstantTickColor;
    const designConstantTickType = (slide, lane, view, ticks, value) => {
        var _a;
        const tickThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.8;
        const { tick, width, } = (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value);
        switch (true) {
            // case tickThreshold <= width:
            //     return "long";
            // case tickThreshold <= width *2:
            //     return "medium";
            // case tickThreshold <= width *4:
            //     return "short";
            // case tickThreshold <= width *8:
            //     return "mini";
            // default:
            //     return "none";
            case tickThreshold <= width:
                return "long";
            case 1.25 <= width:
                return "medium";
            default:
                if (tick) {
                    tick.behindTickCount = ((_a = tick === null || tick === void 0 ? void 0 : tick.behindTickCount) !== null && _a !== void 0 ? _a : 0) + 1;
                }
                return "none";
        }
    };
    exports.designConstantTickType = designConstantTickType;
    const makeConstantStandardTickUnit = (table) => {
        if (undefined !== table.unit) {
            const label = Locale.resolve(table.unit.label);
            if (undefined !== table.unit.symbol) {
                if (undefined !== label) {
                    return `${table.unit.symbol} (${label})`;
                }
                else {
                    return table.unit.symbol;
                }
            }
            else {
                return label;
            }
        }
        return undefined;
    };
    exports.makeConstantStandardTickUnit = makeConstantStandardTickUnit;
    const designConstantTicks = (slide, view, lane, tickWindow) => {
        var _a;
        const { topValue, bottomValue } = tickWindow;
        const ticks = [];
        const areas = [];
        // const isInvert = isInvertLane(lane);
        const lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        const upperBoundValue = Math.max(topValue.value, bottomValue.value);
        if (undefined !== lane.table) {
            const unit = (_a = lane.table.unit) === null || _a === void 0 ? void 0 : _a.symbol;
            ticks.push({
                value: 1,
                unit: (0, exports.makeConstantStandardTickUnit)(lane.table),
                type: "long",
                color: Theme.resolve(config_json_3.default.model.constantTable.standardNumberColor),
            });
            const sourceTicks = lane.table.ticks
                .filter(i => lowwerBoundValue <= i.value && i.value <= upperBoundValue)
                .sort(Comparer.make([i => { var _a; return (_a = i.priority) !== null && _a !== void 0 ? _a : 0; },]));
            for (const i of sourceTicks) {
                const type = (0, exports.designConstantTickType)(slide, lane, view, ticks, i.value);
                if ("none" !== type) {
                    ticks.push({
                        value: i.value,
                        label: i.label,
                        unit,
                        type,
                        color: (0, exports.designConstantTickColor)(i),
                    });
                }
            }
            for (const i of lane.table.areas) {
                areas.push(...(0, exports.designConstantAreas)(slide, view, lane, tickWindow, i));
            }
        }
        const result = {
            ticks,
            areas,
        };
        return result;
    };
    exports.designConstantTicks = designConstantTicks;
    const designPeriodicTicks = (_slide, _view, _lane, _tickWindow) => {
        const ticks = [];
        const areas = [];
        const result = {
            ticks,
            areas,
        };
        return result;
    };
    exports.designPeriodicTicks = designPeriodicTicks;
    const designTicks = (slide, view, lane, tickWindow) => {
        if ((0, exports.isPeriodicLane)(lane)) {
            return (0, exports.designPeriodicTicks)(slide, view, lane, tickWindow);
        }
        else {
            const valueTickWindow = (0, exports.PositionTickWindowToValueTickWindow)(slide, lane, view, tickWindow);
            switch (lane.type) {
                case "2^n":
                    return (0, exports.design2nTicks)(slide, view, lane, valueTickWindow);
                case "prime":
                    return (0, exports.designPrimeNumbersTicks)(slide, view, lane, valueTickWindow);
                case "prime-decomposition":
                    return (0, exports.designPrimeDecompositionTicks)(slide, view, lane, valueTickWindow);
                case "digit":
                    return (0, exports.designDigitTicks)(slide, view, lane, valueTickWindow);
                case "constant":
                    return (0, exports.designConstantTicks)(slide, view, lane, valueTickWindow);
                default:
                    return (0, exports.designRegularTicks)(slide, view, lane, valueTickWindow);
            }
        }
    };
    exports.designTicks = designTicks;
    const makeRootLane = () => {
        const { type, exponent } = config_json_3.default.model.lane.root;
        return (0, exports.makeLane)({
            type: type,
            exponent,
        });
    };
    exports.makeRootLane = makeRootLane;
    const getRootLane = () => (0, exports.getLane)(exports.RootLaneIndex);
    exports.getRootLane = getRootLane;
    const isRootLane = (indexOrLane) => (typeof indexOrLane === "number" ? exports.RootLaneIndex : (0, exports.getLane)(exports.RootLaneIndex)) === indexOrLane;
    exports.isRootLane = isRootLane;
    const isPrimaryLane = (lane) => (0, exports.getSlideFromLane)(lane).lanes[0] === lane;
    exports.isPrimaryLane = isPrimaryLane;
    const getRootSlide = () => exports.data.slides[0];
    exports.getRootSlide = getRootSlide;
    const getRootSlideAndRootLane = () => ({ slide: (0, exports.getRootSlide)(), lane: (0, exports.getRootLane)() });
    exports.getRootSlideAndRootLane = getRootSlideAndRootLane;
    const isRootSlide = (indexOrSlide) => (0 === (typeof indexOrSlide === "number" ? indexOrSlide : (0, exports.getSlideIndex)(indexOrSlide)));
    exports.isRootSlide = isRootSlide;
    const getSlideIndex = (slide) => {
        const index = exports.data.slides.indexOf(slide);
        if (0 <= index) {
            return index;
        }
        throw new Error(`🦋 FIXME: Model.getSlideIndex: slide not found`);
    };
    exports.getSlideIndex = getSlideIndex;
    const getSlideIndexFromLane = (lane) => {
        for (let i = 0; i < exports.data.slides.length; ++i) {
            const slide = exports.data.slides[i];
            if (slide.lanes.includes(lane)) {
                return i;
            }
        }
        throw new Error(`🦋 FIXME: Model.getSlideIndexFromLane: lane not found in any slide`);
    };
    exports.getSlideIndexFromLane = getSlideIndexFromLane;
    const getLaneIndex = (lane) => {
        let i = 0;
        for (const slide of exports.data.slides) {
            for (const l of slide.lanes) {
                if (l === lane) {
                    return i;
                }
                ++i;
            }
        }
        throw new Error(`🦋 FIXME: Model.getLaneIndex: lane not found`);
    };
    exports.getLaneIndex = getLaneIndex;
    const makeSlide = (anchor = 1) => ({
        lanes: [],
        anchor,
    });
    exports.makeSlide = makeSlide;
    const makeSureSlide = () => {
        if (exports.data.slides.length <= 0) {
            const slide = (0, exports.makeSlide)();
            slide.lanes.push((0, exports.makeRootLane)());
            exports.data.slides.push(slide);
        }
        return exports.data.slides[exports.data.slides.length - 1];
    };
    exports.makeSureSlide = makeSureSlide;
    const getSlideAndLane = (index) => {
        let i = 0;
        for (const slide of exports.data.slides) {
            for (const lane of slide.lanes) {
                if (i === index) {
                    return { slide, lane };
                }
                ++i;
            }
        }
        throw new Error(`🦋 FIXME: Model.getLane: index out of range: ${index}`);
    };
    exports.getSlideAndLane = getSlideAndLane;
    const getLastSlideAndLastLane = () => {
        if (exports.data.slides.length <= 0) {
            throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no slide exists`);
        }
        const slide = exports.data.slides[exports.data.slides.length - 1];
        if (slide.lanes.length <= 0) {
            throw new Error(`🦋 FIXME: Model.getLastSlideAndLastLane: no lane exists in the last slide`);
        }
        const lane = slide.lanes[slide.lanes.length - 1];
        return { slide, lane };
    };
    exports.getLastSlideAndLastLane = getLastSlideAndLastLane;
    const getLane = (index) => (0, exports.getSlideAndLane)(index).lane;
    exports.getLane = getLane;
    const getSlideFromLane = (lane) => {
        for (const slide of exports.data.slides) {
            if (slide.lanes.includes(lane)) {
                return slide;
            }
        }
        throw new Error(`🦋 FIXME: Model.getSlideFromLane: lane not found in any slide`);
    };
    exports.getSlideFromLane = getSlideFromLane;
    const addLane = (lane) => {
        (0, exports.makeSureSlide)().lanes.push(lane);
    };
    exports.addLane = addLane;
    const getLaneName = (laneSeed) => {
        if (undefined !== laneSeed.name && null !== laneSeed.name) {
            return laneSeed.name;
        }
        for (const i of Object.keys(config_json_3.default.model.lane.presets)) {
            const preset = config_json_3.default.model.lane.presets[i];
            if (
            // data.slides.every(slide => slide.lanes.every(lane => lane.name !== i)) &&
            preset.type === laneSeed.type &&
                // preset.isInvert === laneSeed.isInvert &&
                // preset.logScale === laneSeed.logScale
                preset.exponent === laneSeed.exponent) {
                return i;
            }
        }
        return null;
    };
    const makeLane = (laneSeed) => ({
        type: laneSeed.type,
        exponent: laneSeed.exponent,
        name: getLaneName(laneSeed),
        table: laneSeed.table,
        digit: laneSeed.digit,
    });
    exports.makeLane = makeLane;
    const removeLane = (index) => {
        if ((0, exports.isRootLane)(index)) {
            throw new Error(`🦋 FIXME: Model.removeLane: cannot remove root lane`);
        }
        else {
            const { slide, lane } = (0, exports.getSlideAndLane)(index);
            slide.lanes.splice(slide.lanes.indexOf(lane), 1);
        }
    };
    exports.removeLane = removeLane;
    const makeSure = () => {
        (0, exports.makeSureSlide)();
    };
    exports.makeSure = makeSure;
    const getCursorPosition = (view) => (0, exports.getPositionAt)((0, exports.getRootSlide)(), (0, exports.getRootLane)(), exports.data.cursor, view);
    exports.getCursorPosition = getCursorPosition;
    const getCursorValue = (slide, lane, view) => (0, exports.getValueAt)(slide, lane, (0, exports.getCursorPosition)(view), view);
    exports.getCursorValue = getCursorValue;
    const getCursorValues = (view) => exports.data.slides.map(slide => (0, exports.getCursorValue)(slide, slide.lanes[0], view));
    exports.getCursorValues = getCursorValues;
    const getLaneContext = (lane) => {
        const slide = (0, exports.getSlideFromLane)(lane);
        switch (true) {
            case slide.lanes.length <= 1:
                return "single";
            case lane === slide.lanes[0]:
                return "left-end";
            case lane === slide.lanes[slide.lanes.length - 1]:
                return "right-end";
            default:
                return "center";
        }
    };
    exports.getLaneContext = getLaneContext;
    const initialize = () => {
        var _a;
        exports.data.cursor = (_a = Number.parse(Url.get("cursor"))) !== null && _a !== void 0 ? _a : config_json_3.default.model.defaultCursor;
        console.log(`Model initialized: cursor=${exports.data.cursor}`);
        (0, exports.makeSure)();
    };
    exports.initialize = initialize;
});
define("script/view", ["require", "exports", "script/number", "script/url", "script/ui", "resource/config"], function (require, exports, Number, Url, UI, config_json_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.setLocked = exports.isLocked = exports.setViewScaleExponent = exports.getViewScale = exports.setViewMode = exports.isGraphView = exports.isGridView = exports.isRulerView = exports.getViewMode = exports.data = void 0;
    Number = __importStar(Number);
    Url = __importStar(Url);
    UI = __importStar(UI);
    config_json_4 = __importDefault(config_json_4);
    exports.data = {
        viewMode: "ruler",
        viewScaleExponent: (_a = config_json_4.default.view.defaultZoomLevel) !== null && _a !== void 0 ? _a : 2.5,
        baseOfLogarithm: 10,
        isLocked: false,
    };
    const getViewMode = () => exports.data.viewMode;
    exports.getViewMode = getViewMode;
    const isRulerView = () => exports.data.viewMode === "ruler";
    exports.isRulerView = isRulerView;
    const isGridView = () => exports.data.viewMode === "grid";
    exports.isGridView = isGridView;
    const isGraphView = () => exports.data.viewMode === "graph";
    exports.isGraphView = isGraphView;
    const setViewMode = (mode) => {
        exports.data.viewMode = mode;
        Url.addParameter("view-mode", mode);
        document.body.classList.toggle("ruler-view", (0, exports.isRulerView)());
        document.body.classList.toggle("grid-view", (0, exports.isGridView)());
        document.body.classList.toggle("graph-view", (0, exports.isGraphView)());
        UI.setAriaHidden(UI.rulerView, !(0, exports.isRulerView)());
        UI.setAriaHidden(UI.gridView, !(0, exports.isGridView)());
    };
    exports.setViewMode = setViewMode;
    const getViewScale = () => Math.pow(10, exports.data.viewScaleExponent);
    exports.getViewScale = getViewScale;
    const setViewScaleExponent = (exponent) => {
        exports.data.viewScaleExponent = exponent;
        //data.viewScale = Math.pow(10, exponent);
        Url.addParameter("view-scale", exponent.toString());
    };
    exports.setViewScaleExponent = setViewScaleExponent;
    const isLocked = () => exports.data.isLocked;
    exports.isLocked = isLocked;
    const setLocked = (locked) => {
        exports.data.isLocked = locked;
        Url.addParameter("locked", locked ? "true" : "false");
    };
    exports.setLocked = setLocked;
    const initialize = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (0, exports.setViewMode)((_c = (_a = Url.get("view-mode")) !== null && _a !== void 0 ? _a : (_b = config_json_4.default.view) === null || _b === void 0 ? void 0 : _b.defaultViewMode) !== null && _c !== void 0 ? _c : "ruler");
        (0, exports.setViewScaleExponent)((_d = Number.parse(Url.get("view-scale"))) !== null && _d !== void 0 ? _d : exports.data.viewScaleExponent);
        exports.data.baseOfLogarithm = (_h = (_e = Number.orUndefined(Number.getNamedNumberValue(Url.get("base")))) !== null && _e !== void 0 ? _e : (_g = (_f = config_json_4.default.view) === null || _f === void 0 ? void 0 : _f.baseOfLogarithm) === null || _g === void 0 ? void 0 : _g.default) !== null && _h !== void 0 ? _h : 10;
        const urlLocked = Url.get("locked");
        if (undefined !== urlLocked) {
            (0, exports.setLocked)("true" === urlLocked);
        }
        console.log(`View initialized: mode=${exports.data.viewMode}, scale=${exports.data.viewScaleExponent}, base=${exports.data.baseOfLogarithm}`);
    };
    exports.initialize = initialize;
});
define("script/render", ["require", "exports", "script/view", "script/model", "resource/config"], function (require, exports, View, Model, config_json_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setRenderer = exports.resize = exports.resetDirty = exports.requestRender = exports.markDirty = exports.isDirty = exports.AllItems = void 0;
    View = __importStar(View);
    Model = __importStar(Model);
    config_json_5 = __importDefault(config_json_5);
    exports.AllItems = "$ALL";
    const timelimit = config_json_5.default.render.ruler.frameRenderTimeLimit;
    let renderRequested = false;
    let dirty = new Set();
    let currentRenderer;
    const isDirty = () => 0 < dirty.size;
    exports.isDirty = isDirty;
    const markDirty = (item) => {
        dirty.add(item !== null && item !== void 0 ? item : exports.AllItems);
        (0, exports.requestRender)();
    };
    exports.markDirty = markDirty;
    const requestRender = () => {
        if (!renderRequested) {
            renderRequested = true;
            requestAnimationFrame(() => {
                renderRequested = false;
                if ((0, exports.isDirty)()) {
                    currentRenderer(Model.data, View.data, dirty, performance.now() + timelimit);
                    (0, exports.requestRender)();
                }
            });
        }
    };
    exports.requestRender = requestRender;
    const resetDirty = (item) => {
        // if (undefined !== item)
        // {
        dirty.delete(item);
        // }
        // else
        // {
        //     dirty.clear();
        // }
    };
    exports.resetDirty = resetDirty;
    const resize = () => {
        (0, exports.markDirty)("SIZE");
    };
    exports.resize = resize;
    const setRenderer = (renderer) => {
        currentRenderer = renderer;
        (0, exports.markDirty)();
    };
    exports.setRenderer = setRenderer;
});
define("script/ruler", ["require", "exports", "script/locale", "script/type", "script/number", "script/model", "script/ui", "script/theme", "script/render", "script/svg", "script/comparer", "resource/config"], function (require, exports, Locale, Type, Number, Model, UI, Theme, Render, SVG, Comparer, config_json_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getRulerWidth = exports.resize = exports.drawMenuLane = exports.drawAnchorLine = exports.slideCursor = exports.snapHorizontalPosition = exports.snapVerticalPosition = exports.getAreaPositions = exports.nextPosition = exports.snapPosition = exports.regulateReferencePositions = exports.getReferenceLaneIndexFromEvent = exports.garbageCollectLanes = exports.drawTicks = exports.calculateMinimumFractionDigits = exports.getFractionDigitsFromUnit = exports.makeNumberLabel = exports.drawErrorArea = exports.drawAreas = exports.drawLane = exports.getLeftOfLane = exports.makeSureSlide = exports.drawDenseAreaDefines = exports.drawErrorAreaDefines = exports.drawOverlayDefines = exports.makeLinerGradient = exports.drawDefines = exports.getLaneIndexFromPosition = exports.renderer = exports.setLaneWidth = exports.LaneWidths = exports.scale = void 0;
    Locale = __importStar(Locale);
    Type = __importStar(Type);
    Number = __importStar(Number);
    Model = __importStar(Model);
    UI = __importStar(UI);
    Theme = __importStar(Theme);
    Render = __importStar(Render);
    SVG = __importStar(SVG);
    Comparer = __importStar(Comparer);
    config_json_6 = __importDefault(config_json_6);
    exports.scale = 1.0;
    exports.LaneWidths = [];
    const setLaneWidth = (laneIndex, width) => {
        if (exports.LaneWidths[laneIndex] !== width) {
            exports.LaneWidths[laneIndex] = width;
            Render.markDirty("SIZE");
        }
    };
    exports.setLaneWidth = setLaneWidth;
    const renderer = (model, view, dirty, timeLimit) => {
        if (0 < dirty.size) {
            if (dirty.has(Render.AllItems)) {
                Render.resetDirty(Render.AllItems);
                //dirty.add("DEFINES"); こいつは初回だけで良いのでここでは登録しない。 / EN: This is only necessary for the first time, so do not register it here.
                dirty.add("BACKGROUND");
                dirty.add("ANCHOR_LINE");
                // for (let i = 0; i < Model.data.slides.length; ++i)
                // {
                //     dirty.add(`SLIDE:${i}`);
                // }
                dirty.add("LANE_GARBAGE_COLLECTOR");
                for (let i = 0; i < Model.getAllLaneCount(); ++i) {
                    dirty.add(`LANE:${i}`);
                }
                dirty.add("MENU_LANE");
                // dirty.add("SIZE"); // SIZE はその必要があれば自動的にセットされるのでここではセットしない。 / EN: SIZE will be set automatically if necessary, so do not set it here.
            }
            if (dirty.has("LANE_GARBAGE_COLLECTOR")) {
                // レーンのレンダリングより必ず先に処理しておく必要がある。 / EN: This needs to be processed before rendering the lane.
                (0, exports.garbageCollectLanes)(view);
                dirty.delete("LANE_GARBAGE_COLLECTOR");
            }
            for (const i of dirty) {
                switch (i) {
                    case "SIZE":
                        (0, exports.resize)();
                        break;
                    case "DEFINES":
                        (0, exports.drawDefines)(model, view);
                        break;
                    case "BACKGROUND":
                        const backgroundRect = SVG.makeSure(UI.rulerSvg, {
                            tag: "rect",
                            class: "ruler-background",
                        });
                        SVG.setAttributes(backgroundRect, {
                            x: 0,
                            y: 0,
                            width: Model.getAllLaneCount() * config_json_6.default.render.ruler.laneWidth - Model.data.offset.x,
                            height: UI.rulerSvg.viewBox.baseVal.height,
                            fill: Theme.resolve(config_json_6.default.render.ruler.laneBackgroundColor),
                        });
                        break;
                    case "MENU_LANE":
                        (0, exports.drawMenuLane)(view);
                        break;
                    case "ANCHOR_LINE":
                        (0, exports.drawAnchorLine)(model, view);
                        break;
                    default:
                        if (i.startsWith("LANE:")) {
                            const laneIndex = Number.System.parseInt(i.substring("LANE:".length));
                            const { slide, lane } = Model.getSlideAndLane(laneIndex);
                            if (undefined !== lane) {
                                (0, exports.drawLane)(view, slide, lane);
                            }
                            else {
                                console.warn(`🦋 FIXME: Lane not found for dirty item: ${i}`);
                            }
                        }
                        else {
                            console.warn(`🦋 FIXME: Unknown dirty item: ${i}`);
                        }
                        break;
                }
                Render.resetDirty(i);
                if (undefined !== timeLimit && timeLimit < performance.now()) {
                    break;
                }
            }
        }
    };
    exports.renderer = renderer;
    const getLaneIndexFromPosition = (position) => {
        let accumulatedWidth = 0;
        for (let i = 0; i < exports.LaneWidths.length; ++i) {
            accumulatedWidth += exports.LaneWidths[i];
            if (position < accumulatedWidth) {
                return i;
            }
        }
        return null;
    };
    exports.getLaneIndexFromPosition = getLaneIndexFromPosition;
    const drawDefines = (model, view) => {
        const defs = SVG.makeSure(UI.rulerSvg, {
            tag: "defs",
        });
        (0, exports.drawOverlayDefines)(model, view, defs);
        (0, exports.drawErrorAreaDefines)(model, view, defs);
        (0, exports.drawDenseAreaDefines)(model, view, defs);
    };
    exports.drawDefines = drawDefines;
    const makeLinerGradient = (defs, id, line, stops) => {
        const gradient = SVG.makeSure(defs, {
            tag: "linearGradient",
            id: id,
            x1: line.x1,
            y1: line.y1,
            x2: line.x2,
            y2: line.y2,
        });
        for (const stop of stops) {
            SVG.makeSure(gradient, {
                tag: "stop",
                offset: stop.offset,
                "stop-color": stop.color,
                "stop-opacity": stop.opacity,
            });
        }
        return gradient;
    };
    exports.makeLinerGradient = makeLinerGradient;
    const drawOverlayDefines = (_model, _view, defs) => {
        const backgroundColor = Theme.resolve(config_json_6.default.render.ruler.laneBackgroundColor);
        (0, exports.makeLinerGradient)(defs, "overlay-top-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: backgroundColor, opacity: 1 },
            { offset: "100%", color: backgroundColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "overlay-bottom-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: backgroundColor, opacity: 0 },
            { offset: "100%", color: backgroundColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "overlay-center-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: backgroundColor, opacity: 0 },
            { offset: "50%", color: backgroundColor, opacity: 1 },
            { offset: "100%", color: backgroundColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "overlay-edges-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: backgroundColor, opacity: 1 },
            { offset: "50%", color: backgroundColor, opacity: 0 },
            { offset: "100%", color: backgroundColor, opacity: 1 },
        ]);
    };
    exports.drawOverlayDefines = drawOverlayDefines;
    const drawErrorAreaDefines = (_model, _view, defs) => {
        (0, exports.makeLinerGradient)(defs, "min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.minErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_6.default.render.ruler.minErrorAreaColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.maxErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_6.default.render.ruler.maxErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.minErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_6.default.render.ruler.minErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.maxErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_6.default.render.ruler.maxErrorAreaColor, opacity: 0 },
        ]);
    };
    exports.drawErrorAreaDefines = drawErrorAreaDefines;
    const drawDenseAreaDefines = (_model, _view, defs) => {
        (0, exports.makeLinerGradient)(defs, "upper-dense-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.denseAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_6.default.render.ruler.denseAreaColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "lower-dense-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_6.default.render.ruler.denseAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_6.default.render.ruler.denseAreaColor, opacity: 1 },
        ]);
    };
    exports.drawDenseAreaDefines = drawDenseAreaDefines;
    const makeSureSlide = (slideIndex) => SVG.makeSure(UI.rulerSvg, {
        tag: "g",
        class: "slide-group",
        "data-slide-index": slideIndex,
    });
    exports.makeSureSlide = makeSureSlide;
    // export const drawSlide = (view: Type.View, slide: Type.SlideUnit): void =>
    // {
    //     const slideIndex = Model.getSlideIndex(slide);
    //     const group = makeSureSlide(slideIndex);
    //     group.innerHTML = "";
    //     for(const lane of slide.lanes)
    //     {
    //         drawLane(view, slide, lane);
    //     }
    // };
    const getLeftOfLane = (laneIndex) => exports.LaneWidths.slice(0, laneIndex).reduce((a, b) => a + b, 0) - Model.data.offset.x;
    exports.getLeftOfLane = getLeftOfLane;
    const drawLane = (view, slide, lane) => {
        var _a;
        const slideIndex = Model.getSlideIndex(slide);
        const group = (0, exports.makeSureSlide)(slideIndex);
        const isLastLane = lane === slide.lanes[slide.lanes.length - 1];
        const laneIndex = Model.getLaneIndex(lane);
        const left = (0, exports.getLeftOfLane)(laneIndex);
        const width = config_json_6.default.render.ruler.laneWidth;
        (0, exports.setLaneWidth)(laneIndex, width);
        // const laneBackground = SVG.makeSure
        // (
        //     group,
        //     {
        //         tag: "rect",
        //         class: "lane-background",
        //         "data-lane-index": laneIndex,
        //     },
        //     {
        //         x: left,
        //         y: 0,
        //         width: width,
        //         height: group.ownerSVGElement!.viewBox.baseVal.height,
        //         fill: Theme.resolve(config.render.ruler.laneBackgroundColor),
        //     }
        // );
        const tickGroup = SVG.makeSure(group, {
            tag: "g",
            class: "tick-group",
            "data-lane-index": laneIndex,
        });
        SVG.makeSure(group, {
            tag: "rect",
            class: "lane-label-background",
            "data-lane-index": laneIndex,
        }, {
            x: left + 8,
            y: 8,
            rx: 8,
            ry: 8,
            width: width - 16,
            height: 24,
            fill: Theme.resolve(config_json_6.default.render.ruler.laneLabelBackgroundColor),
        });
        SVG.makeSure(group, {
            tag: "text",
            class: "lane-label",
            "data-lane-index": laneIndex,
        }, {
            x: left + 16,
            y: 26,
            fill: Theme.resolve(config_json_6.default.render.ruler.foregroundColor),
            "font-size": 16,
            textContent: (_a = Locale.resolve(lane.name)) !== null && _a !== void 0 ? _a : `Lane ${laneIndex}`,
        });
        SVG.makeSure(group, {
            tag: "line",
            class: "lane-separator",
            "data-lane-index": laneIndex,
        }, {
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement.viewBox.baseVal.height,
            stroke: isLastLane ?
                Theme.resolve(config_json_6.default.render.ruler.slideSeparatorColor) :
                Theme.resolve(config_json_6.default.render.ruler.laneSeparatorColor),
            "stroke-width": config_json_6.default.render.ruler.laneSeparatorWidth,
        });
        tickGroup.innerHTML = "";
        const content = Model.designTicks(slide, view, lane, Model.makePositionTickWindowFromWindow());
        (0, exports.drawErrorArea)(view, tickGroup, slide, lane);
        (0, exports.drawAreas)(view, tickGroup, slide, lane, content.areas);
        (0, exports.drawTicks)(view, tickGroup, slide, lane, (0, exports.calculateMinimumFractionDigits)(content.ticks));
    };
    exports.drawLane = drawLane;
    const drawAreas = (view, group, slide, lane, areas, indent = 0) => {
        var _a, _b, _c, _d, _e;
        const indentUnit = 20;
        const laneIndex = Model.getLaneIndex(lane);
        const left = (0, exports.getLeftOfLane)(laneIndex) + indent;
        const width = config_json_6.default.render.ruler.laneWidth - indent;
        const isInvert = Model.isInvertLane(lane);
        for (const area of areas) {
            const lowerPosition = undefined === area.lowerBound ?
                ((!isInvert) ? 0 : group.ownerSVGElement.viewBox.baseVal.height) :
                Model.getPositionAt(slide, lane, area.lowerBound, view);
            const upperPosition = undefined === area.upperBound ?
                ((!isInvert) ? group.ownerSVGElement.viewBox.baseVal.height : 0) :
                Model.getPositionAt(slide, lane, area.upperBound, view);
            const y = Math.max(0, (!isInvert) ? lowerPosition : upperPosition);
            const height = Math.min(group.ownerSVGElement.viewBox.baseVal.height - y, (!isInvert) ? upperPosition - y : lowerPosition - y);
            const hasDetails = 0 < ((_a = area.details) !== null && _a !== void 0 ? _a : []).length;
            if (hasDetails) {
                const width = indentUnit;
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "area",
                    x: left,
                    y: y,
                    width,
                    height,
                    fill: area.fill,
                }));
                if ("none" !== ((_b = area.overlay) !== null && _b !== void 0 ? _b : "none")) {
                    group.appendChild(SVG.make({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width,
                        height,
                        fill: `url(#overlay-${area.overlay}-gradient)`,
                    }));
                }
                if (undefined !== area.label) {
                    group.appendChild(SVG.make({
                        tag: "text",
                        class: "area-label",
                        x: left + 16,
                        y: y + height - 8,
                        transform: `rotate(-90, ${left + 16}, ${y + height - 8})`,
                        fill: (_c = area.color) !== null && _c !== void 0 ? _c : Theme.resolve(config_json_6.default.render.ruler.foregroundColor),
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    }));
                }
                (0, exports.drawAreas)(view, group, slide, lane, area.details, indent + indentUnit);
            }
            else {
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "area",
                    x: left,
                    y: y,
                    width,
                    height,
                    fill: area.fill,
                }));
                if ("none" !== ((_d = area.overlay) !== null && _d !== void 0 ? _d : "none")) {
                    group.appendChild(SVG.make({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width,
                        height,
                        fill: `url(#overlay-${area.overlay}-gradient)`,
                    }));
                }
                if (undefined !== area.label) {
                    group.appendChild(SVG.make({
                        tag: "text",
                        class: "area-label",
                        x: left + 8,
                        y: y + (height / 2) + 4,
                        fill: (_e = area.color) !== null && _e !== void 0 ? _e : Theme.resolve(config_json_6.default.render.ruler.foregroundColor),
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    }));
                }
            }
        }
    };
    exports.drawAreas = drawAreas;
    const drawErrorArea = (view, group, slide, lane) => {
        var _a, _b;
        const isInvert = Model.isInvertLane(lane);
        const min = Number.maxMin((_a = Model.getValueAt(slide, lane, (!isInvert) ? 0 : group.ownerSVGElement.viewBox.baseVal.height, view)) === null || _a === void 0 ? void 0 : _a.value);
        if (min <= Number.MIN_VALUE) {
            (0, exports.drawAreas)(view, group, slide, lane, [{
                    lowerBound: undefined,
                    upperBound: Number.MIN_VALUE,
                    fill: (!isInvert) ? "url(#min-error-area-gradient)" : "url(#invert-min-error-area-gradient)"
                }]);
        }
        const max = Number.maxMin((_b = Model.getValueAt(slide, lane, (!isInvert) ? group.ownerSVGElement.viewBox.baseVal.height : 0, view)) === null || _b === void 0 ? void 0 : _b.value);
        if (Number.MAX_VALUE <= max) {
            (0, exports.drawAreas)(view, group, slide, lane, [{
                    lowerBound: Number.MAX_VALUE,
                    upperBound: undefined,
                    fill: (!isInvert) ? "url(#max-error-area-gradient)" : "url(#invert-max-error-area-gradient)"
                }]);
        }
    };
    exports.drawErrorArea = drawErrorArea;
    const makeNumberLabel = (tick) => {
        const { label, minimumFractionDigits } = tick;
        const value = Type.getTickValue(tick);
        const unit = undefined === tick.unit ? "" : ` ${tick.unit}`;
        switch (true) {
            case undefined !== label:
                return Locale.resolve(label);
            case value < 0.000000000001 || 10000000000000 <= value:
                return Number.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 11, maximumSignificantDigits: 11, minimumFractionDigits, }) + unit;
            // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
            default:
                return Number.getNamedNumberLabel(value, undefined, { maximumFractionDigits: Math.max(13, minimumFractionDigits !== null && minimumFractionDigits !== void 0 ? minimumFractionDigits : 13), minimumFractionDigits, }) + unit;
            // return Number.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
        }
    };
    exports.makeNumberLabel = makeNumberLabel;
    const getFractionDigitsFromUnit = (unit) => {
        if (0 < unit) {
            const log10 = Math.log10(unit);
            if (0 <= log10) {
                return undefined;
            }
            else {
                // 本来は Math.round はなく Math.ceil でないといけないが計算誤差により log10 がわずかに大きくなってしまう場合があるため、Math.round を使用する
                //return Math.round(-log10);
                // 計算誤差により log10 がわずかに大きくなってしまう場合があるため、補正の為に 0.001 を引いてから Math.ceil を使用する
                return Math.ceil(-log10 - 0.001);
            }
        }
        return undefined;
    };
    exports.getFractionDigitsFromUnit = getFractionDigitsFromUnit;
    const calculateMinimumFractionDigits = (ticks) => {
        var _a;
        const numericTicks = ticks.filter(i => "number" === typeof i.value && undefined === i.label)
            .filter(i => "long" === i.type || true === i.isShowLabel)
            .sort(Comparer.make(i => i.value));
        if (1 < numericTicks.length) {
            numericTicks[0].minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(numericTicks[1].value - numericTicks[0].value);
            const lastIndex = numericTicks.length - 1;
            numericTicks[lastIndex].minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(numericTicks[lastIndex].value - numericTicks[lastIndex - 1].value);
        }
        for (var i = 1; i < numericTicks.length - 1; ++i) {
            numericTicks[i].minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(Math.max(numericTicks[i].value - numericTicks[i - 1].value, numericTicks[i + 1].value - numericTicks[i].value));
        }
        for (const tick of numericTicks) {
            const selfMinimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(tick.value);
            if (undefined !== selfMinimumFractionDigits) {
                tick.minimumFractionDigits = Math.max(selfMinimumFractionDigits, (_a = tick.minimumFractionDigits) !== null && _a !== void 0 ? _a : selfMinimumFractionDigits);
            }
            if (undefined !== tick.minimumFractionDigits) {
                tick.value = Number.roundE(tick.value, -tick.minimumFractionDigits);
            }
        }
        return ticks;
    };
    exports.calculateMinimumFractionDigits = calculateMinimumFractionDigits;
    const drawTicks = (view, group, slide, lane, ticks) => {
        var _a, _b, _c, _d;
        const isConstantTable = "constant" === lane.type;
        const isPrimaryLane = Model.isPrimaryLane(lane);
        const laneIndex = Model.getLaneIndex(lane);
        const laneContext = Model.getLaneContext(lane);
        const isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
        const width = config_json_6.default.render.ruler.laneWidth;
        ;
        const left = (0, exports.getLeftOfLane)(laneIndex);
        const right = left + width;
        for (const tick of ticks) {
            const value = Type.getTickValue(tick);
            const position = Model.getPositionAt(slide, lane, value, view);
            if (0 <= position && position <= group.ownerSVGElement.viewBox.baseVal.height && "none" !== tick.type) {
                const isPrimaryTick = isPrimaryLane && 1 === value;
                const tickTrait = config_json_6.default.render.ruler.tick[tick.type];
                const color = Theme.resolve((_a = tick.color) !== null && _a !== void 0 ? _a : (isPrimaryTick ? config_json_6.default.render.ruler.primaryTickColor : tickTrait.color));
                const drawLeftTick = !isRootSlide && ("left-end" === laneContext || "center" === laneContext || "single" === laneContext);
                const drawRightTick = isRootSlide || "right-end" === laneContext || "single" === laneContext;
                if (drawLeftTick) {
                    group.appendChild(SVG.make(Object.assign(Object.assign({ tag: "line", class: `tick tick-${tick.type}`, x1: left, y1: position, x2: left + tickTrait.length, y2: position, 
                        // stroke: tickTrait.color,
                        stroke: color, "stroke-width": tickTrait.width, "data-tick-value": value }, (tick.unit ? { "data-tick-unit": tick.unit } : {})), (tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {}))));
                }
                if (drawRightTick) {
                    group.appendChild(SVG.make(Object.assign(Object.assign({ tag: "line", class: `tick tick-${tick.type}`, x1: right, y1: position, x2: right - tickTrait.length, y2: position, 
                        // stroke: tickTrait.color,
                        stroke: color, "stroke-width": tickTrait.width, "data-tick-value": value }, (tick.unit ? { "data-tick-unit": tick.unit } : {})), (tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {}))));
                }
                if (tick.type === "long" || true === tick.isShowLabel) {
                    const tickTrait = config_json_6.default.render.ruler.tick["long"];
                    const drawLabelDirection = !drawLeftTick ? "right" :
                        !drawRightTick ? "left" :
                            value < 1 ? "left" : "right";
                    const x = "left" === drawLabelDirection ?
                        // left + tickTrait.length + 4:
                        left + tickTrait.length + 8 :
                        right - tickTrait.length - 4;
                    const y = position + 4;
                    const [labelHead, ...exponentParts] = (0, exports.makeNumberLabel)(tick).split(config_json_6.default.symbols.power);
                    const text = SVG.make(Object.assign(Object.assign(Object.assign({ tag: "text", class: "tick-label", x: x, y: y, 
                        //fill: tickTrait.color,
                        transform: isConstantTable ? `rotate(-45 ${x} ${y})` : undefined, fill: color, "font-size": 12, "text-anchor": "left" === drawLabelDirection ? "start" : "end", "data-tick-value": value }, (tick.unit ? { "data-tick-unit": tick.unit } : {})), (tick.label ? { "data-tick-label": Locale.resolve(tick.label) } : {})), { textContent: labelHead }));
                    if (0 < exponentParts.length) {
                        for (const i of exponentParts) {
                            const headNumbers = (_c = (_b = i.match(/^[\+\-]?\d+([,\.]\d+)*/)) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : i;
                            const tailText = i.substring((_d = headNumbers.length) !== null && _d !== void 0 ? _d : 0);
                            const headTspan = SVG.make({
                                tag: "tspan",
                                class: "tick-label exponent",
                                fill: color,
                                dy: -6,
                                "font-size": 9,
                                textContent: headNumbers,
                            });
                            text.appendChild(headTspan);
                            const tailTspan = SVG.make({
                                tag: "tspan",
                                class: "tick-label description",
                                fill: color,
                                // dx: 4,
                                dy: 6,
                                "font-size": 12,
                                textContent: tailText,
                            });
                            text.appendChild(tailTspan);
                        }
                    }
                    group.appendChild(text);
                    if (tick.behindTickCount && 0 < tick.behindTickCount) {
                        text.appendChild(SVG.make({
                            tag: "tspan",
                            class: "tick-label behind-tick-count",
                            fill: "#888888",
                            "font-size": 10.5,
                            textContent: ` (+${tick.behindTickCount})`,
                        }));
                    }
                }
            }
        }
    };
    exports.drawTicks = drawTicks;
    const garbageCollectLanes = (_view) => {
        const slideGroups = UI.rulerSvg.querySelectorAll(".slide-group");
        let isStartRemove = false;
        for (const slideGroup of Array.from(slideGroups)) {
            const slideIndex = Number.System.parseInt(slideGroup.dataset.slideIndex);
            if (isStartRemove || undefined === Model.data.slides[slideIndex]) {
                slideGroup.remove();
            }
            else {
                for (const i of Array.from(slideGroup.children)) {
                    const laneIndex = i.getAttribute("data-lane-index");
                    if (null !== laneIndex) {
                        if (isStartRemove) {
                            i.remove();
                        }
                        else {
                            const { slide, lane } = Model.getSlideAndLane(Number.System.parseInt(laneIndex));
                            if (undefined === lane || slide !== Model.data.slides[slideIndex]) {
                                i.remove();
                                isStartRemove = true;
                            }
                        }
                    }
                }
            }
        }
    };
    exports.garbageCollectLanes = garbageCollectLanes;
    let anchorDragStartY = 0;
    let initialDraggingAnchorPosition = undefined;
    const getReferenceLaneIndexFromEvent = (event) => {
        if ("NOSNAP" !== event && "clientX" in event) {
            return (0, exports.getLaneIndexFromPosition)(event.clientX + Model.data.offset.x);
        }
        else {
            return null;
        }
    };
    exports.getReferenceLaneIndexFromEvent = getReferenceLaneIndexFromEvent;
    const regulateReferencePositions = (referencePositions) => Array.from(new Set(referencePositions))
        .sort(Comparer.make(a => a));
    exports.regulateReferencePositions = regulateReferencePositions;
    const snapPosition = (position, referencePositions) => {
        let result = position;
        let minDistance = Number.MAX_VALUE;
        for (const targetPosition of referencePositions) {
            const distance = Math.abs(position - targetPosition);
            if (distance < minDistance) {
                minDistance = distance;
                result = targetPosition;
            }
        }
        return result;
    };
    exports.snapPosition = snapPosition;
    const nextPosition = (position, referencePositions, direction) => {
        let result = position;
        let minDistance = Number.MAX_VALUE;
        for (const targetPosition of referencePositions) {
            const distance = direction === "PREVIOUS" ? position - targetPosition : targetPosition - position;
            if (0 < distance && distance < minDistance) {
                minDistance = distance;
                result = targetPosition;
            }
        }
        return result;
    };
    exports.nextPosition = nextPosition;
    const getAreaPositions = (slide, lane, view, areas) => {
        var _a;
        const positions = [];
        for (const area of areas) {
            if (undefined !== area.lowerBound) {
                const lowerPosition = Model.getPositionAt(slide, lane, area.lowerBound, view);
                positions.push(lowerPosition);
            }
            if (undefined !== area.upperBound) {
                const upperPosition = Model.getPositionAt(slide, lane, area.upperBound, view);
                positions.push(upperPosition);
            }
            if (0 < ((_a = area.details) !== null && _a !== void 0 ? _a : []).length) {
                positions.push(...(0, exports.getAreaPositions)(slide, lane, view, area.details));
            }
        }
        return positions;
    };
    exports.getAreaPositions = getAreaPositions;
    const snapVerticalPosition = (event, view, position, referenceLaneIndex) => {
        var _a;
        if ("NOSNAP" !== event && !event.shiftKey) {
            const laneIndex = (_a = referenceLaneIndex !== null && referenceLaneIndex !== void 0 ? referenceLaneIndex : (0, exports.getReferenceLaneIndexFromEvent)(event)) !== null && _a !== void 0 ? _a : 0;
            const { slide, lane } = Model.getSlideAndLane(laneIndex);
            const tickWindow = Model.makePositionTickWindowFromPositionAndWidth(position, 32);
            const content = Model.designTicks(slide, view, lane, tickWindow);
            const tickPositions = content.ticks.map(i => Model.getPositionAt(slide, lane, i.value, view));
            tickPositions.push(...(0, exports.getAreaPositions)(slide, lane, view, content.areas));
            tickPositions.push(Model.getCursorPosition(view));
            console.log(`snapVerticalPosition.self.content.areas: ${content.areas.length}`);
            if ("number" === typeof referenceLaneIndex) {
                const selfLaneIndex = referenceLaneIndex + 1;
                if (selfLaneIndex < Model.getAllLaneCount()) {
                    const { slide: selfSlide, lane: selfLane } = Model.getSlideAndLane(selfLaneIndex);
                    const currentPosition = Model.getPositionAt(slide, lane, selfSlide.anchor, view);
                    const delta = position - currentPosition;
                    const oppositePosition = Model.getPositionAt(slide, lane, 1, view);
                    const tickWindow = Model.makePositionTickWindowFromPositionAndWidth(oppositePosition - delta, 32);
                    const content = Model.designTicks(selfSlide, view, selfLane, tickWindow);
                    tickPositions.push(...content.ticks
                        .map(i => Model.getPositionAt(selfSlide, selfLane, i.value, view))
                        .map(i => currentPosition + (oppositePosition - i)));
                    // これはあってもいいけど、多分、機能する事がない。
                    // content.areas.forEach
                    // (
                    //     area =>
                    //     {
                    //         if (undefined !== area.lowerBound)
                    //         {
                    //             const lowerPosition = Model.getPositionAt(selfSlide, selfLane, area.lowerBound, view);
                    //             tickPositions.push(currentPosition +(oppositePosition -lowerPosition));
                    //         }
                    //         if (undefined !== area.upperBound)
                    //         {
                    //             const upperPosition = Model.getPositionAt(selfSlide, selfLane, area.upperBound, view);
                    //             tickPositions.push(currentPosition +(oppositePosition -upperPosition));
                    //         }
                    //     }
                    // );
                }
            }
            return (0, exports.snapPosition)(position, (0, exports.regulateReferencePositions)(tickPositions));
        }
        else {
            return position;
        }
    };
    exports.snapVerticalPosition = snapVerticalPosition;
    const snapHorizontalPosition = (event, position) => {
        if ("NOSNAP" !== event && !event.shiftKey) {
            const referencePositions = [];
            referencePositions.push(0);
            const max = Math.max(0, (0, exports.getRulerWidth)() - (window.innerWidth - (UI.rulerNewSlidePanel.clientWidth + UI.rulerHelpPanel.clientWidth)));
            if (0 < max) {
                let accumulatedWidth = 0;
                for (const laneWidth of exports.LaneWidths) {
                    // for(var i = 0; i < 3; ++i)
                    // {
                    //     accumulatedWidth += laneWidth /4;
                    //     if (accumulatedWidth < max)
                    //     {
                    //         referencePositions.push(accumulatedWidth);
                    //     }
                    // }
                    accumulatedWidth += laneWidth;
                    if (accumulatedWidth < max) {
                        referencePositions.push(accumulatedWidth);
                    }
                    else {
                        break;
                    }
                }
                referencePositions.push(max);
            }
            return (0, exports.snapPosition)(position, referencePositions);
        }
        else {
            return position;
        }
    };
    exports.snapHorizontalPosition = snapHorizontalPosition;
    const slideCursor = (model, view, event, position) => {
        var _a, _b, _c, _d;
        const { slide, lane } = Model.getRootSlideAndRootLane();
        const minPosition = (_a = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE;
        const maxPosition = (_b = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
        const snappedPosition = (0, exports.snapVerticalPosition)(event, view, position);
        const resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
        model.cursor = (_d = (_c = Model.getValueAt(slide, lane, resultPosition, view)) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : model.cursor;
        Render.markDirty("ANCHOR_LINE");
        return snappedPosition - position;
    };
    exports.slideCursor = slideCursor;
    const drawAnchorLine = (model, view) => {
        const { slide, lane } = Model.getRootSlideAndRootLane();
        const svg = UI.rulerOverlay;
        const color = config_json_6.default.render.ruler.lineColor;
        const handleRadius = 24;
        const lineOnBackground = SVG.makeSure(UI.rulerSvg, {
            tag: "line",
            class: "anchor-line",
        });
        const lineOnOverlay = SVG.makeSure(UI.rulerOverlay, {
            tag: "line",
            class: "anchor-line",
        });
        const events = {
            pointermove: {
                listener: event => {
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        const deltaY = event.clientY - anchorDragStartY;
                        (0, exports.slideCursor)(model, view, event, initialDraggingAnchorPosition + deltaY);
                    }
                },
                options: {
                    passive: false,
                }
            },
            pointerup: {
                listener: event => {
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        const deltaY = event.clientY - anchorDragStartY;
                        (0, exports.slideCursor)(model, view, event, initialDraggingAnchorPosition + deltaY);
                    }
                    SVG.removeEvents(UI.rulerOverlay, events);
                    SVG.setAttribute(UI.rulerOverlay, "pointer-events", "none");
                },
                options: {
                    passive: false,
                }
            },
            pointercancel: {
                listener: event => {
                    var _a, _b;
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        const position = initialDraggingAnchorPosition;
                        model.cursor = (_b = (_a = Model.getValueAt(slide, lane, position, view)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : model.cursor;
                        initialDraggingAnchorPosition = undefined;
                        Render.markDirty();
                    }
                    SVG.removeEvents(UI.rulerOverlay, events);
                    SVG.setAttribute(UI.rulerOverlay, "pointer-events", "none");
                },
                options: {
                    passive: false,
                }
            },
        };
        const handle = SVG.makeSure(svg, {
            tag: "circle",
            class: "anchor-drag-handle",
            "pointer-events": "auto",
            events: {
                pointerdown: {
                    listener: event => {
                        initialDraggingAnchorPosition = Model.getPositionAt(slide, lane, model.cursor, view);
                        if (undefined !== initialDraggingAnchorPosition) {
                            event.preventDefault();
                            event.stopPropagation();
                            anchorDragStartY = event.clientY;
                            SVG.addEvents(UI.rulerOverlay, events);
                            SVG.setAttribute(UI.rulerOverlay, "pointer-events", "auto");
                        }
                    },
                    options: {
                        passive: false,
                    }
                },
            },
        });
        const position = Model.getPositionAt(slide, lane, model.cursor, view);
        if (0 <= position && position <= UI.rulerSvg.viewBox.baseVal.height) {
            //const color = "red";
            SVG.setAttributes(lineOnBackground, {
                visibility: "visible",
                x1: 0,
                y1: position,
                x2: UI.rulerSvg.viewBox.baseVal.width,
                y2: position,
                stroke: color,
                "stroke-width": config_json_6.default.render.ruler.lineWidth,
            });
            SVG.setAttributes(lineOnOverlay, {
                visibility: "visible",
                x1: UI.rulerSvg.viewBox.baseVal.width,
                y1: position,
                x2: UI.rulerOverlay.viewBox.baseVal.width - (handleRadius * 2),
                y2: position,
                stroke: color,
                "stroke-width": config_json_6.default.render.ruler.lineWidth,
            });
            SVG.setAttributes(handle, {
                cx: svg.viewBox.baseVal.width - handleRadius,
                cy: position,
                r: handleRadius,
                fill: color,
            });
        }
        else {
            SVG.setAttributes(lineOnBackground, {
                visibility: "hidden",
            });
            SVG.setAttributes(lineOnOverlay, {
                visibility: "hidden",
            });
            if (position < 0) {
                SVG.setAttributes(handle, {
                    cx: svg.viewBox.baseVal.width - handleRadius,
                    cy: 0,
                    r: handleRadius,
                    fill: color,
                });
            }
            else {
                SVG.setAttributes(handle, {
                    cx: svg.viewBox.baseVal.width - handleRadius,
                    cy: svg.viewBox.baseVal.height,
                    r: handleRadius,
                    fill: color,
                });
            }
        }
    };
    exports.drawAnchorLine = drawAnchorLine;
    const drawMenuLane = (_view) => {
        const laneIndex = Model.getAllLaneCount();
        const left = (0, exports.getLeftOfLane)(laneIndex);
        UI.rulerNewSlidePanel.style.left = `${left}px`;
        UI.rulerHelpPanel.style.left = `${UI.rulerNewSlidePanel.clientWidth + left}px`;
    };
    exports.drawMenuLane = drawMenuLane;
    const resize = () => {
        const width = Math.min(document.body.clientWidth, (0, exports.getRulerWidth)());
        SVG.setAttributes(UI.rulerSvg, {
            width: width,
            height: document.body.clientHeight,
            viewBox: `0 0 ${width} ${document.body.clientHeight}`,
        });
        SVG.setAttributes(UI.rulerOverlay, {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`,
        });
    };
    exports.resize = resize;
    const getRulerWidth = () => exports.LaneWidths.reduce((a, b) => a + b, 0);
    exports.getRulerWidth = getRulerWidth;
    const initialize = () => {
        Render.markDirty("DEFINES");
        Render.markDirty("SIZE");
        // resize();
    };
    exports.initialize = initialize;
});
define("script/json-eval-updater", ["require", "exports", "script/url", "script/type", "script/number", "script/time", "script/ui", "script/model", "script/view", "script/ruler", "script/render", "resource/config"], function (require, exports, Url, Type, Number, Time, UI, Model, View, Ruler, Render, config_json_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.saveJson = exports.updateJsonWithEval = exports.roundE = exports.frequencyToEV = exports.frequencyToWaveLength = exports.waveLengthToFrequency = exports.midiNoteToFrequency = exports.nestEvalUpdate = exports.dummy = void 0;
    Url = __importStar(Url);
    Type = __importStar(Type);
    Number = __importStar(Number);
    Time = __importStar(Time);
    UI = __importStar(UI);
    Model = __importStar(Model);
    View = __importStar(View);
    Ruler = __importStar(Ruler);
    Render = __importStar(Render);
    config_json_7 = __importDefault(config_json_7);
    exports.dummy = {
        Url,
        Type,
        Time,
        UI,
        Model,
        View,
        Event,
        Ruler,
        Render,
        config: config_json_7.default
    };
    const nestEvalUpdate = (obj, getList, updater, getChild) => {
        const list = getList(obj);
        if (list !== undefined) {
            for (let i of list) {
                const child = getChild(i);
                if (child !== undefined) {
                    (0, exports.nestEvalUpdate)(child, getList, updater, getChild);
                }
                updater(i);
            }
        }
        return obj;
    };
    exports.nestEvalUpdate = nestEvalUpdate;
    const midiNoteToFrequency = (midiNote) => 440 * Math.pow(2, (midiNote - 69) / 12);
    exports.midiNoteToFrequency = midiNoteToFrequency;
    const c = 299792458; // 光速 / EN: speed of light in vacuum (m/s)
    const h = 6.62607015e-34; // プランク定数 / EN: Planck constant (J·s)
    const ev = 1.602176634e-19; // 電子ボルト / EN: electron volt (J)
    const waveLengthToFrequency = (wavelength) => "number" === typeof wavelength ? c / wavelength : wavelength;
    exports.waveLengthToFrequency = waveLengthToFrequency;
    const frequencyToWaveLength = (frequency) => "number" === typeof frequency ? c / frequency : frequency;
    exports.frequencyToWaveLength = frequencyToWaveLength;
    const frequencyToEV = (frequency) => "number" === typeof frequency ? (h / ev) * frequency : frequency;
    exports.frequencyToEV = frequencyToEV;
    exports.roundE = Number.roundE;
    const updateJsonWithEval = (json, path) => {
        // console.log(`Updating JSON with eval: ${path ?? "root"}`);
        if ("object" === typeof json && null !== json) {
            if (Array.isArray(json)) {
                // console.log(`Processing array at ${path ?? "root"} with length ${json.length}`);
                return json.map((item, index) => (0, exports.updateJsonWithEval)(item, `${path !== null && path !== void 0 ? path : ""}[${index}]`));
            }
            else {
                // console.log(`Processing object at ${path ?? "root"} with keys: ${Object.keys(json).join(", ")}`);
                const result = {};
                for (const key of Object.keys(json)) {
                    const value = json[key];
                    result[key] = (0, exports.updateJsonWithEval)(value, `${path !== null && path !== void 0 ? path : ""}.${key}`);
                }
                if ("$source-eval" in result) {
                    const source = result["$source-eval"];
                    if ("object" === typeof source && null !== source && !Array.isArray(source)) {
                        for (const key of Object.keys(source)) {
                            const currentPath = `${path !== null && path !== void 0 ? path : ""}.$source-eval.${key}`;
                            const value = source[key];
                            if ("string" === typeof value) {
                                try {
                                    const evalResult = eval(value);
                                    if (!currentPath.startsWith("$SILENT")) {
                                        console.log(`Evaluated ${currentPath}: ${value} =>`, evalResult);
                                    }
                                    result[key] = evalResult;
                                }
                                catch (error) {
                                    console.error(`Error evaluating ${currentPath}: ${value}`, error);
                                }
                            }
                            else {
                                console.warn(`Invalid ${currentPath} value: ${value}`);
                            }
                        }
                    }
                    else {
                        console.warn(`Invalid ${path !== null && path !== void 0 ? path : ""}.$source-eval value: ${source}`);
                    }
                }
                return result;
            }
        }
        return json;
    };
    exports.updateJsonWithEval = updateJsonWithEval;
    const saveJson = (json) => {
        var _a;
        const filename = (_a = json["$file-name"]) !== null && _a !== void 0 ? _a : "updated.json";
        const blob = new Blob([JSON.stringify(json, null, 4)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    exports.saveJson = saveJson;
});
define("resource/digit/$si", [], {
    "label": {
        "en": "SI prefix",
        "ja": "SI 接頭語"
    },
    "digits": [
        {
            "exponent": -30,
            "symbol": "q",
            "label": {
                "en": "quecto-",
                "ja": "クエクト"
            }
        },
        {
            "exponent": -27,
            "symbol": "r",
            "label": {
                "en": "ronto-",
                "ja": "ロント"
            }
        },
        {
            "exponent": -24,
            "symbol": "y",
            "label": {
                "en": "yocto-",
                "ja": "ヨクト"
            }
        },
        {
            "exponent": -21,
            "symbol": "z",
            "label": {
                "en": "zepto-",
                "ja": "ゼプト"
            }
        },
        {
            "exponent": -18,
            "symbol": "a",
            "label": {
                "en": "atto-",
                "ja": "アト"
            }
        },
        {
            "exponent": -15,
            "symbol": "f",
            "label": {
                "en": "femto-",
                "ja": "フェムト"
            }
        },
        {
            "exponent": -12,
            "symbol": "p",
            "label": {
                "en": "pico-",
                "ja": "ピコ"
            }
        },
        {
            "exponent": -9,
            "symbol": "n",
            "label": {
                "en": "nano-",
                "ja": "ナノ"
            }
        },
        {
            "exponent": -6,
            "symbol": "μ",
            "label": {
                "en": "micro-",
                "ja": "マイクロ"
            }
        },
        {
            "exponent": -3,
            "symbol": "m",
            "label": {
                "en": "milli-",
                "ja": "ミリ"
            }
        },
        {
            "exponent": -2,
            "symbol": "c",
            "label": {
                "en": "centi-",
                "ja": "センチ"
            }
        },
        {
            "exponent": -1,
            "symbol": "d",
            "label": {
                "en": "deci-",
                "ja": "デシ"
            }
        },
        {
            "exponent": 1,
            "symbol": "da",
            "label": {
                "en": "deca-",
                "ja": "デカ"
            }
        },
        {
            "exponent": 2,
            "symbol": "h",
            "label": {
                "en": "hecto-",
                "ja": "ヘクト"
            }
        },
        {
            "exponent": 3,
            "symbol": "k",
            "label": {
                "en": "kilo-",
                "ja": "キロ"
            }
        },
        {
            "exponent": 6,
            "symbol": "M",
            "label": {
                "en": "mega-",
                "ja": "メガ"
            }
        },
        {
            "exponent": 9,
            "symbol": "G",
            "label": {
                "en": "giga-",
                "ja": "ギガ"
            }
        },
        {
            "exponent": 12,
            "symbol": "T",
            "label": {
                "en": "tera-",
                "ja": "テラ"
            }
        },
        {
            "exponent": 15,
            "symbol": "P",
            "label": {
                "en": "peta-",
                "ja": "ペタ"
            }
        },
        {
            "exponent": 18,
            "symbol": "E",
            "label": {
                "en": "exa-",
                "ja": "エクサ"
            }
        },
        {
            "exponent": 21,
            "symbol": "Z",
            "label": {
                "en": "zetta-",
                "ja": "ゼタ"
            }
        },
        {
            "exponent": 24,
            "symbol": "Y",
            "label": {
                "en": "yotta-",
                "ja": "ヨタ"
            }
        },
        {
            "exponent": 27,
            "symbol": "R",
            "label": {
                "en": "ronna-",
                "ja": "ロナ"
            }
        },
        {
            "exponent": 30,
            "symbol": "Q",
            "label": {
                "en": "quetta-",
                "ja": "クエタ"
            }
        }
    ]
});
define("resource/digit/en", [], {
    "label": "English",
    "digits": [
        {
            "exponent": -123,
            "label": "quadragintillionth"
        },
        {
            "exponent": -120,
            "label": "novemtrigintillionth"
        },
        {
            "exponent": -117,
            "label": "octotrigintillionth"
        },
        {
            "exponent": -114,
            "label": "septentrigintillionth"
        },
        {
            "exponent": -111,
            "label": "sextrigintillionth"
        },
        {
            "exponent": -108,
            "label": "quintrigintillionth"
        },
        {
            "exponent": -105,
            "label": "quattuortrigintillionth"
        },
        {
            "exponent": -102,
            "label": "tretrigintillionth"
        },
        {
            "exponent": -100,
            "label": "googolth"
        },
        {
            "exponent": -99,
            "label": "duotrigintillionth"
        },
        {
            "exponent": -96,
            "label": "untrigintillionth"
        },
        {
            "exponent": -93,
            "label": "trigintillionth"
        },
        {
            "exponent": -90,
            "label": "novemvigintillionth"
        },
        {
            "exponent": -87,
            "label": "octovigintillionth"
        },
        {
            "exponent": -84,
            "label": "septenvigintillionth"
        },
        {
            "exponent": -81,
            "label": "sexvigintillionth"
        },
        {
            "exponent": -78,
            "label": "quinvigintillionth"
        },
        {
            "exponent": -75,
            "label": "quattuorvigintillionth"
        },
        {
            "exponent": -72,
            "label": "trevigintillionth"
        },
        {
            "exponent": -69,
            "label": "duovigintillionth"
        },
        {
            "exponent": -66,
            "label": "unvigintillionth"
        },
        {
            "exponent": -63,
            "label": "vigintillionth"
        },
        {
            "exponent": -60,
            "label": "novemdecillionth"
        },
        {
            "exponent": -57,
            "label": "octodecillionth"
        },
        {
            "exponent": -54,
            "label": "septendecillionth"
        },
        {
            "exponent": -51,
            "label": "sexdecillionth"
        },
        {
            "exponent": -48,
            "label": "quindecillionth"
        },
        {
            "exponent": -45,
            "label": "quattuordecillionth"
        },
        {
            "exponent": -42,
            "label": "tredecillionth"
        },
        {
            "exponent": -39,
            "label": "duodecillionth"
        },
        {
            "exponent": -36,
            "label": "undecillionth"
        },
        {
            "exponent": -33,
            "label": "decillionth"
        },
        {
            "exponent": -30,
            "label": "nonillionth"
        },
        {
            "exponent": -27,
            "label": "octillionth"
        },
        {
            "exponent": -24,
            "label": "septillionth"
        },
        {
            "exponent": -21,
            "label": "sextillionth"
        },
        {
            "exponent": -18,
            "label": "quintillionth"
        },
        {
            "exponent": -15,
            "label": "quadrillionth"
        },
        {
            "exponent": -12,
            "label": "trillionth"
        },
        {
            "exponent": -9,
            "label": "billionth"
        },
        {
            "exponent": -6,
            "label": "millionth"
        },
        {
            "exponent": -3,
            "label": "thousandth"
        },
        {
            "exponent": -2,
            "label": "hundredth"
        },
        {
            "exponent": -1,
            "label": "tenth"
        },
        {
            "exponent": 1,
            "label": "ten"
        },
        {
            "exponent": 2,
            "label": "hundred"
        },
        {
            "exponent": 3,
            "label": "thousand"
        },
        {
            "exponent": 6,
            "label": "million"
        },
        {
            "exponent": 9,
            "label": "billion"
        },
        {
            "exponent": 12,
            "label": "trillion"
        },
        {
            "exponent": 15,
            "label": "quadrillion"
        },
        {
            "exponent": 18,
            "label": "quintillion"
        },
        {
            "exponent": 21,
            "label": "sextillion"
        },
        {
            "exponent": 24,
            "label": "septillion"
        },
        {
            "exponent": 27,
            "label": "octillion"
        },
        {
            "exponent": 30,
            "label": "nonillion"
        },
        {
            "exponent": 33,
            "label": "decillion"
        },
        {
            "exponent": 36,
            "label": "undecillion"
        },
        {
            "exponent": 39,
            "label": "duodecillion"
        },
        {
            "exponent": 42,
            "label": "tredecillion"
        },
        {
            "exponent": 45,
            "label": "quattuordecillion"
        },
        {
            "exponent": 48,
            "label": "quindecillion"
        },
        {
            "exponent": 51,
            "label": "sexdecillion"
        },
        {
            "exponent": 54,
            "label": "septendecillion"
        },
        {
            "exponent": 57,
            "label": "octodecillion"
        },
        {
            "exponent": 60,
            "label": "novemdecillion"
        },
        {
            "exponent": 63,
            "label": "vigintillion"
        },
        {
            "exponent": 66,
            "label": "unvigintillion"
        },
        {
            "exponent": 69,
            "label": "duovigintillion"
        },
        {
            "exponent": 72,
            "label": "trevigintillion"
        },
        {
            "exponent": 75,
            "label": "quattuorvigintillion"
        },
        {
            "exponent": 78,
            "label": "quinvigintillion"
        },
        {
            "exponent": 81,
            "label": "sexvigintillion"
        },
        {
            "exponent": 84,
            "label": "septenvigintillion"
        },
        {
            "exponent": 87,
            "label": "octovigintillion"
        },
        {
            "exponent": 90,
            "label": "novemvigintillion"
        },
        {
            "exponent": 93,
            "label": "trigintillion"
        },
        {
            "exponent": 96,
            "label": "untrigintillion"
        },
        {
            "exponent": 99,
            "label": "duotrigintillion"
        },
        {
            "exponent": 100,
            "label": "googol"
        },
        {
            "exponent": 102,
            "label": "tretrigintillion"
        },
        {
            "exponent": 105,
            "label": "quattuortrigintillion"
        },
        {
            "exponent": 108,
            "label": "quintrigintillion"
        },
        {
            "exponent": 111,
            "label": "sextrigintillion"
        },
        {
            "exponent": 114,
            "label": "septentrigintillion"
        },
        {
            "exponent": 117,
            "label": "octotrigintillion"
        },
        {
            "exponent": 120,
            "label": "novemtrigintillion"
        },
        {
            "exponent": 123,
            "label": "quadragintillion"
        }
    ]
});
define("resource/digit/ja", [], {
    "label": "日本語",
    "digits": [
        {
            "exponent": -24,
            "label": "涅槃寂静"
        },
        {
            "exponent": -23,
            "label": "阿摩羅"
        },
        {
            "exponent": -22,
            "label": "阿頼耶"
        },
        {
            "exponent": -21,
            "label": "清浄"
        },
        {
            "exponent": -20,
            "label": "空虚"
        },
        {
            "exponent": -19,
            "label": "六徳"
        },
        {
            "exponent": -18,
            "label": "刹那"
        },
        {
            "exponent": -17,
            "label": "弾指"
        },
        {
            "exponent": -16,
            "label": "瞬息"
        },
        {
            "exponent": -15,
            "label": "須臾"
        },
        {
            "exponent": -14,
            "label": "逡巡"
        },
        {
            "exponent": -13,
            "label": "模糊"
        },
        {
            "exponent": -12,
            "label": "漠"
        },
        {
            "exponent": -11,
            "label": "渺"
        },
        {
            "exponent": -10,
            "label": "埃"
        },
        {
            "exponent": -9,
            "label": "塵"
        },
        {
            "exponent": -8,
            "label": "沙"
        },
        {
            "exponent": -7,
            "label": "繊"
        },
        {
            "exponent": -6,
            "label": "微"
        },
        {
            "exponent": -5,
            "label": "忽"
        },
        {
            "exponent": -4,
            "label": "糸"
        },
        {
            "exponent": -3,
            "label": "毛"
        },
        {
            "exponent": -2,
            "label": "厘"
        },
        {
            "exponent": -1,
            "label": "分"
        },
        {
            "exponent": 1,
            "label": "十"
        },
        {
            "exponent": 2,
            "label": "百"
        },
        {
            "exponent": 3,
            "label": "千"
        },
        {
            "exponent": "4",
            "label": "万"
        },
        {
            "exponent": "8",
            "label": "億"
        },
        {
            "exponent": "12",
            "label": "兆"
        },
        {
            "exponent": "16",
            "label": "京"
        },
        {
            "exponent": "20",
            "label": "垓"
        },
        {
            "exponent": "24",
            "label": "𥝱"
        },
        {
            "exponent": "28",
            "label": "穣"
        },
        {
            "exponent": "32",
            "label": "溝"
        },
        {
            "exponent": "36",
            "label": "澗"
        },
        {
            "exponent": "40",
            "label": "正"
        },
        {
            "exponent": "44",
            "label": "載"
        },
        {
            "exponent": "48",
            "label": "極"
        },
        {
            "exponent": "52",
            "label": "恒河沙"
        },
        {
            "exponent": "56",
            "label": "阿僧祇"
        },
        {
            "exponent": "60",
            "label": "那由他"
        },
        {
            "exponent": "64",
            "label": "不可思議"
        },
        {
            "exponent": "68",
            "label": "無量大数"
        }
    ]
});
define("resource/constant/size", [], {
    "$file-name": "size.json",
    "label": {
        "en": "Size",
        "ja": "サイズ"
    },
    "unit": {
        "symbol": "m",
        "label": {
            "en": "meter",
            "ja": "メートル"
        }
    },
    "ticks": [
        {
            "value": 1.616255e-35,
            "label": {
                "en": "planck length",
                "ja": "プランク長"
            },
            "priority": 0
        },
        {
            "value": 1.0e-18,
            "label": {
                "en": "elementary particle",
                "ja": "素粒子"
            },
            "priority": 1
        },
        {
            "value": 1.0e-15,
            "label": {
                "en": "electron",
                "ja": "電子"
            },
            "priority": 1
        },
        {
            "value": 1.0e-10,
            "label": {
                "en": "hydrogen atom",
                "ja": "水素原子"
            },
            "priority": 1
        },
        {
            "value": 8.0e-5,
            "label": {
                "en": "typical human hair width",
                "ja": "典型的な人間の髪の幅"
            },
            "priority": 2
        },
        {
            "value": 2.54e-2,
            "label": {
                "en": "1 inch",
                "ja": "1 インチ"
            },
            "priority": 0
        },
        {
            "value": 0.3048,
            "label": {
                "en": "1 foot",
                "ja": "1 フィート"
            },
            "priority": 0
        },
        {
            "value": 0.9144,
            "label": {
                "en": "1 yard",
                "ja": "1 ヤード"
            },
            "priority": 0
        },
        {
            "value": 12.68,
            "label": {
                "en": "VF-1 Valkyrie height",
                "ja": "VF-1 バルキリーの全高"
            },
            "color": "$FICTION",
            "priority": 5
        },
        {
            "value": 18,
            "label": {
                "en": "RX-78-2 Gundam height",
                "ja": "RX-78-2 ガンダムの全高"
            },
            "color": "$FICTION",
            "priority": 5
        },
        {
            "value": 24,
            "label": {
                "en": "Blue whale length",
                "ja": "シロナガスクジラの全長"
            },
            "priority": 2
        },
        {
            "value": 40,
            "label": {
                "en": "Ultraman height",
                "ja": "ウルトラマンの身長"
            },
            "color": "$FICTION",
            "priority": 5
        },
        {
            "value": 83,
            "label": {
                "en": "General Sherman Tree height",
                "ja": "シャーマン将軍の木の高さ"
            },
            "priority": 2
        },
        {
            "value": 120,
            "label": {
                "en": "Ushiku Daibutsu height",
                "ja": "牛久大仏の全高"
            },
            "priority": 2
        },
        {
            "value": 330,
            "label": {
                "en": "Eiffel Tower height",
                "ja": "エッフェル塔の高さ"
            },
            "priority": 2
        },
        {
            "value": 333,
            "label": {
                "en": "Tokyo Tower height",
                "ja": "東京タワーの高さ"
            },
            "priority": 2
        },
        {
            "value": 599,
            "label": {
                "en": "Mount Takao height",
                "ja": "高尾山の高さ"
            },
            "priority": 2
        },
        {
            "value": 634,
            "label": {
                "en": "Tokyo Skytree height",
                "ja": "東京スカイツリーの高さ"
            },
            "priority": 2
        },
        {
            "value": 838,
            "label": {
                "en": "Burj Khalifa height",
                "ja": "ブルジュ・ハリファの高さ"
            },
            "priority": 2
        },
        {
            "value": 1210,
            "label": {
                "en": "SDF-1 Macross length",
                "ja": "SDF-1 マクロスの全長"
            },
            "color": "$FICTION",
            "priority": 5
        },
        {
            "value": 1609.344,
            "label": {
                "en": "1 mile",
                "ja": "1 マイル"
            },
            "priority": 0
        },
        {
            "value": 1741,
            "label": {
                "en": "Lake Baikal depth",
                "ja": "バイカル湖の深さ"
            },
            "priority": 2
        },
        {
            "value": 3776.12,
            "label": {
                "en": "Mount Fuji height",
                "ja": "富士山の高さ"
            },
            "priority": 2
        },
        {
            "value": 6000,
            "label": {
                "en": "height of tropopause at poles",
                "ja": "両極での対流圏界面の高さ"
            },
            "priority": 2
        },
        {
            "value": 8848.86,
            "label": {
                "en": "Mount Everest height",
                "ja": "エベレスト山の高さ"
            },
            "priority": 2
        },
        {
            "value": 10983,
            "label": {
                "en": "Mariana Trench depth",
                "ja": "マリアナ海溝の深さ"
            },
            "priority": 2
        },
        {
            "value": 17000,
            "label": {
                "en": "height of tropopause at equator",
                "ja": "赤道での対流圏界面の高さ"
            },
            "priority": 2
        },
        {
            "value": 30000,
            "label": {
                "en": "length of Sidonia",
                "ja": "巨大播種船シドニアの全長"
            },
            "color": "$FICTION",
            "priority": 5
        },
        {
            "value": 50000,
            "label": {
                "en": "height of stratopause",
                "ja": "成層圏圏界面の高さ"
            },
            "priority": 2
        },
        {
            "value": 80000,
            "label": {
                "en": "height of mesopause",
                "ja": "中間圏界面の高さ"
            },
            "priority": 2
        },
        {
            "value": 800000,
            "label": {
                "en": "height of thermopause",
                "ja": "熱圏界面の高さ"
            },
            "priority": 2
        },
        {
            "value": 1e7,
            "label": {
                "en": "height of the edge of Earth's atmosphere(exosphere)",
                "ja": "地球の大気圏(外気圏)の外縁の高さ"
            },
            "priority": 2
        },
        {
            "value": 3.4748e6,
            "label": {
                "en": "moon's diameter",
                "ja": "月の直径"
            },
            "priority": 2
        },
        {
            "value": 1.2756274e7,
            "label": {
                "en": "earth's diameter",
                "ja": "地球の直径"
            },
            "priority": 1
        },
        {
            "value": 4.000786e7,
            "label": {
                "en": "meridian circumference",
                "ja": "子午線周回の長さ"
            },
            "priority": 2
        },
        {
            "value": 4.0075e7,
            "label": {
                "en": "equatorial circumference",
                "ja": "赤道の長さ"
            },
            "priority": 1
        },
        {
            "value": 2.99792458e8,
            "label": {
                "en": "1 light-second = c",
                "ja": "1 光秒 = c"
            },
            "priority": 0
        },
        {
            "value": 1.3927e9,
            "label": {
                "en": "sun's diameter",
                "ja": "太陽の直径"
            },
            "priority": 2
        },
        {
            "value": 6e10,
            "label": {
                "en": "Sagittarius A* diameter",
                "ja": "いて座A*の直径"
            },
            "priority": 3
        },
        {
            "value": 1.4965978707e11,
            "label": {
                "en": "Earth-Sun distance = 1 au",
                "ja": "地球-太陽間距離 = 1 au"
            },
            "priority": 1
        },
        {
            "value": 9.4607304725808e15,
            "label": {
                "en": "1 light-year",
                "ja": "1 光年"
            },
            "priority": 0
        },
        {
            "value": 3.0856775814671916e16,
            "label": {
                "en": "1 parsec",
                "ja": "1 パーセク"
            },
            "priority": 1
        },
        {
            "value": 1.0e21,
            "label": {
                "en": "milky way diameter",
                "ja": "天の川の直径"
            },
            "priority": 1
        },
        {
            "value": 8.8e26,
            "label": {
                "en": "observable universe diameter",
                "ja": "観測可能な宇宙の直径"
            },
            "priority": 1
        }
    ],
    "areas": []
});
define("resource/constant/area", [], {
    "$file-name": "area.json",
    "label": {
        "en": "Area",
        "ja": "面積"
    },
    "unit": {
        "symbol": "m^2",
        "label": {
            "en": "square meter",
            "ja": "平方メートル"
        }
    },
    "ticks": [
        {
            "value": 2.6121e-70,
            "label": {
                "en": "Planck area",
                "ja": "プランク面積"
            },
            "priority": 0
        },
        {
            "value": 1.0e-6,
            "label": {
                "en": "1 mm^2",
                "ja": "1 mm^2"
            },
            "priority": 0
        },
        {
            "value": 1.0e-4,
            "label": {
                "en": "1 cm^2",
                "ja": "1 cm^2"
            },
            "priority": 0
        },
        {
            "value": 1e4,
            "label": {
                "en": "1 ha (hectare)",
                "ja": "1 ha (ヘクタール)"
            },
            "priority": 0
        },
        {
            "value": 1.0e6,
            "label": {
                "en": "1 km^2",
                "ja": "1 km^2"
            },
            "priority": 0
        },
        {
            "value": 3.8e9,
            "label": {
                "en": "Moon surface area",
                "ja": "月の表面積"
            },
            "priority": 2
        },
        {
            "value": 5.100656e14,
            "label": {
                "en": "Earth surface area",
                "ja": "地球の表面積"
            },
            "priority": 1
        },
        {
            "value": 6.07877e18,
            "label": {
                "en": "Sun surface area",
                "ja": "太陽の表面積"
            },
            "priority": 2
        }
    ],
    "areas": []
});
define("resource/constant/volume", [], {
    "$file-name": "volume.json",
    "label": {
        "en": "Volume",
        "ja": "体積"
    },
    "unit": {
        "symbol": "m^3",
        "label": {
            "en": "cubic meter",
            "ja": "立方メートル"
        }
    },
    "ticks": [
        {
            "value": 4.222e-105,
            "label": {
                "en": "Planck volume",
                "ja": "プランク体積"
            },
            "priority": 0
        },
        {
            "value": 1.0e-9,
            "label": {
                "en": "1 mm^3",
                "ja": "1 mm^3"
            },
            "priority": 0
        },
        {
            "value": 1.0e-6,
            "label": {
                "en": "1 cm^3",
                "ja": "1 cm^3"
            },
            "priority": 0
        },
        {
            "value": 1.0e-3,
            "label": {
                "en": "1 L (liter)",
                "ja": "1 L (リットル)"
            },
            "priority": 0
        },
        {
            "value": 1.0e9,
            "label": {
                "en": "1 km^3",
                "ja": "1 km^3"
            },
            "priority": 0
        },
        {
            "value": 2.199e19,
            "label": {
                "en": "Moon volume",
                "ja": "月の体積"
            },
            "priority": 2
        },
        {
            "value": 1.0833e21,
            "label": {
                "en": "Earth volume",
                "ja": "地球の体積"
            },
            "priority": 1
        },
        {
            "value": 1.41e27,
            "label": {
                "en": "Sun volume",
                "ja": "太陽の体積"
            },
            "priority": 1
        },
        {
            "value": 3.566e80,
            "label": {
                "en": "observable universe volume",
                "ja": "観測可能な宇宙の体積"
            },
            "priority": 2,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/mass", [], {
    "$file-name": "mass.json",
    "label": {
        "en": "Mass",
        "ja": "質量"
    },
    "unit": {
        "symbol": "g",
        "label": {
            "en": "gram",
            "ja": "グラム"
        }
    },
    "ticks": [
        {
            "value": 1.0e-37,
            "label": {
                "en": "Neutrino mass",
                "ja": "ニュートリノ質量"
            },
            "priority": 1,
            "color": "$ESTIMATED"
        },
        {
            "value": 9.10938356e-28,
            "label": {
                "en": "Electron mass",
                "ja": "電子質量"
            },
            "priority": 1
        },
        {
            "value": 1.6726219e-24,
            "label": {
                "en": "Proton mass",
                "ja": "陽子質量"
            },
            "priority": 1
        },
        {
            "value": 1.0e-15,
            "label": {
                "en": "Typical virus mass",
                "ja": "典型的なウイルスの質量"
            },
            "priority": 2
        },
        {
            "value": 1.0e-12,
            "label": {
                "en": "Typical bacterium mass",
                "ja": "典型的な細菌の質量"
            },
            "priority": 2
        },
        {
            "value": 2.176434e-5,
            "label": {
                "en": "Planck mass",
                "ja": "プランク質量"
            },
            "priority": 0
        },
        {
            "value": 28.349523125,
            "label": {
                "en": "1 oz (ounce)",
                "ja": "1 oz (オンス)"
            },
            "priority": 0
        },
        {
            "value": 453.59237,
            "label": {
                "en": "1 lb (pound)",
                "ja": "1 lb (ポンド)"
            },
            "priority": 0
        },
        {
            "value": 1.4e8,
            "label": {
                "en": "Blue whale mass",
                "ja": "シロナガスクジラの質量"
            },
            "priority": 2
        },
        {
            "value": 7.34767309e25,
            "label": {
                "en": "Moon mass",
                "ja": "月の質量"
            },
            "priority": 2
        },
        {
            "value": 6.4171e26,
            "label": {
                "en": "Mars mass",
                "ja": "火星の質量"
            },
            "priority": 3
        },
        {
            "value": 5.9724e27,
            "label": {
                "en": "Earth mass",
                "ja": "地球の質量 = 1 M⊕"
            },
            "priority": 0
        },
        {
            "value": 5.68317e29,
            "label": {
                "en": "Saturn mass",
                "ja": "土星の質量"
            },
            "priority": 3
        },
        {
            "value": 1.89813e30,
            "label": {
                "en": "Jupiter mass",
                "ja": "木星の質量"
            },
            "priority": 2
        },
        {
            "value": 1.989e33,
            "label": {
                "en": "Sun mass = 1 M☉",
                "ja": "太陽の質量 = 1 M☉"
            },
            "priority": 0
        },
        {
            "value": 4e45,
            "label": {
                "en": "Milky Way mass",
                "ja": "天の川銀河の質量"
            },
            "priority": 1,
            "color": "$ESTIMATED"
        },
        {
            "value": 1.5e56,
            "label": {
                "en": "Observable Universe mass",
                "ja": "観測可能な宇宙の質量"
            },
            "priority": 1,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/time", [], {
    "$file-name": "time.json",
    "label": {
        "en": "Time",
        "ja": "時間"
    },
    "unit": {
        "symbol": "s",
        "label": {
            "en": "second",
            "ja": "秒"
        }
    },
    "ticks": [
        {
            "value": 5.391246366844893e-44,
            "label": {
                "en": "planck time",
                "ja": "プランク時間"
            },
            "priority": 0,
            "$source-eval": {
                "value": "1.616255e-35 /299792458"
            }
        },
        {
            "value": 1e-21,
            "label": {
                "en": "typical particle interaction time",
                "ja": "典型的な粒子相互作用時間"
            },
            "priority": 1
        },
        {
            "value": 1e-9,
            "label": {
                "en": "1 nano-second",
                "ja": "1 ナノ秒"
            },
            "priority": 0
        },
        {
            "value": 0.000001,
            "label": {
                "en": "1 micro-second",
                "ja": "1 マイクロ秒"
            },
            "priority": 0
        },
        {
            "value": 0.001,
            "label": {
                "en": "1 milli-second",
                "ja": "1 ミリ秒"
            },
            "priority": 0
        },
        {
            "value": 0.01,
            "label": {
                "en": "typical blink duration",
                "ja": "典型的なまばたきの時間"
            },
            "priority": 1
        },
        {
            "value": 0.1,
            "label": {
                "en": "typical heartbeat duration",
                "ja": "典型的な心拍の時間"
            },
            "priority": 1
        },
        {
            "value": 60,
            "label": {
                "en": "1 minute",
                "ja": "1 分"
            },
            "priority": 0
        },
        {
            "value": 3600,
            "label": {
                "en": "1 hour",
                "ja": "1 時間"
            },
            "priority": 0,
            "$source-eval": {
                "value": "60 *60"
            }
        },
        {
            "value": 86400,
            "label": {
                "en": "1 day",
                "ja": "1 日"
            },
            "priority": 0,
            "$source-eval": {
                "value": "24 *60 *60"
            }
        },
        {
            "value": 31556926.08,
            "label": {
                "en": "1 Gregorian year = 365.2422 days",
                "ja": "1 グレゴリオ暦年 = 365.2422 日"
            },
            "priority": 1,
            "$source-eval": {
                "value": "roundE(config.time.gregorianYearLength *24 *60 *60)",
                "label": {
                    "en": "`1 Gregorian year = ${config.time.gregorianYearLength} days`",
                    "ja": "`1 グレゴリオ暦年 = ${config.time.gregorianYearLength} 日`"
                }
            }
        },
        {
            "value": 31557600,
            "label": {
                "en": "1 Julian year = 365.25 days",
                "ja": "1 ユリウス暦年 = 365.25 日"
            },
            "priority": 0,
            "$source-eval": {
                "value": "roundE(config.time.julianYearLength *24 *60 *60)",
                "label": {
                    "en": "`1 Julian year = ${config.time.julianYearLength} days`",
                    "ja": "`1 ユリウス暦年 = ${config.time.julianYearLength} 日`"
                }
            }
        },
        {
            "value": 31557600000,
            "label": {
                "en": "1000 years",
                "ja": "1000 年"
            },
            "priority": 1,
            "$source-eval": {
                "value": "roundE(1000 *config.time.julianYearLength *24 *60 *60)"
            }
        },
        {
            "value": 31557600000000,
            "label": {
                "en": "1 million years",
                "ja": "100 万年"
            },
            "priority": 1,
            "$source-eval": {
                "value": "roundE(1000 *1000 *config.time.julianYearLength *24 *60 *60)"
            }
        },
        {
            "value": 435494880000000000,
            "label": {
                "en": "age of the universe",
                "ja": "宇宙の年齢"
            },
            "priority": 1,
            "$source-eval": {
                "value": "Time.getCurrentUniverseEpoch()"
            }
        }
    ],
    "areas": []
});
define("resource/constant/speed", [], {
    "$file-name": "speed.json",
    "label": "Speed",
    "unit": {
        "symbol": "m/s",
        "label": {
            "en": "meter per second",
            "ja": "メートル毎秒"
        }
    },
    "ticks": [
        {
            "value": 1.1126500560536185e-17,
            "label": "1 / c^2",
            "priority": 0,
            "$source-eval": {
                "value": "1 /Math.pow(2.99792458e8, 2)"
            }
        },
        {
            "value": 3.3356409519815204e-9,
            "label": "1 / c",
            "priority": 0,
            "$source-eval": {
                "value": "1 /2.99792458e8"
            }
        },
        {
            "value": 1.6e-9,
            "label": "continental plate movement speed",
            "priority": 2
        },
        {
            "value": 30.0,
            "label": "cheetah",
            "priority": 2
        },
        {
            "value": 100.0,
            "label": "falcon",
            "priority": 2
        },
        {
            "value": 340.29,
            "label": "speed of sound (Mach)",
            "priority": 1
        },
        {
            "value": 1.02e3,
            "label": "moon orbital speed",
            "priority": 2
        },
        {
            "value": 2.98e3,
            "label": "earth orbital speed",
            "priority": 1
        },
        {
            "value": 7.9e3,
            "label": "first cosmic velocity",
            "priority": 2
        },
        {
            "value": 1.12e4,
            "label": "second cosmic velocity",
            "priority": 3
        },
        {
            "value": 1.67e4,
            "label": "third cosmic velocity",
            "priority": 4
        },
        {
            "value": 1.6999e4,
            "label": "Voyager 1 speed",
            "priority": 2
        },
        {
            "value": 2.5e5,
            "label": "solar system orbital speed around the galaxy",
            "priority": 2
        },
        {
            "value": 6.0e5,
            "label": "Milky Way orbital speed around the center of the local group",
            "priority": 2
        },
        {
            "value": 2.99792458e8,
            "label": "speed of light = c",
            "priority": 0
        },
        {
            "value": 9.9e8,
            "label": "expansion speed of the universe",
            "priority": 1
        },
        {
            "value": 89875517873681760,
            "label": "c^2",
            "priority": 0,
            "$source-eval": {
                "value": "Math.pow(2.99792458e8, 2)"
            }
        },
        {
            "value": 1.0e31,
            "label": {
                "en": "inflation speed of the early universe",
                "ja": "初期宇宙のインフレーション速度"
            },
            "priority": 2,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/energy", [], {
    "$file-name": "energy.json",
    "label": {
        "en": "Energy",
        "ja": "エネルギー"
    },
    "unit": {
        "symbol": "J",
        "label": {
            "en": "joule",
            "ja": "ジュール"
        }
    },
    "ticks": [
        {
            "value": 6.62607015e-34,
            "label": {
                "en": "Planck constant = ℎ",
                "ja": "プランク定数 = ℎ"
            },
            "priority": 0
        },
        {
            "value": 1.380649e-23,
            "label": {
                "en": "Boltzmann constant",
                "ja": "ボルツマン定数"
            },
            "priority": 0
        },
        {
            "value": 1.602176634e-19,
            "label": {
                "en": "1 eV (electron volt)",
                "ja": "1 eV (電子ボルト)"
            },
            "priority": 0
        },
        {
            "value": 4.184,
            "label": {
                "en": "1 cal (thermochemical calorie)",
                "ja": "1 cal (熱化学カロリー)"
            },
            "priority": 0
        },
        {
            "value": 1956100000,
            "label": {
                "en": "Planck energy",
                "ja": "プランクエネルギー"
            },
            "priority": 0
        },
        {
            "value": 89875517873681.77,
            "label": {
                "en": "mass-energy equivalence of 1 g",
                "ja": "1 gの質量エネルギー等価"
            },
            "priority": 1,
            "$source-eval": {
                "value": "(299792458 ** 2) *0.001"
            }
        },
        {
            "value": 89875517873681760,
            "label": {
                "en": "mass-energy equivalence of 1 kg",
                "ja": "1 kgの質量エネルギー等価"
            },
            "priority": 1,
            "$source-eval": {
                "value": "299792458 ** 2"
            }
        },
        {
            "value": 5.36772542948777e+41,
            "label": {
                "en": "total energy of the Earth",
                "ja": "地球の全エネルギー"
            },
            "priority": 2,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/temperature", [], {
    "$file-name": "temperature.json",
    "label": {
        "en": "Temperature",
        "ja": "温度"
    },
    "unit": {
        "symbol": "K",
        "label": {
            "en": "kelvin",
            "ja": "ケルビン"
        }
    },
    "ticks": [
        {
            "value": 9.5e-10,
            "label": {
                "en": "melting point of helium",
                "ja": "ヘリウムの融点"
            },
            "priority": 2
        },
        {
            "value": 4.22,
            "label": {
                "en": "boiling point of helium",
                "ja": "ヘリウムの沸点"
            },
            "priority": 2
        },
        {
            "value": 14.01,
            "label": {
                "en": "melting point of hydrogen",
                "ja": "水素の融点"
            },
            "priority": 2
        },
        {
            "value": 20.28,
            "label": {
                "en": "boiling point of hydrogen",
                "ja": "水素の沸点"
            },
            "priority": 2
        },
        {
            "value": 255.35,
            "label": "0 °F",
            "priority": 0
        },
        {
            "value": 273.15,
            "label": {
                "en": "freezing point of water = 0 °C",
                "ja": "水の凝固点 = 0 °C"
            },
            "priority": 0
        },
        {
            "value": 310.98,
            "label": "100 °F",
            "priority": 0
        },
        {
            "value": 373.15,
            "label": {
                "en": "boiling point of water = 100 °C",
                "ja": "水の沸点 = 100 °C"
            },
            "priority": 0
        },
        {
            "value": 5.8e3,
            "label": {
                "en": "surface of the sun",
                "ja": "太陽の表面"
            },
            "priority": 2
        },
        {
            "value": 1.42e32,
            "label": {
                "en": "planck temperature",
                "ja": "プランク温度"
            },
            "priority": 0
        }
    ],
    "areas": []
});
define("resource/constant/counting", [], {
    "$file-name": "counting.json",
    "label": {
        "en": "Counting",
        "ja": "個数"
    },
    "unit": {
        "label": {
            "en": "count",
            "ja": "個"
        }
    },
    "ticks": [
        {
            "value": 12,
            "label": {
                "en": "1 dozen",
                "ja": "1 ダース"
            },
            "priority": 0
        },
        {
            "value": 20,
            "label": {
                "en": "1 score",
                "ja": "1 スコア"
            },
            "priority": 0
        },
        {
            "value": 144,
            "label": {
                "en": "1 gross",
                "ja": "1 グロス"
            },
            "priority": 0
        },
        {
            "value": 1728,
            "label": {
                "en": "1 great gross",
                "ja": "1 グレートグロス"
            },
            "priority": 0
        },
        {
            "value": 41024320,
            "label": {
                "en": "number of digits in the largest known prime (Mersenne prime)",
                "ja": "既知の最大の素数（メルセンヌ素数）の桁数"
            },
            "priority": 1
        },
        {
            "value": 1e19,
            "label": {
                "en": "Estimated number of insects on Earth",
                "ja": "昆虫の総個体数"
            },
            "priority": 0,
            "color": "$ESTIMATED"
        },
        {
            "value": 6.02214076e23,
            "label": {
                "en": "1 mol = Avogadro's number (Nₐ) particles",
                "ja": "1 mol = アボガドロ定数 Nₐ 個"
            },
            "priority": 0
        },
        {
            "value": 2.6867801118e25,
            "label": {
                "en": "Loschmidt constant (Nₗ) = number of particles in 1 cubic meter of ideal gas at standard conditions",
                "ja": "Loschmidt constant (Nₗ) = 標準状態の理想気体1立方メートル中の粒子数"
            },
            "priority": 0
        },
        {
            "value": 1.0e80,
            "label": {
                "en": "Estimated number of subatomic particles in the observable universe",
                "ja": "観測可能な宇宙の亜原子粒子数の推定値"
            },
            "priority": 1,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/sound-frequency", [], {
    "$file-name": "sound-frequency.json",
    "label": {
        "en": "Sound Frequency",
        "ja": "音の周波数"
    },
    "unit": {
        "symbol": "Hz",
        "label": {
            "en": "hertz",
            "ja": "ヘルツ"
        }
    },
    "ticks": [
        {
            "value": 8.175798915643707,
            "label": {
                "en": "MIDI note number 0",
                "ja": "MIDIノート番号0"
            },
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(0)"
            }
        },
        {
            "value": 20,
            "label": {
                "en": "lower limit of human hearing",
                "ja": "人間の聴覚の下限"
            },
            "priority": 1
        },
        {
            "value": 27.5,
            "label": "A0",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(21)"
            }
        },
        {
            "value": 29.13523509488062,
            "label": "A#0",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(22)"
            }
        },
        {
            "value": 30.86770632850775,
            "label": "B0",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(23)"
            }
        },
        {
            "value": 32.70319566257483,
            "label": "C1",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(24)"
            }
        },
        {
            "value": 34.64782887210901,
            "label": "C#1",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(25)"
            }
        },
        {
            "value": 36.70809598967594,
            "label": "D1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(26)"
            }
        },
        {
            "value": 38.890872965260115,
            "label": "D#1",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(27)"
            }
        },
        {
            "value": 40.0,
            "label": {
                "en": "lower limit of dog hearing",
                "ja": "犬の聴覚の下限"
            },
            "priority": 4,
            "color": "$ESTIMATED"
        },
        {
            "value": 41.20344461410875,
            "label": "E1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(28)"
            }
        },
        {
            "value": 43.653528929125486,
            "label": "F1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(29)"
            }
        },
        {
            "value": 46.2493028389543,
            "label": "F#1",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(30)"
            }
        },
        {
            "value": 48.999429497718666,
            "label": "G1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(31)"
            }
        },
        {
            "value": 51.91308719749314,
            "label": "G#1",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(32)"
            }
        },
        {
            "value": 55,
            "label": "A1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(33)"
            }
        },
        {
            "value": 58.27047018976124,
            "label": "A#1",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(34)"
            }
        },
        {
            "value": 61.7354126570155,
            "label": "B1",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(35)"
            }
        },
        {
            "value": 65.40639132514966,
            "label": "C2",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(36)"
            }
        },
        {
            "value": 69.29565774421802,
            "label": "C#2",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(37)"
            }
        },
        {
            "value": 73.41619197935188,
            "label": "D2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(38)"
            }
        },
        {
            "value": 77.78174593052023,
            "label": "D#2",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(39)"
            }
        },
        {
            "value": 82.4068892282175,
            "label": "E2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(40)"
            }
        },
        {
            "value": 87.30705785825097,
            "label": "F2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(41)"
            }
        },
        {
            "value": 92.4986056779086,
            "label": "F#2",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(42)"
            }
        },
        {
            "value": 97.99885899543733,
            "label": "G2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(43)"
            }
        },
        {
            "value": 103.82617439498628,
            "label": "G#2",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(44)"
            }
        },
        {
            "value": 110,
            "label": "A2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(45)"
            }
        },
        {
            "value": 116.54094037952248,
            "label": "A#2",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(46)"
            }
        },
        {
            "value": 123.47082531403103,
            "label": "B2",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(47)"
            }
        },
        {
            "value": 130.8127826502993,
            "label": "C3",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(48)"
            }
        },
        {
            "value": 138.59131548843604,
            "label": "C#3",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(49)"
            }
        },
        {
            "value": 146.8323839587038,
            "label": "D3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(50)"
            }
        },
        {
            "value": 155.56349186104046,
            "label": "D#3",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(51)"
            }
        },
        {
            "value": 164.81377845643496,
            "label": "E3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(52)"
            }
        },
        {
            "value": 174.61411571650194,
            "label": "F3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(53)"
            }
        },
        {
            "value": 184.9972113558172,
            "label": "F#3",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(54)"
            }
        },
        {
            "value": 195.99771799087463,
            "label": "G3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(55)"
            }
        },
        {
            "value": 207.65234878997256,
            "label": "G#3",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(56)"
            }
        },
        {
            "value": 220,
            "label": "A3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(57)"
            }
        },
        {
            "value": 233.08188075904496,
            "label": "A#3",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(58)"
            }
        },
        {
            "value": 246.94165062806206,
            "label": "B3",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(59)"
            }
        },
        {
            "value": 261.6255653005986,
            "label": "C4",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(60)"
            }
        },
        {
            "value": 277.1826309768721,
            "label": "C#4",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(61)"
            }
        },
        {
            "value": 293.6647679174076,
            "label": "D4",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(62)"
            }
        },
        {
            "value": 311.1269837220809,
            "label": "D#4",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(63)"
            }
        },
        {
            "value": 329.6275569128699,
            "label": "E4",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(64)"
            }
        },
        {
            "value": 349.2282314330039,
            "label": "F4",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(65)"
            }
        },
        {
            "value": 369.9944227116344,
            "label": "F#4",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(66)"
            }
        },
        {
            "value": 391.99543598174927,
            "label": "G4",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(67)"
            }
        },
        {
            "value": 415.3046975799451,
            "label": "G#4",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(68)"
            }
        },
        {
            "value": 440,
            "label": {
                "en": "A4 (concert pitch)",
                "ja": "A4 (コンサートピッチ)"
            },
            "priority": 0,
            "$source-eval": {
                "value": "midiNoteToFrequency(69)"
            }
        },
        {
            "value": 466.1637615180899,
            "label": "A#4",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(70)"
            }
        },
        {
            "value": 493.8833012561241,
            "label": "B4",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(71)"
            }
        },
        {
            "value": 523.2511306011972,
            "label": "C5",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(72)"
            }
        },
        {
            "value": 554.3652619537442,
            "label": "C#5",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(73)"
            }
        },
        {
            "value": 587.3295358348151,
            "label": "D5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(74)"
            }
        },
        {
            "value": 622.2539674441618,
            "label": "D#5",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(75)"
            }
        },
        {
            "value": 659.2551138257398,
            "label": "E5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(76)"
            }
        },
        {
            "value": 698.4564628660078,
            "label": "F5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(77)"
            }
        },
        {
            "value": 739.9888454232688,
            "label": "F#5",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(78)"
            }
        },
        {
            "value": 783.9908719634985,
            "label": "G5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(79)"
            }
        },
        {
            "value": 830.6093951598903,
            "label": "G#5",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(80)"
            }
        },
        {
            "value": 880,
            "label": "A5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(81)"
            }
        },
        {
            "value": 932.3275230361799,
            "label": "A#5",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(82)"
            }
        },
        {
            "value": 987.7666025122483,
            "label": "B5",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(83)"
            }
        },
        {
            "value": 1046.5022612023945,
            "label": "C6",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(84)"
            }
        },
        {
            "value": 1108.7305239074883,
            "label": "C#6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(85)"
            }
        },
        {
            "value": 1174.6590716696303,
            "label": "D6",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(86)"
            }
        },
        {
            "value": 1244.5079348883237,
            "label": "D#6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(87)"
            }
        },
        {
            "value": 1318.5102276514797,
            "label": "E6",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(88)"
            }
        },
        {
            "value": 1396.9129257320155,
            "label": "F6",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(89)"
            }
        },
        {
            "value": 1479.9776908465376,
            "label": "F#6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(90)"
            }
        },
        {
            "value": 1567.981743926997,
            "label": "G6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(91)"
            }
        },
        {
            "value": 1661.2187903197805,
            "label": "G#6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(92)"
            }
        },
        {
            "value": 1760,
            "label": "A6",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(93)"
            }
        },
        {
            "value": 1864.6550460723597,
            "label": "A#6",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(94)"
            }
        },
        {
            "value": 1975.533205024496,
            "label": "B6",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(95)"
            }
        },
        {
            "value": 2093.004522404789,
            "label": "C7",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(96)"
            }
        },
        {
            "value": 2217.4610478149766,
            "label": "C#7",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(97)"
            }
        },
        {
            "value": 2349.31814333926,
            "label": "D7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(98)"
            }
        },
        {
            "value": 2489.0158697766474,
            "label": "D#7",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(99)"
            }
        },
        {
            "value": 2637.02045530296,
            "label": "E7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(100)"
            }
        },
        {
            "value": 2793.825851464031,
            "label": "F7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(101)"
            }
        },
        {
            "value": 2959.955381693075,
            "label": "F#7",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(102)"
            }
        },
        {
            "value": 3135.9634878539946,
            "label": "G7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(103)"
            }
        },
        {
            "value": 3322.437580639561,
            "label": "G#7",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(104)"
            }
        },
        {
            "value": 3520,
            "label": "A7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(105)"
            }
        },
        {
            "value": 3729.3100921447194,
            "label": "A#7",
            "priority": 3,
            "$source-eval": {
                "value": "midiNoteToFrequency(106)"
            }
        },
        {
            "value": 3951.066410048992,
            "label": "B7",
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(107)"
            }
        },
        {
            "value": 4186.009044809578,
            "label": "C8",
            "priority": 1,
            "$source-eval": {
                "value": "midiNoteToFrequency(108)"
            }
        },
        {
            "value": 12543.853951415975,
            "label": {
                "en": "MIDI note number 127",
                "ja": "MIDIノート番号127"
            },
            "priority": 2,
            "$source-eval": {
                "value": "midiNoteToFrequency(127)"
            }
        },
        {
            "value": 20000,
            "label": {
                "en": "upper limit of human hearing",
                "ja": "人間の聴覚の上限"
            },
            "priority": 1
        },
        {
            "value": 60000.0,
            "label": {
                "en": "upper limit of dog hearing",
                "ja": "犬の聴覚の上限"
            },
            "priority": 4,
            "color": "$ESTIMATED"
        },
        {
            "value": 100000.0,
            "label": {
                "en": "upper limit of bat hearing",
                "ja": "コウモリの聴覚の上限"
            },
            "priority": 4,
            "color": "$ESTIMATED"
        }
    ],
    "areas": []
});
define("resource/constant/emw-wavelength", [], {
    "$file-name": "emw-wavelength.json",
    "label": {
        "en": "EMW Wavelength",
        "ja": "電磁波の波長"
    },
    "unit": {
        "symbol": "m",
        "label": {
            "en": "meter",
            "ja": "メートル"
        }
    },
    "ticks": [
        {
            "value": 0.12236426857142857,
            "label": {
                "en": "microwave oven",
                "ja": "電子レンジ"
            },
            "$source-eval": {
                "value": "frequencyToWaveLength(2450000000)"
            },
            "priority": 3
        }
    ],
    "areas": [
        {
            "lowerBound": 1.616255e-35,
            "upperBound": 1.0e-11,
            "label": {
                "en": "gamma rays",
                "ja": "ガンマ線"
            },
            "fill": "oklch(60% 0.6 300deg / 0.125)"
        },
        {
            "lowerBound": 1.0e-11,
            "upperBound": 1.0e-8,
            "label": {
                "en": "X-rays",
                "ja": "X線"
            },
            "fill": "oklch(60% 0.6 285deg / 0.25)"
        },
        {
            "lowerBound": 1.0e-8,
            "upperBound": 3.80e-7,
            "label": {
                "en": "ultraviolet",
                "ja": "紫外線"
            },
            "fill": "oklch(60% 0.6 270deg / 0.3)",
            "details": [
                {
                    "lowerBound": 1.0e-8,
                    "upperBound": 2.0e-7,
                    "label": {
                        "en": "VUV: vacuum ultraviolet",
                        "ja": "VUV: 真空紫外線"
                    },
                    "fill": "oklch(60% 0.6 300deg / 0.3)"
                },
                {
                    "lowerBound": 2.0e-7,
                    "upperBound": 3.80e-7,
                    "label": {
                        "en": "NUV: near ultraviolet",
                        "ja": "NUV: 近紫外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)",
                    "details": [
                        {
                            "lowerBound": 2.0e-7,
                            "upperBound": 2.8e-7,
                            "label": {
                                "en": "UV-C: ultraviolet C",
                                "ja": "UV-C: 紫外線C"
                            },
                            "fill": "oklch(60% 0.6 210deg / 0.3)"
                        },
                        {
                            "lowerBound": 2.8e-7,
                            "upperBound": 3.15e-7,
                            "label": {
                                "en": "UV-B: ultraviolet B",
                                "ja": "UV-B: 紫外線B"
                            },
                            "fill": "oklch(60% 0.6 180deg / 0.3)"
                        },
                        {
                            "lowerBound": 3.15e-7,
                            "upperBound": 3.80e-7,
                            "label": {
                                "en": "UV-A: ultraviolet A",
                                "ja": "UV-A: 紫外線A"
                            },
                            "fill": "oklch(60% 0.6 150deg / 0.3)"
                        }
                    ]
                }
            ]
        },
        {
            "lowerBound": 3.80e-7,
            "upperBound": 7.6e-7,
            "label": {
                "en": "visible light",
                "ja": "可視光"
            },
            "fill": "oklch(60% 0.6 150deg / 0.25)",
            "details": [
                {
                    "lowerBound": 3.80e-7,
                    "upperBound": 4.5e-7,
                    "label": {
                        "en": "violet light",
                        "ja": "紫色光"
                    },
                    "fill": "#8b00ff66"
                },
                {
                    "lowerBound": 4.5e-7,
                    "upperBound": 4.85e-7,
                    "label": {
                        "en": "blue light",
                        "ja": "青色光"
                    },
                    "fill": "#0000ff66"
                },
                {
                    "lowerBound": 4.85e-7,
                    "upperBound": 5.0e-7,
                    "label": {
                        "en": "cyan light",
                        "ja": "シアン光"
                    },
                    "fill": "#00ffff66"
                },
                {
                    "lowerBound": 5.0e-7,
                    "upperBound": 5.65e-7,
                    "label": {
                        "en": "green light",
                        "ja": "緑色光"
                    },
                    "fill": "#00ff0066"
                },
                {
                    "lowerBound": 5.65e-7,
                    "upperBound": 5.9e-7,
                    "label": {
                        "en": "yellow light",
                        "ja": "黄色光"
                    },
                    "fill": "#ffff0066"
                },
                {
                    "lowerBound": 5.9e-7,
                    "upperBound": 6.25e-7,
                    "label": {
                        "en": "orange light",
                        "ja": "オレンジ光"
                    },
                    "fill": "#ff800066"
                },
                {
                    "lowerBound": 6.25e-7,
                    "upperBound": 7.6e-7,
                    "label": {
                        "en": "red light",
                        "ja": "赤色光"
                    },
                    "fill": "#ff000066"
                }
            ]
        },
        {
            "lowerBound": 7.6e-7,
            "upperBound": 1.0e-3,
            "label": {
                "en": "infrared",
                "ja": "赤外線"
            },
            "fill": "oklch(60% 0.6 90deg / 0.3)",
            "details": [
                {
                    "lowerBound": 7.6e-7,
                    "upperBound": 2.5e-6,
                    "label": {
                        "en": "NIR: near infrared",
                        "ja": "NIR: 近赤外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)"
                },
                {
                    "lowerBound": 2.5e-6,
                    "upperBound": 4.0e-6,
                    "label": {
                        "en": "MIR: mid infrared",
                        "ja": "MIR: 中赤外線"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.3)"
                },
                {
                    "lowerBound": 4.0e-6,
                    "upperBound": 1.0e-3,
                    "label": {
                        "en": "FIR: far infrared",
                        "ja": "FIR: 遠赤外線"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 1.0e-3,
            "upperBound": 1.0,
            "label": {
                "en": "microwaves",
                "ja": "マイクロ波"
            },
            "fill": "oklch(60% 0.6 60deg / 0.25)",
            "details": [
                {
                    "lowerBound": 1.0e-3,
                    "upperBound": 1.0e-2,
                    "label": {
                        "en": "EHF: extremely high frequency",
                        "ja": "EHF: 極超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e-2,
                    "upperBound": 1.0e-1,
                    "label": {
                        "en": "SHF: super high frequency",
                        "ja": "SHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e-1,
                    "upperBound": 1.0,
                    "label": {
                        "en": "UHF: ultra high frequency",
                        "ja": "UHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 1.0,
            "upperBound": null,
            "label": {
                "en": "radio waves",
                "ja": "電波"
            },
            "fill": "oklch(60% 0.6 15deg / 0.125)",
            "details": [
                {
                    "lowerBound": 1.0,
                    "upperBound": 10.0,
                    "label": {
                        "en": "VHF: very high frequency",
                        "ja": "VHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                },
                {
                    "lowerBound": 10.0,
                    "upperBound": 100.0,
                    "label": {
                        "en": "HF: high frequency",
                        "ja": "HF: 高周波"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.25)"
                },
                {
                    "lowerBound": 100.0,
                    "upperBound": 1.0e3,
                    "label": {
                        "en": "MF: medium frequency",
                        "ja": "MF: 中周波"
                    },
                    "fill": "oklch(60% 0.6 210deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e3,
                    "upperBound": 1.0e4,
                    "label": {
                        "en": "LF: low frequency",
                        "ja": "LF: 低周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e4,
                    "upperBound": 1.0e5,
                    "label": {
                        "en": "VLF: very low frequency",
                        "ja": "VLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 150deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e5,
                    "upperBound": 1.0e6,
                    "label": {
                        "en": "ULF: ultra low frequency",
                        "ja": "ULF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e6,
                    "upperBound": 1.0e7,
                    "label": {
                        "en": "SLF: super low frequency",
                        "ja": "SLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e7,
                    "upperBound": 1.0e8,
                    "label": {
                        "en": "ELF: extremely low frequency",
                        "ja": "ELF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 60deg / 0.25)"
                },
                {
                    "lowerBound": 1.0e8,
                    "upperBound": null,
                    "fill": "oklch(60% 0.6 15deg / 0.125)"
                }
            ]
        }
    ]
});
define("resource/constant/emw-frequency", [], {
    "$file-name": "emw-frequency.json",
    "label": {
        "en": "EMW Frequency",
        "ja": "電磁波の周波数"
    },
    "unit": {
        "symbol": "Hz",
        "label": {
            "en": "hertz",
            "ja": "ヘルツ"
        }
    },
    "x-$source-eval": {
        "ticks": "constant.emwWavelength.ticks.toReversed().map(tick => ({...tick, value: waveLengthToFrequency(tick.value)}))",
        "areas": "nestEvalUpdate(JSON.parse(JSON.stringify(constant.emwWavelength.areas)), areas => areas.reverse(), area => { const lowerBound = waveLengthToFrequency(area.upperBound); const upperBound = waveLengthToFrequency(area.lowerBound); area.lowerBound = lowerBound; area.upperBound = upperBound; return area; }, area => area.details)"
    },
    "ticks": [
        {
            "value": 2450000000,
            "label": {
                "en": "microwave oven",
                "ja": "電子レンジ"
            },
            "priority": 3
        }
    ],
    "areas": [
        {
            "lowerBound": null,
            "upperBound": 299792458,
            "label": {
                "en": "radio waves",
                "ja": "電波"
            },
            "fill": "oklch(60% 0.6 15deg / 0.125)",
            "details": [
                {
                    "lowerBound": null,
                    "upperBound": 2.99792458,
                    "fill": "oklch(60% 0.6 15deg / 0.125)"
                },
                {
                    "lowerBound": 2.99792458,
                    "upperBound": 29.9792458,
                    "label": {
                        "en": "ELF: extremely low frequency",
                        "ja": "ELF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 60deg / 0.25)"
                },
                {
                    "lowerBound": 29.9792458,
                    "upperBound": 299.792458,
                    "label": {
                        "en": "SLF: super low frequency",
                        "ja": "SLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 299.792458,
                    "upperBound": 2997.92458,
                    "label": {
                        "en": "ULF: ultra low frequency",
                        "ja": "ULF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.25)"
                },
                {
                    "lowerBound": 2997.92458,
                    "upperBound": 29979.2458,
                    "label": {
                        "en": "VLF: very low frequency",
                        "ja": "VLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 150deg / 0.25)"
                },
                {
                    "lowerBound": 29979.2458,
                    "upperBound": 299792.458,
                    "label": {
                        "en": "LF: low frequency",
                        "ja": "LF: 低周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 299792.458,
                    "upperBound": 2997924.58,
                    "label": {
                        "en": "MF: medium frequency",
                        "ja": "MF: 中周波"
                    },
                    "fill": "oklch(60% 0.6 210deg / 0.25)"
                },
                {
                    "lowerBound": 2997924.58,
                    "upperBound": 29979245.8,
                    "label": {
                        "en": "HF: high frequency",
                        "ja": "HF: 高周波"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.25)"
                },
                {
                    "lowerBound": 29979245.8,
                    "upperBound": 299792458,
                    "label": {
                        "en": "VHF: very high frequency",
                        "ja": "VHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 299792458,
            "upperBound": 299792458000,
            "label": {
                "en": "microwaves",
                "ja": "マイクロ波"
            },
            "fill": "oklch(60% 0.6 60deg / 0.25)",
            "details": [
                {
                    "lowerBound": 299792458,
                    "upperBound": 2997924580,
                    "label": {
                        "en": "UHF: ultra high frequency",
                        "ja": "UHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 2997924580,
                    "upperBound": 29979245800,
                    "label": {
                        "en": "SHF: super high frequency",
                        "ja": "SHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 29979245800,
                    "upperBound": 299792458000,
                    "label": {
                        "en": "EHF: extremely high frequency",
                        "ja": "EHF: 極超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 299792458000,
            "upperBound": 394463760526315.75,
            "label": {
                "en": "infrared",
                "ja": "赤外線"
            },
            "fill": "oklch(60% 0.6 90deg / 0.3)",
            "details": [
                {
                    "lowerBound": 299792458000,
                    "upperBound": 74948114500000,
                    "label": {
                        "en": "FIR: far infrared",
                        "ja": "FIR: 遠赤外線"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.3)"
                },
                {
                    "lowerBound": 74948114500000,
                    "upperBound": 119916983199999.98,
                    "label": {
                        "en": "MIR: mid infrared",
                        "ja": "MIR: 中赤外線"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.3)"
                },
                {
                    "lowerBound": 119916983199999.98,
                    "upperBound": 394463760526315.75,
                    "label": {
                        "en": "NIR: near infrared",
                        "ja": "NIR: 近赤外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 394463760526315.75,
            "upperBound": 788927521052631.5,
            "label": {
                "en": "visible light",
                "ja": "可視光"
            },
            "fill": "oklch(60% 0.6 150deg / 0.25)",
            "details": [
                {
                    "lowerBound": 394463760526315.75,
                    "upperBound": 479667932799999.94,
                    "label": {
                        "en": "red light",
                        "ja": "赤色光"
                    },
                    "fill": "#ff000066"
                },
                {
                    "lowerBound": 479667932799999.94,
                    "upperBound": 508122810169491.56,
                    "label": {
                        "en": "orange light",
                        "ja": "オレンジ光"
                    },
                    "fill": "#ff800066"
                },
                {
                    "lowerBound": 508122810169491.56,
                    "upperBound": 530606120353982.3,
                    "label": {
                        "en": "yellow light",
                        "ja": "黄色光"
                    },
                    "fill": "#ffff0066"
                },
                {
                    "lowerBound": 530606120353982.3,
                    "upperBound": 599584916000000,
                    "label": {
                        "en": "green light",
                        "ja": "緑色光"
                    },
                    "fill": "#00ff0066"
                },
                {
                    "lowerBound": 599584916000000,
                    "upperBound": 618128779381443.2,
                    "label": {
                        "en": "cyan light",
                        "ja": "シアン光"
                    },
                    "fill": "#00ffff66"
                },
                {
                    "lowerBound": 618128779381443.2,
                    "upperBound": 666205462222222.2,
                    "label": {
                        "en": "blue light",
                        "ja": "青色光"
                    },
                    "fill": "#0000ff66"
                },
                {
                    "lowerBound": 666205462222222.2,
                    "upperBound": 788927521052631.5,
                    "label": {
                        "en": "violet light",
                        "ja": "紫色光"
                    },
                    "fill": "#8b00ff66"
                }
            ]
        },
        {
            "lowerBound": 788927521052631.5,
            "upperBound": 29979245800000000,
            "label": {
                "en": "ultraviolet",
                "ja": "紫外線"
            },
            "fill": "oklch(60% 0.6 270deg / 0.3)",
            "details": [
                {
                    "lowerBound": 788927521052631.5,
                    "upperBound": 1498962290000000,
                    "label": {
                        "en": "NUV: near ultraviolet",
                        "ja": "NUV: 近紫外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)",
                    "details": [
                        {
                            "lowerBound": 788927521052631.5,
                            "upperBound": 951722088888888.9,
                            "label": {
                                "en": "UV-A: ultraviolet A",
                                "ja": "UV-A: 紫外線A"
                            },
                            "fill": "oklch(60% 0.6 150deg / 0.3)"
                        },
                        {
                            "lowerBound": 951722088888888.9,
                            "upperBound": 1070687349999999.9,
                            "label": {
                                "en": "UV-B: ultraviolet B",
                                "ja": "UV-B: 紫外線B"
                            },
                            "fill": "oklch(60% 0.6 180deg / 0.3)"
                        },
                        {
                            "lowerBound": 1070687349999999.9,
                            "upperBound": 1498962290000000,
                            "label": {
                                "en": "UV-C: ultraviolet C",
                                "ja": "UV-C: 紫外線C"
                            },
                            "fill": "oklch(60% 0.6 210deg / 0.3)"
                        }
                    ]
                },
                {
                    "lowerBound": 1498962290000000,
                    "upperBound": 29979245800000000,
                    "label": {
                        "en": "VUV: vacuum ultraviolet",
                        "ja": "VUV: 真空紫外線"
                    },
                    "fill": "oklch(60% 0.6 300deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 29979245800000000,
            "upperBound": 29979245800000000000,
            "label": {
                "en": "X-rays",
                "ja": "X線"
            },
            "fill": "oklch(60% 0.6 285deg / 0.25)"
        },
        {
            "lowerBound": 29979245800000000000,
            "upperBound": 1.8548586578231776e+43,
            "label": {
                "en": "gamma rays",
                "ja": "ガンマ線"
            },
            "fill": "oklch(60% 0.6 300deg / 0.125)"
        }
    ]
});
define("resource/constant/emw-energy", [], {
    "$file-name": "emw-energy.json",
    "label": {
        "en": "EMW Energy",
        "ja": "電磁波のエネルギー"
    },
    "unit": {
        "symbol": "eV",
        "label": {
            "en": "electronvolt",
            "ja": "電子ボルト"
        }
    },
    "x-$source-eval": {
        "⚠️caution": {
            "ja": "こちらにはジュールの tick が含まれないのでそのまま適用するとジュールの tick が消えてしまいます。更新の際には差分をチェックしてジュールの tick を消さない様にしてください。",
            "en": "This does not include ticks in joules, so if you apply it as is, the ticks in joules will disappear. Please check the differences when updating to avoid deleting the ticks in joules."
        },
        "ticks": "constant.emwFrequency.ticks.map(tick => ({...tick, value: frequencyToEV(tick.value)}))",
        "areas": "nestEvalUpdate(JSON.parse(JSON.stringify(constant.emwFrequency.areas)), areas => areas, area => { area.lowerBound = frequencyToEV(area.lowerBound); area.upperBound = frequencyToEV(area.upperBound); return area; }, area => area.details)"
    },
    "ticks": [
        {
            "value": 0.000010132385857463455,
            "label": {
                "en": "microwave oven",
                "ja": "電子レンジ"
            },
            "priority": 3
        },
        {
            "value": 6241509074460763000,
            "label": {
                "en": "1 J (joule)",
                "ja": "1 J (ジュール)"
            },
            "priority": 0
        }
    ],
    "areas": [
        {
            "lowerBound": null,
            "upperBound": 0.0000012398419843320028,
            "label": {
                "en": "radio waves",
                "ja": "電波"
            },
            "fill": "oklch(60% 0.6 15deg / 0.125)",
            "details": [
                {
                    "lowerBound": null,
                    "upperBound": 1.2398419843320027e-14,
                    "fill": "oklch(60% 0.6 15deg / 0.125)"
                },
                {
                    "lowerBound": 1.2398419843320027e-14,
                    "upperBound": 1.2398419843320028e-13,
                    "label": {
                        "en": "ELF: extremely low frequency",
                        "ja": "ELF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 60deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320028e-13,
                    "upperBound": 1.2398419843320027e-12,
                    "label": {
                        "en": "SLF: super low frequency",
                        "ja": "SLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320027e-12,
                    "upperBound": 1.2398419843320027e-11,
                    "label": {
                        "en": "ULF: ultra low frequency",
                        "ja": "ULF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320027e-11,
                    "upperBound": 1.2398419843320028e-10,
                    "label": {
                        "en": "VLF: very low frequency",
                        "ja": "VLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 150deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320028e-10,
                    "upperBound": 1.2398419843320026e-9,
                    "label": {
                        "en": "LF: low frequency",
                        "ja": "LF: 低周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320026e-9,
                    "upperBound": 1.2398419843320027e-8,
                    "label": {
                        "en": "MF: medium frequency",
                        "ja": "MF: 中周波"
                    },
                    "fill": "oklch(60% 0.6 210deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320027e-8,
                    "upperBound": 1.2398419843320027e-7,
                    "label": {
                        "en": "HF: high frequency",
                        "ja": "HF: 高周波"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419843320027e-7,
                    "upperBound": 0.0000012398419843320028,
                    "label": {
                        "en": "VHF: very high frequency",
                        "ja": "VHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 0.0000012398419843320028,
            "upperBound": 0.0012398419843320028,
            "label": {
                "en": "microwaves",
                "ja": "マイクロ波"
            },
            "fill": "oklch(60% 0.6 60deg / 0.25)",
            "details": [
                {
                    "lowerBound": 0.0000012398419843320028,
                    "upperBound": 0.000012398419843320028,
                    "label": {
                        "en": "UHF: ultra high frequency",
                        "ja": "UHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 0.000012398419843320028,
                    "upperBound": 0.00012398419843320026,
                    "label": {
                        "en": "SHF: super high frequency",
                        "ja": "SHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 0.00012398419843320026,
                    "upperBound": 0.0012398419843320028,
                    "label": {
                        "en": "EHF: extremely high frequency",
                        "ja": "EHF: 極超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 0.0012398419843320028,
            "upperBound": 1.6313710320157928,
            "label": {
                "en": "infrared",
                "ja": "赤外線"
            },
            "fill": "oklch(60% 0.6 90deg / 0.3)",
            "details": [
                {
                    "lowerBound": 0.0012398419843320028,
                    "upperBound": 0.3099604960830007,
                    "label": {
                        "en": "FIR: far infrared",
                        "ja": "FIR: 遠赤外線"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.3)"
                },
                {
                    "lowerBound": 0.3099604960830007,
                    "upperBound": 0.49593679373280103,
                    "label": {
                        "en": "MIR: mid infrared",
                        "ja": "MIR: 中赤外線"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.3)"
                },
                {
                    "lowerBound": 0.49593679373280103,
                    "upperBound": 1.6313710320157928,
                    "label": {
                        "en": "NIR: near infrared",
                        "ja": "NIR: 近赤外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 1.6313710320157928,
            "upperBound": 3.2627420640315856,
            "label": {
                "en": "visible light",
                "ja": "可視光"
            },
            "fill": "oklch(60% 0.6 150deg / 0.25)",
            "details": [
                {
                    "lowerBound": 1.6313710320157928,
                    "upperBound": 1.9837471749312041,
                    "label": {
                        "en": "red light",
                        "ja": "赤色光"
                    },
                    "fill": "#ff000066"
                },
                {
                    "lowerBound": 1.9837471749312041,
                    "upperBound": 2.1014270920881404,
                    "label": {
                        "en": "orange light",
                        "ja": "オレンジ光"
                    },
                    "fill": "#ff800066"
                },
                {
                    "lowerBound": 2.1014270920881404,
                    "upperBound": 2.194410591738058,
                    "label": {
                        "en": "yellow light",
                        "ja": "黄色光"
                    },
                    "fill": "#ffff0066"
                },
                {
                    "lowerBound": 2.194410591738058,
                    "upperBound": 2.4796839686640055,
                    "label": {
                        "en": "green light",
                        "ja": "緑色光"
                    },
                    "fill": "#00ff0066"
                },
                {
                    "lowerBound": 2.4796839686640055,
                    "upperBound": 2.5563752254268097,
                    "label": {
                        "en": "cyan light",
                        "ja": "シアン光"
                    },
                    "fill": "#00ffff66"
                },
                {
                    "lowerBound": 2.5563752254268097,
                    "upperBound": 2.755204409626673,
                    "label": {
                        "en": "blue light",
                        "ja": "青色光"
                    },
                    "fill": "#0000ff66"
                },
                {
                    "lowerBound": 2.755204409626673,
                    "upperBound": 3.2627420640315856,
                    "label": {
                        "en": "violet light",
                        "ja": "紫色光"
                    },
                    "fill": "#8b00ff66"
                }
            ]
        },
        {
            "lowerBound": 3.2627420640315856,
            "upperBound": 123.98419843320028,
            "label": {
                "en": "ultraviolet",
                "ja": "紫外線"
            },
            "fill": "oklch(60% 0.6 270deg / 0.3)",
            "details": [
                {
                    "lowerBound": 3.2627420640315856,
                    "upperBound": 6.199209921660014,
                    "label": {
                        "en": "NUV: near ultraviolet",
                        "ja": "NUV: 近紫外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)",
                    "details": [
                        {
                            "lowerBound": 3.2627420640315856,
                            "upperBound": 3.9360062994666754,
                            "label": {
                                "en": "UV-A: ultraviolet A",
                                "ja": "UV-A: 紫外線A"
                            },
                            "fill": "oklch(60% 0.6 150deg / 0.3)"
                        },
                        {
                            "lowerBound": 3.9360062994666754,
                            "upperBound": 4.428007086900009,
                            "label": {
                                "en": "UV-B: ultraviolet B",
                                "ja": "UV-B: 紫外線B"
                            },
                            "fill": "oklch(60% 0.6 180deg / 0.3)"
                        },
                        {
                            "lowerBound": 4.428007086900009,
                            "upperBound": 6.199209921660014,
                            "label": {
                                "en": "UV-C: ultraviolet C",
                                "ja": "UV-C: 紫外線C"
                            },
                            "fill": "oklch(60% 0.6 210deg / 0.3)"
                        }
                    ]
                },
                {
                    "lowerBound": 6.199209921660014,
                    "upperBound": 123.98419843320028,
                    "label": {
                        "en": "VUV: vacuum ultraviolet",
                        "ja": "VUV: 真空紫外線"
                    },
                    "fill": "oklch(60% 0.6 300deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 123.98419843320028,
            "upperBound": 123984.19843320028,
            "label": {
                "en": "X-rays",
                "ja": "X線"
            },
            "fill": "oklch(60% 0.6 285deg / 0.25)"
        },
        {
            "lowerBound": 123984.19843320028,
            "upperBound": 7.671079033518861e+28,
            "label": {
                "en": "gamma rays",
                "ja": "ガンマ線"
            },
            "fill": "oklch(60% 0.6 300deg / 0.125)"
        }
    ]
});
define("resource/constant/history", [], {
    "$file-name": "history.json",
    "label": "History",
    "unit": {
        "symbol": "s",
        "label": {
            "en": "second",
            "ja": "秒"
        }
    },
    "ticks": [
        {
            "value": 435494818494271300,
            "eval": "",
            "label": "1 CE",
            "label[jp]": "紀元１年",
            "priority": 1,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1949 years ago\")"
            }
        },
        {
            "value": 435494821618473700,
            "label": "100 CE",
            "label[jp]": "紀元100年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1850 years ago\")"
            }
        },
        {
            "value": 435494824774233700,
            "label": "200 CE",
            "label[jp]": "紀元200年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1750 years ago\")"
            }
        },
        {
            "value": 435494827929993700,
            "label": "300 CE",
            "label[jp]": "紀元300年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1650 years ago\")"
            }
        },
        {
            "value": 435494831085753700,
            "label": "400 CE",
            "label[jp]": "紀元400年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1550 years ago\")"
            }
        },
        {
            "value": 435494834241513700,
            "label": "500 CE",
            "label[jp]": "紀元500年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1450 years ago\")"
            }
        },
        {
            "value": 435494837397273700,
            "label": "600 CE",
            "label[jp]": "紀元600年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1350 years ago\")"
            }
        },
        {
            "value": 435494840553033700,
            "label": "700 CE",
            "label[jp]": "紀元700年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1250 years ago\")"
            }
        },
        {
            "value": 435494843708793700,
            "label": "800 CE",
            "label[jp]": "紀元800年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1150 years ago\")"
            }
        },
        {
            "value": 435494846864553700,
            "label": "900 CE",
            "label[jp]": "紀元900年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"1050 years ago\")"
            }
        },
        {
            "value": 435494850020313700,
            "label": "1000 CE",
            "label[jp]": "紀元1000年",
            "priority": 2,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"950 years ago\")"
            }
        },
        {
            "value": 435494853176073700,
            "label": "1100 CE",
            "label[jp]": "紀元1100年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"850 years ago\")"
            }
        },
        {
            "value": 435494856331833700,
            "label": "1200 CE",
            "label[jp]": "紀元1200年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"750 years ago\")"
            }
        },
        {
            "value": 435494859487593700,
            "label": "1300 CE",
            "label[jp]": "紀元1300年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"650 years ago\")"
            }
        },
        {
            "value": 435494862643353700,
            "label": "1400 CE",
            "label[jp]": "紀元1400年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"550 years ago\")"
            }
        },
        {
            "value": 435494865799113700,
            "label": "1500 CE",
            "label[jp]": "紀元1500年",
            "priority": 2,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"450 years ago\")"
            }
        },
        {
            "value": 435494868954873700,
            "label": "1600 CE",
            "label[jp]": "紀元1600年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"350 years ago\")"
            }
        },
        {
            "value": 435494872110633700,
            "label": "1700 CE",
            "label[jp]": "紀元1700年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"250 years ago\")"
            }
        },
        {
            "value": 435494875266393700,
            "label": "1800 CE",
            "label[jp]": "紀元1800年",
            "priority": 4,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"150 years ago\")"
            }
        },
        {
            "value": 435494878422153700,
            "label": "1900 CE",
            "label[jp]": "紀元1900年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"50 years ago\")"
            }
        },
        {
            "label": "BP 0 = 1950 CE",
            "label[jp]": "BP基準年(1950年)",
            "value": 435494880000000000,
            "priority": 0,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"0 second ago\")"
            }
        },
        {
            "value": 435494881577846300,
            "label": "2000 CE",
            "label[jp]": "西暦2000年",
            "priority": 1,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 50 years\")"
            }
        },
        {
            "value": 435494881735630900,
            "label": "2005 CE",
            "label[jp]": "西暦2005年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 55 years\")"
            }
        },
        {
            "value": 435494881893415550,
            "label": "2010 CE",
            "label[jp]": "西暦2010年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 60 years\")"
            }
        },
        {
            "value": 435494882051200200,
            "label": "2015 CE",
            "label[jp]": "西暦2015年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 65 years\")"
            }
        },
        {
            "value": 435494882208984800,
            "label": "2020 CE",
            "label[jp]": "西暦2020年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 70 years\")"
            }
        },
        {
            "value": 435494882366769500,
            "label": "2025 CE",
            "label[jp]": "西暦2025年",
            "priority": 2,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 75 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2026 CE",
            "label[jp]": "西暦2026年",
            "priority": 2,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 76 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2100 CE",
            "label[jp]": "西暦2100年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 150 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2200 CE",
            "label[jp]": "西暦2200年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 250 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2300 CE",
            "label[jp]": "西暦2300年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 350 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2400 CE",
            "label[jp]": "西暦2400年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 450 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2500 CE",
            "label[jp]": "西暦2500年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 550 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2600 CE",
            "label[jp]": "西暦2600年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 650 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2700 CE",
            "label[jp]": "西暦2700年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 750 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2800 CE",
            "label[jp]": "西暦2800年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 850 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "2900 CE",
            "label[jp]": "西暦2900年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 950 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "3000 CE",
            "label[jp]": "西暦3000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 1050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "4000 CE",
            "label[jp]": "西暦4000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 2050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "5000 CE",
            "label[jp]": "西暦5000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 3050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "6000 CE",
            "label[jp]": "西暦6000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 4050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "7000 CE",
            "label[jp]": "西暦7000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 5050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "8000 CE",
            "label[jp]": "西暦8000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 6050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "9000 CE",
            "label[jp]": "西暦9000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 7050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "10 000 CE",
            "label[jp]": "西暦10000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 8050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "20 000 CE",
            "label[jp]": "西暦20000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 18050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "30 000 CE",
            "label[jp]": "西暦30000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 28050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "40 000 CE",
            "label[jp]": "西暦40000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 38050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "50 000 CE",
            "label[jp]": "西暦50000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 48050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "60 000 CE",
            "label[jp]": "西暦60000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 58050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "70 000 CE",
            "label[jp]": "西暦70000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 68050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "80 000 CE",
            "label[jp]": "西暦80000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 78050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "90 000 CE",
            "label[jp]": "西暦90000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 88050 years\")"
            }
        },
        {
            "value": 435494882398326400,
            "label": "100 000 CE",
            "label[jp]": "西暦100000年",
            "priority": 3,
            "$source-eval": {
                "value": "Time.parseRelativeUniverseEpoch(\"in 98050 years\")"
            }
        }
    ],
    "areas": [
        {
            "lowerBound": null,
            "upperBound": 5.391247e-44,
            "label": "Planck epoch",
            "fill": "oklch(60% 0.6 15deg / 0.125)"
        },
        {
            "lowerBound": 5.391247e-44,
            "upperBound": 1e-36,
            "label": "Grand unification epoch",
            "fill": "oklch(60% 0.6 90deg / 0.25)"
        },
        {
            "lowerBound": 1e-36,
            "upperBound": 1e-12,
            "label": "Inflationary epoch",
            "fill": "oklch(60% 0.6 75deg / 0.25)"
        },
        {
            "lowerBound": 1e-12,
            "upperBound": 0.000001,
            "label": "Quark epoch",
            "fill": "oklch(60% 0.6 120deg / 0.25)"
        },
        {
            "lowerBound": 0.000001,
            "upperBound": 1,
            "label": "Hadron epoch",
            "fill": "oklch(60% 0.6 165deg / 0.25)"
        },
        {
            "lowerBound": 1,
            "upperBound": 10,
            "label": "Lepton epoch",
            "fill": "oklch(60% 0.6 210deg / 0.25)"
        },
        {
            "lowerBound": 10,
            "upperBound": 11668320000000,
            "label": "Photon epoch",
            "fill": "oklch(60% 0.6 255deg / 0.25)"
        },
        {
            "lowerBound": 290300000000000000,
            "upperBound": 435494880000000000,
            "label": "Earth history",
            "label[jp]": "地球の歴史",
            "fill": "oklch(60% 0.6 300deg / 0.25)",
            "$source-eval": {
                "upperBound": "Time.getCurrentUniverseEpoch()"
            },
            "details": [
                {
                    "lowerBound": 290300000000000000,
                    "upperBound": 418490000000000000,
                    "label": "Precambrian",
                    "label[jp]": "先カンブリア時代",
                    "fill": "#cfcf0066",
                    "details": [
                        {
                            "lowerBound": 290300000000000000,
                            "upperBound": 309300000000000000,
                            "label": "Hadean Eon",
                            "label[jp]": "冥王代",
                            "fill": "oklch(60% 0.6 150deg / 0.25)"
                        },
                        {
                            "lowerBound": 309300000000000000,
                            "upperBound": 356600000000000000,
                            "label": "Archean Eon",
                            "label[jp]": "太古代",
                            "fill": "oklch(60% 0.6 210deg / 0.25)"
                        },
                        {
                            "lowerBound": 356600000000000000,
                            "upperBound": 418490000000000000,
                            "label": "Proterozoic Eon",
                            "label[jp]": "原生代",
                            "fill": "oklch(60% 0.6 300deg / 0.25)"
                        }
                    ]
                },
                {
                    "lowerBound": 418490000000000000,
                    "upperBound": 435494880000000000,
                    "label": "Phanerozoic",
                    "label[jp]": "顕生代",
                    "fill": "oklch(60% 0.6 270deg / 0.25)",
                    "$source-eval": {
                        "upperBound": "Time.getCurrentUniverseEpoch()"
                    },
                    "details": [
                        {
                            "lowerBound": 418490000000000000,
                            "upperBound": 427540000000000000,
                            "label": "Paleozoic Era",
                            "label[jp]": "古生代",
                            "fill": "#00ff0066",
                            "details": [
                                {
                                    "lowerBound": 418490000000000000,
                                    "upperBound": 420180000000000000,
                                    "label": "Cambrian Period",
                                    "label[jp]": "カンブリア紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 420180000000000000,
                                    "upperBound": 421490000000000000,
                                    "label": "Ordovician Period",
                                    "label[jp]": "オルドビス紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 421490000000000000,
                                    "upperBound": 422270000000000000,
                                    "label": "Silurian Period",
                                    "label[jp]": "シルル紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 422270000000000000,
                                    "upperBound": 424170000000000000,
                                    "label": "Devonian Period",
                                    "label[jp]": "デボン紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 424170000000000000,
                                    "upperBound": 426060000000000000,
                                    "label": "Carboniferous Period",
                                    "label[jp]": "石炭紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 426060000000000000,
                                    "upperBound": 427540000000000000,
                                    "label": "Permian Period",
                                    "label[jp]": "ペルム紀",
                                    "fill": "#cfcf0066"
                                }
                            ]
                        },
                        {
                            "lowerBound": 427540000000000000,
                            "upperBound": 433410000000000000,
                            "label": "Mesozoic Era",
                            "label[jp]": "中生代",
                            "fill": "#7fff0066",
                            "details": [
                                {
                                    "lowerBound": 427540000000000000,
                                    "upperBound": 429140000000000000,
                                    "label": "Triassic Period",
                                    "label[jp]": "三畳紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 429140000000000000,
                                    "upperBound": 430920000000000000,
                                    "label": "Jurassic Period",
                                    "label[jp]": "ジュラ紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 430920000000000000,
                                    "upperBound": 433410000000000000,
                                    "label": "Cretaceous Period",
                                    "label[jp]": "白亜紀",
                                    "fill": "#7fff0066"
                                }
                            ]
                        },
                        {
                            "lowerBound": 433410000000000000,
                            "upperBound": 435494880000000000,
                            "label": "Cenozoic Era",
                            "label[jp]": "新生代",
                            "fill": "#cfcf0066",
                            "$source-eval": {
                                "upperBound": "Time.getCurrentUniverseEpoch()"
                            },
                            "details": [
                                {
                                    "lowerBound": 433410000000000000,
                                    "upperBound": 434770000000000000,
                                    "label": "Paleogene Period",
                                    "label[jp]": "古第三紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 434770000000000000,
                                    "upperBound": 435410000000000000,
                                    "label": "Neogene Period",
                                    "label[jp]": "新第三紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 435410000000000000,
                                    "upperBound": 435494880000000000,
                                    "label": "Quaternary Period",
                                    "label[jp]": "第四紀",
                                    "fill": "#00ff0066",
                                    "$source-eval": {
                                        "upperBound": "Time.getCurrentUniverseEpoch()"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "lowerBound": 435494880000000000,
            "upperBound": null,
            "label": "Future",
            "fill": "oklch(60% 0.6 300deg / 0.125)",
            "$source-eval": {
                "lowerBound": "Time.getCurrentUniverseEpoch()"
            }
        }
    ]
});
define("script/command", ["require", "exports", "script/locale", "script/url", "script/ui", "script/theme", "script/model", "script/view", "script/render", "script/json-eval-updater", "resource/digit/$si", "resource/digit/en", "resource/digit/ja", "resource/constant/size", "resource/constant/area", "resource/constant/volume", "resource/constant/mass", "resource/constant/time", "resource/constant/speed", "resource/constant/energy", "resource/constant/temperature", "resource/constant/counting", "resource/constant/sound-frequency", "resource/constant/emw-wavelength", "resource/constant/emw-frequency", "resource/constant/emw-energy", "resource/constant/history"], function (require, exports, Locale, Url, UI, Theme, Model, View, Render, JsonEvalUpdater, _si_json_1, en_json_2, ja_json_2, size_json_1, area_json_1, volume_json_1, mass_json_1, time_json_1, speed_json_1, energy_json_1, temperature_json_1, counting_json_1, sound_frequency_json_1, emw_wavelength_json_1, emw_frequency_json_1, emw_energy_json_1, history_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.updateTheme = exports.updateLanguage = exports.saveImage = exports.addHistoryLane = exports.addEmwEnergyLane = exports.addEmwFrequencyLane = exports.addEmwWavelengthLane = exports.addSoundFrequencyLane = exports.addCountingLane = exports.addTemperatureLane = exports.addEnergyLane = exports.addSpeedLane = exports.addTimeLane = exports.addMassLane = exports.addVolumeLane = exports.addAreaLane = exports.addSizeLane = exports.AddConstantLane = exports.addJaDigitLane = exports.addEnDigitLane = exports.addSiDigitLane = exports.addDigitLane = exports.addLane = exports.addSlide = void 0;
    Locale = __importStar(Locale);
    Url = __importStar(Url);
    UI = __importStar(UI);
    Theme = __importStar(Theme);
    Model = __importStar(Model);
    View = __importStar(View);
    Render = __importStar(Render);
    JsonEvalUpdater = __importStar(JsonEvalUpdater);
    _si_json_1 = __importDefault(_si_json_1);
    en_json_2 = __importDefault(en_json_2);
    ja_json_2 = __importDefault(ja_json_2);
    size_json_1 = __importDefault(size_json_1);
    area_json_1 = __importDefault(area_json_1);
    volume_json_1 = __importDefault(volume_json_1);
    mass_json_1 = __importDefault(mass_json_1);
    time_json_1 = __importDefault(time_json_1);
    speed_json_1 = __importDefault(speed_json_1);
    energy_json_1 = __importDefault(energy_json_1);
    temperature_json_1 = __importDefault(temperature_json_1);
    counting_json_1 = __importDefault(counting_json_1);
    sound_frequency_json_1 = __importDefault(sound_frequency_json_1);
    emw_wavelength_json_1 = __importDefault(emw_wavelength_json_1);
    emw_frequency_json_1 = __importDefault(emw_frequency_json_1);
    emw_energy_json_1 = __importDefault(emw_energy_json_1);
    history_json_1 = __importDefault(history_json_1);
    const constant = {};
    const addSlide = () => {
        var _a, _b;
        const { slide: lastSlide, lane: lastLane } = Model.getLastSlideAndLastLane();
        const lastValue = (_b = (_a = Model.getCursorValue(lastSlide, lastLane, View.data)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 1;
        const slide = Model.makeSlide(lastValue);
        slide.lanes.push(Model.makeLane({
            type: "logarithmic",
        }));
        Model.data.slides.push(slide);
        Render.markDirty();
    };
    exports.addSlide = addSlide;
    const addLane = (laneSeed) => {
        const { slide } = Model.getLastSlideAndLastLane();
        const lane = Model.makeLane(laneSeed);
        slide.lanes.push(lane);
        Render.markDirty();
    };
    exports.addLane = addLane;
    const addDigitLane = (digitTable) => (0, exports.addLane)({
        name: digitTable.label,
        type: "digit",
        digit: digitTable,
    });
    exports.addDigitLane = addDigitLane;
    const addSiDigitLane = () => (0, exports.addDigitLane)(_si_json_1.default);
    exports.addSiDigitLane = addSiDigitLane;
    const addEnDigitLane = () => (0, exports.addDigitLane)(en_json_2.default);
    exports.addEnDigitLane = addEnDigitLane;
    const addJaDigitLane = () => (0, exports.addDigitLane)(ja_json_2.default);
    exports.addJaDigitLane = addJaDigitLane;
    const AddConstantLane = (constant) => (0, exports.addLane)({
        name: constant.label,
        type: "constant",
        table: constant,
    });
    exports.AddConstantLane = AddConstantLane;
    const addSizeLane = () => (0, exports.AddConstantLane)(constant["size"]);
    exports.addSizeLane = addSizeLane;
    const addAreaLane = () => (0, exports.AddConstantLane)(constant["area"]);
    exports.addAreaLane = addAreaLane;
    const addVolumeLane = () => (0, exports.AddConstantLane)(constant["volume"]);
    exports.addVolumeLane = addVolumeLane;
    const addMassLane = () => (0, exports.AddConstantLane)(constant["mass"]);
    exports.addMassLane = addMassLane;
    const addTimeLane = () => (0, exports.AddConstantLane)(constant["time"]);
    exports.addTimeLane = addTimeLane;
    const addSpeedLane = () => (0, exports.AddConstantLane)(constant["speed"]);
    exports.addSpeedLane = addSpeedLane;
    const addEnergyLane = () => (0, exports.AddConstantLane)(constant["energy"]);
    exports.addEnergyLane = addEnergyLane;
    const addTemperatureLane = () => (0, exports.AddConstantLane)(constant["temperature"]);
    exports.addTemperatureLane = addTemperatureLane;
    const addCountingLane = () => (0, exports.AddConstantLane)(constant["counting"]);
    exports.addCountingLane = addCountingLane;
    const addSoundFrequencyLane = () => (0, exports.AddConstantLane)(constant["sound-frequency"]);
    exports.addSoundFrequencyLane = addSoundFrequencyLane;
    const addEmwWavelengthLane = () => (0, exports.AddConstantLane)(constant["emw-wavelength"]);
    exports.addEmwWavelengthLane = addEmwWavelengthLane;
    const addEmwFrequencyLane = () => (0, exports.AddConstantLane)(constant["emw-frequency"]);
    exports.addEmwFrequencyLane = addEmwFrequencyLane;
    const addEmwEnergyLane = () => (0, exports.AddConstantLane)(constant["emw-energy"]);
    exports.addEmwEnergyLane = addEmwEnergyLane;
    const addHistoryLane = () => (0, exports.AddConstantLane)(constant["history"]);
    exports.addHistoryLane = addHistoryLane;
    const saveImage = () => {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(UI.rulerSvg);
        const blob = new Blob([source], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `smart-rule-${new Date().toISOString()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };
    exports.saveImage = saveImage;
    const updateLanguage = () => {
        Locale.setLocale(UI.SettingsPanel.languageSelect.value, Url.get("locale"));
        UI.updateLanguage();
        Render.markDirty();
    };
    exports.updateLanguage = updateLanguage;
    const updateTheme = () => {
        Theme.update();
        Render.markDirty();
    };
    exports.updateTheme = updateTheme;
    const initialize = () => {
        constant["size"] = JsonEvalUpdater.updateJsonWithEval(size_json_1.default, "$SILENT");
        constant["area"] = JsonEvalUpdater.updateJsonWithEval(area_json_1.default, "$SILENT");
        constant["volume"] = JsonEvalUpdater.updateJsonWithEval(volume_json_1.default, "$SILENT");
        constant["mass"] = JsonEvalUpdater.updateJsonWithEval(mass_json_1.default, "$SILENT");
        constant["time"] = JsonEvalUpdater.updateJsonWithEval(time_json_1.default, "$SILENT");
        constant["speed"] = JsonEvalUpdater.updateJsonWithEval(speed_json_1.default, "$SILENT");
        constant["energy"] = JsonEvalUpdater.updateJsonWithEval(energy_json_1.default, "$SILENT");
        constant["temperature"] = JsonEvalUpdater.updateJsonWithEval(temperature_json_1.default, "$SILENT");
        constant["counting"] = JsonEvalUpdater.updateJsonWithEval(counting_json_1.default, "$SILENT");
        constant["sound-frequency"] = JsonEvalUpdater.updateJsonWithEval(sound_frequency_json_1.default, "$SILENT");
        constant["emw-wavelength"] = JsonEvalUpdater.updateJsonWithEval(emw_wavelength_json_1.default, "$SILENT");
        constant["emw-frequency"] = JsonEvalUpdater.updateJsonWithEval(emw_frequency_json_1.default, "$SILENT");
        constant["emw-energy"] = JsonEvalUpdater.updateJsonWithEval(emw_energy_json_1.default, "$SILENT");
        constant["history"] = JsonEvalUpdater.updateJsonWithEval(history_json_1.default, "$SILENT");
        (0, exports.updateLanguage)();
        (0, exports.updateTheme)();
    };
    exports.initialize = initialize;
});
define("script/grid", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderer = void 0;
    const renderer = (_model, _view, _dirty) => {
    };
    exports.renderer = renderer;
});
define("script/graph", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderer = void 0;
    const renderer = (_model, _view, _dirty) => {
    };
    exports.renderer = renderer;
});
define("script/event", ["require", "exports", "script/type", "script/number", "script/environment", "script/view", "script/model", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph", "script/command", "resource/config"], function (require, exports, Type, Number, Environment, View, Model, UI, Render, Ruler, Grid, Graph, Command, config_json_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.bindCommandToButton = exports.resetZoom = exports.horizontalScroll = exports.verticalScroll = exports.shiftSlide = exports.zoomByRange = exports.zoom = exports.getZoomCenter = exports.zoomOut = exports.zoomIn = exports.updateViewLockRoundBar = exports.updateViewScaleRoundBar = exports.getViewScaleExponentFromRate = exports.getViewScaleRate = exports.updateViewModeRoundBar = void 0;
    Type = __importStar(Type);
    Number = __importStar(Number);
    Environment = __importStar(Environment);
    View = __importStar(View);
    Model = __importStar(Model);
    UI = __importStar(UI);
    Render = __importStar(Render);
    Ruler = __importStar(Ruler);
    Grid = __importStar(Grid);
    Graph = __importStar(Graph);
    Command = __importStar(Command);
    config_json_8 = __importDefault(config_json_8);
    const updateViewModeRoundBar = () => UI.updateRoundBar(UI.ControlPanel.viewModeButton, {
        low: 0 / Type.viewModeList.length,
        high: 1 / Type.viewModeList.length,
        rotate: Type.viewModeList.indexOf(View.getViewMode()) / Type.viewModeList.length,
    });
    exports.updateViewModeRoundBar = updateViewModeRoundBar;
    const getViewScaleRate = () => (View.data.viewScaleExponent - config_json_8.default.view.minZoomLevel) / (config_json_8.default.view.maxZoomLevel - config_json_8.default.view.minZoomLevel);
    exports.getViewScaleRate = getViewScaleRate;
    const getViewScaleExponentFromRate = (rate) => config_json_8.default.view.minZoomLevel + (rate * (config_json_8.default.view.maxZoomLevel - config_json_8.default.view.minZoomLevel));
    exports.getViewScaleExponentFromRate = getViewScaleExponentFromRate;
    const updateViewScaleRoundBar = () => {
        UI.updateRoundBar(UI.ControlPanel.viewScaleButton, {
            low: 0,
            high: (0, exports.getViewScaleRate)(),
            rotate: 0,
        });
        UI.ControlPanel.viewScaleRange.value = ((0, exports.getViewScaleRate)() * 100).toString();
    };
    exports.updateViewScaleRoundBar = updateViewScaleRoundBar;
    const updateViewLockRoundBar = () => UI.updateRoundBar(UI.ControlPanel.viewLockButton, View.isLocked());
    exports.updateViewLockRoundBar = updateViewLockRoundBar;
    const zoomIn = () => (0, exports.zoom)(config_json_8.default.view.zooomUnit);
    exports.zoomIn = zoomIn;
    const zoomOut = () => (0, exports.zoom)(-config_json_8.default.view.zooomUnit);
    exports.zoomOut = zoomOut;
    const getZoomCenter = (event) => {
        const { slide, lane } = Model.getRootSlideAndRootLane();
        const cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data);
        if (undefined !== event) {
            const zoomCenter = event.clientY;
            if (0 <= zoomCenter && zoomCenter <= window.innerHeight && 50 <= Math.abs(zoomCenter - cursorPosition)) {
                return zoomCenter;
            }
        }
        if (undefined !== cursorPosition && 0 <= cursorPosition && cursorPosition <= window.innerHeight) {
            return cursorPosition;
        }
        return window.innerHeight / 2;
    };
    exports.getZoomCenter = getZoomCenter;
    const zoom = (delta, event) => {
        var _a;
        const current = View.data.viewScaleExponent;
        const next = Math.min(config_json_8.default.view.maxZoomLevel, Math.max(config_json_8.default.view.minZoomLevel, current + delta));
        const { slide, lane } = Model.getRootSlideAndRootLane();
        const zoomCenter = (0, exports.getZoomCenter)(event);
        // const cursorValues = Model.getCursorValues(View.data);
        const centerValue = (_a = Model.getValueAt(slide, lane, zoomCenter, View.data)) !== null && _a !== void 0 ? _a : (delta < 0 ? Number.MIN_VALUE : Number.MAX_VALUE);
        View.setViewScaleExponent(next);
        const temporaryCursorPosition = Model.getPositionAt(slide, lane, centerValue, View.data);
        (0, exports.verticalScroll)("NOSNAP", temporaryCursorPosition - zoomCenter);
        // const newCursorPosition = Model.getPositionAt(slide, lane, centerValue, View.data);
        // for(let i = 1; i < cursorValues.length; ++i)
        // {
        //     const cursorValue = cursorValues[i];
        //     if (undefined !== cursorValue)
        //     {
        //         const slide = Model.data.slides[i];
        //         const lane = slide.lanes[0];
        //         const cursorPosition = Model.getPositionAt(slide, lane, cursorValue, View.data);
        //         shiftSlide(slide, cursorPosition -newCursorPosition);
        //     }
        // }
        Render.markDirty();
        (0, exports.updateViewScaleRoundBar)();
        console.log(`Zoomed(${delta}): ${current} -> ${next}`);
    };
    exports.zoom = zoom;
    const zoomByRange = (value) => (0, exports.zoom)((0, exports.getViewScaleExponentFromRate)(value * 0.01) - View.data.viewScaleExponent);
    exports.zoomByRange = zoomByRange;
    const shiftSlide = (event, slide, delta) => {
        var _a, _b;
        const { anchorSlide, anchorLane } = Model.getAnchorSlideAndLane(slide);
        if (undefined === anchorSlide || undefined === anchorLane || View.isLocked()) {
            const current = Model.data.offset.y;
            const next = current - delta;
            const lane = slide.lanes[0];
            const halfWindowHeight = window.innerHeight / 2;
            const minPosition = ((_a = Model.getRawViewPositionAt(lane, Number.MIN_VALUE, View.data)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE) + halfWindowHeight;
            const maxPosition = ((_b = Model.getRawViewPositionAt(lane, Number.MAX_VALUE, View.data)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE) + halfWindowHeight;
            Model.data.offset.y = Math.min(maxPosition, Math.max(minPosition, next));
            Render.markDirty();
        }
        else {
            const currentPosition = Model.getPositionAt(anchorSlide, anchorLane, slide.anchor, View.data);
            const nextPosition = currentPosition - (delta + verticalSnapDelta);
            const snappedNextPosition = Ruler.snapVerticalPosition(event, View.data, nextPosition, Model.getSnapReferenceLaneIndex(slide));
            updateVerticalSnapDelta(snappedNextPosition - nextPosition);
            const nextValue = Model.getValueAt(anchorSlide, anchorLane, snappedNextPosition, View.data);
            if (undefined === nextValue) {
                console.warn(`🦋 FIXME: shiftSlide: nextValue is undefined, currentPosition=${currentPosition}, delta=${delta}`);
            }
            else {
                slide.anchor = Number.clamp(nextValue.value);
                for (let i = Model.getLaneIndex(slide.lanes[0]); i < Model.getAllLaneCount(); ++i) {
                    Render.markDirty(`LANE:${i}`);
                }
            }
        }
    };
    exports.shiftSlide = shiftSlide;
    const verticalScroll = (event, delta, slide = Model.getRootSlide()) => {
        // Model.data.slides.forEach(slide => shiftSlide(slide, delta));
        (0, exports.shiftSlide)(event, slide, delta);
    };
    exports.verticalScroll = verticalScroll;
    const horizontalScroll = (event, delta) => {
        const current = Model.data.offset.x;
        const min = 0;
        const max = Math.max(0, Ruler.getRulerWidth() - (window.innerWidth - (UI.rulerNewSlidePanel.clientWidth + UI.rulerHelpPanel.clientWidth)));
        const next = Math.min(max, Math.max(min, current + delta - horizontalSnapDelta));
        const snappedPosition = Ruler.snapHorizontalPosition(event, next);
        updateHorizontalSnapDelta(snappedPosition - next);
        Model.data.offset.x = snappedPosition;
        Render.markDirty();
    };
    exports.horizontalScroll = horizontalScroll;
    const resetZoom = () => {
        const current = View.data.viewScaleExponent;
        const next = config_json_8.default.view.defaultZoomLevel;
        View.setViewScaleExponent(next);
        Render.markDirty();
        console.log(`Zoom reset: ${current} -> ${next}`);
    };
    exports.resetZoom = resetZoom;
    let touchZoomPreviousDistance = null;
    let verticalSnapDelta = 0;
    const updateVerticalSnapDelta = (value) => verticalSnapDelta = Math.min(Math.max(value, -32), 32);
    let horizontalSnapDelta = 0;
    const updateHorizontalSnapDelta = (value) => horizontalSnapDelta = Math.min(Math.max(value, -200), 200);
    const activeTouches = new Map();
    const bindCommandToButton = (button, command) => button.addEventListener("click", event => {
        event.preventDefault();
        command();
    });
    exports.bindCommandToButton = bindCommandToButton;
    const initialize = () => {
        console.log("Event initialized");
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => Command.updateTheme());
        window.addEventListener("resize", () => {
            Render.resize();
            (0, exports.horizontalScroll)("NOSNAP", 0);
            // Render.markDirty();
        });
        window.addEventListener("wheel", event => {
            var _a, _b, _c, _d;
            if (Environment.isApple() ? (event.metaKey && event.ctrlKey) : (event.ctrlKey && event.altKey)) {
                event.preventDefault();
                const { slide, lane } = Model.getRootSlideAndRootLane();
                const cursorPosition = (_a = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _a !== void 0 ? _a : 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition - (-event.deltaY + verticalSnapDelta)));
                const newCursorPosition = (_b = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _b !== void 0 ? _b : 0;
                const cursorDelta = newCursorPosition - cursorPosition;
                (0, exports.verticalScroll)(event, cursorDelta, Model.getRootSlide());
            }
            else if (Environment.isApple() ? event.metaKey : event.ctrlKey) {
                event.preventDefault();
                (0, exports.zoom)(event.deltaY * config_json_8.default.view.zoomRate, event);
            }
            else if (Environment.isApple() ? event.ctrlKey : event.altKey) {
                event.preventDefault();
                const { slide, lane } = Model.getRootSlideAndRootLane();
                const cursorPosition = (_c = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _c !== void 0 ? _c : 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition - (event.deltaY + verticalSnapDelta)));
            }
            else {
                (0, exports.verticalScroll)(event, event.deltaY, Model.getSlideFromLane(Model.getLane((_d = Ruler.getLaneIndexFromPosition(event.clientX + Model.data.offset.x)) !== null && _d !== void 0 ? _d : 0)));
                (0, exports.horizontalScroll)(event, event.deltaX);
            }
        }, {
            passive: false,
        });
        window.addEventListener("keydown", event => {
            if (Environment.isApple() ? event.metaKey : event.ctrlKey) {
                switch (event.key) {
                    case "+":
                    case ";":
                    case "=":
                        event.preventDefault();
                        (0, exports.zoomIn)();
                        break;
                    case "-":
                    case "_":
                        event.preventDefault();
                        (0, exports.zoomOut)();
                        break;
                    case "0":
                        event.preventDefault();
                        (0, exports.resetZoom)();
                        break;
                    default:
                        console.log(`Keydown event: key=${event.key}`);
                        break;
                }
            }
            else {
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault();
                        (0, exports.verticalScroll)(event, -config_json_8.default.view.scrollUnit);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        (0, exports.verticalScroll)(event, config_json_8.default.view.scrollUnit);
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, config_json_8.default.view.scrollUnit);
                        break;
                    case "ArrowRight":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, -config_json_8.default.view.scrollUnit);
                        break;
                    case "l":
                        event.preventDefault();
                        View.setLocked(!View.isLocked());
                        (0, exports.updateViewLockRoundBar)();
                        console.log(`View lock toggled: ${View.isLocked()}`);
                        break;
                    default:
                        console.log(`Keydown event: key=${event.key}`);
                        break;
                }
            }
        });
        UI.viewList.addEventListener("pointerdown", event => {
            //if ("touch" === event.pointerType)
            //{
            activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
            // prevent default to avoid browser gestures interfering if desired
            // keep passive false on pointerdown to allow preventDefault if necessary
            //event.preventDefault();
            touchZoomPreviousDistance = null;
            //}
        }, {
            passive: false,
        });
        UI.viewList.addEventListener("pointerup", event => {
            //if ("touch" === event.pointerType)
            //{
            activeTouches.delete(event.pointerId);
            touchZoomPreviousDistance = null;
            //}
        }, {
            passive: false,
        });
        UI.viewList.addEventListener("pointercancel", event => {
            //if ("touch" === event.pointerType)
            //{
            activeTouches.delete(event.pointerId);
            touchZoomPreviousDistance = null;
            //}
        }, {
            passive: false,
        });
        let pointerMoveTimeout = null;
        const clearPointerMoveTimeout = () => {
            if (null !== pointerMoveTimeout) {
                clearTimeout(pointerMoveTimeout);
                pointerMoveTimeout = null;
            }
        };
        const forcePointerClear = () => {
            clearPointerMoveTimeout();
            activeTouches.clear();
            touchZoomPreviousDistance = null;
        };
        UI.viewList.addEventListener("pointermove", event => {
            var _a;
            //if ("touch" === event.pointerType)
            //{
            if (activeTouches.has(event.pointerId)) {
                activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
                if (1 === activeTouches.size) {
                    (0, exports.verticalScroll)(event, -event.movementY, Model.getSlideFromLane(Model.getLane((_a = Ruler.getLaneIndexFromPosition(event.clientX + Model.data.offset.x)) !== null && _a !== void 0 ? _a : 0)));
                    (0, exports.horizontalScroll)(event, -event.movementX);
                }
                if (2 === activeTouches.size) {
                    event.preventDefault();
                    const iter = activeTouches.values();
                    const a = iter.next().value;
                    const b = iter.next().value;
                    if (a && "touch" === a.type && b && "touch" === b.type) {
                        const currentDistance = Math.hypot(b.x - a.x, b.y - a.y);
                        if (null !== touchZoomPreviousDistance) {
                            const delta = currentDistance - touchZoomPreviousDistance;
                            if (Math.abs(delta) <= config_json_8.default.view.touchZoomThreshold) {
                                (0, exports.zoom)(delta * config_json_8.default.view.zoomRate, event);
                            }
                        }
                        touchZoomPreviousDistance = currentDistance;
                    }
                    else {
                        touchZoomPreviousDistance = null;
                    }
                }
                else {
                    touchZoomPreviousDistance = null;
                }
            }
            clearPointerMoveTimeout();
            pointerMoveTimeout = setTimeout(forcePointerClear, 350);
            //}
        }, {
            passive: false,
        });
        UI.ControlPanel.viewModeButton.addEventListener("click", event => {
            event.preventDefault();
            const current = View.getViewMode();
            const next = Type.getNext(Type.viewModeList, current);
            View.setViewMode(next);
            (0, exports.updateViewModeRoundBar)();
            switch (next) {
                case "ruler":
                    Render.setRenderer(Ruler.renderer);
                    break;
                case "grid":
                    Render.setRenderer(Grid.renderer);
                    break;
                case "graph":
                    Render.setRenderer(Graph.renderer);
                    break;
            }
            Render.markDirty();
            console.log(`View mode changed: ${current} -> ${next}`);
        });
        UI.ControlPanel.viewScaleButton.addEventListener("click", event => {
            event.preventDefault();
            UI.ControlPanel.viewScalePanel.classList.toggle("show", UI.ControlPanel.viewScaleButton.classList.toggle("on"));
        });
        UI.ControlPanel.viewScaleRange.addEventListener("input", () => (0, exports.zoomByRange)(UI.ControlPanel.viewScaleRange.valueAsNumber));
        UI.ControlPanel.viewScaleRange.addEventListener("change", () => (0, exports.zoomByRange)(UI.ControlPanel.viewScaleRange.valueAsNumber));
        UI.ControlPanel.viewLockButton.addEventListener("click", event => {
            event.preventDefault();
            const locked = !View.isLocked();
            View.setLocked(locked);
            (0, exports.updateViewLockRoundBar)();
            console.log(`View lock toggled: ${locked}`);
        });
        (0, exports.bindCommandToButton)(UI.addSlideButton, Command.addSlide);
        (0, exports.bindCommandToButton)(UI.addSiDigitLaneButton, Command.addSiDigitLane);
        (0, exports.bindCommandToButton)(UI.addEnDigitLaneButton, Command.addEnDigitLane);
        (0, exports.bindCommandToButton)(UI.addJaDigitLaneButton, Command.addJaDigitLane);
        (0, exports.bindCommandToButton)(UI.addInvertLaneButton, () => Command.addLane({ type: "invert" }));
        (0, exports.bindCommandToButton)(UI.addSquaredLaneButton, () => Command.addLane({ type: "power", exponent: 2 }));
        (0, exports.bindCommandToButton)(UI.addCubedLaneButton, () => Command.addLane({ type: "power", exponent: 3 }));
        (0, exports.bindCommandToButton)(UI.addSquareRootLaneButton, () => Command.addLane({ type: "power", exponent: 0.5 }));
        (0, exports.bindCommandToButton)(UI.addCubeRootLaneButton, () => Command.addLane({ type: "power", exponent: 1 / 3 }));
        (0, exports.bindCommandToButton)(UI.addSineLaneButton, () => Command.addLane({ type: "sine" }));
        (0, exports.bindCommandToButton)(UI.addCosineLaneButton, () => Command.addLane({ type: "cosine" }));
        (0, exports.bindCommandToButton)(UI.addTangentLaneButton, () => Command.addLane({ type: "tangent" }));
        (0, exports.bindCommandToButton)(UI.addCotangentLaneButton, () => Command.addLane({ type: "cotangent" }));
        (0, exports.bindCommandToButton)(UI.add2nLaneButton, () => Command.addLane({ type: "2^n" }));
        (0, exports.bindCommandToButton)(UI.addPrimeNumbersLaneButton, () => Command.addLane({ type: "prime", name: "Prime Numbers" }));
        (0, exports.bindCommandToButton)(UI.addPrimeDecompositionLaneButton, () => Command.addLane({ type: "prime-decomposition", name: "Prime Decomposition", withoutLabel: true }));
        (0, exports.bindCommandToButton)(UI.addSizeLaneButton, Command.addSizeLane);
        (0, exports.bindCommandToButton)(UI.addAreaLaneButton, Command.addAreaLane);
        (0, exports.bindCommandToButton)(UI.addVolumeLaneButton, Command.addVolumeLane);
        (0, exports.bindCommandToButton)(UI.addMassLaneButton, Command.addMassLane);
        (0, exports.bindCommandToButton)(UI.addTimeLaneButton, Command.addTimeLane);
        (0, exports.bindCommandToButton)(UI.addSpeedLaneButton, Command.addSpeedLane);
        (0, exports.bindCommandToButton)(UI.addEnergyLaneButton, Command.addEnergyLane);
        (0, exports.bindCommandToButton)(UI.addTemperatureLaneButton, Command.addTemperatureLane);
        (0, exports.bindCommandToButton)(UI.addCountingLaneButton, Command.addCountingLane);
        (0, exports.bindCommandToButton)(UI.addSoundFrequencyLaneButton, Command.addSoundFrequencyLane);
        (0, exports.bindCommandToButton)(UI.addEmwWavelengthLaneButton, Command.addEmwWavelengthLane);
        (0, exports.bindCommandToButton)(UI.addEmwFrequencyLaneButton, Command.addEmwFrequencyLane);
        (0, exports.bindCommandToButton)(UI.addEmwEnergyLaneButton, Command.addEmwEnergyLane);
        (0, exports.bindCommandToButton)(UI.addHistoryLaneButton, Command.addHistoryLane);
        (0, exports.bindCommandToButton)(UI.saveImageButton, Command.saveImage);
        UI.SettingsPanel.languageSelect.addEventListener("change", () => Command.updateLanguage());
        UI.SettingsPanel.themeSelect.addEventListener("change", () => Command.updateTheme());
        UI.SettingsPanel.threeDigitSeparatorSelect.addEventListener("change", () => Render.markDirty());
        UI.SettingsPanel.exponentFormatSelect.addEventListener("change", () => Render.markDirty());
        UI.SettingsPanel.exponentMultipleOfThreeCheckbox.addEventListener("change", () => Render.markDirty());
        UI.SettingsPanel.numberFormatSelect.addEventListener("change", () => Render.markDirty());
        (0, exports.updateViewModeRoundBar)();
        (0, exports.updateViewScaleRoundBar)();
        (0, exports.updateViewLockRoundBar)();
        (0, exports.shiftSlide)("NOSNAP", Model.getRootSlide(), Model.getCursorPosition(View.data) - (window.innerHeight / 2));
    };
    exports.initialize = initialize;
});
define("script/index", ["require", "exports", "script/locale", "script/url", "script/type", "script/json-eval-updater", "script/time", "script/ui", "script/model", "script/view", "script/ruler", "script/render", "script/command", "script/event", "resource/config", "resource/constant/size", "resource/constant/area", "resource/constant/volume", "resource/constant/mass", "resource/constant/time", "resource/constant/speed", "resource/constant/energy", "resource/constant/temperature", "resource/constant/counting", "resource/constant/sound-frequency", "resource/constant/emw-wavelength", "resource/constant/emw-frequency", "resource/constant/emw-energy", "resource/constant/history"], function (require, exports, Locale, Url, Type, JsonEvalUpdater, Time, UI, Model, View, Ruler, Render, Command, Event, config_json_9, size_json_2, area_json_2, volume_json_2, mass_json_2, time_json_2, speed_json_2, energy_json_2, temperature_json_2, counting_json_2, sound_frequency_json_2, emw_wavelength_json_2, emw_frequency_json_2, emw_energy_json_2, history_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Locale = __importStar(Locale);
    Url = __importStar(Url);
    Type = __importStar(Type);
    JsonEvalUpdater = __importStar(JsonEvalUpdater);
    Time = __importStar(Time);
    UI = __importStar(UI);
    Model = __importStar(Model);
    View = __importStar(View);
    Ruler = __importStar(Ruler);
    Render = __importStar(Render);
    Command = __importStar(Command);
    Event = __importStar(Event);
    config_json_9 = __importDefault(config_json_9);
    size_json_2 = __importDefault(size_json_2);
    area_json_2 = __importDefault(area_json_2);
    volume_json_2 = __importDefault(volume_json_2);
    mass_json_2 = __importDefault(mass_json_2);
    time_json_2 = __importDefault(time_json_2);
    speed_json_2 = __importDefault(speed_json_2);
    energy_json_2 = __importDefault(energy_json_2);
    temperature_json_2 = __importDefault(temperature_json_2);
    counting_json_2 = __importDefault(counting_json_2);
    sound_frequency_json_2 = __importDefault(sound_frequency_json_2);
    emw_wavelength_json_2 = __importDefault(emw_wavelength_json_2);
    emw_frequency_json_2 = __importDefault(emw_frequency_json_2);
    emw_energy_json_2 = __importDefault(emw_energy_json_2);
    history_json_2 = __importDefault(history_json_2);
    console.log("🚀 Slide Rule build script");
    const constant = {
        size: size_json_2.default,
        area: area_json_2.default,
        volume: volume_json_2.default,
        mass: mass_json_2.default,
        time: time_json_2.default,
        speed: speed_json_2.default,
        energy: energy_json_2.default,
        temperature: temperature_json_2.default,
        counting: counting_json_2.default,
        soundFrequency: sound_frequency_json_2.default,
        emwWavelength: emw_wavelength_json_2.default,
        emwFrequency: emw_frequency_json_2.default,
        emwEnergy: emw_energy_json_2.default,
        history: history_json_2.default,
    };
    const global = {
        Locale,
        Url,
        Type,
        Time,
        UI,
        Model,
        View,
        Event,
        Ruler,
        Render,
        Command,
        config: config_json_9.default,
        constant,
        nestEvalUpdate: JsonEvalUpdater.nestEvalUpdate,
        soundScaleToFrequency: JsonEvalUpdater.midiNoteToFrequency,
        waveLengthToFrequency: JsonEvalUpdater.waveLengthToFrequency,
        frequencyToWaveLength: JsonEvalUpdater.frequencyToWaveLength,
        roundE: JsonEvalUpdater.roundE,
        updateJsonWithEval: (json) => JsonEvalUpdater.saveJson(JsonEvalUpdater.updateJsonWithEval(json, json["$file-name"] || undefined)),
    };
    for (const key of Object.keys(global)) {
        window[key] = global[key];
    }
    Type;
    Url.initialize();
    Time.initialize();
    UI.initialize();
    Model.initialize();
    View.initialize();
    Ruler.initialize();
    Command.initialize();
    Event.initialize();
    Render.setRenderer(Ruler.renderer);
});
//# sourceMappingURL=index.js.map