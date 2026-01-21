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
            console.log("Url initialized");
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
define("script/ui", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UI = void 0;
    var UI;
    (function (UI) {
        var getHtmlElementById = function (tag, id) {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error("\uD83E\uDD8B FIXME: HtmlElement not found: ".concat(id));
            }
            if (tag !== element.tagName.toLowerCase()) {
                throw new Error("\uD83E\uDD8B FIXME: HtmlElement is not <".concat(tag, ">: ").concat(id));
            }
            return element;
        };
        var getSvgElementById = function (tag, id) {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error("\uD83E\uDD8B FIXME: SvgElement not found: ".concat(id));
            }
            if (tag !== element.tagName.toLowerCase()) {
                throw new Error("\uD83E\uDD8B FIXME: SvgElement is not <".concat(tag, ">: ").concat(id));
            }
            return element;
        };
        UI.setAriaHidden = function (element, hidden) {
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
        UI.rulerView = getSvgElementById("svg", "ruler-view");
        UI.gridView = getHtmlElementById("div", "grid-view");
        UI.controlPanel = getHtmlElementById("div", "control-panel");
        UI.initialize = function () {
            console.log("UI initialized");
        };
    })(UI || (exports.UI = UI = {}));
});
define("script/model", ["require", "exports", "script/type", "script/url"], function (require, exports, type_1, url_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    var Model;
    (function (Model) {
        Model.data = {
            lanes: [],
            anchor: 0
        };
        Model.getValueAt = function (lane, position, view) {
            switch (lane.type) {
                case "logarithmic":
                    if (view.scaleMode === "logarithmic") {
                        var logScale = type_1.Type.getNamedNumberValue(lane.logScale);
                        var value = Math.pow(logScale, position / view.viewScale);
                        return lane.isInverted ? (logScale - value) : value;
                    }
                    else // linear
                     {
                        var value = position / view.viewScale;
                        return lane.isInverted ? (type_1.Type.getNamedNumberValue(lane.logScale) - value) : value;
                    }
                default:
                    throw new Error("\uD83E\uDD8B FIXME: getValueAt not implemented for lane type: ".concat(lane.type));
            }
        };
        Model.getPositionAt = function (lane, value, view) {
            switch (lane.type) {
                case "logarithmic":
                    if (view.scaleMode === "logarithmic") {
                        var logScale = type_1.Type.getNamedNumberValue(lane.logScale);
                        var position = Math.log(value) / Math.log(logScale) * view.viewScale;
                        return lane.isInverted ? (Math.log(logScale - value) / Math.log(logScale) * view.viewScale) : position;
                    }
                    else // linear
                     {
                        var position = value * view.viewScale;
                        return lane.isInverted ? ((type_1.Type.getNamedNumberValue(lane.logScale) - value) * view.viewScale) : position;
                    }
                default:
                    throw new Error("\uD83E\uDD8B FIXME: getPositionAt not implemented for lane type: ".concat(lane.type));
            }
        };
        Model.initialize = function () {
            Model.data.anchor = Number(url_1.Url.params["anchor"]) || 0;
            console.log("Model initialized: anchor=".concat(Model.data.anchor));
        };
    })(Model || (exports.Model = Model = {}));
});
define("script/render", ["require", "exports", "script/view", "script/model"], function (require, exports, view_1, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Render = void 0;
    var Render;
    (function (Render) {
        var dirty = false;
        var currentRenderer;
        Render.isDirty = function () {
            return false !== dirty;
        };
        Render.markDirty = function (laneIndex) {
            var isFirstDirty = !Render.isDirty();
            if (laneIndex === undefined) {
                dirty = true;
            }
            else {
                if (dirty === false) {
                    dirty = new Set();
                }
                if (dirty instanceof Set) {
                    dirty.add(laneIndex);
                }
            }
            if (isFirstDirty) {
                requestAnimationFrame(function () {
                    currentRenderer(model_1.Model.data, view_1.View.data, dirty);
                    dirty = false;
                });
            }
        };
        Render.setRenderer = function (renderer) {
            return currentRenderer = renderer;
        };
    })(Render || (exports.Render = Render = {}));
});
define("resource/config", [], {
    "applicationTitle": "Slide Rule",
    "repositoryUrl": "https://github.com/wraith13/slide-rule/",
    "canonicalUrl": "https://wraith13.github.io/slide-rule/",
    "description": "Slide Rule Web App",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "model": {
        "lane": {
            "presets": {
                "A": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": "2"
                },
                "B": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": "2"
                },
                "C": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": "1"
                },
                "D": {
                    "type": "logarithmic",
                    "logScale": "1"
                },
                "CI": {
                    "type": "logarithmic",
                    "isInverted": true,
                    "logScale": "1"
                },
                "DI": {
                    "type": "logarithmic",
                    "isInverted": true,
                    "logScale": "1"
                },
                "K": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": "3"
                },
                "L": {
                    "type": "linear",
                    "isInverted": false,
                    "logScale": "e"
                },
                "S": {
                    "type": "sine",
                    "isInverted": false,
                    "logScale": "1"
                },
                "T": {
                    "type": "tangent",
                    "isInverted": false,
                    "logScale": "1"
                },
                "ST": {
                    "type": "small-tangent",
                    "isInverted": false,
                    "logScale": "1"
                },
                "P": {
                    "type": "power",
                    "isInverted": false,
                    "logScale": "2"
                },
                "LL": {
                    "type": "log-log",
                    "isInverted": false,
                    "logScale": "e"
                }
            }
        }
    },
    "view": {
        "defaultMode": "ruler",
        "defaultScale": "logarithmic",
        "baseOfLogarithm": {
            "presets": ["phi", 2, "e", "pi", 10],
            "default": 10
        }
    }
});
define("script/view", ["require", "exports", "script/type", "script/url", "script/ui", "script/render", "resource/config"], function (require, exports, type_2, url_2, ui_1, render_1, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    config_json_1 = __importDefault(config_json_1);
    var View;
    (function (View) {
        View.data = {
            viewMode: "ruler",
            viewScale: 1,
            scaleMode: "logarithmic",
            baseOfLogarithm: 10,
        };
        View.getViewMode = function () { return View.data.viewMode; };
        View.isRulerView = function () { return View.data.viewMode === "ruler"; };
        View.isGridView = function () { return View.data.viewMode === "grid"; };
        View.setViewMode = function (mode) {
            View.data.viewMode = mode;
            url_2.Url.addParameter("view-mode", mode);
            document.body.classList.toggle("grid-view", View.isGridView());
            document.body.classList.toggle("ruler-view", View.isRulerView());
            ui_1.UI.setAriaHidden(ui_1.UI.rulerView, !View.isRulerView());
            ui_1.UI.setAriaHidden(ui_1.UI.gridView, !View.isGridView());
            // if (isRulerView())
            // {
            //     Render.setRenderer(Ruler.renderer);
            // }
            // else if (isGridView())
            // {
            //     Render.setRenderer(Grid.renderer);
            // }
            render_1.Render.markDirty();
        };
        View.initialize = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            View.setViewMode((_c = (_a = url_2.Url.params["view-mode"]) !== null && _a !== void 0 ? _a : (_b = config_json_1.default.view) === null || _b === void 0 ? void 0 : _b.defaultMode) !== null && _c !== void 0 ? _c : "ruler");
            View.data.viewScale = Number(url_2.Url.params["view-scale"]) || 1;
            View.data.scaleMode = (_f = (_d = url_2.Url.params["scale-mode"]) !== null && _d !== void 0 ? _d : (_e = config_json_1.default.view) === null || _e === void 0 ? void 0 : _e.defaultScale) !== null && _f !== void 0 ? _f : "logarithmic";
            View.data.baseOfLogarithm = Number(type_2.Type.getNamedNumberValue(url_2.Url.params["base"]))
                || ((_h = (_g = config_json_1.default.view) === null || _g === void 0 ? void 0 : _g.baseOfLogarithm) === null || _h === void 0 ? void 0 : _h.default)
                || 10;
            console.log("View initialized: mode=".concat(View.data.viewMode, ", scale=").concat(View.data.viewScale, ", scaleMode=").concat(View.data.scaleMode, ", base=").concat(View.data.baseOfLogarithm));
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
            console.log("Event initialized");
        };
    })(Event || (exports.Event = Event = {}));
});
define("script/index", ["require", "exports", "script/url", "script/type", "script/ui", "script/model", "script/view", "script/event"], function (require, exports, url_3, type_3, ui_2, model_2, view_2, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("🚀 Slide Rule build script");
    type_3.Type;
    url_3.Url.initialize();
    ui_2.UI.initialize();
    model_2.Model.initialize();
    view_2.View.initialize();
    event_1.Event.initialize();
});
//# sourceMappingURL=index.js.map