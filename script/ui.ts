import * as HTML from "./html.js";
import * as SVG from "./svg.js";
export const setAriaHidden = (element: HTMLElement | SVGElement, hidden: boolean) =>
{
    const attributeKey = "aria-hidden";
    if (hidden)
    {
        const attribute = document.createAttribute(attributeKey);
        attribute.value = "true";
        element.attributes.setNamedItem(attribute);
    }
    else
    {
        if (element.attributes.getNamedItem(attributeKey))
        {
            element.attributes.removeNamedItem(attributeKey);
        }
    }
};
export const updateRoundBar = (button: HTMLButtonElement, properties: { low: number, high: number, rotate: number, }) =>
{
    // console.log("updateRoundBar", button, properties);
    /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
    HTML.setStyle(button, "--low", properties.low.toFixed(3));
    HTML.setStyle(button, "--high", properties.high.toFixed(3));
    HTML.setStyle(button, "--rotate", properties.rotate.toFixed(3));
};
export const viewList = HTML.getElementById("div", "view-list");
export const rulerView = HTML.getElementById("div", "ruler-view");
export const rulerSvg = SVG.getElementById("svg", "ruler-svg");
export const rulerOverlay = SVG.getElementById("svg", "ruler-overlay-svg");
export const gridView = HTML.getElementById("div", "grid-view");
export const graphView = HTML.getElementById("div", "graph-view");
export const rulerNewSlidePanel = HTML.getElementById("div", "ruler-new-slide-panel");
export const addSlideButton = HTML.getElementById("button", "add-slide-button");
//export const addLaneButton = HTML.getElementById("button", "add-lane-button");
export const addInvertLaneButton = HTML.getElementById("button", "add-invert-lane-button");
export const addSquaredLaneButton = HTML.getElementById("button", "add-squared-lane-button");
export const addCubedLaneButton = HTML.getElementById("button", "add-cubed-lane-button");
export const addSquareRootLaneButton = HTML.getElementById("button", "add-square-root-lane-button");
export const addCubeRootLaneButton = HTML.getElementById("button", "add-cube-root-lane-button");
export const add2nLaneButton = HTML.getElementById("button", "add-2n-lane-button");
export const addPrimeNumbersLaneButton = HTML.getElementById("button", "add-prime-numbers-lane-button");
export const addSineLaneButton = HTML.getElementById("button", "add-sine-lane-button");
export const addCosineLaneButton = HTML.getElementById("button", "add-cosine-lane-button");
export const addTangentLaneButton = HTML.getElementById("button", "add-tangent-lane-button");
export const addCotangentLaneButton = HTML.getElementById("button", "add-cotangent-lane-button");
export const addSizeLaneButton = HTML.getElementById("button", "add-size-lane-button");
export const addMassLaneButton = HTML.getElementById("button", "add-mass-lane-button");
export const addTimeLaneButton = HTML.getElementById("button", "add-time-lane-button");
export const addSpeedLaneButton = HTML.getElementById("button", "add-speed-lane-button");
export const addEmWavelengthLaneButton = HTML.getElementById("button", "add-em-wavelength-lane-button");
export const rulerHelpPanel = HTML.getElementById("div", "ruler-help-panel");
export const controlPanel = HTML.getElementById("div", "control-panel");
export const viewModeButton = HTML.getElementById("button", "view-mode-button");
export const viewScaleButton = HTML.getElementById("button", "view-scale-button");
export const viewScalePanel = HTML.getElementById("div", "view-scale-panel");
export const viewScaleRange = HTML.getElementById("input", "view-scale-range");
export const initialize = () =>
{
    console.log("UI initialized");
};

