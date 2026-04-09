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
    exports.getViewScale = exports.viewModeList = exports.getNext = exports.getNamedNumberLabel = exports.getNamedNumberValue = exports.phi = exports.isNamedNumber = exports.namedNumberList = void 0;
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
define("script/ui", ["require", "exports", "script/html", "script/svg"], function (require, exports, HTML, SVG) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.viewScaleRange = exports.viewScalePanel = exports.viewScaleButton = exports.viewModeButton = exports.controlPanel = exports.rulerHelpPanel = exports.addCotangentLaneButton = exports.addTangentLaneButton = exports.addCosineLaneButton = exports.addSineLaneButton = exports.addSquaredLaneButton = exports.addInvertLaneButton = exports.addLaneButton = exports.addSlideButton = exports.rulerNewSlidePanel = exports.graphView = exports.gridView = exports.rulerOverlay = exports.rulerSvg = exports.rulerView = exports.viewList = exports.updateRoundBar = exports.setAriaHidden = void 0;
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
    exports.addLaneButton = HTML.getElementById("button", "add-lane-button");
    exports.addInvertLaneButton = HTML.getElementById("button", "add-invert-lane-button");
    exports.addSquaredLaneButton = HTML.getElementById("button", "add-squared-lane-button");
    exports.addSineLaneButton = HTML.getElementById("button", "add-sine-lane-button");
    exports.addCosineLaneButton = HTML.getElementById("button", "add-cosine-lane-button");
    exports.addTangentLaneButton = HTML.getElementById("button", "add-tangent-lane-button");
    exports.addCotangentLaneButton = HTML.getElementById("button", "add-cotangent-lane-button");
    exports.rulerHelpPanel = HTML.getElementById("div", "ruler-help-panel");
    exports.controlPanel = HTML.getElementById("div", "control-panel");
    exports.viewModeButton = HTML.getElementById("button", "view-mode-button");
    exports.viewScaleButton = HTML.getElementById("button", "view-scale-button");
    exports.viewScalePanel = HTML.getElementById("div", "view-scale-panel");
    exports.viewScaleRange = HTML.getElementById("input", "view-scale-range");
    var initialize = function () {
        console.log("UI initialized");
    };
    exports.initialize = initialize;
});
define("script/number", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxMin = exports.minMax = exports.clamp = exports.MIN_VALUE = exports.MAX_VALUE = exports.ceilTo1Mantissa = exports.floorTo1Mantissa = exports.orUndefined = exports.parse = void 0;
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
                "logScale": "e"
            },
            "presets": {
                "x": {
                    "type": "logarithmic",
                    "logScale": "e"
                },
                "1/x": {
                    "type": "invert",
                    "logScale": "e"
                },
                "x^2": {
                    "type": "squared",
                    "logScale": "e"
                },
                "A": {
                    "type": "logarithmic",
                    "logScale": 2
                },
                "B": {
                    "type": "logarithmic",
                    "logScale": 2
                },
                "C": {
                    "type": "logarithmic",
                    "logScale": 1
                },
                "D": {
                    "type": "logarithmic",
                    "logScale": 1
                },
                "CI": {
                    "type": "logarithmic",
                    "logScale": 1
                },
                "DI": {
                    "type": "logarithmic",
                    "logScale": 1
                },
                "K": {
                    "type": "logarithmic",
                    "logScale": 3
                },
                "L": {
                    "type": "linear",
                    "logScale": "e"
                },
                "S": {
                    "type": "sine",
                    "logScale": 1
                },
                "T": {
                    "type": "tangent",
                    "logScale": 1
                },
                "ST": {
                    "type": "small-tangent",
                    "logScale": 1
                },
                "P": {
                    "type": "power",
                    "logScale": 2
                },
                "LL": {
                    "type": "log-log",
                    "logScale": "e"
                }
            }
        },
        "defaultCursor": 1
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
        "minZoomLevel": 0.25,
        "maxZoomLevel": 7.25,
        "scrollUnit": 10,
        "touchZoomThreshold": 20
    },
    "render": {
        "ruler": {
            "backgroundColor": "#FFFFFF",
            "lineColor": "#BB0000",
            "lineWidth": 1,
            "laneBackgroundColor": "#F0F0F0",
            "laneWidth": 150,
            "slideSeparatorColor": "#444444",
            "laneSeparatorColor": "#CCCCCC",
            "laneSeparatorWidth": 1,
            "minErrorAreaColor": "rgba(160, 0, 160, 0.6)",
            "maxErrorAreaColor": "rgba(255, 0, 0, 0.6)",
            "laneLabelBackgroundColor": "rgba(255, 255, 255, 0.85)",
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
            "tickDensityThreshold5": 20,
            "tickDensityThreshold10": 50
        }
    }
});
define("script/model", ["require", "exports", "script/number", "script/type", "script/url", "resource/config"], function (require, exports, Number, Type, Url, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getLaneContext = exports.getCursorValues = exports.getCursorValue = exports.getCursorPosition = exports.makeSure = exports.removeLane = exports.makeLane = exports.addLane = exports.getSlideFromLane = exports.getLane = exports.getLastSlideAndLastLane = exports.getSlideAndLane = exports.makeSureSlide = exports.makeSlide = exports.getLaneIndex = exports.getSlideIndexFromLane = exports.getSlideIndex = exports.isRootSlide = exports.getRootSlideAndRootLane = exports.getRootSlide = exports.isPrimaryLane = exports.isRootLane = exports.getRootLane = exports.makeRootLane = exports.designTicks = exports.designTicks10 = exports.makeTickWindowFromPosition = exports.makeTickWindowFromView = exports.makeTickWindow = exports.getSnapReferenceLaneIndex = exports.getWidth = exports.getPositionAt = exports.getSlideOffset = exports.getAnchorSlideAndLane = exports.getRawPositionAt = exports.getValueAt = exports.getPrimaryPositionAt = exports.getPrimaryValueAt = exports.isInvertLane = exports.getAllLanes = exports.getAllLaneCount = exports.RootLaneIndex = exports.RootSlideIndex = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    config_json_1 = __importDefault(config_json_1);
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
            if ("invert" === i.type) {
                result = !result;
            }
            if (i === lane) {
                break;
            }
        }
        return result;
    };
    exports.isInvertLane = isInvertLane;
    var getPrimaryValueAt = function (lane, position) {
        switch (lane.type) {
            case "logarithmic":
                return position;
            case "invert":
                return 1 / position;
            case "squared":
                return Math.pow(position, 2);
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
        switch (lane.type) {
            case "logarithmic":
                return value;
            case "invert":
                return 1 / value;
            case "squared":
                return Math.sqrt(value);
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
            var logScale = Type.getNamedNumberValue(lane.logScale);
            var rawPosition = Math.pow(logScale, (position - offset) / viewScale);
            var value = rawPosition;
            for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
                var i = _a[_i];
                value = (0, exports.getPrimaryValueAt)(i, value);
                if (i === lane) {
                    break;
                }
            }
            return value;
            //return getPrimaryValueAt(lane, rawPosition);
        }
        catch (error) {
            console.error("Error in getValueAt: ".concat(error));
            return undefined;
        }
    };
    exports.getValueAt = getValueAt;
    var getRawPositionAt = function (lane, value, view) {
        var viewScale = Type.getViewScale(view);
        var logScale = Type.getNamedNumberValue(lane.logScale);
        var scale = viewScale / Math.log(logScale);
        //return scale *Math.log(getPrimaryPositionAt(lane, value));
        var rawPosition = value;
        var slide = (0, exports.getSlideFromLane)(lane);
        for (var _i = 0, _a = slide.lanes; _i < _a.length; _i++) {
            var i = _a[_i];
            rawPosition = (0, exports.getPrimaryPositionAt)(i, rawPosition);
            if (i === lane) {
                break;
            }
        }
        return scale * Math.log(rawPosition);
    };
    exports.getRawPositionAt = getRawPositionAt;
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
        return (0, exports.getRawPositionAt)(lane, value, view) + (0, exports.getSlideOffset)(slide, view);
    };
    exports.getPositionAt = getPositionAt;
    var getWidth = function (slide, lane, bottom, top, view) {
        return (0, exports.getPositionAt)(slide, lane, top, view) - (0, exports.getPositionAt)(slide, lane, bottom, view);
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
    var makeTickWindow = function (slide, lane, view, topPosition, bottomPosition) {
        var isInverted = (0, exports.isInvertLane)(lane);
        var rawTopValue = (0, exports.getValueAt)(slide, lane, topPosition, view);
        var rawBottomValue = (0, exports.getValueAt)(slide, lane, bottomPosition, view);
        var topValue = Number.clamp(rawTopValue !== null && rawTopValue !== void 0 ? rawTopValue : (!isInverted ? Number.MAX_VALUE : Number.MIN_VALUE));
        var bottomValue = Number.clamp(rawBottomValue !== null && rawBottomValue !== void 0 ? rawBottomValue : (!isInverted ? Number.MIN_VALUE : Number.MAX_VALUE));
        return { topValue: topValue, bottomValue: bottomValue };
    };
    exports.makeTickWindow = makeTickWindow;
    var makeTickWindowFromView = function (slide, lane, view) {
        return (0, exports.makeTickWindow)(slide, lane, view, 0, window.innerHeight);
    };
    exports.makeTickWindowFromView = makeTickWindowFromView;
    var makeTickWindowFromPosition = function (slide, lane, view, position, width) {
        return (0, exports.makeTickWindow)(slide, lane, view, position - (width / 2), position + (width / 2));
    };
    exports.makeTickWindowFromPosition = makeTickWindowFromPosition;
    var designTicks10 = function (view, slide, lane, base, unit, parent, tickWindow) {
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var isInverted = (0, exports.isInvertLane)(lane);
        if (!isInverted) {
            if (0 < base && base <= bottomValue && topValue <= Number.minMax(base + unit)) {
                var width = (0, exports.getWidth)(slide, lane, base, base + unit, view);
                switch (true) {
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, base, unit / 10, { index: 0, width: width }, tickWindow));
                        break;
                    case config_json_1.default.render.ruler.tickDensityThreshold5 <= width:
                        ticks.push({ value: base + (unit * 0.5), type: "mini", });
                        break;
                }
            }
            for (var b = 1; b <= 9; ++b) {
                var value = base + (unit * b);
                var nextValue = base + (unit * (b + 1));
                if (topValue < nextValue) {
                    if (value <= bottomValue) {
                        var width = (0, exports.getWidth)(slide, lane, value, nextValue, view);
                        switch (true) {
                            case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
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
                            case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                                break;
                            default:
                                if (config_json_1.default.render.ruler.tickDensityThreshold5 <= width) {
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
            return ticks.filter(function (tick) { return topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue; });
        }
        else {
            if (0 < base && base <= topValue && bottomValue <= Number.minMax(base + unit)) {
                var width = (0, exports.getWidth)(slide, lane, base + unit, base, view);
                switch (true) {
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, base, unit / 10, { index: 0, width: width }, tickWindow));
                        break;
                    case config_json_1.default.render.ruler.tickDensityThreshold5 <= width:
                        ticks.push({ value: base + (unit * 0.5), type: "mini", });
                        break;
                }
            }
            for (var b = 1; b <= 9; ++b) {
                var value = base + (unit * b);
                var nextValue = base + (unit * (b + 1));
                if (bottomValue < nextValue) {
                    if (value <= topValue) {
                        var width = (0, exports.getWidth)(slide, lane, nextValue, value, view);
                        switch (true) {
                            case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
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
                            case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                                break;
                            default:
                                if (config_json_1.default.render.ruler.tickDensityThreshold5 <= width) {
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
            return ticks.filter(function (tick) { return bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue; });
        }
    };
    exports.designTicks10 = designTicks10;
    var designTicks = function (slide, view, lane, tickWindow) {
        var _a;
        var viewScale = Type.getViewScale(view);
        var topValue = tickWindow.topValue, bottomValue = tickWindow.bottomValue;
        var ticks = [];
        var isInverted = (0, exports.isInvertLane)(lane);
        if (!isInverted) {
            var beginDigit = Math.floor(Math.log10(topValue));
            var endDigit = Math.ceil(Math.log10(bottomValue));
            var scale = 10;
            console.log("designTicks: lane: ".concat((_a = lane.name) !== null && _a !== void 0 ? _a : "unnamed", ", topValue: ").concat(topValue, ", bottomValue: ").concat(bottomValue, ", beginDigit: ").concat(beginDigit, ", endDigit: ").concat(endDigit));
            for (var digit = beginDigit; digit <= endDigit; ++digit) {
                var a = Math.pow(10, digit);
                var width = (0, exports.getWidth)(slide, lane, a, a * scale, view);
                switch (true) {
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, 0, a, { index: 0, width: width }, tickWindow));
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
                            type: Math.abs(digit) % 3 === 0 ? "long" : "medium",
                        });
                        break;
                }
            }
        }
        else {
            var beginDigit = Math.floor(Math.log10(bottomValue));
            var endDigit = Math.ceil(Math.log10(topValue));
            var scale = 10;
            for (var digit = beginDigit; digit <= endDigit; ++digit) {
                var a = Math.pow(10, digit);
                var width = (0, exports.getWidth)(slide, lane, a * scale, a, view);
                switch (true) {
                    case config_json_1.default.render.ruler.tickDensityThreshold10 <= width:
                        ticks.push.apply(ticks, (0, exports.designTicks10)(view, slide, lane, 0, a, { index: 0, width: width }, tickWindow));
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
                            type: Math.abs(digit) % 3 === 0 ? "long" : "medium",
                        });
                        break;
                }
            }
        }
        if (100 < viewScale) {
            var lowwerBoundValue = Math.min(topValue, bottomValue);
            var upperBoundValue = Math.max(topValue, bottomValue);
            for (var _i = 0, _b = Type.namedNumberList; _i < _b.length; _i++) {
                var value = _b[_i];
                var actualNumber = Type.getNamedNumberValue(value);
                if (lowwerBoundValue <= actualNumber && actualNumber <= upperBoundValue) {
                    ticks.push({ value: value, type: "long", color: "blue" });
                }
            }
        }
        // console.log(`designed ticks for lane: ${lane.name ?? "unnamed"}, ticks: ${ticks.map(tick => `${Type.getNamedNumberValue(tick.value)} (${tick.type})`).join(", ")}`);
        // console.log(`min: ${min}, max: ${max}`);
        if (!isInverted) {
            return ticks.filter(function (tick) { return topValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= bottomValue; });
        }
        else {
            return ticks.filter(function (tick) { return bottomValue <= Type.getNamedNumberValue(tick.value) && Type.getNamedNumberValue(tick.value) <= topValue; });
        }
    };
    exports.designTicks = designTicks;
    var makeRootLane = function () {
        var _a = config_json_1.default.model.lane.root, type = _a.type, logScale = _a.logScale;
        return (0, exports.makeLane)({
            type: type,
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
        for (var _i = 0, _a = Object.keys(config_json_1.default.model.lane.presets); _i < _a.length; _i++) {
            var i = _a[_i];
            var preset = config_json_1.default.model.lane.presets[i];
            if (
            // data.slides.every(slide => slide.lanes.every(lane => lane.name !== i)) &&
            preset.type === laneSeed.type &&
                // preset.isInverted === laneSeed.isInverted &&
                preset.logScale === laneSeed.logScale) {
                return i;
            }
        }
        return null;
    };
    var makeLane = function (laneSeed) {
        return ({
            type: laneSeed.type,
            logScale: laneSeed.logScale,
            name: getLaneName(laneSeed),
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
        exports.data.cursor = (_a = Number.parse(Url.get("cursor"))) !== null && _a !== void 0 ? _a : config_json_1.default.model.defaultCursor;
        console.log("Model initialized: cursor=".concat(exports.data.cursor));
        (0, exports.makeSure)();
    };
    exports.initialize = initialize;
});
define("script/view", ["require", "exports", "script/number", "script/type", "script/url", "script/ui", "resource/config"], function (require, exports, Number, Type, Url, UI, config_json_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.setViewScaleExponent = exports.getViewScale = exports.setViewMode = exports.isGraphView = exports.isGridView = exports.isRulerView = exports.getViewMode = exports.data = void 0;
    Number = __importStar(Number);
    Type = __importStar(Type);
    Url = __importStar(Url);
    UI = __importStar(UI);
    config_json_2 = __importDefault(config_json_2);
    exports.data = {
        viewMode: "ruler",
        viewScaleExponent: (_a = config_json_2.default.view.defaultZoomLevel) !== null && _a !== void 0 ? _a : 2.5,
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
        (0, exports.setViewMode)((_c = (_a = Url.get("view-mode")) !== null && _a !== void 0 ? _a : (_b = config_json_2.default.view) === null || _b === void 0 ? void 0 : _b.defaultViewMode) !== null && _c !== void 0 ? _c : "ruler");
        (0, exports.setViewScaleExponent)((_d = Number.parse(Url.get("view-scale"))) !== null && _d !== void 0 ? _d : exports.data.viewScaleExponent);
        exports.data.baseOfLogarithm = (_h = (_e = Number.orUndefined(Type.getNamedNumberValue(Url.get("base")))) !== null && _e !== void 0 ? _e : (_g = (_f = config_json_2.default.view) === null || _f === void 0 ? void 0 : _f.baseOfLogarithm) === null || _g === void 0 ? void 0 : _g.default) !== null && _h !== void 0 ? _h : 10;
        console.log("View initialized: mode=".concat(exports.data.viewMode, ", scale=").concat(exports.data.viewScaleExponent, ", base=").concat(exports.data.baseOfLogarithm));
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
define("script/ruler", ["require", "exports", "script/type", "script/number", "script/model", "script/ui", "script/render", "script/svg", "script/comparer", "resource/config"], function (require, exports, Type, Number, Model, UI, Render, SVG, Comparer, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.getRulerWidth = exports.resize = exports.drawMenuLane = exports.drawAnchorLine = exports.slideCursor = exports.snapHorizontalPosition = exports.snapVerticalPosition = exports.nextPosition = exports.snapPosition = exports.regulateReferencePositions = exports.getReferenceLaneIndexFromEvent = exports.drawTicks = exports.calculateMinimumFractionDigits = exports.getFractionDigitsFromUnit = exports.makeNumberLabel = exports.drawErrorArea = exports.drawLane = exports.getLeftOfLane = exports.drawSlide = exports.drawErrorAreaDefines = exports.makeLinerGradient = exports.drawDefines = exports.getLaneIndexFromPosition = exports.renderer = exports.LaneWidths = exports.scale = void 0;
    Type = __importStar(Type);
    Number = __importStar(Number);
    Model = __importStar(Model);
    UI = __importStar(UI);
    Render = __importStar(Render);
    SVG = __importStar(SVG);
    Comparer = __importStar(Comparer);
    config_json_3 = __importDefault(config_json_3);
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
        (0, exports.drawErrorAreaDefines)(model, view, defs);
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
    var drawErrorAreaDefines = function (_model, _view, defs) {
        (0, exports.makeLinerGradient)(defs, "min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_3.default.render.ruler.minErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_3.default.render.ruler.minErrorAreaColor, opacity: 0 },
        ]);
        (0, exports.makeLinerGradient)(defs, "max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_3.default.render.ruler.maxErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_3.default.render.ruler.maxErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-min-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_3.default.render.ruler.minErrorAreaColor, opacity: 0 },
            { offset: "100%", color: config_json_3.default.render.ruler.minErrorAreaColor, opacity: 1 },
        ]);
        (0, exports.makeLinerGradient)(defs, "invert-max-error-area-gradient", { x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, [
            { offset: "0%", color: config_json_3.default.render.ruler.maxErrorAreaColor, opacity: 1 },
            { offset: "100%", color: config_json_3.default.render.ruler.maxErrorAreaColor, opacity: 0 },
        ]);
    };
    exports.drawErrorAreaDefines = drawErrorAreaDefines;
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
        var width = config_json_3.default.render.ruler.laneWidth;
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
            fill: config_json_3.default.render.ruler.laneBackgroundColor,
        }), tickGroup, SVG.make({
            tag: "rect",
            class: "lane-label-background",
            x: left + 8,
            y: 8,
            rx: 8,
            ry: 8,
            width: width - 16,
            height: 24,
            fill: config_json_3.default.render.ruler.laneLabelBackgroundColor,
        }), SVG.make({
            tag: "text",
            class: "lane-label",
            x: left + 16,
            y: 26,
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
            stroke: isLastLane ?
                config_json_3.default.render.ruler.slideSeparatorColor :
                config_json_3.default.render.ruler.laneSeparatorColor,
            "stroke-width": config_json_3.default.render.ruler.laneSeparatorWidth,
        }), tickGroup);
        (0, exports.drawErrorArea)(view, tickGroup, slide, lane);
        var ticks = Model.designTicks(slide, view, lane, Model.makeTickWindowFromView(slide, lane, view));
        (0, exports.drawTicks)(view, tickGroup, slide, lane, (0, exports.calculateMinimumFractionDigits)(ticks));
    };
    exports.drawLane = drawLane;
    var drawErrorArea = function (view, group, slide, lane) {
        var laneIndex = Model.getLaneIndex(lane);
        var left = (0, exports.getLeftOfLane)(laneIndex);
        var width = config_json_3.default.render.ruler.laneWidth;
        ;
        var height = window.innerHeight;
        var isInverted = Model.isInvertLane(lane);
        if (!isInverted) {
            var min = Number.maxMin(Model.getValueAt(slide, lane, 0, view));
            if (min <= Number.MIN_VALUE) {
                var minPosition = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view);
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "error-area",
                    x: left,
                    y: 0,
                    width: width,
                    height: minPosition,
                    fill: "url(#min-error-area-gradient)",
                }));
            }
            var max = Number.maxMin(Model.getValueAt(slide, lane, height, view));
            if (Number.MAX_VALUE <= max) {
                var maxPosition = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view);
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "error-area",
                    x: left,
                    y: maxPosition,
                    width: width,
                    height: group.ownerSVGElement.viewBox.baseVal.height - maxPosition,
                    fill: "url(#max-error-area-gradient)",
                }));
            }
        }
        else {
            var max = Number.maxMin(Model.getValueAt(slide, lane, 0, view));
            if (Number.MAX_VALUE <= max) {
                var maxPosition = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view);
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "error-area",
                    x: left,
                    y: 0,
                    width: width,
                    height: maxPosition,
                    fill: "url(#invert-max-error-area-gradient)",
                }));
            }
            var min = Number.maxMin(Model.getValueAt(slide, lane, height, view));
            if (min <= Number.MIN_VALUE) {
                var minPosition = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view);
                group.appendChild(SVG.make({
                    tag: "rect",
                    class: "error-area",
                    x: left,
                    y: minPosition,
                    width: width,
                    height: minPosition,
                    fill: "url(#invert-min-error-area-gradient)",
                }));
            }
        }
    };
    exports.drawErrorArea = drawErrorArea;
    var makeNumberLabel = function (tick) {
        var value = tick.value, minimumFractionDigits = tick.minimumFractionDigits;
        if (Type.isNamedNumber(value)) {
            return Type.getNamedNumberLabel(value);
        }
        else {
            if (value < 0.001 || 100000000 <= value) {
                return Type.getNamedNumberLabel(value, undefined, { notation: "scientific", minimumSignificantDigits: 6, maximumSignificantDigits: 6, minimumFractionDigits: minimumFractionDigits });
                // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
            }
            else {
                return Type.getNamedNumberLabel(value, undefined, { maximumFractionDigits: 8, minimumFractionDigits: minimumFractionDigits });
                // return Type.getNamedNumberLabel(value, undefined, { notation: "compact", compactDisplay: "long" });
            }
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
        var isPrimaryLane = Model.isPrimaryLane(lane);
        var laneIndex = Model.getLaneIndex(lane);
        var laneContext = Model.getLaneContext(lane);
        var isRootSlide = Model.isRootSlide(Model.getSlideFromLane(lane));
        var width = config_json_3.default.render.ruler.laneWidth;
        ;
        var left = (0, exports.getLeftOfLane)(laneIndex);
        var right = left + width;
        for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
            var tick = ticks_1[_i];
            var isPrimaryTick = isPrimaryLane && 1 === tick.value;
            var value = Type.getNamedNumberValue(tick.value);
            var position = Model.getPositionAt(slide, lane, value, view);
            var color = (_a = tick.color) !== null && _a !== void 0 ? _a : (isPrimaryTick ? config_json_3.default.render.ruler.primaryTickColor : config_json_3.default.render.ruler.tick[tick.type].color);
            var drawLeftTick = !isRootSlide && ("left-end" === laneContext || "center" === laneContext || "single" === laneContext);
            var drawRightTick = isRootSlide || "right-end" === laneContext || "single" === laneContext;
            if (drawLeftTick) {
                group.appendChild(SVG.make({
                    tag: "line",
                    class: "tick tick-".concat(tick.type),
                    x1: left,
                    y1: position,
                    x2: left + config_json_3.default.render.ruler.tick[tick.type].length,
                    y2: position,
                    // stroke: config.render.ruler.tick[tick.type].color,
                    stroke: color,
                    "stroke-width": config_json_3.default.render.ruler.tick[tick.type].width,
                    "data-tick-value": value,
                }));
            }
            if (drawRightTick) {
                group.appendChild(SVG.make({
                    tag: "line",
                    class: "tick tick-".concat(tick.type),
                    x1: right,
                    y1: position,
                    x2: right - config_json_3.default.render.ruler.tick[tick.type].length,
                    y2: position,
                    // stroke: config.render.ruler.tick[tick.type].color,
                    stroke: color,
                    "stroke-width": config_json_3.default.render.ruler.tick[tick.type].width,
                    "data-tick-value": value,
                }));
            }
            if (tick.type === "long") {
                var drawLabelDirection = !drawLeftTick ? "right" :
                    !drawRightTick ? "left" :
                        value < 1 ? "left" : "right";
                group.appendChild(SVG.make({
                    tag: "text",
                    class: "tick-label",
                    x: "left" === drawLabelDirection ?
                        left + config_json_3.default.render.ruler.tick[tick.type].length + 4 :
                        right - config_json_3.default.render.ruler.tick[tick.type].length - 4,
                    y: position + 4,
                    //fill: config.render.ruler.tick[tick.type].color,
                    fill: color,
                    "font-size": 12,
                    "text-anchor": "left" === drawLabelDirection ? "start" : "end",
                    textContent: (0, exports.makeNumberLabel)(tick),
                }));
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
    var snapVerticalPosition = function (event, view, position, referenceLaneIndex) {
        var _a;
        if ("NOSNAP" !== event && !event.shiftKey) {
            var laneIndex = (_a = referenceLaneIndex !== null && referenceLaneIndex !== void 0 ? referenceLaneIndex : (0, exports.getReferenceLaneIndexFromEvent)(event)) !== null && _a !== void 0 ? _a : 0;
            var _b = Model.getSlideAndLane(laneIndex), slide_1 = _b.slide, lane_1 = _b.lane;
            var tickWindow = Model.makeTickWindowFromPosition(slide_1, lane_1, view, position, 32);
            var ticks = Model.designTicks(slide_1, view, lane_1, tickWindow);
            var tickPositions = ticks.map(function (i) { return Model.getPositionAt(slide_1, lane_1, Type.getNamedNumberValue(i.value), view); });
            tickPositions.push(Model.getCursorPosition(view));
            if ("number" === typeof referenceLaneIndex) {
                var selfLaneIndex = referenceLaneIndex + 1;
                if (selfLaneIndex < Model.getAllLaneCount()) {
                    var _c = Model.getSlideAndLane(selfLaneIndex), selfSlide_1 = _c.slide, selfLane_1 = _c.lane;
                    var currentPosition_1 = Model.getPositionAt(slide_1, lane_1, selfSlide_1.anchor, view);
                    var delta = position - currentPosition_1;
                    var oppositePosition_1 = Model.getPositionAt(slide_1, lane_1, 1, view);
                    var tickWindow_1 = Model.makeTickWindowFromPosition(selfSlide_1, selfLane_1, view, oppositePosition_1 - delta, 32);
                    var ticks_2 = Model.designTicks(selfSlide_1, view, selfLane_1, tickWindow_1);
                    tickPositions.push.apply(tickPositions, ticks_2
                        .map(function (i) { return Model.getPositionAt(selfSlide_1, selfLane_1, Type.getNamedNumberValue(i.value), view); })
                        .map(function (i) { return currentPosition_1 + (oppositePosition_1 - i); }));
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
        var _a, _b, _c;
        var _d = Model.getRootSlideAndRootLane(), slide = _d.slide, lane = _d.lane;
        var minPosition = (_a = Model.getPositionAt(slide, lane, Number.MIN_VALUE, view)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE;
        var maxPosition = (_b = Model.getPositionAt(slide, lane, Number.MAX_VALUE, view)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
        var snappedPosition = (0, exports.snapVerticalPosition)(event, view, position);
        var resultPosition = Math.min(maxPosition, Math.max(minPosition, snappedPosition));
        model.cursor = (_c = Model.getValueAt(slide, lane, resultPosition, view)) !== null && _c !== void 0 ? _c : model.cursor;
        Render.markDirty();
        return snappedPosition - position;
    };
    exports.slideCursor = slideCursor;
    var drawAnchorLine = function (model, view) {
        var _a = Model.getRootSlideAndRootLane(), slide = _a.slide, lane = _a.lane;
        var svg = UI.rulerOverlay;
        var color = config_json_3.default.render.ruler.lineColor;
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
                    var _a;
                    if (undefined !== initialDraggingAnchorPosition) {
                        event.stopPropagation();
                        var position_1 = initialDraggingAnchorPosition;
                        model.cursor = (_a = Model.getValueAt(slide, lane, position_1, view)) !== null && _a !== void 0 ? _a : model.cursor;
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
                x2: svg.viewBox.baseVal.width,
                y2: position,
                stroke: color,
                "stroke-width": config_json_3.default.render.ruler.lineWidth,
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
define("script/event", ["require", "exports", "script/type", "script/number", "script/environment", "script/view", "script/model", "script/ui", "script/render", "script/ruler", "script/grid", "script/graph", "resource/config"], function (require, exports, Type, Number, Environment, View, Model, UI, Render, Ruler, Grid, Graph, config_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialize = exports.resetZoom = exports.horizontalScroll = exports.verticalScroll = exports.shiftSlide = exports.zoomByRange = exports.zoom = exports.getZoomCenter = exports.zoomOut = exports.zoomIn = exports.updateViewScaleRoundBar = exports.getViewScaleExponentFromRate = exports.getViewScaleRate = exports.updateViewModeRoundBar = void 0;
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
    config_json_4 = __importDefault(config_json_4);
    var updateViewModeRoundBar = function () { return UI.updateRoundBar(UI.viewModeButton, {
        low: 0 / Type.viewModeList.length,
        high: 1 / Type.viewModeList.length,
        rotate: Type.viewModeList.indexOf(View.getViewMode()) / Type.viewModeList.length,
    }); };
    exports.updateViewModeRoundBar = updateViewModeRoundBar;
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
    var getZoomCenter = function () {
        var _a = Model.getRootSlideAndRootLane(), slide = _a.slide, lane = _a.lane;
        var cursorPosition = Model.getPositionAt(slide, lane, Model.data.cursor, View.data);
        if (undefined !== cursorPosition && 0 <= cursorPosition && cursorPosition <= window.innerHeight) {
            return cursorPosition;
        }
        return window.innerHeight / 2;
    };
    exports.getZoomCenter = getZoomCenter;
    var zoom = function (delta) {
        var _a;
        var current = View.data.viewScaleExponent;
        var next = Math.min(config_json_4.default.view.maxZoomLevel, Math.max(config_json_4.default.view.minZoomLevel, current + delta));
        var _b = Model.getRootSlideAndRootLane(), slide = _b.slide, lane = _b.lane;
        var zoomCenter = (0, exports.getZoomCenter)();
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
            var minPosition = ((_a = Model.getRawPositionAt(lane, Number.MIN_VALUE, View.data)) !== null && _a !== void 0 ? _a : -Number.MAX_VALUE) + halfWindowHeight;
            var maxPosition = ((_b = Model.getRawPositionAt(lane, Number.MAX_VALUE, View.data)) !== null && _b !== void 0 ? _b : Number.MAX_VALUE) + halfWindowHeight;
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
                slide.anchor = Number.clamp(nextValue);
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
        var next = config_json_4.default.view.defaultZoomLevel;
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
                (0, exports.zoom)(event.deltaY * config_json_4.default.view.zoomRate);
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
                        (0, exports.verticalScroll)(event, -config_json_4.default.view.scrollUnit);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        (0, exports.verticalScroll)(event, config_json_4.default.view.scrollUnit);
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, config_json_4.default.view.scrollUnit);
                        break;
                    case "ArrowRight":
                        event.preventDefault();
                        (0, exports.horizontalScroll)(event, -config_json_4.default.view.scrollUnit);
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
            clearPointerMoveTimeout();
            pointerMoveTimeout = setTimeout(forcePointerClear, 350);
            //}
        }, {
            passive: false,
        });
        UI.viewModeButton.addEventListener("click", function (event) {
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
        UI.viewScaleButton.addEventListener("click", function (event) {
            event.preventDefault();
            UI.viewScalePanel.classList.toggle("show", UI.viewScaleButton.classList.toggle("on"));
        });
        UI.viewScaleRange.addEventListener("input", function () { return (0, exports.zoomByRange)(UI.viewScaleRange.valueAsNumber); });
        UI.viewScaleRange.addEventListener("change", function () { return (0, exports.zoomByRange)(UI.viewScaleRange.valueAsNumber); });
        UI.addSlideButton.addEventListener("click", function (event) {
            var _a;
            event.preventDefault();
            var _b = Model.getLastSlideAndLastLane(), lastSlide = _b.slide, lastLane = _b.lane;
            var lastValue = (_a = Model.getCursorValue(lastSlide, lastLane, View.data)) !== null && _a !== void 0 ? _a : 1;
            var slide = Model.makeSlide(lastValue);
            slide.lanes.push(Model.makeLane({
                type: "logarithmic",
                logScale: "e"
            }));
            Model.data.slides.push(slide);
            Render.markDirty();
        });
        UI.addInvertLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "invert",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        UI.addSquaredLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "squared",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        UI.addSineLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "sine",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        UI.addCosineLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "cosine",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        UI.addTangentLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "tangent",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        UI.addCotangentLaneButton.addEventListener("click", function (event) {
            event.preventDefault();
            var slide = Model.getLastSlideAndLastLane().slide;
            var lane = Model.makeLane({
                type: "cotangent",
                logScale: "e"
            });
            slide.lanes.push(lane);
            Render.markDirty();
        });
        (0, exports.updateViewModeRoundBar)();
        (0, exports.updateViewScaleRoundBar)();
        (0, exports.shiftSlide)("NOSNAP", Model.getRootSlide(), Model.getCursorPosition(View.data) - (window.innerHeight / 2));
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