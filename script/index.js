var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("script/url", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Url = void 0;
    //import config from "@resource/config.json";
    var Url;
    (function (Url) {
        Url.parseParameter = function (url) {
            var result = {};
            var urlObj = new URL(url.replace(/#/g, "?"));
            var params = urlObj.searchParams;
            params.forEach(function (value, key) { return result[key] = value; });
            return result;
        };
        Url.make = function () {
            var url = new URL(window.location.href.replace(/#/g, "?"));
            for (var _i = 0, _a = Object.entries(Url.params); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                url.searchParams.set(key, value);
            }
            return url.toString().replace(/\?/g, "#");
        };
        Url.addParameter = function (key, value) {
            Url.params[key] = value;
            pushUrl();
            return Url.params;
        };
        var pushUrl = function () {
            return window.history.replaceState({}, "", Url.make());
        };
        Url.initialize = function () {
        };
        Url.params = Url.parseParameter(window.location.href);
    })(Url || (exports.Url = Url = {}));
});
define("script/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Type = void 0;
    var Type;
    (function (Type) {
        Type.phi = (1 + Math.sqrt(5)) / 2;
        Type.getNamedNumberValue = function (value) {
            switch (value) {
                case "phi": return Type.phi;
                case "e": return Math.E;
                case "pi": return Math.PI;
                default: return value;
            }
        };
        Type.getNamedNumberLabel = function (value, locales, options) {
            switch (value) {
                case "phi": return "φ";
                case "e": return "e";
                case "pi": return "π";
                default: return value.toLocaleString(locales, options);
            }
        };
    })(Type || (exports.Type = Type = {}));
});
define("resource/config", [], {
    "applicationTitle": "Slide Rule",
    "repositoryUrl": "https://github.com/wraith13/slide-rule/",
    "canonicalUrl": "https://wraith13.github.io/slide-rule/",
    "description": "Slide Rule Web App",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "view": {
        "defaultMode": "ruler",
        "defaultScale": "logarithmic",
        "baseOfLogarithm": {
            "presets": ["phi", 2, "e", "pi", 10],
            "default": 10
        }
    }
});
define("script/view", ["require", "exports", "script/url", "script/type", "resource/config"], function (require, exports, url_1, type_1, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    config_json_1 = __importDefault(config_json_1);
    var View;
    (function (View) {
        View.initialize = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            View.viewMode = (_c = (_a = url_1.Url.params["view-mode"]) !== null && _a !== void 0 ? _a : (_b = config_json_1.default.view) === null || _b === void 0 ? void 0 : _b.defaultMode) !== null && _c !== void 0 ? _c : "ruler";
            View.viewScale = Number(url_1.Url.params["view-scale"]) || 1;
            View.scaleMode = (_f = (_d = url_1.Url.params["scale-mode"]) !== null && _d !== void 0 ? _d : (_e = config_json_1.default.view) === null || _e === void 0 ? void 0 : _e.defaultScale) !== null && _f !== void 0 ? _f : "logarithmic";
            View.baseOfLogarithm = Number(type_1.Type.getNamedNumberValue(url_1.Url.params["base"]))
                || ((_h = (_g = config_json_1.default.view) === null || _g === void 0 ? void 0 : _g.baseOfLogarithm) === null || _h === void 0 ? void 0 : _h.default)
                || 10;
        };
    })(View || (exports.View = View = {}));
});
define("script/event", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = void 0;
    // import { Model } from "./model";
    // import { Color } from "./color";
    // import { UI } from "./ui";
    var Event;
    (function (Event) {
        Event.initialize = function () {
        };
    })(Event || (exports.Event = Event = {}));
});
define("script/index", ["require", "exports", "script/url", "script/view", "script/event"], function (require, exports, url_2, view_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    url_2.Url.initialize();
    event_1.Event.initialize();
    view_1.View.initialize();
    console.log("🚀 Slide Rule build script");
});
//# sourceMappingURL=index.js.map