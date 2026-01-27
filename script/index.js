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
            for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                url.searchParams.set(key, value);
            }
            return url.toString().replace(/\?/g, "#");
        };
        Url.addParameter = function (key, value) {
            params[key] = value;
            pushUrl();
            return params;
        };
        Url.get = function (key) {
            return params[key];
        };
        var pushUrl = function () {
            return window.history.replaceState({}, "", Url.make());
        };
        Url.initialize = function () {
        };
        var params = Url.parseParameter(window.location.href);
        Url.reloadParameters = function () {
            return params = Url.parseParameter(window.location.href);
        };
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
        Type.getNext = function (list, current, isReverse) {
            var currentIndex = list.indexOf(current);
            if (0 <= currentIndex) {
                var nextIndex = (currentIndex + (isReverse ? -1 : 1) + list.length) % list.length;
                return list[nextIndex];
            }
            else {
                throw new Error("\uD83E\uDD8B FIXME: getNext: current value not found in list");
            }
        };
        Type.viewModeList = ["ruler", "grid", "graph"];
        Type.scaleModeList = ["logarithmic", "linear"];
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
        UI.setTextContent = function (element, text) {
            if (element.textContent !== text) {
                element.textContent = text;
                return true;
            }
            return false;
        };
        UI.setAttribute = function (element, name, value) {
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
        UI.setStyle = function (element, name, value) {
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
        UI.updateRoundBar = function (button, properties) {
            // console.log("updateRoundBar", button, properties);
            /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
            UI.setStyle(button, "--low", properties.low.toFixed(3));
            UI.setStyle(button, "--high", properties.high.toFixed(3));
            UI.setStyle(button, "--rotate", properties.rotate.toFixed(3));
        };
        UI.rulerView = getHtmlElementById("div", "ruler-view");
        UI.rulerSvg = getSvgElementById("svg", "ruler-svg");
        UI.gridView = getHtmlElementById("div", "grid-view");
        UI.graphView = getHtmlElementById("div", "graph-view");
        UI.controlPanel = getHtmlElementById("div", "control-panel");
        UI.viewModeButton = getHtmlElementById("button", "view-mode-button");
        UI.scaleModeButton = getHtmlElementById("button", "scale-mode-button");
        UI.initialize = function () {
            console.log("UI initialized");
        };
    })(UI || (exports.UI = UI = {}));
});
define("script/number", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Number = void 0;
    var Number;
    (function (Number) {
        Number.parse = function (value) {
            if (undefined !== value) {
                var result = parseFloat(value);
                if (!isNaN(result)) {
                    return result;
                }
            }
            return undefined;
        };
        Number.orUndefined = function (value) {
            return "number" === typeof value ? value : undefined;
        };
    })(Number || (exports.Number = Number = {}));
});
define("script/model", ["require", "exports", "script/number", "script/type", "script/url"], function (require, exports, number_1, type_1, url_1) {
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
                    if ("logarithmic" === view.scaleMode) {
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
                    if ("logarithmic" === view.scaleMode) {
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
            var _a;
            Model.data.anchor = (_a = number_1.Number.parse(url_1.Url.get("anchor"))) !== null && _a !== void 0 ? _a : 100;
            console.log("Model initialized: anchor=".concat(Model.data.anchor));
        };
    })(Model || (exports.Model = Model = {}));
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
        "defaultViewMode": "ruler",
        "defaultScaleMode": "logarithmic",
        "baseOfLogarithm": {
            "presets": ["phi", 2, "e", "pi", 10],
            "default": 10
        }
    }
});
define("script/view", ["require", "exports", "script/number", "script/type", "script/url", "script/ui", "resource/config"], function (require, exports, number_2, type_2, url_2, ui_1, config_json_1) {
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
        View.isGraphView = function () { return View.data.viewMode === "graph"; };
        View.setViewMode = function (mode) {
            View.data.viewMode = mode;
            url_2.Url.addParameter("view-mode", mode);
            document.body.classList.toggle("ruler-view", View.isRulerView());
            document.body.classList.toggle("grid-view", View.isGridView());
            document.body.classList.toggle("graph-view", View.isGraphView());
            ui_1.UI.setAriaHidden(ui_1.UI.rulerView, !View.isRulerView());
            ui_1.UI.setAriaHidden(ui_1.UI.gridView, !View.isGridView());
        };
        View.getScaleMode = function () { return View.data.scaleMode; };
        View.isLogarithmicScale = function () { return View.data.scaleMode === "logarithmic"; };
        View.isLinearScale = function () { return View.data.scaleMode === "linear"; };
        View.setScaleMode = function (mode) {
            View.data.scaleMode = mode;
            url_2.Url.addParameter("scale-mode", mode);
            document.body.classList.toggle("logarithmic-scale", mode === "logarithmic");
            document.body.classList.toggle("linear-scale", mode === "linear");
        };
        View.initialize = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            View.setViewMode((_c = (_a = url_2.Url.get("view-mode")) !== null && _a !== void 0 ? _a : (_b = config_json_1.default.view) === null || _b === void 0 ? void 0 : _b.defaultViewMode) !== null && _c !== void 0 ? _c : "ruler");
            View.setScaleMode((_f = (_d = url_2.Url.get("scale-mode")) !== null && _d !== void 0 ? _d : (_e = config_json_1.default.view) === null || _e === void 0 ? void 0 : _e.defaultScaleMode) !== null && _f !== void 0 ? _f : "logarithmic");
            View.data.viewScale = (_g = number_2.Number.parse(url_2.Url.get("view-scale"))) !== null && _g !== void 0 ? _g : 1;
            View.data.baseOfLogarithm = (_l = (_h = number_2.Number.orUndefined(type_2.Type.getNamedNumberValue(url_2.Url.get("base")))) !== null && _h !== void 0 ? _h : (_k = (_j = config_json_1.default.view) === null || _j === void 0 ? void 0 : _j.baseOfLogarithm) === null || _k === void 0 ? void 0 : _k.default) !== null && _l !== void 0 ? _l : 10;
            console.log("View initialized: mode=".concat(View.data.viewMode, ", scale=").concat(View.data.viewScale, ", scaleMode=").concat(View.data.scaleMode, ", base=").concat(View.data.baseOfLogarithm));
        };
    })(View || (exports.View = View = {}));
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
define("script/ruler", ["require", "exports", "script/ui"], function (require, exports, ui_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ruler = void 0;
    var Ruler;
    (function (Ruler) {
        Ruler.renderer = function (model, _view, _dirty) {
            Ruler.drawAnkorLine(model.anchor);
        };
        Ruler.drawAnkorLine = function (position) {
            var svg = ui_2.UI.rulerSvg;
            var line = svg.querySelector("line.ankor-line");
            ;
            if (!line) {
                line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.classList.add("ankor-line");
                svg.appendChild(line);
            }
            line.setAttribute("x1", "0");
            line.setAttribute("y1", position.toString());
            line.setAttribute("x2", svg.viewBox.baseVal.width.toString());
            line.setAttribute("y2", position.toString());
            var color = "red";
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", "1");
        };
        Ruler.resize = function () {
            var svg = ui_2.UI.rulerSvg;
            document.body;
            svg.setAttribute("width", document.body.clientWidth.toString());
            svg.setAttribute("height", document.body.clientHeight.toString());
            svg.setAttribute("viewBox", "0 0 ".concat(document.body.clientWidth, " ").concat(document.body.clientHeight));
        };
        Ruler.initialize = function () {
            Ruler.resize();
        };
    })(Ruler || (exports.Ruler = Ruler = {}));
});
define("script/grid", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Grid = void 0;
    var Grid;
    (function (Grid) {
        Grid.renderer = function (_model, _view, _dirty) {
        };
    })(Grid || (exports.Grid = Grid = {}));
});
define("script/graph", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Graph = void 0;
    var Graph;
    (function (Graph) {
        Graph.renderer = function (_model, _view, _dirty) {
        };
    })(Graph || (exports.Graph = Graph = {}));
});
define("script/event", ["require", "exports", "script/type", "script/view", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph"], function (require, exports, type_3, view_2, ui_3, render_1, ruler_1, grid_1, graph_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = void 0;
    var Event;
    (function (Event) {
        Event.updateViewModeRoundBar = function () { return ui_3.UI.updateRoundBar(ui_3.UI.viewModeButton, {
            low: 0 / type_3.Type.viewModeList.length,
            high: 1 / type_3.Type.viewModeList.length,
            rotate: type_3.Type.viewModeList.indexOf(view_2.View.getViewMode()) / type_3.Type.viewModeList.length,
        }); };
        Event.updateScaleModeRoundBar = function () { return ui_3.UI.updateRoundBar(ui_3.UI.scaleModeButton, {
            low: 0 / type_3.Type.scaleModeList.length,
            high: 1 / type_3.Type.scaleModeList.length,
            rotate: type_3.Type.scaleModeList.indexOf(view_2.View.getScaleMode()) / type_3.Type.scaleModeList.length,
        }); };
        Event.initialize = function () {
            console.log("Event initialized");
            window.addEventListener("resize", function () {
                ruler_1.Ruler.resize();
                render_1.Render.markDirty();
            });
            ui_3.UI.viewModeButton.addEventListener("click", function () {
                var current = view_2.View.getViewMode();
                var next = type_3.Type.getNext(type_3.Type.viewModeList, current);
                view_2.View.setViewMode(next);
                Event.updateViewModeRoundBar();
                switch (next) {
                    case "ruler":
                        render_1.Render.setRenderer(ruler_1.Ruler.renderer);
                        break;
                    case "grid":
                        render_1.Render.setRenderer(grid_1.Grid.renderer);
                        break;
                    case "graph":
                        render_1.Render.setRenderer(graph_1.Graph.renderer);
                        break;
                }
                render_1.Render.markDirty();
                console.log("View mode changed: ".concat(current, " -> ").concat(next));
            });
            ui_3.UI.scaleModeButton.addEventListener("click", function () {
                var current = view_2.View.getScaleMode();
                var next = type_3.Type.getNext(type_3.Type.scaleModeList, current);
                view_2.View.setScaleMode(next);
                Event.updateScaleModeRoundBar();
                render_1.Render.markDirty();
                console.log("Scale mode changed: ".concat(current, " -> ").concat(next));
            });
            Event.updateViewModeRoundBar();
            Event.updateScaleModeRoundBar();
        };
    })(Event || (exports.Event = Event = {}));
});
define("script/index", ["require", "exports", "script/url", "script/type", "script/ui", "script/model", "script/view", "script/event", "script/ruler", "script/render"], function (require, exports, url_3, type_4, ui_4, model_2, view_3, event_1, ruler_2, render_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("🚀 Slide Rule build script");
    type_4.Type;
    url_3.Url.initialize();
    ui_4.UI.initialize();
    model_2.Model.initialize();
    view_3.View.initialize();
    event_1.Event.initialize();
    ruler_2.Ruler.initialize();
    render_2.Render.setRenderer(ruler_2.Ruler.renderer);
    render_2.Render.markDirty();
});
//# sourceMappingURL=index.js.map