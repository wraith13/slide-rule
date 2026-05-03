import * as Locale from "./locale";
import * as HTML from "./html";
import * as SVG from "./svg";
// import * as Control from "./control";
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
export const updateRoundBar = (button: HTMLButtonElement, properties: { low: number, high: number, rotate: number, } | boolean) =>
{
    // console.log("updateRoundBar", button, properties);
    /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
    if (typeof properties === "boolean")
    {
        HTML.setStyle(button, "--low", "0");
        HTML.setStyle(button, "--high", properties ? "1" : "0");
        HTML.setStyle(button, "--rotate", "0");
    }
    else
    {
        HTML.setStyle(button, "--low", properties.low.toFixed(3));
        HTML.setStyle(button, "--high", properties.high.toFixed(3));
        HTML.setStyle(button, "--rotate", properties.rotate.toFixed(3));
    }
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
export const addSiDigitLaneButton = HTML.getElementById("button", "add-si-digit-lane-button");
export const addEnDigitLaneButton = HTML.getElementById("button", "add-en-digit-lane-button");
export const addJaDigitLaneButton = HTML.getElementById("button", "add-ja-digit-lane-button");
export const addInvertLaneButton = HTML.getElementById("button", "add-invert-lane-button");
export const addSquaredLaneButton = HTML.getElementById("button", "add-squared-lane-button");
export const addCubedLaneButton = HTML.getElementById("button", "add-cubed-lane-button");
export const addSquareRootLaneButton = HTML.getElementById("button", "add-square-root-lane-button");
export const addCubeRootLaneButton = HTML.getElementById("button", "add-cube-root-lane-button");
export const addSineLaneButton = HTML.getElementById("button", "add-sine-lane-button");
export const addCosineLaneButton = HTML.getElementById("button", "add-cosine-lane-button");
export const addTangentLaneButton = HTML.getElementById("button", "add-tangent-lane-button");
export const addCotangentLaneButton = HTML.getElementById("button", "add-cotangent-lane-button");
export const add2nLaneButton = HTML.getElementById("button", "add-2n-lane-button");
export const addPrimeNumbersLaneButton = HTML.getElementById("button", "add-prime-numbers-lane-button");
export const addPrimeDecompositionLaneButton = HTML.getElementById("button", "add-prime-decomposition-lane-button");
export const addSizeLaneButton = HTML.getElementById("button", "add-size-lane-button");
export const addAreaLaneButton = HTML.getElementById("button", "add-area-lane-button");
export const addVolumeLaneButton = HTML.getElementById("button", "add-volume-lane-button");
export const addMassLaneButton = HTML.getElementById("button", "add-mass-lane-button");
export const addTimeLaneButton = HTML.getElementById("button", "add-time-lane-button");
export const addSpeedLaneButton = HTML.getElementById("button", "add-speed-lane-button");
export const addEnergyLaneButton = HTML.getElementById("button", "add-energy-lane-button");
export const addTemperatureLaneButton = HTML.getElementById("button", "add-temperature-lane-button");
export const addCountingLaneButton = HTML.getElementById("button", "add-counting-lane-button");
export const addSoundFrequencyLaneButton = HTML.getElementById("button", "add-sound-frequency-lane-button");
export const addEmwWavelengthLaneButton = HTML.getElementById("button", "add-emw-wavelength-lane-button");
export const addEmwFrequencyLaneButton = HTML.getElementById("button", "add-emw-frequency-lane-button");
export const addEmwEnergyLaneButton = HTML.getElementById("button", "add-emw-energy-lane-button");
export const addHistoryLaneButton = HTML.getElementById("button", "add-history-lane-button");
export const rulerHelpPanel = HTML.getElementById("div", "ruler-help-panel");
export const saveImageButton = HTML.getElementById("button", "save-image-button");
export namespace SettingsPanel
{
    export const languageSelect = HTML.getElementById("select", "language-select");
    export const themeSelect = HTML.getElementById("select", "theme-select");
    export const threeDigitSeparatorSelect = HTML.getElementById("select", "three-digit-separator-select");
    export const exponentFormatSelect = HTML.getElementById("select", "exponent-format-select");
    export const exponentMultipleOfThreeCheckbox = HTML.getElementById("input", "exponent-multiple-of-three-checkbox");
    export const numberFormatSelect = HTML.getElementById("select", "number-format-select");
}
export namespace ControlPanel
{
    export const element = HTML.getElementById("div", "control-panel");
    export const viewModeButton = HTML.getElementById("button", "view-mode-button");
    export const viewScaleButton = HTML.getElementById("button", "view-scale-button");
    export const viewScalePanel = HTML.getElementById("div", "view-scale-panel");
    export const viewScaleRange = HTML.getElementById("input", "view-scale-range");
    export const viewLockButton = HTML.getElementById("button", "view-lock-button");
}
export const updateLanguage = () =>
{
    document.querySelectorAll("span[data-lang-key]").forEach((element) =>
    {
        const key = element.getAttribute("data-lang-key");
        if (key)
        {
            element.textContent = Locale.map(key as Locale.Label);
        }
    });
};
export const initialize = () =>
{
    SettingsPanel.languageSelect.innerHTML = "";
    for (const language of Locale.getLocaleList())
    {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = "Auto" === language ?
            Locale.map("Auto"):
            `${language}${Locale.getColonSuffix()} ${Locale.toRtl(Locale.map("lang-label", language as Locale.Language), Locale.isRtl() && Locale.isLtr(language as Locale.Language))}`;
        SettingsPanel.languageSelect.appendChild(option);
    };
};

