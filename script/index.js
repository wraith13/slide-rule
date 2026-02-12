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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
    exports.scaleModeList = exports.viewModeList = exports.getNext = exports.getNamedNumberLabel = exports.getNamedNumberValue = exports.phi = exports.namedNumberList = void 0;
    exports.namedNumberList = ["phi", "e", "pi"];
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
    exports.scaleModeList = ["logarithmic", "linear"];
});
define("script/ui", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.scaleModeButton = exports.viewModeButton = exports.controlPanel = exports.graphView = exports.gridView = exports.rulerSvg = exports.rulerView = exports.updateRoundBar = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.setAriaHidden = void 0;
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
    var updateRoundBar = function (button, properties) {
        // console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        (0, exports.setStyle)(button, "--low", properties.low.toFixed(3));
        (0, exports.setStyle)(button, "--high", properties.high.toFixed(3));
        (0, exports.setStyle)(button, "--rotate", properties.rotate.toFixed(3));
    };
    exports.updateRoundBar = updateRoundBar;
    exports.rulerView = getHtmlElementById("div", "ruler-view");
    exports.rulerSvg = getSvgElementById("svg", "ruler-svg");
    exports.gridView = getHtmlElementById("div", "grid-view");
    exports.graphView = getHtmlElementById("div", "graph-view");
    exports.controlPanel = getHtmlElementById("div", "control-panel");
    exports.viewModeButton = getHtmlElementById("button", "view-mode-button");
    exports.scaleModeButton = getHtmlElementById("button", "scale-mode-button");
    var initialize = function () {
        console.log("UI initialized");
    };
    exports.initialize = initialize;
});
define("script/number", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.orUndefined = exports.parse = void 0;
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
});
define("resource/config", [], {
    "applicationTitle": "Slide Rule",
    "repositoryUrl": "https://github.com/wraith13/slide-rule/",
    "canonicalUrl": "https://wraith13.github.io/slide-rule/",
    "description": "Slide Rule Web App",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "model": {
        "lane": {
            "root": {
                "type": "logarithmic",
                "isInverted": false,
                "logScale": 1
            },
            "presets": {
                "A": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": 2
                },
                "B": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": 2
                },
                "C": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": 1
                },
                "D": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": 1
                },
                "CI": {
                    "type": "logarithmic",
                    "isInverted": true,
                    "logScale": 1
                },
                "DI": {
                    "type": "logarithmic",
                    "isInverted": true,
                    "logScale": 1
                },
                "K": {
                    "type": "logarithmic",
                    "isInverted": false,
                    "logScale": 3
                },
                "L": {
                    "type": "linear",
                    "isInverted": false,
                    "logScale": "e"
                },
                "S": {
                    "type": "sine",
                    "isInverted": false,
                    "logScale": 1
                },
                "T": {
                    "type": "tangent",
                    "isInverted": false,
                    "logScale": 1
                },
                "ST": {
                    "type": "small-tangent",
                    "isInverted": false,
                    "logScale": 1
                },
                "P": {
                    "type": "power",
                    "isInverted": false,
                    "logScale": 2
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
    },
    "render": {
        "ruler": {
            "backgroundColor": "#FFFFFF",
            "lineColor": "#BB0000",
            "lineWidth": 1,
            "laneBackgroundColor": "#F0F0F0",
            "laneWidth": 180,
            "laneSeparatorColor": "#444444",
            "laneSeparatorWidth": 1,
            "tick": {
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
            }
        }
    }
});
define("script/model", ["require", "exports", "script/number", "script/type", "script/url", "resource/config"], function (require, exports, Number, Type, Url, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.makeSure = exports.removeLane = exports.makeLane = exports.addLane = exports.getSlideFromLane = exports.getLane = exports.getLaneAndSlide = exports.makeSureSlide = exports.makeSlide = exports.getLaneIndex = exports.getSlideIndex = exports.isRooeSlide = exports.isRootLane = exports.makeRootLane = exports.designTicks = exports.getFirstLabelValue = exports.getPositionAt = exports.getValueAt = exports.getAllLanes = exports.RootLaneIndex = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    config_json_1 = __importDefault(config_json_1);
    exports.data = {
        slides: [],
        anchor: 0
    };
    exports.RootLaneIndex = 0;
    var getAllLanes = function () {
        return exports.data.slides.reduce(function (allLanes, slide) { return allLanes.concat(slide.lanes); }, []);
    };
    exports.getAllLanes = getAllLanes;
    var getValueAt = function (lane, position, view) {
        switch (lane.type) {
            case "logarithmic":
                if ("logarithmic" === view.scaleMode) {
                    var logScale = Type.getNamedNumberValue(lane.logScale);
                    var value = Math.pow(logScale, position / view.viewScale);
                    return lane.isInverted ? (logScale - value) : value;
                }
                else // linear
                 {
                    var value = position / view.viewScale;
                    return lane.isInverted ? (Type.getNamedNumberValue(lane.logScale) - value) : value;
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getValueAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getValueAt = getValueAt;
    var getPositionAt = function (lane, value, view) {
        switch (lane.type) {
            case "logarithmic":
                if ("logarithmic" === view.scaleMode) {
                    var logScale = Type.getNamedNumberValue(lane.logScale);
                    var position = Math.log(value) / Math.log(logScale) * view.viewScale;
                    return lane.isInverted ? (Math.log(logScale - value) / Math.log(logScale) * view.viewScale) : position;
                }
                else // linear
                 {
                    var position = value * view.viewScale;
                    return lane.isInverted ? ((Type.getNamedNumberValue(lane.logScale) - value) * view.viewScale) : position;
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getPositionAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getPositionAt = getPositionAt;
    var getFirstLabelValue = function (lane, view) {
        var minValue = (0, exports.getValueAt)(lane, 0, view);
        //const maxValue = getValueAt(lane, config.render.ruler.tickLabel.maxInterval, view);
        switch (view.scaleMode) {
            case "logarithmic":
                {
                    var logScale = Type.getNamedNumberValue(lane.logScale);
                    var firstLabelValue = Math.pow(logScale, Math.floor(Math.log(minValue) / Math.log(logScale)));
                    var labelValueUnit = firstLabelValue * (logScale - 1);
                    return { firstLabelValue: firstLabelValue, labelValueUnit: labelValueUnit, };
                }
            case "linear":
                {
                    var labelValueUnit = view.viewScale * 10;
                    var firstLabelValue = Math.floor(minValue / labelValueUnit) * labelValueUnit;
                    return { firstLabelValue: firstLabelValue, labelValueUnit: labelValueUnit, };
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getFirstLabelValue not implemented for scale mode: ".concat(view.scaleMode));
        }
    };
    exports.getFirstLabelValue = getFirstLabelValue;
    var designTicks = function (view, lane) {
        var ticks = [];
        var height = window.innerHeight;
        var min = (0, exports.getValueAt)(lane, 0, view);
        var max = (0, exports.getValueAt)(lane, height, view);
        Type.namedNumberList.forEach(function (value) {
            var actualNumber = Type.getNamedNumberValue(value);
            if (min <= actualNumber && actualNumber <= max) {
                ticks.push({ value: value, type: "long", });
            }
        });
        return ticks;
    };
    exports.designTicks = designTicks;
    var makeRootLane = function () {
        var _a = config_json_1.default.model.lane.root, type = _a.type, isInverted = _a.isInverted, logScale = _a.logScale;
        return (0, exports.makeLane)({
            type: type,
            isInverted: isInverted,
            logScale: logScale,
        });
    };
    exports.makeRootLane = makeRootLane;
    var isRootLane = function (indexOrLane) {
        return (typeof indexOrLane === "number" ? exports.RootLaneIndex : (0, exports.getLane)(exports.RootLaneIndex)) === indexOrLane;
    };
    exports.isRootLane = isRootLane;
    var isRooeSlide = function (indexOrSlide) {
        return (0 === (typeof indexOrSlide === "number" ? indexOrSlide : (0, exports.getSlideIndex)(indexOrSlide)));
    };
    exports.isRooeSlide = isRooeSlide;
    var getSlideIndex = function (slide) {
        var index = exports.data.slides.indexOf(slide);
        if (0 <= index) {
            return index;
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getSlideIndex: slide not found");
    };
    exports.getSlideIndex = getSlideIndex;
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
        if (anchor === void 0) { anchor = 0; }
        return ({
            lanes: [],
            anchor: anchor
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
    var getLaneAndSlide = function (index) {
        var i = 0;
        for (var _i = 0, _a = exports.data.slides; _i < _a.length; _i++) {
            var slide = _a[_i];
            for (var _b = 0, _c = slide.lanes; _b < _c.length; _b++) {
                var lane = _c[_b];
                if (i === index) {
                    return { lane: lane, slide: slide };
                }
                ++i;
            }
        }
        throw new Error("\uD83E\uDD8B FIXME: Model.getLane: index out of range: ".concat(index));
    };
    exports.getLaneAndSlide = getLaneAndSlide;
    var getLane = function (index) {
        return (0, exports.getLaneAndSlide)(index).lane;
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
        var _loop_1 = function (i) {
            var preset = config_json_1.default.model.lane.presets[i];
            if (exports.data.slides.every(function (slide) { return slide.lanes.every(function (lane) { return lane.name !== i; }); }) &&
                preset.type === laneSeed.type &&
                preset.isInverted === laneSeed.isInverted &&
                preset.logScale === laneSeed.logScale) {
                return { value: i };
            }
        };
        for (var _i = 0, _a = Object.keys(config_json_1.default.model.lane.presets); _i < _a.length; _i++) {
            var i = _a[_i];
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    };
    var makeLane = function (laneSeed) {
        return ({
            type: laneSeed.type,
            isInverted: laneSeed.isInverted,
            logScale: laneSeed.logScale,
            name: getLaneName(laneSeed),
            isLinked: false,
            offset: 0
        });
    };
    exports.makeLane = makeLane;
    var removeLane = function (index) {
        if ((0, exports.isRootLane)(index)) {
            throw new Error("\uD83E\uDD8B FIXME: Model.removeLane: cannot remove root lane");
        }
        else {
            var _a = (0, exports.getLaneAndSlide)(index), slide = _a.slide, lane = _a.lane;
            slide.lanes.splice(slide.lanes.indexOf(lane), 1);
        }
    };
    exports.removeLane = removeLane;
    var makeSure = function () {
        (0, exports.makeSureSlide)();
    };
    exports.makeSure = makeSure;
    var initialize = function () {
        var _a;
        exports.data.anchor = (_a = Number.parse(Url.get("anchor"))) !== null && _a !== void 0 ? _a : 100;
        console.log("Model initialized: anchor=".concat(exports.data.anchor));
        (0, exports.makeSure)();
    };
    exports.initialize = initialize;
});
define("script/view", ["require", "exports", "script/number", "script/type", "script/url", "script/ui", "resource/config"], function (require, exports, Number, Type, Url, UI, config_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.setScaleMode = exports.isLinearScale = exports.isLogarithmicScale = exports.getScaleMode = exports.setViewMode = exports.isGraphView = exports.isGridView = exports.isRulerView = exports.getViewMode = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    UI = __importStar(UI);
    config_json_2 = __importDefault(config_json_2);
    exports.data = {
        viewMode: "ruler",
        viewScale: 1,
        scaleMode: "logarithmic",
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
    var getScaleMode = function () { return exports.data.scaleMode; };
    exports.getScaleMode = getScaleMode;
    var isLogarithmicScale = function () { return exports.data.scaleMode === "logarithmic"; };
    exports.isLogarithmicScale = isLogarithmicScale;
    var isLinearScale = function () { return exports.data.scaleMode === "linear"; };
    exports.isLinearScale = isLinearScale;
    var setScaleMode = function (mode) {
        exports.data.scaleMode = mode;
        Url.addParameter("scale-mode", mode);
        document.body.classList.toggle("logarithmic-scale", mode === "logarithmic");
        document.body.classList.toggle("linear-scale", mode === "linear");
    };
    exports.setScaleMode = setScaleMode;
    var initialize = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        (0, exports.setViewMode)((_c = (_a = Url.get("view-mode")) !== null && _a !== void 0 ? _a : (_b = config_json_2.default.view) === null || _b === void 0 ? void 0 : _b.defaultViewMode) !== null && _c !== void 0 ? _c : "ruler");
        (0, exports.setScaleMode)((_f = (_d = Url.get("scale-mode")) !== null && _d !== void 0 ? _d : (_e = config_json_2.default.view) === null || _e === void 0 ? void 0 : _e.defaultScaleMode) !== null && _f !== void 0 ? _f : "logarithmic");
        exports.data.viewScale = (_g = Number.parse(Url.get("view-scale"))) !== null && _g !== void 0 ? _g : 1;
        exports.data.baseOfLogarithm = (_l = (_h = Number.orUndefined(Type.getNamedNumberValue(Url.get("base")))) !== null && _h !== void 0 ? _h : (_k = (_j = config_json_2.default.view) === null || _j === void 0 ? void 0 : _j.baseOfLogarithm) === null || _k === void 0 ? void 0 : _k.default) !== null && _l !== void 0 ? _l : 10;
        console.log("View initialized: mode=".concat(exports.data.viewMode, ", scale=").concat(exports.data.viewScale, ", scaleMode=").concat(exports.data.scaleMode, ", base=").concat(exports.data.baseOfLogarithm));
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
define("script/ruler", ["require", "exports", "script/type", "script/ui", "script/model", "resource/config"], function (require, exports, Type, UI, Model, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.resize = exports.drawAnkorLine = exports.drawTick = exports.drawLane = exports.makeSureSvgElement = exports.makeSvgElement = exports.setAttributes = exports.drawSlide = exports.renderer = exports.LaneWidths = exports.scale = void 0;
    Type = __importStar(Type);
    UI = __importStar(UI);
    Model = __importStar(Model);
    config_json_3 = __importDefault(config_json_3);
    exports.scale = 1.0;
    exports.LaneWidths = [];
    var renderer = function (model, _view, dirty) {
        if (false !== dirty) {
            for (var _i = 0, _a = model.slides; _i < _a.length; _i++) {
                var slide = _a[_i];
                if ("boolean" === typeof dirty || dirty.has(Model.getSlideIndex(slide))) {
                    (0, exports.drawSlide)(slide);
                }
            }
            if (true === dirty || dirty.has(-1)) {
                (0, exports.drawAnkorLine)(model.anchor);
            }
        }
    };
    exports.renderer = renderer;
    var drawSlide = function (slide) {
        var svg = UI.rulerSvg;
        var group = svg.querySelector("g.slide-group[data-slide-index=\"".concat(Model.getSlideIndex(slide), "\"]"));
        if (!group) {
            group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.classList.add("slide-group");
            group.setAttribute("data-slide-index", Model.getSlideIndex(slide).toString());
            svg.appendChild(group);
        }
        // Clear previous lines
        group.innerHTML = "";
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var lane = _a[_i];
            (0, exports.drawLane)(group, lane);
        }
    };
    exports.drawSlide = drawSlide;
    var setAttributes = function (element, attributes) {
        for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            switch (key) {
                case "tag":
                    // Ignore
                    break;
                case "textContent":
                    element.textContent = value.toString();
                    break;
                default:
                    element.setAttribute(key, value.toString());
                    break;
            }
        }
        return element;
    };
    exports.setAttributes = setAttributes;
    var makeSvgElement = function (source) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", source.tag);
        (0, exports.setAttributes)(element, source);
        return element;
    };
    exports.makeSvgElement = makeSvgElement;
    var makeSureSvgElement = function (parent, selector, source) {
        var element = parent.querySelector(selector);
        if (!element) {
            element = (0, exports.makeSvgElement)(source);
            parent.appendChild(element);
        }
        return element;
    };
    exports.makeSureSvgElement = makeSureSvgElement;
    var drawLane = function (group, lane) {
        var _a;
        var laneIndex = Model.getLaneIndex(lane);
        var left = exports.LaneWidths.slice(0, laneIndex).reduce(function (a, b) { return a + b; }, 0);
        var width = config_json_3.default.render.ruler.laneWidth;
        ;
        exports.LaneWidths[laneIndex] = width;
        group.append((0, exports.makeSvgElement)({
            tag: "rect",
            class: "lane-background",
            x: left,
            y: 0,
            width: width,
            height: group.ownerSVGElement.viewBox.baseVal.height,
            fill: config_json_3.default.render.ruler.laneBackgroundColor,
        }), (0, exports.makeSvgElement)({
            tag: "text",
            class: "lane-label",
            x: left + 8,
            y: 20,
            fill: "#000000",
            "font-size": 16,
            textContent: (_a = lane.name) !== null && _a !== void 0 ? _a : "Lane ".concat(laneIndex),
        }), (0, exports.makeSvgElement)({
            tag: "line",
            class: "lane-separator",
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement.viewBox.baseVal.height,
            stroke: config_json_3.default.render.ruler.laneSeparatorColor,
            "stroke-width": config_json_3.default.render.ruler.laneSeparatorWidth,
        }));
    };
    exports.drawLane = drawLane;
    var drawTick = function (view, group, lane, value, type) {
        var laneIndex = Model.getLaneIndex(lane);
        var tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.classList.add("tick", "tick-".concat(type));
        var left = exports.LaneWidths.slice(0, laneIndex).reduce(function (a, b) { return a + b; }, 0);
        var position = Model.getPositionAt(lane, Type.getNamedNumberValue(value), view);
        var isRootSlide = Model.isRooeSlide(Model.getSlideFromLane(lane));
        if (isRootSlide) {
            var width = config_json_3.default.render.ruler.laneWidth;
            ;
            var right = left + width;
            tick.setAttribute("x1", right.toString());
            tick.setAttribute("y1", position.toString());
            tick.setAttribute("x2", (right - config_json_3.default.render.ruler.tick[type].length).toString());
            tick.setAttribute("y2", position.toString());
        }
        else {
            tick.setAttribute("x1", (left).toString());
            tick.setAttribute("y1", position.toString());
            tick.setAttribute("x2", (left + config_json_3.default.render.ruler.tick[type].length).toString());
            tick.setAttribute("y2", position.toString());
        }
        tick.setAttribute("stroke", config_json_3.default.render.ruler.tick[type].color);
        tick.setAttribute("stroke-width", config_json_3.default.render.ruler.tick[type].toString());
        group.appendChild(tick);
        if (type === "long") {
            var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.classList.add("tick-label");
            if (isRootSlide) {
                var width = config_json_3.default.render.ruler.laneWidth;
                ;
                var right = left + width;
                label.setAttribute("x", (right - config_json_3.default.render.ruler.tick[type].length - 4).toString());
            }
            else {
                label.setAttribute("x", (left + config_json_3.default.render.ruler.tick[type].length + 4).toString());
            }
            label.setAttribute("y", (position + 4).toString());
            label.setAttribute("fill", "#000000");
            label.setAttribute("font-size", "12");
            label.setAttribute("text-anchor", Model.isRooeSlide(Model.getSlideFromLane(lane)) ? "end" : "start");
            label.textContent = Type.getNamedNumberLabel(value);
            group.appendChild(label);
        }
    };
    exports.drawTick = drawTick;
    var drawAnkorLine = function (position) {
        var svg = UI.rulerSvg;
        var line = (0, exports.makeSureSvgElement)(svg, "line.ankor-line", {
            tag: "line",
            class: "ankor-line",
        });
        line.setAttribute("x1", "0");
        line.setAttribute("y1", position.toString());
        line.setAttribute("x2", svg.viewBox.baseVal.width.toString());
        line.setAttribute("y2", position.toString());
        //const color = "red";
        var color = config_json_3.default.render.ruler.lineColor;
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", config_json_3.default.render.ruler.lineWidth.toString());
        var dragHandle = (0, exports.makeSureSvgElement)(svg, "circle.ankor-drag-handle", {
            tag: "circle",
            class: "ankor-drag-handle",
        });
        var handleRadius = 24;
        dragHandle.setAttribute("cx", (svg.viewBox.baseVal.width - handleRadius).toString());
        dragHandle.setAttribute("cy", position.toString());
        dragHandle.setAttribute("r", handleRadius.toString());
        dragHandle.setAttribute("fill", color);
    };
    exports.drawAnkorLine = drawAnkorLine;
    var resize = function () {
        var svg = UI.rulerSvg;
        document.body;
        svg.setAttribute("width", document.body.clientWidth.toString());
        svg.setAttribute("height", document.body.clientHeight.toString());
        svg.setAttribute("viewBox", "0 0 ".concat(document.body.clientWidth, " ").concat(document.body.clientHeight));
    };
    exports.resize = resize;
    var initialize = function () {
        (0, exports.resize)();
    };
    exports.initialize = initialize;
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
define("script/event", ["require", "exports", "script/type", "script/view", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph"], function (require, exports, Type, View, UI, Render, Ruler, Grid, Graph) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.updateScaleModeRoundBar = exports.updateViewModeRoundBar = void 0;
    Type = __importStar(Type);
    View = __importStar(View);
    UI = __importStar(UI);
    Render = __importStar(Render);
    Ruler = __importStar(Ruler);
    Grid = __importStar(Grid);
    Graph = __importStar(Graph);
    var updateViewModeRoundBar = function () { return UI.updateRoundBar(UI.viewModeButton, {
        low: 0 / Type.viewModeList.length,
        high: 1 / Type.viewModeList.length,
        rotate: Type.viewModeList.indexOf(View.getViewMode()) / Type.viewModeList.length,
    }); };
    exports.updateViewModeRoundBar = updateViewModeRoundBar;
    var updateScaleModeRoundBar = function () { return UI.updateRoundBar(UI.scaleModeButton, {
        low: 0 / Type.scaleModeList.length,
        high: 1 / Type.scaleModeList.length,
        rotate: Type.scaleModeList.indexOf(View.getScaleMode()) / Type.scaleModeList.length,
    }); };
    exports.updateScaleModeRoundBar = updateScaleModeRoundBar;
    var initialize = function () {
        console.log("Event initialized");
        window.addEventListener("resize", function () {
            Ruler.resize();
            Render.markDirty();
        });
        UI.viewModeButton.addEventListener("click", function () {
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
        UI.scaleModeButton.addEventListener("click", function () {
            var current = View.getScaleMode();
            var next = Type.getNext(Type.scaleModeList, current);
            View.setScaleMode(next);
            (0, exports.updateScaleModeRoundBar)();
            Render.markDirty();
            console.log("Scale mode changed: ".concat(current, " -> ").concat(next));
        });
        (0, exports.updateViewModeRoundBar)();
        (0, exports.updateScaleModeRoundBar)();
    };
    exports.initialize = initialize;
});
define("script/index", ["require", "exports", "script/url", "script/type", "script/ui", "script/model", "script/view", "script/event", "script/ruler", "script/render"], function (require, exports, Url, Type, UI, Model, View, Event, Ruler, Render) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Url = __importStar(Url);
    Type = __importStar(Type);
    UI = __importStar(UI);
    Model = __importStar(Model);
    View = __importStar(View);
    Event = __importStar(Event);
    Ruler = __importStar(Ruler);
    Render = __importStar(Render);
    console.log("🚀 Slide Rule build script");
    Type;
    Url.initialize();
    UI.initialize();
    Model.initialize();
    View.initialize();
    Event.initialize();
    Ruler.initialize();
    Render.setRenderer(Ruler.renderer);
    Render.markDirty();
});
//# sourceMappingURL=index.js.map