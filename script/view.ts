import * as Number from "./number";
import * as Type from "./type";
import * as Url from "./url";
import * as UI from "./ui";
import config from "@resource/config.json";
export const data: Type.View =
{
    viewMode: "ruler",
    viewScaleExponent: config.view.defaultZoomLevel ?? 2.5,
    baseOfLogarithm: 10,
    isLocked: false,
};
export const getViewMode = (): Type.ViewMode => data.viewMode;
export const isRulerView = (): boolean => data.viewMode === "ruler";
export const isGridView = (): boolean => data.viewMode === "grid";
export const isGraphView = (): boolean => data.viewMode === "graph";
export const setViewMode = (mode: Type.ViewMode): void =>
{
    data.viewMode = mode;
    Url.addParameter("view-mode", mode);
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
    Url.addParameter("view-scale", exponent.toString());
};
export const isLocked = (): boolean => data.isLocked;
export const setLocked = (locked: boolean): void =>
{
    data.isLocked = locked;
    Url.addParameter("locked", locked ? "true" : "false");
};
export const initialize = () =>
{
    setViewMode(Url.get("view-mode") as Type.ViewMode ?? config.view?.defaultViewMode ?? "ruler");
    setViewScaleExponent(Number.parse(Url.get("view-scale")) ?? data.viewScaleExponent);
    data.baseOfLogarithm = Number.orUndefined(Number.getNamedNumberValue(Url.get("base") as Type.NamedNumber)) ??
        config.view?.baseOfLogarithm?.default ??
        10;
    const urlLocked = Url.get("locked");
    if (undefined !== urlLocked)
    {
        setLocked("true" === urlLocked);
    }
    console.log(`View initialized: mode=${data.viewMode}, scale=${data.viewScaleExponent}, base=${data.baseOfLogarithm}`);
};

