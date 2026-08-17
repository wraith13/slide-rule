// import * as Calculation from "./calculation";
import * as Type from "./type";
import * as UI from "./ui";
import config from "@resource/config.json";
export const data: Type.View =
{
    viewMode: "ruler",
    viewScaleExponent: config.view.defaultZoomLevel ?? 2.5,
    baseOfLogarithm: 10,
    isLocked: false,
    popup: null,
};
export const hasPopup = (): boolean =>
    null !== data.popup;
export const getViewMode = (): Type.ViewMode => data.viewMode;
export const isRulerView = (): boolean => data.viewMode === "ruler";
export const isGridView = (): boolean => data.viewMode === "grid";
export const isGraphView = (): boolean => data.viewMode === "graph";
export const setViewMode = (mode: Type.ViewMode): void =>
{
    data.viewMode = mode;
    // Url.addParameter("view-mode", mode);
    document.body.classList.toggle("ruler-view", isRulerView());
    document.body.classList.toggle("grid-view", isGridView());
    document.body.classList.toggle("graph-view", isGraphView());
    UI.setAriaHidden(UI.rulerView, ! isRulerView());
    UI.setAriaHidden(UI.gridView, ! isGridView());
};
export const getViewScale = (): number => Math.pow(10, data.viewScaleExponent);
export const setViewScaleExponent = (exponent: number): void =>
{
    data.viewScaleExponent = exponent;
    //data.viewScale = Math.pow(10, exponent);
};
export const isLocked = (): boolean => data.isLocked;
export const setLocked = (locked: boolean): void =>
{
    data.isLocked = locked;
};
export const initialize = () =>
{
    setViewMode((config.view?.defaultViewMode ?? "ruler") as Type.ViewMode);
    setViewScaleExponent(data.viewScaleExponent);
    data.baseOfLogarithm = config.view?.baseOfLogarithm?.default ?? 10;
    console.log(`View initialized: mode=${data.viewMode}, scale=${data.viewScaleExponent}, base=${data.baseOfLogarithm}`);
};
export const applyViewData = (viewData: Type.View) =>
{
    Object.assign(data, viewData);
    setViewMode(data.viewMode);
    setViewScaleExponent(data.viewScaleExponent);
    data.baseOfLogarithm = viewData.baseOfLogarithm;
    setLocked(data.isLocked);
};
