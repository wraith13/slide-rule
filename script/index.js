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
    exports.getViewScale = exports.scaleModeList = exports.viewModeList = exports.getNext = exports.getNamedNumberLabel = exports.getNamedNumberValue = exports.phi = exports.isNamedNumber = exports.namedNumberList = void 0;
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
    exports.scaleModeList = ["logarithmic", "linear"];
    var getViewScale = function (view) { return Math.pow(10, view.viewScaleExponent); };
    exports.getViewScale = getViewScale;
});
define("script/ui", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.viewScaleRange = exports.viewScalePanel = exports.viewScaleButton = exports.scaleModeButton = exports.viewModeButton = exports.controlPanel = exports.graphView = exports.gridView = exports.rulerSvg = exports.rulerView = exports.viewList = exports.updateRoundBar = exports.setStyle = exports.setAttribute = exports.setTextContent = exports.setAriaHidden = void 0;
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
    exports.viewList = getHtmlElementById("div", "view-list");
    exports.rulerView = getHtmlElementById("div", "ruler-view");
    exports.rulerSvg = getSvgElementById("svg", "ruler-svg");
    exports.gridView = getHtmlElementById("div", "grid-view");
    exports.graphView = getHtmlElementById("div", "graph-view");
    exports.controlPanel = getHtmlElementById("div", "control-panel");
    exports.viewModeButton = getHtmlElementById("button", "view-mode-button");
    exports.scaleModeButton = getHtmlElementById("button", "scale-mode-button");
    exports.viewScaleButton = getHtmlElementById("button", "view-scale-button");
    exports.viewScalePanel = getHtmlElementById("div", "view-scale-panel");
    exports.viewScaleRange = getHtmlElementById("input", "view-scale-range");
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
    "applicationTitle": "Smart Rule",
    "repositoryUrl": "https://github.com/wraith13/slide-rule/",
    "canonicalUrl": "https://wraith13.github.io/slide-rule/",
    "description": "Smart Slide Rule Web App",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "model": {
        "lane": {
            "root": {
                "type": "logarithmic",
                "isInverted": false,
                "logScale": "e"
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
        },
        "defaultZoomLevel": 3,
        "zoomRate": 0.001,
        "zooomUnit": 0.25,
        "minZoomLevel": 0.75,
        "maxZoomLevel": 10,
        "scrollUnit": 10,
        "touchZoomThreshold": 20
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
            "tickDensityThreshold5": 10,
            "tickDensityThreshold10": 25
        }
    }
});
define("script/model", ["require", "exports", "script/number", "script/type", "script/url", "resource/config"], function (require, exports, Number, Type, Url, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.makeSure = exports.removeLane = exports.makeLane = exports.addLane = exports.getSlideFromLane = exports.getLane = exports.getLaneAndSlide = exports.makeSureSlide = exports.makeSlide = exports.getLaneIndex = exports.getSlideIndex = exports.isRootSlide = exports.getRootSlide = exports.isRootLane = exports.getRootLane = exports.makeRootLane = exports.designTicks = exports.designTicks10 = exports.getFirstLabelValue = exports.getWidth = exports.getPositionAt = exports.getValueAt = exports.getAllLanes = exports.RootLaneIndex = exports.data = void 0;
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
        var viewScale = Type.getViewScale(view);
        switch (lane.type) {
            case "logarithmic":
                if ("logarithmic" === view.scaleMode) {
                    var logScale = Type.getNamedNumberValue(lane.logScale);
                    var value = Math.pow(logScale, (position + lane.offset) / viewScale);
                    // console.log(`getValueAt: lane: ${lane.name ?? "unnamed"}, position: ${position}, offset: ${lane.offset}, value: ${value}`);
                    // console.log(`logScale: ${logScale}, viewScale: ${viewScale}`);
                    return lane.isInverted ? (logScale - value) : value;
                }
                else // linear
                 {
                    var value = (position + lane.offset) / viewScale;
                    return lane.isInverted ? (Type.getNamedNumberValue(lane.logScale) - value) : value;
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getValueAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getValueAt = getValueAt;
    var getPositionAt = function (lane, value, view) {
        var viewScale = Type.getViewScale(view);
        switch (lane.type) {
            case "logarithmic":
                if ("logarithmic" === view.scaleMode) {
                    var logScale = Type.getNamedNumberValue(lane.logScale);
                    var position = Math.log(value) / Math.log(logScale) * viewScale;
                    return (lane.isInverted ? (Math.log(logScale - value) / Math.log(logScale) * viewScale) : position) - lane.offset;
                }
                else // linear
                 {
                    var position = value * viewScale;
                    return (lane.isInverted ? ((Type.getNamedNumberValue(lane.logScale) - value) * viewScale) : position) - lane.offset;
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getPositionAt not implemented for lane type: ".concat(lane.type));
        }
    };
    exports.getPositionAt = getPositionAt;
    var getWidth = function (lane, bottom, top, view) {
        return (0, exports.getPositionAt)(lane, top, view) - (0, exports.getPositionAt)(lane, bottom, view);
    };
    exports.getWidth = getWidth;
    var getFirstLabelValue = function (lane, view) {
        var viewScale = Type.getViewScale(view);
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
                    var labelValueUnit = viewScale * 10;
                    var firstLabelValue = Math.floor(minValue / labelValueUnit) * labelValueUnit;
                    return { firstLabelValue: firstLabelValue, labelValueUnit: labelValueUnit, };
                }
            default:
                throw new Error("\uD83E\uDD8B FIXME: getFirstLabelValue not implemented for scale mode: ".concat(view.scaleMode));
        }
    };
    exports.getFirstLabelValue = getFirstLabelValue;
    var designTicks10 = function (view, lane, base, unit, parent) {
        var height = window.innerHeight;
        var min = (0, exports.getValueAt)(lane, 0, view);
        var max = (0, exports.getValueAt)(lane, height, view);
        var ticks = [];
        if (0 < base && base <= max && min <= (base + unit)) {
            var width = (0, exports.getWidth)(lane, base, base + unit, view);
            switch (true) {
                case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                    ticks.push.apply(ticks, (0, exports.designTicks10)(view, lane, base, unit / 10, { index: 0, width: width }));
                    break;
                case config_json_1.default.render.ruler.tickDensityThreshold5 <= width:
                    ticks.push({ value: base + (unit * 0.5), type: "mini", });
                    break;
            }
        }
        for (var b = 1; b <= 9; ++b) {
            var value = base + (unit * b);
            var nextValue = base + (unit * (b + 1));
            if (min < nextValue) {
                if (max < value) {
                    break;
                }
                var width = (0, exports.getWidth)(lane, value, nextValue, view);
                switch (true) {
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        ticks.push({ value: value, type: "long", });
                        ticks.push.apply(ticks, (0, exports.designTicks10)(view, lane, value, unit / 10, { index: b, width: width }));
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
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        break;
                    default:
                        if (config_json_1.default.render.ruler.tickDensityThreshold5 <= width) {
                            ticks.push({ value: value + (unit * 0.5), type: "mini", });
                        }
                        break;
                }
            }
        }
        return ticks.filter(function (tick) { return min <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= max; });
    };
    exports.designTicks10 = designTicks10;
    var designTicks = function (view, lane) {
        var viewScale = Type.getViewScale(view);
        var height = window.innerHeight;
        var min = (0, exports.getValueAt)(lane, 0, view);
        var max = (0, exports.getValueAt)(lane, height, view);
        var ticks = [];
        switch (view.scaleMode) {
            case "logarithmic":
                {
                    var beginDigit = Math.floor(Math.log10(min));
                    var endDigit = Math.ceil(Math.log10(max));
                    var scale = 10;
                    // const begin = Math.pow(10, beginDigit);
                    // const end = Math.pow(10, endDigit);
                    for (var digit = beginDigit; digit <= endDigit; ++digit) {
                        var a = Math.pow(10, digit);
                        var width = (0, exports.getWidth)(lane, a, a * scale, view);
                        switch (true) {
                            case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                                ticks.push.apply(ticks, (0, exports.designTicks10)(view, lane, 0, a, { index: 0, width: width }));
                                break;
                            case config_json_1.default.render.ruler.tickDensityThreshold5 <= width:
                                ticks.push({
                                    value: a,
                                    type: "long",
                                    color: Math.abs(digit) % 3 === 0 ? undefined : "gray",
                                });
                                ticks.push({ value: a * 5, type: "medium", });
                                break;
                            default:
                                ticks.push({
                                    value: a,
                                    type: "long",
                                    color: Math.abs(digit) % 3 === 0 ? undefined : "gray",
                                });
                                break;
                        }
                    }
                }
                break;
            case "linear":
                {
                    var labelUnit = viewScale * 10;
                    for (var value = Math.ceil(min / labelUnit) * labelUnit; value <= max; value += labelUnit) {
                        ticks.push({ value: value, type: "long", });
                        for (var i = 1; i < 10; ++i) {
                            var minorValue = value + labelUnit * i / 10;
                            if (minorValue <= max) {
                                ticks.push({
                                    value: minorValue,
                                    type: 5 !== i ? "short" : "medium",
                                });
                            }
                        }
                    }
                }
                break;
            default:
                throw new Error("\uD83E\uDD8B FIXME: designTicks not implemented for scale mode: ".concat(view.scaleMode));
        }
        if (100 < viewScale) {
            Type.namedNumberList.forEach(function (value) {
                var actualNumber = Type.getNamedNumberValue(value);
                if (min <= actualNumber && actualNumber <= max) {
                    ticks.push({ value: value, type: "long", color: "blue" });
                }
            });
        }
        // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${Type.getNamedNumberValue(tick.value)} (${tick.type})`).join(", ")}`);
        // console.log(`min: ${min}, max: ${max}`);
        return ticks.filter(function (tick) { return min <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= max; });
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
    var getRootLane = function () {
        return (0, exports.getLane)(exports.RootLaneIndex);
    };
    exports.getRootLane = getRootLane;
    var isRootLane = function (indexOrLane) {
        return (typeof indexOrLane === "number" ? exports.RootLaneIndex : (0, exports.getLane)(exports.RootLaneIndex)) === indexOrLane;
    };
    exports.isRootLane = isRootLane;
    var getRootSlide = function () {
        return exports.data.slides[0];
    };
    exports.getRootSlide = getRootSlide;
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
    exports.initialize = exports.setScaleMode = exports.isLinearScale = exports.isLogarithmicScale = exports.getScaleMode = exports.setViewScaleExponent = exports.getViewScale = exports.setViewMode = exports.isGraphView = exports.isGridView = exports.isRulerView = exports.getViewMode = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    UI = __importStar(UI);
    config_json_2 = __importDefault(config_json_2);
    exports.data = {
        viewMode: "ruler",
        viewScaleExponent: 3,
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
    var getViewScale = function () { return Math.pow(10, exports.data.viewScaleExponent); };
    exports.getViewScale = getViewScale;
    var setViewScaleExponent = function (exponent) {
        exports.data.viewScaleExponent = exponent;
        //data.viewScale = Math.pow(10, exponent);
        Url.addParameter("view-scale", exponent.toString());
    };
    exports.setViewScaleExponent = setViewScaleExponent;
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
        (0, exports.setViewScaleExponent)((_g = Number.parse(Url.get("view-scale"))) !== null && _g !== void 0 ? _g : exports.data.viewScaleExponent);
        exports.data.baseOfLogarithm = (_l = (_h = Number.orUndefined(Type.getNamedNumberValue(Url.get("base")))) !== null && _h !== void 0 ? _h : (_k = (_j = config_json_2.default.view) === null || _j === void 0 ? void 0 : _j.baseOfLogarithm) === null || _k === void 0 ? void 0 : _k.default) !== null && _l !== void 0 ? _l : 10;
        console.log("View initialized: mode=".concat(exports.data.viewMode, ", scale=").concat(exports.data.viewScaleExponent, ", scaleMode=").concat(exports.data.scaleMode, ", base=").concat(exports.data.baseOfLogarithm));
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
define("script/element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSelector = exports.setAttributes = void 0;
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
                case "textContent":
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
define("script/svg", ["require", "exports", "script/element"], function (require, exports, ELEMENT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeSure = exports.make = exports.makeSelector = exports.setAttributes = exports.makeElement = void 0;
    ELEMENT = __importStar(ELEMENT);
    var makeElement = function (tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };
    exports.makeElement = makeElement;
    exports.setAttributes = ELEMENT.setAttributes;
    exports.makeSelector = ELEMENT.makeSelector;
    var make = function (source) {
        return (0, exports.setAttributes)((0, exports.makeElement)(source.tag), source);
    };
    exports.make = make;
    var makeSure = function (parent, source) {
        var _a;
        return (_a = parent.querySelector((0, exports.makeSelector)(source))) !== null && _a !== void 0 ? _a : parent.appendChild((0, exports.make)(source));
    };
    exports.makeSure = makeSure;
});
define("script/ruler", ["require", "exports", "script/type", "script/ui", "script/model", "script/svg", "resource/config"], function (require, exports, Type, UI, Model, SVG, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.resize = exports.drawAnkorLine = exports.drawTick = exports.makeNumberLabel = exports.drawLane = exports.drawSlide = exports.renderer = exports.LaneWidths = exports.scale = void 0;
    Type = __importStar(Type);
    UI = __importStar(UI);
    Model = __importStar(Model);
    SVG = __importStar(SVG);
    config_json_3 = __importDefault(config_json_3);
    exports.scale = 1.0;
    exports.LaneWidths = [];
    var renderer = function (model, view, dirty) {
        if (false !== dirty) {
            for (var _i = 0, _a = model.slides; _i < _a.length; _i++) {
                var slide = _a[_i];
                if ("boolean" === typeof dirty || dirty.has(Model.getSlideIndex(slide))) {
                    (0, exports.drawSlide)(view, slide);
                }
            }
            if (true === dirty || dirty.has(-1)) {
                (0, exports.drawAnkorLine)(model.anchor);
            }
        }
    };
    exports.renderer = renderer;
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
            (0, exports.drawLane)(view, group, lane);
        }
    };
    exports.drawSlide = drawSlide;
    var drawLane = function (view, group, lane) {
        var _a;
        var laneIndex = Model.getLaneIndex(lane);
        var left = exports.LaneWidths.slice(0, laneIndex).reduce(function (a, b) { return a + b; }, 0);
        var width = config_json_3.default.render.ruler.laneWidth;
        ;
        exports.LaneWidths[laneIndex] = width;
        group.append(SVG.make({
            tag: "rect",
            class: "lane-background",
            x: left,
            y: 0,
            width: width,
            height: group.ownerSVGElement.viewBox.baseVal.height,
            fill: config_json_3.default.render.ruler.laneBackgroundColor,
        }), SVG.make({
            tag: "text",
            class: "lane-label",
            x: left + 8,
            y: 20,
            fill: "#000000",
            "font-size": 16,
            textContent: (_a = lane.name) !== null && _a !== void 0 ? _a : "Lane ".concat(laneIndex),
        }), SVG.make({
            tag: "line",
            class: "lane-separator",
            x1: left + width,
            y1: 0,
            x2: left + width,
            y2: group.ownerSVGElement.viewBox.baseVal.height,
            stroke: config_json_3.default.render.ruler.laneSeparatorColor,
            "stroke-width": config_json_3.default.render.ruler.laneSeparatorWidth,
        }));
        Model.designTicks(view, lane).forEach(function (tick) { return (0, exports.drawTick)(view, group, lane, tick); });
    };
    exports.drawLane = drawLane;
    var makeNumberLabel = function (value) {
        if (Type.isNamedNumber(value)) {
            return Type.getNamedNumberLabel(value);
        }
        else {
            if (value < 0.000001 || 1000000 <= value) {
                return Type.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 4, maximumSignificantDigits: 4, });
            }
            else {
                return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: 8, });
            }
        }
    };
    exports.makeNumberLabel = makeNumberLabel;
    var drawTick = function (view, group, lane, tick) {
        var _a, _b;
        var laneIndex = Model.getLaneIndex(lane);
        var position = Model.getPositionAt(lane, Type.getNamedNumberValue(tick.value), view);
        var isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
        var width = config_json_3.default.render.ruler.laneWidth;
        ;
        var left = exports.LaneWidths.slice(0, laneIndex).reduce(function (a, b) { return a + b; }, 0);
        var right = left + width;
        group.appendChild(SVG.make({
            tag: "line",
            class: "tick tick-".concat(tick.type),
            x1: isRootSlide ? right : left,
            y1: position,
            x2: isRootSlide ? right - config_json_3.default.render.ruler.tick[tick.type].length : left + config_json_3.default.render.ruler.tick[tick.type].length,
            y2: position,
            // stroke: config.render.ruler.tick[tick.type].color,
            stroke: (_a = tick.color) !== null && _a !== void 0 ? _a : config_json_3.default.render.ruler.tick[tick.type].color,
            "stroke-width": config_json_3.default.render.ruler.tick[tick.type].width,
        }));
        if (tick.type === "long") {
            group.appendChild(SVG.make({
                tag: "text",
                class: "tick-label",
                x: isRootSlide ? right - config_json_3.default.render.ruler.tick[tick.type].length - 4 : left + config_json_3.default.render.ruler.tick[tick.type].length + 4,
                y: position + 4,
                //fill: config.render.ruler.tick[tick.type].color,
                fill: (_b = tick.color) !== null && _b !== void 0 ? _b : config_json_3.default.render.ruler.tick[tick.type].color,
                "font-size": 12,
                "text-anchor": isRootSlide ? "end" : "start",
                textContent: (0, exports.makeNumberLabel)(tick.value),
            }));
        }
    };
    exports.drawTick = drawTick;
    var drawAnkorLine = function (position) {
        var svg = UI.rulerSvg;
        //const color = "red";
        var color = config_json_3.default.render.ruler.lineColor;
        var handleRadius = 24;
        SVG.setAttributes(SVG.makeSure(svg, {
            tag: "line",
            class: "ankor-line",
        }), {
            x1: 0,
            y1: position,
            x2: svg.viewBox.baseVal.width,
            y2: position,
            stroke: color,
            "stroke-width": config_json_3.default.render.ruler.lineWidth,
        });
        SVG.setAttributes(SVG.makeSure(svg, {
            tag: "circle",
            class: "ankor-drag-handle",
        }), {
            cx: svg.viewBox.baseVal.width - handleRadius,
            cy: position,
            r: handleRadius,
            fill: color,
        });
    };
    exports.drawAnkorLine = drawAnkorLine;
    var resize = function () { return SVG.setAttributes(UI.rulerSvg, {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        viewBox: "0 0 ".concat(document.body.clientWidth, " ").concat(document.body.clientHeight),
    }); };
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
define("script/event", ["require", "exports", "script/type", "script/environment", "script/view", "script/model", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph", "resource/config"], function (require, exports, Type, Environment, View, Model, UI, Render, Ruler, Grid, Graph, config_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.resetZoom = exports.scroll = exports.zoomByRange = exports.zoom = exports.zoomOut = exports.zoomIn = exports.updateViewScaleRoundBar = exports.getViewScaleExponentFromRate = exports.getViewScaleRate = exports.updateScaleModeRoundBar = exports.updateViewModeRoundBar = void 0;
    Type = __importStar(Type);
    Environment = __importStar(Environment);
    View = __importStar(View);
    Model = __importStar(Model);
    UI = __importStar(UI);
    Render = __importStar(Render);
    Ruler = __importStar(Ruler);
    Grid = __importStar(Grid);
    Graph = __importStar(Graph);
    config_json_4 = __importDefault(config_json_4);
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
    var getViewScaleRate = function () {
        return (View.data.viewScaleExponent - config_json_4.default.view.minZoomLevel) / (config_json_4.default.view.maxZoomLevel - config_json_4.default.view.minZoomLevel);
    };
    exports.getViewScaleRate = getViewScaleRate;
    var getViewScaleExponentFromRate = function (rate) {
        return config_json_4.default.view.minZoomLevel + (rate * (config_json_4.default.view.maxZoomLevel - config_json_4.default.view.minZoomLevel));
    };
    exports.getViewScaleExponentFromRate = getViewScaleExponentFromRate;
    var updateViewScaleRoundBar = function () {
        UI.updateRoundBar(UI.viewScaleButton, {
            low: 0,
            high: (0, exports.getViewScaleRate)(),
            rotate: 0,
        });
        UI.viewScaleRange.value = ((0, exports.getViewScaleRate)() * 100).toString();
    };
    exports.updateViewScaleRoundBar = updateViewScaleRoundBar;
    var zoomIn = function () {
        return (0, exports.zoom)(config_json_4.default.view.zooomUnit);
    };
    exports.zoomIn = zoomIn;
    var zoomOut = function () {
        return (0, exports.zoom)(-config_json_4.default.view.zooomUnit);
    };
    exports.zoomOut = zoomOut;
    var zoom = function (delta) {
        var current = View.data.viewScaleExponent;
        var next = Math.min(config_json_4.default.view.maxZoomLevel, Math.max(config_json_4.default.view.minZoomLevel, current + delta));
        var lane = Model.getRootLane();
        var anchorValue = Model.getValueAt(lane, Model.data.anchor, View.data);
        View.setViewScaleExponent(next);
        var newAnchorPosition = Model.getPositionAt(lane, anchorValue, View.data);
        (0, exports.scroll)(newAnchorPosition - Model.data.anchor);
        Render.markDirty();
        (0, exports.updateViewScaleRoundBar)();
        console.log("Zoomed(".concat(delta, "): ").concat(current, " -> ").concat(next));
    };
    exports.zoom = zoom;
    var zoomByRange = function (value) {
        return (0, exports.zoom)((0, exports.getViewScaleExponentFromRate)(value * 0.01) - View.data.viewScaleExponent);
    };
    exports.zoomByRange = zoomByRange;
    var scroll = function (delta) {
        var rootLane = Model.getRootLane();
        var current = rootLane.offset;
        var next = current + delta;
        rootLane.offset = next;
        Render.markDirty();
        console.log("Scrolled(".concat(delta, "): ").concat(current, " -> ").concat(next));
    };
    exports.scroll = scroll;
    var resetZoom = function () {
        var current = View.data.viewScaleExponent;
        var next = config_json_4.default.view.defaultZoomLevel;
        View.setViewScaleExponent(next);
        Render.markDirty();
        console.log("Zoom reset: ".concat(current, " -> ").concat(next));
    };
    exports.resetZoom = resetZoom;
    var touchZoomPreviousDistance = null;
    var activeTouches = new Map();
    var initialize = function () {
        console.log("Event initialized");
        window.addEventListener("resize", function () {
            Ruler.resize();
            Render.markDirty();
        });
        window.addEventListener("wheel", function (event) {
            if (Environment.isApple() ? event.metaKey : event.ctrlKey) {
                event.preventDefault();
                (0, exports.zoom)(event.deltaY * config_json_4.default.view.zoomRate);
            }
            else {
                (0, exports.scroll)(event.deltaY);
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
                        (0, exports.scroll)(-config_json_4.default.view.scrollUnit);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        (0, exports.scroll)(config_json_4.default.view.scrollUnit);
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
            event.preventDefault();
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
        UI.viewList.addEventListener("pointermove", function (event) {
            //if ("touch" === event.pointerType)
            //{
            if (activeTouches.has(event.pointerId)) {
                activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
                if (1 === activeTouches.size) {
                    (0, exports.scroll)(-event.movementY);
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
                            if (Math.abs(delta) <= config_json_4.default.view.touchZoomThreshold) {
                                (0, exports.zoom)(delta * config_json_4.default.view.zoomRate);
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
            //}
        }, {
            passive: false,
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
        UI.viewScaleRange.addEventListener("input", function () { return (0, exports.zoomByRange)(UI.viewScaleRange.valueAsNumber); });
        UI.viewScaleRange.addEventListener("change", function () { return (0, exports.zoomByRange)(UI.viewScaleRange.valueAsNumber); });
        (0, exports.updateViewModeRoundBar)();
        (0, exports.updateScaleModeRoundBar)();
        (0, exports.updateViewScaleRoundBar)();
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