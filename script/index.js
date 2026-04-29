var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    "Help": "Help"
});
define("resource/lang/ja", [], {
    "lang-label": "日本語",
    "lang-direction": "ltr",
    "lang-colon-suffix": "：",
    "Auto": "自動",
    "Settings": "設定",
    "Language": "言語",
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
    var supportedLangs = Object.keys(exports.master);
    var getSegments = function (text, separator, segments) {
        return text.split(separator).slice(0, segments).join(separator);
    };
    var lookupValue = function (list, value) {
        return list.includes(value) ? value : undefined;
    };
    exports.lookupValue = lookupValue;
    var getMatchLang = function (lang, canonicalLangs) {
        var _a;
        if (canonicalLangs === void 0) { canonicalLangs = supportedLangs; }
        return (_a = (0, exports.lookupValue)(canonicalLangs, getSegments(lang, "-", 2))) !== null && _a !== void 0 ? _a : (0, exports.lookupValue)(canonicalLangs, getSegments(lang, "-", 1));
    };
    var getDefaultLang = function () {
        var _a, _b;
        return (_b = (_a = getMatchLang(navigator.language.toLowerCase())) !== null && _a !== void 0 ? _a : navigator.languages.map(function (i) { return getMatchLang(i.toLowerCase()); }).filter(function (i) { return i !== undefined; })[0]) !== null && _b !== void 0 ? _b : "en";
    };
    var lang = getDefaultLang();
    var getLocale = function () { return lang; };
    exports.getLocale = getLocale;
    var setLocale = function (locale, urlLocale) {
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
    var getDirection = function (l) {
        return exports.master[l !== null && l !== void 0 ? l : lang]["lang-direction"];
    };
    exports.getDirection = getDirection;
    var isRtl = function (l) {
        return "rtl" === (0, exports.getDirection)(l);
    };
    exports.isRtl = isRtl;
    var isLtr = function (l) {
        return "ltr" === (0, exports.getDirection)(l);
    };
    exports.isLtr = isLtr;
    var toRtl = function (text, f) {
        return false === f ? text : "\u202B".concat(text, "\u202C");
    };
    exports.toRtl = toRtl;
    var getColonSuffix = function (l) { var _a; return ((_a = exports.master[l !== null && l !== void 0 ? l : lang]["lang-colon-suffix"]) !== null && _a !== void 0 ? _a : ":"); };
    exports.getColonSuffix = getColonSuffix;
    var map = function (key, l) {
        return "" === key ? "" : exports.master[l !== null && l !== void 0 ? l : lang][key];
    };
    exports.map = map;
    var resolve = function (table, l) {
        var _a, _b;
        return "string" === typeof table || (!table) ?
            table :
            (_b = table[(_a = getMatchLang(l !== null && l !== void 0 ? l : lang, Object.keys(table))) !== null && _a !== void 0 ? _a : "en"]) !== null && _b !== void 0 ? _b : table["en"];
    };
    exports.resolve = resolve;
    var getLocaleList = function () {
        return __spreadArray(["Auto"], supportedLangs, true);
    };
    exports.getLocaleList = getLocaleList;
});
define("script/url", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reloadParameters = exports.initialize = exports.get = exports.addParameter = exports.make = exports.parseParameter = void 0;
    var parseParameter = function (url) {
        var result = {};
        var urlObj = new URL(url.replace(/#/g, "?"));
        var params = urlObj.searchParams;
        params.forEach(function (value, key) { return result[key] = value; });
        return result;
    };
    exports.parseParameter = parseParameter;
    var make = function () {
        var url = new URL(window.location.href.replace(/#/g, "?"));
        for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            url.searchParams.set(key, value);
        }
        return url.toString().replace(/\?/g, "#");
    };
    exports.make = make;
    var addParameter = function (key, value) {
        params[key] = value;
        pushUrl();
        return params;
    };
    exports.addParameter = addParameter;
    var get = function (key) {
        return params[key];
    };
    exports.get = get;
    var pushUrl = function () {
        return window.history.replaceState({}, "", (0, exports.make)());
    };
    var initialize = function () {
    };
    exports.initialize = initialize;
    var params = (0, exports.parseParameter)(window.location.href);
    var reloadParameters = function () {
        return params = (0, exports.parseParameter)(window.location.href);
    };
    exports.reloadParameters = reloadParameters;
});
define("script/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTickValue = exports.getExValueNumber = exports.getViewScale = exports.viewModeList = exports.getNext = exports.getNamedNumberLabel = exports.getNamedNumberValue = exports.phi = exports.isNamedNumber = exports.namedNumberList = void 0;
    exports.namedNumberList = ["phi", "e", "pi"];
    var isNamedNumber = function (value) {
        return exports.namedNumberList.includes(value);
    };
    exports.isNamedNumber = isNamedNumber;
    exports.phi = (1 + Math.sqrt(5)) / 2;
    // phi approximately 1.618033988749895
    // e approximately 2.718281828459045
    // pi approximately 3.141592653589793
    var getNamedNumberValue = function (value) {
        switch (value) {
            case "phi": return exports.phi;
            case "e": return Math.E;
            case "pi": return Math.PI;
            default: return value;
        }
    };
    exports.getNamedNumberValue = getNamedNumberValue;
    var getNamedNumberLabel = function (value, locales, options) {
        switch (value) {
            case "phi": return "φ";
            case "e": return "e";
            case "pi": return "π";
            default: return value.toLocaleString(locales, options);
        }
    };
    exports.getNamedNumberLabel = getNamedNumberLabel;
    var getNext = function (list, current, isReverse) {
        var currentIndex = list.indexOf(current);
        if (0 <= currentIndex) {
            var nextIndex = (currentIndex + (isReverse ? -1 : 1) + list.length) % list.length;
            return list[nextIndex];
        }
        else {
            throw new Error("\uD83E\uDD8B FIXME: getNext: current value not found in list");
        }
    };
    exports.getNext = getNext;
    exports.viewModeList = ["ruler", "grid", "graph"];
    var getViewScale = function (view) { return Math.pow(10, view.viewScaleExponent); };
    exports.getViewScale = getViewScale;
    var getExValueNumber = function (exValue) {
        return "number" === typeof exValue ? exValue : exValue.value;
    };
    exports.getExValueNumber = getExValueNumber;
    var getTickValue = function (tick) {
        return (0, exports.getExValueNumber)(tick.value);
    };
    exports.getTickValue = getTickValue;
});
define("resource/config", [], {
    "applicationTitle": "Smart Rule",
    "repositoryUrl": "https://github.com/wraith13/slide-rule/",
    "canonicalUrl": "https://wraith13.github.io/slide-rule/",
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
            "standardNumberColor": "blue",
            "primaryNumberColor": "green",
            "defaultNumberColor": "purple",
            "estimatedNumberColor": "#888800CC",
            "fictionalNumberColor": "#888888"
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
        "minZoomLevel": 0.0,
        "maxZoomLevel": 12.5,
        "scrollUnit": 10,
        "touchZoomThreshold": 20
    },
    "render": {
        "ruler": {
            "backgroundColor": "#FFFFFF",
            "lineColor": "#BB0000CC",
            "lineWidth": 1,
            "laneBackgroundColor": "#F0F0F0",
            "laneWidth": 180,
            "slideSeparatorColor": "#444444",
            "laneSeparatorColor": "#CCCCCC",
            "laneSeparatorWidth": 1,
            "denseAreaColor": "rgba(0, 160, 0, 0.6)",
            "minErrorAreaColor": "rgba(255, 0, 0, 0.6)",
            "maxErrorAreaColor": "rgba(160, 0, 160, 0.6)",
            "laneLabelBackgroundColor": "rgba(255, 255, 255, 0.75)",
            "primaryTickColor": "#DD0000",
            "tick": {
                "mini": {
                    "length": 5,
                    "width": 1,
                    "color": "#000000"
                },
                "short": {
                    "length": 10,
                    "width": 1,
                    "color": "#000000"
                },
                "medium": {
                    "length": 15,
                    "width": 1,
                    "color": "#000000"
                },
                "long": {
                    "length": 20,
                    "width": 2,
                    "color": "#000000"
                }
            },
            "tickLabel": {
                "fontFamily": "Arial, sans-serif",
                "fontSize": 12,
                "fontColor": "#000000",
                "offset": 5,
                "minInterval": 30,
                "maxInterval": 150
            },
            "tickDensityThreshold_E81": 0.1,
            "tickDensityThreshold_E27": 0.4,
            "tickDensityThreshold_E9": 1.5,
            "tickDensityThreshold_E3": 5,
            "tickDensityThreshold_5": 20,
            "tickDensityThreshold_10": 50
        }
    }
});
define("script/time", ["require", "exports", "resource/config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.parseRelativeUniverseEpoch = exports.yearsToUniverseEpoch = exports.universeEpochToString = exports.universeEpochToRelativeTimeString = exports.formatUniverseEpochDuration = exports.getCurrentUniverseEpoch = exports.universeEpochToHumanEpoch = exports.humanEpochToUniverseEpoch = void 0;
    config_json_1 = __importDefault(config_json_1);
    var anchorHumanEpochTime = new Date(config_json_1.default.time.anchor.humanEpoch).getTime();
    var humanEpochToUniverseEpoch = function (humanEpoch) {
        return (humanEpoch.getTime() - anchorHumanEpochTime) / 1000 + config_json_1.default.time.anchor.universeEpoch;
    };
    exports.humanEpochToUniverseEpoch = humanEpochToUniverseEpoch;
    var universeEpochToHumanEpoch = function (universeEpoch) {
        try {
            return new Date((universeEpoch - config_json_1.default.time.anchor.universeEpoch) / 1000 + anchorHumanEpochTime);
        }
        catch (e) {
            console.error("\uD83E\uDD8B FIXME: Model.universeEpochToHumanEpoch: invalid universe epoch: ".concat(universeEpoch));
            return new Date(NaN);
        }
    };
    exports.universeEpochToHumanEpoch = universeEpochToHumanEpoch;
    var getCurrentUniverseEpoch = function () {
        return (0, exports.humanEpochToUniverseEpoch)(new Date());
    };
    exports.getCurrentUniverseEpoch = getCurrentUniverseEpoch;
    var formatUniverseEpochDuration = function (duration) {
        if (duration < 60) {
            return "".concat(duration, " seconds");
        }
        else if (duration < 3600) {
            return "".concat(duration / 60, " minutes");
        }
        else if (duration < 3600 * 24) {
            return "".concat(duration / 3600, " hours");
        }
        else if (duration < 3600 * 24 * config_json_1.default.time.gregorianYearLength) {
            return "".concat(duration / (3600 * 24), " days");
        }
        else if (duration < 3600 * 24 * config_json_1.default.time.gregorianYearLength * 100) // Up to 100 years, use Gregorian calendar year
         {
            return "".concat(duration / (3600 * 24 * config_json_1.default.time.gregorianYearLength), " years");
        }
        else if (duration < 3600 * 24 * config_json_1.default.time.julianYearLength * 1000) // After 100 years, use Julian calendar year
         {
            return "".concat(duration / (3600 * 24 * config_json_1.default.time.julianYearLength), " years");
        }
        else if (duration < 3600 * 24 * config_json_1.default.time.julianYearLength * 1000) {
            return "".concat(duration / (3600 * 24 * config_json_1.default.time.julianYearLength * 1000), " kilo years");
        }
        else if (duration < 3600 * 24 * config_json_1.default.time.julianYearLength * 1000 * 1000 * 1000) {
            return "".concat(duration / (3600 * 24 * config_json_1.default.time.julianYearLength * 1000 * 1000), " mega years");
        }
        else {
            return "".concat(duration / (3600 * 24 * config_json_1.default.time.julianYearLength * 1000 * 1000 * 1000), " giga years");
        }
    };
    exports.formatUniverseEpochDuration = formatUniverseEpochDuration;
    var universeEpochToRelativeTimeString = function (universeEpoch) {
        var currentUniverseEpoch = config_json_1.default.time.anchor.universeEpoch;
        var diff = universeEpoch - currentUniverseEpoch;
        if (diff < 0) {
            return "".concat((0, exports.formatUniverseEpochDuration)(-diff), " ago");
        }
        else {
            return "in ".concat((0, exports.formatUniverseEpochDuration)(diff));
        }
    };
    exports.universeEpochToRelativeTimeString = universeEpochToRelativeTimeString;
    var universeEpochToString = function (universeEpoch) {
        var humanEpoch = (0, exports.universeEpochToHumanEpoch)(universeEpoch);
        if (Number.isNaN(humanEpoch.getTime())) {
            return (0, exports.universeEpochToRelativeTimeString)(universeEpoch);
        }
        else {
            return humanEpoch.toISOString();
        }
    };
    exports.universeEpochToString = universeEpochToString;
    var yearsToUniverseEpoch = function (years) {
        // JP: 「現在」は 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch )とし、グレゴリオ暦の年の長さを365.2422日( config.time.gregorianYearLength )、ユリウス暦の年の長さを365.25日( config.time.julianYearLength ) とする。
        // EN: Consider "now" as 1950-01-01T00:00:00Z ( config.time.anchor.humanEpoch ), the length of a year in the Gregorian calendar as 365.2422 days ( config.time.gregorianYearLength ), and the length of a year in the Julian calendar as 365.25 days ( config.time.julianYearLength ).
        switch (true) {
            case years < config_json_1.default.time.considerGregorianYearsRange.lowerBound:
                // JP: -100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
                // EN: For years beyond -100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
                return years * 3600 * 24 * config_json_1.default.time.julianYearLength;
            case years <= config_json_1.default.time.pureGregorianYearsRange.lowerBound:
                // JP: -100000年までは、最初の50年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
                // EN: For years up to -100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 50 years and the length of a year in the Julian calendar for the remaining years
                return (config_json_1.default.time.pureGregorianYearsRange.lowerBound * 3600 * 24 * config_json_1.default.time.gregorianYearLength) + ((years - config_json_1.default.time.pureGregorianYearsRange.lowerBound) * 3600 * 24 * config_json_1.default.time.julianYearLength);
            case years <= config_json_1.default.time.pureGregorianYearsRange.upperBound:
                // JP: -50(1900)年 から +150(2100)年までは、グレゴリオ暦の平均的な年の長さを使用する
                // EN: From -50 (1900) to +150 (2100), use the average length of a year in the Gregorian calendar
                return years * 3600 * 24 * config_json_1.default.time.gregorianYearLength;
            case years <= config_json_1.default.time.considerGregorianYearsRange.upperBound:
                // JP: 100000年までは、最初の150年はグレゴリオ暦の年の長さを使用し、残りの年はユリウス暦の年の長さを使用する加重平均を使用する
                // EN: For years up to 100,000, use a weighted average that uses the length of a year in the Gregorian calendar for the first 150 years and the length of a year in the Julian calendar for the remaining years
                return (config_json_1.default.time.pureGregorianYearsRange.upperBound * 3600 * 24 * config_json_1.default.time.gregorianYearLength) + ((years - config_json_1.default.time.pureGregorianYearsRange.upperBound) * 3600 * 24 * config_json_1.default.time.julianYearLength);
            default:
                // JP: 100000年を超える場合は、長期の天文計算によく使用される、単純な1年あたり365.25日のユリウス暦の平均的な年の長さを使用する
                // EN: For years beyond 100,000, use the average length of a year in the Julian calendar, which is a simple 365.25 days per year, commonly used for long-term astronomical calculations
                return years * 3600 * 24 * config_json_1.default.time.julianYearLength;
        }
    };
    exports.yearsToUniverseEpoch = yearsToUniverseEpoch;
    var parseRelativeUniverseEpoch = function (text) {
        var now = config_json_1.default.time.anchor.universeEpoch;
        var match = text.match(/^\s*(?:(in)\s+)?(\d+(?:\.\d+)?)\s*(seconds?|minutes?|hours?|days?|years?|kilo years?|mega years?|giga years?)\s*(ago)?\s*$/);
        var hasAgo = null !== match && match[4].trim().endsWith("ago");
        var direction = hasAgo ? -1 : 1;
        if (null !== match) {
            var value = Number.parseFloat(match[2]);
            var unit = match[3];
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
                    throw new Error("\uD83E\uDD8B FIXME: Model.parseRelativeUniverseEpoch: invalid unit: ".concat(unit));
            }
        }
        else {
            throw new Error("\uD83E\uDD8B FIXME: Model.parseRelativeUniverseEpoch: invalid format: ".concat(text));
        }
    };
    exports.parseRelativeUniverseEpoch = parseRelativeUniverseEpoch;
    var initialize = function () {
    };
    exports.initialize = initialize;
});
define("script/element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSelector = exports.setAttributes = exports.setStyles = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.removeEvents = exports.addEvents = void 0;
    var addEvents = function (element, events) {
        for (var _i = 0, _a = Object.entries(events); _i < _a.length; _i++) {
            var _b = _a[_i], event_1 = _b[0], listener = _b[1];
            if ("listener" in listener) {
                element.addEventListener(event_1, listener.listener, listener.options);
            }
            else {
                element.addEventListener(event_1, listener);
            }
        }
        return element;
    };
    exports.addEvents = addEvents;
    var removeEvents = function (element, events) {
        for (var _i = 0, _a = Object.entries(events); _i < _a.length; _i++) {
            var _b = _a[_i], event_2 = _b[0], listener = _b[1];
            if ("listener" in listener) {
                element.removeEventListener(event_2, listener.listener, listener.options);
            }
            else {
                element.removeEventListener(event_2, listener);
            }
        }
        return element;
    };
    exports.removeEvents = removeEvents;
    var setTextContent = function (element, text) {
        if (element.textContent !== text) {
            element.textContent = text;
            return true;
        }
        return false;
    };
    exports.setTextContent = setTextContent;
    var setAttribute = function (element, name, value) {
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
    var setStyle = function (element, name, value) {
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
    var setStyles = function (element, styles) {
        var changed = false;
        for (var _i = 0, _a = Object.entries(styles); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], value = _b[1];
            changed || (changed = (0, exports.setStyle)(element, name_1, value));
        }
        return changed;
    };
    exports.setStyles = setStyles;
    var setAttributes = function (element, attributes) {
        for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
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
    var makeSelector = function (source) {
        var selector = "";
        if ("tag" in source) {
            selector += source.tag;
        }
        if ("id" in source) {
            selector += "#".concat(source.id);
        }
        if ("class" in source) {
            selector += "".concat(source.class)
                .split(/\s+/)
                .filter(Boolean)
                .map(function (c) { return ".".concat(c); })
                .join("");
        }
        for (var _i = 0, _a = Object.entries(source); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
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
                    selector += "[".concat(key, "=\"").concat(value, "\"]");
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
    var getElementById = function (tag, id) {
        var element = document.getElementById(id);
        if (!element) {
            throw new Error("\uD83E\uDD8B FIXME: HTMLElement not found: ".concat(id));
        }
        if (tag !== element.tagName.toLowerCase()) {
            throw new Error("\uD83E\uDD8B FIXME: HTMLElement is not <".concat(tag, ">: ").concat(id));
        }
        return element;
    };
    exports.getElementById = getElementById;
    var makeElement = function (tag) {
        return document.createElement(tag);
    };
    exports.makeElement = makeElement;
    var make = function (source) {
        var result = (0, exports.makeElement)(source.tag);
        (0, exports.setAttributes)(result, source);
        if (source.children) {
            for (var _i = 0, _a = source.children; _i < _a.length; _i++) {
                var child = _a[_i];
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
    var makeSure = function (parent, source) {
        var _a;
        return (_a = parent.querySelector((0, exports.makeSelector)(source))) !== null && _a !== void 0 ? _a : parent.appendChild((0, exports.make)(source));
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
    var getElementById = function (tag, id) {
        var element = document.getElementById(id);
        if (!element) {
            throw new Error("\uD83E\uDD8B FIXME: SVGElement not found: ".concat(id));
        }
        if (tag !== element.tagName.toLowerCase()) {
            throw new Error("\uD83E\uDD8B FIXME: SVGElement is not <".concat(tag, ">: ").concat(id));
        }
        return element;
    };
    exports.getElementById = getElementById;
    var makeElement = function (tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };
    exports.makeElement = makeElement;
    var make = function (source) {
        var result = (0, exports.makeElement)(source.tag);
        (0, exports.setAttributes)(result, source);
        if (source.children) {
            for (var _i = 0, _a = source.children; _i < _a.length; _i++) {
                var child = _a[_i];
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
    var makeSure = function (parent, source) {
        var _a;
        return (_a = parent.querySelector((0, exports.makeSelector)(source))) !== null && _a !== void 0 ? _a : parent.appendChild((0, exports.make)(source));
    };
    exports.makeSure = makeSure;
});
define("script/ui", ["require", "exports", "script/locale", "script/html", "script/svg"], function (require, exports, Locale, HTML, SVG) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.updateLanguage = exports.ControlPanel = exports.SettingsPanel = exports.rulerHelpPanel = exports.addHistoryLaneButton = exports.addEmwEnergyLaneButton = exports.addEmwFrequencyLaneButton = exports.addEmwWavelengthLaneButton = exports.addCountingLaneButton = exports.addTemperatureLaneButton = exports.addEnergyLaneButton = exports.addSpeedLaneButton = exports.addTimeLaneButton = exports.addMassLaneButton = exports.addSizeLaneButton = exports.addPrimeDecompositionLaneButton = exports.addPrimeNumbersLaneButton = exports.add2nLaneButton = exports.addCotangentLaneButton = exports.addTangentLaneButton = exports.addCosineLaneButton = exports.addSineLaneButton = exports.addCubeRootLaneButton = exports.addSquareRootLaneButton = exports.addCubedLaneButton = exports.addSquaredLaneButton = exports.addInvertLaneButton = exports.addSlideButton = exports.rulerNewSlidePanel = exports.graphView = exports.gridView = exports.rulerOverlay = exports.rulerSvg = exports.rulerView = exports.viewList = exports.updateRoundBar = exports.setAriaHidden = void 0;
    Locale = __importStar(Locale);
    HTML = __importStar(HTML);
    SVG = __importStar(SVG);
    var setAriaHidden = function (element, hidden) {
        var attributeKey = "aria-hidden";
        if (hidden) {
            var attribute = document.createAttribute(attributeKey);
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
    var updateRoundBar = function (button, properties) {
        // console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        HTML.setStyle(button, "--low", properties.low.toFixed(3));
        HTML.setStyle(button, "--high", properties.high.toFixed(3));
        HTML.setStyle(button, "--rotate", properties.rotate.toFixed(3));
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
    exports.addMassLaneButton = HTML.getElementById("button", "add-mass-lane-button");
    exports.addTimeLaneButton = HTML.getElementById("button", "add-time-lane-button");
    exports.addSpeedLaneButton = HTML.getElementById("button", "add-speed-lane-button");
    exports.addEnergyLaneButton = HTML.getElementById("button", "add-energy-lane-button");
    exports.addTemperatureLaneButton = HTML.getElementById("button", "add-temperature-lane-button");
    exports.addCountingLaneButton = HTML.getElementById("button", "add-counting-lane-button");
    exports.addEmwWavelengthLaneButton = HTML.getElementById("button", "add-emw-wavelength-lane-button");
    exports.addEmwFrequencyLaneButton = HTML.getElementById("button", "add-emw-frequency-lane-button");
    exports.addEmwEnergyLaneButton = HTML.getElementById("button", "add-emw-energy-lane-button");
    exports.addHistoryLaneButton = HTML.getElementById("button", "add-history-lane-button");
    exports.rulerHelpPanel = HTML.getElementById("div", "ruler-help-panel");
    var SettingsPanel;
    (function (SettingsPanel) {
        SettingsPanel.languageSelect = HTML.getElementById("select", "language-select");
    })(SettingsPanel || (exports.SettingsPanel = SettingsPanel = {}));
    var ControlPanel;
    (function (ControlPanel) {
        ControlPanel.element = HTML.getElementById("div", "control-panel");
        ControlPanel.viewModeButton = HTML.getElementById("button", "view-mode-button");
        ControlPanel.viewScaleButton = HTML.getElementById("button", "view-scale-button");
        ControlPanel.viewScalePanel = HTML.getElementById("div", "view-scale-panel");
        ControlPanel.viewScaleRange = HTML.getElementById("input", "view-scale-range");
    })(ControlPanel || (exports.ControlPanel = ControlPanel = {}));
    var updateLanguage = function () {
        document.querySelectorAll("span[data-lang-key]").forEach(function (element) {
            var key = element.getAttribute("data-lang-key");
            if (key) {
                element.textContent = Locale.map(key);
            }
        });
    };
    exports.updateLanguage = updateLanguage;
    var initialize = function () {
        SettingsPanel.languageSelect.innerHTML = "";
        for (var _i = 0, _a = Locale.getLocaleList(); _i < _a.length; _i++) {
            var language = _a[_i];
            var option = document.createElement("option");
            option.value = language;
            option.textContent = "Auto" === language ?
                Locale.map("Auto") :
                "".concat(language).concat(Locale.getColonSuffix(), " ").concat(Locale.toRtl(Locale.map("lang-label", language), Locale.isRtl() && Locale.isLtr(language)));
            SettingsPanel.languageSelect.appendChild(option);
        }
        ;
    };
    exports.initialize = initialize;
});
define("script/number", ["require", "exports", "resource/config"], function (require, exports, config_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SafeOr1 = exports.System = exports.primeDecomposition = exports.isPrimeNumber = exports.primeNumbers = exports.isInteger = exports.maxMin = exports.minMax = exports.clamp = exports.MIN_VALUE = exports.MAX_VALUE = exports.MAX_SAFE_INTEGER = exports.ceilTo1Mantissa = exports.floorTo1Mantissa = exports.orUndefined = exports.parse = void 0;
    config_json_2 = __importDefault(config_json_2);
    var parse = function (value) {
        if (undefined !== value) {
            var result = parseFloat(value);
            if (!isNaN(result)) {
                return result;
            }
        }
        return undefined;
    };
    exports.parse = parse;
    var orUndefined = function (value) {
        return "number" === typeof value ? value : undefined;
    };
    exports.orUndefined = orUndefined;
    // export const MIN_VALUE = Number.MIN_VALUE;
    // export const MAX_VALUE = Number.MAX_VALUE;
    // export const MIN_VALUE = 1e-300;
    // export const MAX_VALUE = 1e300;
    var floorTo1Mantissa = function (n) {
        if (n === 0) {
            return 0;
        }
        else {
            var sign = Math.sign(n);
            var abs = Math.abs(n);
            var exp = Math.floor(Math.log10(abs));
            return sign * Math.pow(10, exp);
        }
    };
    exports.floorTo1Mantissa = floorTo1Mantissa;
    var ceilTo1Mantissa = function (n) {
        if (n === 0) {
            return 0;
        }
        else {
            var sign = Math.sign(n);
            var abs = Math.abs(n);
            var exp = Math.ceil(Math.log10(abs));
            return sign * Math.pow(10, exp);
        }
    };
    exports.ceilTo1Mantissa = ceilTo1Mantissa;
    exports.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    // This is the minimum value achieved by sacrificing the mantissa, so values around this range have low precision and are not practical for use.
    //export const MIN_VALUE = ceilTo1Mantissa(Number.MIN_VALUE);
    exports.MAX_VALUE = (0, exports.floorTo1Mantissa)(Number.MAX_VALUE);
    exports.MIN_VALUE = 1 / exports.MAX_VALUE;
    var clamp = function (value) {
        return Math.max(Math.min(value, exports.MAX_VALUE), exports.MIN_VALUE);
    };
    exports.clamp = clamp;
    var minMax = function (value) {
        return (0, exports.clamp)(value !== null && value !== void 0 ? value : exports.MAX_VALUE);
    };
    exports.minMax = minMax;
    var maxMin = function (value) {
        return (0, exports.clamp)(value !== null && value !== void 0 ? value : exports.MIN_VALUE);
    };
    exports.maxMin = maxMin;
    exports.isInteger = Number.isInteger;
    exports.primeNumbers = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
        53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
        // Values after this point are generated dynamically up to config.model.primeNumber.cacheSize.
    ];
    var isPrimeNumber = function (value) {
        if (Number.isInteger(value) && 2 <= value && value <= exports.MAX_SAFE_INTEGER) {
            var sqrt = Math.sqrt(value);
            for (var _i = 0, primeNumbers_1 = exports.primeNumbers; _i < primeNumbers_1.length; _i++) {
                var prime = primeNumbers_1[_i];
                if (sqrt < prime) {
                    return true;
                }
                if (0 === value % prime) {
                    return false;
                }
            }
            for (var i = exports.primeNumbers[exports.primeNumbers.length - 1] + 2; i <= sqrt; i += 2) {
                if (exports.primeNumbers.length < config_json_2.default.model.primeNumber.cacheSize) {
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
    var primeDecomposition = function (value) {
        var result = [];
        if (Number.isInteger(value) && 2 <= value && value <= exports.MAX_SAFE_INTEGER) {
            var remainder = value;
            for (var _i = 0, primeNumbers_2 = exports.primeNumbers; _i < primeNumbers_2.length; _i++) {
                var prime = primeNumbers_2[_i];
                if (prime * prime > remainder) {
                    break;
                }
                while (0 === remainder % prime) {
                    result.push(prime);
                    remainder /= prime;
                }
            }
            for (var i = exports.primeNumbers[exports.primeNumbers.length - 1] + 2; i * i <= remainder; i += 2) {
                if (exports.primeNumbers.length < config_json_2.default.model.primeNumber.cacheSize) {
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
    var SafeOr1 = function (value) {
        return 0 === value % 2 ? value + 1 : value;
    };
    exports.SafeOr1 = SafeOr1;
});
define("script/comparer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lowerCase = exports.make = exports.basic = void 0;
    var basic = function (a, b) {
        return a < b ? -1 :
            b < a ? 1 :
                0;
    };
    exports.basic = basic;
    var make = function (source) {
        var _a;
        var invoker = function (i) {
            var f = i;
            if ("function" === typeof f) {
                return function (a, b) { return (0, exports.basic)(f(a), f(b)); };
            }
            var r = i;
            if (undefined !== (r === null || r === void 0 ? void 0 : r.raw)) {
                return r.raw;
            }
            var s = i;
            if (undefined !== (s === null || s === void 0 ? void 0 : s.getter)) {
                var body_1 = function (a, b) { return (0, exports.basic)(s.getter(a), s.getter(b)); };
                if (undefined === s.condition) {
                    return body_1;
                }
                else {
                    var f_1 = s.condition;
                    if ("function" === typeof f_1) {
                        return function (a, b) { return f_1(a, b) ? body_1(a, b) : 0; };
                    }
                    else {
                        var t_1 = s.condition;
                        var getter_1 = t_1.getter;
                        if (undefined === getter_1) {
                            return function (a, b) { return t_1.type === typeof a && t_1.type === typeof b ? body_1(a, b) : 0; };
                        }
                        else {
                            return function (a, b) { return t_1.type === typeof getter_1(a) && t_1.type === typeof getter_1(b) ? body_1(a, b) : 0; };
                        }
                    }
                }
            }
            return undefined;
        };
        if (Array.isArray(source)) {
            var comparerList_1 = source.map(invoker).filter(function (i) { return undefined !== i; });
            return function (a, b) {
                var result = 0;
                for (var i = 0; i < comparerList_1.length && 0 === result; ++i) {
                    result = comparerList_1[i](a, b);
                }
                return result;
            };
        }
        else {
            return (_a = invoker(source)) !== null && _a !== void 0 ? _a : (function () { return 0; });
        }
    };
    exports.make = make;
    exports.lowerCase = (0, exports.make)([function (a) { return a.toLowerCase(); }, { raw: exports.basic }]);
});
define("script/model", ["require", "exports", "script/locale", "script/number", "script/type", "script/url", "script/comparer", "resource/config"], function (require, exports, Locale, Number, Type, Url, Comparer, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getLaneContext = exports.getCursorValues = exports.getCursorValue = exports.getCursorPosition = exports.makeSure = exports.removeLane = exports.makeLane = exports.addLane = exports.getSlideFromLane = exports.getLane = exports.getLastSlideAndLastLane = exports.getSlideAndLane = exports.makeSureSlide = exports.makeSlide = exports.getLaneIndex = exports.getSlideIndexFromLane = exports.getSlideIndex = exports.isRootSlide = exports.getRootSlideAndRootLane = exports.getRootSlide = exports.isPrimaryLane = exports.isRootLane = exports.getRootLane = exports.makeRootLane = exports.designTicks = exports.designPeriodicTicks = exports.designConstantTicks = exports.designConstantTickType = exports.designConstantTickColor = exports.designConstantAreas = exports.designPrimeDecompositionTicks = exports.factorsToString = exports.designPrimeNumbersTicks = exports.design2nTicks = exports.designRegularTicks = exports.designTicks10 = exports.designTickType = exports.getLongTickSpaceWidth = exports.makePositionTickWindowFromPositionAndWidth = exports.makePositionTickWindowFromWindow = exports.PositionTickWindowToValueTickWindow = exports.getSnapReferenceLaneIndex = exports.getWidth = exports.getPositionAt = exports.getSlideOffset = exports.getAnchorSlideAndLane = exports.getRawViewPositionAt = exports.getLinearPositionAt = exports.getValueAt = exports.getPrimaryPositionAt = exports.getPrimaryValueAt = exports.isPeriodicLane = exports.getPrimaryPeriod = exports.isInvertLane = exports.getAllLanes = exports.getAllLaneCount = exports.RootLaneIndex = exports.RootSlideIndex = exports.data = void 0;
    Locale = __importStar(Locale);
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    Comparer = __importStar(Comparer);
    config_json_3 = __importDefault(config_json_3);
    exports.data = {
        slides: [],
        cursor: 0,
        offset: { x: 0, y: 0, },
    };
    exports.RootSlideIndex = 0;
    exports.RootLaneIndex = 0;
    var getAllLaneCount = function () {
        return exports.data.slides.reduce(function (count, slide) { return count + slide.lanes.length; }, 0);
    };
    exports.getAllLaneCount = getAllLaneCount;
    var getAllLanes = function () {
        return exports.data.slides.reduce(function (allLanes, slide) { return allLanes.concat(slide.lanes); }, []);
    };
    exports.getAllLanes = getAllLanes;
    var isInvertLane = function (lane) {
        var result = false;
        var slide = (0, exports.getSlideFromLane)(lane);
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var i = _a[_i];
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
    var getPrimaryPeriod = function (lane) {
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
    var isPeriodicLane = function (lane) {
        var slide = (0, exports.getSlideFromLane)(lane);
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var i = _a[_i];
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
    var getPrimaryValueAt = function (lane, position) {
        var _a;
        switch (lane.type) {
            case "logarithmic":
            case "2^n":
            case "prime":
            case "prime-decomposition":
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
                throw new Error("\uD83E\uDD8B FIXME: getPrimaryValueAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getPrimaryValueAt = getPrimaryValueAt;
    var getPrimaryPositionAt = function (lane, value) {
        var _a;
        switch (lane.type) {
            case "logarithmic":
            case "2^n":
            case "prime":
            case "prime-decomposition":
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
                throw new Error("\uD83E\uDD8B FIXME: getPrimaryPositionAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getPrimaryPositionAt = getPrimaryPositionAt;
    var getValueAt = function (slide, lane, position, view) {
        try {
            var viewScale = Type.getViewScale(view);
            var offset = (0, exports.getSlideOffset)(slide, view);
            var rawPosition = Math.exp((position - offset) / viewScale);
            var value = rawPosition;
            var basePosition = 0;
            for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
                var i = _a[_i];
                var period = (0, exports.getPrimaryPeriod)(i);
                if (undefined !== period) {
                    basePosition += Math.floor(value / period) * period;
                }
                value = Number.clamp((0, exports.getPrimaryValueAt)(i, value));
                if (i === lane) {
                    break;
                }
            }
            return { value: value, basePosition: basePosition };
        }
        catch (error) {
            console.error("Error in getValueAt: ".concat(error));
            return undefined;
        }
    };
    exports.getValueAt = getValueAt;
    var getLinearPositionAt = function (lane, value) {
        var valueWithBasePosition = typeof value === "number" ? { value: value, basePosition: 0 } : value;
        var basePosition = valueWithBasePosition.basePosition;
        var linearPosition = valueWithBasePosition.value;
        var slide = (0, exports.getSlideFromLane)(lane);
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var i = _a[_i];
            linearPosition = Number.clamp((0, exports.getPrimaryPositionAt)(i, linearPosition));
            if (i === lane) {
                break;
            }
        }
        return basePosition + linearPosition;
    };
    exports.getLinearPositionAt = getLinearPositionAt;
    var getRawViewPositionAt = function (lane, value, view) {
        return Math.log((0, exports.getLinearPositionAt)(lane, value)) * Type.getViewScale(view);
    };
    exports.getRawViewPositionAt = getRawViewPositionAt;
    var getAnchorSlideAndLane = function (slide) {
        var slideIndex = (0, exports.getSlideIndex)(slide);
        if (slideIndex <= exports.RootSlideIndex) {
            return { anchorSlide: undefined, anchorLane: undefined };
        }
        else {
            var anchorSlide = exports.data.slides[slideIndex - 1];
            var anchorLane = anchorSlide.lanes[anchorSlide.lanes.length - 1];
            return { anchorSlide: anchorSlide, anchorLane: anchorLane };
        }
    };
    exports.getAnchorSlideAndLane = getAnchorSlideAndLane;
    var getSlideOffset = function (slide, view) {
        var _a = (0, exports.getAnchorSlideAndLane)(slide), anchorSlide = _a.anchorSlide, anchorLane = _a.anchorLane;
        if (undefined === anchorSlide || undefined === anchorLane) {
            // return slide.anchor;
            return exports.data.offset.y;
        }
        else {
            return (0, exports.getPositionAt)(anchorSlide, anchorLane, slide.anchor, view);
        }
    };
    exports.getSlideOffset = getSlideOffset;
    var getPositionAt = function (slide, lane, value, view) {
        return (0, exports.getRawViewPositionAt)(lane, value, view) + (0, exports.getSlideOffset)(slide, view);
    };
    exports.getPositionAt = getPositionAt;
    var getWidth = function (slide, lane, bottom, top, view, isInvert) {
        if (isInvert === void 0) { isInvert = false; }
        var a = (0, exports.getPositionAt)(slide, lane, top, view);
        var b = (0, exports.getPositionAt)(slide, lane, bottom, view);
        var width = a - b;
        return "auto" === isInvert ?
            Math.abs(width) :
            (!isInvert) ? width : -width;
    };
    exports.getWidth = getWidth;
    var getSnapReferenceLaneIndex = function (slide) {
        var slideIndex = (0, exports.getSlideIndex)(slide);
        if (0 <= slideIndex) {
            var previousSlide = exports.data.slides[slideIndex - 1];
            if (0 < previousSlide.lanes.length) {
                return (0, exports.getLaneIndex)(previousSlide.lanes[previousSlide.lanes.length - 1]);
            }
            else {
                throw new Error("\uD83E\uDD8B FIXME: getSnapReferenceLaneIndex: previous slide has no lanes");
            }
        }
        else {
            throw new Error("\uD83E\uDD8B FIXME: getSnapReferenceLaneIndex: slide index out of range: ".concat(slideIndex));
        }
    };
    exports.getSnapReferenceLaneIndex = getSnapReferenceLaneIndex;
    var PositionTickWindowToValueTickWindow = function (slide, lane, view, positionTickWindow) {
        var _a, _b;
        var isInvert = (0, exports.isInvertLane)(lane);
        var topValue = (_a = (0, exports.getValueAt)(slide, lane, positionTickWindow.topPosition, view)) !== null && _a !== void 0 ? _a : { value: (!isInvert ? Number.MAX_VALUE : Number.MIN_VALUE), basePosition: 0 };
        var bottomValue = (_b = (0, exports.getValueAt)(slide, lane, positionTickWindow.bottomPosition, view)) !== null && _b !== void 0 ? _b : { value: (!isInvert ? Number.MIN_VALUE : Number.MAX_VALUE), basePosition: 0 };
        return { topValue: topValue, bottomValue: bottomValue };
    };
    exports.PositionTickWindowToValueTickWindow = PositionTickWindowToValueTickWindow;
    var makePositionTickWindowFromWindow = function () {
        return ({
            topPosition: 0,
            bottomPosition: window.innerHeight
        });
    };
    exports.makePositionTickWindowFromWindow = makePositionTickWindowFromWindow;
    var makePositionTickWindowFromPositionAndWidth = function (position, width) {
        return ({
            topPosition: position - (width / 2),
            bottomPosition: position + (width / 2)
        });
    };
    exports.makePositionTickWindowFromPositionAndWidth = makePositionTickWindowFromPositionAndWidth;
    var getLongTickSpaceWidth = function (slide, lane, view, ticks, value) {
        var result = Infinity;
        var position = (0, exports.getPositionAt)(slide, lane, value, view);
        for (var _i = 0, _a = ticks.filter(function (i) { return "long" === i.type; }); _i < _a.length; _i++) {
            var i = _a[_i];
            var tickPosition = (0, exports.getPositionAt)(slide, lane, i.value, view);
            var spaceWidth = Math.abs(position - tickPosition);
            if (spaceWidth < result) {
                result = spaceWidth;
            }
        }
        return result;
    };
    exports.getLongTickSpaceWidth = getLongTickSpaceWidth;
    var designTickType = function (slide, lane, view, ticks, value) {
        var tickThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
        var width = (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value);
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
    var designTicks10 = function (view, slide, lane, base, unit, parent, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var highValue = (!isInvert) ? bottomValue : topValue;
        var lowValue = (!isInvert) ? topValue : bottomValue;
        if (0 < base && base <= highValue.value && lowValue.value <= Number.minMax(base + unit)) {
            var width = (0, exports.getWidth)(slide, lane, base, base + unit, view, isInvert);
            switch (true) {
                case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                    ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, base, unit / 10, { index: 0, width: width }, tickWindow));
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_5 <= width:
                    ticks.push({ value: base + (unit * 0.5), type: "mini", });
                    break;
            }
        }
        for (var b = 1; b <= 9; ++b) {
            var value = base + (unit * b);
            var nextValue = base + (unit * (b + 1));
            if (lowValue.value < nextValue) {
                if (value <= highValue.value) {
                    var width = (0, exports.getWidth)(slide, lane, value, nextValue, view, isInvert);
                    switch (true) {
                        case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width:
                            ticks.push({ value: value, type: "long", });
                            ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, value, unit / 10, { index: b, width: width }, tickWindow));
                            break;
                        case base <= 0 && 0 === parent.index && 1 === b:
                            ticks.push({ value: value, type: "long", });
                            break;
                        case 5 === b:
                            ticks.push({ value: value, type: "medium" });
                            break;
                        default:
                            ticks.push({ value: value, type: "short", });
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
    var designRegularTicks = function (slide, view, lane, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var beginDigit = Math.floor(Math.log10((!isInvert) ? topValue.value : bottomValue.value));
        var endDigit = Math.ceil(Math.log10((!isInvert) ? bottomValue.value : topValue.value));
        var scale = 10;
        for (var digit = beginDigit; digit <= endDigit; ++digit) {
            var a = Math.pow(10, digit);
            var width_1 = (0, exports.getWidth)(slide, lane, a, a * scale, view, isInvert);
            switch (true) {
                case config_json_3.default.render.ruler.tickDensityThreshold_10 <= width_1:
                    ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, 0, a, { index: 0, width: width_1 }, tickWindow));
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_5 <= width_1:
                    ticks.push({
                        value: a,
                        type: "long",
                        color: Math.abs(digit) % 3 === 0 ? undefined : "gray",
                    });
                    ticks.push({ value: a * 5, type: "medium", });
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E3 <= width_1:
                    ticks.push({
                        value: a,
                        type: 0 === Math.abs(digit) % 3 ? "long" : "medium",
                    });
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E9 <= width_1:
                    if (0 === Math.abs(digit) % 3) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 9 ? "long" : "medium",
                        });
                    }
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E27 <= width_1:
                    if (0 === Math.abs(digit) % 9) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 27 ? "long" : "medium",
                        });
                    }
                    break;
                case config_json_3.default.render.ruler.tickDensityThreshold_E81 <= width_1:
                    if (0 === Math.abs(digit) % 27) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 81 ? "long" : "medium",
                        });
                    }
                    break;
                default:
                    if (0 === Math.abs(digit) % 81) {
                        ticks.push({
                            value: a,
                            type: 0 === Math.abs(digit) % 243 ? "long" : "medium",
                        });
                    }
                    break;
            }
        }
        var width = (0, exports.getWidth)(slide, lane, 1, 2, view, isInvert);
        if (config_json_3.default.render.ruler.tickDensityThreshold_5 <= width) {
            var lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
            var upperBoundValue = Math.max(topValue.value, bottomValue.value);
            for (var _i = 0, _a = Type.namedNumberList; _i < _a.length; _i++) {
                var namedNumber = _a[_i];
                var value = Type.getNamedNumberValue(namedNumber);
                if (lowwerBoundValue <= value && value <= upperBoundValue) {
                    var label = Type.getNamedNumberLabel(namedNumber);
                    ticks.push({ value: value, type: "long", color: "blue", label: label });
                }
            }
        }
        // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${tick.value} (${tick.type})`).join(", ")}`);
        // console.log(`min: ${min}, max: ${max}`);
        var result = {
            ticks: ticks,
            areas: []
        };
        return result;
    };
    exports.designRegularTicks = designRegularTicks;
    var design2nTicks = function (slide, view, lane, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var beginDigit = Math.floor(Math.log2((!isInvert) ? topValue.value : bottomValue.value));
        var endDigit = Math.ceil(Math.log2((!isInvert) ? bottomValue.value : topValue.value));
        var scale = 2;
        for (var digit = beginDigit; digit <= endDigit; ++digit) {
            var value = Math.pow(2, digit);
            var width = (0, exports.getWidth)(slide, lane, value, value * scale, view, isInvert);
            var density = -Math.floor(Math.log2(width / config_json_3.default.render.ruler.tickDensityThreshold_5));
            var threshold = Math.pow(2, density - 1);
            var label = "2^".concat(digit);
            switch (true) {
                // case config.render.ruler.tickDensityThreshold_5 <= width:
                case density <= 0:
                    ticks.push({
                        value: value,
                        label: label,
                        type: "long",
                    });
                    break;
                // case config.render.ruler.tickDensityThreshold_5 <= width *2:
                case density <= 1:
                    ticks.push({
                        value: value,
                        label: label,
                        type: 0 === Math.abs(digit) % 2 ? "long" : "medium",
                    });
                    break;
                // case config.render.ruler.tickDensityThreshold_5 <= width *4:
                case density <= 2:
                    if (0 === Math.abs(digit) % 2) {
                        ticks.push({
                            value: value,
                            label: label,
                            type: 0 === Math.abs(digit) % 4 ? "long" : "medium",
                        });
                    }
                    break;
                default:
                    if (0 === Math.abs(digit) % threshold) {
                        ticks.push({
                            value: value,
                            label: label,
                            type: 0 === Math.abs(digit) % (threshold * 4) ? "long" : "medium",
                        });
                    }
                    break;
            }
        }
        var result = {
            ticks: ticks,
            areas: []
        };
        return result;
    };
    exports.design2nTicks = design2nTicks;
    var designPrimeNumbersTicks = function (slide, view, lane, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var _a = config_json_3.default.model.primeNumber, limit = _a.limit, maxRange = _a.maxRange;
        // const { maxRange } = config.model.primeNumber;
        var ticks = [];
        var areas = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        var upperBoundValue = Math.max(topValue.value, bottomValue.value);
        var lowerBoundInvertDecimalValue = Math.ceil(1 / Math.min(1, upperBoundValue));
        var upperBoundInvertDecimalValue = Number.SafeOr1(Math.min(limit, Math.floor(1 / Math.min(1, lowwerBoundValue))));
        // const upperBoundInvertDecimalValue = Number.SafeOr1(Math.floor(1 /Math.min(1, lowwerBoundValue)));
        var tickTypeThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
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
                    var value = 2;
                    ticks.push({
                        value: 1 / value,
                        label: "1/".concat(value.toLocaleString()),
                        type: "long",
                        color: "green"
                    });
                }
                var start = Number.SafeOr1(Math.max(3, lowerBoundInvertDecimalValue));
                var limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (var value = start; value <= upperBoundInvertDecimalValue; value += 2) {
                    var width = (0, exports.getWidth)(slide, lane, 1 / (value + 1), 1 / value, view, isInvert);
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
                            label: "1 / ".concat(value.toLocaleString()),
                            type: tickTypeThreshold <= (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, 1 / value) ?
                                "long" :
                                "medium",
                            color: "green"
                        });
                    }
                }
            }
        }
        var lowwerBoundIntegerValue = Math.max(2, Math.ceil(lowwerBoundValue));
        var upperBoundIntegerValue = Number.SafeOr1(Math.min(Math.max(2, Math.floor(upperBoundValue)), limit));
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
                    var value = 2;
                    ticks.push({
                        value: value,
                        label: "".concat(value.toLocaleString()),
                        type: "long",
                        color: "green"
                    });
                }
                var start = Number.SafeOr1(Math.max(3, lowwerBoundIntegerValue));
                var limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (var value = start; value <= upperBoundIntegerValue; value += 2) {
                    var width = (0, exports.getWidth)(slide, lane, value, value + 1, view, isInvert);
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
                            value: value,
                            label: "".concat(value.toLocaleString()),
                            type: tickTypeThreshold <= (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value) ?
                                "long" :
                                "medium",
                            color: "green"
                        });
                    }
                }
            }
        }
        ticks.push({
            value: 1 / Number.MAX_SAFE_INTEGER,
            label: "1 / max safe integer",
            type: "long",
            color: "blue"
        }, {
            value: 1 / limit,
            label: "1 / calculation limit",
            type: "long",
            color: "blue"
        }, {
            value: limit,
            label: "calculation limit",
            type: "long",
            color: "blue"
        }, {
            value: 41024320,
            label: "number of digits in the largest known prime (Mersenne prime)",
            type: "long",
            color: "blue"
        }, {
            value: Number.MAX_SAFE_INTEGER,
            label: "max safe integer",
            type: "long",
            color: "blue"
        });
        var result = {
            ticks: ticks,
            areas: areas,
        };
        return result;
    };
    exports.designPrimeNumbersTicks = designPrimeNumbersTicks;
    var factorsToString = function (factors) {
        var factorCounts = {};
        for (var _i = 0, factors_1 = factors; _i < factors_1.length; _i++) {
            var factor = factors_1[_i];
            if (undefined === factorCounts[factor]) {
                factorCounts[factor] = 1;
            }
            else {
                factorCounts[factor] += 1;
            }
        }
        var parts = [];
        for (var factor in factorCounts) {
            var count = factorCounts[factor];
            if (1 < count) {
                parts.push("".concat(factor, "^").concat(count));
            }
            else {
                parts.push(factor);
            }
        }
        return parts.join(" × ");
    };
    exports.factorsToString = factorsToString;
    var designPrimeDecompositionTicks = function (slide, view, lane, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var _a = config_json_3.default.model.primeNumber, limit = _a.limit, maxRange = _a.maxRange;
        // const { maxRange } = config.model.primeNumber;
        var ticks = [];
        var areas = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        var upperBoundValue = Math.max(topValue.value, bottomValue.value);
        var lowerBoundInvertDecimalValue = Math.ceil(1 / Math.min(1, upperBoundValue));
        var upperBoundInvertDecimalValue = Math.min(limit, Math.floor(1 / Math.min(1, lowwerBoundValue)));
        var tickTypeThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.75;
        var type = "long";
        if (2 <= upperBoundInvertDecimalValue) {
            if (limit <= lowerBoundInvertDecimalValue) {
                areas.push({
                    lowerBound: Number.MIN_VALUE,
                    upperBound: 1 / lowerBoundInvertDecimalValue,
                    fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                });
            }
            else {
                var start = Math.max(2, lowerBoundInvertDecimalValue);
                var limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (var value = start; value <= upperBoundInvertDecimalValue; ++value) {
                    var width = (0, exports.getWidth)(slide, lane, 1 / (value + 1), 1 / value, view, isInvert);
                    if (width < tickTypeThreshold || limitEnd <= value) {
                        areas.push({
                            lowerBound: Number.MIN_VALUE,
                            upperBound: 1 / Math.min(value, limit),
                            // upperBound: 1 /value,
                            fill: (!isInvert) ? "url(#upper-dense-area-gradient)" : "url(#lower-dense-area-gradient)"
                        });
                        break;
                    }
                    var factors = Number.primeDecomposition(value);
                    ticks.push({
                        value: 1 / value,
                        label: "1/( ".concat((0, exports.factorsToString)(factors), " )"),
                        type: type,
                        color: factors.length <= 1 ? "green" : undefined,
                    });
                }
            }
        }
        var lowwerBoundIntegerValue = Math.ceil(lowwerBoundValue);
        var upperBoundIntegerValue = Math.min(Math.floor(upperBoundValue), limit);
        if (1 <= upperBoundIntegerValue) {
            if (limit <= lowwerBoundIntegerValue) {
                areas.push({
                    lowerBound: Math.max(2, lowwerBoundValue),
                    upperBound: Number.MAX_VALUE,
                    fill: (!isInvert) ? "url(#lower-dense-area-gradient)" : "url(#upper-dense-area-gradient)"
                });
            }
            else {
                var start = Math.max(1, lowwerBoundIntegerValue);
                var limitEnd = Math.min(start + maxRange, limit);
                // const limitEnd = start +maxRange;
                for (var value = start; value <= upperBoundIntegerValue; ++value) {
                    var width = (0, exports.getWidth)(slide, lane, value, value + 1, view, isInvert);
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
                    var factors = Number.primeDecomposition(value);
                    ticks.push({
                        value: value,
                        label: "".concat((0, exports.factorsToString)(factors)),
                        type: type,
                        color: factors.length <= 1 ? "green" : undefined,
                    });
                }
            }
        }
        ticks.push({
            value: 1 / Number.MAX_SAFE_INTEGER,
            label: "1 / max safe integer",
            type: "long",
            color: "blue"
        }, 
        // {
        //     value: 1 /limit,
        //     label: "1 / calculation limit",
        //     type: "long",
        //     color: "blue"
        // },
        {
            value: 1,
            type: "long",
        }, 
        // {
        //     value: limit,
        //     label: "calculation limit",
        //     type: "long",
        //     color: "blue"
        // },
        {
            value: 41024320,
            label: "number of digits in the largest known prime (Mersenne prime)",
            type: "long",
            color: "blue"
        }, {
            value: Number.MAX_SAFE_INTEGER,
            label: "max safe integer",
            type: "long",
            color: "blue"
        });
        var result = {
            ticks: ticks,
            areas: areas,
        };
        return result;
    };
    exports.designPrimeDecompositionTicks = designPrimeDecompositionTicks;
    var designConstantAreas = function (slide, view, lane, tickWindow, area) {
        var _a, _b, _c, _d;
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var result = [];
        var isInvert = (0, exports.isInvertLane)(lane);
        var lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        var upperBoundValue = Math.max(topValue.value, bottomValue.value);
        var lowerBound = (_a = area.lowerBound) !== null && _a !== void 0 ? _a : Number.MIN_VALUE;
        var upperBound = (_b = area.upperBound) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
        var width = (0, exports.getWidth)(slide, lane, lowerBound, upperBound, view, isInvert);
        var threshold = config_json_3.default.render.ruler.tickDensityThreshold_5;
        if ((lowwerBoundValue <= upperBound && lowerBound <= upperBoundValue) || (lowerBound <= upperBoundValue && lowwerBoundValue <= upperBound)) {
            var detailsCount = ((_c = area.details) !== null && _c !== void 0 ? _c : []).length;
            var details = 0 < detailsCount && threshold * Math.max(5, detailsCount * 1.25) <= width ?
                ((_d = area.details) !== null && _d !== void 0 ? _d : []).map(function (detail) { return (0, exports.designConstantAreas)(slide, view, lane, tickWindow, detail); }).reduce(function (a, b) { return a.concat(b); }, []) :
                undefined;
            result.push({
                lowerBound: lowerBound,
                upperBound: upperBound,
                fill: area.fill,
                overlay: area.overlay,
                label: threshold <= width * 1.5 ? area.label : undefined,
                color: area.color,
                details: details,
            });
        }
        return result;
    };
    exports.designConstantAreas = designConstantAreas;
    var designConstantTickColor = function (tick) {
        var _a;
        switch (tick.color) {
            case undefined:
                return ((_a = tick.priority) !== null && _a !== void 0 ? _a : 0) <= 0 ?
                    config_json_3.default.model.constantTable.primaryNumberColor :
                    config_json_3.default.model.constantTable.defaultNumberColor;
            case "$ESTIMATED":
                return config_json_3.default.model.constantTable.estimatedNumberColor;
            case "$FICTION":
                return config_json_3.default.model.constantTable.fictionalNumberColor;
            default:
                return tick.color;
        }
    };
    exports.designConstantTickColor = designConstantTickColor;
    var designConstantTickType = function (slide, lane, view, ticks, value) {
        var tickThreshold = config_json_3.default.render.ruler.tickDensityThreshold_5 * 0.8;
        var width = (0, exports.getLongTickSpaceWidth)(slide, lane, view, ticks, value);
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
            default:
                return "medium";
        }
    };
    exports.designConstantTickType = designConstantTickType;
    var designConstantTicks = function (slide, view, lane, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var areas = [];
        // const isInvert = isInvertLane(lane);
        var lowwerBoundValue = Math.min(topValue.value, bottomValue.value);
        var upperBoundValue = Math.max(topValue.value, bottomValue.value);
        if (undefined !== lane.table) {
            var unit = Locale.resolve(lane.table.unit);
            if (undefined !== lane.table.unit) {
                ticks.push({
                    value: 1,
                    unit: unit,
                    type: "long",
                    color: config_json_3.default.model.constantTable.standardNumberColor,
                });
            }
            var sourceTicks = lane.table.ticks
                .filter(function (i) { return lowwerBoundValue <= i.value && i.value <= upperBoundValue; })
                .sort(Comparer.make([function (i) { var _a; return (_a = i.priority) !== null && _a !== void 0 ? _a : 0; },]));
            for (var _i = 0, sourceTicks_1 = sourceTicks; _i < sourceTicks_1.length; _i++) {
                var i = sourceTicks_1[_i];
                var type = (0, exports.designConstantTickType)(slide, lane, view, ticks, i.value);
                if ("none" !== type) {
                    ticks.push({
                        value: i.value,
                        label: i.label,
                        unit: unit,
                        type: type,
                        color: (0, exports.designConstantTickColor)(i),
                    });
                }
            }
            for (var _a = 0, _b = lane.table.areas; _a < _b.length; _a++) {
                var i = _b[_a];
                areas.push.apply(areas, (0, exports.designConstantAreas)(slide, view, lane, tickWindow, i));
            }
        }
        var result = {
            ticks: ticks,
            areas: areas,
        };
        return result;
    };
    exports.designConstantTicks = designConstantTicks;
    var designPeriodicTicks = function (_slide, _view, _lane, _tickWindow) {
        var ticks = [];
        var areas = [];
        var result = {
            ticks: ticks,
            areas: areas,
        };
        return result;
    };
    exports.designPeriodicTicks = designPeriodicTicks;
    var designTicks = function (slide, view, lane, tickWindow) {
        if ((0, exports.isPeriodicLane)(lane)) {
            return (0, exports.designPeriodicTicks)(slide, view, lane, tickWindow);
        }
        else {
            var valueTickWindow = (0, exports.PositionTickWindowToValueTickWindow)(slide, lane, view, tickWindow);
            switch (lane.type) {
                case "2^n":
                    return (0, exports.design2nTicks)(slide, view, lane, valueTickWindow);
                case "prime":
                    return (0, exports.designPrimeNumbersTicks)(slide, view, lane, valueTickWindow);
                case "prime-decomposition":
                    return (0, exports.designPrimeDecompositionTicks)(slide, view, lane, valueTickWindow);
                case "constant":
                    return (0, exports.designConstantTicks)(slide, view, lane, valueTickWindow);
                default:
                    return (0, exports.designRegularTicks)(slide, view, lane, valueTickWindow);
            }
        }
    };
    exports.designTicks = designTicks;
    var makeRootLane = function () {
        var _a = config_json_3.default.model.lane.root, type = _a.type, exponent = _a.exponent;
        return (0, exports.makeLane)({
            type: type,
            exponent: exponent,
        });
    };
    exports.makeRootLane = makeRootLane;
    var getRootLane = function () {
        return (0, exports.getLane)(exports.RootLaneIndex);
    };
    exports.getRootLane = getRootLane;
    var isRootLane = function (indexOrLane) {
        return (typeof indexOrLane === "number" ? exports.RootLaneIndex : (0, exports.getLane)(exports.RootLaneIndex)) === indexOrLane;
    };
    exports.isRootLane = isRootLane;
    var isPrimaryLane = function (lane) {
        return (0, exports.getSlideFromLane)(lane).lanes[0] === lane;
    };
    exports.isPrimaryLane = isPrimaryLane;
    var getRootSlide = function () {
        return exports.data.slides[0];
    };
    exports.getRootSlide = getRootSlide;
    var getRootSlideAndRootLane = function () {
        return ({ slide: (0, exports.getRootSlide)(), lane: (0, exports.getRootLane)() });
    };
    exports.getRootSlideAndRootLane = getRootSlideAndRootLane;
    var isRootSlide = function (indexOrSlide) {
        return (0 === (typeof indexOrSlide === "number" ? indexOrSlide : (0, exports.getSlideIndex)(indexOrSlide)));
    };
    exports.isRootSlide = isRootSlide;
    var getSlideIndex = function (slide) {
        var index = exports.data.slides.indexOf(slide);
        if (0 <= index) {
            return index;
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getSlideIndex: slide not found");
    };
    exports.getSlideIndex = getSlideIndex;
    var getSlideIndexFromLane = function (lane) {
        for (var i = 0; i < exports.data.slides.length; ++i) {
            var slide = exports.data.slides[i];
            if (slide.lanes.includes(lane)) {
                return i;
            }
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getSlideIndexFromLane: lane not found in any slide");
    };
    exports.getSlideIndexFromLane = getSlideIndexFromLane;
    var getLaneIndex = function (lane) {
        var i = 0;
        for (var _i = 0, _a = exports.data.slides; _i < _a.length; _i++) {
            var slide = _a[_i];
            for (var _b = 0, _c = slide.lanes; _b < _c.length; _b++) {
                var l = _c[_b];
                if (l === lane) {
                    return i;
                }
                ++i;
            }
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getLaneIndex: lane not found");
    };
    exports.getLaneIndex = getLaneIndex;
    var makeSlide = function (anchor) {
        if (anchor === void 0) { anchor = 1; }
        return ({
            lanes: [],
            anchor: anchor,
        });
    };
    exports.makeSlide = makeSlide;
    var makeSureSlide = function () {
        if (exports.data.slides.length <= 0) {
            var slide = (0, exports.makeSlide)();
            slide.lanes.push((0, exports.makeRootLane)());
            exports.data.slides.push(slide);
        }
        return exports.data.slides[exports.data.slides.length - 1];
    };
    exports.makeSureSlide = makeSureSlide;
    var getSlideAndLane = function (index) {
        var i = 0;
        for (var _i = 0, _a = exports.data.slides; _i < _a.length; _i++) {
            var slide = _a[_i];
            for (var _b = 0, _c = slide.lanes; _b < _c.length; _b++) {
                var lane = _c[_b];
                if (i === index) {
                    return { slide: slide, lane: lane };
                }
                ++i;
            }
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getLane: index out of range: ".concat(index));
    };
    exports.getSlideAndLane = getSlideAndLane;
    var getLastSlideAndLastLane = function () {
        if (exports.data.slides.length <= 0) {
            throw new Error("\uD83E\uDD8B FIXME: Model.getLastSlideAndLastLane: no slide exists");
        }
        var slide = exports.data.slides[exports.data.slides.length - 1];
        if (slide.lanes.length <= 0) {
            throw new Error("\uD83E\uDD8B FIXME: Model.getLastSlideAndLastLane: no lane exists in the last slide");
        }
        var lane = slide.lanes[slide.lanes.length - 1];
        return { slide: slide, lane: lane };
    };
    exports.getLastSlideAndLastLane = getLastSlideAndLastLane;
    var getLane = function (index) {
        return (0, exports.getSlideAndLane)(index).lane;
    };
    exports.getLane = getLane;
    var getSlideFromLane = function (lane) {
        for (var _i = 0, _a = exports.data.slides; _i < _a.length; _i++) {
            var slide = _a[_i];
            if (slide.lanes.includes(lane)) {
                return slide;
            }
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getSlideFromLane: lane not found in any slide");
    };
    exports.getSlideFromLane = getSlideFromLane;
    var addLane = function (lane) {
        (0, exports.makeSureSlide)().lanes.push(lane);
    };
    exports.addLane = addLane;
    var getLaneName = function (laneSeed) {
        if (undefined !== laneSeed.name && null !== laneSeed.name) {
            return laneSeed.name;
        }
        for (var _i = 0, _a = Object.keys(config_json_3.default.model.lane.presets); _i < _a.length; _i++) {
            var i = _a[_i];
            var preset = config_json_3.default.model.lane.presets[i];
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
    var makeLane = function (laneSeed) {
        return ({
            type: laneSeed.type,
            exponent: laneSeed.exponent,
            name: getLaneName(laneSeed),
            table: laneSeed.table,
        });
    };
    exports.makeLane = makeLane;
    var removeLane = function (index) {
        if ((0, exports.isRootLane)(index)) {
            throw new Error("\uD83E\uDD8B FIXME: Model.removeLane: cannot remove root lane");
        }
        else {
            var _a = (0, exports.getSlideAndLane)(index), slide = _a.slide, lane = _a.lane;
            slide.lanes.splice(slide.lanes.indexOf(lane), 1);
        }
    };
    exports.removeLane = removeLane;
    var makeSure = function () {
        (0, exports.makeSureSlide)();
    };
    exports.makeSure = makeSure;
    var getCursorPosition = function (view) {
        return (0, exports.getPositionAt)((0, exports.getRootSlide)(), (0, exports.getRootLane)(), exports.data.cursor, view);
    };
    exports.getCursorPosition = getCursorPosition;
    var getCursorValue = function (slide, lane, view) {
        return (0, exports.getValueAt)(slide, lane, (0, exports.getCursorPosition)(view), view);
    };
    exports.getCursorValue = getCursorValue;
    var getCursorValues = function (view) {
        return exports.data.slides.map(function (slide) { return (0, exports.getCursorValue)(slide, slide.lanes[0], view); });
    };
    exports.getCursorValues = getCursorValues;
    var getLaneContext = function (lane) {
        var slide = (0, exports.getSlideFromLane)(lane);
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
    var initialize = function () {
        var _a;
        exports.data.cursor = (_a = Number.parse(Url.get("cursor"))) !== null && _a !== void 0 ? _a : config_json_3.default.model.defaultCursor;
        console.log("Model initialized: cursor=".concat(exports.data.cursor));
        (0, exports.makeSure)();
    };
    exports.initialize = initialize;
});
define("script/view", ["require", "exports", "script/number", "script/type", "script/url", "script/ui", "resource/config"], function (require, exports, Number, Type, Url, UI, config_json_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.setViewScaleExponent = exports.getViewScale = exports.setViewMode = exports.isGraphView = exports.isGridView = exports.isRulerView = exports.getViewMode = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    UI = __importStar(UI);
    config_json_4 = __importDefault(config_json_4);
    exports.data = {
        viewMode: "ruler",
        viewScaleExponent: (_a = config_json_4.default.view.defaultZoomLevel) !== null && _a !== void 0 ? _a : 2.5,
        baseOfLogarithm: 10,
    };
    var getViewMode = function () { return exports.data.viewMode; };
    exports.getViewMode = getViewMode;
    var isRulerView = function () { return exports.data.viewMode === "ruler"; };
    exports.isRulerView = isRulerView;
    var isGridView = function () { return exports.data.viewMode === "grid"; };
    exports.isGridView = isGridView;
    var isGraphView = function () { return exports.data.viewMode === "graph"; };
    exports.isGraphView = isGraphView;
    var setViewMode = function (mode) {
        exports.data.viewMode = mode;
        Url.addParameter("view-mode", mode);
        document.body.classList.toggle("ruler-view", (0, exports.isRulerView)());
        document.body.classList.toggle("grid-view", (0, exports.isGridView)());
        document.body.classList.toggle("graph-view", (0, exports.isGraphView)());
        UI.setAriaHidden(UI.rulerView, !(0, exports.isRulerView)());
        UI.setAriaHidden(UI.gridView, !(0, exports.isGridView)());
    };
    exports.setViewMode = setViewMode;
    var getViewScale = function () { return Math.pow(10, exports.data.viewScaleExponent); };
    exports.getViewScale = getViewScale;
    var setViewScaleExponent = function (exponent) {
        exports.data.viewScaleExponent = exponent;
        //data.viewScale = Math.pow(10, exponent);
        Url.addParameter("view-scale", exponent.toString());
    };
    exports.setViewScaleExponent = setViewScaleExponent;
    var initialize = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (0, exports.setViewMode)((_c = (_a = Url.get("view-mode")) !== null && _a !== void 0 ? _a : (_b = config_json_4.default.view) === null || _b === void 0 ? void 0 : _b.defaultViewMode) !== null && _c !== void 0 ? _c : "ruler");
        (0, exports.setViewScaleExponent)((_d = Number.parse(Url.get("view-scale"))) !== null && _d !== void 0 ? _d : exports.data.viewScaleExponent);
        exports.data.baseOfLogarithm = (_h = (_e = Number.orUndefined(Type.getNamedNumberValue(Url.get("base")))) !== null && _e !== void 0 ? _e : (_g = (_f = config_json_4.default.view) === null || _f === void 0 ? void 0 : _f.baseOfLogarithm) === null || _g === void 0 ? void 0 : _g.default) !== null && _h !== void 0 ? _h : 10;
        console.log("View initialized: mode=".concat(exports.data.viewMode, ", scale=").concat(exports.data.viewScaleExponent, ", base=").concat(exports.data.baseOfLogarithm));
    };
    exports.initialize = initialize;
});
define("script/render", ["require", "exports", "script/view", "script/model"], function (require, exports, View, Model) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setRenderer = exports.markDirty = exports.isDirty = void 0;
    View = __importStar(View);
    Model = __importStar(Model);
    var dirty = false;
    var currentRenderer;
    var isDirty = function () {
        return false !== dirty;
    };
    exports.isDirty = isDirty;
    var markDirty = function (laneIndex) {
        var isFirstDirty = !(0, exports.isDirty)();
        if (undefined !== laneIndex) {
            if (false === dirty) {
                dirty = new Set();
            }
            if (dirty instanceof Set) {
                dirty.add(laneIndex);
            }
        }
        else {
            dirty = true;
        }
        if (isFirstDirty) {
            requestAnimationFrame(function () {
                currentRenderer(Model.data, View.data, dirty);
                dirty = false;
            });
        }
    };
    exports.markDirty = markDirty;
    var setRenderer = function (renderer) {
        return currentRenderer = renderer;
    };
    exports.setRenderer = setRenderer;
});
define("script/ruler", ["require", "exports", "script/locale", "script/type", "script/number", "script/model", "script/ui", "script/render", "script/svg", "script/comparer", "resource/config"], function (require, exports, Locale, Type, Number, Model, UI, Render, SVG, Comparer, config_json_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getRulerWidth = exports.resize = exports.drawMenuLane = exports.drawAnchorLine = exports.slideCursor = exports.snapHorizontalPosition = exports.snapVerticalPosition = exports.getAreaPositions = exports.nextPosition = exports.snapPosition = exports.regulateReferencePositions = exports.getReferenceLaneIndexFromEvent = exports.drawTicks = exports.calculateMinimumFractionDigits = exports.getFractionDigitsFromUnit = exports.makeNumberLabel = exports.drawErrorArea = exports.drawAreas = exports.drawLane = exports.getLeftOfLane = exports.drawSlide = exports.drawDenseAreaDefines = exports.drawErrorAreaDefines = exports.drawOverlayDefines = exports.makeLinerGradient = exports.drawDefines = exports.getLaneIndexFromPosition = exports.renderer = exports.LaneWidths = exports.scale = void 0;
    Locale = __importStar(Locale);
    Type = __importStar(Type);
    Number = __importStar(Number);
    Model = __importStar(Model);
    UI = __importStar(UI);
    Render = __importStar(Render);
    SVG = __importStar(SVG);
    Comparer = __importStar(Comparer);
    config_json_5 = __importDefault(config_json_5);
    exports.scale = 1.0;
    exports.LaneWidths = [];
    var renderer = function (model, view, dirty) {
        if (false !== dirty) {
            if (true === dirty) {
                (0, exports.drawDefines)(model, view);
            }
            for (var _i = 0, _a = model.slides; _i < _a.length; _i++) {
                var slide = _a[_i];
                if ("boolean" === typeof dirty || dirty.has(Model.getSlideIndex(slide))) {
                    (0, exports.drawSlide)(view, slide);
                }
            }
            //if (...)
            //{
            (0, exports.drawMenuLane)(view);
            //}
            if (true === dirty || dirty.has(-1)) {
                (0, exports.drawAnchorLine)(model, view);
            }
        }
    };
    exports.renderer = renderer;
    var getLaneIndexFromPosition = function (position) {
        var accumulatedWidth = 0;
        for (var i = 0; i < exports.LaneWidths.length; ++i) {
            accumulatedWidth += exports.LaneWidths[i];
            if (position < accumulatedWidth) {
                return i;
            }
        }
        return null;
    };
    exports.getLaneIndexFromPosition = getLaneIndexFromPosition;
    var drawDefines = function (model, view) {
        var defs = SVG.makeSure(UI.rulerSvg, {
            tag: "defs",
        });
        (0, exports.drawOverlayDefines)(model, view, defs);
        (0, exports.drawErrorAreaDefines)(model, view, defs);
        (0, exports.drawDenseAreaDefines)(model, view, defs);
    };
    exports.drawDefines = drawDefines;
    var makeLinerGradient = function (defs, id, line, stops) {
        var gradient = SVG.makeSure(defs, {
            tag: "linearGradient",
            id: id,
            x1: line.x1,
            y1: line.y1,
            x2: line.x2,
            y2: line.y2,
        });
        for (var _i = 0, stops_1 = stops; _i < stops_1.length; _i++) {
            var stop_1 = stops_1[_i];
            SVG.makeSure(gradient, {
                tag: "stop",
                offset: stop_1.offset,
                "stop-color": stop_1.color,
                "stop-opacity": stop_1.opacity,
            });
        }
        return gradient;
    };
    exports.makeLinerGradient = makeLinerGradient;
    var drawOverlayDefines = function (_model, _view, defs) {
        var backgroundColor = config_json_5.default.render.ruler.laneBackgroundColor;
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
    var drawErrorAreaDefines = function (_model, _view, defs) {
        (0, exports.makeLinerGradient)(defs, "min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.minErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_5.default.render.ruler.minErrorAreaColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.maxErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_5.default.render.ruler.maxErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.minErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_5.default.render.ruler.minErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.maxErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_5.default.render.ruler.maxErrorAreaColor, opacity: 0 },
        ]);
    };
    exports.drawErrorAreaDefines = drawErrorAreaDefines;
    var drawDenseAreaDefines = function (_model, _view, defs) {
        (0, exports.makeLinerGradient)(defs, "upper-dense-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.denseAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_5.default.render.ruler.denseAreaColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "lower-dense-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_5.default.render.ruler.denseAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_5.default.render.ruler.denseAreaColor, opacity: 1 },
        ]);
    };
    exports.drawDenseAreaDefines = drawDenseAreaDefines;
    var drawSlide = function (view, slide) {
        var slideIndex = Model.getSlideIndex(slide);
        var group = SVG.makeSure(UI.rulerSvg, {
            tag: "g",
            class: "slide-group",
            "data-slide-index": slideIndex,
        });
        group.innerHTML = "";
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var lane = _a[_i];
            (0, exports.drawLane)(view, group, slide, lane);
        }
    };
    exports.drawSlide = drawSlide;
    var getLeftOfLane = function (laneIndex) {
        return exports.LaneWidths.slice(0, laneIndex).reduce(function (a, b) { return a + b; }, 0) - Model.data.offset.x;
    };
    exports.getLeftOfLane = getLeftOfLane;
    var drawLane = function (view, group, slide, lane) {
        var _a;
        var isLastLane = lane === slide.lanes[slide.lanes.length - 1];
        var laneIndex = Model.getLaneIndex(lane);
        var left = (0, exports.getLeftOfLane)(laneIndex);
        var width = config_json_5.default.render.ruler.laneWidth;
        ;
        exports.LaneWidths[laneIndex] = width;
        var tickGroup = SVG.make({
            tag: "g",
            class: "tick-group",
        });
        group.append(SVG.make({
            tag: "rect",
            class: "lane-background",
            x: left,
            y: 0,
            width: width,
            height: group.ownerSVGElement.viewBox.baseVal.height,
            fill: config_json_5.default.render.ruler.laneBackgroundColor,
        }), tickGroup, SVG.make({
            tag: "rect",
            class: "lane-label-background",
            x: left + 8,
            y: 8,
            rx: 8,
            ry: 8,
            width: width - 16,
            height: 24,
            fill: config_json_5.default.render.ruler.laneLabelBackgroundColor,
        }), SVG.make({
            tag: "text",
            class: "lane-label",
            x: left + 16,
            y: 26,
            fill: "#000000",
            "font-size": 16,
            textContent: (_a = Locale.resolve(lane.name)) !== null && _a !== void 0 ? _a : "Lane ".concat(laneIndex),
        }), SVG.make({
            tag: "line",
            class: "lane-separator",
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement.viewBox.baseVal.height,
            stroke: isLastLane ?
                config_json_5.default.render.ruler.slideSeparatorColor :
                config_json_5.default.render.ruler.laneSeparatorColor,
            "stroke-width": config_json_5.default.render.ruler.laneSeparatorWidth,
        }));
        var content = Model.designTicks(slide, view, lane, Model.makePositionTickWindowFromWindow());
        (0, exports.drawErrorArea)(view, tickGroup, slide, lane);
        (0, exports.drawAreas)(view, tickGroup, slide, lane, content.areas);
        (0, exports.drawTicks)(view, tickGroup, slide, lane, (0, exports.calculateMinimumFractionDigits)(content.ticks));
    };
    exports.drawLane = drawLane;
    var drawAreas = function (view, group, slide, lane, areas, indent) {
        var _a, _b, _c, _d, _e;
        if (indent === void 0) { indent = 0; }
        var indentUnit = 20;
        var laneIndex = Model.getLaneIndex(lane);
        var left = (0, exports.getLeftOfLane)(laneIndex) + indent;
        var width = config_json_5.default.render.ruler.laneWidth - indent;
        var isInvert = Model.isInvertLane(lane);
        for (var _i = 0, areas_1 = areas; _i < areas_1.length; _i++) {
            var area = areas_1[_i];
            var lowerPosition = undefined === area.lowerBound ?
                ((!isInvert) ? 0 : group.ownerSVGElement.viewBox.baseVal.height) :
                Model.getPositionAt(slide, lane, area.lowerBound, view);
            var upperPosition = undefined === area.upperBound ?
                ((!isInvert) ? group.ownerSVGElement.viewBox.baseVal.height : 0) :
                Model.getPositionAt(slide, lane, area.upperBound, view);
            var y = Math.max(0, (!isInvert) ? lowerPosition : upperPosition);
            var height = Math.min(group.ownerSVGElement.viewBox.baseVal.height - y, (!isInvert) ? upperPosition - y : lowerPosition - y);
            var hasDetails = 0 < ((_a = area.details) !== null && _a !== void 0 ? _a : []).length;
            if (hasDetails) {
                var width_2 = indentUnit;
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "area",
                    x: left,
                    y: y,
                    width: width_2,
                    height: height,
                    fill: area.fill,
                }));
                if ("none" !== ((_b = area.overlay) !== null && _b !== void 0 ? _b : "none")) {
                    group.appendChild(SVG.make({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width: width_2,
                        height: height,
                        fill: "url(#overlay-".concat(area.overlay, "-gradient)"),
                    }));
                }
                if (undefined !== area.label) {
                    group.appendChild(SVG.make({
                        tag: "text",
                        class: "area-label",
                        x: left + 16,
                        y: y + height - 8,
                        transform: "rotate(-90, ".concat(left + 16, ", ").concat(y + height - 8, ")"),
                        fill: (_c = area.color) !== null && _c !== void 0 ? _c : "#000000",
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
                    width: width,
                    height: height,
                    fill: area.fill,
                }));
                if ("none" !== ((_d = area.overlay) !== null && _d !== void 0 ? _d : "none")) {
                    group.appendChild(SVG.make({
                        tag: "rect",
                        class: "area",
                        x: left,
                        y: y,
                        width: width,
                        height: height,
                        fill: "url(#overlay-".concat(area.overlay, "-gradient)"),
                    }));
                }
                if (undefined !== area.label) {
                    group.appendChild(SVG.make({
                        tag: "text",
                        class: "area-label",
                        x: left + 8,
                        y: y + (height / 2) + 4,
                        fill: (_e = area.color) !== null && _e !== void 0 ? _e : "#000000",
                        "font-size": 12,
                        textContent: Locale.resolve(area.label),
                    }));
                }
            }
        }
    };
    exports.drawAreas = drawAreas;
    var drawErrorArea = function (view, group, slide, lane) {
        var _a, _b;
        var isInvert = Model.isInvertLane(lane);
        var min = Number.maxMin((_a = Model.getValueAt(slide, lane, (!isInvert) ? 0 : group.ownerSVGElement.viewBox.baseVal.height, view)) === null || _a === void 0 ? void 0 : _a.value);
        if (min <= Number.MIN_VALUE) {
            (0, exports.drawAreas)(view, group, slide, lane, [{
                    lowerBound: undefined,
                    upperBound: Number.MIN_VALUE,
                    fill: (!isInvert) ? "url(#min-error-area-gradient)" : "url(#invert-min-error-area-gradient)"
                }]);
        }
        var max = Number.maxMin((_b = Model.getValueAt(slide, lane, (!isInvert) ? group.ownerSVGElement.viewBox.baseVal.height : 0, view)) === null || _b === void 0 ? void 0 : _b.value);
        if (Number.MAX_VALUE <= max) {
            (0, exports.drawAreas)(view, group, slide, lane, [{
                    lowerBound: Number.MAX_VALUE,
                    upperBound: undefined,
                    fill: (!isInvert) ? "url(#max-error-area-gradient)" : "url(#invert-max-error-area-gradient)"
                }]);
        }
    };
    exports.drawErrorArea = drawErrorArea;
    var makeNumberLabel = function (tick) {
        var label = tick.label, minimumFractionDigits = tick.minimumFractionDigits;
        var value = Type.getTickValue(tick);
        var unit = undefined === tick.unit ? "" : " ".concat(tick.unit);
        switch (true) {
            case undefined !== label:
                return Locale.resolve(label);
            case value < 0.000000000001 || 10000000000000 <= value:
                return Type.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 11, maximumSignificantDigits: 11, minimumFractionDigits: minimumFractionDigits }) + unit;
            // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
            default:
                return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: Math.max(13, minimumFractionDigits !== null && minimumFractionDigits !== void 0 ? minimumFractionDigits : 13), minimumFractionDigits: minimumFractionDigits }) + unit;
            // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
        }
    };
    exports.makeNumberLabel = makeNumberLabel;
    var getFractionDigitsFromUnit = function (unit) {
        if (0 < unit) {
            var log10 = Math.log10(unit);
            if (0 <= log10) {
                return undefined;
            }
            else {
                // 本来は Math.round はなく Math.ceil でないといけないが計算誤差により log10 がわずかに大きくなってしまう場合があるため、Math.round を使用する
                return Math.round(-log10);
            }
        }
        return undefined;
    };
    exports.getFractionDigitsFromUnit = getFractionDigitsFromUnit;
    var calculateMinimumFractionDigits = function (ticks) {
        var numericTicks = ticks
            .filter(function (i) { return "number" === typeof i.value && "long" === i.type; })
            .sort(Comparer.make(function (i) { return i.value; }));
        if (1 < numericTicks.length) {
            numericTicks[0].minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(numericTicks[1].value - numericTicks[0].value);
            var lastIndex = numericTicks.length - 1;
            numericTicks[lastIndex].minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(numericTicks[lastIndex].value - numericTicks[lastIndex - 1].value);
        }
        for (var i = 1; i < numericTicks.length - 1; ++i) {
            var prev = numericTicks[i - 1];
            var current = numericTicks[i];
            var next = numericTicks[i + 1];
            var prevDelta = current.value - prev.value;
            var nextDelta = next.value - current.value;
            var unit = Math.max(prevDelta, nextDelta);
            current.minimumFractionDigits = (0, exports.getFractionDigitsFromUnit)(unit);
        }
        return ticks;
    };
    exports.calculateMinimumFractionDigits = calculateMinimumFractionDigits;
    var drawTicks = function (view, group, slide, lane, ticks) {
        var _a;
        var isConstantTable = "constant" === lane.type;
        var isPrimaryLane = Model.isPrimaryLane(lane);
        var laneIndex = Model.getLaneIndex(lane);
        var laneContext = Model.getLaneContext(lane);
        var isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
        var width = config_json_5.default.render.ruler.laneWidth;
        ;
        var left = (0, exports.getLeftOfLane)(laneIndex);
        var right = left + width;
        for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
            var tick = ticks_1[_i];
            var value = Type.getTickValue(tick);
            var position = Model.getPositionAt(slide, lane, value, view);
            if (0 <= position && position <= group.ownerSVGElement.viewBox.baseVal.height && "none" !== tick.type) {
                var isPrimaryTick = isPrimaryLane && 1 === value;
                var color = (_a = tick.color) !== null && _a !== void 0 ? _a : (isPrimaryTick ? config_json_5.default.render.ruler.primaryTickColor : config_json_5.default.render.ruler.tick[tick.type].color);
                var drawLeftTick = !isRootSlide && ("left-end" === laneContext || "center" === laneContext || "single" === laneContext);
                var drawRightTick = isRootSlide || "right-end" === laneContext || "single" === laneContext;
                if (drawLeftTick) {
                    group.appendChild(SVG.make({
                        tag: "line",
                        class: "tick tick-".concat(tick.type),
                        x1: left,
                        y1: position,
                        x2: left + config_json_5.default.render.ruler.tick[tick.type].length,
                        y2: position,
                        // stroke: config.render.ruler.tick[tick.type].color,
                        stroke: color,
                        "stroke-width": config_json_5.default.render.ruler.tick[tick.type].width,
                        "data-tick-value": value,
                    }));
                }
                if (drawRightTick) {
                    group.appendChild(SVG.make({
                        tag: "line",
                        class: "tick tick-".concat(tick.type),
                        x1: right,
                        y1: position,
                        x2: right - config_json_5.default.render.ruler.tick[tick.type].length,
                        y2: position,
                        // stroke: config.render.ruler.tick[tick.type].color,
                        stroke: color,
                        "stroke-width": config_json_5.default.render.ruler.tick[tick.type].width,
                        "data-tick-value": value,
                    }));
                }
                if (tick.type === "long") {
                    var drawLabelDirection = !drawLeftTick ? "right" :
                        !drawRightTick ? "left" :
                            value < 1 ? "left" : "right";
                    var x = "left" === drawLabelDirection ?
                        // left + config.render.ruler.tick[tick.type].length + 4:
                        left + config_json_5.default.render.ruler.tick[tick.type].length + 8 :
                        right - config_json_5.default.render.ruler.tick[tick.type].length - 4;
                    var y = position + 4;
                    group.appendChild(SVG.make({
                        tag: "text",
                        class: "tick-label",
                        x: x,
                        y: y,
                        //fill: config.render.ruler.tick[tick.type].color,
                        transform: isConstantTable ? "rotate(-45 ".concat(x, " ").concat(y, ")") : undefined,
                        fill: color,
                        "font-size": 12,
                        "text-anchor": "left" === drawLabelDirection ? "start" : "end",
                        textContent: (0, exports.makeNumberLabel)(tick),
                    }));
                }
            }
        }
    };
    exports.drawTicks = drawTicks;
    var anchorDragStartY = 0;
    var initialDraggingAnchorPosition = undefined;
    var getReferenceLaneIndexFromEvent = function (event) {
        if ("NOSNAP" !== event && "clientX" in event) {
            return (0, exports.getLaneIndexFromPosition)(event.clientX + Model.data.offset.x);
        }
        else {
            return null;
        }
    };
    exports.getReferenceLaneIndexFromEvent = getReferenceLaneIndexFromEvent;
    var regulateReferencePositions = function (referencePositions) {
        return Array.from(new Set(referencePositions))
            .sort(Comparer.make(function (a) { return a; }));
    };
    exports.regulateReferencePositions = regulateReferencePositions;
    var snapPosition = function (position, referencePositions) {
        var result = position;
        var minDistance = Number.MAX_VALUE;
        for (var _i = 0, referencePositions_1 = referencePositions; _i < referencePositions_1.length; _i++) {
            var targetPosition = referencePositions_1[_i];
            var distance = Math.abs(position - targetPosition);
            if (distance < minDistance) {
                minDistance = distance;
                result = targetPosition;
            }
        }
        return result;
    };
    exports.snapPosition = snapPosition;
    var nextPosition = function (position, referencePositions, direction) {
        var result = position;
        var minDistance = Number.MAX_VALUE;
        for (var _i = 0, referencePositions_2 = referencePositions; _i < referencePositions_2.length; _i++) {
            var targetPosition = referencePositions_2[_i];
            var distance = direction === "PREVIOUS" ? position - targetPosition : targetPosition - position;
            if (0 < distance && distance < minDistance) {
                minDistance = distance;
                result = targetPosition;
            }
        }
        return result;
    };
    exports.nextPosition = nextPosition;
    var getAreaPositions = function (slide, lane, view, areas) {
        var _a;
        var positions = [];
        for (var _i = 0, areas_2 = areas; _i < areas_2.length; _i++) {
            var area = areas_2[_i];
            if (undefined !== area.lowerBound) {
                var lowerPosition = Model.getPositionAt(slide, lane, area.lowerBound, view);
                positions.push(lowerPosition);
            }
            if (undefined !== area.upperBound) {
                var upperPosition = Model.getPositionAt(slide, lane, area.upperBound, view);
                positions.push(upperPosition);
            }
            if (0 < ((_a = area.details) !== null && _a !== void 0 ? _a : []).length) {
                positions.push.apply(positions, (0, exports.getAreaPositions)(slide, lane, view, area.details));
            }
        }
        return positions;
    };
    exports.getAreaPositions = getAreaPositions;
    var snapVerticalPosition = function (event, view, position, referenceLaneIndex) {
        var _a;
        if ("NOSNAP" !== event && !event.shiftKey) {
            var laneIndex = (_a = referenceLaneIndex !== null && referenceLaneIndex !== void 0 ? referenceLaneIndex : (0, exports.getReferenceLaneIndexFromEvent)(event)) !== null && _a !== void 0 ? _a : 0;
            var _b = Model.getSlideAndLane(laneIndex), slide_1 = _b.slide, lane_1 = _b.lane;
            var tickWindow = Model.makePositionTickWindowFromPositionAndWidth(position, 32);
            var content = Model.designTicks(slide_1, view, lane_1, tickWindow);
            var tickPositions = content.ticks.map(function (i) { return Model.getPositionAt(slide_1, lane_1, i.value, view); });
            tickPositions.push.apply(tickPositions, (0, exports.getAreaPositions)(slide_1, lane_1, view, content.areas));
            tickPositions.push(Model.getCursorPosition(view));
            console.log("snapVerticalPosition.self.content.areas: ".concat(content.areas.length));
            if ("number" === typeof referenceLaneIndex) {
                var selfLaneIndex = referenceLaneIndex + 1;
                if (selfLaneIndex < Model.getAllLaneCount()) {
                    var _c = Model.getSlideAndLane(selfLaneIndex), selfSlide_1 = _c.slide, selfLane_1 = _c.lane;
                    var currentPosition_1 = Model.getPositionAt(slide_1, lane_1, selfSlide_1.anchor, view);
                    var delta = position - currentPosition_1;
                    var oppositePosition_1 = Model.getPositionAt(slide_1, lane_1, 1, view);
                    var tickWindow_1 = Model.makePositionTickWindowFromPositionAndWidth(oppositePosition_1 - delta, 32);
                    var content_1 = Model.designTicks(selfSlide_1, view, selfLane_1, tickWindow_1);
                    tickPositions.push.apply(tickPositions, content_1.ticks
                        .map(function (i) { return Model.getPositionAt(selfSlide_1, selfLane_1, i.value, view); })
                        .map(function (i) { return currentPosition_1 + (oppositePosition_1 - i); }));
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
    var snapHorizontalPosition = function (event, position) {
        if ("NOSNAP" !== event && !event.shiftKey) {
            var referencePositions = [];
            referencePositions.push(0);
            var max = Math.max(0, (0, exports.getRulerWidth)() - (window.innerWidth - (UI.rulerNewSlidePanel.clientWidth + UI.rulerHelpPanel.clientWidth)));
            if (0 < max) {
                var accumulatedWidth = 0;
                for (var _i = 0, LaneWidths_1 = exports.LaneWidths; _i < LaneWidths_1.length; _i++) {
                    var laneWidth = LaneWidths_1[_i];
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
    var slideCursor = function (model, view, event, position) {
        var _a, _b, _c, _d;
        var _e = Model.getRootSlideAndRootLane(), slide = _e.slide, lane = _e.lane;
        var minPosition = (_a = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE;
        var maxPosition = (_b = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
        var snappedPosition = (0, exports.snapVerticalPosition)(event, view, position);
        var resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
        model.cursor = (_d = (_c = Model.getValueAt(slide, lane, resultPosition, view)) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : model.cursor;
        Render.markDirty();
        return snappedPosition - position;
    };
    exports.slideCursor = slideCursor;
    var drawAnchorLine = function (model, view) {
        var _a = Model.getRootSlideAndRootLane(), slide = _a.slide, lane = _a.lane;
        var svg = UI.rulerOverlay;
        var color = config_json_5.default.render.ruler.lineColor;
        var handleRadius = 24;
        var line = SVG.makeSure(svg, {
            tag: "line",
            class: "anchor-line",
        });
        var events = {
            pointermove: {
                listener: function (event) {
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        var deltaY = event.clientY - anchorDragStartY;
                        (0, exports.slideCursor)(model, view, event, initialDraggingAnchorPosition + deltaY);
                    }
                },
                options: {
                    passive: false,
                }
            },
            pointerup: {
                listener: function (event) {
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        var deltaY = event.clientY - anchorDragStartY;
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
                listener: function (event) {
                    var _a, _b;
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        var position_1 = initialDraggingAnchorPosition;
                        model.cursor = (_b = (_a = Model.getValueAt(slide, lane, position_1, view)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : model.cursor;
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
        var handle = SVG.makeSure(svg, {
            tag: "circle",
            class: "anchor-drag-handle",
            "pointer-events": "auto",
            events: {
                pointerdown: {
                    listener: function (event) {
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
        var position = Model.getPositionAt(slide, lane, model.cursor, view);
        if (0 <= position && position <= UI.rulerSvg.viewBox.baseVal.height) {
            //const color = "red";
            SVG.setAttributes(line, {
                visibility: "visible",
                x1: 0,
                y1: position,
                x2: svg.viewBox.baseVal.width - (handleRadius * 2),
                y2: position,
                stroke: color,
                "stroke-width": config_json_5.default.render.ruler.lineWidth,
            });
            SVG.setAttributes(handle, {
                cx: svg.viewBox.baseVal.width - handleRadius,
                cy: position,
                r: handleRadius,
                fill: color,
            });
        }
        else {
            SVG.setAttributes(line, {
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
    var drawMenuLane = function (_view) {
        var laneIndex = Model.getAllLaneCount();
        var left = (0, exports.getLeftOfLane)(laneIndex);
        UI.rulerNewSlidePanel.style.left = "".concat(left, "px");
        UI.rulerHelpPanel.style.left = "".concat(UI.rulerNewSlidePanel.clientWidth + left, "px");
    };
    exports.drawMenuLane = drawMenuLane;
    var resize = function () {
        var attributes = {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            viewBox: "0 0 ".concat(document.body.clientWidth, " ").concat(document.body.clientHeight),
        };
        SVG.setAttributes(UI.rulerSvg, attributes);
        SVG.setAttributes(UI.rulerOverlay, attributes);
    };
    exports.resize = resize;
    var getRulerWidth = function () { return exports.LaneWidths.reduce(function (a, b) { return a + b; }, 0); };
    exports.getRulerWidth = getRulerWidth;
    var initialize = function () {
        (0, exports.resize)();
    };
    exports.initialize = initialize;
});
define("script/json-eval-updater", ["require", "exports", "script/url", "script/type", "script/time", "script/ui", "script/model", "script/view", "script/ruler", "script/render", "resource/config"], function (require, exports, Url, Type, Time, UI, Model, View, Ruler, Render, config_json_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.saveJson = exports.updateJsonWithEval = exports.roundE = exports.frequencyToEV = exports.frequencyToWaveLength = exports.waveLengthToFrequency = exports.nestEvalUpdate = exports.dummy = void 0;
    Url = __importStar(Url);
    Type = __importStar(Type);
    Time = __importStar(Time);
    UI = __importStar(UI);
    Model = __importStar(Model);
    View = __importStar(View);
    Ruler = __importStar(Ruler);
    Render = __importStar(Render);
    config_json_6 = __importDefault(config_json_6);
    exports.dummy = {
        Url: Url,
        Type: Type,
        Time: Time,
        UI: UI,
        Model: Model,
        View: View,
        Event: Event,
        Ruler: Ruler,
        Render: Render,
        config: config_json_6.default
    };
    var nestEvalUpdate = function (obj, getList, updater, getChild) {
        var list = getList(obj);
        if (list !== undefined) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var i = list_1[_i];
                var child = getChild(i);
                if (child !== undefined) {
                    (0, exports.nestEvalUpdate)(child, getList, updater, getChild);
                }
                updater(i);
            }
        }
        return obj;
    };
    exports.nestEvalUpdate = nestEvalUpdate;
    var waveLengthToFrequency = function (wavelength) {
        return "number" === typeof wavelength ? 299792458 / wavelength : wavelength;
    };
    exports.waveLengthToFrequency = waveLengthToFrequency;
    var frequencyToWaveLength = function (frequency) {
        return "number" === typeof frequency ? 299792458 / frequency : frequency;
    };
    exports.frequencyToWaveLength = frequencyToWaveLength;
    var frequencyToEV = function (frequency) {
        return "number" === typeof frequency ? 4.135667662e-15 * frequency : frequency;
    };
    exports.frequencyToEV = frequencyToEV;
    var roundE = function (value, exponent) {
        if (exponent === void 0) { exponent = -6; }
        var factor = Math.pow(10, -exponent);
        return Math.round(value * factor) / factor;
    };
    exports.roundE = roundE;
    var updateJsonWithEval = function (json, path) {
        // console.log(`Updating JSON with eval: ${path ?? "root"}`);
        if ("object" === typeof json && null !== json) {
            if (Array.isArray(json)) {
                // console.log(`Processing array at ${path ?? "root"} with length ${json.length}`);
                return json.map(function (item, index) { return (0, exports.updateJsonWithEval)(item, "".concat(path !== null && path !== void 0 ? path : "", "[").concat(index, "]")); });
            }
            else {
                // console.log(`Processing object at ${path ?? "root"} with keys: ${Object.keys(json).join(", ")}`);
                var result = {};
                for (var _i = 0, _a = Object.keys(json); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = json[key];
                    result[key] = (0, exports.updateJsonWithEval)(value, "".concat(path !== null && path !== void 0 ? path : "", ".").concat(key));
                }
                if ("$source-eval" in result) {
                    var source = result["$source-eval"];
                    if ("object" === typeof source && null !== source && !Array.isArray(source)) {
                        for (var _b = 0, _c = Object.keys(source); _b < _c.length; _b++) {
                            var key = _c[_b];
                            var currentPath = "".concat(path !== null && path !== void 0 ? path : "", ".$source-eval.").concat(key);
                            var value = source[key];
                            if ("string" === typeof value) {
                                try {
                                    var evalResult = eval(value);
                                    if (!currentPath.startsWith("$SILENT")) {
                                        console.log("Evaluated ".concat(currentPath, ": ").concat(value, " =>"), evalResult);
                                    }
                                    result[key] = evalResult;
                                }
                                catch (error) {
                                    console.error("Error evaluating ".concat(currentPath, ": ").concat(value), error);
                                }
                            }
                            else {
                                console.warn("Invalid ".concat(currentPath, " value: ").concat(value));
                            }
                        }
                    }
                    else {
                        console.warn("Invalid ".concat(path !== null && path !== void 0 ? path : "", ".$source-eval value: ").concat(source));
                    }
                }
                return result;
            }
        }
        return json;
    };
    exports.updateJsonWithEval = updateJsonWithEval;
    var saveJson = function (json) {
        var _a;
        var filename = (_a = json["$file-name"]) !== null && _a !== void 0 ? _a : "updated.json";
        var blob = new Blob([JSON.stringify(json, null, 4)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    exports.saveJson = saveJson;
});
define("resource/constant/size", [], {
    "$file-name": "size.json",
    "label": {
        "en": "Size",
        "ja": "サイズ"
    },
    "unit": {
        "en": "meter",
        "ja": "メートル"
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
            "value": 0.3048,
            "label": {
                "en": "1 foot",
                "ja": "1 フィート"
            },
            "priority": 1
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
            "priority": 1
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
define("resource/constant/mass", [], {
    "$file-name": "mass.json",
    "label": {
        "en": "Mass",
        "ja": "質量"
    },
    "unit": {
        "en": "gram",
        "ja": "グラム"
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
            "value": 7.34767309e25,
            "label": {
                "en": "Moon mass",
                "ja": "月の質量"
            },
            "priority": 2
        },
        {
            "value": 5.9722e27,
            "label": {
                "en": "Earth mass",
                "ja": "地球の質量"
            },
            "priority": 1
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
    "label": "Time",
    "unit": "second",
    "ticks": [
        {
            "value": 5.391246366844893e-44,
            "label": "planck time",
            "priority": 0,
            "$source-eval": {
                "value": "1.616255e-35 /299792458"
            }
        },
        {
            "value": 1e-21,
            "label": "typical particle interaction time",
            "priority": 1
        },
        {
            "value": 1e-9,
            "label": "typical atomic process time",
            "priority": 1
        },
        {
            "value": 0.001,
            "label": "typical human reaction time",
            "priority": 1
        },
        {
            "value": 0.01,
            "label": "typical blink duration",
            "priority": 1
        },
        {
            "value": 0.1,
            "label": "typical heartbeat duration",
            "priority": 1
        },
        {
            "value": 60,
            "label": "1 minute",
            "priority": 1
        },
        {
            "value": 3600,
            "label": "1 hour",
            "priority": 1,
            "$source-eval": {
                "value": "60 *60"
            }
        },
        {
            "value": 86400,
            "label": "1 day",
            "priority": 1,
            "$source-eval": {
                "value": "24 *60 *60"
            }
        },
        {
            "value": 31556926.08,
            "label": "1 Gregorian year = 365.2422 days",
            "priority": 1,
            "$source-eval": {
                "value": "roundE(config.time.gregorianYearLength *24 *60 *60)",
                "label": "`1 Gregorian year = ${config.time.gregorianYearLength} days`"
            }
        },
        {
            "value": 31557600,
            "label": "1 Julian year = 365.25 days",
            "priority": 0,
            "$source-eval": {
                "value": "roundE(config.time.julianYearLength *24 *60 *60)",
                "label": "`1 Julian year = ${config.time.julianYearLength} days`"
            }
        },
        {
            "value": 31557600000,
            "label": "1000 years",
            "priority": 1,
            "$source-eval": {
                "value": "roundE(1000 *config.time.julianYearLength *24 *60 *60)"
            }
        },
        {
            "value": 31557600000000,
            "label": "1 million years",
            "priority": 1,
            "$source-eval": {
                "value": "roundE(1000 *1000 *config.time.julianYearLength *24 *60 *60)"
            }
        },
        {
            "value": 435494880000000000,
            "label": "age of the universe",
            "priority": 1
        }
    ],
    "areas": []
});
define("resource/constant/speed", [], {
    "$file-name": "speed.json",
    "label": "Speed",
    "unit": "m/s",
    "ticks": [
        {
            "value": 1.1126500560536185e-17,
            "label": "1 / c²",
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
            "label": "c²",
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
        "en": "joule",
        "ja": "ジュール"
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
            "value": 1.602176634e-19,
            "label": {
                "en": "electronvolt = 1 eV",
                "ja": "電子ボルト = 1 eV"
            },
            "priority": 1
        },
        {
            "value": 1.0,
            "label": {
                "en": "typical chemical reaction energy",
                "ja": "典型的な化学反応のエネルギー"
            },
            "priority": 2
        },
        {
            "value": 4.184,
            "label": {
                "en": "thermochemical calorie = 1 cal",
                "ja": "熱化学カロリー = 1 cal"
            },
            "priority": 0
        },
        {
            "value": 1.0e6,
            "label": {
                "en": "typical nuclear reaction energy",
                "ja": "典型的な核反応のエネルギー"
            },
            "priority": 2
        },
        {
            "value": 1.9561e9,
            "label": {
                "en": "Planck energy",
                "ja": "プランクエネルギー"
            },
            "priority": 0
        },
        {
            "value": 8.9875517923e16,
            "label": {
                "en": "mass-energy equivalence of 1 kg",
                "ja": "1 kgの質量エネルギー等価"
            },
            "priority": 1,
            "$source-eval": {
                "value": "299792458 ** 2"
            }
        }
    ],
    "areas": []
});
define("resource/constant/temperature", [], {
    "$file-name": "temperature.json",
    "label": "Temperature",
    "unit": "kelvin",
    "ticks": [
        {
            "value": 9.5e-10,
            "label": "melting point of helium",
            "priority": 2
        },
        {
            "value": 4.22,
            "label": "boiling point of helium",
            "priority": 2
        },
        {
            "value": 14.01,
            "label": "melting point of hydrogen",
            "priority": 2
        },
        {
            "value": 20.28,
            "label": "boiling point of hydrogen",
            "priority": 2
        },
        {
            "value": 255.35,
            "label": "0 °F",
            "priority": 2
        },
        {
            "value": 273.15,
            "label": "freezing point of water = 0 °C",
            "priority": 0
        },
        {
            "value": 310.98,
            "label": "100 °F",
            "priority": 2
        },
        {
            "value": 373.15,
            "label": "boiling point of water = 100 °C",
            "priority": 1
        },
        {
            "value": 5.8e3,
            "label": "surface of the sun",
            "priority": 2
        },
        {
            "value": 1.42e32,
            "label": "planck temperature",
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
        "en": "count",
        "ja": "個"
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
define("resource/constant/emw-wavelength", [], {
    "$file-name": "emw-wavelength.json",
    "label": {
        "en": "EMW Wavelength",
        "ja": "電磁波の波長"
    },
    "unit": "m",
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
        "en": "hertz",
        "ja": "ヘルツ"
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
    "unit": "eV",
    "x-$source-eval": {
        "ticks": "constant.emwFrequency.ticks.map(tick => ({...tick, value: frequencyToEV(tick.value)}))",
        "areas": "nestEvalUpdate(JSON.parse(JSON.stringify(constant.emwFrequency.areas)), areas => areas, area => { area.lowerBound = frequencyToEV(area.lowerBound); area.upperBound = frequencyToEV(area.upperBound); return area; }, area => area.details)"
    },
    "ticks": [
        {
            "value": 0.0000101323857719,
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
            "upperBound": 0.000001239841973862093,
            "label": {
                "en": "radio waves",
                "ja": "電波"
            },
            "fill": "oklch(60% 0.6 15deg / 0.125)",
            "details": [
                {
                    "lowerBound": null,
                    "upperBound": 1.239841973862093e-14,
                    "fill": "oklch(60% 0.6 15deg / 0.125)"
                },
                {
                    "lowerBound": 1.239841973862093e-14,
                    "upperBound": 1.2398419738620932e-13,
                    "label": {
                        "en": "ELF: extremely low frequency",
                        "ja": "ELF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 60deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419738620932e-13,
                    "upperBound": 1.2398419738620931e-12,
                    "label": {
                        "en": "SLF: super low frequency",
                        "ja": "SLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419738620931e-12,
                    "upperBound": 1.2398419738620931e-11,
                    "label": {
                        "en": "ULF: ultra low frequency",
                        "ja": "ULF: 極低周波"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419738620931e-11,
                    "upperBound": 1.2398419738620932e-10,
                    "label": {
                        "en": "VLF: very low frequency",
                        "ja": "VLF: 超低周波"
                    },
                    "fill": "oklch(60% 0.6 150deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419738620932e-10,
                    "upperBound": 1.239841973862093e-9,
                    "label": {
                        "en": "LF: low frequency",
                        "ja": "LF: 低周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 1.239841973862093e-9,
                    "upperBound": 1.2398419738620931e-8,
                    "label": {
                        "en": "MF: medium frequency",
                        "ja": "MF: 中周波"
                    },
                    "fill": "oklch(60% 0.6 210deg / 0.25)"
                },
                {
                    "lowerBound": 1.2398419738620931e-8,
                    "upperBound": 1.239841973862093e-7,
                    "label": {
                        "en": "HF: high frequency",
                        "ja": "HF: 高周波"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.25)"
                },
                {
                    "lowerBound": 1.239841973862093e-7,
                    "upperBound": 0.000001239841973862093,
                    "label": {
                        "en": "VHF: very high frequency",
                        "ja": "VHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 0.000001239841973862093,
            "upperBound": 0.0012398419738620932,
            "label": {
                "en": "microwaves",
                "ja": "マイクロ波"
            },
            "fill": "oklch(60% 0.6 60deg / 0.25)",
            "details": [
                {
                    "lowerBound": 0.000001239841973862093,
                    "upperBound": 0.000012398419738620931,
                    "label": {
                        "en": "UHF: ultra high frequency",
                        "ja": "UHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 90deg / 0.25)"
                },
                {
                    "lowerBound": 0.000012398419738620931,
                    "upperBound": 0.00012398419738620932,
                    "label": {
                        "en": "SHF: super high frequency",
                        "ja": "SHF: 超高周波"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.25)"
                },
                {
                    "lowerBound": 0.00012398419738620932,
                    "upperBound": 0.0012398419738620932,
                    "label": {
                        "en": "EHF: extremely high frequency",
                        "ja": "EHF: 極超高周波"
                    },
                    "fill": "oklch(60% 0.6 270deg / 0.25)"
                }
            ]
        },
        {
            "lowerBound": 0.0012398419738620932,
            "upperBound": 1.6313710182395962,
            "label": {
                "en": "infrared",
                "ja": "赤外線"
            },
            "fill": "oklch(60% 0.6 90deg / 0.3)",
            "details": [
                {
                    "lowerBound": 0.0012398419738620932,
                    "upperBound": 0.3099604934655233,
                    "label": {
                        "en": "FIR: far infrared",
                        "ja": "FIR: 遠赤外線"
                    },
                    "fill": "oklch(60% 0.6 120deg / 0.3)"
                },
                {
                    "lowerBound": 0.3099604934655233,
                    "upperBound": 0.4959367895448372,
                    "label": {
                        "en": "MIR: mid infrared",
                        "ja": "MIR: 中赤外線"
                    },
                    "fill": "oklch(60% 0.6 180deg / 0.3)"
                },
                {
                    "lowerBound": 0.4959367895448372,
                    "upperBound": 1.6313710182395962,
                    "label": {
                        "en": "NIR: near infrared",
                        "ja": "NIR: 近赤外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 1.6313710182395962,
            "upperBound": 3.2627420364791924,
            "label": {
                "en": "visible light",
                "ja": "可視光"
            },
            "fill": "oklch(60% 0.6 150deg / 0.25)",
            "details": [
                {
                    "lowerBound": 1.6313710182395962,
                    "upperBound": 1.9837471581793489,
                    "label": {
                        "en": "red light",
                        "ja": "赤色光"
                    },
                    "fill": "#ff000066"
                },
                {
                    "lowerBound": 1.9837471581793489,
                    "upperBound": 2.101427074342531,
                    "label": {
                        "en": "orange light",
                        "ja": "オレンジ光"
                    },
                    "fill": "#ff800066"
                },
                {
                    "lowerBound": 2.101427074342531,
                    "upperBound": 2.1944105732072448,
                    "label": {
                        "en": "yellow light",
                        "ja": "黄色光"
                    },
                    "fill": "#ffff0066"
                },
                {
                    "lowerBound": 2.1944105732072448,
                    "upperBound": 2.4796839477241863,
                    "label": {
                        "en": "green light",
                        "ja": "緑色光"
                    },
                    "fill": "#00ff0066"
                },
                {
                    "lowerBound": 2.4796839477241863,
                    "upperBound": 2.5563752038393672,
                    "label": {
                        "en": "cyan light",
                        "ja": "シアン光"
                    },
                    "fill": "#00ffff66"
                },
                {
                    "lowerBound": 2.5563752038393672,
                    "upperBound": 2.755204386360207,
                    "label": {
                        "en": "blue light",
                        "ja": "青色光"
                    },
                    "fill": "#0000ff66"
                },
                {
                    "lowerBound": 2.755204386360207,
                    "upperBound": 3.2627420364791924,
                    "label": {
                        "en": "violet light",
                        "ja": "紫色光"
                    },
                    "fill": "#8b00ff66"
                }
            ]
        },
        {
            "lowerBound": 3.2627420364791924,
            "upperBound": 123.98419738620932,
            "label": {
                "en": "ultraviolet",
                "ja": "紫外線"
            },
            "fill": "oklch(60% 0.6 270deg / 0.3)",
            "details": [
                {
                    "lowerBound": 3.2627420364791924,
                    "upperBound": 6.199209869310466,
                    "label": {
                        "en": "NUV: near ultraviolet",
                        "ja": "NUV: 近紫外線"
                    },
                    "fill": "oklch(60% 0.6 240deg / 0.3)",
                    "details": [
                        {
                            "lowerBound": 3.2627420364791924,
                            "upperBound": 3.9360062662288673,
                            "label": {
                                "en": "UV-A: ultraviolet A",
                                "ja": "UV-A: 紫外線A"
                            },
                            "fill": "oklch(60% 0.6 150deg / 0.3)"
                        },
                        {
                            "lowerBound": 3.9360062662288673,
                            "upperBound": 4.4280070495074755,
                            "label": {
                                "en": "UV-B: ultraviolet B",
                                "ja": "UV-B: 紫外線B"
                            },
                            "fill": "oklch(60% 0.6 180deg / 0.3)"
                        },
                        {
                            "lowerBound": 4.4280070495074755,
                            "upperBound": 6.199209869310466,
                            "label": {
                                "en": "UV-C: ultraviolet C",
                                "ja": "UV-C: 紫外線C"
                            },
                            "fill": "oklch(60% 0.6 210deg / 0.3)"
                        }
                    ]
                },
                {
                    "lowerBound": 6.199209869310466,
                    "upperBound": 123.98419738620932,
                    "label": {
                        "en": "VUV: vacuum ultraviolet",
                        "ja": "VUV: 真空紫外線"
                    },
                    "fill": "oklch(60% 0.6 300deg / 0.3)"
                }
            ]
        },
        {
            "lowerBound": 123.98419738620932,
            "upperBound": 123984.19738620931,
            "label": {
                "en": "X-rays",
                "ja": "X線"
            },
            "fill": "oklch(60% 0.6 285deg / 0.25)"
        },
        {
            "lowerBound": 123984.19738620931,
            "upperBound": 7.6710789687400385e+28,
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
    "unit": "second",
    "ticks": [
        {
            "value": 4.35494816e17,
            "eval": "",
            "label": "1 CE",
            "label[jp]": "紀元１年",
            "priority": 1
        },
        {
            "value": 4.3549481921e17,
            "label": "100 CE",
            "label[jp]": "紀元100年",
            "priority": 4
        },
        {
            "value": 4.3549482237e17,
            "label": "200 CE",
            "label[jp]": "紀元200年",
            "priority": 4
        },
        {
            "value": 4.3549482553e17,
            "label": "300 CE",
            "label[jp]": "紀元300年",
            "priority": 4
        },
        {
            "value": 4.3549482868e17,
            "label": "400 CE",
            "label[jp]": "紀元400年",
            "priority": 4
        },
        {
            "value": 4.3549483145e17,
            "label": "500 CE",
            "label[jp]": "紀元500年",
            "priority": 3
        },
        {
            "value": 4.3549483499e17,
            "label": "600 CE",
            "label[jp]": "紀元600年",
            "priority": 4
        },
        {
            "value": 4.3549483815e17,
            "label": "700 CE",
            "label[jp]": "紀元700年",
            "priority": 4
        },
        {
            "value": 4.3549484130e17,
            "label": "800 CE",
            "label[jp]": "紀元800年",
            "priority": 4
        },
        {
            "value": 4.3549484446e17,
            "label": "900 CE",
            "label[jp]": "紀元900年",
            "priority": 4
        },
        {
            "value": 4.3549484762e17,
            "label": "1000 CE",
            "label[jp]": "紀元1000年",
            "priority": 2
        },
        {
            "value": 4.3549485077e17,
            "label": "1100 CE",
            "label[jp]": "紀元1100年",
            "priority": 4
        },
        {
            "value": 4.3549485393e17,
            "label": "1200 CE",
            "label[jp]": "紀元1200年",
            "priority": 4
        },
        {
            "value": 4.3549485708e17,
            "label": "1300 CE",
            "label[jp]": "紀元1300年",
            "priority": 4
        },
        {
            "value": 4.3549486024e17,
            "label": "1400 CE",
            "label[jp]": "紀元1400年",
            "priority": 4
        },
        {
            "value": 4.3549486339e17,
            "label": "1500 CE",
            "label[jp]": "紀元1500年",
            "priority": 2
        },
        {
            "value": 4.3549486655e17,
            "label": "1600 CE",
            "label[jp]": "紀元1600年",
            "priority": 4
        },
        {
            "value": 4.3549486971e17,
            "label": "1700 CE",
            "label[jp]": "紀元1700年",
            "priority": 4
        },
        {
            "value": 4.3549487286e17,
            "label": "1800 CE",
            "label[jp]": "紀元1800年",
            "priority": 4
        },
        {
            "value": 4.3549487602e17,
            "label": "1900 CE",
            "label[jp]": "紀元1900年",
            "priority": 3
        },
        {
            "label": "BP 0 = 1950 CE",
            "label[jp]": "BP基準年(1950年)",
            "value": 4.3549488e17,
            "priority": 0
        },
        {
            "value": 4.3549487917e17,
            "label": "2000 CE",
            "label[jp]": "西暦2000年",
            "priority": 1
        },
        {
            "value": 4.3549487933e17,
            "label": "2005 CE",
            "label[jp]": "西暦2005年",
            "priority": 3
        },
        {
            "value": 4.3549487949e17,
            "label": "2010 CE",
            "label[jp]": "西暦2010年",
            "priority": 3
        },
        {
            "value": 4.3549487964e17,
            "label": "2015 CE",
            "label[jp]": "西暦2015年",
            "priority": 3
        },
        {
            "value": 4.3549487980e17,
            "label": "2020 CE",
            "label[jp]": "西暦2020年",
            "priority": 3
        },
        {
            "value": 4.3549487996e17,
            "label": "2025 CE",
            "label[jp]": "西暦2025年",
            "priority": 2
        },
        {
            "value": 4.3549487999e17,
            "label": "2026 CE",
            "label[jp]": "西暦2026年",
            "priority": 2
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
            "upperBound": 1.0e-36,
            "label": "Grand unification epoch",
            "fill": "oklch(60% 0.6 90deg / 0.25)"
        },
        {
            "lowerBound": 1.0e-36,
            "upperBound": 1.0e-12,
            "label": "Inflationary epoch",
            "fill": "oklch(60% 0.6 75deg / 0.25)"
        },
        {
            "lowerBound": 1.0e-12,
            "upperBound": 1.0e-6,
            "label": "Quark epoch",
            "fill": "oklch(60% 0.6 120deg / 0.25)"
        },
        {
            "lowerBound": 1.0e-6,
            "upperBound": 1.0,
            "label": "Hadron epoch",
            "fill": "oklch(60% 0.6 165deg / 0.25)"
        },
        {
            "lowerBound": 1.0,
            "upperBound": 10.0,
            "label": "Lepton epoch",
            "fill": "oklch(60% 0.6 210deg / 0.25)"
        },
        {
            "lowerBound": 10.0,
            "upperBound": 1.166832e+13,
            "label": "Photon epoch",
            "fill": "oklch(60% 0.6 255deg / 0.25)"
        },
        {
            "lowerBound": 2.903e17,
            "upperBound": 4.3549488e17,
            "label": "Earth history",
            "label[jp]": "地球の歴史",
            "fill": "oklch(60% 0.6 300deg / 0.25)",
            "details": [
                {
                    "lowerBound": 2.903e17,
                    "upperBound": 4.1849e17,
                    "label": "Precambrian",
                    "label[jp]": "先カンブリア時代",
                    "fill": "#cfcf0066",
                    "details": [
                        {
                            "lowerBound": 2.903e17,
                            "upperBound": 3.093e17,
                            "label": "Hadean Eon",
                            "label[jp]": "冥王代",
                            "fill": "oklch(60% 0.6 150deg / 0.25)"
                        },
                        {
                            "lowerBound": 3.093e17,
                            "upperBound": 3.566e17,
                            "label": "Archean Eon",
                            "label[jp]": "太古代",
                            "fill": "oklch(60% 0.6 210deg / 0.25)"
                        },
                        {
                            "lowerBound": 3.566e17,
                            "upperBound": 4.1849e17,
                            "label": "Proterozoic Eon",
                            "label[jp]": "原生代",
                            "fill": "oklch(60% 0.6 300deg / 0.25)"
                        }
                    ]
                },
                {
                    "lowerBound": 4.1849e17,
                    "upperBound": 4.3549488e17,
                    "label": "Phanerozoic",
                    "label[jp]": "顕生代",
                    "fill": "oklch(60% 0.6 270deg / 0.25)",
                    "details": [
                        {
                            "lowerBound": 4.1849e17,
                            "upperBound": 4.2754e17,
                            "label": "Paleozoic Era",
                            "label[jp]": "古生代",
                            "fill": "#00ff0066",
                            "details": [
                                {
                                    "lowerBound": 4.1849e17,
                                    "upperBound": 4.2018e17,
                                    "label": "Cambrian Period",
                                    "label[jp]": "カンブリア紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 4.2018e17,
                                    "upperBound": 4.2149e17,
                                    "label": "Ordovician Period",
                                    "label[jp]": "オルドビス紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 4.2149e17,
                                    "upperBound": 4.2227e17,
                                    "label": "Silurian Period",
                                    "label[jp]": "シルル紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 4.2227e17,
                                    "upperBound": 4.2417e17,
                                    "label": "Devonian Period",
                                    "label[jp]": "デボン紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 4.2417e17,
                                    "upperBound": 4.2606e17,
                                    "label": "Carboniferous Period",
                                    "label[jp]": "石炭紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 4.2606e17,
                                    "upperBound": 4.2754e17,
                                    "label": "Permian Period",
                                    "label[jp]": "ペルム紀",
                                    "fill": "#cfcf0066"
                                }
                            ]
                        },
                        {
                            "lowerBound": 4.2754e17,
                            "upperBound": 4.3341e17,
                            "label": "Mesozoic Era",
                            "label[jp]": "中生代",
                            "fill": "#7fff0066",
                            "details": [
                                {
                                    "lowerBound": 4.2754e17,
                                    "upperBound": 4.2914e17,
                                    "label": "Triassic Period",
                                    "label[jp]": "三畳紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 4.2914e17,
                                    "upperBound": 4.3092e17,
                                    "label": "Jurassic Period",
                                    "label[jp]": "ジュラ紀",
                                    "fill": "#00ff0066"
                                },
                                {
                                    "lowerBound": 4.3092e17,
                                    "upperBound": 4.3341e17,
                                    "label": "Cretaceous Period",
                                    "label[jp]": "白亜紀",
                                    "fill": "#7fff0066"
                                }
                            ]
                        },
                        {
                            "lowerBound": 4.3341e17,
                            "upperBound": 4.3549488e17,
                            "label": "Cenozoic Era",
                            "label[jp]": "新生代",
                            "fill": "#cfcf0066",
                            "details": [
                                {
                                    "lowerBound": 4.3341e17,
                                    "upperBound": 4.3477e17,
                                    "label": "Paleogene Period",
                                    "label[jp]": "古第三紀",
                                    "fill": "#00ffff66"
                                },
                                {
                                    "lowerBound": 4.3477e17,
                                    "upperBound": 4.3541e17,
                                    "label": "Neogene Period",
                                    "label[jp]": "新第三紀",
                                    "fill": "#7fff0066"
                                },
                                {
                                    "lowerBound": 4.3541e17,
                                    "upperBound": 4.3549488e17,
                                    "label": "Quaternary Period",
                                    "label[jp]": "第四紀",
                                    "fill": "#00ff0066"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "lowerBound": 4.3549488e17,
            "upperBound": null,
            "label": "Future",
            "fill": "oklch(60% 0.6 300deg / 0.125)"
        }
    ]
});
define("script/command", ["require", "exports", "script/locale", "script/url", "script/ui", "script/model", "script/view", "script/render", "script/json-eval-updater", "resource/constant/size", "resource/constant/mass", "resource/constant/time", "resource/constant/speed", "resource/constant/energy", "resource/constant/temperature", "resource/constant/counting", "resource/constant/emw-wavelength", "resource/constant/emw-frequency", "resource/constant/emw-energy", "resource/constant/history"], function (require, exports, Locale, Url, UI, Model, View, Render, JsonEvalUpdater, size_json_1, mass_json_1, time_json_1, speed_json_1, energy_json_1, temperature_json_1, counting_json_1, emw_wavelength_json_1, emw_frequency_json_1, emw_energy_json_1, history_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.updateLanguage = exports.addHistoryLane = exports.addEmwEnergyLane = exports.addEmwFrequencyLane = exports.addEmwWavelengthLane = exports.addCountingLane = exports.addTemperatureLane = exports.addEnergyLane = exports.addSpeedLane = exports.addTimeLane = exports.addMassLane = exports.addSizeLane = exports.AddConstantLane = exports.addLane = exports.addSlide = void 0;
    Locale = __importStar(Locale);
    Url = __importStar(Url);
    UI = __importStar(UI);
    Model = __importStar(Model);
    View = __importStar(View);
    Render = __importStar(Render);
    JsonEvalUpdater = __importStar(JsonEvalUpdater);
    size_json_1 = __importDefault(size_json_1);
    mass_json_1 = __importDefault(mass_json_1);
    time_json_1 = __importDefault(time_json_1);
    speed_json_1 = __importDefault(speed_json_1);
    energy_json_1 = __importDefault(energy_json_1);
    temperature_json_1 = __importDefault(temperature_json_1);
    counting_json_1 = __importDefault(counting_json_1);
    emw_wavelength_json_1 = __importDefault(emw_wavelength_json_1);
    emw_frequency_json_1 = __importDefault(emw_frequency_json_1);
    emw_energy_json_1 = __importDefault(emw_energy_json_1);
    history_json_1 = __importDefault(history_json_1);
    var constant = {};
    var addSlide = function () {
        var _a, _b;
        var _c = Model.getLastSlideAndLastLane(), lastSlide = _c.slide, lastLane = _c.lane;
        var lastValue = (_b = (_a = Model.getCursorValue(lastSlide, lastLane, View.data)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 1;
        var slide = Model.makeSlide(lastValue);
        slide.lanes.push(Model.makeLane({
            type: "logarithmic",
        }));
        Model.data.slides.push(slide);
        Render.markDirty();
    };
    exports.addSlide = addSlide;
    var addLane = function (laneSeed) {
        var slide = Model.getLastSlideAndLastLane().slide;
        var lane = Model.makeLane(laneSeed);
        slide.lanes.push(lane);
        Render.markDirty();
    };
    exports.addLane = addLane;
    var AddConstantLane = function (constant) { return (0, exports.addLane)({
        name: constant.label,
        type: "constant",
        table: constant,
    }); };
    exports.AddConstantLane = AddConstantLane;
    var addSizeLane = function () { return (0, exports.AddConstantLane)(constant["size"]); };
    exports.addSizeLane = addSizeLane;
    var addMassLane = function () { return (0, exports.AddConstantLane)(constant["mass"]); };
    exports.addMassLane = addMassLane;
    var addTimeLane = function () { return (0, exports.AddConstantLane)(constant["time"]); };
    exports.addTimeLane = addTimeLane;
    var addSpeedLane = function () { return (0, exports.AddConstantLane)(constant["speed"]); };
    exports.addSpeedLane = addSpeedLane;
    var addEnergyLane = function () { return (0, exports.AddConstantLane)(constant["energy"]); };
    exports.addEnergyLane = addEnergyLane;
    var addTemperatureLane = function () { return (0, exports.AddConstantLane)(constant["temperature"]); };
    exports.addTemperatureLane = addTemperatureLane;
    var addCountingLane = function () { return (0, exports.AddConstantLane)(constant["counting"]); };
    exports.addCountingLane = addCountingLane;
    var addEmwWavelengthLane = function () { return (0, exports.AddConstantLane)(constant["emw-wavelength"]); };
    exports.addEmwWavelengthLane = addEmwWavelengthLane;
    var addEmwFrequencyLane = function () { return (0, exports.AddConstantLane)(constant["emw-frequency"]); };
    exports.addEmwFrequencyLane = addEmwFrequencyLane;
    var addEmwEnergyLane = function () { return (0, exports.AddConstantLane)(constant["emw-energy"]); };
    exports.addEmwEnergyLane = addEmwEnergyLane;
    var addHistoryLane = function () { return (0, exports.AddConstantLane)(constant["history"]); };
    exports.addHistoryLane = addHistoryLane;
    var updateLanguage = function (language) {
        Locale.setLocale(language, Url.get("locale"));
        UI.updateLanguage();
        Render.markDirty();
    };
    exports.updateLanguage = updateLanguage;
    var initialize = function () {
        constant["size"] = JsonEvalUpdater.updateJsonWithEval(size_json_1.default, "$SILENT");
        constant["mass"] = JsonEvalUpdater.updateJsonWithEval(mass_json_1.default, "$SILENT");
        constant["time"] = JsonEvalUpdater.updateJsonWithEval(time_json_1.default, "$SILENT");
        constant["speed"] = JsonEvalUpdater.updateJsonWithEval(speed_json_1.default, "$SILENT");
        constant["energy"] = JsonEvalUpdater.updateJsonWithEval(energy_json_1.default, "$SILENT");
        constant["temperature"] = JsonEvalUpdater.updateJsonWithEval(temperature_json_1.default, "$SILENT");
        constant["counting"] = JsonEvalUpdater.updateJsonWithEval(counting_json_1.default, "$SILENT");
        constant["emw-wavelength"] = JsonEvalUpdater.updateJsonWithEval(emw_wavelength_json_1.default, "$SILENT");
        constant["emw-frequency"] = JsonEvalUpdater.updateJsonWithEval(emw_frequency_json_1.default, "$SILENT");
        constant["emw-energy"] = JsonEvalUpdater.updateJsonWithEval(emw_energy_json_1.default, "$SILENT");
        constant["history"] = JsonEvalUpdater.updateJsonWithEval(history_json_1.default, "$SILENT");
        (0, exports.updateLanguage)("Auto");
    };
    exports.initialize = initialize;
});
define("script/environment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isApple = void 0;
    var isApple = function () { return /Mac|iPhone|iPad|iPod/.test(navigator.platform); };
    exports.isApple = isApple;
});
define("script/grid", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderer = void 0;
    var renderer = function (_model, _view, _dirty) {
    };
    exports.renderer = renderer;
});
define("script/graph", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderer = void 0;
    var renderer = function (_model, _view, _dirty) {
    };
    exports.renderer = renderer;
});
define("script/event", ["require", "exports", "script/type", "script/number", "script/environment", "script/view", "script/model", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph", "script/command", "resource/config"], function (require, exports, Type, Number, Environment, View, Model, UI, Render, Ruler, Grid, Graph, Command, config_json_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.bindCommandToButton = exports.resetZoom = exports.horizontalScroll = exports.verticalScroll = exports.shiftSlide = exports.zoomByRange = exports.zoom = exports.getZoomCenter = exports.zoomOut = exports.zoomIn = exports.updateViewScaleRoundBar = exports.getViewScaleExponentFromRate = exports.getViewScaleRate = exports.updateViewModeRoundBar = void 0;
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
    config_json_7 = __importDefault(config_json_7);
    var updateViewModeRoundBar = function () { return UI.updateRoundBar(UI.ControlPanel.viewModeButton, {
        low: 0 / Type.viewModeList.length,
        high: 1 / Type.viewModeList.length,
        rotate: Type.viewModeList.indexOf(View.getViewMode()) / Type.viewModeList.length,
    }); };
    exports.updateViewModeRoundBar = updateViewModeRoundBar;
    var getViewScaleRate = function () {
        return (View.data.viewScaleExponent - config_json_7.default.view.minZoomLevel) / (config_json_7.default.view.maxZoomLevel - config_json_7.default.view.minZoomLevel);
    };
    exports.getViewScaleRate = getViewScaleRate;
    var getViewScaleExponentFromRate = function (rate) {
        return config_json_7.default.view.minZoomLevel + (rate * (config_json_7.default.view.maxZoomLevel - config_json_7.default.view.minZoomLevel));
    };
    exports.getViewScaleExponentFromRate = getViewScaleExponentFromRate;
    var updateViewScaleRoundBar = function () {
        UI.updateRoundBar(UI.ControlPanel.viewScaleButton, {
            low: 0,
            high: (0, exports.getViewScaleRate)(),
            rotate: 0,
        });
        UI.ControlPanel.viewScaleRange.value = ((0, exports.getViewScaleRate)() * 100).toString();
    };
    exports.updateViewScaleRoundBar = updateViewScaleRoundBar;
    var zoomIn = function () {
        return (0, exports.zoom)(config_json_7.default.view.zooomUnit);
    };
    exports.zoomIn = zoomIn;
    var zoomOut = function () {
        return (0, exports.zoom)(-config_json_7.default.view.zooomUnit);
    };
    exports.zoomOut = zoomOut;
    var getZoomCenter = function (event) {
        var _a = Model.getRootSlideAndRootLane(), slide = _a.slide, lane = _a.lane;
        var cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data);
        if (undefined !== event) {
            var zoomCenter = event.clientY;
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
    var zoom = function (delta, event) {
        var _a;
        var current = View.data.viewScaleExponent;
        var next = Math.min(config_json_7.default.view.maxZoomLevel, Math.max(config_json_7.default.view.minZoomLevel, current + delta));
        var _b = Model.getRootSlideAndRootLane(), slide = _b.slide, lane = _b.lane;
        var zoomCenter = (0, exports.getZoomCenter)(event);
        // const cursorValues = Model.getCursorValues(View.data);
        var centerValue = (_a = Model.getValueAt(slide, lane, zoomCenter, View.data)) !== null && _a !== void 0 ? _a : (delta < 0 ? Number.MIN_VALUE : Number.MAX_VALUE);
        View.setViewScaleExponent(next);
        var temporaryCursorPosition = Model.getPositionAt(slide, lane, centerValue, View.data);
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
        console.log("Zoomed(".concat(delta, "): ").concat(current, " -> ").concat(next));
    };
    exports.zoom = zoom;
    var zoomByRange = function (value) {
        return (0, exports.zoom)((0, exports.getViewScaleExponentFromRate)(value * 0.01) - View.data.viewScaleExponent);
    };
    exports.zoomByRange = zoomByRange;
    var shiftSlide = function (event, slide, delta) {
        var _a, _b;
        var _c = Model.getAnchorSlideAndLane(slide), anchorSlide = _c.anchorSlide, anchorLane = _c.anchorLane;
        if (undefined === anchorSlide || undefined === anchorLane) {
            var current = Model.data.offset.y;
            var next = current - delta;
            var lane = slide.lanes[0];
            var halfWindowHeight = window.innerHeight / 2;
            var minPosition = ((_a = Model.getRawViewPositionAt(lane, Number.MIN_VALUE, View.data)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE) + halfWindowHeight;
            var maxPosition = ((_b = Model.getRawViewPositionAt(lane, Number.MAX_VALUE, View.data)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE) + halfWindowHeight;
            Model.data.offset.y = Math.min(maxPosition, Math.max(minPosition, next));
        }
        else {
            var currentPosition = Model.getPositionAt(anchorSlide, anchorLane, slide.anchor, View.data);
            var nextPosition = currentPosition - (delta + verticalSnapDelta);
            var snappedNextPosition = Ruler.snapVerticalPosition(event, View.data, nextPosition, Model.getSnapReferenceLaneIndex(slide));
            updateVerticalSnapDelta(snappedNextPosition - nextPosition);
            var nextValue = Model.getValueAt(anchorSlide, anchorLane, snappedNextPosition, View.data);
            if (undefined === nextValue) {
                console.warn("\uD83E\uDD8B FIXME: shiftSlide: nextValue is undefined, currentPosition=".concat(currentPosition, ", delta=").concat(delta));
            }
            else {
                slide.anchor = Number.clamp(nextValue.value);
            }
        }
    };
    exports.shiftSlide = shiftSlide;
    var verticalScroll = function (event, delta, slide) {
        if (slide === void 0) { slide = Model.getRootSlide(); }
        // Model.data.slides.forEach(slide => shiftSlide(slide, delta));
        (0, exports.shiftSlide)(event, slide, delta);
        Render.markDirty();
    };
    exports.verticalScroll = verticalScroll;
    var horizontalScroll = function (event, delta) {
        var current = Model.data.offset.x;
        var min = 0;
        var max = Math.max(0, Ruler.getRulerWidth() - (window.innerWidth - (UI.rulerNewSlidePanel.clientWidth + UI.rulerHelpPanel.clientWidth)));
        var next = Math.min(max, Math.max(min, current + delta - horizontalSnapDelta));
        var snappedPosition = Ruler.snapHorizontalPosition(event, next);
        updateHorizontalSnapDelta(snappedPosition - next);
        Model.data.offset.x = snappedPosition;
        Render.markDirty();
    };
    exports.horizontalScroll = horizontalScroll;
    var resetZoom = function () {
        var current = View.data.viewScaleExponent;
        var next = config_json_7.default.view.defaultZoomLevel;
        View.setViewScaleExponent(next);
        Render.markDirty();
        console.log("Zoom reset: ".concat(current, " -> ").concat(next));
    };
    exports.resetZoom = resetZoom;
    var touchZoomPreviousDistance = null;
    var verticalSnapDelta = 0;
    var updateVerticalSnapDelta = function (value) {
        return verticalSnapDelta = Math.min(Math.max(value, -32), 32);
    };
    var horizontalSnapDelta = 0;
    var updateHorizontalSnapDelta = function (value) {
        return horizontalSnapDelta = Math.min(Math.max(value, -200), 200);
    };
    var activeTouches = new Map();
    var bindCommandToButton = function (button, command) { return button.addEventListener("click", function (event) {
        event.preventDefault();
        command();
    }); };
    exports.bindCommandToButton = bindCommandToButton;
    var initialize = function () {
        console.log("Event initialized");
        window.addEventListener("resize", function () {
            Ruler.resize();
            (0, exports.horizontalScroll)("NOSNAP", 0);
            Render.markDirty();
        });
        window.addEventListener("wheel", function (event) {
            var _a, _b, _c, _d;
            if (Environment.isApple() ? (event.metaKey && event.ctrlKey) : (event.ctrlKey && event.altKey)) {
                event.preventDefault();
                var _e = Model.getRootSlideAndRootLane(), slide = _e.slide, lane = _e.lane;
                var cursorPosition = (_a = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _a !== void 0 ? _a : 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition - (-event.deltaY + verticalSnapDelta)));
                var newCursorPosition = (_b = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _b !== void 0 ? _b : 0;
                var cursorDelta = newCursorPosition - cursorPosition;
                (0, exports.verticalScroll)(event, cursorDelta, Model.getRootSlide());
            }
            else if (Environment.isApple() ? event.metaKey : event.ctrlKey) {
                event.preventDefault();
                (0, exports.zoom)(event.deltaY * config_json_7.default.view.zoomRate, event);
            }
            else if (Environment.isApple() ? event.ctrlKey : event.altKey) {
                event.preventDefault();
                var _f = Model.getRootSlideAndRootLane(), slide = _f.slide, lane = _f.lane;
                var cursorPosition = (_c = Model.getPositionAt(slide, lane, Model.data.cursor, View.data)) !== null && _c !== void 0 ? _c : 0;
                updateVerticalSnapDelta(Ruler.slideCursor(Model.data, View.data, event, cursorPosition - (event.deltaY + verticalSnapDelta)));
            }
            else {
                (0, exports.verticalScroll)(event, event.deltaY, Model.getSlideFromLane(Model.getLane((_d = Ruler.getLaneIndexFromPosition(event.clientX + Model.data.offset.x)) !== null && _d !== void 0 ? _d : 0)));
                (0, exports.horizontalScroll)(event, event.deltaX);
            }
        }, {
            passive: false,
        });
        window.addEventListener("keydown", function (event) {
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
                        console.log("Keydown event: key=".concat(event.key));
                        break;
                }
            }
            else {
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault();
                        (0, exports.verticalScroll)(event, -config_json_7.default.view.scrollUnit);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        (0, exports.verticalScroll)(event, config_json_7.default.view.scrollUnit);
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, config_json_7.default.view.scrollUnit);
                        break;
                    case "ArrowRight":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, -config_json_7.default.view.scrollUnit);
                        break;
                    default:
                        console.log("Keydown event: key=".concat(event.key));
                        break;
                }
            }
        });
        UI.viewList.addEventListener("pointerdown", function (event) {
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
        UI.viewList.addEventListener("pointerup", function (event) {
            //if ("touch" === event.pointerType)
            //{
            activeTouches.delete(event.pointerId);
            touchZoomPreviousDistance = null;
            //}
        }, {
            passive: false,
        });
        UI.viewList.addEventListener("pointercancel", function (event) {
            //if ("touch" === event.pointerType)
            //{
            activeTouches.delete(event.pointerId);
            touchZoomPreviousDistance = null;
            //}
        }, {
            passive: false,
        });
        var pointerMoveTimeout = null;
        var clearPointerMoveTimeout = function () {
            if (null !== pointerMoveTimeout) {
                clearTimeout(pointerMoveTimeout);
                pointerMoveTimeout = null;
            }
        };
        var forcePointerClear = function () {
            clearPointerMoveTimeout();
            activeTouches.clear();
            touchZoomPreviousDistance = null;
        };
        UI.viewList.addEventListener("pointermove", function (event) {
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
                    var iter = activeTouches.values();
                    var a = iter.next().value;
                    var b = iter.next().value;
                    if (a && "touch" === a.type && b && "touch" === b.type) {
                        var currentDistance = Math.hypot(b.x - a.x, b.y - a.y);
                        if (null !== touchZoomPreviousDistance) {
                            var delta = currentDistance - touchZoomPreviousDistance;
                            if (Math.abs(delta) <= config_json_7.default.view.touchZoomThreshold) {
                                (0, exports.zoom)(delta * config_json_7.default.view.zoomRate, event);
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
        UI.ControlPanel.viewModeButton.addEventListener("click", function (event) {
            event.preventDefault();
            var current = View.getViewMode();
            var next = Type.getNext(Type.viewModeList, current);
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
            console.log("View mode changed: ".concat(current, " -> ").concat(next));
        });
        UI.ControlPanel.viewScaleButton.addEventListener("click", function (event) {
            event.preventDefault();
            UI.ControlPanel.viewScalePanel.classList.toggle("show", UI.ControlPanel.viewScaleButton.classList.toggle("on"));
        });
        UI.ControlPanel.viewScaleRange.addEventListener("input", function () { return (0, exports.zoomByRange)(UI.ControlPanel.viewScaleRange.valueAsNumber); });
        UI.ControlPanel.viewScaleRange.addEventListener("change", function () { return (0, exports.zoomByRange)(UI.ControlPanel.viewScaleRange.valueAsNumber); });
        (0, exports.bindCommandToButton)(UI.addSlideButton, Command.addSlide);
        (0, exports.bindCommandToButton)(UI.addInvertLaneButton, function () { return Command.addLane({ type: "invert" }); });
        (0, exports.bindCommandToButton)(UI.addSquaredLaneButton, function () { return Command.addLane({ type: "power", exponent: 2 }); });
        (0, exports.bindCommandToButton)(UI.addCubedLaneButton, function () { return Command.addLane({ type: "power", exponent: 3 }); });
        (0, exports.bindCommandToButton)(UI.addSquareRootLaneButton, function () { return Command.addLane({ type: "power", exponent: 0.5 }); });
        (0, exports.bindCommandToButton)(UI.addCubeRootLaneButton, function () { return Command.addLane({ type: "power", exponent: 1 / 3 }); });
        (0, exports.bindCommandToButton)(UI.addSineLaneButton, function () { return Command.addLane({ type: "sine" }); });
        (0, exports.bindCommandToButton)(UI.addCosineLaneButton, function () { return Command.addLane({ type: "cosine" }); });
        (0, exports.bindCommandToButton)(UI.addTangentLaneButton, function () { return Command.addLane({ type: "tangent" }); });
        (0, exports.bindCommandToButton)(UI.addCotangentLaneButton, function () { return Command.addLane({ type: "cotangent" }); });
        (0, exports.bindCommandToButton)(UI.add2nLaneButton, function () { return Command.addLane({ type: "2^n" }); });
        (0, exports.bindCommandToButton)(UI.addPrimeNumbersLaneButton, function () { return Command.addLane({ type: "prime", name: "Prime Numbers" }); });
        (0, exports.bindCommandToButton)(UI.addPrimeDecompositionLaneButton, function () { return Command.addLane({ type: "prime-decomposition", name: "Prime Decomposition", withoutLabel: true }); });
        (0, exports.bindCommandToButton)(UI.addSizeLaneButton, Command.addSizeLane);
        (0, exports.bindCommandToButton)(UI.addMassLaneButton, Command.addMassLane);
        (0, exports.bindCommandToButton)(UI.addTimeLaneButton, Command.addTimeLane);
        (0, exports.bindCommandToButton)(UI.addSpeedLaneButton, Command.addSpeedLane);
        (0, exports.bindCommandToButton)(UI.addEnergyLaneButton, Command.addEnergyLane);
        (0, exports.bindCommandToButton)(UI.addTemperatureLaneButton, Command.addTemperatureLane);
        (0, exports.bindCommandToButton)(UI.addCountingLaneButton, Command.addCountingLane);
        (0, exports.bindCommandToButton)(UI.addEmwWavelengthLaneButton, Command.addEmwWavelengthLane);
        (0, exports.bindCommandToButton)(UI.addEmwFrequencyLaneButton, Command.addEmwFrequencyLane);
        (0, exports.bindCommandToButton)(UI.addEmwEnergyLaneButton, Command.addEmwEnergyLane);
        (0, exports.bindCommandToButton)(UI.addHistoryLaneButton, Command.addHistoryLane);
        UI.SettingsPanel.languageSelect.addEventListener("change", function () { return Command.updateLanguage(UI.SettingsPanel.languageSelect.value); });
        (0, exports.updateViewModeRoundBar)();
        (0, exports.updateViewScaleRoundBar)();
        (0, exports.shiftSlide)("NOSNAP", Model.getRootSlide(), Model.getCursorPosition(View.data) - (window.innerHeight / 2));
    };
    exports.initialize = initialize;
});
define("script/index", ["require", "exports", "script/locale", "script/url", "script/type", "script/json-eval-updater", "script/time", "script/ui", "script/model", "script/view", "script/ruler", "script/render", "script/command", "script/event", "resource/config", "resource/constant/size", "resource/constant/mass", "resource/constant/time", "resource/constant/speed", "resource/constant/energy", "resource/constant/temperature", "resource/constant/counting", "resource/constant/emw-wavelength", "resource/constant/emw-frequency", "resource/constant/emw-energy", "resource/constant/history"], function (require, exports, Locale, Url, Type, JsonEvalUpdater, Time, UI, Model, View, Ruler, Render, Command, Event, config_json_8, size_json_2, mass_json_2, time_json_2, speed_json_2, energy_json_2, temperature_json_2, counting_json_2, emw_wavelength_json_2, emw_frequency_json_2, emw_energy_json_2, history_json_2) {
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
    config_json_8 = __importDefault(config_json_8);
    size_json_2 = __importDefault(size_json_2);
    mass_json_2 = __importDefault(mass_json_2);
    time_json_2 = __importDefault(time_json_2);
    speed_json_2 = __importDefault(speed_json_2);
    energy_json_2 = __importDefault(energy_json_2);
    temperature_json_2 = __importDefault(temperature_json_2);
    counting_json_2 = __importDefault(counting_json_2);
    emw_wavelength_json_2 = __importDefault(emw_wavelength_json_2);
    emw_frequency_json_2 = __importDefault(emw_frequency_json_2);
    emw_energy_json_2 = __importDefault(emw_energy_json_2);
    history_json_2 = __importDefault(history_json_2);
    console.log("🚀 Slide Rule build script");
    var constant = {
        size: size_json_2.default,
        mass: mass_json_2.default,
        time: time_json_2.default,
        speed: speed_json_2.default,
        energy: energy_json_2.default,
        temperature: temperature_json_2.default,
        counting: counting_json_2.default,
        emwWavelength: emw_wavelength_json_2.default,
        emwFrequency: emw_frequency_json_2.default,
        emwEnergy: emw_energy_json_2.default,
        history: history_json_2.default,
    };
    var global = {
        Locale: Locale,
        Url: Url,
        Type: Type,
        Time: Time,
        UI: UI,
        Model: Model,
        View: View,
        Event: Event,
        Ruler: Ruler,
        Render: Render,
        Command: Command,
        config: config_json_8.default,
        constant: constant,
        nestEvalUpdate: JsonEvalUpdater.nestEvalUpdate,
        waveLengthToFrequency: JsonEvalUpdater.waveLengthToFrequency,
        frequencyToWaveLength: JsonEvalUpdater.frequencyToWaveLength,
        roundE: JsonEvalUpdater.roundE,
        updateJsonWithEval: function (json) {
            return JsonEvalUpdater.saveJson(JsonEvalUpdater.updateJsonWithEval(json, json["$file-name"] || undefined));
        },
    };
    for (var _i = 0, _a = Object.keys(global); _i < _a.length; _i++) {
        var key = _a[_i];
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
    Render.markDirty();
});
//# sourceMappingURL=index.js.map